import { Color3 } from "@babylonjs/core/Maths/math.color";
import { VoxelAnimationLoopMode } from "../../../elements/voxelSprite/animations/voxelSpriteAnimation";
import { CoinAppearAnimation, MysteryBlockPunchAnimation } from "../../items/items";
import { VoxelSprite } from "../../../elements/voxelSprite/voxelSprite";
import { MushroomAppearAnimation } from "../../items/powerups/mushroom";
import { FlowerAppearAnimation } from "../../items/powerups/flower";

const SpriteBaseSize: number = 1/16;
export const MysteryBlockCoin = {
    name : "MysteryBlockCoin",
    baseSize: SpriteBaseSize,
    zDepth: 0.25,
    frames: [
        {
            name: "Default0",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 0) + 4, y: (30 * 0)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        },
        {
            name: "Default1",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 1) + 4, y: (30 * 0)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        },
        {
            name: "Default2",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 2) + 4, y: (30 * 0)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [
        {
            name: "Blink",
            duration: 1.2,
            mode: VoxelAnimationLoopMode.Loop,
            frames:[
                {
                    name:"Default0",
                    duration: 1/3
                },
                {
                    name:"Default1",
                    duration: 2/3
                },
                {
                    name:"Default2",
                    duration: 1
                }
            ] 
        }
    ],
    metadata: {
        canHit : true,
        onPunch : (self: VoxelSprite, player: VoxelSprite)=>{
            MysteryBlockPunchAnimation(self, player)
        },
        itemSpawn: (self, player: VoxelSprite) => {
            CoinAppearAnimation(self, player)
        },
        onClone : (self: VoxelSprite)=>{
            self.playAnimation("Blink")
        }
    }
}

export const MysteryBlockPowerUp = {
    name : "MysteryBlockPowerUp",
    baseSize: SpriteBaseSize,
    zDepth: 0.25,
    frames: [
        {
            name: "Default0",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 0) + 4, y: (30 * 0)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        },
        {
            name: "Default1",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 1) + 4, y: (30 * 0)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        },
        {
            name: "Default2",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 2) + 4, y: (30 * 0)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [
        {
            name: "Blink",
            duration: 1.2,
            mode: VoxelAnimationLoopMode.Loop,
            frames:[
                {
                    name:"Default0",
                    duration: 1/3
                },
                {
                    name:"Default1",
                    duration: 2/3
                },
                {
                    name:"Default2",
                    duration: 1
                }
            ] 
        }
    ],
    metadata: {
        canHit : true,
        onPunch : (self: VoxelSprite, player: VoxelSprite)=>{
            MysteryBlockPunchAnimation(self, player)
        },
        itemSpawn: (self, player: VoxelSprite) => {
            //TODO Add More PowerUps...
            switch(player.metadata.powerUp){
                case 0:
                return  MushroomAppearAnimation(self, player)
                case 1:
                case 2:
                return  FlowerAppearAnimation(self, player)
            }
           
        },
        onClone : (self: VoxelSprite)=>{
            self.playAnimation("Blink")
        }
    }
}

export const MysteryBlockEmpty = {
    name : "MysteryBlockEmpty",
    baseSize: SpriteBaseSize,
    zDepth: 0.25,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/marioTiles.webp",
            frame: {x: (17 * 2), y: (17 * 5), w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}