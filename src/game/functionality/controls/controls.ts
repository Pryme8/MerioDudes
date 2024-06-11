import { KeyboardInfo } from "@babylonjs/core/Events/keyboardEvents"
import { Observer } from "@babylonjs/core/Misc/observable"
import { Scene } from "@babylonjs/core/scene"

export enum InputNames{
    Up,
    Down,
    Left,
    Right,
    Jump,
    Shoot
}

export class Controls{
    public static Instance: Controls
    private _keyMap: Map<string, number> = new Map<string, number>([
        ["KeyW", InputNames.Up],
        ["ArrowUp", InputNames.Up],
        ["KeyS", InputNames.Down],
        ["ArrowDown", InputNames.Down],
        ["KeyA", InputNames.Left],
        ["ArrowLeft", InputNames.Left],
        ["KeyD", InputNames.Right],
        ["ArrowRight", InputNames.Right],
        ["KeyK", InputNames.Jump],
        ["Space", InputNames.Jump],
        ["KeyJ", InputNames.Shoot],
        ["ShiftLeft", InputNames.Shoot]
    ])
    private _inputMap: Map<number, boolean> = new Map<number, boolean>([
        [InputNames.Up, false],
        [InputNames.Down, false],
        [InputNames.Left, false],
        [InputNames.Right, false],
        [InputNames.Jump, false],
        [InputNames.Shoot, false]
    ])
    public get inputMap(): Map<number, boolean>{
        return this._inputMap
    }
    public static get InputMap(): Map<number, boolean>{
        return Controls.Instance.inputMap
    }

    public static GetInput(inputName: InputNames): boolean{
        return Controls.Instance.inputMap.get(inputName)
    }

    private _inputObs: Observer<KeyboardInfo>
    private _enabled: boolean = true
    public get isEnabled():boolean{
        return this._enabled 
    }

    public static get IsEnabled(): boolean{
        return Controls.Instance.isEnabled
    }
    public static set IsEnabled(enabled: boolean){
        Controls.Instance.isEnabled = enabled
    }

    public set isEnabled(enabled: boolean){
        this._enabled = enabled
        if(!enabled){
            this._inputMap.forEach((value, key)=>{
                this._inputMap.set(key, false)
            })
        }
    }

    public static Initialize(scene: Scene){
        new Controls(scene)
    }

    constructor(private _scene: Scene){
        Controls.Instance = this
        this._inputObs = _scene.onKeyboardObservable.add((eventData: KeyboardInfo)=>{
            if(this.isEnabled){
                if(this._keyMap.has(eventData.event.code)){
                    if(eventData.type == 1){
                        this._inputMap.set(this._keyMap.get(eventData.event.code), true)
                    }else{
                        this._inputMap.set(this._keyMap.get(eventData.event.code), false)
                    }
                }
            }
        })
    }
}