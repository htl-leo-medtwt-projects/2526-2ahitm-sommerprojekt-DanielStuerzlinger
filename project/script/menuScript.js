const mainColorList = ["FF6F61", "FF7F50", "58D68D", "5DADE2", "AF7AC5", "FDF2E9"];
const output = document.getElementById("content");
const background = document.getElementById("background");

let inGame = false;
let mainColor = parseInt(localStorage.getItem("selectedColor") || "1");

let content = {
    "mainMenu": {
        "html": "<div id=\"main\">\n        <div id=\"header\">\n            <img id=\"orbitLogo\" src=\"media/img/orbit-Logo.png\" alt=\"Orbit-Logo\">\n            <h1>rbit</h1>\n        </div>\n        <div class=\"MenuSelect\">\n            <div class=\"mainButton\" id=\"startButton\" onclick=\"startGame()\">Spielen</div>\n            <div class=\"mainButton\" onclick=\"generateOptions()\">Optionen</div>\n            <div class=\"mainButton\" onclick=\"generateTutorial()\">Tutorial</div>\n        </div>\n    </div>"
    },
    "optionsMenu": {
        // Kein menuTitle hier – wird separat hinzugefügt wo nötig
        "html": "<div id=\"optionsMenu\">\n        <div id=\"volumeBox\">\n            <img id=\"soundIcon\" src=\"media/img/soundIcon.png\" alt=\"Lautstärke\">\n            <input type=\"range\" id=\"volumeSlider\" min=\"0\" max=\"100\" step=\"1\" oninput=\"changeVolume(this.value)\">\n        </div>\n        <h2>Farben</h2>\n        <div id=\"colorBoxes\">\n        </div>\n    </div>"
    },
    "backButtons": {
        "main": "<div class=\"backButton\" onclick=\"generateMain()\">Zurück</div>",
        "game": "<div class=\"backButton\" onclick=\"closeOverlay()\">Zurück</div>"
    },
    "background": {
        "html": "<img class=\"backgroundObject\" id=\"backgroundObjekt1\" src=\"media/img/satelite.png\" alt=\"Satelite\">\n        <img class=\"backgroundObject\" id=\"backgroundObjekt2\" src=\"media/img/ufo.png\" alt=\"UFO\">"
    },
    "tutorial": {
        "texts": [
            "Kreise mit [A] und [D] um den Planeten und zerstöre mit [Leertaste] feindliche UFOs",
            "Drehe den Satelieten mit [J] und [L] um aus anderen Winkeln zu schießen",
            "Lasse keine Feinde den Planeten treffen sonst wird er zerstört und du verlierst!"
        ]
    }
}

const backButtonMain = content.backButtons.main;
const backButtonGame = content.backButtons.game;
const mainMenu = content.mainMenu.html;
const optionsMenu = content.optionsMenu.html;
const tutorialText = content.tutorial.texts;


function showBackdrop() {
    let bd = document.getElementById("pauseBackdrop");
    if (!bd) {
        bd = document.createElement("div");
        bd.id = "pauseBackdrop";
        document.body.appendChild(bd);
    }
}

function removeBackdrop() {
    const bd = document.getElementById("pauseBackdrop");
    if (bd) bd.remove();
}

function generateBackground() {
    const body = document.getElementById("body");
    body.style.backgroundColor = "#" + mainColorList[mainColor];
    background.innerHTML = content.background.html;
}

function generateMain() {
    inGame = false;
    removeBackdrop();
    const overlay = document.getElementById("overlayMenu");
    if (overlay) overlay.remove();
    output.innerHTML = mainMenu;
    document.getElementById("canvas").style.display = "none";
    document.getElementById("pauseBtn").style.display = "none";
    if (typeof resetGame === "function") resetGame();
    generateBackground();
}

function generateOptions() {
    if (inGame) {
        let overlay = document.getElementById("overlayMenu");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "overlayMenu";
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = `<div class="menuTitle" style="position:static;top:unset;left:unset;border-color:white;color:white;margin-bottom:2vh;width:auto;"><h2>Optionen</h2></div>` + optionsMenu + backButtonGame;
        generateColorBoxes("colorBoxes");
        initVolumeSlider();
    } else {
        output.innerHTML = `<div class="menuTitle"><h2>Optionen</h2></div>` + optionsMenu + backButtonMain;
        generateColorBoxes("colorBoxes");
        initVolumeSlider();
    }
}

function initVolumeSlider() {
    const slider = document.getElementById("volumeSlider");
    if (!slider) return;
    const vol = typeof SoundManager !== "undefined" ? SoundManager.getVolume() : parseFloat(localStorage.getItem("volume") ?? "0.5");
    slider.value = Math.round(vol * 100);
}

