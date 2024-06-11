import { Color3 } from "@babylonjs/core/Maths/math.color";
import { VoxelSprite } from "../../../elements/voxelSprite/voxelSprite";
import { BlockPunchAnimation } from "../../items/items";

const SpriteBaseSize: number = 1/16;
export const GroundBlock = {
    name : "GroundBlock",
    baseSize: SpriteBaseSize,
    zDepth: 0.25,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/marioTiles.webp",
            frame: {x: (17 * 11), y: (17 * 3), w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}

export const GroundRock = {
    name : "GroundRock",
    baseSize: SpriteBaseSize,
    zDepth: 0.25,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/marioTiles.webp",
            frame: {x: (17 * 1), y: (17 * 0), w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}

export const BrickBlock = {
    name : "BrickBlock",
    baseSize: SpriteBaseSize,
    zDepth: 0.25,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/marioTiles.webp",
            frame: {x: (17 * 6), y: (17 * 0), w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {
        canHit : true,
        onPunch : (self: VoxelSprite, player: VoxelSprite)=>{
            BlockPunchAnimation(self, player)
        }
    }
}

export const BrickParticle = {
    name : "BrickParticle",
    baseSize: SpriteBaseSize,
    zDepth: 0.25,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/brickParticle.png",
            frame: {x: 0, y: 0, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}

