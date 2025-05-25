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
    pacman.x = mapOffsetX + (mapCols * tileSize) / 2;
    pacman.y = mapOffsetY + (mapRows * tileSize) / 2;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calculateMapOffset();
    spawnPacman();
    initializePellets();
}

window.addEventListener("resize", resizeCanvas);