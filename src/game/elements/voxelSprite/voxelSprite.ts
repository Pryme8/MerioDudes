import { Node, Color3, TransformNode, Vector3, Mesh, Matrix, Observable, Scene, StandardMaterial, Color4, MeshBuilder, Observer } from "@babylonjs/core"
import { CustomMaterial } from "@babylonjs/materials"
import { IVoxelSpriteAnimationProps, VoxelSpriteAnimation } from "./animations/voxelSpriteAnimation"
import { VoxelSpriteCache } from "./cache/voxelSpriteCache"

export interface IVoxelSpriteParseProps{
    name: string
    atlasUrl: string
    frame: IVoxelFrameData
    discard: Color3
    tolerance: number
    flipX?: boolean
}

export interface IVoxelFrameData{
    x: number
    y: number
    w: number
    h: number
    centerX?: number
    centerY?: number
}

export class VoxelSprite{

    public metadata: any = {}

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

    get absolutePosition(): Vector3{
        return this.root.getAbsolutePosition()
    }

    get rotation(): Vector3{
        return this.root.rotation
    }
    set rotation(value: Vector3){
        this.root.rotation = value
    }

    get scale(): Vector3{
        return this.root.scaling
    }
    set scale(value: Vector3){
        this.root.scaling = value
    }

    get parent(): Node{
        return this.root.parent
    }
    set parent(value: Node){
        this.root.parent = value
    }
    public setParent(value: Node){
        this.root.setParent(value)
    }

    public setEnabled(value: boolean){
        this.root.setEnabled(value)
    }

    private _frames: Map<string, Mesh> = new Map<string, Mesh>()
    private _voxelIdxs: Map<string, number> = new Map<string, number>()

    private _matrices: Map<string, Matrix[]> = new Map<string, Matrix[]>()
    public get matrices(): Map<string, Matrix[]>{ return this._matrices }

    private _colors: Map<string, number[]> = new Map<string, number[]>()
    public get colors(): Map<string, number[]> { return this._colors }

    private _isFirstFrame: boolean = true
    private _currentFrame: string
    public get currentFrame(): string { return this._currentFrame }
    private _mat: CustomMaterial

    private _animations: Map<string, VoxelSpriteAnimation> = new Map<string, VoxelSpriteAnimation>()
    private _currentAnimation: string
    public onAnimationDoneObs: Observable<null> = new Observable<null>()

    constructor(public name: string, public baseSize: number, public scene: Scene, public zDepth?: number){
        this._root = new TransformNode(this.name, this.scene)       
    }

    private _parseShape(props: IVoxelSpriteParseProps){
        const target = props.name
        const targetMesh = this._frames.get(target)
        if(props.frame.w > 0 && props.frame.h > 0){
            const tempCanvas = document.createElement("canvas")
            tempCanvas.width = props.frame.w
            tempCanvas.height = props.frame.h
            const ctx = tempCanvas.getContext('2d')
            const atlas = VoxelSpriteCache.GetImageRef(props.atlasUrl)   
            ctx.drawImage(atlas, props.frame.x, props.frame.y, props.frame.w, props.frame.h, 0, 0, props.frame.w, props.frame.h)
            const data = ctx.getImageData(0, 0, props.frame.w, props.frame.h).data   

            const matrices: Matrix[] = []
            const colors = []

            for(let x = 0; x < props.frame.w; x++){
                for(let y = 0; y < props.frame.h; y++){
                    var index = (Math.floor(y) * props.frame.w + Math.floor(x)) * 4
                    const r = data[index]
                    const g = data[index + 1]
                    const b = data[index + 2]
                    const a = data[index + 3]

                    const minR = Math.max((props.discard.r*255) - props.tolerance, 0)
                    const minG = Math.max((props.discard.g*255) - props.tolerance, 0)
                    const minB = Math.max((props.discard.b*255) - props.tolerance, 0)
                    const maxR = Math.min((props.discard.r*255) + props.tolerance, 255)
                    const maxG = Math.min((props.discard.g*255) + props.tolerance, 255)
                    const maxB = Math.min((props.discard.b*255) + props.tolerance, 255)

                    if( ((r >= minR && r <= maxR) &&
                        (g >= minG && g <= maxG) &&
                        (b >= minB && b <= maxB)) ||
                        a == 0
                        ){
                            //discard        
                    }else{                    
                        const color = new Color4(r/255, g/255, b/255, 1)
                        const matrix = Matrix.Translation((x - (((props.frame?.centerX ?? 0.5 ) * props.frame.w) ?? 0)) * this.baseSize * (props.flipX ? -1 : 1), (y - (((props.frame?.centerY ?? 0.5) * props.frame.h) ?? 0)) * -this.baseSize, 0)
                        targetMesh.thinInstanceAdd(matrix) 
                        const voxelIdx = this._voxelIdxs.get(target)
                        targetMesh.thinInstanceSetAttributeAt("color", voxelIdx, [color.r, color.g, color.b, 1.0])                        
                        this._voxelIdxs.set(target, voxelIdx+1) 
                        matrices.push(matrix)
                        colors.push(color.r, color.g, color.b, 1.0)
                    } 
                }
            }
            
            this._matrices.set(target, matrices)
            this._colors.set(target, colors)
        }else{   
            targetMesh.dispose()
        }

        if(this._isFirstFrame){
            this._createMat()
            this._isFirstFrame = false
            this._currentFrame = target
        }else{
            targetMesh.setEnabled(false)
        }
        targetMesh.material = this._mat
    }

