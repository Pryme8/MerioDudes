import { VoxelSprite } from "../../elements";
import { Game } from "../../game";
import { GetScreenUnitsAndRatio } from "../helpers/screenSize";
import { CurrentLevel } from "../level/level";


export const AttachCameraMovement = (player: VoxelSprite) => {
    const camera = Game.Scene.activeCamera
    const updateObs = Game.Scene.onBeforeRenderObservable.add(() => {
        const playerPos = player.root.position  
        const screenData = GetScreenUnitsAndRatio()
        if(playerPos.x > screenData.w * 0.5 && playerPos.x < CurrentLevel.width - (screenData.w * 0.5)){
            camera.position.x = playerPos.x - screenData.w * 0.5
        }
    })    
}