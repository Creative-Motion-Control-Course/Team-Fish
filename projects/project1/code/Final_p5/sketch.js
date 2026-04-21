/*
ERIC AND FIONA P5 SKETCH! 
Using Perlin flowfield base code from Patt Vira's Tutorial: Flow Field (Perlin Noise)
*/

// VECTOR FIELD/PARTICLE SYSTEM VARIABLES:
let cols;
let rows;
let size = 50;
let arrows = [];
let r = size / 2;
let xoff = 0;
let yoff = 0;
let zoff = 0;
let increment = 0.1;

let particles = [];
let num = 1;

let oldParticleX;
let oldParticleY;

let penUp = -4;
let penDown = 3;

// WAVE DATA VARIABLES:
const waterLevels = [];
let mappedWaterLevels = [];
let f = 0;

// SERIAL CONNECTION VARIABLES:
let serial;
let serialPort = "/dev/tty.usbmodem161560201";
const MACHINE_X = 300;
const MACHINE_Y = 218;
const MM_TO_PX_RATIO = 2;

let particleOn = false;

// function penUp() {
//   console.log("calling penUp");
//   serial.write(`{"name": "pen_up"}\n`);
// }

// function penDown() {
//   console.log("calling penDown");
//   serial.write(`{"name": "pen_down"}\n`);
// }

const intervalId = setInterval(() => {
  f += 1;
  console.log("Triggered every 6 min");
}, 360000);

const intervalParticle = setInterval(() => {
  if (particleOn == false) {
    createParticle();
    particleOn = true;
    console.log("Triggered every 1 min");
  }
}, 30000);

const speed = 15.0;

function callGoTo(x, y) {
  console.log("calling: go to at: " + x + ", " + y);
  serial.write(`{"name": "go_to_xy", "args": [${x}, ${y}, ${speed}]}\n`);
}

function serverConnected() {
  updateConnectionStatus("Connected");
  print("Connected to Server");
}

function gotError(theerror) {
  print(theerror);
  updateConnectionStatus("Error: " + theerror);
}

function updateConnectionStatus(status) {
  document.getElementById(
    "connection-status"
  ).innerHTML = `Connection to ${serialPort} : ${status}`;
}

function gotOpen() {
  print("Serial Port is Open");
  updateConnectionStatus("Open");
}

function gotClose() {
  print("Serial Port is Closed");
  updateConnectionStatus("Closed");
}

function gotData() {
  let currentString = serial.readStringUntil("\n");
  if (currentString == "") return;
  console.log(currentString);
}


async function setup() {
  createCanvas(600, 300);
  cols = width / size;
  rows = height / size;
  angleMode(DEGREES);
  background(255);


  // INIT SERIAL CONNECTION:
  serial = new p5.SerialPort();
  serial.open(serialPort, { baudrate: 115200 });
  serial.on("connected", serverConnected);
  serial.on("data", gotData);
  serial.on("error", gotError);
  serial.on("open", gotOpen);
  serial.on("close", gotClose);

  let command = `{"name": "go_to_xyz", "args": [${0}, ${0}, ${penUp}, ${speed}]}\n`;
  
  
  createParticle();

  // GO TO inputs:
  let inputX = createInput("0");
  inputX.parent("go-to-row");

  let inputY = createInput("0");
  inputY.parent("go-to-row");

  let buttonGoTo = createButton("Go");
  buttonGoTo.parent("go-to-row");
  buttonGoTo.mousePressed(() =>
    callGoTo(parseFloat(inputX.value()), parseFloat(inputY.value()))
  );

  // FETCHING WAVE DATA:
  const url =
    "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level&application=frank.zappa&datum=MLLW&station=9411340&time_zone=gmt&units=english&format=csv&begin_date=20240131&end_date=20240131";

  const res2 = await fetch(url);
  const csvText = await res2.text();

  const rows2 = csvText.trim().split("\n");
  const header = rows2[0];

  for (let i = 1; i < rows2.length; i++) {
    const cols2 = rows2[i].split(",");
    const level = parseFloat(cols2[1]);
    if (!isNaN(level)) {
      waterLevels.push(level);
    }
  }

  console.log(waterLevels);
  mappedWaterLevels = waterLevels.map((x) =>
    map(x, min(waterLevels), max(waterLevels), 0, 1)
  );
  console.log(mappedWaterLevels);

}

function createParticle() {
  for (let i = 0; i < num; i++) {
    particles[i] = new Particle(random(0, width), random(0, height));
    
    let oldParticleX = particles[i].position.x;
      let oldParticleY = particles[i].position.y;
      
      let machineX = oldParticleX / MM_TO_PX_RATIO;
      let machineY = oldParticleY / MM_TO_PX_RATIO;
      //let machineZ1 = 8;
      //let machineZ2 = -4;
    let command = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${penUp}, ${speed}]}\n`;
    serial.write(command);
    // go to particle.x, particle.y, pen_up

  }
  particleOn = true;
}

 

function draw() {
  // guard: wait until wave data is loaded and f is in bounds
  if (!mappedWaterLevels.length || f >= mappedWaterLevels.length) return;

  increment = mappedWaterLevels[f];

  fill(255);
  stroke(0);
  xoff = 0;
  for (let i = 0; i < cols; i++) {
    arrows[i] = [];
    yoff = 0;
    for (let j = 0; j < rows; j++) {
      let angle = map(noise(xoff, yoff, zoff), 0, 1, 0, 360);
      arrows[i][j] = createVector(cos(angle), sin(angle));

      let pt0 = createVector(size / 2 + i * size, size / 2 + j * size);
      let pt1 = createVector(r * arrows[i][j].x, r * arrows[i][j].y);

      yoff += increment;
    }
    xoff += increment;
    zoff += 0.001;
  }

  
  if (particleOn == true) {
    
    for (let i = 0; i < num; i++) {
      particles[i].checkEdges();
      particles[i].direction(arrows);
      particles[i].update();
      
      
      
      
     // let command = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${machineZ1}, ${speed}]}\n`;
      //serial.write(command);
      particles[i].display();  // <-- this is where the serial write happens, in particle.js
    }
  }
}