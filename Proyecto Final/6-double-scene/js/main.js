"use strict"
var canvas;
var engine;
var scene, sceneBackground;
var camera, cameraBackground;
var light, lightBackground;
var deepSpace, earth;

function update()
{
    earth.rotation.y = earth.rotation.y + 0.01;
}

function renderLoop() 
{
    engine.autoClear = false;
    engine.clear();
    engine.render(sceneBackground, cameraBackground);
    engine.render(scene, camera);
    update();
    requestAnimationFrame(renderLoop); 
}

function main()
{
    // CANVAS
    canvas = document.getElementById("canvas");

    // RENDERER ENGINE
    engine = new THREE.WebGLRenderer({canvas: canvas});
    engine.setSize(window.innerWidth, window.innerHeight);
    engine.setClearColor(new THREE.Color(0.2, 0.2, 0.35), 1.);     

    // FRONT SCENE
    scene = new THREE.Scene();   

    // MODELS
    // EARTH
    var material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/earth-map.jpg")});
    earth = new THREE.Mesh(new THREE.SphereGeometry(1,100, 100), material);

    // CAMERA
    camera = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
    camera.position.set(0., 0., 5.);           
    var controls = new THREE.OrbitControls(camera, canvas);   

    // LIGHTS 
    // FRONT LIGHT 
    light = new THREE.PointLight(0xaaaaaa);
    light.position.set(0, 0, 10);

    // SCENE GRAPH
    scene.add(earth);
    scene.add(camera);
    scene.add(light);

    // BACKGROUND SCENE
    sceneBackground = new THREE.Scene();

    // MODELS
    deepSpace = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 0), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/deep-outer-space-map.jpg"), depthTest: false}));

    // BACKGROUND CAMERA
    cameraBackground = new THREE.Camera(); 

    // BACKGROUND LIGHT
    lightBackground = new THREE.PointLight(0xaaaaaa);
    lightBackground.position.set(0, 0, 10);

    // SCENE GRAPH
    sceneBackground.add(deepSpace);
    sceneBackground.add(cameraBackground);
    sceneBackground.add(lightBackground);
                          
    // EVENT-HANDLERS
    window.addEventListener('resize', resizeWindow, false);

    // ACTION
    requestAnimationFrame(renderLoop);   
}