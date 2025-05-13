// Greatly inspired by: Steve's Makerspace Tutorial videos and codes: https://www.youtube.com/@StevesMakerspace

let strokeWeightValue = 1; // Reduced from 2 to 1 for finer lines
let overlapMode;
let curveStyle; // 0: curved, 1: bezier, 2: straight
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
let randomPetalsMode = -1;
let randomLayersMode = -1;
let randomAlphaMode = -1;
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
let initialCycle = 0; // Add this to store the initial cycle value

// Animation effect controls
let rotationCheckbox, colorShiftCheckbox;
let rotationSpeedSlider, colorShiftSpeedSlider;
let opacityCheckbox, opacitySpeedSlider; // Add new control variables

let opacitySpeed = 0.5;
let targetOpacitySpeed = 0.5;
let lastPulseState = false;
let lastAnimationState = false;
let lastPulseOpacity = 50; // Store the last opacity value when pulse was active

function setup() {
  let size = min(windowWidth, windowHeight) - 110;
  canvas = createCanvas(size, size);
  // canvas.position(10, 95);
  canvas.position(10, 10);
  halfCanvasSize = size / 2;
  angleMode(DEGREES);
  
  // Reset and translate to center of canvas
  resetMatrix();
  translate(width / 2, height / 2);

  let canvasOffsetY = size + 10;
  let canvasOffsetX = size + 10;

  let offsetY = 0;

  // Create user interface
  // Petals
  petalSlider = createSlider(10, 30, 20, 2);
  petalSlider.position(canvasOffsetX + 10, 20);
  let noPetals = createElement("noPetals", `No. of petals: 20`);
  noPetals.position(canvasOffsetX + 40, 0);
  petalSlider.input(() => noPetals.html(`No. of petals: ${petalSlider.value()}`)); // Update the text when slider moves

  randomPetalButton = createButton("random");
  randomPetalButton.position(canvasOffsetX + 190, 20);
  randomPetalButton.style("background-color", "lightgreen");
  randomPetalButton.mousePressed(petalsRandom);
  
  // Layers
  offsetY += 50;
  layersSlider = createSlider(3, 30, 15);
  layersSlider.position(canvasOffsetX + 10, offsetY + 20);
  let noLayers = createElement("noLayers", `No. of layers: 15`);
  noLayers.position(canvasOffsetX + 40, offsetY + 0);
  layersSlider.input(() => noLayers.html(`No. of layers: ${layersSlider.value()}`)); // Update the text when slider moves

  randomLayersButton = createButton("random");
  randomLayersButton.position(canvasOffsetX + 190, offsetY + 20);
  randomLayersButton.style("background-color", "lightgreen");
  randomLayersButton.mousePressed(layersRandom);

  // Alpha (opacity)
  offsetY += 50;
  alphaSlider = createSlider(25, 100, 50);
  alphaSlider.position(canvasOffsetX + 10, offsetY + 20);
  let alpha = createElement("alpha", `Opacity: 50`);
  alpha.position(canvasOffsetX + 40, offsetY + 0);
  alphaSlider.input(() => alpha.html(`Opacity: ${alphaSlider.value()}`)); // Update the text when slider moves

  randomAlphaButton = createButton("random");
  randomAlphaButton.position(canvasOffsetX + 190, offsetY + 20);
  randomAlphaButton.style("background-color", "lightgreen");
  randomAlphaButton.mousePressed(alphaRandom);

  // Outlines
  offsetY += 70;
  outlineButton = createButton("outline");
  outlineButton.position(canvasOffsetX + 10, offsetY + 0);
  outlineButton.mousePressed(outline);

  noOutlineButton = createButton("no outline");
  noOutlineButton.position(canvasOffsetX + 90, offsetY + 0);
  noOutlineButton.mousePressed(noOutline);

  randOutButton = createButton("random");
  randOutButton.position(canvasOffsetX + 190, offsetY + 0);
  randOutButton.mousePressed(randOutline);
  randOutline();

  // Styles
  offsetY += 50;
  let styleLabel = createElement("style", "Style:");
  styleLabel.position(canvasOffsetX + 10, offsetY - 20);
  
  styleDropdown = createSelect();
  styleDropdown.position(canvasOffsetX + 10, offsetY + 0);
  styleDropdown.option('smooth');
  styleDropdown.option('wave');
  styleDropdown.option('geometric');
  styleDropdown.option('spiral');
  styleDropdown.option('zigzag');
  styleDropdown.option('double');
  styleDropdown.option('random');
  styleDropdown.selected('random');
  styleDropdown.changed(styleChanged);

  // Overlaps
  offsetY += 50;
  overlapSlider = createSlider(0, 100, 50);
  overlapSlider.position(canvasOffsetX + 10, offsetY + 20);
  let overlap = createElement("overlap", "");
  overlap.position(canvasOffsetX + 40, offsetY + 0);
  
  // Function to get label based on value
  const getSpacingLabel = (value) => {
    return value < 33 ? "Dense" : value < 66 ? "Medium" : "Spread";
  };
  
  // Set initial label
  overlap.html(`Spacing: ${getSpacingLabel(overlapSlider.value())}`);
  
  overlapSlider.input(() => {
    overlap.html(`Spacing: ${getSpacingLabel(overlapSlider.value())}`);
  });

  offsetY += 50;
  newArtButton = createButton("new art");
  newArtButton.position(canvasOffsetX + 10, offsetY + 0);
  newArtButton.style("background-color", "yellow");
  newArtButton.mousePressed(newArt);

  printButton = createButton("save jpg");
  printButton.position(canvasOffsetX + 90, offsetY + 0);
  printButton.style("background-color", "yellow");
  printButton.mousePressed(saveJpg);

  animateButton = createButton("animate");
  animateButton.position(canvasOffsetX + 170, offsetY + 0);
  animateButton.style("background-color", "pink");
  animateButton.mousePressed(toggleAnimation);

  colorMode(HSB, 256, 100, 100, 100);

  // Animation effect controls (hidden by default)
  let animControlY = offsetY + 60;
  rotationCheckbox = createCheckbox('Rotation', true);
  rotationCheckbox.position(canvasOffsetX + 10, animControlY);
  rotationCheckbox.hide();
  rotationSpeedSlider = createSlider(0, 2, 0.5, 0.01);
  rotationSpeedSlider.position(canvasOffsetX + 120, animControlY);
  rotationSpeedSlider.hide();

  animControlY += 30;
  colorShiftCheckbox = createCheckbox('Color Shift', true);
  colorShiftCheckbox.position(canvasOffsetX + 10, animControlY);
  colorShiftCheckbox.hide();
  colorShiftSpeedSlider = createSlider(0, 2, 0.5, 0.01);
  colorShiftSpeedSlider.position(canvasOffsetX + 120, animControlY);
  colorShiftSpeedSlider.hide();

  // Add opacity animation controls
  animControlY += 30;
  opacityCheckbox = createCheckbox('Opac. Pulse', true);
  opacityCheckbox.position(canvasOffsetX + 10, animControlY);
  opacityCheckbox.hide();
  opacitySpeedSlider = createSlider(0, 2, 0.5, 0.01);
  opacitySpeedSlider.position(canvasOffsetX + 120, animControlY);
  opacitySpeedSlider.hide();
  opacitySpeedSlider.input(() => {
    targetOpacitySpeed = opacitySpeedSlider.value();
  });

  opacityCheckbox.changed(() => {
    if (!opacityCheckbox.checked()) {
      // Store the current opacity when disabling pulse
      lastPulseOpacity = currentOpacity;
      opacityValue = lastPulseOpacity;
    }
  });

  newArt();
}

