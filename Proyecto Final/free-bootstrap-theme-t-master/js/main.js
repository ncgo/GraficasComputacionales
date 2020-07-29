"use strict"
var canvas;
var engine;
var scene, sceneBackground;
var camera, cameraBackground;
var light, lightBackground;
var deepSpace, earth;
var electron, neutron, proton, atom;

class Particula extends THREE.Mesh
{   
    constructor(type="proton")
    {
        super();
        this.type = type;
        if (type == "proton"){
            this.geometry = new THREE.SphereGeometry(0.95,100, 100);
            this.material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/proton.png")});
        } else if (type == "neutron") {
            this.geometry = new THREE.SphereGeometry(1,100, 100);
            this.material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/neutron1.png")});
        } else{
            this.geometry = new THREE.SphereGeometry(0.3,100, 100);
            this.material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/electron.png")});
        }
        new THREE.Mesh(this.geometry, this.material);
    }

    setPhongMaterial(shininess = 30.)
    {
        this.material = new THREE.MeshPhongMaterial({color: this.color, shininess: shininess});
    }
}

function update()
{
    proton.rotation.y = proton.rotation.y - 0.04;
    neutron.rotation.y = neutron.rotation.y - 0.04;
    electron.rotation.y = electron.rotation.y - 0.04;
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

function neutronClick(){

}

function main()
{
    // CANVAS
    canvas = document.getElementById("canvas");

    // RENDERER ENGINE
    engine = new THREE.WebGLRenderer({canvas: canvas});
    engine.setSize(window.innerWidth/1.2, window.innerHeight/1.1);
    engine.setClearColor(new THREE.Color(0.2, 0.2, 0.35), 1.);     

    // FRONT SCENE
    scene = new THREE.Scene();   

    // MODELS
    // Neutron
    // Electron
    // Proton
    proton = new Particula();
    electron = new Particula("electron");
    electron.position.set(2., 0., 0.);
    neutron = new Particula("neutron");
    neutron.position.set(-3., 0., 0.);


    // CAMERA
    camera = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
    camera.position.set(0., 0., 5.);           
    var controls = new THREE.OrbitControls(camera, canvas);   

    // LIGHTS 
    // FRONT LIGHT 
    light = new THREE.PointLight(0xaaaaaa);
    light.position.set(0, 0, 10);

    // SCENE GRAPH
    scene.add(proton);
    scene.add(neutron);
    scene.add(electron);
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