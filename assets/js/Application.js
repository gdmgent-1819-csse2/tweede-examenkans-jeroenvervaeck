import Canvas from './Library/Canvas.js'
import Tests from './Tests/Tests.js'

/** Class for the application. */
export default class Application {
    /**
     * Create a new application.
     */
    constructor() {
        const tests = true
        if (tests) {
            new Tests()
        }

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

        // Write inputValue in p-element
        document.getElementById("vectorA_x").oninput = function() {
            document.getElementById("vectorA_xValue").innerHTML = document.getElementById("vectorA_x").value
        }
        document.getElementById("vectorA_y").oninput = function() {
            document.getElementById("vectorA_yValue").innerHTML = document.getElementById("vectorA_y").value
        }
        document.getElementById("vectorB_x").oninput = function() {
            document.getElementById("vectorB_xValue").innerHTML = document.getElementById("vectorB_x").value
        }
        document.getElementById("vectorB_y").oninput = function() {
            document.getElementById("vectorB_yValue").innerHTML = document.getElementById("vectorB_y").value
        }
        document.getElementById("scalar").oninput = function() {
            document.getElementById("scailerValue").innerHTML = document.getElementById("scalar").value
        }
        document.getElementById("rot_omega").oninput = function() {
            document.getElementById("rotValue").innerHTML = document.getElementById("rot_omega").value + "°"
        }
        document.getElementById("scale_x").oninput = function() {
            document.getElementById("scale_xValue").innerHTML = document.getElementById("scale_x").value
        }
        document.getElementById("scale_y").oninput = function() {
            document.getElementById("scale_yValue").innerHTML = document.getElementById("scale_y").value
        }
    }
}