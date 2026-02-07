/*
Week 4 — Example 5: Example 5: Blob Platformer (JSON + Classes)
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

This file orchestrates everything:
- load JSON in preload()
- create WorldLevel from JSON
- create BlobPlayer
- update + draw each frame
- handle input events (jump, optional next level)

This matches the structure of the original blob sketch from Week 2 but moves
details into classes.
*/
// ==== VARIABLES ====
let data; // raw JSON data
let levelIndex = 0;
let world; // WorldLevel instance
let player; // BlobPlayer instance
let hasWon = false;
let restartButton;

// ==== PRELOAD LEVEL DATA ====
function preload() {
  data = loadJSON("levels.json");
}

// ==== SETUP CANVAS ====
function setup() {
  createCanvas(640, 360);
  player = new BlobPlayer();
  loadLevel(0);

  noStroke();
  textFont("sans-serif");
  textSize(14);
}

// ==== DRAW LOOP ====
function draw() {
  // Draw world
  world.drawWorld();

  // Update obstacles and player only if not won
  if (!hasWon) {
    // Obstacles
    for (const o of world.obstacles) {
      o.update();
      o.draw(world.theme.obstacle);
    }

    // Player
    player.update(world.platforms);
    player.draw(world.theme.blob);

    // Check collisions
    checkObstacleCollisions();

    // Check win condition: last platform
    const topPlatform = world.platforms[world.platforms.length - 1];
    if (
      player.x + player.r > topPlatform.x &&
      player.x - player.r < topPlatform.x + topPlatform.w &&
      player.y + player.r >= topPlatform.y &&
      player.y + player.r <= topPlatform.y + topPlatform.h + 5
    ) {
      hasWon = true;
      showRestartButton();
    }
  }

  // Draw HUD
  fill(255, 255, 255);
  textSize(14);
  textAlign(LEFT, TOP);
  text(world.name, 10, 18);
  text("Move: A/D or ←/→ • Jump: Space/W/↑ • Press N to restart", 10, 36);

  // Draw win overlay on top if won
  if (hasWon) {
    drawWinOverlay();
  }
}

// ==== OBSTACLE COLLISION CHECK ====
function checkObstacleCollisions() {
  for (const o of world.obstacles) {
    if (
      player.x + player.r > o.x &&
      player.x - player.r < o.x + o.size &&
      player.y + player.r > o.y &&
      player.y - player.r < o.y + o.size
    ) {
      // Reset player on collision
      player.spawnFromLevel(world);
    }
  }
}

// ==== WIN OVERLAY ====
function drawWinOverlay() {
  fill(0, 180); // semi-transparent black
  rect(0, 0, width, height);

  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("YOU WIN!", width / 2, height / 2 - 50);
}

// ==== RESTART BUTTON ====
function showRestartButton() {
  restartButton = createButton("Restart");
  restartButton.position(width / 2 - 50, height / 2 + 20);
  restartButton.size(100, 40);
  restartButton.mousePressed(() => {
    restartButton.remove();
    hasWon = false;
    loadLevel(levelIndex);
  });
}

// ==== PLAYER CONTROLS ====
function keyPressed() {
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.jump();
  }

  if (key === "n" || key === "N") {
    const next = (levelIndex + 1) % data.levels.length;
    loadLevel(next);
  }
}

// ==== LOAD LEVEL ====
function loadLevel(i) {
  levelIndex = i;
  hasWon = false;

  // Create world
  world = new WorldLevel(data.levels[levelIndex]);

  // Generate obstacles
  world.obstacles = generateObstacles(data.levels[levelIndex]);

  // Resize canvas to fit level
  const W = world.inferWidth(640);
  const H = world.inferHeight(360);
  resizeCanvas(W, H);

  // Spawn player
  player.spawnFromLevel(world);
}
