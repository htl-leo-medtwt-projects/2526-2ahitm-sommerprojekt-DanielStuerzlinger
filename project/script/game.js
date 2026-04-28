const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const keys = {};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const sateliteScale = 0.6;
const planetRadius = canvas.width * 0.045;

let objectColor = "#000";
let rotation = 0;
let orbitAngle = 0;

let lasers = [];

// Spieler
const laserSpeed = 10;

function getOrbitRadius() {
    return canvas.width * 0.09;
}

function initGame() {
    redraw();
}

// Planet
function drawPlanet() {
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(x, y, planetRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
}

// Laufbahn
function drawOrbit() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let orbitRadius = getOrbitRadius();

    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Satellit 
function drawSatellite(x, y, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(sateliteScale, sateliteScale);

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    ctx.fillRect(-20, -25, 40, 50);
    ctx.fillRect(-90, -10, 60, 20);
    ctx.fillRect(30, -10, 60, 20);
    ctx.fillRect(-30, -3, 10, 6);
    ctx.fillRect(20, -3, 10, 6);

    ctx.beginPath();
    ctx.moveTo(-20, 45);
    ctx.lineTo(20, 45);
    ctx.lineTo(0, 20);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(0, -50);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -55, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawLasers() {
    ctx.fillStyle = objectColor;

    lasers.forEach(laser => {
        ctx.save();
        ctx.translate(laser.x, laser.y);
        ctx.rotate(laser.angle);

        ctx.fillRect(0, -1, 20, 2);

        ctx.restore();
    });
}

function updateLasers() {
    lasers.forEach(laser => {
        laser.x += Math.cos(laser.angle) * laserSpeed;
        laser.y += Math.sin(laser.angle) * laserSpeed;
    });

    lasers = lasers.filter(l =>
        l.x > 0 && l.x < canvas.width &&
        l.y > 0 && l.y < canvas.height
    );
}

function shootLaser() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    let orbitRadius = getOrbitRadius();
    let satX = centerX + Math.cos(orbitAngle) * orbitRadius;
    let satY = centerY + Math.sin(orbitAngle) * orbitRadius;

    let baseAngle = rotation + orbitAngle;

    let laserAngle = baseAngle - Math.PI / 2;

    let tipOffset = 60;

    let tipX = satX + Math.cos(laserAngle) * tipOffset;
    let tipY = satY + Math.sin(laserAngle) * tipOffset;

    lasers.push({
        x: tipX,
        y: tipY,
        angle: laserAngle
    });
}

// Update-Schleife
function update() {
    if (keys['a'] || keys['A']) {
        orbitAngle -= 0.025;
    }
    if (keys['d'] || keys['D']) {
        orbitAngle += 0.025;
    }

    if (keys['j'] || keys['J']) {
        rotation -= 0.05;
    }
    if (keys['l'] || keys['L']) {
        rotation += 0.05;
    }

    updateLasers();

    redraw();
    requestAnimationFrame(update);
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    drawPlanet();
    drawOrbit();

    let orbitRadius = getOrbitRadius();
    let satX = centerX + Math.cos(orbitAngle) * orbitRadius;
    let satY = centerY + Math.sin(orbitAngle) * orbitRadius;

    let totalRotation = rotation + orbitAngle;

    drawSatellite(satX, satY, objectColor, totalRotation);

    drawLasers();
}


// Steuerung
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;

    if (event.code === "Space") {
        shootLaser();
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

initGame();
update();