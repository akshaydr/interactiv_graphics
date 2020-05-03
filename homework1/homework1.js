"use strict";

// Easy commands access. Please ignore
// cd G:\Artificial Intelligence and Robotics\Semester 2\Interactive Graphics\Homework\interactiv_graphics
// python -m http.server
// http://localhost:8000/homework1/homework1.html

var canvas;
var gl;

var numVertices  = 132;

var numChecks = 24;

var c;
var program;

var cartoonflag = false; 
var rotateflag = false;
var textureflag = false;
var flag = true;
var thetaflag = true;
var phiflag = true;
var textcord = true;

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
var texCoordsArray = [];

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
var globalLightAmbient = vec4(0.0, 1.0, 0.5, 1.0 );

var oneDirLightPosition = vec4(1.0, 1.0, 1.0, 1.0 );
var oneDirlightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var oneDirlightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var oneDirlightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var spotLightPosition = vec4(0.0, 0.0, 1.0, 0.0 );
var spotLightAmbient =  vec4(0.2, 0.2, 0.2, 1.0);
var spotLightDiffuse = vec4(  1.0, 1.0, 1.0, 1.0 );
var spotLightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var lCutOff=0.867;

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(0.6, 1.0, 0.6, 1.0);
var materialSpecular = vec4(0.6, 1.0, 0.6, 1.0);
var materialShininess = 100.0;

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var vertices = [
    vec4( 0.45, -0.45, -0.75, 1.0),
    vec4( 0.75, -0.45, -0.45, 1.0),
    vec4( 0.45, 0.45, -0.75, 1.0),
    vec4( 0.75, -0.45, -0.45, 1.0),
    vec4( 0.75, 0.45, -0.45, 1.0),
    vec4( 0.45, 0.45, -0.75, 1.0),
    vec4( 0.45, -0.75, -0.45, 1.0),
    vec4( 0.75, -0.45, -0.45, 1.0),
    vec4( 0.45, -0.45, -0.75, 1.0),
    vec4( 0.45, 0.75, -0.45, 1.0),
    vec4( 0.45, 0.45, -0.75, 1.0),
    vec4( 0.75, 0.45, -0.45, 1.0),
    vec4( 0.45, -0.75, -0.45, 1.0),
    vec4( 0.45, -0.45, -0.75, 1.0),
    vec4( -0.45, -0.75, -0.45, 1.0),
    vec4( 0.45, -0.45, -0.75, 1.0),
    vec4( -0.45, -0.45, -0.75, 1.0),
    vec4( -0.45, -0.75, -0.45, 1.0),
    vec4( 0.75, -0.45, -0.45, 1.0),
    vec4( 0.45, -0.75, -0.45, 1.0),
    vec4( 0.75, -0.45, 0.45, 1.0),
    vec4( 0.45, -0.75, -0.45, 1.0),
    vec4( 0.45, -0.75, 0.45, 1.0),
    vec4( 0.75, -0.45, 0.45, 1.0),
    vec4( 0.45, 0.75, -0.45, 1.0),
    vec4( 0.75, 0.45, -0.45, 1.0),
    vec4( 0.45, 0.75, 0.45, 1.0),
    vec4( 0.75, 0.45, -0.45, 1.0),
    vec4( 0.75, 0.45, 0.45, 1.0),
    vec4( 0.45, 0.75, 0.45, 1.0),
    vec4( 0.45, 0.45, -0.75, 1.0),
    vec4( 0.45, 0.75, -0.45, 1.0),
    vec4( -0.45, 0.45, -0.75, 1.0),
    vec4( 0.45, 0.75, -0.45, 1.0),
    vec4( -0.45, 0.75, -0.45, 1.0),
    vec4( -0.45, 0.45, -0.75, 1.0),
    vec4( -0.75, -0.45, -0.45, 1.0),
    vec4( -0.45, -0.75, -0.45, 1.0),
    vec4( -0.45, -0.45, -0.75, 1.0),
    vec4( 0.45, -0.45, 0.75, 1.0),
    vec4( 0.75, -0.45, 0.45, 1.0),
    vec4( 0.45, -0.75, 0.45, 1.0),
    vec4( 0.45, 0.45, 0.75, 1.0),
    vec4( 0.45, 0.75, 0.45, 1.0),
    vec4( 0.75, 0.45, 0.45, 1.0),
    vec4( -0.45, -0.75, 0.45, 1.0),
    vec4( 0.45, -0.75, 0.45, 1.0),
    vec4( -0.45, -0.75, -0.45, 1.0),
    vec4( 0.45, -0.75, 0.45, 1.0),
    vec4( 0.45, -0.75, -0.45, 1.0),
    vec4( -0.45, -0.75, -0.45, 1.0),
    vec4( -0.45, 0.75, 0.45, 1.0),
    vec4( -0.45, 0.75, -0.45, 1.0),
    vec4( 0.45, 0.75, 0.45, 1.0),
    vec4( -0.45, 0.75, -0.45, 1.0),
    vec4( 0.45, 0.75, -0.45, 1.0),
    vec4( 0.45, 0.75, 0.45, 1.0),
    vec4( -0.75, -0.45, -0.45, 1.0),
    vec4( -0.75, 0.45, -0.45, 1.0),
    vec4( -0.75, -0.45, 0.45, 1.0),
    vec4( -0.75, 0.45, -0.45, 1.0),
    vec4( -0.75, 0.45, 0.45, 1.0),
    vec4( -0.75, -0.45, 0.45, 1.0),
    vec4( -0.45, -0.45, 0.75, 1.0),
    vec4( -0.45, 0.45, 0.75, 1.0),
    vec4( 0.45, -0.45, 0.75, 1.0),
    vec4( -0.45, 0.45, 0.75, 1.0),
    vec4( 0.45, 0.45, 0.75, 1.0),
    vec4( 0.45, -0.45, 0.75, 1.0),
    vec4( -0.75, -0.45, 0.45, 1.0),
    vec4( -0.45, -0.45, 0.75, 1.0),
    vec4( -0.45, -0.75, 0.45, 1.0),
    vec4( 0.45, -0.45, -0.75, 1.0),
    vec4( 0.45, 0.45, -0.75, 1.0),
    vec4( -0.45, -0.45, -0.75, 1.0),
    vec4( 0.45, 0.45, -0.75, 1.0),
    vec4( -0.45, 0.45, -0.75, 1.0),
    vec4( -0.45, -0.45, -0.75, 1.0),
    vec4( -0.75, 0.45, -0.45, 1.0),
    vec4( -0.45, 0.45, -0.75, 1.0),
    vec4( -0.45, 0.75, -0.45, 1.0),
    vec4( 0.75, -0.45, 0.45, 1.0),
    vec4( 0.75, 0.45, 0.45, 1.0),
    vec4( 0.75, -0.45, -0.45, 1.0),
    vec4( 0.75, 0.45, 0.45, 1.0),
    vec4( 0.75, 0.45, -0.45, 1.0),
    vec4( 0.75, -0.45, -0.45, 1.0),
    vec4( -0.45, 0.45, 0.75, 1.0),
    vec4( -0.75, 0.45, 0.45, 1.0),
    vec4( -0.45, 0.75, 0.45, 1.0),
    vec4( -0.45, -0.45, 0.75, 1.0),
    vec4( -0.75, -0.45, 0.45, 1.0),
    vec4( -0.45, 0.45, 0.75, 1.0),
    vec4( -0.75, -0.45, 0.45, 1.0),
    vec4( -0.75, 0.45, 0.45, 1.0),
    vec4( -0.45, 0.45, 0.75, 1.0),
    vec4( -0.75, 0.45, -0.45, 1.0),
    vec4( -0.45, 0.75, -0.45, 1.0),
    vec4( -0.75, 0.45, 0.45, 1.0),
    vec4( -0.45, 0.75, -0.45, 1.0),
    vec4( -0.45, 0.75, 0.45, 1.0),
    vec4( -0.75, 0.45, 0.45, 1.0),
    vec4( 0.45, 0.75, 0.45, 1.0),
    vec4( 0.45, 0.45, 0.75, 1.0),
    vec4( -0.45, 0.75, 0.45, 1.0),
    vec4( 0.45, 0.45, 0.75, 1.0),
    vec4( -0.45, 0.45, 0.75, 1.0),
    vec4( -0.45, 0.75, 0.45, 1.0),
    vec4( 0.45, 0.45, 0.75, 1.0),
    vec4( 0.75, 0.45, 0.45, 1.0),
    vec4( 0.45, -0.45, 0.75, 1.0),
    vec4( 0.75, 0.45, 0.45, 1.0),
    vec4( 0.75, -0.45, 0.45, 1.0),
    vec4( 0.45, -0.45, 0.75, 1.0),
    vec4( 0.45, -0.45, 0.75, 1.0),
    vec4( 0.45, -0.75, 0.45, 1.0),
    vec4( -0.45, -0.45, 0.75, 1.0),
    vec4( 0.45, -0.75, 0.45, 1.0),
    vec4( -0.45, -0.75, 0.45, 1.0),
    vec4( -0.45, -0.45, 0.75, 1.0),
    vec4( -0.45, -0.75, -0.45, 1.0),
    vec4( -0.75, -0.45, -0.45, 1.0),
    vec4( -0.45, -0.75, 0.45, 1.0),
    vec4( -0.75, -0.45, -0.45, 1.0),
    vec4( -0.75, -0.45, 0.45, 1.0),
    vec4( -0.45, -0.75, 0.45, 1.0),
    vec4( -0.75, -0.45, -0.45, 1.0),
    vec4( -0.45, -0.45, -0.75, 1.0),
    vec4( -0.75, 0.45, -0.45, 1.0),
    vec4( -0.45, -0.45, -0.75, 1.0),
    vec4( -0.45, 0.45, -0.75, 1.0),
    vec4( -0.75, 0.45, -0.45, 1.0)

];

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTexMap"), 0);
}

