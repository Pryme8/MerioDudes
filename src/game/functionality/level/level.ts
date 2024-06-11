import { Node } from "@babylonjs/core/node"
import { Observable } from "@babylonjs/core/Misc/observable"
import { VoxelLevel } from "../../elements/voxelLevel/voxelLevel"
import { Game } from "../../game"
import { VoxelSprite } from "../../elements"
import { GameRoot } from "../gameActions/setupGame"

export let CurrentLevel: VoxelLevel = null
export const OnLevelBuildDone: Observable<VoxelLevel> = new Observable<VoxelLevel>()

export enum Tiles{
    NO = "None",
    GB = "GroundBlock",
    GR = "GroundRock",
    PUCL = "PipeUpCapLeft",
    PUCR = "PipeUpCapRight",
    PVL = "PipeVerticalLeft",
    PVR = "PipeVerticalRight",
    MBC = "MysteryBlockCoin",
    MBPU = "MysteryBlockPowerUp",
    MBEL = "MysteryBlockExtraLife",
    MBE = "MysteryBlockEmpty",  
    BB = "BrickBlock"
}

export const LevelTileColorMap = new Map<string, string>(
    [
        ['255,255,255', Tiles.NO],
        [Tiles.NO, '255,255,255'],
        ['1,0,0', Tiles.GR],
        [Tiles.GR, '1,0,0'],
        ['2,0,0', Tiles.GB],
        [Tiles.GB, '2,0,0'],
        ['3,0,0', Tiles.PUCL],
        [Tiles.PUCL, '3,0,0'],
        ['4,0,0', Tiles.PUCR],
        [Tiles.PUCR, '4,0,0'],
        ['5,0,0', Tiles.PVL],
        [Tiles.PVL, '5,0,0'],
        ['6,0,0', Tiles.PVR],
        [Tiles.PVR, '6,0,0'],
        ['7,0,0', Tiles.MBC],
        [Tiles.MBC, '7,0,0'],
        ['8,0,0', Tiles.MBPU],
        [Tiles.MBPU, '8,0,0'],
        ['9,0,0', Tiles.MBEL],
        [Tiles.MBEL, '9,0,0'],
        ['10,0,0', Tiles.BB],
        [Tiles.BB, '10,0,0'],
        ['11,0,0', Tiles.MBE],
        [Tiles.MBE, '11,0,0'],
    ]
)

export const BuildLevel = ()=>{
    const level = new VoxelLevel('level_1_1', 1, Game.Scene)
    level.onStaticMapParsed.addOnce(()=>{
        CurrentLevel = level
        OnLevelBuildDone.notifyObservers(level)
    })

    level.parseTemplateToMap(level.name)

    // const staticMap = [        
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],        
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],        
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],        
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],        
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],        
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],        
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],        
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],        
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],
    //     [Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.GB, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO, Tiles.NO],
    //     [Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB],
    //     [Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB, Tiles.GB]
    // ]

    // level.parseStaticMap(staticMap)    


    // 
}


export const LevelHitTest = (pos: [number, number], ignoreEdges: boolean = false) : boolean =>{
    const level = CurrentLevel
    return level.getIsTileBlocked(pos[0], pos[1], ignoreEdges)
}

export const LevelDynamicHitTest = (target: VoxelSprite) : VoxelSprite =>{
    const level = CurrentLevel
    return level.checkDynamicCollision(target)
}

export const GetStaticBlockAt = (pos: [number, number]) : VoxelSprite =>{
    const level = CurrentLevel
    return level.getTile(pos[0], pos[1])
}

export const RemoveBlockFromStaticMap = (pos: [number, number]) => {
    const level = CurrentLevel
    level.removeBlockFromStaticMap(pos[0], pos[1])
}

export const AddBlockToStaticMap = (pos: [number, number], tile: string): VoxelSprite => {
    const level = CurrentLevel
    const sprite = level.addBlockToStaticMap(pos[0], pos[1], tile, GameRoot)
    return sprite
}

export const AddDynamicSprite = (sprite: VoxelSprite) => {
    const level = CurrentLevel
    level.addDynamicSprite(sprite)
}

export const RemoveDynamicSprite = (sprite: VoxelSprite) => {
    const level = CurrentLevel
    level.removeDynamicSprite(sprite)
}


