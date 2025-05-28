let pelicanX;
let pelicanY;
let speedX;
let direction = 1;

let trail = [];
let clouds = [];
let bubbles = [];

// Pond properties
let pондX;
let pondY;
let pondWidth = 200;
let pondHeight = 100;
let isInWater = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pelicanX = 0;
  pelicanY = height * 0.7;
  speedX = 2;

  // Initialize pond position
  pондX = width / 2 - pondWidth / 2;
  pondY = height * 0.7;

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

  // Draw pond
  drawPond();

  // trail
  drawTrail();

  // Check if pelican is in water
  checkWaterCollision();

  // Draw bubbles if in water
  if (isInWater) {
    drawBubbles();
    // Add new bubbles occasionally
    if (frameCount % 10 == 0) {
      bubbles.push({
        x: pelicanX + random(-30, 30),
        y: pelicanY + random(20, 50),
        size: random(5, 15),
        life: 60
      });
    }
  }

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

function drawPond() {
  // Draw pond water
  fill(70, 130, 180);
  noStroke();
  ellipse(pондX + pondWidth/2, pondY + pondHeight/2, pondWidth, pondHeight);
  
  // Add some water shimmer effect
  fill(100, 150, 200, 100);
  ellipse(pондX + pondWidth/2 + sin(frameCount * 0.1) * 10, pondY + pondHeight/2, pondWidth * 0.8, pondHeight * 0.8);
}

function checkWaterCollision() {
  // Check if pelican is in the pond area
  let pelicanCenterX = pelicanX;
  let pelicanCenterY = pelicanY;
  
  // Calculate distance from pelican to pond center
  let pondCenterX = pондX + pondWidth/2;
  let pondCenterY = pondY + pondHeight/2;
  
  let distance = dist(pelicanCenterX, pelicanCenterY, pondCenterX, pondCenterY);
  
  // Check if pelican is within pond bounds (ellipse collision)
  let normalizedX = (pelicanCenterX - pondCenterX) / (pondWidth/2);
  let normalizedY = (pelicanCenterY - pondCenterY) / (pondHeight/2);
  
  if (normalizedX * normalizedX + normalizedY * normalizedY <= 1) {
    isInWater = true;
    // Sink the pelican slightly when in water
    pelicanY = height * 0.7 + 20;
  } else {
    isInWater = false;
    // Return to normal height when out of water
    pelicanY = height * 0.7;
  }
}

function drawBubbles() {
  noStroke();
  
  // Update and draw existing bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let bubble = bubbles[i];
    
    // Draw bubble
    fill(255, 255, 255, map(bubble.life, 0, 60, 0, 150));
    ellipse(bubble.x, bubble.y, bubble.size);
    
    // Move bubble up
    bubble.y -= 1;
    bubble.life--;
    
    // Remove dead bubbles
    if (bubble.life <= 0 || bubble.y < pondY) {
      bubbles.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
