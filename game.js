function update() {
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
    requestAnimationFrame(update);
}

resizeCanvas();
update();