import "@babylonjs/core/Debug/debugLayer"; // Augments the scene with the debug methods
import "@babylonjs/inspector"; // Injects a local ES6 version of the inspector to prevent 

import { Game } from "./game/game"
import { Editor } from "./editor/editor";
import { SpriteDebugger } from "./debug";
import { SetupGame } from "./game/functionality/gameActions/setupGame";


class App {
    constructor(){
        const mode = window.location.hash.substring(1) ?? "game"
        switch(mode){
            case "game":
                Game.Initialize()   
                globalThis.scene = Game.Scene
                SetupGame()
                break
            case "editor":
                Editor.Initialize()
                break 
            case "spriteDebugger":
                Game.Initialize()
                SpriteDebugger.Initialize()
                break    
        }      
    }
}
new App()