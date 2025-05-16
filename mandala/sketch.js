// Gabinete, Keith Ginoel S. 
// Greatly inspired by: Steve's Makerspace Tutorial videos and codes: https://www.youtube.com/@StevesMakerspace (Was actually built upon one of his codes)

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// UI HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Creates a container with a label and slider, and returns all three elements
function createSliderContainer(parentElement, labelText, min, max, defaultValue, step = 1) {
  let container = createDiv('');
  container.class('slider-container');
  container.parent(parentElement);
  
  let label = createElement("p", `${labelText}: ${defaultValue}`);
  label.class('label');
  label.parent(container);
  
  let slider = createSlider(min, max, defaultValue, step);
  slider.parent(container);
  slider.input(() => label.html(`${labelText}: ${slider.value()}`));
  
  return { container, label, slider };
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Creates a button that can be toggled on and off
function createToggleButton(parentElement, text, className, callback) {
  let button = createButton(text);
  button.class(className);
  button.parent(parentElement);
  button.mousePressed(callback);
  return button;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Creates a checkbox and slider for controlling animation effects
function createAnimationControl(parentElement, labelText, defaultChecked = true, defaultValue = 0.5) {
  let container = createDiv('');
  container.class('animation-control');
  container.parent(parentElement);
  
  let checkbox = createCheckbox(labelText, defaultChecked);
  checkbox.parent(container);
  
  let slider = createSlider(0, 2, defaultValue, 0.01);
  slider.parent(container);
  
  return { container, checkbox, slider };
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// MANDALA DRAWING FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Draws a single petal shape based on the selected style
function drawPetal(style, startX, endX, ctrl1X, ctrl2X, ctrl1Y, ctrl2Y, layerIndex = 0) {
  switch(style) {
    case 0: // Smooth
      beginShape();
      curveVertex(startX, 0);
      curveVertex(startX, 0);
      curveVertex(ctrl1X, ctrl1Y * 0.7);
      curveVertex(ctrl2X, ctrl2Y * 0.7);
      curveVertex(endX, 0);
      curveVertex(endX, 0);
      endShape();
      
      beginShape();
      curveVertex(startX, 0);
      curveVertex(startX, 0);
      curveVertex(ctrl1X, -ctrl1Y * 0.7);
      curveVertex(ctrl2X, -ctrl2Y * 0.7);
      curveVertex(endX, 0);
      curveVertex(endX, 0);
      endShape();
      break;
      
    case 1: // Wave
      beginShape();
      curveVertex(startX, 0);
      curveVertex(startX, 0);
      curveVertex(ctrl1X, ctrl1Y * 1.3);
      curveVertex(ctrl2X, ctrl2Y * 1.3);
      curveVertex(endX, 0);
      curveVertex(endX, 0);
      endShape();
      
      beginShape();
      curveVertex(startX, 0);
      curveVertex(startX, 0);
      curveVertex(ctrl1X, -ctrl1Y * 1.3);
      curveVertex(ctrl2X, -ctrl2Y * 1.3);
      curveVertex(endX, 0);
      curveVertex(endX, 0);
      endShape();
      break;
      
    case 2: // Geometric
      beginShape();
      vertex(startX, 0);
      vertex(endX, 0);
      vertex(endX, ctrl2Y);
      vertex(startX, ctrl1Y);
      endShape(CLOSE);
      
      beginShape();
      vertex(startX, 0);
      vertex(endX, 0);
      vertex(endX, -ctrl2Y);
      vertex(startX, -ctrl1Y);
      endShape(CLOSE);
      break;

    case 3: // Spiral
      let spiralFactor = 1 + (layerIndex * 0.1);
      beginShape();
      curveVertex(startX, 0);
      curveVertex(startX, 0);
      curveVertex(ctrl1X, ctrl1Y * spiralFactor);
      curveVertex(ctrl2X, ctrl2Y * spiralFactor);
      curveVertex(endX, 0);
      curveVertex(endX, 0);
      endShape();
      
      beginShape();
      curveVertex(startX, 0);
      curveVertex(startX, 0);
      curveVertex(ctrl1X, -ctrl1Y * spiralFactor);
      curveVertex(ctrl2X, -ctrl2Y * spiralFactor);
      curveVertex(endX, 0);
      curveVertex(endX, 0);
      endShape();
      break;

    case 4: // Zigzag
      beginShape();
      vertex(startX, 0);
      vertex(ctrl1X, ctrl1Y * 0.5);
      vertex(ctrl2X, -ctrl2Y * 0.5);
      vertex(endX, 0);
      endShape();
      
      beginShape();
      vertex(startX, 0);
      vertex(ctrl1X, -ctrl1Y * 0.5);
      vertex(ctrl2X, ctrl2Y * 0.5);
      vertex(endX, 0);
      endShape();
      break;

    case 5: // Double
      // First set of petals
      beginShape();
      curveVertex(startX, 0);
      curveVertex(startX, 0);
      curveVertex(ctrl1X, ctrl1Y * 0.8);
      curveVertex(ctrl2X, ctrl2Y * 0.8);
      curveVertex(endX, 0);
      curveVertex(endX, 0);
      endShape();
      
      beginShape();
      curveVertex(startX, 0);
      curveVertex(startX, 0);
      curveVertex(ctrl1X, -ctrl1Y * 0.8);
      curveVertex(ctrl2X, -ctrl2Y * 0.8);
      curveVertex(endX, 0);
      curveVertex(endX, 0);
      endShape();

      // Second set of petals (slightly offset)
      let offset = (endX - startX) * 0.2;
      beginShape();
      curveVertex(startX + offset, 0);
      curveVertex(startX + offset, 0);
      curveVertex(ctrl1X + offset, ctrl1Y * 0.6);
      curveVertex(ctrl2X + offset, ctrl2Y * 0.6);
      curveVertex(endX + offset, 0);
      curveVertex(endX + offset, 0);
      endShape();
      
      beginShape();
      curveVertex(startX + offset, 0);
      curveVertex(startX + offset, 0);
      curveVertex(ctrl1X + offset, -ctrl1Y * 0.6);
      curveVertex(ctrl2X + offset, -ctrl2Y * 0.6);
      curveVertex(endX + offset, 0);
      curveVertex(endX + offset, 0);
      endShape();
      break;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Creates colors for each mandala layer based on color harmony rules
function generateColors(j, layerProgress, colorHarmony, baseHue, isAnimating, animationFrame) {
  let hue, sat, brt;
  
  if (isAnimating && colorShiftCheckbox.checked()) {
    // Calculate colors with animation when color shift is enabled
    switch(colorHarmony) {
      case 0: // Analogous with animation
        hue = (baseHue + sin(animationFrame * 0.02 + j) * 20) % 256;
        sat = 80 + sin(animationFrame * 0.03 + j) * 10;
        brt = 90 + sin(animationFrame * 0.04 + j) * 10;
        break;
      case 1: // Complementary with animation
        hue = (baseHue + (j % 2) * 128 + sin(animationFrame * 0.02 + j) * 15) % 256;
        sat = 85 + sin(animationFrame * 0.03 + j) * 10;
        brt = 85 + sin(animationFrame * 0.04 + j) * 10;
        break;
      case 2: // Triadic with animation
        hue = (baseHue + (j % 3) * 85 + sin(animationFrame * 0.02 + j) * 15) % 256;
        sat = 75 + sin(animationFrame * 0.03 + j) * 10;
        brt = 90 + sin(animationFrame * 0.04 + j) * 10;
        break;
    }
  } else {
    // Static colors for non-animated state
    switch(colorHarmony) {
      case 0: // Analogous
        hue = (baseHue + random(-20, 20)) % 256;
        sat = random(70, 90);
        brt = random(85, 100);
        break;
      case 1: // Complementary
        hue = (baseHue + (j % 2) * 128 + random(-10, 10)) % 256;
        sat = random(75, 95);
        brt = random(80, 95);
        break;
      case 2: // Triadic
        hue = (baseHue + (j % 3) * 85 + random(-10, 10)) % 256;
        sat = random(65, 85);
        brt = random(85, 100);
        break;
    }
  }
  
  // Layer-based color adjustments
  sat = sat * (1 - layerProgress * 0.1);
  brt = brt * (1 - layerProgress * 0.05);
  
  return { hue, sat, brt };
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Calculates positions and sizes for each layer in the mandala
function calculateLayerGeometry(j, numLayers, halfCanvasSize, layerCushion, petalAngle) {
  let layerProgress = j / numLayers;
  
  // Calculate starting and ending positions
  let startX = halfCanvasSize * (0.75 - j * 0.02) - j * layerCushion;
  let endX = halfCanvasSize * (0.9 - j * 0.02) - j * layerCushion;
  
  // Calculate control points
  let ctrl1X = startX + (endX - startX) * 0.3;
  let ctrl2X = startX + (endX - startX) * 0.7;
  
  let heightMultiplier = 0.6 - (layerProgress * 0.2); // Decreases with depth
  let ctrl1Y = ctrl1X * tan(petalAngle) * heightMultiplier;
  let ctrl2Y = ctrl2X * tan(petalAngle) * heightMultiplier;
  
  return {
    layerProgress,
    startX,
    endX,
    ctrl1X,
    ctrl2X,
    ctrl1Y,
    ctrl2Y
  };
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Draws one complete layer of the mandala with all its petals
function drawMandalaLayer(j, numLayers, numPetals, petalAngle, halfCanvasSize, layerCushion, 
                         colorHarmony, baseHue, opacityValue, showOutline, curveStyle, 
                         strokeWeightValue, isAnimating, animationFrame, doColorShift, initialColors, 
                         doRotation, rotationAngle) {
  // Calculate layer geometry
  let geometry = calculateLayerGeometry(j, numLayers, halfCanvasSize, layerCushion, petalAngle);
  let { layerProgress, startX, endX, ctrl1X, ctrl2X, ctrl1Y, ctrl2Y } = geometry;
  
  // Handle colors
  let hue, sat, brt;
  if (isAnimating && doColorShift) {
    // Calculate colors with animation
    let colorObj = generateColors(j, layerProgress, colorHarmony, baseHue, true, animationFrame);
    hue = colorObj.hue;
    sat = colorObj.sat;
    brt = colorObj.brt;
    
    // Store the current colors when color shift is enabled
    initialColors[j] = {hue, sat, brt};
  } else {
    // Use stored colors or generate new ones
    if (initialColors[j]) {
      hue = initialColors[j].hue;
      sat = initialColors[j].sat;
      brt = initialColors[j].brt;
    } else {
      // Generate new colors
      let colorObj = generateColors(j, layerProgress, colorHarmony, baseHue, false, 0);
      hue = colorObj.hue;
      sat = colorObj.sat;
      brt = colorObj.brt;
      initialColors[j] = {hue, sat, brt};
    }
  }
  
  // Apply current opacity value
  fill(hue, sat, brt, opacityValue);
  
  // Handle rotation in animated mode - now apply rotation regardless of doRotation flag
  if (isAnimating) {
    push();
    rotate(rotationAngle * (1 - layerProgress * 0.5));
  }
  
  // Draw petals
  for (let i = 0; i < numPetals / 2; i++) {
    if (showOutline == 1) {
      stroke(0);
      strokeWeight(strokeWeightValue);
    } else {
      noStroke();
    }
    
    // Draw petal shape - pass the layer index
    drawPetal(curveStyle, startX, endX, ctrl1X, ctrl2X, ctrl1Y, ctrl2Y, j);
    
    rotate(petalAngle * 2);
  }
  
  // End rotation transform if we used it
  if (isAnimating) {
    pop();
  }
  
  // Rotate for next layer
  rotate(petalAngle);
  
  return initialColors;
}


// ═════════════════════════════════════════════════════════════════════════════════════════════════
// START OF P5.JS PROJECT IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────────────────────────
let strokeWeightValue = 1;
let overlapMode;
let curveStyle;
let numPetals;
let numLayers;
let opacityValue;
let showOutline;
let petalAngle;
let ctrl1X;
let ctrl1Y;
let ctrl2X;
let ctrl2Y;
let startX;
let endX;
let startY;
let endY;
let halfCanvasSize;
let layerCushion;
let petalSlider;
let layersSlider;
let alphaSlider;
let randomPetalButton;
let randomLayersButton;
let randomAlphaButton;
let outlineButton;
let noOutlineButton;
let randOutButton;
let curve1Button;
let curve2Button;
let noCurveButton;
let randomCurveButton;
let overlapButton;
let noOverlapButton;
let randomOverlapButton;
let newArtButton;
let printButton;
let animateButton;
let isAnimating = false;
let animationFrame = 0;
let rotationSpeed = 0.5;
let colorShiftSpeed = 0.5;
let pulseSpeed = 0.02;
let pulseAmount = 0;
let randomPetalsMode = 1;
let randomLayersMode = 1;
let randomAlphaMode = 1;
let randomCurveMode = true;
let randomOverlapMode = true;
let randomOutlineMode;
let baseHue;
let colorHarmony;
let styleDropdown;
let overlapSlider;
let rotationAngle = 0;
let initialColors = [];
let opacityStartFrame = 0;
let initialCycle = 0;
let scaleStartFrame = 0;
let initialScaleCycle = 0;
let isScaleGrowing = true;

// Animation effect controls
let rotationCheckbox, colorShiftCheckbox;
let rotationSpeedSlider, colorShiftSpeedSlider;
let opacityCheckbox, opacitySpeedSlider;
let scaleCheckbox, scaleSpeedSlider;

let opacitySpeed = 0.5;
let targetOpacitySpeed = 0.5;
let lastPulseState = false;
let lastAnimationState = false;
let lastPulseOpacity = 50; // Store the last opacity value when pulse was active
let scaleSpeed = 0.5;
let currentScale = 1.0;
let lastScale = 1.0; // Store the last scale value when scale animation is disabled
let lastRotationAngle = 0; // Store the last rotation angle when rotation is disabled

let minPetalsValue = 10, maxPetalsValue = 30, defaultPetalsValue = 20;
let minLayersValue = 3, maxLayersValue = 30, defaultLayersValue = 15;
let minOpacityValue = 25, maxOpacityValue = 100, defaultOpacityValue = 50;

let curveStyleList = ['smooth', 'wave', 'geometric', 'spiral', 'zigzag', 'double'];
// Convert the array to an object with the array values as keys (so we can access them like this: curveStyleValues.smooth)
let curveStyleValues = curveStyleList.reduce((acc, style) => {
  acc[style] = style;
  return acc;
}, {});
// ═════════════════════════════════════════════════════════════════════════════════════════════════
// P5.JS MAIN FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Sets up the canvas and creates all UI controls when the program starts
function setup() {
  // let size = min(windowWidth, windowHeight) - 110;
  let size = 500;
  let canvas = createCanvas(size, size);
  
  // Canvas positioning now handled by CSS
  
  halfCanvasSize = size / 2;
  angleMode(DEGREES);
  
  // Reset and translate to center of canvas
  resetMatrix();
  translate(width / 2, height / 2);

  // Create a control panel div to contain all controls
  let controlPanel = createDiv('');
  controlPanel.class('control-panel');
  
  let offsetY = 0;

  // CREATE UI using helper functions
  // Petals
  let petalControl = createSliderContainer(controlPanel, "No. of petals", minPetalsValue, maxPetalsValue, defaultPetalsValue, 2);
  petalSlider = petalControl.slider;
  
  randomPetalButton = createToggleButton(petalControl.container, "random", 'random', petalsRandom);
  // If the initial randomPetalsMode is 1, set the button to active and disable slider
  if (randomPetalsMode == 1) {
    randomPetalButton.addClass('active');
    petalSlider.attribute('disabled', '');
  }
  
  // Layers
  let layersControl = createSliderContainer(controlPanel, "No. of layers", minLayersValue, maxLayersValue, defaultLayersValue);
  layersSlider = layersControl.slider;
  
  randomLayersButton = createToggleButton(layersControl.container, "random", 'random', layersRandom);
  // If the initial randomLayersMode is 1, set the button to active and disable slider
  if (randomLayersMode == 1) {
    randomLayersButton.addClass('active');
    layersSlider.attribute('disabled', '');
  }

  // Alpha (opacity)
  let alphaControl = createSliderContainer(controlPanel, "Opacity", minOpacityValue, maxOpacityValue, defaultOpacityValue);
  alphaSlider = alphaControl.slider;
  
  randomAlphaButton = createToggleButton(alphaControl.container, "random", 'random', alphaRandom);
  // If the initial randomAlphaMode is 1, set the button to active and disable slider
  if (randomAlphaMode == 1) {
    randomAlphaButton.addClass('active');
    alphaSlider.attribute('disabled', '');
  }

  // Outlines
  let outlineContainer = createDiv('');
  outlineContainer.class('slider-container');
  outlineContainer.parent(controlPanel);
  
  outlineButton = createToggleButton(outlineContainer, "outline", 'outline', outline);
  noOutlineButton = createToggleButton(outlineContainer, "no outline", 'no-outline', noOutline);
  randOutButton = createToggleButton(outlineContainer, "random", 'rand-outline', randOutline);
  randOutline();

  // Styles
  let styleContainer = createDiv('');
  styleContainer.class('slider-container');
  styleContainer.parent(controlPanel);
  
  let styleLabel = createElement("p", "Style:");
  styleLabel.class('label');
  styleLabel.parent(styleContainer);
  
  styleDropdown = createSelect();
  styleDropdown.parent(styleContainer);
  styleDropdown.option(curveStyleValues.smooth);
  styleDropdown.option(curveStyleValues.wave);
  styleDropdown.option(curveStyleValues.geometric);
  styleDropdown.option(curveStyleValues.spiral);
  styleDropdown.option(curveStyleValues.zigzag);
  styleDropdown.option(curveStyleValues.double);
  styleDropdown.option('random');
  styleDropdown.selected('random');
  styleDropdown.changed(styleChanged);

  // Overlaps
  let overlapControl = createSliderContainer(controlPanel, "Spacing", 0, 100, 50);
  overlapSlider = overlapControl.slider;
  
  // Update the label to use descriptive text
  const getSpacingLabel = (value) => {
    return value < 33 ? "Dense" : value < 66 ? "Medium" : "Spread";
  };
  
  overlapControl.label.html(`Spacing: ${getSpacingLabel(50)}`);
  overlapSlider.input(() => {
    overlapControl.label.html(`Spacing: ${getSpacingLabel(overlapSlider.value())}`);
  });

  // Control buttons
  let buttonContainer = createDiv('');
  buttonContainer.class('slider-container');
  buttonContainer.parent(controlPanel);
  
  newArtButton = createToggleButton(buttonContainer, "new art", 'new-art', newArt);
  printButton = createToggleButton(buttonContainer, "save jpg", 'save-jpg', saveJpg);
  animateButton = createToggleButton(buttonContainer, "animate", 'animate', toggleAnimation);

  colorMode(HSB, 256, 100, 100, 100);

  // Animation controls container
  let animationControlsContainer = createDiv('');
  animationControlsContainer.class('animation-controls');
  animationControlsContainer.id('animation-controls');
  animationControlsContainer.parent(controlPanel);

  // Create animation controls
  let rotationControl = createAnimationControl(animationControlsContainer, 'Rotation', true, 0.5);
  rotationCheckbox = rotationControl.checkbox;
  rotationSpeedSlider = rotationControl.slider;

  // Add event listener for rotation checkbox
  rotationCheckbox.changed(() => {
    if (!rotationCheckbox.checked()) {
      // Store the current rotation angle when disabling rotation
      lastRotationAngle = rotationAngle;
      console.log("Rotation disabled, saving angle:", lastRotationAngle);
    } else {
      // When re-enabling, continue from the last angle
      console.log("Rotation enabled, starting from angle:", lastRotationAngle);
    }
  });

  let colorShiftControl = createAnimationControl(animationControlsContainer, 'Color Shift', true, 0.5);
  colorShiftCheckbox = colorShiftControl.checkbox;
  colorShiftSpeedSlider = colorShiftControl.slider;

  let opacityControl = createAnimationControl(animationControlsContainer, 'Opac. Pulse', true, 0.5);
  opacityCheckbox = opacityControl.checkbox;
  opacitySpeedSlider = opacityControl.slider;
  opacitySpeedSlider.input(() => {
    // Store the current cycle position when speed changes
    let currentCycle = (initialCycle + ((frameCount - opacityStartFrame) * opacitySpeed * 0.5)) % 180;
    initialCycle = currentCycle;
    opacityStartFrame = frameCount;
    targetOpacitySpeed = opacitySpeedSlider.value();
  });

  opacityCheckbox.changed(() => {
    if (!opacityCheckbox.checked()) {
      // Store the current opacity when disabling pulse
      lastPulseOpacity = currentOpacity;
      opacityValue = lastPulseOpacity;
    }
  });

  let scaleControl = createAnimationControl(animationControlsContainer, 'Scale', true, 0.5);
  scaleCheckbox = scaleControl.checkbox;
  scaleSpeedSlider = scaleControl.slider;

  scaleCheckbox.changed(() => {
    if (!scaleCheckbox.checked()) {
      // Store the current scale when disabling scale animation
      lastScale = currentScale;
    } else {
      // When re-enabling scale animation, smoothly transition from current scale
      // Calculate initial cycle based on current scale and direction
      if (isScaleGrowing) {
        initialScaleCycle = map(currentScale, 0.5, 1.5, 0, 90);
      } else {
        initialScaleCycle = map(currentScale, 0.5, 1.5, 90, 180);
      }
      scaleStartFrame = frameCount;
    }
  });

  scaleSpeedSlider.input(() => {
    // Only update the speed, don't manipulate the current scale
    scaleSpeed = scaleSpeedSlider.value();
    // Preserve the current cycle position when speed changes
    let currentCycle = (initialScaleCycle + ((frameCount - scaleStartFrame) * scaleSpeed * 0.5)) % 180;
    initialScaleCycle = currentCycle;
    scaleStartFrame = frameCount;
  });

  newArt();
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Creates a new mandala design with fresh settings
function newArt() {
  background(0);
  
  // Reset animation parameters
  animationFrame = 0;
  // Only reset rotationAngle if animation is not active
  if (!isAnimating) {
    rotationAngle = 0;
    lastRotationAngle = 0;
  }
  scaleStartFrame = frameCount;
  
  // Reset scale values
  currentScale = 1.0;
  lastScale = 1.0;
  isScaleGrowing = true;
  
  // If animation and scale are active, start at normal scale and calculate initial cycle
  if (isAnimating && scaleCheckbox.checked()) {
    // Calculate the cycle position that corresponds to scale 1.0
    // Since we want to start at scale 1.0, we need to find the cycle position that maps to 1.0
    // In our mapping, scale 1.0 is at cycle position 45 (middle of the growing phase)
    initialScaleCycle = 45;
  } else {
    initialScaleCycle = 0;
  }
  
  // Reset pulse state
  lastPulseOpacity = opacityValue;
  initialCycle = map(opacityValue, 10, 100, 0, 90);
  opacityStartFrame = frameCount;
  
  // Reset and translate to center of canvas
  resetMatrix();
  translate(width / 2, height / 2);
  
  // Initialize artistic parameters
  baseHue = random(256);
  colorHarmony = floor(random(3)); // 0: Analogous, 1: Complementary, 2: Triadic
  
  // Reset color shift state
  initialColors = [];
  
  // Generate random values for variables
  if (randomPetalsMode == 1) {
     // Generate even numbers between the min and max values
    // Divide the min and max values by 2 since the slider's step is set to 2
    numPetals = floor(random(Math.floor(minPetalsValue / 2), Math.floor(maxPetalsValue / 2))) * 2;
  } else {
    numPetals = petalSlider.value();
  }
  petalAngle = 360 / numPetals;
  
  if (randomLayersMode == 1) {
    // Generate numbers between the min and max values
    numLayers = floor(random(minLayersValue, maxLayersValue)); 
  } else {
    numLayers = layersSlider.value();
  }
  
  // Calculate overlap based on slider value
  let overlapValue = overlapSlider.value() / 100;
  layerCushion = (halfCanvasSize / numLayers) * (0.8 + (overlapValue * 0.3));
  
  if (randomAlphaMode == 1) {
    // Generate a random number between the min and max values
    opacityValue = random(minOpacityValue, maxOpacityValue); 
  } else {
    opacityValue = alphaSlider.value();
  }
  
  if (randomOutlineMode == 1) {
    showOutline = round(random(1));
  }
  
  if (randomCurveMode == true) {
    curveStyle = floor(random(curveStyleList.length)); 
  }
  
  // Draw the mandala art
  for (let j = 0; j < numLayers; j++) {
    initialColors = drawMandalaLayer(j, numLayers, numPetals, petalAngle, halfCanvasSize, 
                                   layerCushion, colorHarmony, baseHue, opacityValue, 
                                   showOutline, curveStyle, strokeWeightValue, 
                                   false, 0, false, initialColors, false, 0);
  }
}


// ═════════════════════════════════════════════════════════════════════════════════════════════════
// ANIMATION
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Updates and redraws the mandala when animation is on
function draw() {
  if (!isAnimating) return;
  
  background(0);
  animationFrame++;
  
  // Use animation controls
  let doRotation = rotationCheckbox.checked();
  let doColorShift = colorShiftCheckbox.checked();
  let doOpacityPulse = opacityCheckbox.checked();
  let doScale = scaleCheckbox.checked();
  rotationSpeed = rotationSpeedSlider.value();
  colorShiftSpeed = colorShiftSpeedSlider.value();
  let opacitySpeed = opacitySpeedSlider.value();
  scaleSpeed = scaleSpeedSlider.value();

  // Update rotation angle if rotation is enabled
  if (doRotation) {
    // Only increment the rotation when rotation is enabled
    rotationAngle += rotationSpeed;
    lastRotationAngle = rotationAngle;
  } else {
    // When rotation is disabled, keep using the last rotation angle
    // but don't increment it
    rotationAngle = lastRotationAngle; 
  }

  // Calculate scale if enabled
  if (doScale) {
    // Create a constant rate transition between 0.5 and 1.5
    let cycle = (initialScaleCycle + ((frameCount - scaleStartFrame) * scaleSpeed * 0.5)) % 180; // 180 degrees for one complete cycle
    let targetScale;
    let isGrowing = cycle < 90; // Track if we're in the growing phase
    
    if (isGrowing) {
      // Growing up from 0.5 to 1.5
      targetScale = map(cycle, 0, 90, 0.5, 1.5);
    } else {
      // Shrinking down from 1.5 to 0.5
      targetScale = map(cycle, 90, 180, 1.5, 0.5);
    }
    
    // Update scale direction
    isScaleGrowing = isGrowing;
    
    // Interpolate to the target scale
    currentScale = lerp(currentScale, targetScale, 0.1);
    lastScale = currentScale;
  } else {
    // When scale is disabled, maintain the last scale value
    currentScale = lastScale;
  }

  // Reset and translate to center of canvas
  resetMatrix();
  translate(width / 2, height / 2);
  
  // Apply scale transformation
  scale(currentScale);
  
  // Only update baseHue if color shift is enabled
  if (doColorShift) {
    baseHue = (baseHue + colorShiftSpeed) % 256;
    // Clear initial colors when color shift is enabled
    initialColors = [];
  }

  // Calculate opacity pulse if enabled
  let currentOpacity = opacityValue;
  if (doOpacityPulse) {
    // Store the current state
    lastPulseState = true;
    
    // Smoothly transition the speed
    opacitySpeed = lerp(opacitySpeed, targetOpacitySpeed, 0.1);
    
    // Create a constant rate transition between 10% and 100%
    // The speed slider controls how fast the animation cycles
    let cycle = (initialCycle + ((frameCount - opacityStartFrame) * opacitySpeed * 0.5)) % 180; // 180 degrees for one complete cycle
    if (cycle < 90) {
      // Going up from 10% to 100%
      currentOpacity = map(cycle, 0, 90, 10, 100);
    } else {
      // Going down from 100% to 10%
      currentOpacity = map(cycle, 90, 180, 100, 10);
    }
    // Store the current opacity for when pulse is disabled
    lastPulseOpacity = currentOpacity;
  } else {
    // When opacity pulse is disabled, use the stored opacity value
    currentOpacity = lastPulseOpacity;
    opacityValue = lastPulseOpacity;
    // Reset the cycle to prevent jittering when re-enabling
    initialCycle = map(opacityValue, 10, 100, 0, 90);
    opacityStartFrame = frameCount;
  }
  
  // Draw the mandala art with animation
  for (let j = 0; j < numLayers; j++) {
    initialColors = drawMandalaLayer(j, numLayers, numPetals, petalAngle, halfCanvasSize, 
                                   layerCushion, colorHarmony, baseHue, currentOpacity, 
                                   showOutline, curveStyle, strokeWeightValue, 
                                   true, animationFrame, doColorShift, initialColors, 
                                   doRotation, rotationAngle);
  }
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// UI EVENT HANDLERS
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Toggles between using slider value or random value for petal count
function petalsRandom() {
  randomPetalsMode = randomPetalsMode * -1;
  if (randomPetalsMode == 1) {
    randomPetalButton.addClass('active');
    // Only allow even numbers
    let currentValue = petalSlider.value();
    if (currentValue % 2 !== 0) {
      petalSlider.value(currentValue + 1);
    }
    // Disable slider when random mode is active
    petalSlider.attribute('disabled', '');
  } else {
    randomPetalButton.removeClass('active');
    // Enable slider when random mode is inactive
    petalSlider.removeAttribute('disabled');
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Toggles between using slider value or random value for layer count
function layersRandom() {
  randomLayersMode = randomLayersMode * -1;
  if (randomLayersMode == 1) {
    randomLayersButton.addClass('active');
    // Disable slider when random mode is active
    layersSlider.attribute('disabled', '');
  } else {
    randomLayersButton.removeClass('active');
    // Enable slider when random mode is inactive
    layersSlider.removeAttribute('disabled');
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Toggles between using slider value or random value for opacity
function alphaRandom() {
  randomAlphaMode = randomAlphaMode * -1;
  if (randomAlphaMode == 1) {
    randomAlphaButton.addClass('active');
    // Disable slider when random mode is active
    alphaSlider.attribute('disabled', '');
  } else {
    randomAlphaButton.removeClass('active');
    // Enable slider when random mode is inactive
    alphaSlider.removeAttribute('disabled');
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Turns on outlines for the mandala petals
function outline() {
  showOutline = 1;
  randomOutlineMode = 0;
  outlineButton.addClass('active');
  noOutlineButton.removeClass('active');
  randOutButton.removeClass('active');
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Turns off outlines for the mandala petals
function noOutline() {
  showOutline = 0;
  randomOutlineMode = 0;
  noOutlineButton.addClass('active');
  outlineButton.removeClass('active');
  randOutButton.removeClass('active');
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Makes outline choice random for each new mandala
function randOutline() {
  randomOutlineMode = 1;
  randOutButton.addClass('active');
  outlineButton.removeClass('active');
  noOutlineButton.removeClass('active');
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Changes the petal style based on dropdown selection
function styleChanged() {
  let selected = styleDropdown.value();
  switch(selected) {
    case curveStyleValues.smooth:
      curveStyle = 0;
      randomCurveMode = false;
      break;
    case curveStyleValues.wave:
      curveStyle = 1;
      randomCurveMode = false;
      break;
    case curveStyleValues.geometric:
      curveStyle = 2;
      randomCurveMode = false;
      break;
    case curveStyleValues.spiral:
      curveStyle = 3;
      randomCurveMode = false;
      break;
    case curveStyleValues.zigzag:
      curveStyle = 4;
      randomCurveMode = false;
      break;
    case curveStyleValues.double:
      curveStyle = 5;
      randomCurveMode = false;
      break;
    case 'random':
      randomCurveMode = true;
      break;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Saves the current mandala as a JPG image file
function saveJpg() {
  save("genorithm-mandala.jpg");
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Turns animation on or off and shows/hides animation controls
function toggleAnimation() {
  isAnimating = !isAnimating;
  if (isAnimating) {
    animateButton.addClass('active');
    // Store the current state when starting animation
    lastAnimationState = true;
    
    // Reset color shift animation
    if (colorShiftCheckbox.checked()) {
      // Clear stored colors to allow color shift to work
      initialColors = [];
    }
    
    // Reset opacity pulse animation
    if (opacityCheckbox.checked()) {
      // Use lastPulseOpacity instead of opacityValue to prevent jitter
      // This ensures we continue from the current visible opacity
      initialCycle = map(lastPulseOpacity, 10, 100, 0, 90);
      opacityStartFrame = frameCount;
    }
    
    // Initialize scale values based on current state
    if (scaleCheckbox.checked()) {
      currentScale = lastScale;
      // Calculate initial cycle based on current scale and direction
      if (isScaleGrowing) {
        initialScaleCycle = map(currentScale, 0.5, 1.5, 0, 90);
      } else {
        initialScaleCycle = map(currentScale, 0.5, 1.5, 90, 180);
      }
      scaleStartFrame = frameCount;
    }
    
    // Show animation controls
    document.getElementById('animation-controls').classList.add('visible');
    loop();
  } else {
    animateButton.removeClass('active');
    // Store the current state when stopping animation
    lastAnimationState = false;
    
    // Hide animation controls
    document.getElementById('animation-controls').classList.remove('visible');
    noLoop();
  }
}
