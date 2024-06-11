import { Game } from "../../game"

export const WaitForSecondsThen = (seconds: number, then: ()=>void) => {
    let timer = 0
    const obs = Game.Scene.onBeforeRenderObservable.add(()=>{
        timer += Game.Delta
        if(timer >= seconds){
            Game.Scene.onBeforeRenderObservable.remove(obs)
            then()
        }
    })
}

export const ResolveAsAsyncThen = (resolve: ()=>void, then: ()=>void) => {
    new Promise<null>((res)=>{
        resolve()
        res(null)
    }).then(()=>{
        then()
    })
}

export const DoForEachWithDelayThen = (array: any[], delay: number, func: (item: any, index: number)=>void, then: ()=>void) => {
    for(let i = 0; i < array.length; i++){
        setTimeout(()=>{
            func(array[i], i)
        }, delay * i * 1000)
    }
}

export const WaitUntilConditionThen = (condition: ()=>boolean, then: ()=>void) => {
    const obs = Game.Scene.onBeforeRenderObservable.add(()=>{
        if(condition()){
            Game.Scene.onBeforeRenderObservable.remove(obs)
            then()
        }
    })
}