function tri(a, b, c) {

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     if (textcord) texCoordsArray.push(texCoord[0]);
     else texCoordsArray.push(texCoord[0]);
    //  colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     if (textcord) texCoordsArray.push(texCoord[1]);
     else texCoordsArray.push(texCoord[2]);
    //  colorsArray.push(vertexColors[e]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     if (textcord) texCoordsArray.push(texCoord[2]);
     else texCoordsArray.push(texCoord[1]);
    //  colorsArray.push(vertexColors[e]);

    textcord = !textcord;
}

function colorCube()
{
    tri( 0, 1, 2, );
    tri( 3, 4, 5, );
    tri( 6, 7, 8, );
    tri( 9, 10, 11, );
    tri( 12, 13, 14, );
    tri( 15, 16, 17, );
    tri( 18, 19, 20, );
    tri( 21, 22, 23, );
    tri( 24, 25, 26, );
    tri( 27, 28, 29, );
    tri( 30, 31, 32, );
    tri( 33, 34, 35, );
    tri( 36, 37, 38, );
    tri( 39, 40, 41, );
    tri( 42, 43, 44, );
    tri( 45, 46, 47, );
    tri( 48, 49, 50, );
    tri( 51, 52, 53, );
    tri( 54, 55, 56, );
    tri( 57, 58, 59, );
    tri( 60, 61, 62, );
    tri( 63, 64, 65, );
    tri( 66, 67, 68, );
    tri( 69, 70, 71, );
    tri( 72, 73, 74, );
    tri( 75, 76, 77, );
    tri( 78, 79, 80, );
    tri( 81, 82, 83, );
    tri( 84, 85, 86, );
    tri( 87, 88, 89, );
    tri( 90, 91, 92, );
    tri( 93, 94, 95, );
    tri( 96, 97, 98, );
    tri( 99, 100, 101, );
    tri( 102, 103, 104, );
    tri( 105, 106, 107, );
    tri( 108, 109, 110, );
    tri( 111, 112, 113, );
    tri( 114, 115, 116, );
    tri( 117, 118, 119, );
    tri( 120, 121, 122, );
    tri( 123, 124, 125, );
    tri( 126, 127, 128, );
    tri( 129, 130, 131, );

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
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
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

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    var image = document.getElementById("texImage");
    configureTexture(image);

    var OneDirAmbientProduct = mult(oneDirlightAmbient, materialAmbient);
    var OneDirDiffuseProduct = mult(oneDirlightDiffuse, materialDiffuse);
    var OneDirSpecularProduct = mult(oneDirlightSpecular, materialSpecular);

    var spotAmbientProduct = mult(spotLightAmbient, materialAmbient);
    var spotDiffuseProduct = mult(spotLightDiffuse, materialDiffuse);
    var spotSpecularProduct = mult(spotLightSpecular, materialSpecular);

    var globalAmbientProduct = mult(globalLightAmbient, materialAmbient);

    var OneDirCi = add(globalAmbientProduct, OneDirAmbientProduct);
    var OneDirCs = OneDirCi;
    OneDirCi = add(OneDirCi, OneDirDiffuseProduct);
    
    var SpotCi = add(globalAmbientProduct, spotAmbientProduct);
    var SpotCs = SpotCi;
    SpotCi = add(SpotCi, spotDiffuseProduct);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    rotationMatrixLoc = gl.getUniformLocation(program, "uRotationMatrix");
    spotrotationMatrixLoc = gl.getUniformLocation(program, "uSpotRotationMatrix");
    
    gl.uniform4fv(gl.getUniformLocation(program, "uglobalAmbientProduct"), globalAmbientProduct);
    
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirAmbientProduct"), OneDirAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirDiffuseProduct"), OneDirDiffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirSpecularProduct"), OneDirSpecularProduct );

    gl.uniform4fv(gl.getUniformLocation(program, "uSpotAmbientProduct"), spotAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotDiffuseProduct"), spotDiffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotSpecularProduct"), spotSpecularProduct );

    gl.uniform1f( gl.getUniformLocation(program, "lCutOff"),lCutOff );
    
    gl.uniform4fv( gl.getUniformLocation(program, "uspotLightPosition"), spotLightPosition );
    gl.uniform4fv(gl.getUniformLocation(program, "uoneDirLightPosition"), oneDirLightPosition );
    
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirCi"), OneDirCi );
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirCs"), OneDirCs );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotCi"), SpotCi );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotCs"), SpotCs );
    
    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

    //One direction Light rotation
    document.getElementById("lightx").oninput=function(event){lightanglex = event.target.value;};
    document.getElementById("lighty").oninput=function(event){lightangley = event.target.value;};
    document.getElementById("lightz").oninput=function(event){lightanglez = event.target.value;};

    //Spotlight rotation
    document.getElementById("spotlightx").oninput=function(event){spotlightanglex = event.target.value;};
    document.getElementById("spotlighty").oninput=function(event){spotlightangley = event.target.value;};
    document.getElementById("limit").oninput=function(event){gl.uniform1f(gl.getUniformLocation(program,"lCutOff"), Math.cos(event.target.value* Math.PI/180.0));};

    //Object Rotation
    document.getElementById("xObjButton").onclick = function(){axis = xAxis;};
    document.getElementById("yObjButton").onclick = function(){axis = yAxis;};
    document.getElementById("zObjButton").onclick = function(){axis = zAxis;};
    document.getElementById("rotateobj").onchange = function(){rotateflag = !rotateflag;    gl.uniform1f(gl.getUniformLocation(program,"uRflag"),rotateflag);};
    
    // Flags for enabling and disabling cartoon shading and Texture 
    document.getElementById("cartoontoggle").onchange = function(){cartoonflag = !cartoonflag;    gl.uniform1f(gl.getUniformLocation(program,"ucartoonflag"),cartoonflag);};
    document.getElementById("texturetoggle").onchange = function(){textureflag = !textureflag;    gl.uniform1f(gl.getUniformLocation(program,"utextureflag"),textureflag);};
    
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

    // One Direction Light Rotation 
    lighttheta[xAxis] = lightanglex;
    lighttheta[yAxis] = lightangley;
    lighttheta[zAxis] = lightanglez;
    rotationMatrix = mat4();
    rotationMatrix = mult(rotationMatrix, rotate(lighttheta[xAxis], vec3(1, 0, 0)));
    rotationMatrix = mult(rotationMatrix, rotate(lighttheta[yAxis], vec3(0, 1, 0)));
    rotationMatrix = mult(rotationMatrix, rotate(lighttheta[zAxis], vec3(0, 0, 1)));

    // Spotilight Rotation 
    spotlighttheta[xAxis] = spotlightanglex;
    spotlighttheta[yAxis] = spotlightangley;
    spotrotationMatrix = mat4();
    spotrotationMatrix = mult(spotrotationMatrix, rotate(spotlighttheta[xAxis], vec3(1, 0, 0)));
    spotrotationMatrix = mult(spotrotationMatrix, rotate(spotlighttheta[yAxis], vec3(0, 1, 0)));
 
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