    private _createMat(){
        const mat = new CustomMaterial(this.name+".Mat", this.scene)
        mat.AddUniform("invertColors", "float", 0)
        mat.AddUniform("tintColor", "vec3", new Vector3(0, 0, 0))
        mat.Fragment_Custom_Diffuse(`
            if(invertColors > 0.5 ){
                baseColor.rgb = vec3(1.0) - baseColor.rgb;
            }
            baseColor.rgb += tintColor;
        `)
        mat.emissiveColor = new Color3(0.85, 0.85, 0.85) 
        this._mat = mat
    }

    // public setFrameBuffers(frame: string, matrices: Matrix[], colors: number[]){
    //     const frameMesh = this._frames.get(frame)
    //     const originalMatrices = this._matrices.get(frame)
    //     const originalColors = this._colors.get(frame)

    //     for(let i = 0; i < originalMatrices.length; i++){
    //         frameMesh.thinInstanceSetMatrixAt(i, matrices[i], false)
    //     }
    //     for(let i = originalMatrices.length; i < matrices.length - 1; i++){
    //         frameMesh.thinInstanceAdd(matrices[i], false)
    //     }
    //     frameMesh.thinInstanceAdd(matrices[matrices.length - 1], true)
    //     frameMesh.thinInstanceSetAttributeAt("color", 0, colors)

    //     this._matrices.set(frame, matrices)
    //     this._colors.set(frame, colors)
       
    //     this._frames.get(frame).thinInstanceSetAttributeAt("color", 0, colors)
    // }

    public addFrame(props: IVoxelSpriteParseProps){
        if(this._frames.get(props.name)){
            return
        }
        const mesh = MeshBuilder.CreateBox(this.name+"."+name, {width: this.baseSize, height: this.baseSize, depth: (this.zDepth !== undefined) ? this.zDepth : this.baseSize}, this.scene)
        mesh.parent = this._root
        mesh.thinInstanceRegisterAttribute("color", 4)
        this._frames.set(props.name, mesh)
        this._voxelIdxs.set(props.name, 0)
        this._parseShape(props)
    }

    public changeFrame(frameName: string){
        const frame = this._frames.get(frameName)
        if(this._currentFrame != frameName && frame){      
            this._frames.get(this._currentFrame).setEnabled(false)
            frame.setEnabled(true)
            this._currentFrame = frameName
        }
    }

