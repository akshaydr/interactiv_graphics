"use strict";

var canvas;
var gl;

var numVertices  = 132;

var numChecks = 24;

var c;

var rotateflag = false;
var flag = true;
var thetaflag = true;
var phiflag = true;

var objtheta = [0, 0, 0];
var lighttheta = [0, 0, 0];
var spotlighttheta = [0, 0, 0];

var lightanglex = 0.0;
var lightangley = 0.0;
var lightanglez = 0.0;
var spotlightanglex = 0.0;
var spotlightangley = 0.0;

var near = 0.3;
var far = 1.0;

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

var modelViewMatrix, projectionMatrix, rotationMatrix, spotrotationMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, rotationMatrixLoc, spotrotationMatrixLoc;
var eyeloc;

// Exercise 3
var oneDirLightPosition = vec4(1.0, 1.0, 1.0, 1.0 );
var oneDirlightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var oneDirlightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var oneDirlightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

// var oneDirLightPosition = vec4(0.0, 0.0, 0.0, 0.0 );
// var oneDirlightAmbient = vec4(0.0, 0.0, 0.0, 0.0 );
// var oneDirlightDiffuse = vec4( 0.0, 0.0, 0.0, 0.0 );
// var oneDirlightSpecular = vec4( 0.0, 0.0, 0.0, 0.0 );

var spotLightPosition = vec4(0.0, 0.0, 1.0, 0.0 );
var spotLightAmbient =  vec4(1.0, 1.0, 1.0, 1.0 );
var spotLightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var spotLightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var lCutOff=0.867;

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 150.0;

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

];

// var vertexColors = [
//     vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
//     vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
//     vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
//     vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
//     vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
//     vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
//     vec4( 0.0, 1.0, 1.0, 1.0 ),  // white
//     vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan
// ];

function quad(a, b, c, d) {

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
    //  colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
    //  colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
    //  colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
    //  colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
    //  colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
    //  colorsArray.push(vertexColors[e]);
}

function tri(a, b, c) {

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
    //  colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
    //  colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
    //  colorsArray.push(vertexColors[e]);
}

