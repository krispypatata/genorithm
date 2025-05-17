// Class for a single block in the grid
class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.c = 70;  
    this.activated = false;  
    this.animationProgress = 0; 
    this.opacity = 40;
    this.size = 1.0;
    this.lastUpdate = 0; 
    this.animationDuration = 800;
    this.shapeType = floor(random(4));
    this.nextShapeType = this.shapeType;
    this.morphProgress = 0;
    this.isTextBlock = false;
  }

  // Draws the block on the canvas with current properties
  display() {
    push();
    
    // Apply different styling based on block state (activated or not)
    if (this.activated) {
      const validOpacity = constrain(this.opacity, 60, 180);
      
      if (this.isTextBlock) {
        stroke(230, 230, 230, validOpacity);
        strokeWeight(1.5);
        fill(230, 230, 230, validOpacity * 0.25);
      } else {
        stroke(this.c, this.c, this.c, validOpacity);
        strokeWeight(1.5);
        fill(this.c, this.c, this.c, validOpacity * 0.15);
      }
    } else if (this.isTextBlock) {
      stroke(220, 220, 220, 180);
      strokeWeight(1.2);
      fill(220, 220, 220, 50);
    } else {
      stroke(80, 80, 80, 70);
      strokeWeight(0.8);
      noFill();
    }

    translate(this.x, this.y);
    rotate(this.angle);
    scale(this.size);
    
    this.drawShape();
    
    pop();
  }

  // Updates the block's animation state
  move() {
    // Only update animation if the block is activated
    if (this.activated) {
      const currentTime = millis();
      const deltaTime = currentTime - this.lastUpdate;
      this.lastUpdate = currentTime;
      
      const progressIncrement = deltaTime / this.animationDuration;
      this.animationProgress += progressIncrement;
      
      const easedProgress = this.customEasing(min(this.animationProgress, 1));
      
      this.angle = 90 * this.easeOutBack(min(easedProgress * 1.2, 1));
      
      // Adjust opacity based on animation phase
      if (this.animationProgress <= 0.2) {
        this.opacity = map(this.easeInOutCubic(this.animationProgress / 0.2), 0, 1, 180, 255);
      } else {
        this.opacity = map(this.easeOutCubic((this.animationProgress - 0.2) / 0.8), 0, 1, 255, 60);
      }
      
      const scaleCurve = this.easeOutElastic(min(this.animationProgress * 1.5, 1));
      this.size = 1 + 0.15 * scaleCurve;
      
      this.c = map(this.easeInOutCubic(this.animationProgress), 0, 1, 200, 70);
      
      // Handle shape morphing at different stages of animation
      if (this.animationProgress > 0.1 && this.animationProgress < 0.15) {
        this.nextShapeType = (this.shapeType + 1) % 4;
        this.morphProgress = map(this.animationProgress, 0.1, 0.15, 0, 1);
      } else if (this.animationProgress > 0.4 && this.animationProgress < 0.5) {
        this.nextShapeType = (this.shapeType + 2) % 4;
        this.morphProgress = map(this.animationProgress, 0.4, 0.5, 0, 1);
      } else if (this.animationProgress > 0.7 && this.animationProgress < 0.8) {
        this.nextShapeType = this.shapeType;
        this.morphProgress = map(this.animationProgress, 0.7, 0.8, 0, 1);
      } else if (this.animationProgress <= 0.1 || this.animationProgress >= 0.8) {
        this.morphProgress = 0;
      } else if (this.animationProgress >= 0.15 && this.animationProgress <= 0.4) {
        this.morphProgress = 1;
      } else if (this.animationProgress >= 0.5 && this.animationProgress <= 0.7) {
        this.morphProgress = 1;
      }
      
      // Reset block properties when animation completes
      if (this.animationProgress >= 1) {
        this.angle = 0;
        this.animationProgress = 0;
        this.activated = false;
        this.c = 70;
        this.opacity = 70;
        this.size = 1.0;
        this.morphProgress = 0;
        if (random() < 0.3) {
          this.shapeType = floor(random(4));
        }
        this.nextShapeType = this.shapeType;
      }
    }
  }
  
  // Draws the current shape based on shape type and morphing state
  drawShape() {
    const margin = -size / 2;
    const inset = offset / 2;
    const sizeWithOffset = size - offset;
    
    // Draw the current shape when not morphing
    if (this.morphProgress === 0) {
      switch(this.shapeType) {
        case 0: // X shape
          this.drawX(margin, inset, sizeWithOffset);
          break;
        case 1: // Square
          this.drawRect(margin, inset, sizeWithOffset);
          break;
        case 2: // Circle
          this.drawCircle(margin, inset, sizeWithOffset);
          break;
        case 3: // Diamond
          this.drawDiamond(margin, inset, sizeWithOffset);
          break;
      }
    } 
    // Draw the target shape when morphing is complete
    else if (this.morphProgress === 1) {
      switch(this.nextShapeType) {
        case 0: // X shape
          this.drawX(margin, inset, sizeWithOffset);
          break;
        case 1: // Square
          this.drawRect(margin, inset, sizeWithOffset);
          break;
        case 2: // Circle
          this.drawCircle(margin, inset, sizeWithOffset);
          break;
        case 3: // Diamond
          this.drawDiamond(margin, inset, sizeWithOffset);
          break;
      }
    } 
    // Draw both shapes during morphing transition
    else {
      switch(this.shapeType) {
        case 0: this.drawX(margin, inset, sizeWithOffset); break;
        case 1: this.drawRect(margin, inset, sizeWithOffset); break;
        case 2: this.drawCircle(margin, inset, sizeWithOffset); break;
        case 3: this.drawDiamond(margin, inset, sizeWithOffset); break;
      }
      
      switch(this.nextShapeType) {
        case 0: this.drawX(margin, inset, sizeWithOffset); break;
        case 1: this.drawRect(margin, inset, sizeWithOffset); break;
        case 2: this.drawCircle(margin, inset, sizeWithOffset); break;
        case 3: this.drawDiamond(margin, inset, sizeWithOffset); break;
      }
    }
  }
  
  // Draws an X shape
  drawX(margin, inset, sizeWithOffset) {
    line(margin + inset, margin + inset, margin + sizeWithOffset + inset, margin + sizeWithOffset + inset);
    line(margin + sizeWithOffset + inset, margin + inset, margin + inset, margin + sizeWithOffset + inset);
  }
  
  // Draws a square
  drawRect(margin, inset, sizeWithOffset) {
    rect(0, 0, sizeWithOffset, sizeWithOffset);
  }
  
  // Draws a circle
  drawCircle(margin, inset, sizeWithOffset) {
    ellipse(0, 0, sizeWithOffset, sizeWithOffset);
  }
  
  // Draws a diamond
  drawDiamond(margin, inset, sizeWithOffset) {
    const halfSize = sizeWithOffset / 2;
    beginShape();
    vertex(0, -halfSize);
    vertex(halfSize, 0);
    vertex(0, halfSize);
    vertex(-halfSize, 0);
    endShape(CLOSE);
  }
  
  // Provides a smooth transition between values
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  // Creates a smooth cubic easing for transitions
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Creates a smooth exit curve
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  // Creates a bouncy elastic effect at the end of animation
  easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
  
  // Creates a slight overshoot at the end of animation
  easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  
  // Combines multiple easing functions for a more natural animation
  customEasing(t) {
    // Use cubic easing for first half of animation
    if (t < 0.5) {
      return this.easeInOutCubic(t * 2) / 2;
    } 
    // Use different easing for second half
    else {
      return 0.5 + this.easeOutCubic((t - 0.5) * 2) / 2;
    }
  }
}

