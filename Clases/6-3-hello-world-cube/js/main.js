"use strict"
var canvas;					// HTML canvas
var gl;						// WebGL Rendering Context
var vertices;				// Model vertices
var indices;				// indices of vertices
var shaderProgram;			// Shader Program
var vbo;					// Vertex Buffer Object for Positions
var ibo;					// Index Buffer for indioces of vertices
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
	vertices = [-0.5, 0.5, 0.5,		// V0 Cara 1.0
				-0.5, -0.5, 0.5,	// v1 Cara 1.1
				 0.5, -0.5, 0.5,	// v2 Cara 1.2
				 0.5, 0.5, 0.5,		// V3 Cara 1.3
				 
				 0.5, 0.5, 0.5,		// V4 Cara 2.0
				 0.5, -0.5, 0.5,	// v5 Cara 2.1
				 0.5,-0.5,-0.5,		// V6 Cara 2.2
				 0.5,0.5,-0.5,		// V7 Cara 2.3

				 0.5,0.5,-0.5,		// V8 Cara 3.0
				 0.5,-0.5,-0.5,		// V9 Cara 3.1
				-0.5,-0.5,-0.5,		// V10 Cara 3.2
				-0.5,0.5,-0.5,		// V11 Cara 3.3

				-0.5,0.5,-0.5,		// V12 Cara 4.0
				-0.5,-0.5,-0.5,		// V13 Cara 4.1
				-0.5, -0.5, 0.5,	// V14 Cara 4.2
				-0.5, 0.5, 0.5,		// V15 Cara 4.3

				-0.5,0.5,-0.5,		// V16 Cara 5.0
				-0.5, 0.5, 0.5,		// V17 Cara 5.1
				0.5, 0.5, 0.5,		// V18 Cara 5.2
				0.5,0.5,-0.5,		// V19 Cara 5.3

				-0.5,-0.5,-0.5,		// V20 Cara 6.0
				0.5,-0.5,-0.5,		// V21 Cara 6.1
				0.5, -0.5, 0.5,		// v22 Cara 6.2
				-0.5, -0.5, 0.5,	// v23 Cara 6.3
			    ];	
	colors = [1., 0., 0., 1.,
			  1., 0., 0., 1.,
			  1., 0., 0., 1.,
			  1., 0., 0., 1., 	//cara 1
			  0., 1., 0., 1.,
			  0., 1., 0., 1.,
			  0., 1., 0., 1.,
			  0., 1., 0., 1.,	//cara 2
			  0., 0., 1., 1.,
			  0., 0., 1., 1.,
			  0., 0., 1., 1.,
			  0., 0., 1., 1.,	//cara 3
			  1., 1., 0., 1.,
			  1., 1., 0., 1.,
			  1., 1., 0., 1.,
			  1., 1., 0., 1.,	//cara 4
			  1., 0., 1., 1.,
			  1., 0., 1., 1.,
			  1., 0., 1., 1.,
			  1., 0., 1., 1.,	//cara 5
			  1., 1., 1., 1.,
			  1., 1., 1., 1.,
			  1., 1., 1., 1.,
			  1., 1., 1., 1.	//cara 6
			  ];
	//indices = [0, 1, 2, 3];	// points: gl.POINTS
	//indices = [0,1, 1,2, 2,3, 3,0];	// points: gl.LINES
	//indices = [0, 1, 2, 3, 0];	// points: gl.LINE_STRIP
	//indices = [0, 1, 2, 3];	// points: gl.LINE_LOOP
	//indices = [0,1,2, 0,2,3];	// points: gl.LINE_TRIANGLES
	//indices = [1, 0, 2, 3];	// points: gl.TRIANGLE_STRIP;
	//indices = [0, 1, 2, 3];	// points: gl.TRIANGLE_FAN
	indices = [0,1,2,3, 4,5,6,7, 8,9,10,11, 12,13,14,15, 16,17,18,19, 20,21,22,23 ];	
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

	// IBO for indices of vertices
	ibo = gl.createBuffer();
	var bufferType = gl.ELEMENT_ARRAY_BUFFER;
	gl.bindBuffer(bufferType, ibo);
	var data = new Int16Array(indices);
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
	gl.useProgram(shaderProgram);
	var bufferType = gl.ELEMENT_ARRAY_BUFFER;
	gl.bindBuffer(bufferType, ibo);

	var primitiveType = gl.TRIANGLE_FAN;					// WebGL Primitive to be rendered
	var count = indices.length;							// Number of indices to be rendered
	var type = gl.UNSIGNED_SHORT;
	var offset = 0;									// Bytes offset in the buffer
	gl.drawElements(primitiveType, count, type, offset);
	update();										// Update something
	requestAnimationFrame(renderLoop);				// Call next frame
}

function main()
{
	init();
	requestAnimationFrame(renderLoop);				// render loop
}
