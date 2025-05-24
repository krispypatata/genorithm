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
  
  let sliderWrapper = createDiv('');
  sliderWrapper.class('slider-wrapper');
  sliderWrapper.parent(container);
  
  let slider = createSlider(min, max, defaultValue, step);
  slider.parent(sliderWrapper);
  
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
  
  // Create slider wrapper for better vertical layout
  let sliderWrapper = createDiv('');
  sliderWrapper.class('slider-wrapper');
  sliderWrapper.parent(container);
  
  let slider = createSlider(0, 2, defaultValue, 0.01);
  slider.parent(sliderWrapper);
  
  // Set initial slider state based on checkbox
  if (!defaultChecked) {
    slider.attribute('disabled', '');
  }
  
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
    // If we have initial colors, use them as starting points for smooth transitions
    if (initialColors[j]) {
      let initialHue = initialColors[j].hue;
      let initialSat = initialColors[j].sat;
      let initialBrt = initialColors[j].brt;
      
      // Calculate target colors based on color harmony
      let targetHue, targetSat, targetBrt;
      
      switch(colorHarmony) {
        case 0: // Analogous with animation
          targetHue = (baseHue + sin(animationFrame * 0.02 + j) * 20) % 256;
          targetSat = 80 + sin(animationFrame * 0.03 + j) * 10;
          targetBrt = 90 + sin(animationFrame * 0.04 + j) * 10;
          break;
        case 1: // Complementary with animation
          targetHue = (baseHue + (j % 2) * 128 + sin(animationFrame * 0.02 + j) * 15) % 256;
          targetSat = 85 + sin(animationFrame * 0.03 + j) * 10;
          targetBrt = 85 + sin(animationFrame * 0.04 + j) * 10;
          break;
        case 2: // Triadic with animation
          targetHue = (baseHue + (j % 3) * 85 + sin(animationFrame * 0.02 + j) * 15) % 256;
          targetSat = 75 + sin(animationFrame * 0.03 + j) * 10;
          targetBrt = 90 + sin(animationFrame * 0.04 + j) * 10;
          break;
      }
      
      // Smoothly transition from initial to target colors
      // Calculate transition factor based on animation time
      let transitionFactor = min(1, animationFrame / 60); // Full transition after 60 frames
      
      // For hue, need to handle the circular nature of hue values
      let hueDiff = targetHue - initialHue;
      
      // Ensure we take the shortest path around the color wheel
      if (abs(hueDiff) > 128) {
        if (hueDiff > 0) {
          hueDiff = hueDiff - 256;
        } else {
          hueDiff = hueDiff + 256;
        }
      }
      
      // Apply transitions smoothly
      hue = (initialHue + hueDiff * transitionFactor) % 256;
      if (hue < 0) hue += 256;
      
      sat = lerp(initialSat, targetSat, transitionFactor);
      brt = lerp(initialBrt, targetBrt, transitionFactor);
    } else {
      // If no initial colors exist, calculate them directly
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
let randomOverlapMode;
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
let isPulsing = true; // Track if opacity is currently pulsing

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

let isFirstTimeLoaded = true; // Check if the project is first time loaded

// ═════════════════════════════════════════════════════════════════════════════════════════════════
// P5.JS MAIN FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Sets up the canvas and creates all UI controls when the program starts
function setup() {
  // Calculate canvas size based on window dimensions
  // Use the smaller of window width/height and leave space for controls
  let size = calculateCanvasSize();
  let canvas = createCanvas(size, size);
  
  // Place canvas in the canvas container
  canvas.parent('canvas-container');
  
  halfCanvasSize = size / 2;
  angleMode(DEGREES);
  
  // Reset and translate to center of canvas
  resetMatrix();
  translate(width / 2, height / 2);

  // Initialize animation parameters and state
  baseHue = random(256);
  colorHarmony = floor(random(3));
  opacityValue = defaultOpacityValue;
  lastPulseOpacity = defaultOpacityValue;
  initialCycle = 0;
  opacityStartFrame = frameCount;
  scaleStartFrame = frameCount;
  initialScaleCycle = 0;
  currentScale = 1.0;
  lastScale = 1.0;
  rotationAngle = 0;
  lastRotationAngle = 0;
  initialColors = [];
  
  // Create left control panel
  let leftPanel = select('#left-panel');
  
  // Create right control panel
  let rightPanel = select('#right-panel');

  // CREATE UI using helper functions
  // Left panel controls
  
  // Petals
  let petalControl = createSliderContainer(leftPanel, "No. of petals", minPetalsValue, maxPetalsValue, defaultPetalsValue, 2);
  petalSlider = petalControl.slider;
    // Update the label to use descriptive text
    petalSlider.input(() => {
      petalControl.label.html(`No. of petals: ${petalSlider.value()}`);
    });
    
  randomPetalButton = createToggleButton(petalControl.container, "random", 'random', petalsRandom);
  // If the initial randomPetalsMode is 1, set the button to active and disable slider
  if (randomPetalsMode == 1) {
    randomPetalButton.addClass('active');
    petalSlider.attribute('disabled', '');
  }

  // Layers
  let layersControl = createSliderContainer(leftPanel, "No. of layers", minLayersValue, maxLayersValue, defaultLayersValue);
  layersSlider = layersControl.slider;
  // Update the label to use descriptive text
  layersSlider.input(() => {
    layersControl.label.html(`No. of layers: ${layersSlider.value()}`);
  });
  
  randomLayersButton = createToggleButton(layersControl.container, "random", 'random', layersRandom);
  // If the initial randomLayersMode is 1, set the button to active and disable slider
  if (randomLayersMode == 1) {
    randomLayersButton.addClass('active');
    layersSlider.attribute('disabled', '');
  }

  // Alpha (opacity)
  let alphaControl = createSliderContainer(leftPanel, "Opacity", minOpacityValue, maxOpacityValue, defaultOpacityValue);
  alphaSlider = alphaControl.slider;
  // Update the label to use descriptive text
  alphaSlider.input(() => {
    alphaControl.label.html(`Opacity: ${alphaSlider.value()}`);
  });

  randomAlphaButton = createToggleButton(alphaControl.container, "random", 'random', alphaRandom);
  // If the initial randomAlphaMode is 1, set the button to active and disable slider
  if (randomAlphaMode == 1) {
    randomAlphaButton.addClass('active');
    alphaSlider.attribute('disabled', '');
  }

  // Spacing control
  let overlapControl = createSliderContainer(leftPanel, "Spacing", 0, 100, 50);
  overlapSlider = overlapControl.slider;
  
  // Update the label to use descriptive text
  const getSpacingLabel = (value) => {
    return value < 33 ? "Dense" : value < 66 ? "Medium" : "Spread";
  };
  
  overlapControl.label.html(`Spacing: ${getSpacingLabel(50)}`);
  overlapSlider.input(() => {
    overlapControl.label.html(`Spacing: ${getSpacingLabel(overlapSlider.value())}`);
  });

  // Outlines
  let outlineContainer = createDiv('');
  outlineContainer.class('slider-container');
  outlineContainer.parent(leftPanel);
  
  outlineButton = createToggleButton(outlineContainer, "outline", 'outline', outline);
  noOutlineButton = createToggleButton(outlineContainer, "no outline", 'no-outline', noOutline);
  randOutButton = createToggleButton(outlineContainer, "random", 'rand-outline', randOutline);
  randOutline();

  // Right panel controls
  
  // Styles
  let styleContainer = createDiv('');
  styleContainer.class('slider-container');
  styleContainer.parent(rightPanel);
  
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

  // Control buttons
  let buttonContainer = createDiv('');
  buttonContainer.class('slider-container');
  buttonContainer.parent(rightPanel);
  
  animateButton = createToggleButton(buttonContainer, "animate", 'animate', toggleAnimation);

  colorMode(HSB, 256, 100, 100, 100);

  // Animation controls container
  let animationControlsWrapper = createDiv('');
  animationControlsWrapper.class('animation-controls-wrapper');
  animationControlsWrapper.parent(rightPanel);
  
  let animationControlsContainer = createDiv('');
  animationControlsContainer.class('animation-controls');
  animationControlsContainer.id('animation-controls');
  animationControlsContainer.parent(animationControlsWrapper);

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
      rotationSpeedSlider.attribute('disabled', '');
    } else {
      // When re-enabling, continue from the last angle
      console.log("Rotation enabled, starting from angle:", lastRotationAngle);
      rotationSpeedSlider.removeAttribute('disabled');
    }
  });

  let colorShiftControl = createAnimationControl(animationControlsContainer, 'Color Shift', true, 0.5);
  colorShiftCheckbox = colorShiftControl.checkbox;
  colorShiftSpeedSlider = colorShiftControl.slider;

  // Add event listener for color shift checkbox
  colorShiftCheckbox.changed(() => {
    if (!colorShiftCheckbox.checked()) {
      colorShiftSpeedSlider.attribute('disabled', '');
    } else {
      colorShiftSpeedSlider.removeAttribute('disabled');
    }
  });

  let opacityControl = createAnimationControl(animationControlsContainer, 'Opacity Pulse', true, 0.5);
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
      // When disabling pulse, we should already have the correct lastPulseOpacity from the draw function
      // The draw() function will handle setting isPulsing = false and freezing at current opacity
      opacitySpeedSlider.attribute('disabled', '');
    } else {
      // Re-enable pulsing - draw() will handle the animation
      opacitySpeedSlider.removeAttribute('disabled');
    }
  });

  let scaleControl = createAnimationControl(animationControlsContainer, 'Scale', true, 0.5);
  scaleCheckbox = scaleControl.checkbox;
  scaleSpeedSlider = scaleControl.slider;

  scaleCheckbox.changed(() => {
    if (!scaleCheckbox.checked()) {
      // Store the current scale when disabling scale animation
      lastScale = currentScale;
      scaleSpeedSlider.attribute('disabled', '');
    } else {
      // When re-enabling scale animation, smoothly transition from current scale
      // calculate initial cycle based on current scale and direction
      if (isScaleGrowing) {
        initialScaleCycle = map(currentScale, 0.5, 1.5, 0, 90);
      } else {
        initialScaleCycle = map(currentScale, 0.5, 1.5, 90, 180);
      }
      scaleStartFrame = frameCount;
      scaleSpeedSlider.removeAttribute('disabled');
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
  
  // Add main action buttons at the very end, after animation controls
  let mainButtonsContainer = createDiv('');
  mainButtonsContainer.class('main-buttons-container');
  mainButtonsContainer.parent(rightPanel);
  
  newArtButton = createToggleButton(mainButtonsContainer, "new art", 'new-art', newArt);
  printButton = createToggleButton(mainButtonsContainer, "save jpg", 'save-jpg', saveJpg);

  newArt();
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Handle window resizing
function windowResized() {
  let newSize = calculateCanvasSize();
  resizeCanvas(newSize, newSize);
  halfCanvasSize = newSize / 2;
  
  // Reset and translate to center of canvas
  resetMatrix();
  translate(width / 2, height / 2);

  // Redraw the mandala with updated dimensions
  if (!isAnimating) {
    redrawCurrentMandalaWithUpdatedDimensions(); // This function also already handles initializing a new art when the program is first time loaded
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Redraw the mandala when the window is resized (preserving the art's current properties)
function redrawCurrentMandalaWithUpdatedDimensions() {
  // Clear the canvas
  background(0);
  
  // Reset and translate to center of canvas with new dimensions
  resetMatrix();
  translate(width / 2, height / 2);
  
  // Recalculate layer cushion based on new canvas size
  if (numLayers) {
    let overlapValue = overlapSlider.value() / 100;
    layerCushion = (halfCanvasSize / numLayers) * (0.8 + (overlapValue * 0.3));
  }
  
  // Preserve current animation state values
  let currentOpacity = opacityValue;
  let currentRotation = rotationAngle;
  let preservedScale = currentScale || 1.0;
  
  // If animation was stopped, we need to preserve the last visual state
  if (!isAnimating) {
    // Use the last known opacity value
    if (lastPulseOpacity !== undefined) {
      currentOpacity = lastPulseOpacity;
    }
    
    // Use the last known rotation angle
    if (lastRotationAngle !== undefined) {
      currentRotation = lastRotationAngle;
    }
    
    // Use the last known scale
    if (lastScale !== undefined) {
      preservedScale = lastScale;
    }
  }
  
  // Apply scale transformation if needed
  if (preservedScale !== 1.0) {
    scale(preservedScale);
  }
  
  // Only redraw if we have the necessary parameters
  if (numLayers && numPetals && petalAngle !== undefined && 
      halfCanvasSize && layerCushion !== undefined && 
      colorHarmony !== undefined && baseHue !== undefined && 
      currentOpacity !== undefined && showOutline !== undefined && 
      curveStyle !== undefined && strokeWeightValue !== undefined) {
    
    // Draw the mandala art with preserved state
    for (let j = 0; j < numLayers; j++) {
      // For static redraw, we need to handle rotation manually if it was applied
      if (currentRotation !== 0 && !isAnimating) {
        push();
        let layerProgress = j / numLayers;
        rotate(currentRotation * (1 - layerProgress * 0.5));
      }
      
      initialColors = drawMandalaLayer(j, numLayers, numPetals, petalAngle, halfCanvasSize, 
                                     layerCushion, colorHarmony, baseHue, currentOpacity, 
                                     showOutline, curveStyle, strokeWeightValue, 
                                     isAnimating, animationFrame || 0, 
                                     isAnimating && colorShiftCheckbox.checked(), 
                                     initialColors, 
                                     isAnimating && rotationCheckbox.checked(), 
                                     currentRotation);
      
      // End rotation transform if we applied it manually
      if (currentRotation !== 0 && !isAnimating) {
        pop();
        // Rotate for next layer (same as in drawMandalaLayer)
        rotate(petalAngle);
      }
    }
  } else {
    // If we don't have all the necessary parameters, resort to creating new art (sample scenario is when the program is first time loaded)
    console.log("Missing mandala parameters, generating new art");
    newArt();
  }
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
  opacitySpeed = opacitySpeedSlider.value();
  targetOpacitySpeed = targetOpacitySpeed || opacitySpeed;
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
    // Ensure baseHue is initialized
    if (baseHue === undefined) {
      baseHue = random(256);
    }
    
    // Update baseHue more gradually for smoother transitions
    // We don't clear initialColors anymore - instead we let each layer
    // shift its color smoothly from its initial state
    baseHue = (baseHue + colorShiftSpeed * 0.5) % 256;
  }

  // Calculate opacity pulse if enabled
  let currentOpacity = opacityValue;
  
  if (doOpacityPulse) {
    // If checkbox is checked, start pulsing
    isPulsing = true;
    
    // Ensure opacityValue is initialized
    if (opacityValue === undefined) {
      opacityValue = defaultOpacityValue;
    }
    
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
    // When opacity pulse is disabled...
    if (isPulsing) {
      // If we just disabled pulsing, freeze at the current opacity value
      isPulsing = false;
      // We already have lastPulseOpacity from the previous frame when pulsing was enabled
    }
    // Use the stored opacity value
    currentOpacity = lastPulseOpacity;
    opacityValue = currentOpacity; // Update opacityValue to match currentOpacity
    // Initialize cycle in case pulsing is re-enabled
    initialCycle = map(currentOpacity, 10, 100, 0, 90);
    opacityStartFrame = frameCount;
  }
  
  // Make sure numLayers and other needed variables are initialized
  if (!numLayers) {
    if (randomLayersMode == 1) {
      numLayers = floor(random(minLayersValue, maxLayersValue));
    } else {
      numLayers = layersSlider.value();
    }
  }
  
  if (!numPetals) {
    if (randomPetalsMode == 1) {
      numPetals = floor(random(Math.floor(minPetalsValue / 2), Math.floor(maxPetalsValue / 2))) * 2;
    } else {
      numPetals = petalSlider.value();
    }
    petalAngle = 360 / numPetals;
  }
  
  // Recalculate layerCushion based on current canvas size
  if (!layerCushion || windowResized) {
    let overlapValue = overlapSlider.value() / 100;
    layerCushion = (halfCanvasSize / numLayers) * (0.8 + (overlapValue * 0.3));
  }
  
  if (curveStyle === undefined) {
    if (randomCurveMode) {
      curveStyle = floor(random(curveStyleList.length));
    } else {
      curveStyle = 0; // Default to smooth
    }
  }
  
  if (showOutline === undefined) {
    if (randomOutlineMode == 1) {
      showOutline = round(random(1));
    } else {
      showOutline = 0;
    }
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
    
    // Initialize critical variables if this is the first time animation is enabled
    // Check and initialize mandala geometry variables
    if (numLayers === undefined) {
      if (randomLayersMode == 1) {
        numLayers = floor(random(minLayersValue, maxLayersValue));
      } else {
        numLayers = layersSlider.value();
      }
    }
    
    if (numPetals === undefined) {
      if (randomPetalsMode == 1) {
        numPetals = floor(random(Math.floor(minPetalsValue / 2), Math.floor(maxPetalsValue / 2))) * 2;
      } else {
        numPetals = petalSlider.value();
      }
      petalAngle = 360 / numPetals;
    }
    
    if (layerCushion === undefined) {
      let overlapValue = overlapSlider.value() / 100;
      layerCushion = (halfCanvasSize / numLayers) * (0.8 + (overlapValue * 0.3));
    }
    
    // Initialize style variables
    if (curveStyle === undefined) {
      if (randomCurveMode) {
        curveStyle = floor(random(curveStyleList.length));
      } else {
        curveStyle = 0; // Default to smooth
      }
    }
    
    if (showOutline === undefined) {
      if (randomOutlineMode == 1) {
        showOutline = round(random(1));
      } else {
        showOutline = 0;
      }
    }
    
    // Initialize color variables
    if (baseHue === undefined) {
      baseHue = random(256);
    }
    
    if (colorHarmony === undefined) {
      colorHarmony = floor(random(3));
    }
    
    // Initialize animation state
    if (opacityValue === undefined) {
      opacityValue = defaultOpacityValue;
    }
    
    if (lastPulseOpacity === undefined) {
      lastPulseOpacity = opacityValue;
    }
    
    if (animationFrame === undefined) {
      animationFrame = 0;
    }
    
    // Ensure initialColors has colors for each layer before starting animation
    // This will make color shift transition smoothly from current colors
    if (initialColors.length === 0 && numLayers > 0) {
      // Capture current colors of the mandala for smooth transitions
      for (let j = 0; j < numLayers; j++) {
        let layerProgress = j / numLayers;
        
        // Generate colors similar to how they're generated in drawMandalaLayer
        let colorObj = generateColors(j, layerProgress, colorHarmony, baseHue, false, 0);
        initialColors[j] = {
          hue: colorObj.hue,
          sat: colorObj.sat,
          brt: colorObj.brt
        };
      }
    }
    
    // Reset color shift animation
    if (colorShiftCheckbox.checked()) {
      // Don't clear initialColors anymore, so transitions are smooth
      // Set animation start timing
      colorShiftStartTime = millis();
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
      if (currentScale === undefined) {
        currentScale = 1.0;
      }
      
      if (lastScale === undefined) {
        lastScale = 1.0;
      }
      
      if (isScaleGrowing === undefined) {
        isScaleGrowing = true;
      }
      
      // Calculate initial cycle based on current scale and direction
      if (isScaleGrowing) {
        initialScaleCycle = map(currentScale, 0.5, 1.5, 0, 90);
      } else {
        initialScaleCycle = map(currentScale, 0.5, 1.5, 90, 180);
      }
      scaleStartFrame = frameCount;
    }
    
    // Show animation controls
    let animControls = select('#animation-controls');
    animControls.addClass('visible');
    loop();
  } else {
    animateButton.removeClass('active');
    // Store the current state when stopping animation
    lastAnimationState = false;
    
    // Hide animation controls
    let animControls = select('#animation-controls');
    animControls.removeClass('visible');
    noLoop();
  }
}