let distMouse = 15;
let blocks = [];
let size = 10;
let offset = 4;

let cols;
let rows;
let mouseIsMoving = false;
let mousePath = [];
let maxPathLength = 10;
let textGraphic; // Buffer for text detection

// Initialize the canvas and create the grid of blocks
function setup() {
  createCanvas(windowWidth, windowHeight/2);
  rectMode(CENTER);
  angleMode(DEGREES);
  frameRate(60);

  cols = floor(width/size);
  rows = floor(height/size);

  createTextGraphic();
  createBlocks();
}

// Creates a graphic buffer with the text "GENORITHM" for highlighting blocks
function createTextGraphic() {
  textGraphic = createGraphics(width, height);
  textGraphic.background(0);
  
  const letterPatterns = {
    'G': [
      [1,1,1,1,1],
      [1,0,0,0,0],
      [1,0,1,1,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ],
    'E': [
      [1,1,1,1,1],
      [1,0,0,0,0],
      [1,1,1,0,0],
      [1,0,0,0,0],
      [1,1,1,1,1]
    ],
    'N': [
      [1,0,0,0,1],
      [1,1,0,0,1],
      [1,0,1,0,1],
      [1,0,0,1,1],
      [1,0,0,0,1]
    ],
    'O': [
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ],
    'R': [
      [1,1,1,1,0],
      [1,0,0,0,1],
      [1,1,1,1,0],
      [1,0,1,0,0],
      [1,0,0,1,0]
    ],
    'I': [
      [1,1,1,1,1],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [1,1,1,1,1]
    ],
    'T': [
      [1,1,1,1,1],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0]
    ],
    'H': [
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,0,0,0,1]
    ],
    'M': [
      [1,0,0,0,1],
      [1,1,0,1,1],
      [1,0,1,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1]
    ]
  };
  
  const word = "GENORITHM";
  const pixelSize = max(width / (word.length * 8), 4);
  
  const totalWidth = word.length * 6 * pixelSize;
  const startX = (width - totalWidth) / 2;
  const startY = (height - 5 * pixelSize) / 2;
  
  textGraphic.fill(255);
  textGraphic.noStroke();
  
  // Loop through each letter in the word
  for (let charIndex = 0; charIndex < word.length; charIndex++) {
    const letter = word[charIndex];
    const pattern = letterPatterns[letter];
    
    if (pattern) {
      // Draw each pixel of the letter pattern
      for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
          if (pattern[y][x] === 1) {
            const posX = startX + charIndex * 6 * pixelSize + x * pixelSize;
            const posY = startY + y * pixelSize;
            textGraphic.rect(posX, posY, pixelSize, pixelSize);
          }
        }
      }
    }
  }
}

