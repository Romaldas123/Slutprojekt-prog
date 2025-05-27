let gameRunning = true;
let totalPellets = 0;

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawPellets();

    tryChangeDirection();

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

    if (pacman.y - mapOffsetY >= tileSize * 6 && pacman.y - mapOffsetY <= tileSize * 7) {
        if (pacman.x - mapOffsetX > mapCols * tileSize) {
            pacman.x = mapOffsetX + pacman.radius;
        } else if (pacman.x - mapOffsetX < 0) {
            pacman.x = mapOffsetX + (mapCols * tileSize) - pacman.radius;
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

    eatPelletIfPossible();
    drawPacman();

    updateGhosts();
    for (const ghost of ghosts) {
        drawGhost(ghost);
    }

    if (checkPacmanGhostCollision()) return;

    requestAnimationFrame(update);
}

function checkPacmanGhostCollision() {
    for (const ghost of ghosts) {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < pacman.radius + 20) {
            gameOver();
            return true;
        }
    }
    return false;
}


function gameOver() {
    gameRunning = false;
    document.getElementById("restartButton").style.display = "block";
}

function restartGame() {
    spawnPacman();
    pacman.dx = 0; 
    pacman.dy = 0; 
    pacman.speed = 3; 
    pacman.direction = "right"; 
    pacman.requestedDirection = null;

    const vector = getVectorForDirection(pacman.direction);
    pacman.dx = vector.dx;
    pacman.dy = vector.dy;

    if (pacman.boostTimeout) {
        clearTimeout(pacman.boostTimeout);
        pacman.boostTimeout = null;
    }

    for (const g of ghosts) {
        g.x = g.startX;
        g.y = g.startY;
    }

    initializePellets();
    totalPellets = countTotalPellets(); 

    calculateMapOffset();

    gameRunning = true;
    document.getElementById("restartButton").style.display = "none";

    update();
}

function findPacmanStartingPosition() {
    for (let row = 0; row < mapRows; row++) {
        for (let col = 0; col < mapCols; col++) {
            if (map[row][col] === 4) {
                return { row, col };
            }
        }
    }
    return null; 
}

function countTotalPellets() {
    let count = 0;
    for (let row = 0; row < mapRows; row++) {
        for (let col = 0; col < mapCols; col++) {
            if (pellets[row][col] !== false) {
                count++;
            }
        }
    }
    return count;
}

function checkWinCondition() {
    if (totalPellets <= 0) {
        gameRunning = false;
        alert("Winner Winner Chicken Dinner!");
        document.getElementById("restartButton").style.display = "block";
    }
}

resizeCanvas();
spawnGhosts();
spawnPacman(); 
pacman.startX = pacman.x;
pacman.startY = pacman.y;

pacman.direction = "right";
const initialVector = getVectorForDirection(pacman.direction);
pacman.dx = initialVector.dx;
pacman.dy = initialVector.dy;

initializePellets();
totalPellets = countTotalPellets();

update();