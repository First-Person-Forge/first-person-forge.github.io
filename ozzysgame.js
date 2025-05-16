const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 50,
  y: 300,
  width: 40,
  height: 40,
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  jumpPower: -12,
  grounded: false
};

const gravity = 0.7;
const platforms = [
  { x: 0, y: 350, width: 800, height: 50 },
  { x: 300, y: 250, width: 120, height: 20 },
  { x: 500, y: 180, width: 100, height: 20 }
];

const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  // Left/right movement
  if (keys["a"]) player.velocityX = -player.speed;
  else if (keys["d"]) player.velocityX = player.speed;
  else player.velocityX = 0;

  // Jump
  if (keys["w"] && player.grounded) {
    player.velocityY = player.jumpPower;
    player.grounded = false;
  }

  // Apply gravity
  player.velocityY += gravity;
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Collision detection
  player.grounded = false;
  for (let plat of platforms) {
    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y < plat.y + plat.height &&
      player.y + player.height > plat.y
    ) {
      // Collision from top
      if (player.velocityY > 0 && player.y + player.height - player.velocityY <= plat.y) {
        player.y = plat.y - player.height;
        player.velocityY = 0;
        player.grounded = true;
      }
    }
  }

  // Stop player from falling off screen
  if (player.y > canvas.height) {
    player.y = 300;
    player.velocityY = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw platforms
  ctx.fillStyle = "green";
  for (let plat of platforms) {
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
