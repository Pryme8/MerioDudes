import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { VoxelSpriteCache } from "../../../elements/voxelSprite/cache/voxelSpriteCache"
import { VoxelSprite } from "../../../elements/voxelSprite/voxelSprite"
import { TimedAnimation } from "../../helpers/timedAnimation"
import { WaitForSecondsThen } from "../../helpers/timingActions"
import { AddDynamicSprite, CurrentLevel, LevelHitTest, RemoveDynamicSprite } from "../../level/level"
import { Game } from "../../../game"
import { PlayerSizeUpAnimation } from "../../player/player"

export const MushroomAppearAnimation = (sprite: VoxelSprite, player: VoxelSprite) => {
    const spritePos: [number, number] = [sprite.position.x, sprite.position.y ]
    const mushroom = VoxelSpriteCache.GetSprite("PowerUpMushroom").clone('mushroom')
    AddDynamicSprite(mushroom)
    mushroom.position.set(spritePos[0], spritePos[1], sprite.position.z)
    mushroom.setEnabled(false)    
    WaitForSecondsThen(0.3, ()=>{
        TimedAnimation(0.6,
        ()=>{
            mushroom.setEnabled(true)
        },
        (t)=>{
            mushroom.position.y = Math.floor(spritePos[1]) + ( t )
        },
        ()=>{
            //Attach Mushroom Behavior
            mushroom.position.y = Math.round(mushroom.position.y)
            AttachMushroomBehavior(mushroom, player)
        })
    })
}

export const AttachMushroomBehavior = (mushroom: VoxelSprite, player: VoxelSprite) => {
    mushroom.metadata.lastDirection = player.rotation.y != 0 ? -1 : 1  
    mushroom.metadata.isGrounded = true
    const mushroomSpeed = 4
    mushroom.addOnUpdate((self)=>{
        const speed = mushroomSpeed * mushroom.metadata.lastDirection * Game.Delta
        const anchorOffset = mushroom.metadata.lastDirection == 1 ? 1 : 0
        const altOffset = mushroom.metadata.lastDirection == 1 ? 0 : 1

        const forwardRay0 = mushroom.position.clone().addInPlaceFromFloats(anchorOffset, 0, 0)
        const forwardRay1 = mushroom.position.clone().addInPlaceFromFloats(anchorOffset, 1, 0)
        const forwardRayEnd0 = forwardRay0.clone().add(new Vector3(speed, 0, 0))
        const forwardRayEnd1 = forwardRay1.clone().add(new Vector3(speed, 0, 0))
        const backRay = mushroom.position.clone().addInPlaceFromFloats(altOffset, 0, 0)
        const backRayEnd = backRay.clone().add(new Vector3(0, -0.1, 0))

        const fHit0 = LevelHitTest([forwardRayEnd0.x, forwardRayEnd0.y], true)
        const fHit1 = LevelHitTest([forwardRayEnd1.x, forwardRayEnd1.y], true)
        const backRayDownHit = LevelHitTest([backRayEnd.x, backRayEnd.y], true) 
        const forwardRayDownHit = LevelHitTest([forwardRay0.x , forwardRay0.y - 0.1], true)
        
        if(fHit0 || fHit1){
            mushroom.metadata.lastDirection *= -1
            if(mushroom.metadata.lastDirection == -1){
                mushroom.position.x = Math.ceil(mushroom.position.x)
            }else{
                mushroom.position.x = Math.floor(mushroom.position.x)
            }            
        }else{
            mushroom.position.x += speed
        }

        if(backRayDownHit || forwardRayDownHit){    
            if( mushroom.metadata.bumpDelay == 0){
                mushroom.metadata.isGrounded = true
            }          
        }else{
            mushroom.metadata.isGrounded = false
        }
                 
        if(mushroom.metadata.bumpDelay > 0){
                 mushroom.metadata.bumpDelay -= Game.Delta       
        }else{ 
            mushroom.metadata.bumpDelay = 0 
        }

        if(mushroom.metadata.isGrounded){
            mushroom.position.y = Math.floor(mushroom.position.y) 
            mushroom.metadata.ySpeed = 0 
        }else{
            mushroom.metadata.ySpeed -= 0.65 * Game.Delta
            mushroom.metadata.ySpeed = Math.max(mushroom.metadata.ySpeed, mushroom.metadata.maxYSpeed)
        }
 
        mushroom.position.y += mushroom.metadata.ySpeed

        if( mushroom.position.y < -1 ||
            mushroom.position.x < -1 ||
            mushroom.position.x > CurrentLevel.width + 1            
        ){
            RemoveDynamicSprite(mushroom)
        }
    })
}

export const PowerUpMushroomGrabbed = (mushroom: VoxelSprite, player: VoxelSprite) => {
    RemoveDynamicSprite(mushroom)
    if(player.metadata.powerUp === 0){
        player.metadata.powerUp = 1
        PlayerSizeUpAnimation(player)
    }
}