"use strict"
var canvas;
var engine;
var scene, atomView, sceneBackground, neutronView, protonView, electronView;
var camera, cameraBackground, cameraAtom, backgroundAtom;
var light, lightBackground;
var deepSpace, earth;
var electron, neutron, proton, atom, orbit;
var orbitas = [];
var view = "atomView";


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
        if( ringNo === 1 ) {
            this.radius = 5;
        }  else {
            this.radius = 1.8 * this.ringNo + 5;
        }
        this.geometry = new THREE.TorusGeometry(this.radius, 0.025, 20, 100, Math.Pi*2);
        this.material = new THREE.MeshLambertMaterial("#F7FFF7");
        new THREE.Mesh(this.geometry, this.material);
        //this.rotation.x = 0;
    }
}



function neutronClick(){
    console.log("neutronClick");
    var item = document.getElementById("partstext");
    var explanationText = document.getElementById("neutronText");
    if (item) {
        if(item.className=='hidden'){
            item.className = 'unhidden' ;
            clickedButton.value = 'hide'
        }else{
            item.className = 'hidden';
            clickedButton.value = 'unhide';
        }
    }
    view = "neutronView";
    neutronView = new THREE.Scene();
    neutron = new Particula("neutron");
    neutronView.add(neutron);
     // CAMERA
     camera = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
     camera.position.set(0., 0., 3.);        
     var controls = new THREE.OrbitControls(camera, canvas);   
 
     // LIGHTS 
     // FRONT LIGHT 
     light = new THREE.PointLight(0xaaaaaa);
     light.position.set(0, 0, 15);
 
     // SCENE GRAPH
     neutronView.add(camera);
     neutronView.add(light);
     scene = neutronView;
     engine.render(scene, camera);
}

function protonClick(){
    view = "protonView";
    protonView = new THREE.Scene();
    proton = new Particula("proton");
    protonView.add(proton);
     // CAMERA
     camera = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
     camera.position.set(0., 0., 3.);        
     var controls = new THREE.OrbitControls(camera, canvas);   
 
     // LIGHTS 
     // FRONT LIGHT 
     light = new THREE.PointLight(0xaaaaaa);
     light.position.set(0, 0, 15);
 
     // SCENE GRAPH
     protonView.add(camera);
     protonView.add(light);
     scene = protonView;
     engine.render(scene, camera);

}

function electronClick(){
    view = "electronView";
    electronView = new THREE.Scene();
    electron = new Particula("electron");
    electronView.add(electron);
     // CAMERA
     camera = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
     camera.position.set(0., 0., 3.);        
     var controls = new THREE.OrbitControls(camera, canvas);   
 
     // LIGHTS 
     // FRONT LIGHT 
     light = new THREE.PointLight(0xaaaaaa);
     light.position.set(0, 0, 15);
 
     // SCENE GRAPH
     electronView.add(camera);
     electronView.add(light);
     scene = electronView;
     engine.render(scene, camera);
}
function atomClick()
 {
    view = atomView;
    var protonsNo = document.getElementById("ElementSelect");
    console.log(protonsNo.value);
    // FRONT SCENE
    atomView = new THREE.Scene();
    scene = atomView;
    createAtom(protonsNo.value);


    // CAMERA
    cameraAtom = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
    cameraAtom.position.set(0., 0., 20.);
    camera = cameraAtom;         
    var controls = new THREE.OrbitControls(camera, canvas);   

    // LIGHTS 
    // FRONT LIGHT 
    light = new THREE.PointLight(0xaaaaaa);
    light.position.set(0, 0, 15);

    // SCENE GRAPH
    scene.add(camera);
    scene.add(light);
    
    engine.render(scene, camera);
 }
function verifyOverlap(p1, i){

    for (var k = 0; k < particles.lenght; k++){
        if(k != i){
            var d = Math.pow(Math.pow(p1.position.x - particles[k].position.x,2) + Math.pow(p1.position.y - particles[k].position.y,2) + Math.pow(p1.position.z - particles[k].position.z,2),0.5);
            if (d < 1){
                return true;
            } else {
                return false;
            }
        }

    }


}

