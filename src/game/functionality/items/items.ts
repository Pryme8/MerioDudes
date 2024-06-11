import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector"
import { VoxelSprite } from "../../elements/voxelSprite/voxelSprite"
import { TimedAnimation } from "../helpers/timedAnimation"
import { AddBlockToStaticMap, AddDynamicSprite, CurrentLevel, LevelHitTest, RemoveBlockFromStaticMap, RemoveDynamicSprite, Tiles } from "../level/level"
import { VoxelSpriteCache } from "../../elements/voxelSprite/cache/voxelSpriteCache"
import { WaitForSecondsThen } from "../helpers"
import { Game } from "../../game"
import { GameRoot } from "../gameActions"

export const AttachBoxBlinkingTint = (sprite: VoxelSprite) => {
    sprite.flashTintColor(new Vector3(1.2, 0.5, 1.2), 1.2, 1, ()=>{
        AttachBoxBlinkingTint(sprite)
    })
}

export const CheckForEntityAboveBlock = (block: VoxelSprite, player: VoxelSprite) => {
    const blockAbs = block.absolutePosition
    const overlap = CurrentLevel.checkDynamicCollisionWithRect({
        position: new Vector2(blockAbs.x, blockAbs.y + 1),
        size: new Vector2(1, 1)
    })
    if(overlap && overlap.metadata.onPlayerHitBlockBelow){
        overlap.metadata.onPlayerHitBlockBelow(overlap, block)
    }
}

export const BlockPunchAnimation = (sprite: VoxelSprite, player: VoxelSprite) => {
    const spritePos: [number, number] = [sprite.position.x, sprite.position.y]
    CheckForEntityAboveBlock(sprite, player)
    if(player.metadata.powerUp > 0){
        return BreakBlockAnimation(sprite, player)
    }
    TimedAnimation(0.3, 
    ()=>{
        sprite.metadata.canHit = false
    }, 
    (t) => {
        //OnStep
        sprite.position.y = spritePos[1] + ((Math.sin(t * Math.PI) * 0.5))
    }, 
    ()=>{
        //OnDone
        sprite.metadata.canHit = true
        sprite.position.y = spritePos[1]
        //RemoveBlockFromStaticMap(spritePos)
    })
}

export const BreakBlockAnimation = (block: VoxelSprite, player: VoxelSprite) => {
    const pos: [number, number] = [block.position.x, block.position.y]
    block.metadata.canHit = false
    RemoveBlockFromStaticMap(pos)
    WaitForSecondsThen( 0, ()=>{ SpawnBrickBreakParticles(block) })
    block.dispose()   
}

export const MysteryBlockPunchAnimation = (sprite: VoxelSprite, player: VoxelSprite) => {
    const spritePos: [number, number] = [sprite.position.x, sprite.position.y]
    let newBlock = null
    TimedAnimation(0.3, 
    ()=>{
        CheckForEntityAboveBlock(sprite, player)
        sprite.metadata.canHit = false
        RemoveBlockFromStaticMap(spritePos)
        newBlock = AddBlockToStaticMap(spritePos, Tiles.MBE)
        if(sprite.metadata?.itemSpawn){
            sprite.metadata.itemSpawn(newBlock, player)
        }       
    }, 
    (t) => {
        //OnStep
        newBlock.position.y = spritePos[1] + ((Math.sin(t * Math.PI) * 0.5))
    }, 
    ()=>{
        //OnDone 
        newBlock.position.y = spritePos[1]
    })
}

export const CoinAppearAnimation = (sprite: VoxelSprite, player: VoxelSprite) => {
    const spriteAbs = sprite.absolutePosition
    const spritePos: [number, number] = [spriteAbs.x - (1/16), spriteAbs.y + 1]
    const coinSprite = VoxelSpriteCache.GetSprite("Coin").clone('coin')
    coinSprite.position.set(spritePos[0], spritePos[1], spriteAbs.z)
    coinSprite.flashTintColor(new Vector3(0.4, 0.8, 0.8), 1.6, 4, ()=>{})
    TimedAnimation(1.6,
    ()=>{},
    (t)=>{
        coinSprite.position.y = spritePos[1] + (((Math.sin(t * Math.PI) * 0.5)) * 3.5) + 0.1
        coinSprite.rotation.y = t * Math.PI * 4
    },
    ()=>{
        PointsAppearAnimation(coinSprite)
        coinSprite.dispose()        
    })
}

export const PointsAppearAnimation = (sprite: VoxelSprite) => {
    const spriteAbs = sprite.absolutePosition
    const spritePos: [number, number] = [spriteAbs.x , spriteAbs.y]
    const pointsSprite = VoxelSpriteCache.GetSprite("Points200").clone('points')
    pointsSprite.position.set(spritePos[0], spritePos[1], spriteAbs.z)
    TimedAnimation(1.2,
    ()=>{},
    (t)=>{
        pointsSprite.position.y = spritePos[1] + (t * 3)
    },
    ()=>{
        pointsSprite.dispose()
    })
}

const BrickParticleCache: VoxelSprite[] = []

export const CacheBrickParticles = ()=>{
    for(let i = 0; i < 40; i++){
        const brickParticle = VoxelSpriteCache.GetSprite("BrickParticle").clone('brickParticle')
        BrickParticleCache.push(brickParticle)
        brickParticle.position.set(-1000, -1000, 0)
    }
}

export const SpawnBrickBreakParticles = (sprite) => {    
    const spriteAbs = sprite.position.clone()
    const particles = BrickParticleCache.splice(0, 4)
    if(particles.length){
        BrickParticleAnimation(
            particles[0],
            [spriteAbs.x, spriteAbs.y],
            9,
            -1
        )
        BrickParticleAnimation(
            particles[1],
            [spriteAbs.x, spriteAbs.y],
            9,
            1
        )
        BrickParticleAnimation(
            particles[2],
            [spriteAbs.x, spriteAbs.y],
            7,
            -1
        )
        BrickParticleAnimation(
            particles[3],
            [spriteAbs.x, spriteAbs.y],
            7,
            1
        )
    }
}

export const BrickParticleAnimation = (sprite: VoxelSprite, pos: [number, number], speedY: number, speedX: number) => {
    sprite.parent = GameRoot
    sprite.position.x = pos[0]
    sprite.position.y = pos[1] - 0.75
    let flip = 0
    sprite.addOnUpdate((self)=>{
        speedY -= 20 * Game.Delta
        sprite.position.y += speedY * Game.Delta
        sprite.position.x += speedX * Game.Delta
        flip += Game.Delta
        if(flip > 0.2){
            flip = 0
            sprite.scale.y *= -1
        }
        if(sprite.position.y < -1){
            sprite.removeOnUpdate() 
            BrickParticleCache.push(sprite)        
        }
    })
    
}
