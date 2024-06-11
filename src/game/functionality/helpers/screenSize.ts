import { Game } from "../../game";

export const GetScreenUnitsAndRatio = (): {w: number, h: number, r: number} => {
    const c = Game.Scene.activeCamera
    const engine = Game.Scene.getEngine()
    const fov = c.fov;
    const aspectRatio = engine.getAspectRatio(c)
    const d = Math.abs(c.position.z)
    const y = 2 * d * Math.tan(fov / 2)
    const x = y * aspectRatio
    return {w: x, h: y, r: aspectRatio}
}