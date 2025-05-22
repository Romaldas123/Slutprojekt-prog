const tileSize = 50;
const turnTolerance = 8; 

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calculateMapOffset();
    pacman.x = mapOffsetX + (mapCols * tileSize) / 2;
    pacman.y = mapOffsetY + (mapRows * tileSize) / 2;
}

window.addEventListener("resize", resizeCanvas);
