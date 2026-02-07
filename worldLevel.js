/*
WorldLevel.js (Example 5)

WorldLevel wraps ONE level object from levels.json and provides:
- Theme colours (background/platform/blob)
- Physics parameters that influence the player (gravity, jump velocity)
- Spawn position for the player (start)
- An array of Platform instances
- A couple of helpers to size the canvas to fit the geometry

This is directly inspired by your original blob sketch’s responsibilities: 
- parse JSON
- map platforms array
- apply theme + physics
- infer canvas size

Expected JSON shape for each level (from your provided file): 
{
  "name": "Intro Steps",
  "gravity": 0.65,
  "jumpV": -11.0,
  "theme": { "bg":"...", "platform":"...", "blob":"..." },
  "start": { "x":80, "y":220, "r":26 },
  "platforms": [ {x,y,w,h}, ... ]
}
*/

class WorldLevel {
  constructor(levelJson) {
    // A readable label for HUD.
    this.name = levelJson.name || "Level";

    // Theme defaults + override with JSON.
    this.theme = Object.assign(
      {
        bg: "#F0F0F0",
        platform: "#C8C8C8",
        blob: "#1478FF",
        obstacle: "#FF4D4D",
      },
      levelJson.theme || {},
    );

    // Physics knobs (the blob player will read these).
    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    // Player spawn data.
    this.start = {
      x: levelJson.start?.x ?? 80,
      y: levelJson.start?.y ?? 180,
      r: levelJson.start?.r ?? 26,
    };

    // Convert raw platform objects into Platform instances
    this.platforms = (levelJson.platforms || []).map((p) => new Platform(p));

    // --- NEW: Generate obstacles from JSON ---
    this.obstacles = [];
    if (levelJson.obstaclePatterns) {
      levelJson.obstaclePatterns.forEach((pattern) => {
        for (let i = 0; i < pattern.count; i++) {
          this.obstacles.push(
            new Obstacle({
              x: pattern.startX + i * pattern.spacing,
              y: pattern.y,
              size: pattern.size,
              type: pattern.type,
            }),
          );
        }
      });
    }
  }

  inferWidth(defaultW = 640) {
    if (!this.platforms.length) return defaultW;
    return max(this.platforms.map((p) => p.x + p.w));
  }

  inferHeight(defaultH = 360) {
    if (!this.platforms.length) return defaultH;
    return max(this.platforms.map((p) => p.y + p.h));
  }

  drawWorld() {
    // Draw background
    background(color(this.theme.bg));

    // Draw platforms
    this.platforms.forEach((p) => p.draw(color(this.theme.platform)));

    // Update + draw obstacles
    this.obstacles.forEach((o) => {
      o.update(); // MOVE the obstacle
      o.draw(color(this.theme.obstacle)); // draw it
    });
  }
}
