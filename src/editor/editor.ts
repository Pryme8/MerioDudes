import { LevelTileColorMap, Tiles } from "../game/functionality/level/level"


const VisualColorMap = new Map<string, string>(
    [
        [Tiles.NO, '255,255,255'],
        [Tiles.GR, '255,0,0'],
        [Tiles.GB, '255,120,0'],
        [Tiles.PUCL, '120,255,0'],
        [Tiles.PUCR, '0,255,120'],
        [Tiles.PVL, '190,255,0'],
        [Tiles.PVR, '0,255,190'],
        [Tiles.MBC, '255,0,255'],
        [Tiles.MBPU, '120,120,255'],
        [Tiles.MBEL, '255,120,120'],
        [Tiles.BB, '255,200,0'],
    ]
)

const GetStringAsVisualColor = (color: string): string => {
    return VisualColorMap.get(LevelTileColorMap.get(color))
}

export class Editor{
    public static Instance: Editor    

    private _size: [number, number] = [0, 0]
    private _staticCanvas: HTMLCanvasElement
    private _staticCtx: CanvasRenderingContext2D
    private _staticData: string[][] = []
    private _firstGeneration: boolean = true

    private _currentTile: string

    public static Initialize(){
        Editor.Instance = new Editor()
    }

    constructor(){
        Editor.Instance = this
        this._buildDom()
        this._bindEvents()
    }

    private _widthHeightPanel: HTMLDivElement
    private _widthInput: HTMLInputElement
    private _heightInput: HTMLInputElement

