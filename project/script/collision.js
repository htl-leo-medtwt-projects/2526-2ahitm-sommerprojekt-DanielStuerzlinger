// collision.js
// Kollisionsprüfung zwischen Gegnern, Satellit, Planet und Lasern.

// Grobe Kollisionsradien
const ENEMY_RADIUS = 28;       // Ungefährer Radius des UFOs
const SATELLITE_RADIUS = 22;   // Ungefährer Radius des Satelliten (skaliert)
const LASER_LENGTH = 20;
const LASER_WIDTH = 2;

/**
 * Kreisförmige Kollision zwischen zwei Objekten.
 */
function circlesOverlap(ax, ay, ar, bx, by, br) {
    const dx = ax - bx;
    const dy = ay - by;
    return (dx * dx + dy * dy) < (ar + br) ** 2;
}

/**
 * Punkt-in-Kreis-Test für Laser (Mittelpunkt des Lasers).
 */
function laserHitsEnemy(laser, enemy) {
    // Mittelpunkt des Lasers
    const lx = laser.x + Math.cos(laser.angle) * LASER_LENGTH / 2;
    const ly = laser.y + Math.sin(laser.angle) * LASER_LENGTH / 2;
    return circlesOverlap(lx, ly, LASER_WIDTH, enemy.x, enemy.y, ENEMY_RADIUS);
}

function checkCollisions() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Satellitenposition berechnen (aus game.js Variablen)
    const orbitRadius = getOrbitRadius();
    const satX = centerX + Math.cos(orbitAngle) * orbitRadius;
    const satY = centerY + Math.sin(orbitAngle) * orbitRadius;

    enemies.forEach(enemy => {
        if (!enemy.alive) return;

        // 1. Laser trifft Gegner → Gegner zerstören
        lasers.forEach(laser => {
            if (laserHitsEnemy(laser, enemy)) {
                enemy.alive = false;
                // Laser entfernen
                laser.spent = true;
            }
        });

        if (!enemy.alive) return;

        // 2. Satellit trifft Gegner → Meldung + Gegner zerstören
        if (circlesOverlap(satX, satY, SATELLITE_RADIUS * sateliteScale,
            enemy.x, enemy.y, ENEMY_RADIUS)) {
            console.log("Kollision: Satellit trifft Gegner!");
            enemy.alive = false;
        }

        // 3. Planet trifft Gegner → Gegner zerstören
        if (circlesOverlap(centerX, centerY, planetRadius,
            enemy.x, enemy.y, ENEMY_RADIUS)) {
            enemy.alive = false;
        }
    });

    // Aufgebrauchte Laser entfernen
    lasers = lasers.filter(l => !l.spent);
}