    public addAnimation(props: IVoxelSpriteAnimationProps){
        if(!this._animations.get(props.name)){
            const animation = new VoxelSpriteAnimation(props.name, props.duration, props.mode, props.frames, this)
            this._animations.set(props.name, animation)
        }
    }
    public playAnimation(name: string, startTime: number = 0){
        const animation = this._animations.get(name)
        if(this._currentAnimation != name && animation){
            this._currentAnimation = name
            animation.start(startTime)
        }
    }
    public getCurrentAnimationTime(): number{
        return this._animations.get(this._currentAnimation).time
    }
    public setCurrentAnimationSpeed(speed: number){
        this._animations.get(this._currentAnimation).playbackSpeed = speed
    }
    public stopAnimation(gotoFrame?: string){
        const animation = this._animations.get(this._currentAnimation)
        if(animation){
            animation.stop()
            this._currentAnimation = null
            if(gotoFrame !== undefined){
                this.changeFrame(gotoFrame)
            }
        }
    }

    public clone(name: string): VoxelSprite{
        const sprite = new VoxelSprite(name, this.baseSize, this.scene)
        const frames = Array.from(this._frames, ([name, value]) => ({ name, value }))
        sprite._createMat()
        frames.forEach((frame, index)=>{
            if(index == 0){
                sprite._currentFrame = frame.name
            }
            sprite._frames.set(frame.name, frame.value.clone(frame.name, sprite.root, true, false))
            if(this._frames.get(frame.name).isDisposed()){
                sprite._frames.get(frame.name).dispose()
            }else{
                const oldFrameMats = this._matrices.get(frame.name)  
                const oldFrameColors = this._colors.get(frame.name) 
                const newFrame = sprite._frames.get(frame.name)
                newFrame.material = sprite._mat
                newFrame.thinInstanceAdd(oldFrameMats)
                newFrame.thinInstanceSetAttributeAt("color", 0, oldFrameColors)
            }
        })
        const voxelIdxs = Array.from(this._voxelIdxs, ([name, value]) => ({ name, value }))
        voxelIdxs.forEach(idx =>{
            sprite._voxelIdxs.set(idx.name, idx.value)
        })
        const matrices = Array.from(this._matrices, ([name, value]) => ({ name, value }))
        matrices.forEach(idx =>{
            sprite._matrices.set(idx.name, idx.value)
        })
        const colors = Array.from(this._colors, ([name, value]) => ({ name, value }))
        colors.forEach(idx =>{
            sprite._colors.set(idx.name, idx.value)
        })

        this._animations.forEach(animation=>{
            const _animation = animation.clone(sprite)
            sprite._animations.set(animation.name, _animation)
        })

        sprite.metadata = {...this.metadata}

        return sprite
    }

    private _updateObs: Observer<Scene>
    public addOnUpdate(callback: (self)=> void){
        if(!this._updateObs){
            this._updateObs = this.scene.onBeforeRenderObservable.add(()=>{
                callback(self)
            })
        }
    }
    public removeOnUpdate(){
        if(this._updateObs){
            this.scene.onBeforeRenderObservable.remove(this._updateObs)
            this._updateObs = null
        }
    }

    public dispose(){
        this.removeOnUpdate()
        this.root.dispose()        
    }

    private _flashObs: Observer<Scene> = null
    private _stopFlashObs(onDone?: ()=>void){
        if(this._flashObs){
            
            this._mat.onBindObservable.addOnce(()=>{
                this._mat.getEffect().setColor3("tintColor", Color3.Black())
            })

            this.scene.onBeforeRenderObservable.remove(this._flashObs)
            if(onDone){
                onDone()
            }
        }
    }

    public flashTintColor(color: Vector3, duration: number, speed: number, onDone?: ()=>void){
        this._stopFlashObs()
        const start = performance.now()
        const startColor = Vector3.Zero()
        duration = duration * 1000
        this._flashObs = this.scene.onBeforeRenderObservable.add(()=>{
            const t = (performance.now() - start) / duration
            if(t >= 1){
                this._stopFlashObs(onDone)
                this.metadata.tintColor = startColor
            }else{                
                const r = startColor.x + (color.x - startColor.x) * Math.sin(t * Math.PI * speed)
                const g = startColor.y + (color.y - startColor.y) * Math.sin(t * Math.PI * speed)
                const b = startColor.z + (color.z - startColor.z) * Math.sin(t * Math.PI * speed)
                this.metadata.tintColor = new Vector3(r, g, b)
                this._mat.onBindObservable.addOnce(()=>{
                    this._mat.getEffect().setVector3("tintColor", this.metadata.tintColor)
                })                
            }
        })
    }    
}