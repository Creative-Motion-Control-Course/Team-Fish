// Code written by Jennifer Jacobs, Emilie Yu, & Alejandro Aponte
// Adapted by Fiona Irving-Beck & Eric Rennie
// Some comments have been generated with AI assistance
// All AI generated comments have been reviewed and approved by the authors. 

#include <SD.h>

#define module_driver  // Tells stepdance.hpp to compile in the motor driver module

#include "stepdance.hpp"

// ─── Hardware Objects ─────────────────────────────────────────────────────────

// Pantograph XY input plugged in input_a
// InputPort input_a;

// ENDER XYZ plugged into output ports
// Each OutputPort maps to a physical connector on the stepdance PCB.
OutputPort output_a;   // X axis
OutputPort output_b;   // Y axis
OutputPort output_c;   // Z axis (pen up/down)

// Corresponding channels for the ENDER
// A Channel wraps an OutputPort and adds motion control (ratio scaling, filtering, inversion).
Channel channel_a;   // X axis motion
Channel channel_b;   // Y axis motion
Channel channel_z;   // Z axis motion (pen height)

// ─── Inputs ───────────────────────────────────────────────────────────────────

// Inputs
Encoder encoder_1;  // left knob, controls horizontal
//Encoder encoder_2;  // right knob, controls vertical

// ─── Motion Generators ───────────────────────────────────────────────────────

// -- Position Generator for Pen Up/Down --
// Used to drive channel_z to a fixed absolute position (e.g. pen raised or lowered).
PositionGenerator position_gen;

// -- Time based interpolator (used for sending XY motion commands from the p5 sketch) --
// Accepts a queue of absolute move targets and smoothly interpolates between them over time.
TimeBasedInterpolator tbi;

// ─── RPC ─────────────────────────────────────────────────────────────────────

// -- Remote Procedure Call --
// This is the object that will listen for messages over Serial, and trigger callback functions.
// In setup, we will map callback functions to specific Serial messages.
// The Python server will be responsible for sending 
RPC rpc;

char incomingByte = 0;   // Reserved for future raw-serial reading (currently unused)


// ─── Setup ───────────────────────────────────────────────────────────────────

void setup() {
  // Make sure the baudrate matches between this number and the one in p5 sketch: serial.open(serialPort, { baudrate: 115200});
  // NB: in Stepdance RPC code, 115200 is the baudrate used, so we stick to that throughout.
  Serial.begin(115200);

  // -- Configure and start the output ports --
  output_a.begin(OUTPUT_A); // "OUTPUT_A" specifies the physical port on the PCB for the output.
  output_b.begin(OUTPUT_B);
  output_c.begin(OUTPUT_C);

  // Enable the output drivers
  enable_drivers();

  // X axis: 1:80 step ratio, low-pass filter at 200 Hz for smooth motion
  channel_a.begin(&output_a, SIGNAL_E); // Connects the channel to the "E" signal on "output_a".
  channel_a.set_ratio(1, 80);
  //channel_a.invert_output(); // test and see if we need to invert or not !
  channel_a.enable_filtering(200);

  // Y axis: same ratio as X but output inverted so both axes move in the same logical direction
  channel_b.begin(&output_b, SIGNAL_E);
  channel_b.set_ratio(1, 80);
  channel_b.invert_output();
  channel_b.enable_filtering(200);

  // Z axis: higher step ratio (1:400) for finer pen height control; no filtering needed
  channel_z.begin(&output_c, SIGNAL_E);
  channel_z.set_ratio(1, 400);
  channel_z.invert_output();

  // Left encoder (encoder_1) manually controls the Z axis (pen height)
  // Ratio 10:2400 scales knob counts to Z position units; inverted to match physical direction
  encoder_1.begin(ENCODER_1);
  encoder_1.set_ratio(10, 2400); 
  encoder_1.output.map(&channel_z.input_target_position);   // Wire encoder output → Z target
  encoder_1.invert();

  // -- Configure Position Generator --
  // position_gen drives Z to absolute positions (used by pen_up / pen_down callbacks)
  position_gen.output.map(&channel_z.input_target_position);
  position_gen.begin();

  // TBI (can be used to test that the homing works properly)
  // Wire TBI outputs to each axis's target-position input
  tbi.begin();
  tbi.output_x.map(&channel_a.input_target_position);
  tbi.output_y.map(&channel_b.input_target_position);
  tbi.output_z.map(&channel_z.input_target_position);

  // -- RPC Configuration
  // Register named commands that the host (p5 / Python server) can call over Serial as JSON.
  rpc.begin();

  // Call example: {"name": "hello"}
  // expected result: serial monitor prints "hello!{"result":"ok"}"
  rpc.enroll("hello", say_hello);

  // Pen height commands — move Z to a fixed down or up position
  rpc.enroll("pen_down", pen_down);
  rpc.enroll("pen_up", pen_up);

  // Motor power commands — useful for releasing the axes for manual positioning
  rpc.enroll("drivers_off", motors_disable);
  rpc.enroll("drivers_on", motors_enable);

  // {"name": "go_to_xy", "args": [6, 5, 10]}
  // args are: absolute X, absolute Y, speed (mm/s)
  rpc.enroll("go_to_xy", go_to_xy);

  // {"name": "go_to_xyz", "args": [6, 5, 4, 10]}
  // args are: absolute X, absolute Y, absolute Z, speed (mm/s)
  rpc.enroll("go_to_xyz", go_to_xyz);


  // Start the stepdance motion engine
  dance_start();

  Serial.println("started!");
}

