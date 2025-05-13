let params = {
  angle1: 90,        // Angle between branches
  angle2: 0,         // Angular rotation for new branches
  branches: 2,       // Number of branches (now minimum 2)
  startLength: 100,  // Initial length
  lengthMult: 0.7,   // Length multiplier
  startWidth: 8,     // Initial width
  widthMult: 0.7,    // Width multiplier
  
  depth: 10,         // Recursion depth
  randomness: 0.0,   // Randomness factor
  hue: 120,          // Base color hue
  hueVariation: 20,  // Color variation
  colorVariation: false,  // Color variation mode (default false)
  solidHue: 120,     // Solid color hue
  solidSat: 80,      // Solid color saturation
  solidBright: 80,   // Solid color brightness
  branchGradient: false,  // Gradient along branches
  darkColors: false      // Use darker color palette
};

let labels = {};
let sliders = {};
let checkboxes = {};
let controlsOffsetX = 0;
let controlsOffsetY = 0;

function setup() {
  let size = 500;
  let canvas = createCanvas(size, size);
  canvas.position(10, 10);
  
  colorMode(HSB, 360, 100, 100);
  noLoop();
  
  // Title
  // labels.title = createElement('h2', 'Fractal Tree Art Maker').position(10, 0);

  controlsOffsetX = size + 10;
  controlsOffsetY -= 10;

  // ===== CORE PARAMETERS =====
  labels.heading1 = createElement('h3', 'Core Parameters').style('font-weight', 'bold').position(controlsOffsetX + 20, controlsOffsetY + 0);
  
  // Angle 1
  controlsOffsetY += 30;
  labels.angle1 = createElement('label', 'Branch Angle:').position(controlsOffsetX + 20, controlsOffsetY + 10); // Angle Between Branches
  sliders.angle1 = createSlider(0, 360, params.angle1);
  sliders.angle1.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.angle1.input(updateAndRedraw);
  
  // Angle 2
  controlsOffsetY += 30;
  labels.angle2 = createElement('label', 'Branch Rotation:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.angle2 = createSlider(0, 360, params.angle2);
  sliders.angle2.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.angle2.input(updateAndRedraw);
  
  // Branches
  controlsOffsetY += 30;
  labels.branches = createElement('label', 'No. ofBranches:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.branches = createSlider(2, 5, params.branches, 1); // Minimum braches are 2 to allow the use of two angles
  sliders.branches.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.branches.input(() => {
    params.branches = sliders.branches.value();
    updateAndRedraw();
  });
  
  // ===== SIZE CONTROLS =====
  controlsOffsetY += 40;
  labels.heading2 = createElement('h3', 'Size Controls').style('font-weight', 'bold').position(controlsOffsetX + 20, controlsOffsetY + 0);
  
  // Start Length
  controlsOffsetY += 30;
  labels.startLength = createElement('label', 'Start Length:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.startLength = createSlider(10, 200, params.startLength);
  sliders.startLength.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.startLength.input(updateAndRedraw);
  
  // Length Multiplier
  controlsOffsetY += 30;
  labels.lengthMult = createElement('label', 'Length Mult:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.lengthMult = createSlider(0.1, 0.9, params.lengthMult, 0.01);
  sliders.lengthMult.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.lengthMult.input(updateAndRedraw);
  
  // Start Width
  controlsOffsetY += 30;
  labels.startWidth = createElement('label', 'Start Width:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.startWidth = createSlider(1, 20, params.startWidth);
  sliders.startWidth.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.startWidth.input(updateAndRedraw);
  
  // Width Multiplier
  controlsOffsetY += 30;
  labels.widthMult = createElement('label', 'Width Mult:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.widthMult = createSlider(0.1, 0.9, params.widthMult, 0.01);
  sliders.widthMult.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.widthMult.input(updateAndRedraw);
  
  // ===== ENHANCEMENTS =====
  controlsOffsetY += 40;
  labels.heading3 = createElement('h3', 'Enhancements').style('font-weight', 'bold').position(controlsOffsetX + 20, controlsOffsetY + 0);
  
  // Recursion Depth
  controlsOffsetY += 30;
  labels.depth = createElement('label', 'Depth:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.depth = createSlider(1, 15, params.depth, 1);
  sliders.depth.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.depth.input(updateAndRedraw);
  
  // Randomness
  controlsOffsetY += 30;
  labels.randomness = createElement('label', 'Randomness:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.randomness = createSlider(0, 1, params.randomness, 0.01);
  sliders.randomness.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.randomness.input(updateAndRedraw);
  
  // Color Variation Mode
  controlsOffsetY += 30;
  labels.colorVariation = createElement('label', 'Color Variation:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  checkboxes.colorVariation = createCheckbox('', params.colorVariation);
  checkboxes.colorVariation.position(controlsOffsetX + 150, controlsOffsetY + 10);
  checkboxes.colorVariation.changed(() => {
    params.colorVariation = checkboxes.colorVariation.checked();
    updateUI();
    redraw();
  });
  
  // Solid Color Controls (visible by default)
  controlsOffsetY += 30;
  labels.solidHue = createElement('label', 'Hue:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.solidHue = createSlider(0, 360, params.solidHue);
  sliders.solidHue.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.solidHue.input(() => {
    params.solidHue = sliders.solidHue.value();
    redraw();
  });

  controlsOffsetY += 30;
  labels.solidSat = createElement('label', 'Saturation:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.solidSat = createSlider(0, 100, params.solidSat);
  sliders.solidSat.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.solidSat.input(() => {
    params.solidSat = sliders.solidSat.value();
    redraw();
  });

  controlsOffsetY += 30;
  labels.solidBright = createElement('label', 'Brightness:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.solidBright = createSlider(0, 100, params.solidBright);
  sliders.solidBright.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.solidBright.input(() => {
    params.solidBright = sliders.solidBright.value();
    redraw();
  });
  
  // Color Variation Controls (hidden by default)
  controlsOffsetY += 30;
  labels.hue = createElement('label', 'Base Hue:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.hue = createSlider(0, 360, params.hue);
  sliders.hue.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.hue.input(updateAndRedraw);
  
  controlsOffsetY += 30;
  labels.hueVariation = createElement('label', 'Hue Spread:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  sliders.hueVariation = createSlider(0, 180, params.hueVariation);
  sliders.hueVariation.position(controlsOffsetX + 150, controlsOffsetY + 10);
  sliders.hueVariation.input(updateAndRedraw);
  
  // Branch Gradient Toggle
  controlsOffsetY += 30;
  labels.branchGradient = createElement('label', 'Branch Gradient:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  checkboxes.branchGradient = createCheckbox('', params.branchGradient);
  checkboxes.branchGradient.position(controlsOffsetX + 150, controlsOffsetY + 10);
  checkboxes.branchGradient.changed(() => {
    params.branchGradient = checkboxes.branchGradient.checked();
    redraw();
  });
  
  // Dark Colors Toggle
  controlsOffsetY += 30;
  labels.darkColors = createElement('label', 'Dark Colors:').position(controlsOffsetX + 20, controlsOffsetY + 10);
  checkboxes.darkColors = createCheckbox('', params.darkColors);
  checkboxes.darkColors.position(controlsOffsetX + 150, controlsOffsetY + 10);
  checkboxes.darkColors.changed(() => {
    params.darkColors = checkboxes.darkColors.checked();
    redraw();
  });
  
  // ===== CONTROLS =====
  controlsOffsetY += 40;
  // Randomize button
  let randomizeBtn = createButton('Randomize All');
  randomizeBtn.position(controlsOffsetX + 20, controlsOffsetY + 10);
  randomizeBtn.mousePressed(randomizeParams);
  
  // Initial UI setup
  updateUI();
}

function updateAndRedraw() {
  updateParams();
  redraw();
}

function updateParams() {
  params.angle1 = sliders.angle1.value();
  params.angle2 = sliders.angle2.value();
  params.branches = sliders.branches.value();
  params.startLength = sliders.startLength.value();
  params.lengthMult = sliders.lengthMult.value();
  params.startWidth = sliders.startWidth.value();
  params.widthMult = sliders.widthMult.value();
  params.depth = sliders.depth.value();
  params.randomness = sliders.randomness.value();
  params.hue = sliders.hue.value();
  params.hueVariation = sliders.hueVariation.value();
}

function updateUI() {
  // Show/hide controls based on color variation mode
  const isVariation = params.colorVariation;
  
  // Update solid color controls visibility
  sliders.solidHue.elt.style.display = isVariation ? 'none' : 'block';
  labels.solidHue.elt.style.display = isVariation ? 'none' : 'block';
  sliders.solidSat.elt.style.display = isVariation ? 'none' : 'block';
  labels.solidSat.elt.style.display = isVariation ? 'none' : 'block';
  sliders.solidBright.elt.style.display = isVariation ? 'none' : 'block';
  labels.solidBright.elt.style.display = isVariation ? 'none' : 'block';
  
  // Update color variation controls visibility and position
  sliders.hue.elt.style.display = isVariation ? 'block' : 'none';
  labels.hue.elt.style.display = isVariation ? 'block' : 'none';
  sliders.hueVariation.elt.style.display = isVariation ? 'block' : 'none';
  labels.hueVariation.elt.style.display = isVariation ? 'block' : 'none';
  checkboxes.branchGradient.elt.style.display = isVariation ? 'block' : 'none';
  labels.branchGradient.elt.style.display = isVariation ? 'block' : 'none';
  checkboxes.darkColors.elt.style.display = isVariation ? 'block' : 'none';
  labels.darkColors.elt.style.display = isVariation ? 'block' : 'none';
  
  if (isVariation) {
    // Color variation controls being positioned in the same space as the invisible solid color controls
    let baseY = checkboxes.colorVariation.y + 30;
    labels.hue.position(controlsOffsetX + 20, baseY + 10);
    sliders.hue.position(controlsOffsetX + 150, baseY + 10);
    labels.hueVariation.position(controlsOffsetX + 20, baseY + 40);
    sliders.hueVariation.position(controlsOffsetX + 150, baseY + 40);
    labels.branchGradient.position(controlsOffsetX + 20, baseY + 70);
    checkboxes.branchGradient.position(controlsOffsetX + 150, baseY + 70);
    labels.darkColors.position(controlsOffsetX + 20, baseY + 100);
    checkboxes.darkColors.position(controlsOffsetX + 150, baseY + 100);
  }
}

function draw() {
  randomSeed(42); // Fixed seed for consistent randomness
  background(0, 0, 95);
  translate(width/2, height/2 + 150);
  
  // Draw the tree with the current hue
  drawBranch(params.startLength, 0, params.depth, params.startWidth);
}

function drawBranch(len, angle, depth, width) {
  if (depth <= 0) return;
  
  // Calculate color based on mode
  let hue, sat, bright;
  if (params.colorVariation) {
    let baseHue = (params.hue + depth * 40) % 360;
    let variation = (angle * depth * params.hueVariation * 8) / 360;
    hue = (baseHue + variation) % 360;
    
    if (params.darkColors) {
      sat = 60 + (depth * 3);
      bright = 40 + (depth * 3);
    } else {
      sat = 80 + (depth * 5);
      bright = 60 + (depth * 5);
    }
  } else {
    hue = params.solidHue;
    sat = params.solidSat;
    bright = params.solidBright;
  }
  
  // Apply randomness
  let actualLen = len * (1 + random(-params.randomness, params.randomness));
  
  // Draw branch
  push();
  rotate(radians(angle));
  
  if (params.colorVariation && params.branchGradient) {
    let steps = 20;
    let stepLen = actualLen / steps;
    for (let i = 0; i < steps; i++) {
      let t = i / steps;
      let gradientHue = (hue + (t * params.hueVariation)) % 360;
      stroke(gradientHue, sat, bright);
      strokeWeight(width * (1 - t * 0.3));
      line(0, -i * stepLen, 0, -(i + 1) * stepLen);
    }
  } else {
    stroke(hue, sat, bright);
    strokeWeight(width);
    line(0, 0, 0, -actualLen);
  }
  
  translate(0, -actualLen);
  
  // Create sub-branches
  if (depth > 1) {
    let newWidth = width * params.widthMult;
    if (newWidth < 1) newWidth = 1;
    
    if (params.branches === 2) {
      // Half of angle1 for each branch
      let branchAngle1 = params.angle1/2;
      let branchAngle2 = -params.angle1/2;

      // Angle 2 for rotation
      let rotation = params.angle2;
      
      drawBranch(len * params.lengthMult, branchAngle1 + rotation, depth-1, newWidth);
      drawBranch(len * params.lengthMult, branchAngle2 + rotation, depth-1, newWidth);
    } else {
      // Multi-branch
      let angleStep = params.angle1 / (params.branches - 1);
      let startAngle = -params.angle1/2;  // Start from negative half of angle1
      let rotation = params.angle2;       
      
      for (let i = 0; i < params.branches; i++) {
        let branchAngle = startAngle + (angleStep * i) + rotation;
        drawBranch(len * params.lengthMult, branchAngle, depth-1, newWidth);
      }
    }
  }
  pop();
}

function randomizeParams() {
  // Core parameters
  params.angle1 = floor(random(30, 120));  // Angle between branches
  params.angle2 = floor(random(0, 360));   // Branch rotation
  params.branches = floor(random(2, 6));
  
  // Size parameters
  params.startLength = floor(random(50, 150));
  params.lengthMult = random(0.5, 0.8);
  params.startWidth = floor(random(3, 12));
  params.widthMult = random(0.5, 0.8);
  
  // Enhancements
  params.depth = floor(random(5, 12));
  params.randomness = random(0.1, 0.3);
  params.colorVariation = random() > 0.5;
  params.solidHue = floor(random(360));
  params.solidSat = floor(random(50, 100));
  params.solidBright = floor(random(50, 100));
  params.hue = floor(random(360));
  params.hueVariation = floor(random(10, 40));
  params.branchGradient = random() > 0.5;
  params.darkColors = random() > 0.5;
  
  // Update all controls
  sliders.angle1.value(params.angle1);
  sliders.angle2.value(params.angle2);
  sliders.branches.value(params.branches);
  sliders.startLength.value(params.startLength);
  sliders.lengthMult.value(params.lengthMult);
  sliders.startWidth.value(params.startWidth);
  sliders.widthMult.value(params.widthMult);
  sliders.depth.value(params.depth);
  sliders.randomness.value(params.randomness);
  checkboxes.colorVariation.checked(params.colorVariation);
  sliders.solidHue.value(params.solidHue);
  sliders.solidSat.value(params.solidSat);
  sliders.solidBright.value(params.solidBright);
  sliders.hue.value(params.hue);
  sliders.hueVariation.value(params.hueVariation);
  checkboxes.branchGradient.checked(params.branchGradient);
  checkboxes.darkColors.checked(params.darkColors);
  
  updateUI();
  redraw();
}