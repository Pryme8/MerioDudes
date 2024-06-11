import { Node } from "@babylonjs/core/node"
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
import { VoxelSprite } from "../voxelSprite";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { VoxelSpriteCache } from "../voxelSprite/cache/voxelSpriteCache";
import { Observable } from "@babylonjs/core/Misc/observable";
import { LevelTileColorMap } from "../../functionality/level/level";
import { AreRectanglesTouching, OverlappingRectangles } from "../../functionality";


interface ITileBuffer{
    matrices: Matrix[]
    colors: number[]
}

export class VoxelLevel{

    private _root: TransformNode

    get root(): TransformNode{
        return this._root
    }

    get position(): Vector3{
        return this.root.position
    }

    set position(value: Vector3){
        this.root.position = value
    }
   
    private _staticLayer: VoxelSprite[][] = []
    public get staticLayer(): VoxelSprite[][]{
        return this._staticLayer
    }
    private _staticMesh: Mesh

    private _dynamicLayer: VoxelSprite[] = []
    public get dynamicLayer(): VoxelSprite[]{
        return this._dynamicLayer
    }    

    public get width(): number{
        return this._staticLayer[0].length
    }
    public get height(): number{
        return this._staticLayer.length
    }

    public getIsTileBlocked(x: number, y: number, ignoreEdges: boolean = false): boolean{  
        x = Math.floor(x)
        y = Math.floor(y)  
        if(
            ((x < 0 || x > this._staticLayer[0].length - 1) && !ignoreEdges) ||
            ((this._staticLayer[y] && this._staticLayer[y][x]))            
        ){ 
            return true
        }
        return false
    }

    public getTile(x: number, y: number): VoxelSprite{
        x = Math.floor(x)
        y = Math.floor(y)  
        if(this._staticLayer[y] && this._staticLayer[y][x]){
            return this._staticLayer[y][x]
        }
        return null
    }

    public addDynamicSprite(sprite: VoxelSprite){
        this._dynamicLayer.push(sprite)
        sprite.root.setParent(this.root)
    }

    public removeDynamicSprite(sprite: VoxelSprite){
        const index = this._dynamicLayer.indexOf(sprite)
        if(index !== -1){
            this._dynamicLayer.splice(index, 1)
        }
        sprite.dispose()
    }

    
    constructor(public name: string, public baseSize: number, public scene: Scene){
        this._root = new TransformNode(this.name, this.scene)
        this.onStaticMapParsed = new Observable<null>()
    }   

    public parseStaticMap(map: string[][]){
        this._staticLayer = []
        for(let y = map.length - 1, yI = 0; y >= 0; y--, yI++){
            this._staticLayer.push([])
            for(let x = 0; x < map[0].length; x++){
                if(map[y][x] !== "None"){
                    const tile = VoxelSpriteCache.GetSprite(map[y][x]).clone(`tile_${x}_${yI}`)
                    tile.position = new Vector3(x * this.baseSize, (yI * this.baseSize), 0)
                    tile.root.setParent(this.root)
                    this._staticLayer[yI].push(tile)
                    if(tile.metadata?.onClone){
                        tile.metadata.onClone(tile)
                    }
                }else{
                    this._staticLayer[yI].push(null)
                }
            }
        }
        this.onStaticMapParsed.notifyObservers(null)
    }

    public onStaticMapParsed: Observable<null>
    public parseTemplateToMap(templateName: string){
        const baseUrl = `./assets/levelTemplates/${templateName}`
        const staticUrl = `${baseUrl}/${templateName}_static.png`
        const image = new Image()
        image.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = image.width
            canvas.height = image.height
            const ctx = canvas.getContext("2d")
            ctx.drawImage(image, 0, 0)
            const imageData = ctx.getImageData(0, 0, image.width, image.height)
            const data = imageData.data
            const map: string[][] = []
            for(let y = 0; y < image.height; y++){
                map.push([])
                for(let x = 0; x < image.width; x++){
                    const index = (y * image.width + x) * 4
                    const r = data[index]
                    const g = data[index + 1]
                    const b = data[index + 2]
                    const a = data[index + 3]                
                    map[y].push(LevelTileColorMap.get(`${r},${g},${b}`)) 
                }
            }
            this.parseStaticMap(map)
        }
        image.src = staticUrl
    }   
    
    public removeBlockFromStaticMap(x: number, y: number){
        x = Math.floor(x)
        y = Math.floor(y)  
        const tile = this._staticLayer[y][x]
        tile.dispose()
        this._staticLayer[y][x] = null
    }

    public addBlockToStaticMap(x: number, y: number, blockName: string, parent?: Node){
        x = Math.floor(x)
        y = Math.floor(y)  
        const tile = VoxelSpriteCache.GetSprite(blockName).clone(`tile_${x}_${y}`)   
        tile.parent = parent || this.root
        this._staticLayer[y][x] = tile       
        tile.position = new Vector3(x * this.baseSize, (y * this.baseSize), 0) 
        return tile
    }

    public checkDynamicCollision(sprite: VoxelSprite): VoxelSprite{
        for(let i = 0; i < this._dynamicLayer.length; i++){
            if(this.checkCollision(sprite, this._dynamicLayer[i])){
                return this._dynamicLayer[i]
            }
        }
        return null
    }

    public checkDynamicCollisionWithRect(rect: OverlappingRectangles): VoxelSprite{
        for(let i = 0; i < this._dynamicLayer.length; i++){
            if(this.checkCollisionWithRect(rect, this._dynamicLayer[i])){
                return this._dynamicLayer[i]
            }
        }
        return null
    }

    private checkCollision(a: VoxelSprite, b: VoxelSprite): boolean{
        if(a.metadata.size && b.metadata.size){
            const aAbs = a.absolutePosition
            const bAbs = b.absolutePosition
            const aBox = {
                position: {x:aAbs.x, y:aAbs.y},
                size: {x:a.metadata.size[0], y:a.metadata.size[1]}
            }
            const bBox = {
                position: {x:bAbs.x, y:bAbs.y},
                size: {x:b.metadata.size[0], y:b.metadata.size[1]}
            }
            return AreRectanglesTouching(aBox, bBox)
        }
        return false
    }

    private checkCollisionWithRect(rect: OverlappingRectangles, target: VoxelSprite): boolean{ 
        const tAbs = target.absolutePosition
        const bBox = {
            position: {x:tAbs.x, y:tAbs.y},
            size: {x:target.metadata.size[0], y:target.metadata.size[1]}
        }
        return AreRectanglesTouching(rect, bBox)
    }
    
}