// ─── Loop ─────────────────────────────────────────────────────────────────────

LoopDelay overhead_delay;   // Throttle helper — fires report_overhead every 100 ms

void loop() {
  // Run the stepdance motion engine (processes queued moves, updates channels)
  dance_loop();
  // Periodically log loop timing diagnostics (every 100 ms)
  overhead_delay.periodic_call(&report_overhead, 100);
}

// ─── RPC Callbacks ────────────────────────────────────────────────────────────

// Lower the pen to the working surface (-4 in absolute Z units at 100 mm/s).
void pen_down(){
  position_gen.go(-4, ABSOLUTE, 100);
}

// Raise the pen clear of the surface (+4 in absolute Z units at 100 mm/s).
void pen_up(){
  position_gen.go(4, ABSOLUTE, 100);
}

// Connectivity test — prints "hello!" to Serial so the host can confirm the link is live.
void say_hello(){
  Serial.println("hello!");
}

// Re-energise all motor drivers (e.g. after a drivers_off call).
void motors_enable(){
  enable_drivers();
}

// De-energise all motor drivers, allowing the axes to be moved by hand.
void motors_disable(){
  disable_drivers();
}

// Move to an absolute XY position at the given speed.
// Called by the host via: {"name": "go_to_xy", "args": [x, y, speed]}
void go_to_xy(float x, float y, float v) {
  tbi.add_move(ABSOLUTE, v, x, y, 0, 0, 0, 0); // mode, vel, x, y, 0, 0, 0, 0
}

// Move to an absolute XYZ position at the given speed.
// Z lets the host control pen height mid-path without a separate pen_up/pen_down call.
// Called by the host via: {"name": "go_to_xyz", "args": [x, y, z, speed]}
void go_to_xyz(float x, float y, float z, float v) {
  tbi.add_move(ABSOLUTE, v, x, y, z, 0, 0, 0); // mode, vel, x, y, 0, 0, 0, 0
}

// ─── Diagnostics ──────────────────────────────────────────────────────────────

// Periodic overhead reporter — currently a stub; uncomment wave2d_gen.debugPrint()
// or add your own telemetry here to monitor loop timing or motion state.
void report_overhead(){
  // wave2d_gen.debugPrint();
}
