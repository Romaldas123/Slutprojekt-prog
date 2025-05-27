let gameRunning = true;

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

    // Check for collision with ghosts
    if (checkPacmanGhostCollision()) return;

    requestAnimationFrame(update);
}

// Detects collision between Pac-Man and ghosts
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

// Ends the game and shows the restart button
function gameOver() {
    gameRunning = false;
    document.getElementById("restartButton").style.display = "block";
}

// Resets the game state and restarts the loop
function restartGame() {
    // Reset Pac-Man to starting position
    spawnPacman();
    pacman.dx = -1;
    pacman.dy = 0;
    pacman.direction = "left";
    pacman.requestedDirection = null;
    pacman.speed = 2.5;

    // Clear boost if active
    if (pacman.boostTimeout) {
        clearTimeout(pacman.boostTimeout);
        pacman.boostTimeout = null;
    }

    // Reset ghosts
    for (const g of ghosts) {
        g.x = g.startX;
        g.y = g.startY;
    }

    // Reinitialize pellets
    initializePellets();

    // Optional: Recalculate map offset if window resizes
    calculateMapOffset();

    // Restart the game
    gameRunning = true;
    document.getElementById("restartButton").style.display = "none";

    update();
}

// Start the game
resizeCanvas();
spawnGhosts();
spawnPacman(); // Call spawnPacman at the start of the game
pacman.startX = pacman.x;
pacman.startY = pacman.y;
update();