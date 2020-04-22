"use strict";

var canvas;
var gl;

var numVertices  = 132;

var numChecks = 24;

var c;

var flag = true;
var thetaflag = true;
var phiflag = true;

var near = 0.3;
var far = 3.0;
var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = [0, 0, 0];
var thetaLoc;

var angle = 0.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var vertices = [
    vec4(-0.75, -0.45, -0.45, 1.0), //0
    vec4(-0.75, -0.45, 0.45, 1.0),  //1
    vec4(-0.75, 0.45, -0.45, 1.0),  //2
    vec4(-0.75, 0.45, 0.45, 1.0),   //3
    vec4(-0.45, -0.75, -0.45, 1.0), //4
    vec4(-0.45, -0.75, 0.45, 1.0),  //5
    vec4(-0.45, -0.45, -0.75, 1.0), //6
    vec4(-0.45, -0.45, 0.75, 1.0),  //7
    vec4(-0.45, 0.45, -0.75, 1.0),  //8
    vec4(-0.45, 0.45, 0.75, 1.0),   //9
    vec4(-0.45, 0.75, -0.45, 1.0),  //10
    vec4(-0.45, 0.75, 0.45, 1.0),   //11
    vec4(0.45, -0.75, -0.45, 1.0),  //12
    vec4(0.45, -0.75, 0.45, 1.0),   //13
    vec4(0.45, -0.45, -0.75, 1.0),  //14
    vec4(0.45, -0.45, 0.75, 1.0),   //45
    vec4(0.45, 0.45, -0.75, 1.0),   //16
    vec4(0.45, 0.45, 0.75, 1.0),    //17
    vec4(0.45, 0.75, -0.45, 1.0),   //18
    vec4(0.45, 0.75, 0.45, 1.0),    //19
    vec4(0.75, -0.45, -0.45, 1.0),  //20
    vec4(0.75, -0.45, 0.45, 1.0),   //21
    vec4(0.75, 0.45, -0.45, 1.0),   //22
    vec4(0.75, 0.45, 0.45, 1.0)     //23

    // vec4( -0.5, -0.5,  0.5, 1.0 ),
    // vec4( -0.5,  0.5,  0.5, 1.0 ),
    // vec4( 0.5,  0.5,  0.5, 1.0 ),
    // vec4( 0.5, -0.5,  0.5, 1.0 ),
    // vec4( -0.5, -0.5, -0.5, 1.0 ),
    // vec4( -0.5,  0.5, -0.5, 1.0 ),
    // vec4( 0.5,  0.5, -0.5, 1.0 ),
    // vec4( 0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan
];

function quad(a, b, c, d, e) {

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     colorsArray.push(vertexColors[e]);
}

function tri(a, b, c, e) {

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     colorsArray.push(vertexColors[e]);
}

function colorCube()
{
    // Sides
    quad( 0, 1, 3, 2, 0 );
    quad( 0, 1, 5, 4, 1 );
    quad( 4, 5, 13, 12, 2 );
    quad( 12, 13, 21, 20, 3 );
    quad( 20, 21, 23, 22, 4 );
    quad( 22, 23, 19, 18, 5 );
    quad( 18, 19, 11, 10, 6 );
    quad( 10, 11, 3, 2, 7 );

    // Top and Bottom
    quad( 17, 15, 7, 9, 1 );
    quad( 16, 8, 6, 14, 0 );

    // Side Up
    quad( 19, 17, 9, 11, 2 );
    tri( 11, 9, 3, 3 );
    quad( 3, 9, 7, 1, 4 );
    tri( 1, 7, 5, 5 );
    quad( 5, 7, 15, 13, 5 );
    tri( 13, 15, 21, 6 );
    quad( 21, 15, 17, 23, 7 );
    tri( 23, 17, 19, 0 );

    // Side bottom
    quad( 16, 18, 10, 8, 1 );
    tri( 8, 10, 2, 2 );
    quad( 8, 2, 0, 6, 3 );
    tri( 6, 0, 4, 4 );
    quad( 6, 4, 12, 14, 5 );
    tri( 14, 12, 20, 6 );
    quad( 14, 20, 22, 16, 7 );
    tri( 16, 22, 18, 0 );

    // quad( 1, 0, 3, 2 );
    // quad( 2, 3, 7, 6 );
    // quad( 3, 0, 4, 7 );
    // quad( 6, 5, 1, 2 );
    // quad( 4, 5, 6, 7 );
    // quad( 5, 4, 0, 1 );
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    //event listeners for buttons
    // document.getElementById("xButton").onclick = function(){axis = xAxis;};
    // document.getElementById("yButton").onclick = function(){axis = yAxis;};
    // document.getElementById("zButton").onclick = function(){axis = zAxis;};
    // document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    // sliders for viewing parameters
    document.getElementById("zNearSlider").onchange=function(event){near = event.target.value;};
    document.getElementById("radiusSlider").onchange=function(event){radius = event.target.value;};
    document.getElementById("thetaSlider").onchange=function(event){theta = event.target.value* Math.PI/180.0;};
    document.getElementById("phiSlider").onchange=function(event){phi = event.target.value* Math.PI/180.0;};
    document.getElementById("fovSlider").onchange=function(event){fovy = event.target.value;};

    render();
}

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // if(flag) theta[axis] += 2.0;

    // modelViewMatrix = mat4();
    // modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
    // modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
    // modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, 1, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // Added delay
    setTimeout(function(){ requestAnimationFrame(render); }, 30 );
    // requestAnimationFrame(render);
}
