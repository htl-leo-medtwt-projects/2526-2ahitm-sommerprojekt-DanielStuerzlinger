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
let score = 0;
let highscore = 0;
let isPaused = true;
let animFrameId = null;

// Laser-Cooldown
const LASER_COOLDOWN = 300; // ms
let lastShotTime = 0;

// Spieler
const laserSpeed = 10;

// Sounds
let gameVolume = parseFloat(localStorage.getItem("volume") ?? "0.5");
const sfxLaser = new Audio("media/sounds/laser.mp3");
const sfxExplosion = new Audio("media/sounds/explosion.mp3");
const sfxStart = new Audio("media/sounds/start.mp3");

function playSound(audio) {
    audio.volume = gameVolume;
    audio.currentTime = 0;
    audio.play().catch(() => { });
}

function getOrbitRadius() {
    return canvas.width * 0.09;
}

function initGame() {
    // Reset game state
    score = 0;
    lasers = [];
    enemies = [];
    orbitAngle = 0;
    rotation = 0;
    lastShotTime = 0;
    spawnElapsed = 0;

    highscore = parseInt(localStorage.getItem("highscore") || "0");

    isPaused = false;
    updatePauseButton();
    startEnemySpawner();
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(update);
}

function resetGame() {
    score = 0;
    lasers = [];
    enemies = [];
    orbitAngle = 0;
    rotation = 0;
    lastShotTime = 0;
    spawnElapsed = 0;
    isPaused = true;
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
    stopEnemySpawner();
}

function pauseGame() {
    isPaused = true;
    stopEnemySpawner();
    updatePauseButton();
}

function resumeGame() {
    isPaused = false;
    startEnemySpawner();
    updatePauseButton();
    animFrameId = requestAnimationFrame(update);
}

function togglePause() {
    if (isPaused) {
        continueGame();
    } else {
        pauseGame();
        generateGamePause();
    }
}

function updatePauseButton() {
    const btn = document.getElementById("pauseBtn");
    if (btn) {
        btn.textContent = isPaused ? "▶" : "⏸";
    }
}

function addScore() {
    score++;
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
    }
    playSound(sfxExplosion);
}

// Planet
function drawPlanet() {
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(x, y, planetRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    // Score im Zentrum
    ctx.fillStyle = "white";
    ctx.font = `bold ${planetRadius * 0.8}px Exo, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score, x, y);
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
    if (isPaused) return;

    const now = performance.now();
    if (now - lastShotTime < LASER_COOLDOWN) return;
    lastShotTime = now;

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

    playSound(sfxLaser);
}

// Update-Schleife
function update() {
    if (isPaused) return;

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
    updateEnemies();
    checkCollisions();

    redraw();
    animFrameId = requestAnimationFrame(update);
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
    drawEnemies();
}


// Steuerung
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;

    if (event.code === "Space") {
        shootLaser();
    }

    if (event.code === "Escape") {
        togglePause();
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});