function newArt() {
  background(0);
  
  // Reset animation parameters
  animationFrame = 0;
  rotationAngle = 0;
  
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
  
  // get variable values
  if (randomPetalsMode == 1) {
    numPetals = petalSlider.value();
  } else {
    numPetals = floor(random(6, 12)) * 2; // Generate even numbers between 12 and 24
  }
  petalAngle = 360 / numPetals;
  
  if (randomLayersMode == 1) {
    numLayers = layersSlider.value();
  } else {
    numLayers = floor(random(8, 16)); 
  }
  
  // Calculate overlap based on slider value
  let overlapValue = overlapSlider.value() / 100;
  layerCushion = (halfCanvasSize / numLayers) * (0.8 + (overlapValue * 0.3));
  
  if (randomAlphaMode == 1) {
    opacityValue = alphaSlider.value();
  } else {
    opacityValue = random(70, 90); 
  }
  
  if (randomOutlineMode == 1) {
    showOutline = round(random(1));
  }
  
  if (randomCurveMode == true) {
    curveStyle = floor(random(3)); 
  }
  
  // Draw the mandala
  for (let j = 0; j < numLayers; j++) {
    let layerProgress = j / numLayers;
    
    startX = halfCanvasSize * (0.75 - j * 0.02) - j * layerCushion;
    endX = halfCanvasSize * (0.9 - j * 0.02) - j * layerCushion;
    startY = 0;
    endY = 0;
    
    // Control points for curves
    ctrl1X = startX + (endX - startX) * 0.3;
    ctrl2X = startX + (endX - startX) * 0.7;
    
    let heightMultiplier = 0.6 - (layerProgress * 0.2); // Decreases with depth
    ctrl1Y = ctrl1X * tan(petalAngle) * heightMultiplier;
    ctrl2Y = ctrl2X * tan(petalAngle) * heightMultiplier;
    
    let hue, sat, brt;
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
    
    // Layer-based color adjustments
    sat = sat * (1 - layerProgress * 0.1);
    brt = brt * (1 - layerProgress * 0.05);
    
    // Store initial colors for color shift
    initialColors[j] = {hue, sat, brt};
    
    fill(hue, sat, brt, opacityValue);
    
    // Draw petals
    for (let i = 0; i < numPetals / 2; i++) {
      if (showOutline == 1) {
        stroke(0);
        strokeWeight(strokeWeightValue);
      } else {
        noStroke();
      }
      
      switch(curveStyle) {
        case 0: // Smooth style - gentle curves
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
          
        case 1: // Wave style - more pronounced curves
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
          
        case 2: // Geometric style - straight shapes
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

        case 3: // Spiral style - curved petals with spiral effect
          let spiralFactor = 1 + (j * 0.1);
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

        case 4: // Zigzag style - angular petals
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

        case 5: // Double style - overlapping petals
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
      
      rotate(petalAngle * 2);
    }
    rotate(petalAngle);
  }
}

// Button functions
function petalsRandom() {
  randomPetalsMode = randomPetalsMode * -1;
  if (randomPetalsMode == 1) {
    randomPetalButton.style("background-color", "pink");
    // Only allow even numbers
    let currentValue = petalSlider.value();
    if (currentValue % 2 !== 0) {
      petalSlider.value(currentValue + 1);
    }
  } else {
    randomPetalButton.style("background-color", "lightgreen");
  }
}
function layersRandom() {
  randomLayersMode = randomLayersMode * -1;
  if (randomLayersMode == 1) {
    randomLayersButton.style("background-color", "pink");
  } else {
    randomLayersButton.style("background-color", "lightgreen");
  }
}
function alphaRandom() {
  randomAlphaMode = randomAlphaMode * -1;
  if (randomAlphaMode == 1) {
    randomAlphaButton.style("background-color", "pink");
  } else {
    randomAlphaButton.style("background-color", "lightgreen");
  }
}
function outline() {
  showOutline = 1;
  randomOutlineMode = 0;
  noOutlineButton.style("background-color", "pink");
  outlineButton.style("background-color", "lightgreen");
  randOutButton.style("background-color", "pink");
}
function noOutline() {
  showOutline = 0;
  randomOutlineMode = 0;
  noOutlineButton.style("background-color", "lightgreen");
  outlineButton.style("background-color", "pink");
  randOutButton.style("background-color", "pink");
}
function randOutline() {
  randomOutlineMode = 1;
  noOutlineButton.style("background-color", "pink");
  outlineButton.style("background-color", "pink");
  randOutButton.style("background-color", "lightgreen");
}
function styleChanged() {
  let selected = styleDropdown.value();
  switch(selected) {
    case 'smooth':
      curveStyle = 0;
      randomCurveMode = false;
      break;
    case 'wave':
      curveStyle = 1;
      randomCurveMode = false;
      break;
    case 'geometric':
      curveStyle = 2;
      randomCurveMode = false;
      break;
    case 'spiral':
      curveStyle = 3;
      randomCurveMode = false;
      break;
    case 'zigzag':
      curveStyle = 4;
      randomCurveMode = false;
      break;
    case 'double':
      curveStyle = 5;
      randomCurveMode = false;
      break;
    case 'random':
      randomCurveMode = true;
      break;
  }
  
  // newArt(); // Create new art
}

function saveJpg() {
  save("myCanvas.jpg");
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  if (isAnimating) {
    animateButton.style("background-color", "lightgreen");
    // Store the current state when starting animation
    lastAnimationState = true;
    // Show animation controls
    rotationCheckbox.show();
    rotationSpeedSlider.show();
    colorShiftCheckbox.show();
    colorShiftSpeedSlider.show();
    opacityCheckbox.show();
    opacitySpeedSlider.show();
    loop();
  } else {
    animateButton.style("background-color", "pink");
    // Store the current state when stopping animation
    lastAnimationState = false;
    // Hide animation controls
    rotationCheckbox.hide();
    rotationSpeedSlider.hide();
    colorShiftCheckbox.hide();
    colorShiftSpeedSlider.hide();
    opacityCheckbox.hide();
    opacitySpeedSlider.hide();
    noLoop();
  }
}

function draw() {
  if (!isAnimating) return;
  
  background(0);
  animationFrame++;
  
  // Use animation controls
  let doRotation = rotationCheckbox.checked();
  let doColorShift = colorShiftCheckbox.checked();
  let doOpacityPulse = opacityCheckbox.checked();
  rotationSpeed = rotationSpeedSlider.value();
  colorShiftSpeed = colorShiftSpeedSlider.value();
  let opacitySpeed = opacitySpeedSlider.value();

  // Update rotation angle if rotation is enabled
  if (doRotation) {
    rotationAngle += rotationSpeed;
  }

  // Reset and translate to center of canvas
  resetMatrix();
  translate(width / 2, height / 2);
  
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
  
  // Draw the mandala with animation
  for (let j = 0; j < numLayers; j++) {
    let layerProgress = j / numLayers;
    
    startX = halfCanvasSize * (0.75 - j * 0.02) - j * layerCushion;
    endX = halfCanvasSize * (0.9 - j * 0.02) - j * layerCushion;
    startY = 0;
    endY = 0;
    
    // Control points for curves
    ctrl1X = startX + (endX - startX) * 0.3;
    ctrl2X = startX + (endX - startX) * 0.7;
    
    let heightMultiplier = 0.6 - (layerProgress * 0.2);
    ctrl1Y = ctrl1X * tan(petalAngle) * heightMultiplier;
    ctrl2Y = ctrl2X * tan(petalAngle) * heightMultiplier;
    
    // Dynamic color transitions
    let hue, sat, brt;
    
    if (doColorShift) {
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
      // Store the current colors when color shift is enabled
      initialColors[j] = {hue, sat, brt};
    } else {
      // Use stored colors when color shift is disabled
      if (initialColors[j]) {
        hue = initialColors[j].hue;
        sat = initialColors[j].sat;
        brt = initialColors[j].brt;
      } else {
        // Fallback if no stored colors (shouldn't happen)
        switch(colorHarmony) {
          case 0: // Analogous
            hue = (baseHue + random(-20, 20)) % 256;
            sat = 80;
            brt = 90;
            break;
          case 1: // Complementary
            hue = (baseHue + (j % 2) * 128) % 256;
            sat = 85;
            brt = 85;
            break;
          case 2: // Triadic
            hue = (baseHue + (j % 3) * 85) % 256;
            sat = 75;
            brt = 90;
            break;
        }
        initialColors[j] = {hue, sat, brt};
      }
    }
    
    // Layer-based color adjustments
    sat = sat * (1 - layerProgress * 0.1);
    brt = brt * (1 - layerProgress * 0.05);
    
    // Apply current opacity value
    fill(hue, sat, brt, currentOpacity);
    
    // Draw petals with rotation
    push();
    rotate(rotationAngle * (1 - layerProgress * 0.5));
    
    for (let i = 0; i < numPetals / 2; i++) {
      if (showOutline == 1) {
        stroke(0);
        strokeWeight(strokeWeightValue);
      } else {
        noStroke();
      }
      
      // Use the existing curve style drawing code
      switch(curveStyle) {
        case 0: // Smooth style
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
          
        case 1: // Wave style
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
          
        case 2: // Geometric style
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

        case 3: // Spiral style
          let spiralFactor = 1 + (j * 0.1);
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

        case 4: // Zigzag style
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

        case 5: // Double style
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
      
      rotate(petalAngle * 2);
    }
    pop();
    rotate(petalAngle);
  }
}
