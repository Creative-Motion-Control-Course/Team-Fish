---
layout: default
title: "Tidal Etchings"
---

# Project 1: [Tidal Etchings]

## Concept
We envision using tide data, specifically water level data, to drive the plotter, sourcing this information from publicly available ocean data. Applying a Fast Fourier Transform (FFT) to the changing of tides generates the following striking visuals:
![Tide Example](assets/tides1.png)
Source: Eric Rennie, MAT 201A Final - [Wave Analysis](https://colab.research.google.com/drive/1wMDJQnCfFCxfJfh0BmFAmVRZFt0H-DMc?usp=sharing#scrollTo=px44jtXfb3IZ)

[The National Oceanic and Atmospheric Administration (NOAA) Data Retrieval API](https://api.tidesandcurrents.noaa.gov/api/prod/) offers us the ability to fetch water level data at various intervals, including in 1 minute or 6 minute intervals, hourly, daily, and monthly. We imagine translating this data into lines which curve and bend through the influence of ocean data, turning the sea into the artist. Our approach is to increase the amount of noise/distortion the higher the tide is. Not only does this data change dependent on location-it's also influenced by the location's weather, position of the moon, and the approximate 50-minute tide shift that happens each day. We envision creating a series of images to show these variations. 

Our aesthetic inspirations include more traditional examples of plotter art that capture three-dimensional-esque textures in a beautiful way. We are especially inspired by [Jazer's Piece](https://www.instagram.com/reel/DDQtjU5pk2v/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D).

We are interested in exploring negative space and subtractive rather than additive texture. For this reason, we are drawn to etching or engraving rather than ink/paint. On a secondary level, this echoes the ability of tides to erode and shape the coastline, so there's also a conceptual draw to this technique. This might involve using the following, which is nostalgic from both our childhoods: ![Engraving](assets/engrave.jpg)

Furthermore, as a reach goal, we are interested in then retranslating or "photographing" our plotter generated design using cyanotype process. This would involve creating an image negative transparency as an overlay by scanning the image and inverting in some photo editing software. The developing stage would take place at the coast, where the data used to generate the image was sourced. This would effectively reintroduce it back into its natural environment. From here, it would be possible to further augment the chemical reaction with additives (shifting the color from traditional Prussian blue), potentially also from the coastal site of data collection. 

Here is an example of a cyanotype image of cloth: ![Cyan](assets/cyanotype.jpg)

## Design

(Explain your design process. What choices did you make and why?)

We were very excited about embossing, and this dictated the form our hardware took. As detailed above in our proposal, we were particularly drawn to subtractive mediums, on both a conceptual and aesthetic level. 

For the plotter path output, we were compelled to work with a Perlin noise flowfield. We initially struggled to decide how best to map our tide data water level to each generated line. We wanted cohesion to exist across the outputted image, but since we would be applying a noise/amplification effect to each individual one, this would not result in such cohesion. Instead, we decided to map water level to a parameter within a dynamic vector field. This way, sequential lines would share similar trajectories given their temporal proximity and common flowfield. 

To create a dynamic flowfield, we worked from a wonderful YouTube code tutorial and example by Patt Vira, video link and original p5 sketch available at: https://www.youtube.com/watch?v=KOgRn2Brcdo, https://editor.p5js.org/pattvira/sketches/R5sp8PVXl. Going into the code and uncommenting the vector angles, it's possible to see how they dynamically swing at each time step. So, we decided to link the "increment" between each vector angle -- corresponding to how similar they are to one another -- to our value for water level. Thus, more dynamic paths are created during higher water level times, but each line is related to the one before and after it. 

Due to plotter constraints, we had to change the sketch further. Our modifications are as follows:
1. The plotter can only draw one line at a time, corresponding to a single particle. Thus, we limited the scope of our system to one particle.

2. The plotter cannot teleport, but particles can (falling off the canvas spawns them on the opposite side). To combat this, we delete our current particle once it reaches the edge of the canvas. 

Additionally, for the sake of prototyping, we made the design choice to just work with a set amount of data, within a 24 hour bound. We believe that extending the project with live data is both feasible and also relatively straightforward, given that our flowfield updates every six minutes (minimum API call for NOAA).  

## Implementation

(Describe how you implemented your project using the StepDance library.)

Our primary challenge was navigating the flow of data. Eric already had fetched NOAA data within p5 and we were working from a prior-existing Perlin noise flowfield p5 sketch framework. For this reason, it made the most sense to us to work to generate flowfield particle lines within p5.js, and then send this location information to StepDance. 

To accomplish this, we used the p5_ui Arduino sketch as provided within the StepDance Axidraw examples. We also referenced Emilie Yu's sketch example for controlling a machine through a p5 interface in StepDance, available at: https://editor.p5js.org/em-yu/sketches/oLFB8F0hn. The serial connection between p5 and Arduino relies on the p5.serialcontrol desktop application. 

Here, we observe the 

![Hardware setup photo](assets/earlyprototype2.jpg)


### Hardware Setup

(Describe your hardware configuration.)

Our hardware setup does not drastically differ from the original Axidraw configuration. The primary challenge was to apply the correct amount of tension to the embosser tip, versus the traditional gravity-ruled pen down design. Here, observe our rubber-band assisted embossing tip setup.

![Hardware setup photo](assets/tensiontip.jpg)

This effectively provides enough additional pressure to dent the metal surface. We tried several pen heights, finding that too much pressure causes a rough line, and too little just scratches the surface. Here, we can see a line created with excess force (circled in red) versus one with appropriate tension. 

![Hardware setup photo](assets/tensionlines2.jpg)

We tried multiple different configurations for the embossed metal sheet. More specifically, we were uncertain if a hard or soft surface would provide the best embossing base. We found that a soft surface provided the clearest lines. So, our final setup included a soft styrofoam pad under the metal surface. We can see this underlying, soft surface in the following image: 

![Hardware setup photo](assets/softsurface2.jpg)

Another adjustment we made -- given the additional pressure required for embossing, our first servo motor burned out so we had to install a more powerful one. Here, see the new motor:

*INSERT IMAGE HERE*

### Code Overview

The majority of our code exists in a p5.js sketch. The full code is available within the code folder of this Project 1 Github. 

(Highlight key parts of your code and explain your approach:)

The first step in our workflow is establishing serial connection and fetching tide data.
```cpp
// within setup, initialize new serial port. note that we have already defined all of the necessary functions prior to setup.
serial = new p5.SerialPort();
serial.open(serialPort, { baudrate: 115200 });
serial.on("connected", serverConnected);

// we also create go to inputs and buttons 
 let inputX = createInput("0");
  inputX.parent("go-to-row");

  let inputY = createInput("0");
  inputY.parent("go-to-row");

  let buttonGoTo = createButton("Go");
  buttonGoTo.parent("go-to-row");
  buttonGoTo.mousePressed(() =>
    callGoTo(parseFloat(inputX.value()), parseFloat(inputY.value()))
  );

// we then fetch wave data
const url =
    "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level&application=frank.zappa&datum=MLLW&station=9411340&time_zone=gmt&units=english&format=csv&begin_date=20240131&end_date=20240131";

  const res2 = await fetch(url);
  const csvText = await res2.text();

// after importing the data, we unpack it line by line and then extract the water level information from each entry. this full code is available in our sketch file. 

```

The particle class contains several essential functions. We define x, y positions, and determine how each particle moves. 
```cpp

// here, we define a simple physics engine, taking into consideraton position, velocity, and acceleration. this framework is from Patt Vira's tutorial.

class Particle {
  constructor(x, y) { // location parameters
    this.positionX= createVector(x);
    this.positionY = createVector(y);
    this.position = createVector(x, y); // position vector w/x, y param 
    this.velocity = createVector(0, 0);   // creating physics engine 
    this.acceleration = createVector(0, 0);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(2);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  direction(flowfield) {
    let i = floor(this.position.x / size);
    let j = floor(this.position.y / size);
    i = constrain(i, 0, cols-1);
    j = constrain(j, 0, rows-1);
    let force = createVector(flowfield[i][j].x, flowfield[i][j].y);
    this.applyForce(force);
  }

```

One key aspect of our code was the sequence order. We programmed a particle to toggle on or off at various times, and separately control pen up/pen down. 
```cpp
// pen up is set initially in our setup function:
 let command = `{"name": "go_to_xyz", "args": [${0}, ${0}, ${4}, ${speed}]}\n`;


// within our particle create function, we keep pen up while moving to the appropriate starting location
let machineX = oldParticleX / MM_TO_PX_RATIO;
let machineY = oldParticleY / MM_TO_PX_RATIO;
let machineZ1 = 8;
 let command = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${machineZ1}, ${speed}]}\n`;
    serial.write(command);

// within the display loop (doubles as particle draw loop) we then lower the pen:
let command2 = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${machineZ2}, ${speed}]}\n`;


// as a particle reaches the edge of the canvas, particle toggles off and move pen up. This required two separate calls in quick sequence:
    particleOn = false;
    let command = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${machineZ}, ${speed}]}\n`;
    serial.write(command);
    let command2 = `{"name": "go_to_xyz", "args": [${0}, ${0}, ${machineZ}, ${speed}]}\n`;
    serial.write(command2);

```
Another primary feature was sending the XY coordinates via serial monitor every ten frames. This occurs within our draw loop, which then calls the appropriate particle defined functions, including this display function. 
```cpp
// coordinates are sent within display
let machineX = this.position.x / MM_TO_PX_RATIO;
let machineY = this.position.y / MM_TO_PX_RATIO;
let machineZ2 = -4;
let command2 = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${machineZ2}, ${speed}]}\n`;
      serial.write(command2)

```

