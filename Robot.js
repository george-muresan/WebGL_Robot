let LSliderID;
let RSliderID;
let LSliderValue = 0.0;
let RSliderValue = 0.0;
let RotateBodySliderID;
let RotateBodySliderValue = 0;



function initWebGL() {
    const vertexAttribData = {};
    const gpuProgram = {};
    const canvas = document.getElementById('draw_surface');
    const gl = canvas.getContext('webgl2');

    createProgram(gl, gpuProgram);
    createData(vertexAttribData);
    attachData(gl, vertexAttribData, gpuProgram);

    gl.clearColor(0.0, 0.0, 0.0, 0.5);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    let then = 0;
    function drawLoop(now) {
        now *= 0.001;
        const deltaTime = now - then;

    }

}

function draw(gl, vd, gpu, t) {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(gpu.Program);
    gl.bindBuffer(gl.ARRAY_BUFFER, vd.VBO);
    gl.vertexAttribPointer(vertexPositionAttribLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAtrribArray(gpu.vertexLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, vd.CBO);
    gl.vertexAttribPointer(cubeColorAttribLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAtrribArray(gpu.colorLoc);

    let modelMatrix = glMatrix.mat4.create();
    let translateBody;
    let bodyPositionWorldMatrix;
    let rotateBody;

    glMatrix.mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, LSliderValue])
    translateBody = glMatrix.mat4.clone(modelMatrix);
    bodyPositionWorldMatrix = glMatrix.mat4.clone(modelMatrix);

    glMatrix.mat4.rotate(modelMatrix, modelMatrix, RotateBodySliderValue * Math.PI / 180, [0, 1, 0]);
    glMatrix.mat4.copy(bodyPositionWorldMatrix, modelMatrix);


    let modelMatrixLocation = gl.getUniformLocation(gpu.Program, 'u_modelMatrix');
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);





    let u_projMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(u_projMatrix, 45 * Math.PI / 180, 800 / 600, 0.1, 100.0);
    let u_projMatrixLocation = gl.getUniformLocation(gpu.Program, 'u_projMatrix');

    gl.uniformMatrix4fv(u_projMatrixLocation, false, u_projMatrix);

    gl.drawArrays(gl.Triangles, 0, 12 * 3);

    let modelMatrix2 = gl.glMatrix.mat4.create();

    glMatrix.mat4.scale(modelMatrix2, modelMatrix2, [1.0, 0.125, 0.125]);
    glMatrix.mat4.translate(modelMatrix2, modelMatrix2, [0.50, 0.125, 0.0]);
    glMatrix.mat4.multiply(modelMatrix2, modelMatrix2, worldMatrix);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix2);

    glMatrix.mat4.multiply(modelMatrix2, modelMatrix2, worldMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 12 * 3)

}



function attachData() {

}

function createProgram(gl, gpu) {

    let vertCode =
        '#version 300 es' +
        'in vec3 v_position' +
        'in vec3 v_color;' +
        'uniform mat4 u_modelMatrix;' +
        'uniform mat4 u_projMatrix;' +
        'out vec4 v_outcolor' +
        'void main(void){' +
        'gl_Position = newPos;' +
        'v_outcolor = vec4(v_color, 1.0);' +
        '};'


    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);

    success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
    if (!success) {
        console.log(gl.getShaderInfoLog(vertShader));
    }

   
    let fragCode =
        '#version 300 es \n' +
        'precision mediump float; \n' +
        'out vec4 outFragColor;' +
        'void main(void) {' +
        'outFragColor = v_outColor;' +
        '}';

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);

    gl.compileShader(fragShader);

    success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
    if (!success) {
        console.log(gl.getShaderInfoLog(fragShader))
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(shaderProgram);
        throw 'Could not compile program' + info;
    }

    gpu.Program = shaderProgram;
    gl.useProgram(gpu.Program);


}
function createData(vd) {

    const idxCubeVertexPosition = new Float32Array(
        [
            //Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            //Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            //Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ]
    )
    // color
    let idxCubeColor = new Float32Array([
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,  // front face color
        1.0, 0.0, 0.0,

        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,  // 2nd face color
        0.0, 1.0, 0.0,

        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,  // 3rd face color
        1.0, 1.0, 1.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,   // 4th face color
        0.0, 0.0, 1.0,

        1.0, 0.0, 1.0,
        1.0, 0.0, 1.0,
        1.0, 0.0, 1.0,  // 5th face color
        1.0, 0.0, 1.0,

        1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,  // 6th face color
        1.0, 1.0, 0.0

    ])

    // index array used to construct cube from
    // idxCubeVertexPosition array
    const indices = [
        0, 1, 2, 0, 2, 3,    //front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   //top
        12, 13, 14, 12, 14, 15,   //bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23,   // left
    ];

    cubeVertices = [
        /* Mesh for 3D cube.
         *
            X, Y, Z, R, G, B
            x,y,z vertex position
            r,g,b red,green and blue components for color
            Note:
             one vertex buffer contains two attributes
             * position attribute
                gl.vertexAttribPointer(
                    vertexPositionAttribLocation,// index in shader program or use the value returned from getAttriblocation
                    3, // number of elements for this attribute
                    gl.FLOAT, // type of value, i.e. float
                    gl.FALSE, // is the data normalized 
                    6 * Float32Array.BYTES_PER_ELEMENT, // stried to next vertex position vertex element (we have two attributes for each vertex)
                    0 // offset in the buffer array. 
                );
                
             * color attribute 
                    gl.vertexAttribPointer(
                    cubeColorAttribLocation,  // index in shader program or use the value returned from getAttriblocation
                    3, // number of elements for this attribute
                    gl.FLOAT, // type of value, i.e. float
                    gl.FALSE, // is the data normalized 
                    6 * Float32Array.BYTES_PER_ELEMENT, // size of each a vertex element (we have two attributes for each vertex)
                    3 * Float32Array.BYTES_PER_ELEMENT  // offset in the buffer array for first color value. 
        );
    */

        // 3D, so we provide 
        // X, Y  Z, R, G, B floats, counter clockwise, starting from top of triangle


        -1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0,    //v2-v3-v0
        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,    // v0-v1-v2 (front)

        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0,    // v0-v3-v4 (right)
        1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0,   // v4-v5-v0


        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 0.0, 1.0, 1.0, -1.0, 1.0, -1.0, 0.0, 1.0, 0.0,  // v0-v5-v6 (top)
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, -1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,   // v6-v1-v0

        -1.0, 1.0, .90, 1.0, 1.0, 0.0, -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0,   // v1-v6-v7 (left)
        -1.0, -1.0, -.90, 0.0, 0.0, 0.0, -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, -1.0, 1.0, 1.0, 1.0, 1.0, 0.0,   // v7-v2-v1

        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0,   //v7-v4-v3 (bottom)
        1.0, -1.0, 1.0, 1.0, 0.0, 1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0,  //v3-v2-v7

        1.0, -1.0, -1.0, 0.0, 0.0, 1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, -1.0, 1.0, -1.0, 0.0, 1.0, 0.0,  // v4-v7-v6 (back)
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, -1.0, 0.0, 1.0, 1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0
    ];

}