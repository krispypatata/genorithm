class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.c = 70;
    this.activated = false;
    this.animationProgress = 0;
    this.opacity = 40; // Lower default opacity for background grid
    this.size = 1.0;
    this.lastUpdate = 0;
    this.animationDuration = 800; // Animation duration in milliseconds
    this.shapeType = floor(random(4)); // Random shape type (0-3)
    this.nextShapeType = this.shapeType; // Next shape to transition to
    this.morphProgress = 0; // Progress of morphing between shapes
  }

  display() {
    push();
    
    // Always draw a shape regardless of animation state
    if (this.activated) {
      // For activated blocks, use the animation opacity with minimum value
      const validOpacity = constrain(this.opacity, 60, 180); // Reduced max opacity from 255 to 180
      stroke(this.c, this.c, this.c, validOpacity);
      strokeWeight(1.5); // Slightly thicker lines for active blocks
      
      // Fill with very low opacity for active blocks
      fill(this.c, this.c, this.c, validOpacity * 0.15); // Reduced fill multiplier from 0.2 to 0.15
    } else {
      // For background grid, use a fixed low opacity
      stroke(80, 80, 80, 70); // Increased from 40 to 70 opacity, and color from 70 to 80
      strokeWeight(0.8);
      noFill();
    }

    translate(this.x, this.y);
    rotate(this.angle);
    scale(this.size);
    
    // Draw the appropriate shape based on current state
    this.drawShape();
    
    pop();
  }

  move() {
    // Animation logic - separate from mouse detection
    if (this.activated) {
      // Calculate delta time for frame-rate independent animation
      const currentTime = millis();
      const deltaTime = currentTime - this.lastUpdate;
      this.lastUpdate = currentTime;
      
      // Progress based on actual time passed
      const progressIncrement = deltaTime / this.animationDuration;
      this.animationProgress += progressIncrement;
      
      // Multiple easing functions for more organic motion
      const easedProgress = this.customEasing(min(this.animationProgress, 1));
      
      // Map progress to angle with easing
      this.angle = 90 * this.easeOutBack(min(easedProgress * 1.2, 1));
      
      // Opacity control - quick fade in, longer fade out with bounce
      // Ensure higher minimum opacity to prevent black spaces
      if (this.animationProgress <= 0.2) {
        this.opacity = map(this.easeInOutCubic(this.animationProgress / 0.2), 0, 1, 180, 255);
      } else {
        this.opacity = map(this.easeOutCubic((this.animationProgress - 0.2) / 0.8), 0, 1, 255, 60);
      }
      
      // Scale effect with elastic bounce
      const scaleCurve = this.easeOutElastic(min(this.animationProgress * 1.5, 1));
      this.size = 1 + 0.15 * scaleCurve;
      
      // Color control - smoother transition
      this.c = map(this.easeInOutCubic(this.animationProgress), 0, 1, 200, 70); // Reduced max color from 255 to 200
      
      // Shape morphing control
      // Change shape at certain points in the animation
      if (this.animationProgress > 0.1 && this.animationProgress < 0.15) {
        // First shape change
        this.nextShapeType = (this.shapeType + 1) % 4;
        this.morphProgress = map(this.animationProgress, 0.1, 0.15, 0, 1);
      } else if (this.animationProgress > 0.4 && this.animationProgress < 0.5) {
        // Second shape change
        this.nextShapeType = (this.shapeType + 2) % 4;
        this.morphProgress = map(this.animationProgress, 0.4, 0.5, 0, 1);
      } else if (this.animationProgress > 0.7 && this.animationProgress < 0.8) {
        // Return to original shape
        this.nextShapeType = this.shapeType;
        this.morphProgress = map(this.animationProgress, 0.7, 0.8, 0, 1);
      } else if (this.animationProgress <= 0.1 || this.animationProgress >= 0.8) {
        // Before first change or after last change
        this.morphProgress = 0;
      } else if (this.animationProgress >= 0.15 && this.animationProgress <= 0.4) {
        // Between first and second change
        this.morphProgress = 1;
      } else if (this.animationProgress >= 0.5 && this.animationProgress <= 0.7) {
        // Between second and third change
        this.morphProgress = 1;
      }
      
      // Reset when animation completes
      if (this.animationProgress >= 1) {
        this.angle = 0;
        this.animationProgress = 0;
        this.activated = false;
        this.c = 70;
        this.opacity = 70; // Reset to higher default opacity for background grid (was 40)
        this.size = 1.0;
        this.morphProgress = 0;
        // Occasionally change the base shape type
        if (random() < 0.3) {
          this.shapeType = floor(random(4));
        }
        this.nextShapeType = this.shapeType;
      }
    }
  }
  
  // Draw appropriate shape based on current state and morphing progress
  drawShape() {
    const margin = -size / 2;
    const inset = offset / 2;
    const sizeWithOffset = size - offset;
    
    if (this.morphProgress === 0) {
      // Draw single shape with no morphing
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
    } else if (this.morphProgress === 1) {
      // Draw next shape fully
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
    } else {
      // Draw both shapes during morphing, ensuring no black spaces
      // First draw the shape that's fading out
      switch(this.shapeType) {
        case 0: this.drawX(margin, inset, sizeWithOffset); break;
        case 1: this.drawRect(margin, inset, sizeWithOffset); break;
        case 2: this.drawCircle(margin, inset, sizeWithOffset); break;
        case 3: this.drawDiamond(margin, inset, sizeWithOffset); break;
      }
      
      // Then overlay the shape that's fading in
      switch(this.nextShapeType) {
        case 0: this.drawX(margin, inset, sizeWithOffset); break;
        case 1: this.drawRect(margin, inset, sizeWithOffset); break;
        case 2: this.drawCircle(margin, inset, sizeWithOffset); break;
        case 3: this.drawDiamond(margin, inset, sizeWithOffset); break;
      }
    }
  }
  
  // Shape drawing methods
  drawX(margin, inset, sizeWithOffset) {
    line(margin + inset, margin + inset, margin + sizeWithOffset + inset, margin + sizeWithOffset + inset);
    line(margin + sizeWithOffset + inset, margin + inset, margin + inset, margin + sizeWithOffset + inset);
  }
  
  drawRect(margin, inset, sizeWithOffset) {
    rect(0, 0, sizeWithOffset, sizeWithOffset);
  }
  
  drawCircle(margin, inset, sizeWithOffset) {
    ellipse(0, 0, sizeWithOffset, sizeWithOffset);
  }
  
  drawDiamond(margin, inset, sizeWithOffset) {
    const halfSize = sizeWithOffset / 2;
    beginShape();
    vertex(0, -halfSize);
    vertex(halfSize, 0);
    vertex(0, halfSize);
    vertex(-halfSize, 0);
    endShape(CLOSE);
  }
  
  // Smooth easing function for more natural animation
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  // Additional easing functions for more organic motion
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
  
  easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  
  // Combined custom easing for main animation
  customEasing(t) {
    // Blend different easing functions for more organic feel
    if (t < 0.5) {
      return this.easeInOutCubic(t * 2) / 2;
    } else {
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

function setup() {
  createCanvas(windowWidth, windowHeight/2);
  rectMode(CENTER);
  angleMode(DEGREES);
  frameRate(60); // Ensure smooth frame rate

  cols = floor(width/size);
  rows = floor(height/size);

  createBlocks();
}

function createBlocks() {
  blocks = [];
  for (let i = 0; i < cols; i++) {
    blocks[i] = [];
    for (let j = 0; j < rows; j++) {
      blocks[i][j] = new Block(size / 2 + i * size, size / 2 + j * size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight/2);
  cols = floor(width/size);
  rows = floor(height/size);
  createBlocks();
}

function draw() {
  // Clear the background to black
  background(0);
  
  // Check if mouse is moving
  mouseIsMoving = (pmouseX !== mouseX || pmouseY !== mouseY);
  
  // Update mouse path for smoother trails
  if (mouseIsMoving) {
    mousePath.push({x: mouseX, y: mouseY, timestamp: millis()});
    
    // Keep path at manageable length
    if (mousePath.length > maxPathLength) {
      mousePath.shift();
    }
    
    // Get mouse velocity for dynamic activation radius
    const mouseVelocity = dist(mouseX, mouseY, pmouseX, pmouseY);
    
    // Calculate points along the mouse path with Catmull-Rom spline for smooth curves
    if (mousePath.length >= 4) {
      // More points for smoother trail with no gaps
      const steps = constrain(ceil(mouseVelocity * 2), 8, 20);
      
      for (let i = 0; i < mousePath.length - 3; i++) {
        const p0 = mousePath[i];
        const p1 = mousePath[i+1];
        const p2 = mousePath[i+2];
        const p3 = mousePath[i+3];
        
        for (let t = 0; t < steps; t++) {
          const progress = t / steps;
          const splinePoint = getCatmullRomPoint(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, progress);
          
          // Dynamic activation radius based on mouse speed
          const activationRadius = distMouse + min(mouseVelocity/1.5, 12);
          
          // Activate blocks with falloff based on distance
          activateNearbyBlocksWithFalloff(splinePoint.x, splinePoint.y, activationRadius);
        }
      }
    } else {
      // Fallback for when we don't have enough points for spline
      activateNearbyBlocksWithFalloff(mouseX, mouseY, distMouse + min(mouseVelocity/1.5, 12));
    }
    
    // Clean up old path points
    const currentTime = millis();
    mousePath = mousePath.filter(point => currentTime - point.timestamp < 200);
  }
  
  // Update and display all blocks
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      blocks[i][j].move();
      blocks[i][j].display();
    }
  }
}

// Catmull-Rom spline interpolation for smooth curves
function getCatmullRomPoint(x0, y0, x1, y1, x2, y2, x3, y3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  
  // Catmull-Rom matrix
  const b0 = 0.5 * (-t3 + 2*t2 - t);
  const b1 = 0.5 * (3*t3 - 5*t2 + 2);
  const b2 = 0.5 * (-3*t3 + 4*t2 + t);
  const b3 = 0.5 * (t3 - t2);
  
  // Calculate interpolated point
  const x = b0*x0 + b1*x1 + b2*x2 + b3*x3;
  const y = b0*y0 + b1*y1 + b2*y2 + b3*y3;
  
  return {x, y};
}

// Function to activate blocks with falloff based on distance
function activateNearbyBlocksWithFalloff(x, y, radius) {
  // Calculate center block indices
  const centerI = floor(x / size);
  const centerJ = floor(y / size);
  
  // Only check blocks within a certain range for efficiency
  const checkRadius = ceil(radius / size) + 1;
  
  for (let i = max(0, centerI - checkRadius); i <= min(cols - 1, centerI + checkRadius); i++) {
    for (let j = max(0, centerJ - checkRadius); j <= min(rows - 1, centerJ + checkRadius); j++) {
      const block = blocks[i][j];
      const distance = dist(x, y, block.x, block.y);
      
      if (distance < radius && !block.activated) {
        // Add slight randomization to activation time for more organic feel
        const activationDelay = random(0, 0.05); // Smaller delay to avoid gaps
        block.activated = true;
        block.animationProgress = -activationDelay; // Negative progress creates delay
        block.lastUpdate = millis();
        
        // Intensity based on distance from cursor
        const intensity = map(distance, 0, radius, 0.9, 0.6); // Reduced intensity range from (1, 0.7) to (0.9, 0.6)
        block.c = 200 * intensity; // Reduced from 255 to 200
        
        // Randomize animation duration slightly for more organic feel
        block.animationDuration = random(700, 900);
      }
    }
  }
}
