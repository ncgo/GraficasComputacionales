"use strict"
var canvas;
var engine;
var scene, sceneBackground;
var camera, cameraBackground;
var light, lightBackground;
var deepSpace, earth;
var electron, neutron, proton, atom, orbit;
var orbitas = [];

class Particula extends THREE.Mesh
{   
    constructor(type="proton")
    {
        super();
        this.type = type;
        if (type == "proton"){
            this.geometry = new THREE.SphereGeometry(0.55,100, 100);
            this.material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/proton.png")});
        } else if (type == "neutron") {
            this.geometry = new THREE.SphereGeometry(0.6,100, 100);
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

const baseRadius = (window.innerWidth > window.innerHeight ? (window.innerHeight - 40 / 2) : (window.innerWidth - 40 / 2));

class Orbita extends THREE.Mesh
{   
    constructor(ringNo = 1)
    {
        super();
        this.ringNo = ringNo;
        this.radius = 2 * this.ringNo;
        this.geometry = new THREE.TorusGeometry(this.radius, 0.025, 20, 100, Math.Pi*2);
        this.material = new THREE.MeshLambertMaterial("#F7FFF7");
        new THREE.Mesh(this.geometry, this.material);
        //this.rotation.x = 0;
    }
}

function update()
{
    /*proton.rotation.y = proton.rotation.y - 0.04;
    neutron.rotation.y = neutron.rotation.y - 0.04;
    electron.rotation.y = electron.rotation.y - 0.04;*/
}

function renderLoop() 
{
    engine.autoClear = false;
    engine.clear();
    engine.render(sceneBackground, cameraBackground);
    engine.render(scene, camera);
    update();
    requestAnimationFrame(renderLoop); 
    var baseRotation = 0.01;

	/*orbitas.forEach(function(v, i){
		v.rotation.y += baseRotation - (i * 0.001);
		v.rotation.x += baseRotation - (i * 0.001);
		v.rotation.z += baseRotation - (i * 0.001);
	})*/
}

function neutronClick(){

}

var particulas = []
function createAtom(protons = 2){
    for (let i = 0; i < 0; i++) {
        proton = new Particula("proton");
        proton.position.set(-0.2, i, 0.);
        scene.add(proton);
        neutron = new Particula("neutron");
        neutron.position.set(0.8,i, 0.);
        scene.add(neutron);
        proton.rotation.y = proton.rotation.y - 1.6;
        neutron.rotation.y = neutron.rotation.y - 1.6;
        //particulas = 
    }
    accomodateElectrons(20);
}
var orbitalMax = [2, 8, 18, 32];
var orbitalMaxSum = [2, 10, 28, 60];
function accomodateElectrons(electrons = 1) {
    var e = electrons;
    for( let i = 0; i <= 4; i++) {
        if( e > 0 ) {
            //var electronsArr = [];
            var group = new THREE.Group();
            orbit = new Orbita(i+1);
            group.add(orbit);
            var electronCount = e > orbitalMax[i] ? orbitalMax[i] : e;
            var angleIncrement = (Math.PI * 2) / electronCount;
            var angle = 0;
            for( let j = 0; j < electronCount ; j++, e--){
                electron = new Particula("electron");
                // Solve for x and y.
                var posX = orbit.radius * Math.cos(angle);
                var posY = orbit.radius * Math.sin(angle);
                electron.position.set(posX, posY, 0.);
                //electronsArr.push(electron);
                electron.rotation.y = electron.rotation.y - 1.4;
                //scene.add(electron);
                angle += angleIncrement;
                group.add(electron);
            }
            console.log("cambio");
            //scene.add(orbit);
            scene.add(group);
            orbitas.push(group);
        }
    }
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
    /*proton = new Particula();
    electron = new Particula("electron");
    electron.position.set(2., 0., 0.);
    neutron = new Particula("neutron");
    neutron.position.set(-3., 0., 0.);
    orbit = new Orbita();*/
    createAtom(2);


    // CAMERA
    camera = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
    camera.position.set(0., 0., 5.);           
    var controls = new THREE.OrbitControls(camera, canvas);   

    // LIGHTS 
    // FRONT LIGHT 
    light = new THREE.PointLight(0xaaaaaa);
    light.position.set(0, 0, 10);

    // SCENE GRAPH
    scene.add(camera);
    scene.add(light);

    // BACKGROUND SCENE
    sceneBackground = new THREE.Scene();

    // MODELS
    deepSpace = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 0), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/map.png"), depthTest: false}));

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