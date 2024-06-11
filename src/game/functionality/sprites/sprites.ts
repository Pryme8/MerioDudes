import { BrickBlock, BrickParticle, GroundBlock, GroundRock } from "./kinds/standardBlocks"
import { Mario } from "./kinds/mario"
import { PipeUpCapLeft, PipeUpCapRight, PipeVerticalLeft, PipeVerticalRight } from "./kinds/pipes"
import { MysteryBlockCoin, MysteryBlockEmpty, MysteryBlockPowerUp } from "./kinds/itemBlocks"
import { Coin, Points200, PowerUpFlower, PowerUpMushroom } from "./kinds/items"


export const GetAllSprites = () => {
    return [
        Mario,
        GroundRock,
        GroundBlock,
        BrickBlock,
        BrickParticle,
        PipeUpCapLeft,
        PipeUpCapRight,
        PipeVerticalLeft,
        PipeVerticalRight,
        MysteryBlockCoin,
        MysteryBlockPowerUp,
        MysteryBlockEmpty,
        Coin,
        PowerUpMushroom,
        PowerUpFlower,      
        Points200  
    ]
}