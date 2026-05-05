const ENEMY_SPEED = 1.5;
const SPAWN_INTERVAL_MIN = 500;
const SPAWN_INTERVAL_MAX = 4000;

const UFO_BRIM_W = 54;
const UFO_BRIM_H = 14;
const UFO_DOME_R = 14;
const UFO_DOME_OFFSET = -8;

let enemies = [];
let spawnTimer = null;

function spawnEnemy() {
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const spawnDist = Math.sqrt((W / 2) ** 2 + (H / 2) ** 2) + 80;

    const CONE_ANGLE = Math.PI / 4;

    const side = Math.random() < 0.5 ? "right" : "left";
    const centerAngle = side === "right" ? 0 : Math.PI;

    const angle = getRandomAngleInCone(centerAngle, CONE_ANGLE);

    const x = cx + Math.cos(angle) * spawnDist;
    const y = cy + Math.sin(angle) * spawnDist;

    const dx = cx - x;
    const dy = cy - y;
    const len = Math.sqrt(dx * dx + dy * dy);

    const vx = (dx / len) * ENEMY_SPEED;
    const vy = (dy / len) * ENEMY_SPEED;

    const faceAngle = Math.atan2(dy, dx) - Math.PI / 2;

    enemies.push({ x, y, vx, vy, faceAngle, alive: true });

    scheduleNextSpawn();
}

function getRandomAngleInCone(centerAngle, coneAngle) {
    const half = coneAngle / 2;
    return centerAngle + (Math.random() * 2 - 1) * half;
}

function scheduleNextSpawn() {
    const delay = SPAWN_INTERVAL_MIN +
        Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
    spawnTimer = setTimeout(spawnEnemy, delay);
}

function startEnemySpawner() {
    scheduleNextSpawn();
}

function stopEnemySpawner() {
    if (spawnTimer) clearTimeout(spawnTimer);
}

function updateEnemies() {
    enemies.forEach(e => {
        if (!e.alive) return;
        e.x += e.vx;
        e.y += e.vy;
    });

    const W = canvas.width;
    const H = canvas.height;
    const margin = 200;
    enemies = enemies.filter(e =>
        e.alive &&
        e.x > -margin && e.x < W + margin &&
        e.y > -margin && e.y < H + margin
    );
}

function drawEnemy(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.faceAngle);

    ctx.fillStyle = objectColor;
    ctx.beginPath();
    ctx.ellipse(0, 4, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = objectColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = objectColor;
    ctx.beginPath();
    ctx.arc(0, -6, 10, Math.PI, 0);
    ctx.fill();

    ctx.restore();
}

function drawEnemies() {
    enemies.forEach(e => {
        if (e.alive) drawEnemy(e);
    });
}