/*
Platform.js (Example 5)

A Platform is a single axis-aligned rectangle in the world.

Why a class for something "simple"?
- It standardizes the shape of platform data.
- It makes later upgrades easy (e.g., moving platforms, icy platforms, spikes).
- It keeps drawing code in the object that knows what it is.

In JSON, platforms are stored like:
{ "x": 0, "y": 324, "w": 640, "h": 36 } 
*/

class Platform {
  constructor({ x, y, w, h }) {
    // Position is the top-left corner
    this.x = x;
    this.y = y;

    // Size
    this.w = w;
    this.h = h;
  }

  draw(fillColor) {
    fill(fillColor);
    rect(this.x, this.y, this.w, this.h);
  }
}

// New Obstacle class
class Obstacle {
  constructor({ x, y, size, type }) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type; // e.g., "falling"
    this.velocityY = 2; // speed of falling obstacle
  }

  update() {
    // Make obstacle fall
    this.y += this.velocityY;

    // Optional: reset to top when it goes offscreen
    if (this.y > height) {
      this.y = -this.size; // appear above canvas again
      // Optionally randomize x
      this.x = random(50, width - 50);
    }
  }

  draw(fillColor) {
    fill(fillColor);

    if (this.type === "falling") {
      // Draw as a rectangle for simplicity
      rect(this.x, this.y, this.size, this.size);
    }
  }
}

// Function to generate platforms from JSON
function generatePlatforms(level) {
  return level.platforms.map((p) => new Platform(p));
}

// Function to generate obstacles from JSON
function generateObstacles(level) {
  const obstacles = [];

  if (!level.obstaclePatterns) return obstacles;

  level.obstaclePatterns.forEach((pattern) => {
    for (let i = 0; i < pattern.count; i++) {
      obstacles.push(
        new Obstacle({
          x: pattern.startX + i * pattern.spacing,
          y: pattern.y,
          size: pattern.size,
          type: pattern.type,
        }),
      );
    }
  });

  return obstacles;
}
