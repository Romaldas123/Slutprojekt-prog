const ghostColors = {
    pinky: "pink"
};

// Find ghost house center for spawn
function findGhostHouseTiles() {
    let tiles = [];
    for (let row = 0; row < mapRows; row++) {
        for (let col = 0; col < mapCols; col++) {
            if (map[row][col] === 2) tiles.push({row, col});
        }
    }
    return tiles;
}

const ghostHouse = findGhostHouseTiles();
const ghostSpawns = [ghostHouse[0]];

const ghosts = [
    {
    name: "pinky",
    color: ghostColors.pinky,
    row: ghostSpawns[0].row,
    col: ghostSpawns[0].col,
    x: 0, y: 0,
    startX: 0, startY: 0,   // <--- ADD
    dx: 0, dy: 0,
    speed: 2.8,
    direction: "up"
}
];

// Place ghosts at spawn tile centers
function spawnGhosts() {
    for (const g of ghosts) {
        g.x = mapOffsetX + g.col * tileSize + tileSize/2;
        g.y = mapOffsetY + g.row * tileSize + tileSize/2;
        g.startX = g.x;
        g.startY = g.y;
        g.dx = 0;
        g.dy = 0;
    }
}

function drawGhost(ghost) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, 20, Math.PI, 0, false); // head
    ctx.lineTo(ghost.x + 20, ghost.y + 20);
    ctx.lineTo(ghost.x - 20, ghost.y + 20);
    ctx.closePath();
    ctx.fillStyle = ghost.color;
    ctx.fill();

    // Eyes
    ctx.beginPath();
    ctx.arc(ghost.x - 7, ghost.y - 5, 5, 0, Math.PI * 2);
    ctx.arc(ghost.x + 7, ghost.y - 5, 5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ghost.x - 7, ghost.y - 5, 2, 0, Math.PI * 2);
    ctx.arc(ghost.x + 7, ghost.y - 5, 2, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.restore();
}

// Utility: Manhattan distance
function manhattan(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Get tile Pac-Man is on
function getPacmanTile() {
    return {
        row: Math.floor((pacman.y - mapOffsetY)/tileSize),
        col: Math.floor((pacman.x - mapOffsetX)/tileSize)
    };
}

// Get tile X steps ahead of Pac-Man in his direction
function getTileAheadOfPacman(steps) {
    const {row, col} = getPacmanTile();
    const dir = pacman.direction;
    let dr = 0, dc = 0;
    if (dir === "up") dr = -1;
    else if (dir === "down") dr = 1;
    else if (dir === "left") dc = -1;
    else if (dir === "right") dc = 1;
    return {
        row: row + dr*steps,
        col: col + dc*steps
    };
}

// Handle tunnel wrapping for ghosts
function handleTunnelWrap(ghost) {
    // Get the tile position
    const col = Math.floor((ghost.x - mapOffsetX) / tileSize);
    
    // If ghost goes off the left side
    if (col < 0) {
        ghost.x = mapOffsetX + (mapCols - 1) * tileSize + tileSize/2;
    }
    // If ghost goes off the right side
    else if (col >= mapCols) {
        ghost.x = mapOffsetX + tileSize/2;
    }
}

// At each intersection, decide direction based on AI type
function chooseGhostDirection(ghost) {
    const currTile = {
        row: Math.floor((ghost.y - mapOffsetY)/tileSize),
        col: Math.floor((ghost.x - mapOffsetX)/tileSize)
    };

    // Find possible directions (no wall, not reverse)
    const dirs = [
        {dir:"up", dr:-1, dc:0},
        {dir:"down", dr:1, dc:0},
        {dir:"left", dr:0, dc:-1},
        {dir:"right", dr:0, dc:1}
    ];
    // Don't allow 180 turns
    const reverse = {up:"down", down:"up", left:"right", right:"left"};
    const notAllowed = reverse[ghost.direction];

    let options = [];
    for (const d of dirs) {
        if (d.dir === notAllowed) continue;
        const nr = currTile.row + d.dr;
        const nc = currTile.col + d.dc;
        
        // Allow movement through tunnel
        let validTile = false;
        if (nr >= 0 && nr < mapRows) {
            // Handle tunnel wrapping for columns
            const wrappedCol = ((nc % mapCols) + mapCols) % mapCols;
            if (map[nr][wrappedCol] !== 1 && map[nr][wrappedCol] !== 2) {
                validTile = true;
            }
        }
        
        if (validTile) {
            options.push(d);
        }
    }
    if (options.length === 0) return; // stuck

    // Find target tile for AI type
    let target = getTileAheadOfPacman(4); // Pinky targets 4 tiles ahead

    // Greedy: pick direction that minimizes Manhattan distance to target
    let bestDir = options[0];
    let bestDist = Infinity;
    for (const d of options) {
        const nr = currTile.row + d.dr;
        const nc = currTile.col + d.dc;
        const dist = manhattan({row:nr, col:nc}, target);
        if (dist < bestDist) {
            bestDist = dist;
            bestDir = d;
        }
    }
    ghost.direction = bestDir.dir;
    const vec = getVectorForDirection(ghost.direction);
    ghost.dx = vec.dx * (ghost.speed/pacman.speed);
    ghost.dy = vec.dy * (ghost.speed/pacman.speed);
}

// Update ghosts: move, change direction at intersections
function updateGhosts() {
    for (const ghost of ghosts) {
        // At tile center? Then can pick new dir
        const tileRow = Math.floor((ghost.y - mapOffsetY)/tileSize);
        const tileCol = Math.floor((ghost.x - mapOffsetX)/tileSize);
        const centerX = mapOffsetX + tileCol * tileSize + tileSize/2;
        const centerY = mapOffsetY + tileRow * tileSize + tileSize/2;

        if (Math.abs(ghost.x - centerX) < 2 && Math.abs(ghost.y - centerY) < 2) {
            // Snap to center
            ghost.x = centerX;
            ghost.y = centerY;
            chooseGhostDirection(ghost);
        }
        
        // Try to move in current direction
        const nextX = ghost.x + ghost.dx;
        const nextY = ghost.y + ghost.dy;

        // Check collision with walls
        if (!checkCollision(nextX, ghost.y)) {
            ghost.x = nextX;
        }
        if (!checkCollision(ghost.x, nextY)) {
            ghost.y = nextY;
        }

        // Handle tunnel wrapping
        handleTunnelWrap(ghost);
    }
}