function attractToPoint(particles, point){
    var displacement = 0.2;

    //calculate each particle with all others
    for (var i = 0; i < particles.length; i++){


            if (particles[i].position.x < point.x){
                particles[i].position.x += displacement;
                if (verifyOverlap(particles[i], i) == true){
                    particles[i].position.x -= displacement;

                }

            }
            if (particles[i].position.x > point.x){
                particles[i].position.x -= displacement;
                if (verifyOverlap(particles[i], i) == true){
                    particles[i].position.x += displacement;

                }

            }

            if (particles[i].position.y < point.y){
                particles[i].position.y += displacement;
                if (verifyOverlap(particles[i], i) == true){
                    particles[i].position.y -= displacement;

                }
            }

            if (particles[i].position.y > point.y){
                particles[i].position.y -= displacement;
                if (verifyOverlap(particles[i], i) == true){
                    particles[i].position.y += displacement;

                }
            }

            if (particles[i].position.z < point.z){
                particles[i].position.z += displacement;
                if (verifyOverlap(particles[i], i) == true){
                    particles[i].position.z -= displacement;

                }
            }

            if (particles[i].position.z > point.z){
                particles[i].position.z -= displacement;
                if (verifyOverlap(particles[i], i) == true){
                    particles[i].position.z += displacement;

                }
            }
        



    }      


}



