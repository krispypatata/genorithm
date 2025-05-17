class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.c = 70;
  }

  display() {
    noFill();
    stroke(this.c);
    push();

    translate(this.x, this.y);
    // rotate(this.angle);
    if (this.angle > 0 && this.angle < 45) {
      this.drawRect();
    } else {
      this.drawX();
    }
    pop();
  }

  move() {
    // If the mouse is moving, check distance between mouse loc and center of square
    let distance;
    if (pmouseX - mouseX != 0 || pmouseY - mouseY != 0) {
      distance = dist(mouseX, mouseY, this.x, this.y);
      // print(distance);

      if (distance < distMouse) {
        this.angle += 1;
        this.c = 255;
      }
    }

    // If squares are already rotating, keep rotating until angle == 90
    if (this.angle > 0 && this.angle < 90) {
      this.angle += 1;

      if (this.c > 70) {
        this.c -= 3;
      }
      
    } else {
      this.angle = 0;
      this.c = 70;
    }
  }

  drawX () {
    let margin = - size / 2;
    line(margin + offset / 2, margin + offset / 2, margin + size - offset / 2, margin + size - offset / 2);
     
    line(margin + size - offset / 2, margin + offset / 2, margin + offset / 2, margin + size - offset / 2);

  }

  drawRect() {
    rect(0, 0, size - offset, size - offset);
  }
}

let distMouse = 15;
let blocks = [];
let size = 10;
let offset = 4;

let cols;
let rows;

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  angleMode(DEGREES);

  // cols = 4;
  // rows = 4;

  cols = width/size;
  rows = height/size;

  for (let i = 0; i < cols; i++) {
    blocks[i] = [];
    for (let j = 0; j < rows; j++) {
      blocks[i][j] = new Block(size / 2 + i * size, size / 2 + j * size);
    }
  }

}

function draw() {
  background(0);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      blocks[i][j].move();
      blocks[i][j].display();

    }
  }

  // print(pmouseX, mouseX, pmouseY, mouseY)
}
