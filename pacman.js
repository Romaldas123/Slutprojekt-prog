let pacman = {
    x: 0,
    y: 0,
    radius: 20,
    speed: 2.5,
    dx: 0,
    dy: 0,
    direction: "right",
    requestedDirection: null
};

function getVectorForDirection(direction) {
    switch (direction) {
        case "up":
            return { dx: 0, dy: -pacman.speed };
        case "down":
            return { dx: 0, dy: pacman.speed };
        case "left":
            return { dx: -pacman.speed, dy: 0 };
        case "right":
            return { dx: pacman.speed, dy: 0 };
        default:
            return { dx: 0, dy: 0 };
    }
}

function drawPacman() {
    const mouthAngle = Math.sin(Date.now() / 100) * 0.2;
    const startAngle = 0.2 + mouthAngle;
    const endAngle = Math.PI * 2 - 0.2 - mouthAngle;

    const rotation = {
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

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            pacman.requestedDirection = "up";
            break;
        case "ArrowDown":
            pacman.requestedDirection = "down";
            break;
        case "ArrowLeft":
            pacman.requestedDirection = "left";
            break;
        case "ArrowRight":
            pacman.requestedDirection = "right";
            break;
    }
});