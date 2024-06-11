import { CreatePlane, SpriteManager } from "@babylonjs/core";
import { GetAllSprites, SetupSprites, OnAllSpritesLoaded } from "../game/functionality"
import { VoxelSpriteCache } from "../game/elements/voxelSprite/cache/voxelSpriteCache";
import { Game } from "../game/game";
import { Controls, InputNames } from "../game/functionality/controls/controls";

export class SpriteDebugger{
    public static Instance: SpriteDebugger

    public static Initialize(){
        SpriteDebugger.Instance = new SpriteDebugger()
    }

    constructor(){
        SpriteDebugger.Instance = this
 
        OnAllSpritesLoaded.addOnce(()=>{
            let x = 0
            let y = 0
            const spriteList = GetAllSprites()
            for(let i = 0; i < spriteList.length; i++){
                const baseline = CreatePlane("Baseline", {size:1}, Game.Scene)
                baseline.position.y = 0.5
                baseline.position.x = 0.5
                baseline.bakeCurrentTransformIntoVertices()
                baseline.position.y = y-1.5
                baseline.position.x = -0.5
                const sprite = spriteList[i]
                const voxelSprite = VoxelSpriteCache.GetSprite(sprite.name).clone(sprite.name)
                voxelSprite.position.x = x
                voxelSprite.position.y = y
                x += 1.5
                baseline.scaling.x += 1.5

                for(let j = 0; j < sprite.frames.length; j++){
                    const frame = sprite.frames[j]
                    const voxelSpriteAnimated = VoxelSpriteCache.GetSprite(sprite.name).clone(sprite.name + ":Frame" + frame.name)
                    voxelSpriteAnimated.changeFrame(frame.name)
                    voxelSpriteAnimated.position.x = x
                    voxelSpriteAnimated.position.y = y
                    x += 1.5
                    baseline.scaling.x += 1.5
                }

                for(let j = 0; j < sprite.animations.length; j++){
                    const animation = sprite.animations[j]
                    const voxelSpriteAnimated = VoxelSpriteCache.GetSprite(sprite.name).clone(sprite.name + ":" + animation)
                    voxelSpriteAnimated.playAnimation(animation.name)
                    voxelSpriteAnimated.position.x = x
                    voxelSpriteAnimated.position.y = y
                    x += 1.5
                    baseline.scaling.x += 1.5
                }
                y += 2.5
                x = 0
            }
        })
        SetupSprites();
        Controls.Initialize(Game.Scene);
        let x = 0
        let y = 0
        const updateObs = Game.Scene.onBeforeRenderObservable.add(()=>{
            Game.Scene.activeCamera.position.x = x
            Game.Scene.activeCamera.position.y = y
            if(Controls.GetInput(InputNames.Left)){
                x -= 0.1
            }
            if(Controls.GetInput(InputNames.Right)){
                x += 0.1
            }
            if(Controls.GetInput(InputNames.Up)){
                y += 0.1
            }
            if(Controls.GetInput(InputNames.Down)){
                y -= 0.1
            }            
        })

        fetch("http://localhost:3000").then(async (response) => {
            console.log(await response.text())
        })
    }
} 