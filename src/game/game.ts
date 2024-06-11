import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera"
import { Engine } from "@babylonjs/core/Engines/engine"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector"
import { Scene } from "@babylonjs/core/scene"
import { SetupGame } from "./functionality/gameActions/setupGame"
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline"


export enum GameStates{
    PreWarm,
    Intro,
    Playing,
    Paused,
    GameOver
}

export class Game{    
    public static Instance: Game
    private _target: HTMLElement
    private _canvas: HTMLCanvasElement
    public get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    private _engine: Engine
    public get engine(): Engine {
        return this._engine
    }

    private _scene: Scene
    public get scene(): Scene {
        return this._scene
    }

    public static get Scene(): Scene{
        return Game.Instance.scene
    }

    public static Delta: number = 0
    public static Time: number = 0

    private _gameState: GameStates = GameStates.PreWarm

    public static get GameState(): GameStates{
        return Game.Instance._gameState
    }

    public static set GameState(state: GameStates){
        Game.Instance._gameState = state
    }

    public static Initialize(){
        new Game()
    }

    constructor(){
        Game.Instance = this
        this._target = document.getElementById("game")
        this._canvas = this._createCanvas()
        this._initializeEngine()
        this.scene.onBeforeRenderObservable.add(()=>{
            Game.Delta = this.engine.getDeltaTime() * 0.001
            Game.Time += Game.Delta
        })        
    }

    private _createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement("canvas")
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        canvas.id = "gameCanvas"        
        this._target.appendChild(canvas)
        return canvas
    }

    private _initializeEngine(){
        const engine = new Engine(this.canvas, true)
        const scene = new Scene(engine)
        globalThis.scene = scene
       
        const camera = new FreeCamera("camera1", new Vector3(0, 0, -20), scene)
        camera.setTarget(Vector3.Zero())
        scene.clearColor =  Color3.FromHexString("#5c95fc").toColor4(1)

        const divFps = document.getElementById("fps") 

        const defaultPipeline = new DefaultRenderingPipeline("default", true, scene, [camera])
        defaultPipeline.samples = 4
        // defaultPipeline.chromaticAberrationEnabled = true
        // defaultPipeline.chromaticAberration.aberrationAmount  = 60.30
        // defaultPipeline.chromaticAberration.radialIntensity = 0.6
        // defaultPipeline.chromaticAberration.direction = new Vector2(0.25, -0.25)
        // defaultPipeline.depthOfFieldEnabled = true
        // defaultPipeline.depthOfField.focalLength = 400
        // defaultPipeline.depthOfField.fStop = 4.8
        // defaultPipeline.depthOfField.focusDistance = 9000
        defaultPipeline.grainEnabled = true
        defaultPipeline.grain.animated = true
        defaultPipeline.grain.intensity = 15.5
        defaultPipeline.sharpenEnabled = true
        defaultPipeline.imageProcessingEnabled = true
        defaultPipeline.imageProcessing.contrast = 1.1
        defaultPipeline.imageProcessing.exposure = 1.5
        defaultPipeline.imageProcessing.toneMappingEnabled = true
        defaultPipeline.imageProcessing.vignetteEnabled = true

        engine.runRenderLoop(() => {
            scene.render()
            divFps.innerHTML = engine.getFps().toFixed() + " fps"
        })

        this._target.addEventListener('resize', ()=>{
            engine.resize()          
        })   
        window.addEventListener('resize', ()=>{
            engine.resize()            
        })  
        
        this._engine = engine
        this._scene = scene
    }
}