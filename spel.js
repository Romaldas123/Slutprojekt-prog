const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1],
  [1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,0,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1],    
  [1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
  [1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1],
  [1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const tileSize = 50;
const mapRows = map.length;
const mapCols = map[0].length;

let mapOffsetX = 0;
let mapOffsetY = 0;

function calculateMapOffset() {
  const totalMapWidth = mapCols * tileSize;
  const totalMapHeight = mapRows * tileSize;
  mapOffsetX = (canvas.width - totalMapWidth) / 2;
  mapOffsetY = (canvas.height - totalMapHeight) / 2;
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  calculateMapOffset();
  pacman.x = mapOffsetX + (mapCols * tileSize) / 2;
  pacman.y = mapOffsetY + (mapRows * tileSize) / 2;
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

let pacman = {
  x: 0,
  y: 0,
  radius: 20,
  speed: 3,
  dx: 0,
  dy: 0,
  direction: "right"
};

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      pacman.dx = 0;
      pacman.dy = -pacman.speed;
      pacman.direction = "up";
      break;
    case "ArrowDown":
      pacman.dx = 0;
      pacman.dy = pacman.speed;
      pacman.direction = "down";
      break;
    case "ArrowLeft":
      pacman.dx = -pacman.speed;
      pacman.dy = 0;
      pacman.direction = "left";
      break;
    case "ArrowRight":
      pacman.dx = pacman.speed;
      pacman.dy = 0;
      pacman.direction = "right";
      break;
  }
});

function drawPacman() {
  const mouthAngle = Math.sin(Date.now() / 100) * 0.2;
  let startAngle = 0.2 + mouthAngle;
  let endAngle = Math.PI * 2 - 0.2 - mouthAngle;

  let rotation = {
    right: 0,
    down: Math.PI / 2,
    left: Math.PI,
    up: -Math.PI / 2
  }[pacman.direction];

  ctx.save();
  ctx.translate(pacman.x, pacman.y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, pacman.radius, startAngle, endAngle);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.restore();
}

function drawMap() {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(
          mapOffsetX + col * tileSize,
          mapOffsetY + row * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }
}

function isWallAt(x, y) {
  const col = Math.floor((x - mapOffsetX) / tileSize);
  const row = Math.floor((y - mapOffsetY) / tileSize);
  
  if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return true;
  
  return map[row][col] === 1;
}

function checkCollision(x, y) {

  const points = [
    {x: x - pacman.radius + 1, y: y - pacman.radius + 1}, 
    {x: x + pacman.radius - 1, y: y - pacman.radius + 1}, 
    {x: x - pacman.radius + 1, y: y + pacman.radius - 1}, 
    {x: x + pacman.radius - 1, y: y + pacman.radius - 1},
    {x: x, y: y} 
  ];

  return points.some(point => isWallAt(point.x, point.y));
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();

  let nextX = pacman.x + pacman.dx;
  let nextY = pacman.y + pacman.dy;

 
  if (pacman.dx !== 0) {
    if (!checkCollision(nextX, pacman.y)) {
      pacman.x = nextX;
    } else {

      if (pacman.dx > 0) {
        pacman.x = Math.floor((nextX + pacman.radius - mapOffsetX) / tileSize) * tileSize + mapOffsetX - pacman.radius - 1;
      } else {
        pacman.x = Math.ceil((nextX - pacman.radius - mapOffsetX) / tileSize) * tileSize + mapOffsetX + pacman.radius + 1;
      }
      pacman.dx = 0;
    }
  }


  if (pacman.dy !== 0) {
    if (!checkCollision(pacman.x, nextY)) {
      pacman.y = nextY;
    } else {
     
      if (pacman.dy > 0) {
        pacman.y = Math.floor((nextY + pacman.radius - mapOffsetY) / tileSize) * tileSize + mapOffsetY - pacman.radius - 1;
      } else {
        pacman.y = Math.ceil((nextY - pacman.radius - mapOffsetY) / tileSize) * tileSize + mapOffsetY + pacman.radius + 1;
      }
      pacman.dy = 0;
    }
  }

  drawPacman();
  requestAnimationFrame(update);
}

resizeCanvas();
update();