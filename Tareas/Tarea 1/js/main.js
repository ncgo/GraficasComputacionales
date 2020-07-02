"use strict"
var canvas;					// HTML canvas
var gl;						// WebGL Rendering Context
var vertices;				// Model vertices
var shaderProgram;			// Shader Program
var vbo;					// Vertex Buffer Object
var modelMatrix;			// Model Matrix
var viewMatrix;				// View Matrix
var pointSize;
var color;

// Camera parameters
var eye;					// Camera position
var target;					// Camera target
var up;						// Camera up
// Mouse parameteres
var dragMode;			// ROTATE, ZOOM or PAN
var dragging;			// True or false
var xLast, yLast; 		// Last position		
var rotX, rotY;			// Acumlulation

//Slider Controllers
var red = document.getElementById("cRed");
var green = document.getElementById("cGreen");
var blue = document.getElementById("cBlue");
var size = document.getElementById("Size");



function init()
{	


	// Init Model
	pointSize = size.value;
	

	color = [0., 1, 0., 1.];

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
	// VBO

	// Init Uniforms
	// uPointSize
	var uPointSizeLocation = gl.getUniformLocation(shaderProgram, "uPointSize");
	gl.uniform1f(uPointSizeLocation, pointSize);
	// uColor
	var uColorLocation = gl.getUniformLocation(shaderProgram, "uColor");
	gl.uniform4fv(uColorLocation, color);

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
	var uPointSizeLocation = gl.getUniformLocation(shaderProgram, "uPointSize");
	gl.uniform1f(uPointSizeLocation, size.value);
	var uColorLocation = gl.getUniformLocation(shaderProgram, "uColor");
	gl.uniform4fv(uColorLocation, [red.value/255,green.value/255,blue.value/255,opacity.value/100]);

}

function renderLoop()
{
	gl.clear(gl.COLOR_BUFFER_BIT);					// Clear the Color Buffer using the current clear color
	gl.viewport(0, 0, canvas.width, canvas.height);	// Set the Viewport transformation
				
	// Draw scene
	// Layout VBO

	// Draw
	var primitiveType = gl.POINTS;					// WebGL Primitive to be rendered
	var offset = 0;									// Bytes offset in the buffer
	var count = 1;									// Number of vertices to be rendered
	gl.drawArrays(primitiveType, offset, count);	// Draw


	update();										// Update something
	requestAnimationFrame(renderLoop);				// Call next frame
}

function main()
{

	init();
	requestAnimationFrame(renderLoop);				// render loop
}