// Creates the grid of blocks and marks blocks that are part of the text
function createBlocks() {
  blocks = [];
  // Create a 2D array of blocks based on grid dimensions
  for (let i = 0; i < cols; i++) {
    blocks[i] = [];
    for (let j = 0; j < rows; j++) {
      blocks[i][j] = new Block(size / 2 + i * size, size / 2 + j * size);
      
      const blockX = size / 2 + i * size;
      const blockY = size / 2 + j * size;
      
      blocks[i][j].isTextBlock = isPositionInText(blockX, blockY);
    }
  }
}

// Checks if a position is part of the text by sampling the text graphic
function isPositionInText(x, y) {
  if (!textGraphic) return false;
  
  const pixel = textGraphic.get(x, y);
  
  return pixel[0] > 0;
}

// Resizes the canvas and rebuilds the grid when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight/2);
  cols = floor(width/size);
  rows = floor(height/size);
  createTextGraphic();
  createBlocks();
}

// Updates and displays all blocks on each frame
function draw() {
  background(0);
  
  // Check if mouse position changed since last frame
  mouseIsMoving = (pmouseX !== mouseX || pmouseY !== mouseY);
  
  // When mouse is moving, create and activate blocks along the path
  if (mouseIsMoving) {
    // Store mouse positions to create a smooth trail effect
    mousePath.push({x: mouseX, y: mouseY, timestamp: millis()});
    
    // Keep only the most recent positions
    if (mousePath.length > maxPathLength) {
      mousePath.shift();
    }
    
    // Calculate how fast the mouse is moving
    const mouseVelocity = dist(mouseX, mouseY, pmouseX, pmouseY);
    
    // If enough points collected, create a smooth curve between them
    if (mousePath.length >= 4) {
      const steps = constrain(ceil(mouseVelocity * 2), 8, 20);
      
      // Create points along the curve between recorded mouse positions
      for (let i = 0; i < mousePath.length - 3; i++) {
        const p0 = mousePath[i];
        const p1 = mousePath[i+1];
        const p2 = mousePath[i+2];
        const p3 = mousePath[i+3];
        
        for (let t = 0; t < steps; t++) {
          const progress = t / steps;
          const splinePoint = getCatmullRomPoint(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, progress);
          
          const activationRadius = distMouse + min(mouseVelocity/1.5, 12);
          
          activateNearbyBlocksWithFalloff(splinePoint.x, splinePoint.y, activationRadius);
        }
      }
    } else {
      activateNearbyBlocksWithFalloff(mouseX, mouseY, distMouse + min(mouseVelocity/1.5, 12));
    }
    
    const currentTime = millis();
    // Remove old mouse positions from the path
    mousePath = mousePath.filter(point => currentTime - point.timestamp < 200);
  }
  
  // Update and display all blocks in the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      blocks[i][j].move();
      blocks[i][j].display();
    }
  }
}