Finally, we heavily relied on timed calls in order to update flowfield every six minutes, and create a new particle every one minute. 

```cpp
// every six minutes, update our variable "f" which corresponds to the current index of tide data. This is used to set the "increment" parameter 
const intervalId = setInterval(() => {
  f += 1;
  console.log("Triggered every 6 min");
}, 360000);

// here, we call createParticle() method every one minute
const intervalParticle = setInterval(() => {
  if (particleOn == false) {
    createParticle();
    particleOn = true;
    console.log("Triggered every 1 min");
  }
}, 60000);

```

## Results

Here is our plotter in action. The video is as follows:

<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
* NOTE: need to take video tmw morning *

*Replace the iframe above with your actual video URL, or use a local video:*

<!--
<video width="560" controls>
  <source src="assets/demo-video.mp4" type="video/mp4">
</video>
-->

## Reflection

What did you learn? What would you do differently?

An area we spent substantial time learning about was the StepDance queue of commands -- how it works and how to work around this structure when necessary. The pen up / pen down learning curve was extremely useful in helping to cement this concept! 

One area for potential expansion is within the serial connection between p5 and StepDance. The p5.serialconnection desktop application was incredibly buggy, and we had to reconnect many, many times within our process of testing. Though, I would not do this differently, since we learned so much about the connection through this troubleshooting. Moving forward, a more stable alternative connection would be wonderful. 

Additionally, we would ultimately like to integrate the live tide data into this project with the NOAA API call in realtime.
