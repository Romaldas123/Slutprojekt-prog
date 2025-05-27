const tileSize = 50;
const turnTolerance = 8;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let mapOffsetX = 0;
let mapOffsetY = 0;

function calculateMapOffset() {
    const totalMapWidth = mapCols * tileSize;
    const totalMapHeight = mapRows * tileSize;
    mapOffsetX = (canvas.width - totalMapWidth) / 2;
    mapOffsetY = (canvas.height - totalMapHeight) / 2;
}

function spawnPacman() {
    let found = false;
    for (let row = 0; row < mapRows; row++) {
        for (let col = 0; col < mapCols; col++) {
            if (map[row][col] === 4) {
                pacman.x = mapOffsetX + col * tileSize + tileSize / 2;
                pacman.y = mapOffsetY + row * tileSize + tileSize / 2;
                found = true;
                break;
            }
        }
        if (found) break;
    }
    if (!found) {
        pacman.x = mapOffsetX + (mapCols * tileSize) / 2;
        pacman.y = mapOffsetY + (mapRows * tileSize) / 2;
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calculateMapOffset();
    spawnPacman();
    initializePellets();
}

window.addEventListener("resize", resizeCanvas);