    private _buildDom(){
        const editorWrapper = document.createElement('div')
        editorWrapper.id = 'editor'
        editorWrapper.style.width = '100%'
        editorWrapper.style.height = '100%'
        editorWrapper.style.position = 'absolute'
        editorWrapper.style.top = '0'
        editorWrapper.style.left = '0'
        editorWrapper.style.zIndex = '100'
        document.body.appendChild(editorWrapper)

        const menuPanel = document.createElement('div')
        menuPanel.id = 'menuPanel'
        menuPanel.style.width = '200px'
        menuPanel.style.height = '100%'
        menuPanel.style.position = 'absolute'
        menuPanel.style.background = 'white'
        menuPanel.style.top = '0'
        menuPanel.style.left = '0'
        menuPanel.style.zIndex = '1'
        editorWrapper.appendChild(menuPanel)
        
        const widthHeightPanel = document.createElement('div')
        widthHeightPanel.id = 'widthHeightPanel'
        widthHeightPanel.style.width = '100%'
        widthHeightPanel.style.height = '100px'
        widthHeightPanel.style.position = 'absolute'
        widthHeightPanel.style.background = 'white'
        widthHeightPanel.style.top = '0'
        widthHeightPanel.style.left = '0'
        widthHeightPanel.style.zIndex = '1'
        menuPanel.appendChild(widthHeightPanel)
        this._widthHeightPanel = widthHeightPanel

        const widthInput = document.createElement('input')
        widthInput.id = 'widthInput'
        widthInput.style.width = '60px'
        widthInput.style.height = '20px'
        widthInput.style.position = 'absolute'
        widthInput.style.top = '10px'
        widthInput.style.left = '10px'
        widthInput.style.zIndex = '1'
        widthInput.value = '0'
        widthHeightPanel.appendChild(widthInput)       
        this._widthInput = widthInput 

        const heightInput = document.createElement('input')
        heightInput.id = 'heightInput'
        heightInput.style.width = '60px'
        heightInput.style.height = '20px'
        heightInput.style.position = 'absolute'
        heightInput.style.top = '10px'
        heightInput.style.left = '80px'
        heightInput.style.zIndex = '1'
        heightInput.value = '0'
        widthHeightPanel.appendChild(heightInput)   
        this._heightInput = heightInput
        
        const generateButton = document.createElement('button')
        generateButton.id = 'generateButton'
        generateButton.style.width = '80px'
        generateButton.style.height = '20px'
        generateButton.style.position = 'absolute'
        generateButton.style.top = '40px'
        generateButton.style.left = '40px'
        generateButton.style.zIndex = '1'
        generateButton.innerHTML = 'Generate'
        generateButton.onclick = ()=>{ UpdateCanvasSize() }
        widthHeightPanel.appendChild(generateButton)

        const UpdateCanvasSize = () => {
            this._size = [parseInt(widthInput.value), parseInt(heightInput.value)]
            this._updateCanvasSizes()
        }
        const tileSelector = document.createElement('select')
        tileSelector.id = 'tileSelector'
        tileSelector.style.width = '120px'
        tileSelector.style.height = '20px'
        tileSelector.style.position = 'absolute'
        tileSelector.style.top = '80px'
        tileSelector.style.left = '12px'
        tileSelector.style.zIndex = '1'
        menuPanel.appendChild(tileSelector)

        const saveStaticButton = document.createElement('button')
        saveStaticButton.id = 'saveStaticButton'
        saveStaticButton.style.width = '80px'
        saveStaticButton.style.height = '40px'
        saveStaticButton.style.position = 'absolute'
        saveStaticButton.style.top = '110px'
        saveStaticButton.style.left = '40px'
        saveStaticButton.style.zIndex = '1'
        saveStaticButton.innerHTML = 'Save Static'
        saveStaticButton.onclick = ()=>{ this._exportStaticData() }
        menuPanel.appendChild(saveStaticButton)

        const loadStaticButton = document.createElement('button')
        loadStaticButton.id = 'loadStaticButton'
        loadStaticButton.style.width = '80px'
        loadStaticButton.style.height = '40px'
        loadStaticButton.style.position = 'absolute'
        loadStaticButton.style.top = '160px'
        loadStaticButton.style.left = '40px'
        loadStaticButton.style.zIndex = '1'
        loadStaticButton.innerHTML = 'Load Static'
        loadStaticButton.onclick = ()=>{ this._importStaticData() }
        menuPanel.appendChild(loadStaticButton)

        let _i = 0
        LevelTileColorMap.forEach((value, key) => {
            _i++
            if(_i % 2 != 1){
                return true
            }
            const option = document.createElement('option')
            option.value = key
            option.innerHTML = value
            tileSelector.appendChild(option)   
            if(!this._currentTile){
                this._currentTile = value
            }
        })

        tileSelector.onchange = () => {
            this._currentTile = tileSelector.value
        }

        const shiftContextLeftButton = document.createElement('button')
        shiftContextLeftButton.id = 'shiftContextLeftButton'
        shiftContextLeftButton.style.width = '40px'
        shiftContextLeftButton.style.height = '40px'
        shiftContextLeftButton.style.position = 'absolute'
        shiftContextLeftButton.style.top = '210px'
        shiftContextLeftButton.style.left = '10px'
        shiftContextLeftButton.style.zIndex = '1'
        shiftContextLeftButton.innerHTML = 'Shift Left'
        shiftContextLeftButton.onclick = ()=>{ this._shiftStaticContext(1, 0)}
        menuPanel.appendChild(shiftContextLeftButton)


        const canvasPanel = document.createElement('div')
        canvasPanel.id = 'canvasPanel'
        canvasPanel.style.width = 'calc(100% - 200px)'
        canvasPanel.style.height = '100%'
        canvasPanel.style.position = 'absolute'
        canvasPanel.style.background = 'white'
        canvasPanel.style.top = '0'
        canvasPanel.style.left = '200px'
        canvasPanel.style.zIndex = '1'
        canvasPanel.style.background = 'rgb(128, 128, 128)'
        canvasPanel.style.overflow = 'auto'
        editorWrapper.appendChild(canvasPanel)

        const staticLayerCanvas = document.createElement('canvas')
        staticLayerCanvas.id = 'staticLayerCanvas'
        staticLayerCanvas.style.position = 'absolute'
        staticLayerCanvas.style.top = '6px'
        staticLayerCanvas.style.left = '3px'
        canvasPanel.appendChild(staticLayerCanvas)
        this._staticCanvas = staticLayerCanvas
        this._staticCtx = this._staticCanvas.getContext('2d')
    }

    private _mouseDown: boolean = false
    private _lastMousePosition: [number, number] = [-1, -1]

    private _bindEvents(){
        document.addEventListener('pointerdown', (e) => {
            this._mouseDown = true
        })
        document.addEventListener('pointerup', (e) => {
            this._mouseDown = false
        })
        document.addEventListener('pointerout', (e) => {
            this._mouseDown = false
        })

        this._staticCanvas.addEventListener('pointerdown', (e) => {
            this._updateStaticDataAtPosition(e.offsetX, e.offsetY, this._currentTile)
        })
        this._staticCanvas.addEventListener('pointermove', (e) => {
            if(this._mouseDown){
                this._updateStaticDataAtPosition(e.offsetX, e.offsetY, this._currentTile)
            }
        })
    }

