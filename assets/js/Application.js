import Canvas from './Library/Canvas.js'
import Tests from './Tests/Tests.js'

/** Class for the application. */
export default class Application {
    /**
     * Create a new application.
     */
    constructor() {
        const tests = false
        if (tests) {
            new Tests()
        }
        console.info('WebGL2 Demo')

        this.shaderSources = {
            fragment: null,
            vertex: null,
        }
        this.preloader()
    }

    /** methode to load glsl shaders     */
    async preloader() {
        console.info('Preloading source code for shaders')
        await fetch('./assets/glsl/vertex-shader.glsl')
            .then(response => response.text())
            .then(source => this.shaderSources.vertex = source)
            .catch(error => console.error(error.message))
        await fetch('./assets/glsl/fragment-shader.glsl')
            .then(response => response.text())
            .then(source => this.shaderSources.fragment = source)
            .catch(error => console.error(error.message))
        this.run()
    }

    /** methode to draw Canvas     */
    run() {
        /*let txt = document.createElement('p')
        txt.innerHTML = '<strong>Vectorbewerking 1:</strong> Optellen van vectoren'
        document.body.appendChild(txt)*/

        const width = 400
        const height = 400

        // VECTOR
        let ranges = [document.getElementById('vectorA_x'), document.getElementById('vectorA_y'), document.getElementById('vectorB_x'), document.getElementById('vectorB_y'), document.getElementById('scalar')]
        let canvas = new Canvas(width, height, this.shaderSources, ranges, "divVectorCanvas")

        let e = document.getElementById('selectOperationVect')
        e.onchange = function() {
            document.getElementById('txtOperationVect').innerHTML = e.options[e.selectedIndex].text
            canvas.operation = canvas.operations[e.options[e.selectedIndex].value]

            if(e.options[e.selectedIndex].value == 1){
                document.getElementById('divVectorB').style.display = 'none'
                document.getElementById('divScailerVect').style.display = 'block'
            } else{
                document.getElementById('divVectorB').style.display = 'block'
                document.getElementById('divScailerVect').style.display = 'none'
            }
            

        }

        // MATRIX
        let ranges2 = [document.getElementById('scale_x'), document.getElementById('scale_y'), document.getElementById('rot_omega')]
        let canvas2 = new Canvas(width, height, this.shaderSources, ranges2, "divMatrixCanvas")

        let e2 = document.getElementById('selectOperationMtx')
        e2.onchange = function() {
            document.getElementById('txtOperationMtx').innerHTML = e2.options[e2.selectedIndex].text
            canvas2.operation = canvas.operations[e2.options[e2.selectedIndex].value]
        
            if(e2.options[e2.selectedIndex].value == 3){
                document.getElementById('divRotMtx').style.display = 'none'
                document.getElementById('divScaleMtx').style.display = 'block'
            } else{
                document.getElementById('divRotMtx').style.display = 'block'
                document.getElementById('divScaleMtx').style.display = 'none'
            }
        }
        window.dispatchEvent(new Event('updateCanvas'))

        
    }
}