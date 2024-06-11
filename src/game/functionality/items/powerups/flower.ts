import { VoxelSpriteCache } from "../../../elements/voxelSprite/cache/voxelSpriteCache"
import { VoxelSprite } from "../../../elements/voxelSprite/voxelSprite"
import { TimedAnimation } from "../../helpers/timedAnimation"
import { WaitForSecondsThen } from "../../helpers/timingActions"
import { AddDynamicSprite, RemoveDynamicSprite } from "../../level/level"

import { PlayerSizeUpAnimation } from "../../player/player"

export const FlowerAppearAnimation = (sprite: VoxelSprite, player: VoxelSprite) => {
    const spritePos: [number, number] = [sprite.position.x, sprite.position.y ]
    const flower = VoxelSpriteCache.GetSprite("PowerUpFlower").clone('flower')
    AddDynamicSprite(flower)
    flower.position.set(spritePos[0], spritePos[1], sprite.position.z)
    flower.setEnabled(false)    
    WaitForSecondsThen(0.3, ()=>{
        TimedAnimation(0.6,
        ()=>{
            flower.setEnabled(true)
        },
        (t)=>{
            flower.position.y = Math.floor(spritePos[1]) + ( t )
        },
        ()=>{
            flower.position.y = Math.round(flower.position.y)
        })
    })
}

export const PowerUpFlowerGrabbed = (flower: VoxelSprite, player: VoxelSprite) => {
    RemoveDynamicSprite(flower);
    if(player.metadata.powerUp === 1){
        player.metadata.powerUp = 2
    }else if(player.metadata.powerUp === 0){
        player.metadata.powerUp = 1
        PlayerSizeUpAnimation(player)
    }  
    console.log("Flower Grabbed", player.metadata.powerUp)
}