// Calculates a point along a smooth curve using Catmull-Rom spline interpolation
function getCatmullRomPoint(x0, y0, x1, y1, x2, y2, x3, y3, t) {
  // This creates a smooth curve through the 4 mouse points
  // t is a value between 0 and 1 that determines position along the curve
  const t2 = t * t;
  const t3 = t2 * t;
  
  // Calculate blending factors for the smooth curve
  const b0 = 0.5 * (-t3 + 2*t2 - t);
  const b1 = 0.5 * (3*t3 - 5*t2 + 2);
  const b2 = 0.5 * (-3*t3 + 4*t2 + t);
  const b3 = 0.5 * (t3 - t2);
  
  // Blend the four input points to get the final curve point
  const x = b0*x0 + b1*x1 + b2*x2 + b3*x3;
  const y = b0*y0 + b1*y1 + b2*y2 + b3*y3;
  
  return {x, y};
}

// Activates blocks near the given position with intensity based on distance
function activateNearbyBlocksWithFalloff(x, y, radius) {
  // Convert mouse position to grid coordinates
  const centerI = floor(x / size);
  const centerJ = floor(y / size);
  
  // Calculate how many grid cells we need to check in each direction
  const checkRadius = ceil(radius / size) + 1;
  
  // Loop through all blocks within the activation area
  for (let i = max(0, centerI - checkRadius); i <= min(cols - 1, centerI + checkRadius); i++) {
    for (let j = max(0, centerJ - checkRadius); j <= min(rows - 1, centerJ + checkRadius); j++) {
      const block = blocks[i][j];
      const distance = dist(x, y, block.x, block.y);
      
      // Activate blocks within the radius that aren't already activated
      if (distance < radius && !block.activated) {
        // Add a small random delay to create more natural ripple effect
        const activationDelay = random(0, 0.05);
        block.activated = true;
        block.animationProgress = -activationDelay;
        block.lastUpdate = millis();
        
        // Blocks closer to the mouse position appear brighter
        const intensity = map(distance, 0, radius, 0.9, 0.6);
        block.c = 200 * intensity;
        
        // Add slight variation to animation speed
        block.animationDuration = random(700, 900);
      }
    }
  }
}
