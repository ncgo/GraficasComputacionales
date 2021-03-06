"use strict"
var canvas;					// HTML canvas
var gl;						// WebGL Rendering Context
var vertices;				// Model vertices
var shaderProgram;			// Shader Program
var vbo;					// Vertex Buffer Object for Positions
var vboColors;				// Vertex Buffer Obect for Colors
var modelMatrix;			// Model Matrix
var viewMatrix;				// View Matrix
var pointSize;
var color;
var colors;					// Vertex colors

// Camera parameters
var eye;					// Camera position
var target;					// Camera target
var up;						// Camera up
// Mouse parameteres
var dragMode;			// ROTATE, ZOOM or PAN
var dragging;			// True or false
var xLast, yLast; 		// Last position		
var rotX, rotY;			// Acumlulation

function init()
{	
	// Init Model
	vertices = [0., 0.5, 0.,	// X0, y0, z0
			   -0.5, -0.5, 0.,
			    0.5, -0.5, 0.
			    ];	
	colors = [1., 0., 0., 1.,
			  0., 1., 0., 1.,
			  0., 0., 1., 1.];
	pointSize = 12.;
	color = [1., 1., 0., 1.];

	// Init Camera
    eye = [0., 0., 1.];
    target = [0., 0., 0.];
    up = [0., 1., 0.];

    // Init Mouse parameters
    dragMode = "ROTATE";
	dragging = false;
	xLast = 0;
	yLast = 0;		
	rotX = 0.;
	rotY = 0.;		
	
	// Init Rendering
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");				// Get the WebGL rendering context (WebGL state machine)
	canvas.width = 0.75 * window.innerWidth;
	canvas.height = 0.75 * window.innerHeight;
	gl.clearColor(0., 0., 0., 1.);					// Set current color to clear buffers to BLACK

	// Init Shaders
	shaderProgram = createShaderProgram("vertexShader", "fragmentShader");
	gl.useProgram(shaderProgram);					// Set the current Shader Program to use

	// Init Buffers
	// VBO for positions
	vbo = gl.createBuffer();
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vbo);
	var data = new Float32Array(vertices);
	var usage = gl.STATIC_DRAW;
	gl.bufferData(bufferType, data, usage);

	// VBO for colors
	vboColors = gl.createBuffer();
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vboColors);
	var data = new Float32Array(colors);
	var usage = gl.STATIC_DRAW;
	gl.bufferData(bufferType, data, usage);
	

	// Init Uniforms
	// uPointSize
	var uPointSizeLocation = gl.getUniformLocation(shaderProgram, "uPointSize");
	gl.uniform1f(uPointSizeLocation, pointSize);
	// Init Transformations
	// Model Matrix
	modelMatrix = glMatrix.mat4.create();	// Mmodel = I

	// View Matrix
	viewMatrix = glMatrix.mat4.create();	// Mview = I
	glMatrix.mat4.lookAt(viewMatrix, eye, target, up);

	// ModelViewMatrix
	var modelViewMatrix = glMatrix.mat4.create();	// M-model-view = I
	glMatrix.mat4.multiply(modelViewMatrix, modelMatrix, viewMatrix); // Mmodel-view = Mview * Mmodel
	// Load modelViewMatrix to Rendering Context
	var uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	gl.uniformMatrix4fv(uModelViewMatrixLocation, false, modelViewMatrix);
	
	// Projection Matrix
	// Perspective Projection
	var fov = 60.;					// FOV (Filed-Of-View) angle in degrees
	fov = fov * Math.PI / 180.;	// FOV angle in radians
	var aspect = canvas.width / canvas.height;
	var near = 0.01;
	var far = 10000.;
	var projMatrix = glMatrix.mat4.create();
	glMatrix.mat4.perspective(projMatrix, fov, aspect, near, far);
	// Load projMatrix to Rendering Context
	var uProjMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjMatrix");
	gl.uniformMatrix4fv(uProjMatrixLocation, false, projMatrix);

	// Init Events
	window.addEventListener('resize', windowEventListener, false);
	document.addEventListener("mousedown", mouseDownEventListener, false);
	document.addEventListener("mouseup", mouseUpEventListener, false);
	document.addEventListener("mousemove", mouseMoveEventListener, false);
}

function update()
{

}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1.];
}

function renderLoop()
{
	gl.clear(gl.COLOR_BUFFER_BIT);					// Clear the Color Buffer using the current clear color
	gl.viewport(0, 0, canvas.width, canvas.height);	// Set the Viewport transformation
				
	// Draw scene
	// Layout VBO for positions
	gl.useProgram(shaderProgram);
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vbo);
	var aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
	var index = aPositionLocation;
	var size = 3;	// X, Y, Z
	var type = gl.FLOAT;
	var normalized = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	gl.enableVertexAttribArray(aPositionLocation);

	// Layout VBO for colors
	gl.useProgram(shaderProgram);
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vboColors);
	var aColorLocation = gl.getAttribLocation(shaderProgram, "aColor");
	var index = aColorLocation;
	var size = 4;	// R, G, B, A
	var type = gl.FLOAT;
	var normalized = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	gl.enableVertexAttribArray(aColorLocation);

	// Draw
	var primitiveType = gl.TRIANGLES;					// WebGL Primitive to be rendered
	var offset = 0;									// Bytes offset in the buffer
	var count = 3;									// Number of vertices to be rendered
	gl.drawArrays(primitiveType, offset, count);	// Draw
	
	update();										// Update something
	requestAnimationFrame(renderLoop);				// Call next frame
}

function main()
{
	init();
	requestAnimationFrame(renderLoop);				// render loop
}


function trianglePressed()
{
    var tColor = hexToRgb(triangle.value);
    colors = [tColor[0]/255,tColor[1]/255,tColor[2]/255,1.,
              tColor[0]/255,tColor[1]/255,tColor[2]/255,1.,
              tColor[0]/255,tColor[1]/255,tColor[2]/255,1.];
	vboColors = gl.createBuffer();
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vboColors);
	var data = new Float32Array(colors);
	var usage = gl.STATIC_DRAW;
    gl.bufferData(bufferType, data, usage);
}


function vertexPressed(){
    var v1 = hexToRgb(vertex1.value);
    var v2 = hexToRgb(vertex2.value);
    var v3 = hexToRgb(vertex3.value);
    colors = [v1[0]/255,v1[1]/255,v1[2]/255,1.,
              v2[0]/255,v2[1]/255,v2[2]/255,1.,
              v3[0]/255,v3[1]/255,v3[2]/255,1.];
    console.log(colors);
	vboColors = gl.createBuffer();
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vboColors);
	var data = new Float32Array(colors);
	var usage = gl.STATIC_DRAW;
    gl.bufferData(bufferType, data, usage);
}