    private _updateStaticDataAtPosition(x: number, y: number, tile: string){
        x = Math.floor(x / 8)
        y = Math.floor(y / 8)
        if(x == this._lastMousePosition[0] && y == this._lastMousePosition[1]){ return }
        this._staticData[y][x] = tile
        this._staticCtx.fillStyle = `rgb(${GetStringAsVisualColor(this._staticData[y][x])})`
        this._staticCtx.fillRect((x * 8) + 1, (y * 8) + 1, 6, 6)
        this._lastMousePosition = [x, y]
    }

    private _exportStaticData(){
        if(this._firstGeneration){
            return false
        }
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = this._size[0]
        tempCanvas.height = this._size[1]
        const tempCtx = tempCanvas.getContext('2d')
        for(let y = 0; y < this._size[1]; y++){
            for(let x = 0; x < this._size[0]; x++){
                tempCtx.fillStyle = `rgb(${this._staticData[y][x]})`
                tempCtx.fillRect(x, y, 1, 1)
            }
        }
        const link = document.createElement('a')
        link.setAttribute('download', 'static.png')
        link.setAttribute('href', tempCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"))
        link.setAttribute('target', '_blank')
        link.click()
    }

    private _importStaticData(){
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/png'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files[0]
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                    const tempCanvas = document.createElement('canvas')
                    this._size = [img.width, img.height]
                    tempCanvas.width = this._size[0]
                    tempCanvas.height = this._size[1]
                    this._widthInput.value = this._size[0].toString()
                    this._heightInput.value = this._size[1].toString()
                    const tempCtx = tempCanvas.getContext('2d')
                    tempCtx.drawImage(img, 0, 0, this._size[0], this._size[1])
                    const data = tempCtx.getImageData(0, 0, this._size[0], this._size[1]).data
                    this._staticData = []
                    for(let y = 0; y < this._size[1]; y++){
                        this._staticData.push([])
                        for(let x = 0; x < this._size[0]; x++){
                            const i = (y * this._size[0] + x) * 4
                            const r = data[i]
                            const g = data[i + 1]
                            const b = data[i + 2]
                            this._staticData[y].push(`${r},${g},${b}`)
                        }
                    }        
                    this._updateStaticVisual()                
                }
                img.src = reader.result as string
            }
            reader.readAsDataURL(file)
        }
        input.click()

    }

    private _shiftStaticContext(x: number, y: number){
        this._staticData = this._staticData.map((row, i) => {
            return row.map((cell, j) => {
                if(i + y < 0 || i + y >= this._size[1] || j + x < 0 || j + x >= this._size[0]){
                    return cell
                }
                return this._staticData[i + y][j + x]
            })
        })
        this._updateStaticVisual()
    }

    private _updateCanvasSizes(){
        if(this._size[0] == 0 || this._size[1] == 0){
            return
        }

        this._staticData = []
        for(let i = 0; i < this._size[1]; i++){
            this._staticData.push([])
            for(let j = 0; j < this._size[0]; j++){
                this._staticData[i].push(
                    LevelTileColorMap.get(Tiles.NO)
                )
            }
        }

        if(this._firstGeneration){            
            this._updateStaticVisual()
        }
    }   
    
    private _updateStaticVisual(){
        if(this._firstGeneration){
            this._widthHeightPanel.style.display = 'none'
        }
        this._firstGeneration = false
        this._staticCanvas.width = this._size[0] * 8
        this._staticCanvas.height = this._size[1] * 8        
        this._staticCtx.fillStyle = 'rgb(0, 0, 0)'
        this._staticCtx.fillRect(0, 0, this._staticCanvas.width, this._staticCanvas.height)
        for(let y = 0; y < this._size[1]; y++){
            for(let x = 0; x < this._size[0]; x++){
                this._staticCtx.fillStyle = `rgb(${GetStringAsVisualColor(this._staticData[y][x])})`
                this._staticCtx.fillRect((x * 8) + 1, (y * 8) + 1, 6, 6)
            }
        }
    }
}

