const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,0,0,0,0,1,3,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1],
    [1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1],
    [1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,1,1,1,1],
    [1,1,1,1,0,1,0,1,1,0,1,1,2,2,1,1,0,1,1,0,1,0,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1],
    [1,1,1,1,0,1,0,0,0,0,0,0,0,0,3,0,0,0,0,0,1,0,1,1,1,1],
    [1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1],
    [1,1,1,1,0,0,3,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const mapRows = map.length;
const mapCols = map[0].length;

let pellets = [];


function initializePellets() {
    pellets = [];
    for (let row = 0; row < mapRows; row++) {
        pellets[row] = [];
        for (let col = 0; col < mapCols; col++) {
            if (map[row][col] === 0) {
                pellets[row][col] = "normal";
            } else if (map[row][col] === 3) {
                pellets[row][col] = "big";
            } else {
                pellets[row][col] = false;
            }
        }
    }
}

function calculateMapOffset() {
    const totalMapWidth = mapCols * tileSize;
    const totalMapHeight = mapRows * tileSize;
    mapOffsetX = (canvas.width - totalMapWidth) / 2;
    mapOffsetY = (canvas.height - totalMapHeight) / 2;
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

function drawPellets() {
    for (let row = 0; row < mapRows; row++) {
        for (let col = 0; col < mapCols; col++) {
            if (pellets[row][col] !== false) {
                let pelletType = pellets[row][col];
                let pelletRadius = pelletType === "big" ? tileSize * 0.30 : tileSize * 0.15;
                const pelletX = mapOffsetX + col * tileSize + tileSize / 2;
                const pelletY = mapOffsetY + row * tileSize + tileSize / 2;
                ctx.beginPath();
                ctx.arc(pelletX, pelletY, pelletRadius, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
            }
        }
    }
}

function eatPelletIfPossible() {
    const col = Math.floor((pacman.x - mapOffsetX) / tileSize);
    const row = Math.floor((pacman.y - mapOffsetY) / tileSize);
    if (row >= 0 && row < mapRows && col >= 0 && col < mapCols && pellets[row][col] !== false) {
        const pelletType = pellets[row][col];
        pellets[row][col] = false;
        if (pelletType === "big") {
            if (pacman.boostTimeout) {
                clearTimeout(pacman.boostTimeout);
            }
            pacman.speed = 4;
            const vector = getVectorForDirection(pacman.direction);
            pacman.dx = vector.dx;
            pacman.dy = vector.dy;
            pacman.boostTimeout = setTimeout(() => {
                pacman.speed = 2.5;
                const newVector = getVectorForDirection(pacman.direction);
                pacman.dx = newVector.dx;
                pacman.dy = newVector.dy;
                pacman.boostTimeout = null;
            }, 5000);
        }
    }
}
