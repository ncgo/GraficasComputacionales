"use strict";
var canvas;
var engine;
var scene, atomView, sceneBackground, neutronView, protonView, electronView, scene2;
var camera, cameraBackground, cameraAtom, backgroundAtom, camera2;
var light, lightBackground;
var deepSpace, earth;
var electron, neutron, proton, atom, orbit, nucleus;
var orbitas = [];
var view = "atomView";

class Particula extends THREE.Mesh {
  constructor(type = "nucleus") {
    super();
    this.type = type;
    if (type == "proton") {
      this.geometry = new THREE.SphereGeometry(0.55, 100, 100);
      this.material = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load("img/proton.png"),
      });
    } else if (type == "neutron") {
      this.geometry = new THREE.SphereGeometry(0.6, 100, 100);
      this.material = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load("img/neutron1.png"),
      });
    } else if (type == "electron") {
      this.geometry = new THREE.SphereGeometry(0.3, 100, 100);
      this.material = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load("img/electron.png")
      });
    } else {
      this.geometry = new THREE.SphereGeometry(2, 100, 100);
      this.material = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load("img/nucleus.png")});
      }
    new THREE.Mesh(this.geometry, this.material);
  }

  setPhongMaterial(shininess = 30) {
    this.material = new THREE.MeshPhongMaterial({
      color: this.color,
      shininess: shininess,
    });
  }
}

const baseRadius =
  window.innerWidth > window.innerHeight
    ? window.innerHeight - 40 / 2
    : window.innerWidth - 40 / 2;

class Orbita extends THREE.Mesh {
  constructor(ringNo = 1) {
    super();
    this.ringNo = ringNo;
    if (ringNo === 1) {
      this.radius = 5;
    } else {
      this.radius = 1.8 * this.ringNo + 5;
    }
    this.geometry = new THREE.TorusGeometry(
      this.radius,
      0.025,
      20,
      100,
      Math.Pi * 2
    );
    this.material = new THREE.MeshLambertMaterial("#F7FFF7");
    new THREE.Mesh(this.geometry, this.material);
    //this.rotation.x = 0;
  }
}

