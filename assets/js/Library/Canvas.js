import Vector2 from './Math/Vector2.js'
import Matrix2 from './Math/Matrix2.js';

/** Class representing a canvas element for WebGL2 */
export default class Canvas {
    constructor(width, height, shaderSources , ranges, div) {
        this.width = width
        this.height = height
        this.shaderSources = shaderSources
        this.div = div


        this.operations = [
            this.vectorSum,
            this.vectorProd,
            this.matrixRotate,
            this.matrixScale
        ]
        if(div == "divVectorCanvas")
            this.operation = this.operations[0]
        else
            this.operation = this.operations[2]

        this.ranges = ranges

        this.colors = {
            black: [0, 0, 0, 0],
            blue: [0, 0, 255, 0],
            cyan: [0, 255, 255, 0],
            green: [0, 255, 0, 0],
            magenta: [255, 0, 255, 0],
            red: [255, 0, 0, 0],
            white: [255, 255, 255, 0],
            yellow: [255, 255, 0, 0],
        }
        this.data = {
            colors: [],
            positions: [],
        }

        this.gl = null
        this.program = null
        this.run()

        window.addEventListener('updateCanvas', event => {
            setInterval(() => {
            this.updateCanvasHandler(event)
            }, 200)
        }, false);

    }

    

    updateCanvasHandler(event) {
        //console.log('updateCanvas')
        this.clearData()
        this.operation()
        this.drawScene()
    }

    vectorSum(){
        this.data.positions.push(0,0)
        let vectorA = new Vector2(this.ranges[0].value, this.ranges[1].value)
        this.data.positions.push(vectorA.x, vectorA.y)
        this.data.colors.push(...this.colors['red'])
        this.data.colors.push(...this.colors['red'])

        this.data.positions.push(0,0)
        let vectorB = new Vector2(this.ranges[2].value, this.ranges[3].value)
        this.data.positions.push(vectorB.x, vectorB.y)
        this.data.colors.push(...this.colors['blue'])
        this.data.colors.push(...this.colors['blue'])

        this.data.positions.push(0,0)
        vectorA.add(vectorB)
        this.data.positions.push(vectorA.x, vectorA.y)
        this.data.colors.push(...this.colors['magenta'])
        this.data.colors.push(...this.colors['magenta'])

    }

    vectorProd(){
        let vectorA = new Vector2(this.ranges[0].value, this.ranges[1].value)
        this.data.positions.push(0,0)
        vectorA.scalar(this.ranges[4].value)
        this.data.positions.push(vectorA.x, vectorA.y)
        this.data.colors.push(...this.colors['red'])
        this.data.colors.push(...this.colors['red'])
    }

    matrixRotate(){
        this.data.positions.push(0,0)
        let vector = new Vector2(0, 0.8)
        vector.rot(this.ranges[2].value)
        this.data.positions.push(vector.x, vector.y)
        this.data.colors.push(...this.colors['white'])
        this.data.colors.push(...this.colors['red'])
    }

    matrixScale(){
        this.data.positions.push(0,0)
        let mtx = new Matrix2([0.5, 0.5, 0, 0])
        let scaleMtx = new Matrix2([this.ranges[0].value, 0, 0, this.ranges[1].value])
        mtx.mul(scaleMtx.elements)
        console.log(mtx.elements)
        this.data.positions.push(mtx.elements[0], mtx.elements[1])
        this.data.colors.push(...this.colors['red'])
        this.data.colors.push(...this.colors['red'])
    }


    // Methode to execute Clock
    run() {
        try {
            this.createCanvas()
            this.createShaders()
            this.createProgram()
            this.createVertexArray()
            // Initial drawing on the canvas
            /*{
                // Random points
                for (let i = 0, max = 100; i < max; i++) {
                    this.data.positions.push(Math.random() * 2 - 1, Math.random() * 2 - 1)
                    this.data.colors.push(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 0)
                }
                // White point in the middle.
                this.data.positions.push(0, 0)
                this.data.colors.push(...this.colors.white)
            }*/
            this.drawScene()



        } catch (error) {
            console.error(error)
        }
    }

    // Methode to clear Data
    clearData() {
        this.data = {
            colors: [],
            positions: [],
        }
    }

    createBuffers() {
        this.createBuffer('COLOR')
        this.createBuffer('POSITION')
    }

    createBuffer(bufferType) {
        const gl = this.gl
        const program = this.program

        let name // Name of attribute used in GLSL.
        let normalized // Should it be normalized to a value between 0 and 1.
        let size // Number of components per vertex attribute, can be 1 through 4.
        let srcData
        let type // Datatype.
        const stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position.
        const offset = 0 // Start at the beginning of the buffer.

        switch (bufferType) {
            case 'COLOR':
                name = 'a_VertexColor'
                normalized = true
                size = 4
                srcData = new Uint8Array(this.data.colors)
                type = gl.UNSIGNED_BYTE // Integer from 0 through 255.
                break
            case 'POSITION':
                name = 'a_VertexPosition'
                normalized = false
                size = 2
                srcData = new Float32Array(this.data.positions)
                type = gl.FLOAT
                break
            default:
                return null
        }

        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, srcData, gl.STATIC_DRAW)

        const index = gl.getAttribLocation(program, name)
        gl.enableVertexAttribArray(index)
        gl.vertexAttribPointer(index, size, type, normalized, stride, offset) // @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    }

    // Create canvas element in HTML
    createCanvas() {
        const canvas = document.createElement('canvas')
        document.getElementById(this.div).appendChild(canvas)
        canvas.height = this.height
        canvas.width = this.width
        const gl = this.gl = canvas.getContext('webgl2')
        gl.clearColor(1, 1, 1, 1) // @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height) // @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport
    }

    createProgram() {
        const gl = this.gl

        const program = gl.createProgram()
        gl.attachShader(program, this.vertexShader)
        gl.attachShader(program, this.fragmentShader)
        gl.linkProgram(program)

        const success = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (success) {
            this.program = program
            gl.useProgram(program)
        } else {
            console.error(gl.getProgramInfoLog(program))
            gl.deleteProgram(program)
        }
    }

    // Create a shader with default parameter
    createShaders() {
        const gl = this.gl

        this.vertexShader = this.createShader(gl.VERTEX_SHADER)
        this.fragmentShader = this.createShader(gl.FRAGMENT_SHADER)
    }

    // Create a shader with One parameter
    createShader(type) {
        const gl = this.gl

        let source
        switch (type) {
            case gl.FRAGMENT_SHADER:
                source = this.shaderSources.fragment
                break
            case gl.VERTEX_SHADER:
                source = this.shaderSources.vertex
                break
            default:
                console.error('Shader type does not exist.')
                return null
        }

        const shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (success) {
            return shader
        }
        console.error(type, gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
    }

    createVertexArray() {
        const gl = this.gl

        const vertexArray = gl.createVertexArray()
        gl.bindVertexArray(vertexArray)
    }

    // Draws the pixels inside canvas element
    drawScene() {
        const gl = this.gl

        this.createBuffers()

        gl.clear(gl.COLOR_BUFFER_BIT) // @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear

        const modes = [ // @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Rendering_primitives
            gl.POINTS,
            gl.LINES,
            gl.LINE_STRIP,
            gl.LINE_LOOP,
            gl.TRIANGLES,
            gl.TRIANGLE_STRIP,
            gl.TRIANGLE_FAN,
        ]
        const dimensions = 2
        const mode = modes[1]
        const first = 0
        const count = this.data.positions.length / dimensions
        gl.drawArrays(mode, first, count) // @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
    }
}