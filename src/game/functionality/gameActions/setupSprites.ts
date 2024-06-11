import { Observable } from "@babylonjs/core/Misc/observable"
import { VoxelSpriteCache } from "../../elements/voxelSprite/cache/voxelSpriteCache"
import { GetAllSprites } from "../sprites"



export const OnAllSpritesLoaded: Observable<null> = new Observable<null>()

export const SetupSprites = () => {
    const prepList = [
        ...GetAllSprites()
    ]
    let waitingOn = prepList.length
    const spriteAddedObs = VoxelSpriteCache.OnSpriteAdded.add((sprite) => {
        waitingOn--
        if(waitingOn == 0){
            VoxelSpriteCache.OnSpriteAdded.remove(spriteAddedObs)
            OnAllSpritesLoaded.notifyObservers(null)
        }
    })
    prepList.forEach(listItem => {
        VoxelSpriteCache.AddSprite(listItem.name, listItem.baseSize, listItem.frames, listItem.animations, listItem.metadata, listItem.zDepth ?? undefined)
    })
}


