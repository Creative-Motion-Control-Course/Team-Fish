# Project 2 Proposal:

## Domain:
(Identifying your creative domain and devising a preliminary design and justification for CNC intervention: Provide a statement that defines the workflow or artifacts you are seeking to support, the envisioned practitioners of your tool, and what existing skills, methods and techniques you seek to extend, preserve or otherwise support through your machine.)

We aim to continue working to provide support for computer and plotter aided embossing, further developing our current framework. The envisioned practitioners of our tool include hobbyists, crafters, printmakers, and creative practitioners of all kinds. Our CNC embossing tool seeks to extend and enhance hand tool embossing using styluses and ball tools on foil. With our CNC machine, we plan to extend the skills of pattern design and layout with digital precision and repeatability, depth and pressure control, as well as possibly scaling and mirroring designs.

## Physical Prototype/Target Area:
(A proposal of what you plan physically prototype and your target area of technical development. Their are three potential areas of technical development: A. Building a new mechanism from component parts- e.g. creating a custom machine B. Modifying the mechanism of an existing machine (e.g. adding or swapping out an axis) C. Developing a high res custom interface. You must identify ONE of these areas as the primary objective for your project and argue for why this is the most meaningful intervention for your target application.)

There are multiple directions we might take in order to improve the plotter. Here we outline some primary areas for improvement, with proposed solutions under each. As follows naturally from our improvement areas, we are primarily focusing on objective B. -- modifying the mechanism of the existing machine. This is particularly relevant to our domain given the importance of fine grained Z-axis control in maintaining varying degrees of embossing pressure. 

### Surface Irregularities:
1. Table mount for the Axidraw itself
2. Mount and shim piece of plywood to provide a stable surface
3. Experimenting with a softer metallic surface, such as normal alumnimum foil
<img width="500" alt="Screenshot 2026-05-05 at 1 59 40 PM" src="https://github.com/user-attachments/assets/fa36bed0-c5c1-453c-8e6e-913e2672ed4d" />


### Z-Axis control:
1. Creating a custom housing for the embosser tip, either with a rack and pinion setup or with a small lead screw
2. Fixed head with moving platform -- might allow for more precise Z-axis control
3. Real-time z-axis adjustment from the user -- adjusted via potentiometer ?

<img width="600" alt="Screenshot 2026-05-05 at 2 17 59 PM" src="https://github.com/user-attachments/assets/ac230019-eaca-4f03-9593-87fe71d7df43" />


### Customizability:
1. Second head that follows prior path and adds color
2. Custom embossing tool changer / carousel

<img width="700" alt="Screenshot 2026-05-05 at 2 18 51 PM" src="https://github.com/user-attachments/assets/e44cc805-95db-4787-ab7a-2bd807e4c9e0" />


## Software Requirements:
(A description of the envisioned requirements for your software - e.g. how will you technically develop the interaction. This does not have to be a complete description but should cover how you think your project will work)

We are planning to incorporate more user interaction and "liveness" through potentiometers and sliders which will control the x, y, and z positions of the machine. This gives practitioners a sense of direct authorship over the tool's movement. We also plan to develop generators that can produce repeatable parametric patterns, extending the user's ability to create consistent motifs at scale. 

We are still in the process of determining what patterns the embosser will create. To determine embossing patterns, we will be conducting research into typical designs, particularly those with a high degree of symmetry that would be challenging to emboss by hand without a stencil. Perhaps inspired by more complex arrangements, with regular swirl/whorl formations, as follows:  
<img width="420" height="519" alt="image" src="https://github.com/user-attachments/assets/95ddc34a-2c51-4936-8a2a-f5466ac975a2" />
Here, note the role of precision, depth and pressure, and scalability of design motifs. Beyond online research, we will explore the affordances of the embossing materials ourselves. This will allow us to develop additional intuition for this medium. 

## Required Components:
(A list of required components (envisioned, not final))
1. Potentiometers
2. Sliders
3. Moving build plate
4. CNC machine (either plotter or 3d printer)
5. Custom housing for embosser tip (designed and 3D printed by us)
6. Additional embossing tips (customized?)

## Questions/Challenges:
(A list of questions, challenges that come up when planning your idea.)

1. From our current list of proposed next steps, what seems most feasible? It seems challenging to determine what strategies will be most effective without trying them out first? Is trying everything the best solution?
2. Do you think using a 3d printer or a pen plotter is the better CNC choice?
3. How much variability can we get from a single embossing tip? Is customized tool tips a meaningful next step aesthetically?
