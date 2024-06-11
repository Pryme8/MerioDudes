import { Observable, Scene } from "@babylonjs/core"
import { IVoxelSpriteParseProps, VoxelSprite } from "../voxelSprite"
import { IVoxelSpriteAnimationProps } from "../animations/voxelSpriteAnimation"
import { Game } from "../../../game"


export class VoxelSpriteCache{
    public static OnSpriteAdded: Observable<VoxelSprite> = new Observable<VoxelSprite>()
    
    private static _ImageRefs: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>()
    public static GetImageRef(url: string): HTMLImageElement{
        return VoxelSpriteCache._ImageRefs.get(url)
    }
   
    private static _Sprites: Map<string, VoxelSprite> = new Map<string, VoxelSprite>()
    public static GetSprite(name: string): VoxelSprite{
        return VoxelSpriteCache._Sprites.get(name)
    }
    public static GetSprites(): VoxelSprite[]{
        return Array.from(VoxelSpriteCache._Sprites.values())
    }
    
    public static AddSprite(name: string, baseSize: number, frames: IVoxelSpriteParseProps[], animations:IVoxelSpriteAnimationProps[], metadata: any = {},  zDepth?: number){
        
        const parseFrames = ()=>{
            const scene: Scene = Game.Scene

            const sprite = new VoxelSprite(name, baseSize, scene, zDepth)
            frames.forEach(frame => {
                sprite.addFrame(frame)
            })
            animations.forEach(animation => {
                sprite.addAnimation(animation)
            })
            sprite.metadata = { ...metadata }
            sprite.setEnabled(false)
            VoxelSpriteCache._Sprites.set(name, sprite)
            VoxelSpriteCache.OnSpriteAdded.notifyObservers(sprite)
        }


        let waitingOn = frames.length
        let list = frames.map(frame => {return frame.atlasUrl})

        const checkAllAtlasLoaded = ()=>{
            waitingOn--
            if(waitingOn == 0){
                parseFrames()
            }
        }
        
        list.forEach((atlasUrl)=>{
            let image = VoxelSpriteCache._ImageRefs.get(atlasUrl)
            if(!image){
                image = new Image()
                image.onload = ()=>{
                    VoxelSpriteCache._ImageRefs.set(atlasUrl, image)
                    checkAllAtlasLoaded()
                }
                image.src = atlasUrl
                image.crossOrigin = "unknown"
            }else{
                checkAllAtlasLoaded()
            }
        })


        // const scene: Scene = Game.Scene

        // const _atlasOnLoad = (image: HTMLImageElement) => {
        //     const sprite = new VoxelSprite(name, baseSize, scene)
        //     frames.forEach(frame => {
        //         sprite.addFrame(frame)
        //     })
            
        //     VoxelSpriteCache._Sprites.set(name, sprite)
        //     VoxelSpriteCache.OnSpriteAdded.notifyObservers(sprite)
        // }
        
        // let image = VoxelSpriteCache._ImageRefs.get(atlasUrl)
        // if(!image){
        //     image = new Image()
        //     image.onload = ()=>{
        //         VoxelSpriteCache._ImageRefs.set(atlasUrl, image)
        //         _atlasOnLoad(image)
        //     }
        //     image.src = atlasUrl            
        // }else{
        //     _atlasOnLoad(image)
        // }
    }
}