function changeVolume(val) {
    const v = parseInt(val) / 100;
    if (typeof SoundManager !== "undefined") SoundManager.setVolume(v);
    else localStorage.setItem("volume", v);
}

function generateColorBoxes(containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = "";

    for (let i = 0; i < mainColorList.length; i++) {
        const box = document.createElement("div");

        box.className = "colorBox";
        box.style.backgroundColor = "#" + mainColorList[i];

        if (i === mainColor) {
            box.style.outline = "3px solid black";
            box.style.outlineOffset = "2px";
        }

        box.onclick = function () {
            changeColor(i);
        };

        container.appendChild(box);
    }
}

function changeColor(index) {
    mainColor = index;
    localStorage.setItem("selectedColor", index);
    background.style.backgroundColor = "#" + mainColorList[mainColor];

    const boxes = document.querySelectorAll(".colorBox");
    boxes.forEach((b, i) => {
        b.style.outline = i === index ? "3px solid black" : "";
        b.style.outlineOffset = i === index ? "2px" : "";
    });
}

function generateTutorial() {
    let tutorialHtml = `<div class="menuTitle"><h2>Tutorial</h2></div><div id="tutorialMenu">`;

    tutorialText.forEach((text, index) => {
        tutorialHtml += `<div class="tutorialSubBox"><p>${index + 1}. ${content.tutorial.texts[index]}</p></div>`;
    });

    tutorialHtml += `</div>`;

    if (inGame) {
        let overlay = document.getElementById("overlayMenu");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "overlayMenu";
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = tutorialHtml + backButtonGame;
    } else {
        output.innerHTML = tutorialHtml + backButtonMain;
    }
}

function openPauseSubmenu(type) {
    const pauseMenu = document.getElementById("pauseMenu");
    if (pauseMenu) pauseMenu.style.display = "none";

    if (type === 'options') {
        generateOptions();
    } else if (type === 'tutorial') {
        generateTutorial();
    }
}

function closeOverlay() {
    const overlay = document.getElementById("overlayMenu");
    if (overlay) overlay.remove();
    const pauseMenu = document.getElementById("pauseMenu");
    if (pauseMenu) pauseMenu.style.display = "";
    else generateGamePause();
}

function generateGamePause() {
    if (typeof pauseGame === "function") pauseGame();

    const currentScore = (typeof score !== "undefined") ? score : 0;
    const currentHighscore = parseInt(localStorage.getItem("highscore") || "0");

    document.getElementById("canvas").style.display = "block";
    document.getElementById("pauseBtn").style.display = "block";
    background.innerHTML = "";
    showBackdrop();

    // Bestehende overlayMenus entfernen
    const existingOverlay = document.getElementById("overlayMenu");
    if (existingOverlay) existingOverlay.remove();

    output.innerHTML = `
        <div id="pauseMenu">
            <div class="menuTitle" style="position:static;top:unset;left:unset;border-color:white;color:white;margin-bottom:2vh;width:auto;"><h2>Pause</h2></div>
            <div class="pauseScore">Punkte: ${currentScore}</div>
            <div class="pauseScore" style="font-size:2.5vh;margin-bottom:0;">Highscore: ${currentHighscore}</div>
            <div class="MenuSelect pauseMenuSelect">
                <div class="mainButton" onclick="continueGame()">Weiter</div>
                <div class="mainButton" onclick="openPauseSubmenu('options')">Optionen</div>
                <div class="mainButton" onclick="openPauseSubmenu('tutorial')">Tutorial</div>
                <div class="mainButton" onclick="generateMain()">Hauptmenü</div>
            </div>
        </div>
    `;
}

function continueGame() {
    const overlay = document.getElementById("overlayMenu");
    if (overlay) overlay.remove();
    removeBackdrop();
    output.innerHTML = "";
    background.innerHTML = "";
    document.getElementById("canvas").style.display = "block";
    document.getElementById("pauseBtn").style.display = "block";
    if (typeof resumeGame === "function") resumeGame();
}

function startGame() {
    inGame = true;
    output.innerHTML = "";
    background.innerHTML = "";
    document.getElementById("canvas").style.display = "block";

    const pauseBtn = document.getElementById("pauseBtn");
    pauseBtn.style.display = "block";

    if (typeof SoundManager !== "undefined") SoundManager.play("start");
    initGame();
}

(function applyStoredColor() {
    const body = document.getElementById("body");
    if (body) body.style.backgroundColor = "#" + mainColorList[mainColor];
})();

generateMain();