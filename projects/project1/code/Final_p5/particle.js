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
  
  display() {
    noStroke();
    fill(0, 20);
    ellipse(this.position.x, this.position.y, 2, 2);

    // send position to plotter every 10 frames:

    if (frameCount % 10 === 0) {
      let machineX = this.position.x / MM_TO_PX_RATIO;
      let machineY = this.position.y / MM_TO_PX_RATIO;
      //let machineZ1 = 4;
      //let machineZ2 = -4;
      //let command = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${machineZ1}, ${speed}]}\n`;
      let command2 = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${penDown}, ${speed}]}\n`;
      serial.write(command2)
      
    }
  }
  
 
    // since we are using a plotter, must change the check edges function. the prior existing version allowed the particles to "teleport" to the opposite edge of the canvas once hit edge, maintaining continuous particle motion. 
    
    // however, we instead eliminate particle once it reaches the edge. then, initialize a new particle. note: I believe we also need to send the plotter back to location (0,0).......... ?  
 checkEdges() {
   
   let machineX = this.position.x / MM_TO_PX_RATIO;
    let machineY = this.position.y / MM_TO_PX_RATIO;
    //let machineZ = 4;
   
   
  if (this.position.x > width) {
    particleOn = false;
    let command = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${penUp}, ${speed}]}\n`;
    serial.write(command);
    let command2 = `{"name": "go_to_xyz", "args": [${0}, ${0}, ${penUp}, ${speed}]}\n`;
    serial.write(command2);
    
  }
  if (this.position.x < 0) {
    particleOn = false;
    let command = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${penUp}, ${speed}]}\n`;
    serial.write(command);
    let command2 = `{"name": "go_to_xyz", "args": [${0}, ${0}, ${penUp}, ${speed}]}\n`;
    serial.write(command2);
    
  }
  if (this.position.y > height) {
    particleOn = false;
    let command = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${penUp}, ${speed}]}\n`;
    serial.write(command);
    let command2 = `{"name": "go_to_xyz", "args": [${0}, ${0}, ${penUp}, ${speed}]}\n`;
    serial.write(command2);
    
    
  }
  if (this.position.y < 0) {
    particleOn = false;
    let command = `{"name": "go_to_xyz", "args": [${machineX}, ${machineY}, ${penUp}, ${speed}]}\n`;
    serial.write(command);
    let command2 = `{"name": "go_to_xyz", "args": [${0}, ${0}, ${penUp}, ${speed}]}\n`;
    serial.write(command2);
  }
}
}