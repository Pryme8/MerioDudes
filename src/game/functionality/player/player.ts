import { Scalar } from "@babylonjs/core/Maths/math.scalar"
import { VoxelSprite } from "../../elements"
import { Game } from "../../game"
import { GetStaticBlockAt, LevelDynamicHitTest, LevelHitTest } from "../level"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { TimedAnimation } from "../helpers"
import { Controls, InputNames } from "../controls/controls"

const Fract = (value: number) => {
    return value - Math.floor(value)
}

type HitAnchor = [number, number]
interface IHitAnchors{
    bl: HitAnchor
    br: HitAnchor    
    ml: HitAnchor
    mr: HitAnchor
    tl: HitAnchor
    tr: HitAnchor
}

export const AttachPlayerControls = (player: VoxelSprite) => {
    const BaseSpeed: number = 9
    const BaseAccel: number = 11
    const RunningMultiplier: number = 2.25
    const Decels: [number, number, number] = [0.955, 0.945, 0.99]
    
    const HitAnchors:IHitAnchors = {
        bl: [0.2,   -0.001],
        br: [0.8,   -0.001],
        ml: [0, 0.5],
        mr: [1, 0.5],
        tl: [0.3,   1.001],
        tr: [0.7,   1.001]
    }

    let xSpeed = 0
    let currentRun = 1
    let ySpeed = 0
    let isRunning = false
    let isGrounded = true

    let isJumping = false
    let jumpRelease = true
    let jumpStartingAccel = 150
    let jumpAccel = 0
    let jumpAccelLoss = 850
    let gravity = 30    
    let lastJumpAt = 0
    let jumpCooldown = 0.1

    let walkAnimationStopped = true
    const StopWalkAnimation = () => {
        if(!walkAnimationStopped){
            walkAnimationStopped = true
            player.stopAnimation()  
        }
    }

    const StartWalkAnimation = () => {
        if(walkAnimationStopped){
            walkAnimationStopped = false
            player.playAnimation(`${GetPlayerPowerUpString(player)}_Run`)
        }
    }

    const GetPlayerPowerUpString = (player): string => {
        switch(player.metadata.powerUp){
            case 0:
                return "Small"
            case 1:
                return "Big"
            case 2:
                return "Flower"
        }
    }

    let shootHeldTimer = 0
    let shootHeldThreshold = 0.2

    let speedEpsilon = 0.5

    const Clamp = (value: number, min: number, max: number) => {
        return Math.min(Math.max(value, min), max)
    }

    const PlayerMovementUpdate = (player: VoxelSprite) =>{
        const input = [0, 0]
        
        if(Controls.GetInput(InputNames.Left)){
            input[0] -= 1
        }
        if(Controls.GetInput(InputNames.Right)){
            input[0] += 1
        }
        if(Controls.GetInput(InputNames.Up)){
            input[1] += 1
        }
        if(Controls.GetInput(InputNames.Down)){
            input[1] -= 1
        }

        if(Controls.GetInput(InputNames.Shoot)){
            shootHeldTimer += Game.Delta
            if(shootHeldTimer > shootHeldThreshold){
                isRunning = true
            }
        }else{
            shootHeldTimer = 0
            isRunning = false
        }

        if(Controls.GetInput(InputNames.Up) || Controls.GetInput(InputNames.Jump)){           
            if(isGrounded && jumpRelease){               
                isGrounded = false
                isJumping = true
                jumpRelease = false
                jumpAccel = jumpStartingAccel
                lastJumpAt = Game.Time
            }            
        }else{
            if(isJumping){
                isJumping = false                
            }
            if(!jumpRelease){
                jumpRelease = true
            }
        }

        if(isRunning){
            currentRun = Scalar.Lerp(currentRun, RunningMultiplier, 2 * Game.Delta)
        }else{
            currentRun = Scalar.Lerp(currentRun, 1, 2 * Game.Delta)
        }

        const delta = Game.Delta
        if(isGrounded && ((input[0] > 0 && xSpeed >= -speedEpsilon) || (input[0] < 0 && xSpeed <= speedEpsilon))){
            xSpeed += BaseAccel * currentRun * input[0] * delta 
            xSpeed = Clamp(xSpeed, -BaseSpeed * currentRun, BaseSpeed * currentRun)  
        }else if(!isGrounded){
            xSpeed += BaseAccel * input[0] * delta * 0.5
            xSpeed = Clamp(xSpeed, -BaseSpeed * currentRun, BaseSpeed * currentRun)
        }   

        if(jumpAccel > 0){
            ySpeed += jumpAccel * delta
            jumpAccel -= jumpAccelLoss * delta  
            if(!isJumping){
                jumpAccel -= (jumpAccelLoss * 3) * delta 
            }
            if(jumpAccel < 0){
                jumpAccel = 0
            }
        } 

        if(jumpAccel == 0 && !isGrounded){
            jumpAccel = 0
            ySpeed -= gravity * delta
        }
        
        if(isGrounded){
            ySpeed = 0
            jumpAccel = 0
        }
        
        const nextSpeeds:[number, number] = [xSpeed * delta,  ySpeed * delta ]
        
        const dirRight = (nextSpeeds[0] > 0)

        const sizeUpOffset = (player.metadata.powerUp > 0) ? 0.5 : 0
 
        const forwardRayOrigin = player.position.clone().addInPlaceFromFloats((dirRight) ? HitAnchors.mr[0] : HitAnchors.ml[0], ((dirRight) ? HitAnchors.mr[1] : HitAnchors.ml[1]), 0)
        const forwardRayEnd = forwardRayOrigin.clone().add(new Vector3(nextSpeeds[0], 0, 0))

        const forwardHitTest = LevelHitTest([forwardRayEnd.x, forwardRayEnd.y])
        if(nextSpeeds[0] > 0){
            if(forwardHitTest){
                xSpeed = 0
                player.position.z = Math.floor(player.position.z)
            }
        }else if(nextSpeeds[0] < 0){
            if(forwardHitTest){
                xSpeed = 0
                player.position.z = Math.ceil(player.position.z)
            }
        }

        const downRayOriginR = player.position.clone().addInPlaceFromFloats(HitAnchors.br[0], HitAnchors.br[1], 0)
        const downRayEndR = downRayOriginR.clone().add(new Vector3(0, nextSpeeds[1], 0))
        const downRayOriginL = player.position.clone().addInPlaceFromFloats(HitAnchors.bl[0], HitAnchors.bl[1], 0)
        const downRayEndL = downRayOriginL.clone().add(new Vector3(0, nextSpeeds[1], 0))
      
        if(isGrounded){
            const downHitTestR = LevelHitTest([downRayEndR.x, downRayEndR.y - 0.1])
            const downHitTestL = LevelHitTest([downRayEndL.x, downRayEndL.y - 0.1])            
            if(!downHitTestR && !downHitTestL){                
                isGrounded = false
            } 
        }else{
            if(nextSpeeds[1] > 0){
                const upRayOriginR = player.position.clone().addInPlaceFromFloats(HitAnchors.tr[0], HitAnchors.tr[1] + sizeUpOffset, 0)
                const upRayEndR = upRayOriginR.clone().add(new Vector3(0, nextSpeeds[1], 0))
                const upRayOriginL = player.position.clone().addInPlaceFromFloats(HitAnchors.tl[0], HitAnchors.tl[1] + sizeUpOffset, 0)
                const upRayEndL = upRayOriginL.clone().add(new Vector3(0, nextSpeeds[1], 0))
                const upHitTestR = LevelHitTest([upRayEndR.x, upRayEndR.y])
                const upHitTestL = LevelHitTest([upRayEndL.x, upRayEndL.y])
                
                const bottomForwardRayOrigin = player.position.clone().addInPlaceFromFloats(HitAnchors.br[0], HitAnchors.br[1], 0)
                const bottomForwardRayEnd = bottomForwardRayOrigin.clone().add(new Vector3(nextSpeeds[0], 0, 0))
                const bottomForwardHitTest = LevelHitTest([bottomForwardRayEnd.x, bottomForwardRayEnd.y])

                if(upHitTestR || upHitTestL){
                    ySpeed = 0
                    player.position.z = Math.ceil(player.position.z)  
                    let staticBlock = null       
    
                    if(upHitTestR && upHitTestL){
                        const a = GetStaticBlockAt([upRayEndL.x, upRayEndL.y])
                        const b = GetStaticBlockAt([upRayEndR.x, upRayEndR.y])
                        if(a.name == b.name){
                            staticBlock = a
                        }else{           
                            if(Fract(player.position.x) > 0.5){
                                staticBlock = b
                            }else{
                                staticBlock = a
                            }
                        }
                    }else if(upHitTestR){
                        staticBlock = GetStaticBlockAt([upRayEndR.x, upRayEndR.y])
                    }else{
                        staticBlock = GetStaticBlockAt([upRayEndL.x, upRayEndL.y])
                    }
                 
                    if(staticBlock && staticBlock.metadata?.canHit){                        
                        staticBlock.metadata.onPunch(staticBlock, player)
                    }
                }

                if(bottomForwardHitTest && lastJumpAt + jumpCooldown < Game.Time){
                    xSpeed = 0
                    player.position.z = Math.floor(player.position.z)
                }

            }else if(nextSpeeds[1] < 0){
                const downHitTestR = LevelHitTest([downRayEndR.x, downRayEndR.y])
                const downHitTestL = LevelHitTest([downRayEndL.x, downRayEndL.y])

                const bottomForwardRayOrigin = player.position.clone().addInPlaceFromFloats(HitAnchors.bl[0], HitAnchors.bl[1], 0)
                const bottomForwardRayEnd = bottomForwardRayOrigin.clone().add(new Vector3(nextSpeeds[0], 0, 0))
                const bottomForwardHitTest = LevelHitTest([bottomForwardRayEnd.x, bottomForwardRayEnd.y])

                if(downHitTestR || downHitTestL){    
                    isGrounded = true
                    isJumping = false
                    ySpeed = 0
                    player.position.z = Math.floor(player.position.z)
                }

                if(bottomForwardHitTest){
                    xSpeed = 0
                    player.position.z = Math.ceil(player.position.z)                    
                }
            }
        }

        let doDecelFrame = false
        if(isGrounded && ((input[0] == 0) || (input[0] > 0 && xSpeed <= 0) || (input[0] < 0 && xSpeed >= 0))){
            let decel = Decels[0]
            if(input[0] != 0){
                decel = Decels[1]
                doDecelFrame = true
            }
            xSpeed *= decel
            if(xSpeed < speedEpsilon && xSpeed > -speedEpsilon){
                xSpeed = 0
            }
        }else{
            if(input[0] != 0){
                if(((input[0] == 0) || (input[0] > 0 && xSpeed <= 0) || (input[0] < 0 && xSpeed >= 0))){
                    xSpeed *= Decels[2]
                    if(xSpeed < speedEpsilon && xSpeed > -speedEpsilon){
                        xSpeed = 0
                    }
                }
            }
        }

        player.position.x += xSpeed * delta
        player.position.y += ySpeed * delta

        if(isGrounded){
            if(Fract(player.position.y) > 0.001){
                player.position.y = Scalar.Lerp(player.position.y, Math.round(player.position.y), 50 * delta)
            }else{
                player.position.y = Math.round(player.position.y)
            }            
        }

        if(xSpeed > 0){
            player.rotation.y = (!doDecelFrame)? 0 : Math.PI 
        }else if (xSpeed < 0){        
            player.rotation.y = (doDecelFrame) ? 0 : Math.PI        
        }

        if(isGrounded){
            if(input[0] == 0){
                StopWalkAnimation()
                player.changeFrame(`${GetPlayerPowerUpString(player)}_Idle`) 
            }else{
                if(!doDecelFrame){            
                    const normalizedSpeed = ((Math.abs(xSpeed) / (BaseSpeed)) * 0.65) + 0.35
                    StartWalkAnimation()          
                    player.setCurrentAnimationSpeed(normalizedSpeed)
                }else{
                    StopWalkAnimation()
                    player.changeFrame(`${GetPlayerPowerUpString(player)}_Skid`)                         
                }
            }
        }else{
            StopWalkAnimation()
            player.changeFrame(`${GetPlayerPowerUpString(player)}_Jump`)
        }
    }

    const PlayerDynamicCheck = (player)=>{
        const overlap = LevelDynamicHitTest(player)
        if(overlap){
            if(overlap.metadata?.onPlayerTouch){
                overlap.metadata.onPlayerTouch(overlap, player)
            }
        }
    }

    player.addOnUpdate(()=>{
        PlayerMovementUpdate(player)
        PlayerDynamicCheck(player)
    })
}

export const PlayerSizeUpAnimation = (player) => {
    const currentFrame = player.currentFrame.split("_")[1]
    player.changeFrame("Big_"+currentFrame)
    player.scale = new Vector3(0.5, 0.5, 0.5)

    const py = player.position.y

    const easing = (x)=>{        
        return Math.max((x % 0.13) * (8 * x), Math.pow(x * 0.6, 1.5))
    }

    TimedAnimation(1, 
    ()=>{

    }, 
    (t)=>{
        const s = easing(t)
        player.scale = new Vector3(0.5 + (0.5 * s), 0.5 + (0.5 * s), 0.5 + (0.5 * s))
        player.position.y = py - (0.125 * (1 - s))
    }, 
    ()=>{
        player.position.y = Math.round(player.position.y)
    })
}



