import { Color3 } from "@babylonjs/core/Maths/math.color";
import { PowerUpMushroomGrabbed } from "../../items/powerups/mushroom";
import { VoxelSprite } from "../../../elements/voxelSprite/voxelSprite";
import { PowerUpFlowerGrabbed } from "../../items/powerups/flower";
import { VoxelAnimationLoopMode } from "../../../elements/voxelSprite/animations/voxelSpriteAnimation";

const SpriteBaseSize: number = 1/16;
export const Coin = {
    name : "Coin",
    baseSize: SpriteBaseSize,
    zDepth: 0.1,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/marioTiles.webp",
            frame: {x: (17 * 5), y: (17 * 5), w: 16, h: 16, centerX: 0.5 - (1/16)},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}

export const PowerUpMushroom = {
    name : "PowerUpMushroom",
    baseSize: SpriteBaseSize,
    zDepth: 0.1,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 6) + 4, y: (30 * 1)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {
        size: [1, 1],
        ySpeed: 0,
        maxYSpeed: -0.1,
        isGrounded: true,
        bumpDelay: 0,
        onPlayerTouch : (self: VoxelSprite, player: VoxelSprite)=>{
            PowerUpMushroomGrabbed(self, player)
        },
        onPlayerHitBlockBelow: (self: VoxelSprite, player: VoxelSprite)=>{
            self.metadata.ySpeed = 0.135
            self.metadata.isGrounded = false
            self.metadata.bumpDelay = 0.1
            if(
                player.position.x >= self.position.x && self.metadata.lastDirection == 1 ||
                player.position.x < self.position.x && self.metadata.lastDirection == -1
            ){
                self.metadata.lastDirection *= -1
            }
        }
    }
}

export const PowerUpFlower = {
    name : "PowerUpFlower",
    baseSize: SpriteBaseSize,
    zDepth: 0.1,
    frames: [
        {
            name: "Default0",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 0) + 4, y: (30 * 2)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        },
        {
            name: "Default1",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 1) + 4, y: (30 * 2)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        },
        {
            name: "Default2",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 2) + 4, y: (30 * 2)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        },
        {
            name: "Default3",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 3) + 4, y: (30 * 2)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        },
        {
            name: "Alt0",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 4) + 4, y: (30 * 2)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        },
        {
            name: "Alt1",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 5) + 4, y: (30 * 2)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        },
        {
            name: "Alt2",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 6) + 4, y: (30 * 2)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        },
        {
            name: "Alt3",
            atlasUrl: "./assets/smb_items_sheet.png",
            frame: {x: (30 * 7) + 4, y: (30 * 2)  + 4, w: 16, h: 16},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        }
    ],
    animations: [
        {
            name: "Default",
            duration: 1.2,
            mode: VoxelAnimationLoopMode.Loop,
            frames:[
                {
                    name:"Default0",
                    duration: 0.25
                },
                {
                    name:"Default1",
                    duration: 0.5
                },
                {
                    name:"Default2",
                    duration: 0.75
                },
                {
                    name:"Default3",
                    duration: 1
                }
            ] 
        },
        {
            name: "Alt",
            duration: 1.2,
            mode: VoxelAnimationLoopMode.Loop,
            frames:[
                {
                    name:"Alt0",
                    duration: 0.25
                },
                {
                    name:"Alt1",
                    duration: 0.5
                },
                {
                    name:"Alt2",
                    duration: 0.75
                },
                {
                    name:"Alt3",
                    duration: 1
                }
            ] 
        }
    ],
    metadata: {
        size: [1, 1],
        onPlayerTouch : (self: VoxelSprite, player: VoxelSprite)=>{
            PowerUpFlowerGrabbed(self, player)
        },
    }
}

export const Points200 = {
    name : "Points200",
    baseSize: SpriteBaseSize,
    zDepth: 0.1,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/pointSprites.png",
            frame: {x: (18 * 0), y: (8 * 0) + 1, w: 16, h: 8},
            discard: new Color3(1, 0, 1),                                      
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}