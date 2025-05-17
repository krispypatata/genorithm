// Calculate appropriate canvas size based on window dimensions
function calculateCanvasSize() {
  let controlPanelWidth = 220; // Width of each control panel
  let padding = 40; // Additional padding
  
  // For wider screens - horizontal layout
  if (windowWidth > 900) {
    // Leave space for the control panels and padding
    let availableWidth = windowWidth - (controlPanelWidth * 2) - padding;
    let availableHeight = windowHeight - padding;
    
    // Use the smaller dimension to make sure everything fits
    let size = min(availableWidth, availableHeight);
    
    // Set minimum and maximum sizes
    size = constrain(size, 300, 800);
    
    return size;
  } 
  // For narrower screens - vertical layout
  else {
    // In vertical layout, we're constrained by width
    let availableWidth = windowWidth - padding;
    // Leave some space for controls above and below
    let availableHeight = windowHeight - 400; 
    
    // Use the smaller dimension to make sure everything fits
    let size = min(availableWidth, availableHeight);
    
    // Set minimum size
    size = constrain(size, 250, 500);
    
    return size;
  }
}

// Handle window resize events
function windowResized() {
  let newSize = calculateCanvasSize();
  resizeCanvas(newSize, newSize);
  
  // Reset and translate to center of canvas
  resetMatrix();
  translate(width / 2, height / 2);
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
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
let controlsContainer;

function setup() {
  // let size = 500;
  let size = calculateCanvasSize();
  let canvas = createCanvas(size, size);
  
  // Place canvas in the canvas container
  canvas.parent('canvas-container');

  colorMode(HSB, 360, 100, 100);
  noLoop();
  
  // Create controls container
  controlsContainer = createDiv('');
  controlsContainer.class('controls-container');
  
  // ===== CORE PARAMETERS =====
  let coreSection = createDiv('');
  coreSection.class('core-controls');
  // coreSection.parent(controlsContainer);
  coreSection.parent('left-panel');
  
  labels.heading1 = createElement('h3', 'Core Parameters');
  labels.heading1.parent(coreSection);
  
  // Angle 1
  let angle1Group = createDiv('');
  angle1Group.class('control-group');
  angle1Group.parent(coreSection);
  
  labels.angle1 = createElement('label', 'Branch Angle:');
  labels.angle1.parent(angle1Group);
  
  sliders.angle1 = createSlider(0, 360, params.angle1);
  sliders.angle1.parent(angle1Group);
  sliders.angle1.input(updateAndRedraw);
  
  // Angle 2
  let angle2Group = createDiv('');
  angle2Group.class('control-group');
  angle2Group.parent(coreSection);
  
  labels.angle2 = createElement('label', 'Branch Rotation:');
  labels.angle2.parent(angle2Group);
  
  sliders.angle2 = createSlider(0, 360, params.angle2);
  sliders.angle2.parent(angle2Group);
  sliders.angle2.input(updateAndRedraw);
  
  // Branches
  let branchesGroup = createDiv('');
  branchesGroup.class('control-group');
  branchesGroup.parent(coreSection);
  
  labels.branches = createElement('label', 'No. of Branches:');
  labels.branches.parent(branchesGroup);
  
  sliders.branches = createSlider(2, 5, params.branches, 1);
  sliders.branches.parent(branchesGroup);
  sliders.branches.input(() => {
    params.branches = sliders.branches.value();
    updateAndRedraw();
  });
  
  // ===== SIZE CONTROLS =====
  let sizeSection = createDiv('');
  sizeSection.class('size-controls');
  // sizeSection.parent(controlsContainer);
  sizeSection.parent('left-panel');
  
  labels.heading2 = createElement('h3', 'Size Controls');
  labels.heading2.parent(sizeSection);
  
  // Start Length
  let startLengthGroup = createDiv('');
  startLengthGroup.class('control-group');
  startLengthGroup.parent(sizeSection);
  
  labels.startLength = createElement('label', 'Start Length:');
  labels.startLength.parent(startLengthGroup);
  
  sliders.startLength = createSlider(10, 200, params.startLength);
  sliders.startLength.parent(startLengthGroup);
  sliders.startLength.input(updateAndRedraw);
  
  // Length Multiplier
  let lengthMultGroup = createDiv('');
  lengthMultGroup.class('control-group');
  lengthMultGroup.parent(sizeSection);
  
  labels.lengthMult = createElement('label', 'Length Mult:');
  labels.lengthMult.parent(lengthMultGroup);
  
  sliders.lengthMult = createSlider(0.1, 0.9, params.lengthMult, 0.01);
  sliders.lengthMult.parent(lengthMultGroup);
  sliders.lengthMult.input(updateAndRedraw);
  
  // Start Width
  let startWidthGroup = createDiv('');
  startWidthGroup.class('control-group');
  startWidthGroup.parent(sizeSection);
  
  labels.startWidth = createElement('label', 'Start Width:');
  labels.startWidth.parent(startWidthGroup);
  
  sliders.startWidth = createSlider(1, 20, params.startWidth);
  sliders.startWidth.parent(startWidthGroup);
  sliders.startWidth.input(updateAndRedraw);
  
  // Width Multiplier
  let widthMultGroup = createDiv('');
  widthMultGroup.class('control-group');
  widthMultGroup.parent(sizeSection);
  
  labels.widthMult = createElement('label', 'Width Mult:');
  labels.widthMult.parent(widthMultGroup);
  
  sliders.widthMult = createSlider(0.1, 0.9, params.widthMult, 0.01);
  sliders.widthMult.parent(widthMultGroup);
  sliders.widthMult.input(updateAndRedraw);
  
  // ===== ENHANCEMENTS =====
  let enhancementsSection = createDiv('');
  enhancementsSection.class('enhancements-controls');
  // enhancementsSection.parent(controlsContainer);
  enhancementsSection.parent('right-panel');
  
  labels.heading3 = createElement('h3', 'Enhancements');
  labels.heading3.parent(enhancementsSection);
  
  // Recursion Depth
  let depthGroup = createDiv('');
  depthGroup.class('control-group');
  depthGroup.parent(enhancementsSection);
  
  labels.depth = createElement('label', 'Depth:');
  labels.depth.parent(depthGroup);
  
  sliders.depth = createSlider(1, 15, params.depth, 1);
  sliders.depth.parent(depthGroup);
  sliders.depth.input(updateAndRedraw);
  
  // Randomness
  let randomnessGroup = createDiv('');
  randomnessGroup.class('control-group');
  randomnessGroup.parent(enhancementsSection);
  
  labels.randomness = createElement('label', 'Randomness:');
  labels.randomness.parent(randomnessGroup);
  
  sliders.randomness = createSlider(0, 1, params.randomness, 0.01);
  sliders.randomness.parent(randomnessGroup);
  sliders.randomness.input(updateAndRedraw);
  
  // Color Variation Mode
  let colorVarGroup = createDiv('');
  // colorVarGroup.class('control-group');
  colorVarGroup.parent(enhancementsSection);
  
  // labels.colorVariation = createElement('label', 'Color Variation:');
  // labels.colorVariation.parent(colorVarGroup);
  
  let colorVarCheckboxContainer = createDiv('');
  colorVarCheckboxContainer.class('checkbox-container');
  colorVarCheckboxContainer.parent(colorVarGroup);
  
  checkboxes.colorVariation = createCheckbox('Color Variation', params.colorVariation);
  checkboxes.colorVariation.parent(colorVarCheckboxContainer);
  if (params.colorVariation) {
    colorVarCheckboxContainer.addClass('active');
  }
  checkboxes.colorVariation.changed(() => {
    params.colorVariation = checkboxes.colorVariation.checked();
    if (params.colorVariation) {
      colorVarCheckboxContainer.addClass('active');
    } else {
      colorVarCheckboxContainer.removeClass('active');
    }
    updateUI();
    redraw();
  });
  
  // Color controls container
  let colorControlsSection = createDiv('');
  colorControlsSection.parent(enhancementsSection);
  
  // Solid Color Controls
  let solidColorControls = createDiv('');
  solidColorControls.class('solid-color-controls');
  solidColorControls.parent(colorControlsSection);
  
  // Solid Hue
  let solidHueGroup = createDiv('');
  solidHueGroup.class('control-group');
  solidHueGroup.parent(solidColorControls);
  
  labels.solidHue = createElement('label', 'Hue:');
  labels.solidHue.parent(solidHueGroup);
  
  sliders.solidHue = createSlider(0, 360, params.solidHue);
  sliders.solidHue.parent(solidHueGroup);
  sliders.solidHue.input(() => {
    params.solidHue = sliders.solidHue.value();
    redraw();
  });

  // Solid Saturation
  let solidSatGroup = createDiv('');
  solidSatGroup.class('control-group');
  solidSatGroup.parent(solidColorControls);
  
  labels.solidSat = createElement('label', 'Saturation:');
  labels.solidSat.parent(solidSatGroup);
  
  sliders.solidSat = createSlider(0, 100, params.solidSat);
  sliders.solidSat.parent(solidSatGroup);
  sliders.solidSat.input(() => {
    params.solidSat = sliders.solidSat.value();
    redraw();
  });

  // Solid Brightness
  let solidBrightGroup = createDiv('');
  solidBrightGroup.class('control-group');
  solidBrightGroup.parent(solidColorControls);
  
  labels.solidBright = createElement('label', 'Brightness:');
  labels.solidBright.parent(solidBrightGroup);
  
  sliders.solidBright = createSlider(0, 100, params.solidBright);
  sliders.solidBright.parent(solidBrightGroup);
  sliders.solidBright.input(() => {
    params.solidBright = sliders.solidBright.value();
    redraw();
  });
  
  // Color Variation Controls
  let variationColorControls = createDiv('');
  variationColorControls.class('color-variation-controls');
  variationColorControls.parent(colorControlsSection);
  
  // Base Hue
  let hueGroup = createDiv('');
  hueGroup.class('control-group');
  hueGroup.parent(variationColorControls);
  
  labels.hue = createElement('label', 'Base Hue:');
  labels.hue.parent(hueGroup);
  
  sliders.hue = createSlider(0, 360, params.hue);
  sliders.hue.parent(hueGroup);
  sliders.hue.input(updateAndRedraw);
  
  // Hue Variation
  let hueVarGroup = createDiv('');
  hueVarGroup.class('control-group');
  hueVarGroup.parent(variationColorControls);
  
  labels.hueVariation = createElement('label', 'Hue Spread:');
  labels.hueVariation.parent(hueVarGroup);
  
  sliders.hueVariation = createSlider(0, 180, params.hueVariation);
  sliders.hueVariation.parent(hueVarGroup);
  sliders.hueVariation.input(updateAndRedraw);
  
  // Branch Gradient
  let branchGradientGroup = createDiv('');
  branchGradientGroup.class('control-group');
  branchGradientGroup.parent(variationColorControls);
  
  // labels.branchGradient = createElement('label', 'Branch Gradient:');
  // labels.branchGradient.parent(branchGradientGroup);
  
  let branchGradientCheckboxContainer = createDiv('');
  branchGradientCheckboxContainer.class('checkbox-container');
  branchGradientCheckboxContainer.parent(branchGradientGroup);
  
  checkboxes.branchGradient = createCheckbox('Branch Gradient', params.branchGradient);
  checkboxes.branchGradient.parent(branchGradientCheckboxContainer);
  if (params.branchGradient) {
    branchGradientCheckboxContainer.addClass('active');
  }
  checkboxes.branchGradient.changed(() => {
    params.branchGradient = checkboxes.branchGradient.checked();
    if (params.branchGradient) {
      branchGradientCheckboxContainer.addClass('active');
    } else {
      branchGradientCheckboxContainer.removeClass('active');
    }
    redraw();
  });
  
  // Dark Colors
  let darkColorsGroup = createDiv('');
  darkColorsGroup.class('control-group');
  darkColorsGroup.parent(variationColorControls);
  
  // labels.darkColors = createElement('label', 'Dark Colors:');
  // labels.darkColors.parent(darkColorsGroup);
  
  let darkColorsCheckboxContainer = createDiv('');
  darkColorsCheckboxContainer.class('checkbox-container');
  darkColorsCheckboxContainer.parent(darkColorsGroup);
  
  checkboxes.darkColors = createCheckbox('Dark Colors', params.darkColors);
  checkboxes.darkColors.parent(darkColorsCheckboxContainer);
  if (params.darkColors) {
    darkColorsCheckboxContainer.addClass('active');
  }
  checkboxes.darkColors.changed(() => {
    params.darkColors = checkboxes.darkColors.checked();
    if (params.darkColors) {
      darkColorsCheckboxContainer.addClass('active');
    } else {
      darkColorsCheckboxContainer.removeClass('active');
    }
    redraw();
  });
  
  // ===== CONTROLS =====
  let controlsButtonSection = createDiv('');
  controlsButtonSection.parent(controlsContainer);
  
  // Randomize button
  let randomizeBtn = createButton('Randomize All');
  // randomizeBtn.parent(controlsButtonSection);
  randomizeBtn.parent('right-panel');
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
  // Toggle color-variation-active class on controlsContainer based on colorVariation mode
  if (params.colorVariation) {
    controlsContainer.addClass('color-variation-active');
  } else {
    controlsContainer.removeClass('color-variation-active');
  }
  
  // Update active state for colorVariation checkbox container
  const colorVarCheckboxContainer = checkboxes.colorVariation.elt.parentElement;
  if (params.colorVariation) {
    colorVarCheckboxContainer.classList.add('active');
  } else {
    colorVarCheckboxContainer.classList.remove('active');
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
  
  // Update active classes for checkbox containers
  const colorVarContainer = checkboxes.colorVariation.elt.parentElement;
  const branchGradientContainer = checkboxes.branchGradient.elt.parentElement;
  const darkColorsContainer = checkboxes.darkColors.elt.parentElement;
  
  if (params.colorVariation) {
    colorVarContainer.classList.add('active');
  } else {
    colorVarContainer.classList.remove('active');
  }
  
  if (params.branchGradient) {
    branchGradientContainer.classList.add('active');
  } else {
    branchGradientContainer.classList.remove('active');
  }
  
  if (params.darkColors) {
    darkColorsContainer.classList.add('active');
  } else {
    darkColorsContainer.classList.remove('active');
  }
  
  updateUI();
  redraw();
}