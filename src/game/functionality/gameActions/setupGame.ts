import { Observable } from "@babylonjs/core/Misc/observable"
import { OnAllSpritesLoaded, SetupSprites } from "./setupSprites"
import { VoxelSpriteCache } from "../../elements/voxelSprite/cache/voxelSpriteCache"
import { Game } from "../../game"
import { AttachPlayerControls } from "../player/player"
import { Controls } from "../controls/controls"
import { GetScreenUnitsAndRatio } from "../helpers/screenSize"
import { TransformNode } from "@babylonjs/core/Meshes/transformNode"
import { AddDynamicSprite, BuildLevel, CurrentLevel, OnLevelBuildDone } from "../level"
import { WaitForSecondsThen } from "../helpers"
import { AttachCameraMovement } from "../camera/camera"
import { CacheBrickParticles } from "../items/items"


export const OnGameSetupDone: Observable<null> = new Observable<null>()

export let GameRoot: TransformNode

export const SetupGame = () => {    
    OnGameSetupDone.addOnce(()=>{
        const player = VoxelSpriteCache.GetSprite("Mario").clone("Player") 
        player.position.y = CurrentLevel.baseSize * 2
        
        const screenData = GetScreenUnitsAndRatio()
        const offsetX = screenData.w * 0.5
        const offsetY = screenData.h * 0.5

        const gameRoot = new TransformNode("GameRoot", Game.Scene)
        GameRoot = gameRoot
        player.root.setParent(gameRoot)
        CurrentLevel.root.setParent(gameRoot)
        gameRoot.position.x = (-offsetX) + (CurrentLevel.baseSize * 0.5)
        gameRoot.position.y = (-offsetY) + (CurrentLevel.baseSize * 0.5) 

        WaitForSecondsThen(1, ()=>{
            AttachPlayerControls(player)
            AttachCameraMovement(player)
            // const testShroom = VoxelSpriteCache.GetSprite("PowerUpMushroom").clone("TestShroom")
            // AddDynamicSprite(testShroom)
            // testShroom.position.y = 6
            // testShroom.position.x = 17
            const testFlower = VoxelSpriteCache.GetSprite("PowerUpFlower").clone("TestFlower")
            AddDynamicSprite(testFlower)
            testFlower.position.y = 6
            testFlower.position.x = 17
        }) 

    })

    OnAllSpritesLoaded.addOnce(()=>{
        Controls.Initialize(Game.Scene) 
        CacheBrickParticles()  
        BuildLevel()
    })

    OnLevelBuildDone.addOnce(()=>{
        OnGameSetupDone.notifyObservers(null)
    })

    SetupSprites()
}
