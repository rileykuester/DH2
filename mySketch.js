let pelicanX;
let pelicanY;
let speedX;
let direction = 1;

let trail = [];
let clouds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pelicanX = 0;
  pelicanY = height * 0.7;
  speedX = 2;

  // Create initial clouds
  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: random(width),
      y: random(50, height * 0.4),
      speed: random(0.3, 1),
    });
  }
}

function draw() {
  background(135, 206, 250); // sky blue

  // Draw and move clouds
  drawClouds();

  // ground
  fill(50, 200, 70);
  noStroke();
  rect(0, height * 0.8, width, height * 0.2);

  // trail
  drawTrail();

  drawPelicanOnBike(pelicanX, pelicanY);

  // update pelican position
  pelicanX += speedX * direction;

  // Add trail puff
  trail.push({ x: pelicanX, y: pelicanY + 35, alpha: 255 });

  // Reverse direction at edges
  if (pelicanX > width + 100 || pelicanX < -100) {
    direction *= -1;
  }

  // Limit trail length
  if (trail.length > 100) {
    trail.shift();
  }
}

function drawClouds() {
  noStroke();
  fill(255);

  for (let c of clouds) {
    ellipse(c.x, c.y, 60, 40);
    ellipse(c.x + 25, c.y + 5, 50, 30);
    ellipse(c.x - 25, c.y + 10, 40, 25);
    c.x -= c.speed;
    if (c.x < -80) {
      c.x = width + 80;
      c.y = random(50, height * 0.4);
    }
  }
}

function drawTrail() {
  noStroke();
  for (let t of trail) {
    fill(255, 255, 255, t.alpha);
    ellipse(t.x, t.y, 20);
    t.alpha -= 3; // fade out
  }
}

function drawPelicanOnBike(x, y) {
  push();
  translate(x, y);
  scale(direction, 1); // flip for left/right

  // Draw wheels
  fill(0);
  ellipse(-40, 40, 40, 40); // back wheel
  ellipse(40, 40, 40, 40);  // front wheel

  // Frame
  stroke(80);
  strokeWeight(4);
  line(-40, 40, 0, 10);
  line(0, 10, 40, 40);
  line(0, 10, 0, -20);

  // Body
  noStroke();
  fill(255, 255, 200);
  ellipse(0, -40, 50, 60); // body

  // Head
  ellipse(0, -70, 30, 30);
  fill(255, 150, 0);
  triangle(15, -70, 45, -60, 15, -60); // beak

  // Eye
  fill(0);
  ellipse(5, -75, 5, 5);

  // Legs
  stroke(255, 150, 0);
  strokeWeight(3);
  line(-10, -10, -20, 30);
  line(10, -10, 20, 30);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
