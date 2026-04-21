const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const keys = {};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objectColor = "#000";

let rotation = 0;
let orbitAngle = 0;

let isRunning = false;

function getPlanetRadius() {
    return canvas.width * 0.06;
}

function getOrbitRadius() {
    return canvas.width * 0.12;
}

function initGame() {
    redraw();
}

// Planet
function drawPlanet() {
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(x, y, getPlanetRadius(), 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
}

// Laufbahn
function drawOrbit() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const orbitRadius = getOrbitRadius();

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
    ctx.scale(0.7, 0.7);

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

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    drawPlanet();
    drawOrbit();

    // Hilfe von KI bei der berechnung
    const orbitRadius = getOrbitRadius();
    const satX = centerX + Math.cos(orbitAngle) * orbitRadius;
    const satY = centerY + Math.sin(orbitAngle) * orbitRadius;

    drawSatellite(satX, satY, objectColor, rotation + orbitAngle);
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

    redraw();
    requestAnimationFrame(update);
}

// Steuerung mit Tasten-Status
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

initGame();
update();