function neutronClick() {
  var text = document.getElementById("neutronText");
  console.log(text.style.display);
  if (text.style.display === "none") {
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
  console.log("neutronClick");
  view = "neutronView";
  neutronView = new THREE.Scene();
  neutron = new Particula("neutron");
  neutronView.add(neutron);
  // CAMERA
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(0, 0, 3);
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

function protonClick() {
  
  var text = document.getElementById("protonText");
  console.log(text.style.display);
  if (text.style.display === "none") {
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
  view = "protonView";
  protonView = new THREE.Scene();
  proton = new Particula("proton");
  protonView.add(proton);
  // CAMERA
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(0, 0, 3);
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

function electronClick() {
    var text = document.getElementById("electronText");
  console.log(text.style.display);
  if (text.style.display === "none") {
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
  view = "electronView";
  electronView = new THREE.Scene();
  electron = new Particula("electron");
  electronView.add(electron);
  // CAMERA
  camera = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera.position.set(0, 0, 3);
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

function nucleusClick() {
    if (view == "atomView") { 
        var text = document.getElementById("nucleusText");
        console.log(text.style.display);
        if (text.style.display === "none") {
            camera.position.set(0,0,8);
            text.style.display = "block";
        } else {
            camera.position.set(0,0,20);
            text.style.display = "none";
        }
    }
 
}

function atomClick() {
  view = "atomView";
  var protonsNo = document.getElementById("ElementSelect");
  console.log(protonsNo.value);
  alert("YOU HAVE SELECTED A "+ elements[protonsNo.value][0]+" ATOM");
  // FRONT SCENE
  atomView = new THREE.Scene();
  scene = atomView;
  createAtom(protonsNo.value);

  // CAMERA
  cameraAtom = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  cameraAtom.position.set(0, 0, 20);
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
function verifyOverlap(p1, i) {
  for (var k = 0; k < particles.lenght; k++) {
    if (k != i) {
      var d = Math.pow(
        Math.pow(p1.position.x - particles[k].position.x, 2) +
          Math.pow(p1.position.y - particles[k].position.y, 2) +
          Math.pow(p1.position.z - particles[k].position.z, 2),
        0.5
      );
      if (d < 1) {
        return true;
      } else {
        return false;
      }
    }
  }
}

/*function attractToPoint(particles, point) {
  var displacement = 0.2;

  //calculate each particle with all others
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].position.x < point.x) {
      particles[i].position.x += displacement;
      if (verifyOverlap(particles[i], i) == true) {
        particles[i].position.x -= displacement;
      }
    }
    if (particles[i].position.x > point.x) {
      particles[i].position.x -= displacement;
      if (verifyOverlap(particles[i], i) == true) {
        particles[i].position.x += displacement;
      }
    }

    if (particles[i].position.y < point.y) {
      particles[i].position.y += displacement;
      if (verifyOverlap(particles[i], i) == true) {
        particles[i].position.y -= displacement;
      }
    }

    if (particles[i].position.y > point.y) {
      particles[i].position.y -= displacement;
      if (verifyOverlap(particles[i], i) == true) {
        particles[i].position.y += displacement;
      }
    }

    if (particles[i].position.z < point.z) {
      particles[i].position.z += displacement;
      if (verifyOverlap(particles[i], i) == true) {
        particles[i].position.z -= displacement;
      }
    }

    if (particles[i].position.z > point.z) {
      particles[i].position.z -= displacement;
      if (verifyOverlap(particles[i], i) == true) {
        particles[i].position.z += displacement;
      }
    }
  }
}*/

var particles = [];
function createAtom(protons = 1) {
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
   if( protons <= 23 ){
    for (let i = 0; i < protons; i++) {
      particles = [];
      proton = new Particula("proton");
      var placed = false;
      var x, y, z;
      var distance = 1.2;
      console.log("hola desde afuera");
      while (placed == false) {
        console.log("hola");
        x = Math.random() * distance;
        if (Math.random() > 0.5) {
          x = x * -1;
        }
        y = Math.random() * distance;
        if (Math.random() > 0.5) {
          y = y * -1;
        }
        z = Math.random() * distance;
        if (Math.random() > 0.5) {
          z = z * -1;
        }
  
        if (particles.length == 0) {
          proton.position.set(x, y, z);
          break;
        } else {
          placed = true;
          for (var n = 0; n < particles.length; n++) {
            var d = Math.pow(
              Math.pow(x - particles[n].position.x, 2) +
                Math.pow(y - particles[n].position.y, 2) +
                Math.pow(z - particles[n].position.z, 2),
              0.5
            );
            if (d < 1) {
              placed = false;
              break;
            }
          }
        }
      }
      proton.position.set(x, y, z);
      proton.rotation.y = proton.rotation.y - 1.6;
      scene.add(proton);
      particles.push(proton);
    }
  
    for (let i = 0; i < protons; i++) {
      neutron = new Particula("neutron");
      var placed = false;
      var x, y, z;
      var distance = 1.2;
      console.log("hola desde afuera");
      while (placed == false) {
        console.log("hola");
        x = Math.random() * distance;
        if (Math.random() > 0.5) {
          x = x * -1;
        }
        y = Math.random() * distance;
        if (Math.random() > 0.5) {
          y = y * -1;
        }
        z = Math.random() * distance;
        if (Math.random() > 0.5) {
          z = z * -1;
        }
  
        if (particles.length == 0) {
          neutron.position.set(x, y, z);
          break;
        } else {
          placed = true;
          for (var n = 0; n < particles.length; n++) {
            var d = Math.pow(
              Math.pow(x - particles[n].position.x, 2) +
                Math.pow(y - particles[n].position.y, 2) +
                Math.pow(z - particles[n].position.z, 2),
              0.5
            );
            if (d < 1) {
              placed = false;
              break;
            }
          }
        }
      }
      neutron.position.set(x, y, z);
      neutron.rotation.y = neutron.rotation.y - 1.6; 
      scene.add(neutron);
      particles.push(neutron);
    }
   } else if(protons>=24){
      nucleus = new Particula();
      nucleus.position.set(0,0,0);
      scene.add(nucleus);
   }


  

  accomodateElectrons(protons);
}

var orbitalMax = [2, 8, 18, 32, 64, 54];
var orbitalMaxSum = [2, 10, 28, 60, 124, 178];
function accomodateElectrons(electrons = 1) {
  var e = electrons;
  for (let i = 0; i <= 4; i++) {
    if (e > 0) {
      //var electronsArr = [];
      var group = new THREE.Group();
      orbit = new Orbita(i + 1);
      group.add(orbit);
      var electronCount = e > orbitalMax[i] ? orbitalMax[i] : e;
      var angleIncrement = (Math.PI * 2) / electronCount;
      var angle = 0;
      for (let j = 0; j < electronCount; j++, e--) {
        electron = new Particula("electron");
        // Solve for x and y.
        var posX = orbit.radius * Math.cos(angle);
        var posY = orbit.radius * Math.sin(angle);
        electron.position.set(posX, posY, 0);
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
function update() {
  if (view == "neutronView") {
    neutron.rotation.y = neutron.rotation.y - 0.04;
  } else if (view == "protonView") {
    proton.rotation.y = proton.rotation.y - 0.04;
  } else if (view == "electronView") {
    electron.rotation.y = electron.rotation.y - 0.04;
  }
}

function renderLoop() {
  engine.autoClear = false;
  engine.clear();
  //legend();
  engine.render(backgroundAtom, cameraBackground);
  engine.setViewport( 10, window.innerHeight - 300, 30, 30 );
  update();
  engine.setViewport( 0, 0, window.innerWidth, window.innerHeight );
  engine.render( scene, camera );
  engine.clearDepth(); // important! clear the depth buffer
  //engine.render( scene2, camera);
  requestAnimationFrame(renderLoop);
  var baseRotation = 0.01;

  orbitas.forEach(function (v, i) {
    v.rotation.y += baseRotation - i * 0.001;
    v.rotation.x += baseRotation - i * 0.001;
    v.rotation.z += baseRotation - i * 0.001;
  });
}
/*
function legend() {
   scene2 = new THREE.Scene();
   electron = new Particula("electron");
   electron.position.set(-3,0,0);
   proton = new Particula("proton");
   proton.position.set(-3,0,0);
   neutron = new Particula("neutron");
   proton.position.set(-3,0,0);
   scene2.add(electron);
   scene2.add(proton);
   scene2.add(neutron);
  // CAMERA
  camera2 = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  camera2.position.set(0, 0, 3);
  var controls = new THREE.OrbitControls(camera2, canvas);

  // LIGHTS
  // FRONT LIGHT
  light = new THREE.PointLight(0xaaaaaa);
  light.position.set(0, 0, 15);

  // SCENE GRAPH
  scene2.add(camera2);
  scene2.add(light);
  sceneBackground = new THREE.Scene();

  // MODELS
  backgroundAtom = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("img/map.png"),
      depthTest: false,
    })
  );

  // BACKGROUND CAMERA
  cameraBackground = new THREE.Camera();

  // BACKGROUND LIGHT
  lightBackground = new THREE.PointLight(0xaaaaaa);
  lightBackground.position.set(0, 0, 10);

  // SCENE GRAPH
  sceneBackground.add(backgroundAtom);
  sceneBackground.add(cameraBackground);
  sceneBackground.add(lightBackground);

}*/

function main() {
  // CANVAS
  canvas = document.getElementById("canvas");

  // RENDERER ENGINE
  engine = new THREE.WebGLRenderer({ canvas: canvas });
  engine.setSize(window.innerWidth / 1.2, window.innerHeight / 1.1);
  engine.setClearColor(new THREE.Color(0.2, 0.2, 0.35), 1);

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
  cameraAtom = new THREE.PerspectiveCamera(
    60,
    canvas.width / canvas.height,
    0.01,
    10000
  ); // CAMERA
  cameraAtom.position.set(0, 0, 20);
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
  backgroundAtom = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("img/map.png"),
      depthTest: false,
    })
  );

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
  window.addEventListener("resize", resizeWindow, false);

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
  ["Aluminium",	"Al",	13],
  ["Silicon",	"Si",	14],
  ["Phosphorus",	"P",	15],
  ["Sulfur",	"S",	16],
  ["Chlorine",	"Cl",	17],
  ["Argon",	"Ar",	18],
  ["Potassium",	"K",	19],
  ["Calcium",	"Ca",	20],
  ["Scandium",	"Sc",	21],
  ["Titanium",	"Ti",	22],
  ["Vanadium",	"V",	23],
  ["Chromium",	"Cr",	24],
  ["Manganese",	"Mn",	25],
  ["Iron",	"Fe",	26],
  ["Cobalt",	"Co",	27],
  ["Nickel",	"Ni",	28],
  ["Copper",	"Cu",	29],
  ["Zinc",	"Zn",	30],
  ["Galium",	"Ga",	31],
  ["Germanium",	"Ge",	32],
  ["Arsenic",	"As",	33],
  ["Selenium",	"Se",	34],
  ["Bromine",	"Br",	35],
  ["Krypton",	"Kr",	36],
  ["Rubidium",	"Rb",	37],
  ["Strontium",	"Sr",	38],
  ["Yttrium",	"Y",	39],
  ["Zirconium",	"Zr",	40],
  ["Niobium",	"Nb",	41],
  ["Molibdenum",	"Mu",	42],
  ["Technetium",	"Tc",	43],
  ["Ruthenium",	"Ru",	44],
  ["Rhotium",	"R",	45],
  ["Palladium",	"Pd",	46],
  ["Silver",	"Ag",	47],
  ["Cadmium",	"Cd",	48],
  ["Indium",	"In",	49],
  ["Tin",	"Sn",	50],
  ["Antimony",	"Sb",	51],
  ["Tellurium",	"Te",	52],
  ["Iodine",	"I",	53],
  ["Xenon",	"Xe",	54],
  ["Caesium",	"Cs",	55],
  ["Barium",	"Ba",	56],
  ["Lanthanum",	"La",	57],
  ["Cerium",	"Ce",	58],
  ["Praseodymium",	"Pr",	59],
  ["Neodynium",	"Nd",	60],
  ["Promethium",	"Pm",	61],
  ["Samarium",	"Sm",	62],
  ["Europium",	"Eu",	63],
  ["Gadolinium",	"Gd",	64],
  ["Terbium",	"Tb",	65],
  ["Dysprosium",	"Dy",	66],
  ["Holmium",	"Ho",	67],
  ["Erbium",	"Er",	68],
  ["Thulium",	"Tm",	69],
  ["Ytterbium",	"Yb",	70],
  ["Lutetium",	"Lu",	71],
  ["Hafnium",	"Hf",	72],
  ["Tantalum",	"Ta",	73],
  ["Tungsten",	"W",	74],
  ["Rhenium",	"Re",	75],
  ["Osmium",	"Os",	76],
  ["Iridium",	"Ir",	77],
  ["Platinum",	"Pt",	78],
  ["Gold",	"Au",	79],
  ["Mercury",	"Hg",	80],
  ["Thalium",	"Tl",	81],
  ["Lead",	"Pb",	82],
  ["Bismuth",	"Bi",	83],
  ["Polonium",	"Po",	84],
  ["Astatine",	"At",	85],
  ["Radon",	"Rn",	86],
  ["Francium",	"Fr",	87],
  ["Radium",	"Ra",	88],
  ["Actinium",	"Ac",	89],
  ["Thorium",	"Th",	90],
  ["Protactinium",	"Uranium",	91],
  ["Uranium",	"U",	92],
  ["Neptunium",	"Np",	93],
  ["Plutonium",	"Pu",	94],
  ["Amercium",	"Am",	95],
  ["Curium",	"Cm",	96],
  ["Berkelium",	"Bk",	97],
  ["Californium",	"Cf",	98],
  ["Einstenium",	"Es",	99],
  ["Fermium",	"Fm",	100],
  ["Mendeleviur",	"Md",	101],
  ["Nobelium",	"No",	102],
  ["Lawrencium",	"Lr",	103],
  ["Rutherfordium",	"Rf",	104],
  ["Dubnium",	"Db",	105],
  ["Seaborgium",	"Sg",	106],
  ["Bohrium",	"Bh",	107],
  ["Hassium",	"Hs",	108],
  ["Meitnerium",	"Mt",	109],
  ["Darmstadtium",	"Ds",	110],
  ["Roentgenium",	"Rg",	111],
  ["Copernicium",	"Cn",	112],
  ["Nihonium",	"Nh",	113],
  ["Flerovium",	"Fl",	114],
  ["Moscovium",	"Mc",	115],
  ["Livermorium",	"Lv",	116],
  ["Tennessine",	"Ts",	117],
  ["Oganesson",	"Og",	118]
]
