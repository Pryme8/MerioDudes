import { Color3 } from "@babylonjs/core/Maths/math.color";
import { VoxelAnimationLoopMode } from "../../../elements/voxelSprite/animations/voxelSpriteAnimation";

const SpriteBaseSize: number = 1/16;
export const Mario = {
	name: "Mario",
    baseSize: SpriteBaseSize,
    zDepth: 0.1,
    frames: [
        {
            name: "Small_Idle",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 5), y: 0, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true                    
        },                
        {
            name: "Small_Run0",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 4), y: 0, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Small_Run1",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 3), y: 0, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Small_Run2",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 2), y: 0, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Small_Skid",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 1), y: 0, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Small_Jump",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 0), y: 0, w: 16, h: 16},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Big_Idle",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 5), y: (26 * 2), w: 16, h: 32, centerY: 0.75},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true                    
        },                
        {
            name: "Big_Run0",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 4), y: (26 * 2), w: 16, h: 32, centerY: 0.75},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Big_Run1",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 3), y: (26 * 2), w: 16, h: 32, centerY: 0.725},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Big_Run2",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 2), y: (26 * 2), w: 16, h: 32, centerY: 0.725},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Big_Skid",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 1), y: (26 * 2), w: 16, h: 32, centerY: 0.75},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: false
        },
        {
            name: "Big_Jump",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 0), y: (26 * 2), w: 16, h: 32, centerY: 0.75},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Flower_Idle",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 30 + (30 * 5), y: (26 * 5) - 8, w: 16, h: 32, centerY: 0.75},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true                    
        },                
        {
            name: "Flower_Run0",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 32 + (30 * 4), y: (26 * 5) - 8, w: 16, h: 32, centerY: 0.75},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Flower_Run1",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 36 + (30 * 3), y: (26 * 5) - 8, w: 16, h: 32, centerY: 0.725},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Flower_Run2",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 42 + (30 * 2), y: (26 * 5) - 8, w: 16, h: 32, centerY: 0.725},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        },
        {
            name: "Flower_Skid",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 22 + (30 * 1), y: (26 * 5) - 8, w: 16, h: 32, centerY: 0.75},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: false
        },
        {
            name: "Flower_Jump",
            atlasUrl: "./assets/marioRef.png",
            frame: {x: 27 + (30 * 0), y: (26 * 5) - 8, w: 16, h: 32, centerY: 0.75},
            discard: new Color3(1, 0, 1),
            tolerance: 1,
            flipX: true
        }
    ],
    animations: [
        {
            name: "Small_Run",
            duration: 0.5,
            mode: VoxelAnimationLoopMode.Loop,
            frames:[ 
                {
                    name:"Small_Run0",
                    duration: (1/3) * 1
                },
                {
                    name:"Small_Run1",
                    duration: (1/3) * 2
                },
                {
                    name:"Small_Run2",
                    duration: 1
                }                        
            ]
        },
        {
            name: "Big_Run",
            duration: 0.5,
            mode: VoxelAnimationLoopMode.Loop,
            frames:[ 
                {
                    name:"Big_Run0",
                    duration: (1/3) * 1
                },
                {
                    name:"Big_Run1",
                    duration: (1/3) * 2
                },
                {
                    name:"Big_Run2",
                    duration: 1
                }                        
            ]
        },
        {
            name: "Flower_Run",
            duration: 0.5,
            mode: VoxelAnimationLoopMode.Loop,
            frames:[ 
                {
                    name:"Flower_Run0",
                    duration: (1/3) * 1
                },
                {
                    name:"Flower_Run1",
                    duration: (1/3) * 2
                },
                {
                    name:"Flower_Run2",
                    duration: 1
                }                        
            ]
        }
    ],
    metadata: {
        size: [1, 1],
        powerUp: 0               
    }
}
