import { Color3 } from "@babylonjs/core/Maths/math.color";

const SpriteBaseSize: number = 1/16;
export const PipeUpCapLeft = {
    name : "PipeUpCapLeft",
    baseSize: SpriteBaseSize,
    zDepth: 0.2,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/marioTiles.webp",
            frame: {x: (17 * 15), y: (17 * 0), w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}

export const PipeUpCapRight = {
    name : "PipeUpCapRight",
    baseSize: SpriteBaseSize,
    zDepth: 0.2,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/marioTiles.webp",
            frame: {x: (17 * 16), y: (17 * 0), w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}

export const PipeVerticalLeft = {
    name : "PipeVerticalLeft",
    baseSize: SpriteBaseSize,
    zDepth: 0.2,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/marioTiles.webp",
            frame: {x: (17 * 15), y: (17 * 1), w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}

export const PipeVerticalRight = {
    name : "PipeVerticalRight",
    baseSize: SpriteBaseSize,
    zDepth: 0.2,
    frames: [
        {
            name: "Default",
            atlasUrl: "./assets/marioTiles.webp",
            frame: {x: (17 * 16), y: (17 * 1), w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1
        }
    ],
    animations: [],
    metadata: {}
}
