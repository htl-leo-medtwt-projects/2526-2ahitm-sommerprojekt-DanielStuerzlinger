
const ENEMY_RADIUS = 28; 
const SATELLITE_RADIUS = 22;
const LASER_LENGTH = 20;
const LASER_WIDTH = 2;

function circlesOverlap(ax, ay, ar, bx, by, br) {
    const dx = ax - bx;
    const dy = ay - by;
    return (dx * dx + dy * dy) < (ar + br) ** 2;
}

function laserHitsEnemy(laser, enemy) {
    const lx = laser.x + Math.cos(laser.angle) * LASER_LENGTH / 2;
    const ly = laser.y + Math.sin(laser.angle) * LASER_LENGTH / 2;
    return circlesOverlap(lx, ly, LASER_WIDTH, enemy.x, enemy.y, ENEMY_RADIUS);
}

function checkCollisions() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const orbitRadius = getOrbitRadius();
    const satX = centerX + Math.cos(orbitAngle) * orbitRadius;
    const satY = centerY + Math.sin(orbitAngle) * orbitRadius;

    enemies.forEach(enemy => {
        if (!enemy.alive) return;

        lasers.forEach(laser => {
            if (laserHitsEnemy(laser, enemy)) {
                enemy.alive = false;
                laser.spent = true;
            }
        });

        if (!enemy.alive) return;

        if (circlesOverlap(satX, satY, SATELLITE_RADIUS * sateliteScale,
            enemy.x, enemy.y, ENEMY_RADIUS)) {
            console.log("Kollision: Satellit trifft Gegner!");
            enemy.alive = false;
        }

        if (circlesOverlap(centerX, centerY, planetRadius,
            enemy.x, enemy.y, ENEMY_RADIUS)) {
            enemy.alive = false;
        }
    });

    lasers = lasers.filter(l => !l.spent);
}