function colorCube()
{
    // Sides
    quad( 2, 3, 1, 0);
    quad( 0, 1, 5, 4);
    quad( 4, 5, 13, 12);
    quad( 12, 13, 21, 20);
    quad( 20, 21, 23, 22);
    quad( 22, 23, 19, 18);
    quad( 18, 19, 11, 10);
    quad( 10, 11, 3, 2);

    // Top and Bottom
    quad( 17, 15, 7, 9);
    quad( 16, 8, 6, 14);

    // Side Up
    quad( 19, 17, 9, 11 );
    tri( 11, 9, 3 );
    quad( 3, 9, 7, 1 );
    tri( 1, 7, 5 );
    quad( 5, 7, 15, 13 );
    tri( 13, 15, 21 );
    quad( 21, 15, 17, 23 );
    tri( 23, 17, 19 );

    // Side bottom
    quad( 16, 18, 10, 8 );
    tri( 8, 10, 2 );
    quad( 8, 2, 0, 6 );
    tri( 6, 0, 4 );
    quad( 6, 4, 12, 14 );
    tri( 14, 12, 20 );
    quad( 14, 20, 22, 16 );
    tri( 16, 22, 18 );

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

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    // var vColor = gl.getAttribLocation( program, "aColor" );
    // gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    // gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var OneDirAmbientProduct = mult(oneDirlightAmbient, materialAmbient);
    var OneDirDiffuseProduct = mult(oneDirlightDiffuse, materialDiffuse);
    var OneDirSpecularProduct = mult(oneDirlightSpecular, materialSpecular);

    var spotAmbientProduct = mult(spotLightAmbient, materialAmbient);
    var spotDiffuseProduct = mult(spotLightDiffuse, materialDiffuse);
    var spotSpecularProduct = mult(spotLightSpecular, materialSpecular);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    rotationMatrixLoc = gl.getUniformLocation(program, "uRotationMatrix");
    spotrotationMatrixLoc = gl.getUniformLocation(program, "uSpotRotationMatrix");
    
    eyeloc = gl.getUniformLocation(program, "eye");

    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirAmbientProduct"), OneDirAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirDiffuseProduct"), OneDirDiffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirSpecularProduct"), OneDirSpecularProduct );

    gl.uniform4fv(gl.getUniformLocation(program, "uSpotAmbientProduct"), spotAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotDiffuseProduct"), spotDiffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotSpecularProduct"), spotSpecularProduct );

    gl.uniform1f( gl.getUniformLocation(program, "lCutOff"),lCutOff );
    
    gl.uniform4fv( gl.getUniformLocation(program, "uspotLightPosition"), spotLightPosition );
    gl.uniform4fv(gl.getUniformLocation(program, "uoneDirLightPosition"), oneDirLightPosition );
    
    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

    //event listeners for buttons
    document.getElementById("lightx").oninput=function(event){lightanglex = event.target.value;};
    document.getElementById("lighty").oninput=function(event){lightangley = event.target.value;};
    document.getElementById("lightz").oninput=function(event){lightanglez = event.target.value;};

    document.getElementById("spotlightx").oninput=function(event){spotlightanglex = event.target.value;};
    document.getElementById("spotlighty").oninput=function(event){spotlightangley = event.target.value;};
    document.getElementById("limit").oninput=function(event){gl.uniform1f(gl.getUniformLocation(program,"lCutOff"), Math.cos(event.target.value* Math.PI/180.0));};

    document.getElementById("xObjButton").onclick = function(){axis = xAxis;};
    document.getElementById("yObjButton").onclick = function(){axis = yAxis;};
    document.getElementById("zObjButton").onclick = function(){axis = zAxis;};
    document.getElementById("rotateobj").onchange = function(){rotateflag = !rotateflag;    gl.uniform1f(gl.getUniformLocation(program,"uRflag"),rotateflag);};

    // sliders for viewing parameters
    document.getElementById("zNearSlider").oninput=function(event){near = event.target.value;};
    document.getElementById("radiusSlider").oninput=function(event){radius = event.target.value;};
    document.getElementById("thetaSlider").oninput=function(event){theta = event.target.value* Math.PI/180.0;};
    document.getElementById("phiSlider").oninput=function(event){phi = event.target.value* Math.PI/180.0;};
    document.getElementById("fovSlider").oninput=function(event){fovy = event.target.value;};

    render();
}

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // if(flag) lighttheta[axis] += 2.0;
    lighttheta[xAxis] = lightanglex;
    lighttheta[yAxis] = lightangley;
    lighttheta[zAxis] = lightanglez;
    rotationMatrix = mat4();
    rotationMatrix = mult(rotationMatrix, rotate(lighttheta[xAxis], vec3(1, 0, 0)));
    rotationMatrix = mult(rotationMatrix, rotate(lighttheta[yAxis], vec3(0, 1, 0)));
    rotationMatrix = mult(rotationMatrix, rotate(lighttheta[zAxis], vec3(0, 0, 1)));

    spotlighttheta[xAxis] = spotlightanglex;
    spotlighttheta[yAxis] = spotlightangley;
    spotrotationMatrix = mat4();
    spotrotationMatrix = mult(spotrotationMatrix, rotate(spotlighttheta[xAxis], vec3(1, 0, 0)));
    spotrotationMatrix = mult(spotrotationMatrix, rotate(spotlighttheta[yAxis], vec3(0, 1, 0)));

    // var spotlightmatrix 
    
    if(rotateflag) { 
        objtheta[axis] += 2.0;
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, rotate(objtheta[xAxis], vec3(1, 0, 0)));
        modelViewMatrix = mult(modelViewMatrix, rotate(objtheta[yAxis], vec3(0, 1, 0)));
        modelViewMatrix = mult(modelViewMatrix, rotate(objtheta[zAxis], vec3(0, 0, 1)));
    }
    
    if(!rotateflag){
        eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
        modelViewMatrix = lookAt(eye, at, up);
    }
    console.log(near);
    projectionMatrix = perspective(fovy, aspect, near, far);
    
    gl.uniform3fv(eyeloc, eye);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));
    gl.uniformMatrix4fv(spotrotationMatrixLoc, false, flatten(spotrotationMatrix));

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // Added delay
    setTimeout(function(){ requestAnimationFrame(render); }, 30 );
    // requestAnimationFrame(render);
}