var particles = [];
function createAtom(protons = 1){
    /*proton = new Particula("proton");
    proton.position.set(0,0,0);
    scene.add(proton);
    console.log(proton);*/
    /*
    for (let i = 0; i < protons; i++) {
        var inicial = 2.3;
        proton = new Particula("proton");
        proton.position.set(Math.random() * (inicial) - inicial - 1, Math.random() * (inicial) - inicial - 1, Math.random() * (inicial) - inicial - 1);
        scene.add(proton);
        neutron = new Particula("neutron");
        neutron.position.set(Math.random() * (inicial) -inicial -  1, Math.random() * (inicial) - inicial - 1, Math.random() * (inicial) - inicial - 1);
        scene.add(neutron);
        proton.rotation.y = proton.rotation.y - 1.6;
        neutron.rotation.y = neutron.rotation.y - 1.6;  
        particles.push(proton);
        particles.push(neutron);


        
    }
    */
    for (let i = 0; i < protons; i++){
        proton = new Particula("proton");
        var placed = false;
        var x,y,z;
        var distance = 1.2;
        console.log("hola desde afuera");
        while(placed == false){
            console.log("hola");
            x = Math.random() * distance;
            if (Math.random() > 0.5){
                x = x * -1;
            }
            y = Math.random() * distance;
            if (Math.random() > 0.5){
                y = y * -1;
            }
            z = Math.random() * distance;  
            if (Math.random() > 0.5){
                z = z * -1;
            }          

            if (particles.length == 0){
                proton.position.set(x, y, z);
                break;
            }
            else {
                placed = true;
                for (var n = 0; n < particles.length; n++){
                    var d = Math.pow(Math.pow(x - particles[n].position.x,2) + Math.pow(y - particles[n].position.y,2) + Math.pow(z - particles[n].position.z,2),0.5);
                    if (d < 1){
                        placed = false;
                        break;
                    }

                }
            }



        }
        proton.position.set(x, y, z);
        scene.add(proton);
        particles.push(proton);


    }

    for (let i = 0; i < protons; i++){
        neutron = new Particula("neutron");
        var placed = false;
        var x,y,z;
        var distance = 1.2;
        console.log("hola desde afuera");
        while(placed == false){
            console.log("hola");
            x = Math.random() * distance;
            if (Math.random() > 0.5){
                x = x * -1;
            }
            y = Math.random() * distance;
            if (Math.random() > 0.5){
                y = y * -1;
            }
            z = Math.random() * distance;  
            if (Math.random() > 0.5){
                z = z * -1;
            }          

            if (particles.length == 0){
                neutron.position.set(x, y, z);
                break;
            }
            else {
                placed = true;
                for (var n = 0; n < particles.length; n++){
                    var d = Math.pow(Math.pow(x - particles[n].position.x,2) + Math.pow(y - particles[n].position.y,2) + Math.pow(z - particles[n].position.z,2),0.5);
                    if (d < 1){
                        placed = false;
                        break;
                    }

                }
            }



        }
        neutron.position.set(x, y, z);
        scene.add(neutron);
        particles.push(neutron);


    }
    



    accomodateElectrons(protons);


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
                console.log(electron.position.x);
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
function update()
{
    if(view == "neutronView") {
        neutron.rotation.y = neutron.rotation.y - 0.04;
    } else if ( view == "protonView" ){
        proton.rotation.y = proton.rotation.y - 0.04;
    } else if ( view == "electronView" ){
        electron.rotation.y = electron.rotation.y - 0.04;
    }
    
}

function renderLoop() 
{
    engine.autoClear = false;
    engine.clear();
    engine.render(sceneBackground, cameraBackground);
    engine.render(scene, camera);
    update();
    
    attractToPoint(particles, (0,0,0));
    requestAnimationFrame(renderLoop); 
    var baseRotation = 0.01;

	orbitas.forEach(function(v, i){
		v.rotation.y += baseRotation - (i * 0.001);
		v.rotation.x += baseRotation - (i * 0.001);
		v.rotation.z += baseRotation - (i * 0.001);
	})
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
    atomView = new THREE.Scene();
    //neutronView = new THREE.Scene();
    //protonView = new THREE.Scene();
    //electronView = new THREE.Scene();

    scene = atomView;

    // MODELS
    /*proton = new Particula();
    electron = new Particula("electron");
    electron.position.set(2., 0., 0.);
    neutron = new Particula("neutron");
    neutron.position.set(-3., 0., 0.);
    orbit = new Orbita();*/
    createAtom(6);


    // CAMERA
    cameraAtom = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
    cameraAtom.position.set(0., 0., 20.);
    camera = cameraAtom;         
    var controls = new THREE.OrbitControls(camera, canvas);   

    // LIGHTS 
    // FRONT LIGHT 
    light = new THREE.PointLight(0xaaaaaa);
    light.position.set(0, 0, 15);

    // SCENE GRAPH
    scene.add(camera);
    scene.add(light);

    // BACKGROUND SCENE
    sceneBackground = new THREE.Scene();

    // MODELS
    backgroundAtom = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 0), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/map.png"), depthTest: false}));

    // BACKGROUND CAMERA
    cameraBackground = new THREE.Camera(); 

    // BACKGROUND LIGHT
    lightBackground = new THREE.PointLight(0xaaaaaa);
    lightBackground.position.set(0, 0, 10);

    // SCENE GRAPH
    sceneBackground.add(backgroundAtom);
    sceneBackground.add(cameraBackground);
    sceneBackground.add(lightBackground);
                          
    // EVENT-HANDLERS
    window.addEventListener('resize', resizeWindow, false);

    // ACTION
    requestAnimationFrame(renderLoop);   
}

var elements = [
    ["Hydrogen", "H", 1],
    ["Helium", "He", 2],
    ["Lithium",	"Li", 3],
    ["Beryllium", "Be",4],
        ["Boron",	"B",	5],
        ["Carbon",	"C",	6],
        ["Nitrogen",	"N",	7],
        ["Oxygen","O",	8],
        ["Fluorine", "F",	9],
        ["Neon",	"Ne",	10],
        ["Sodium", "Na",	11],
        ["Magnesium", "Mg",	12],
        ["Aluminium",	"Al",	13]
]
