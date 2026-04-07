---
layout: default
title: "Tidal Etchings"
---

# Project 1: [Tidal Etchings (working title haha)]

## Concept
We envision using tide data, specifically water level data, to drive the plotter, sourcing this information from publicly available ocean data. Applying a Fast Fourier Transform (FFT) to the changing of tides generates the following striking visuals:
![Tide Example](assets/tides1.png)
Source: Eric Rennie, MAT 201A Final - [Wave Analysis](https://colab.research.google.com/drive/1wMDJQnCfFCxfJfh0BmFAmVRZFt0H-DMc?usp=sharing#scrollTo=px44jtXfb3IZ)

The National Oceanic and Atmospheric Administration (NOAA) Data Retrieval API [documentation](https://api.tidesandcurrents.noaa.gov/api/prod/) offers us the ability to fetch water level data at various intervals, including in 1 minute or 6 minute intervals, hourly, daily, and monthly. We imagine translating this data into lines which curve and bend through the influence of ocean data, turning the sea into the artist. Our approach is to increase the amount of noise/distortion the higher the tide is. Not only does this data change dependent on location-it's also influenced by the location's weather, position of the moon, and the approximate 50-minute tide shift that happens each day. We envision creating a series of images to show these variations. 

Our aesthetic inspirations include more traditional examples of plotter art that capture three-dimensional-esque textures in a beautiful way. We are especially inspired by [Jazer's Piece](https://www.instagram.com/reel/DDQtjU5pk2v/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D).

We are interested in exploring negative space and subtractive rather than additive texture. For this reason, we are drawn to etching or engraving rather than ink/paint. On a secondary level, this echoes the ability of tides to erode and shape the coastline, so there's also a conceptual draw to this technique. This might involve using the following, which is nostalgic from both our childhoods: ![Engraving](assets/engrave.jpg)

Furthermore, as a reach goal, we are interested in then retranslating or "photographing" our plotter generated design using cyanotype process. This would involve creating an image negative transparency as an overlay by scanning the image and inverting in some photo editing software. The developing stage would take place at the coast, where the data used to generate the image was sourced. This would effectively reintroduce it back into its natural environment. From here, it would be possible to further augment the chemical reaction with additives (shifting the color from traditional Prussian blue), potentially also from the coastal site of data collection. 

Here is an example of a cyanotype image of cloth: ![Cyan](assets/cyanotype.jpg)

## Design

Explain your design process. What choices did you make and why?

## Implementation

Describe how you implemented your project using the StepDance library.

### Hardware Setup

Describe your hardware configuration.

![Hardware setup photo](assets/placeholder.jpg)

### Code Overview

Highlight key parts of your code and explain your approach:

```cpp
// Paste and explain relevant code snippets here
```

## Results

Show your project in action. Embed a video of it working:

<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>

*Replace the iframe above with your actual video URL, or use a local video:*

<!--
<video width="560" controls>
  <source src="assets/demo-video.mp4" type="video/mp4">
</video>
-->

## Reflection

What did you learn? What would you do differently?
