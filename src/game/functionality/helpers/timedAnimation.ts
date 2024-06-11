import { Game } from "../../game"

export const TimedAnimation = (duration: number, onStart?: ()=> void, onStep?: (nTime: number)=> void, onDone?: ()=> void) => {
    let time = 0
    if(onStart) onStart()
    const obs = Game.Scene.onBeforeRenderObservable.add(()=>{
        time += Game.Delta
        if(time >= duration){
            Game.Scene.onBeforeRenderObservable.remove(obs)
            if(onDone) onDone()
        } else {
            if(onStep) onStep(time / duration)
        }
    })
}