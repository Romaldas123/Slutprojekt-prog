function isWallAt(x, y) {
    let col = Math.floor((x - mapOffsetX) / tileSize);
    let row = Math.floor((y - mapOffsetY) / tileSize);
    
    if (row === 6) {
        col = ((col % map[0].length) + map[0].length) % map[0].length;
        return map[row][col] === 1;
    }
    
    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return true;
    
    return map[row][col] === 1;
}

function checkCollision(x, y) {
    const points = [
        { x: x - pacman.radius + 1, y: y - pacman.radius + 1 },
        { x: x + pacman.radius - 1, y: y - pacman.radius + 1 },
        { x: x - pacman.radius + 1, y: y + pacman.radius - 1 },
        { x: x + pacman.radius - 1, y: y + pacman.radius - 1 },
        { x: x, y: y }
    ];
    return points.some(point => isWallAt(point.x, point.y));
}

function canTurn(direction) {
    const offsets = {
        up: { dx: 0, dy: -1 },
        down: { dx: 0, dy: 1 },
        left: { dx: -1, dy: 0 },
        right: { dx: 1, dy: 0 }
    };
    const cellCol = Math.floor((pacman.x - mapOffsetX) / tileSize);
    const cellRow = Math.floor((pacman.y - mapOffsetY) / tileSize);
    const targetCol = cellCol + offsets[direction].dx;
    const targetRow = cellRow + offsets[direction].dy;
    if (targetRow < 0 || targetRow >= map.length || targetCol < 0 || targetCol >= map[0].length) return false;
    if (map[targetRow][targetCol] === 1) return false;
    return true;
}

function tryChangeDirection() {
    if (!pacman.requestedDirection) return;
    
    if (!canTurn(pacman.requestedDirection)) {
        pacman.requestedDirection = null;
        return;
    }
    
    const col = Math.floor((pacman.x - mapOffsetX) / tileSize);
    const row = Math.floor((pacman.y - mapOffsetY) / tileSize);
    const centerX = mapOffsetX + col * tileSize + tileSize / 2;
    const centerY = mapOffsetY + row * tileSize + tileSize / 2;
    
    if (pacman.requestedDirection === "left" || pacman.requestedDirection === "right") {
        if (Math.abs(pacman.y - centerY) < turnTolerance) {
            pacman.y = centerY;
            const vector = getVectorForDirection(pacman.requestedDirection);
            if (!checkCollision(pacman.x + vector.dx, pacman.y + vector.dy)) {
                pacman.direction = pacman.requestedDirection;
                pacman.dx = vector.dx;
                pacman.dy = vector.dy;
                pacman.requestedDirection = null;
            }
        }
    } else if (pacman.requestedDirection === "up" || pacman.requestedDirection === "down") {
        if (Math.abs(pacman.x - centerX) < turnTolerance) {
            pacman.x = centerX;
            const vector = getVectorForDirection(pacman.requestedDirection);
            if (!checkCollision(pacman.x + vector.dx, pacman.y + vector.dy)) {
                pacman.direction = pacman.requestedDirection;
                pacman.dx = vector.dx;
                pacman.dy = vector.dy;
                pacman.requestedDirection = null;
            }
        }
    }
}