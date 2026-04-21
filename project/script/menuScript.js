const mainColorList = ["FF6F61", "FF7F50", "58D68D", "5DADE2", "AF7AC5", "FDF2E9"];
const output = document.getElementById("content");
const background = document.getElementById("background");

let inGame = false;
let mainColor = 1;

let content = {
    "mainMenu": {
        "html": "<div id=\"main\">\n        <div id=\"header\">\n            <img id=\"orbitLogo\" src=\"media/img/orbit-Logo.png\" alt=\"Orbit-Logo\">\n            <h1>rbit</h1>\n        </div>\n        <div class=\"MenuSelect\">\n            <div class=\"mainButton\" id=\"startButton\" onclick=\"startGame()\">Spielen</div>\n            <div class=\"mainButton\" onclick=\"generateOptions()\">Optionen</div>\n            <div class=\"mainButton\" onclick=\"generateTutorial()\">Tutorial</div>\n        </div>\n    </div>"
    },
    "optionsMenu": {
        "html": "<div class=\"menuTitle\"><h2>Optionen</h2></div>\n    <div id=\"optionsMenu\">\n        <div id=\"volumeBox\">\n            <img id=\"soundIcon\" src=\"media/img/soundIcon.png\" alt=\"Lautstärke\">\n        </div>\n        <h2>Farben</h2>\n        <div id=\"colorBoxes\">\n            <div class=\"colorBox\" id=\"BoxOrange\"></div>\n        </div>\n    </div>"
    },
    "backButtons": {
        "main": "<div class=\"backButton\" onclick=\"generateMain()\">Zurück</div>",
        "game": "<div class=\"backButton\" onclick=\"generateGamePause()\">Zurück</div>"
    },
    "background": {
        "html": "<img class=\"backgroundObject\" id=\"backgroundObjekt1\" src=\"media/img/satelite.png\" alt=\"Satelite\">\n        <img class=\"backgroundObject\" id=\"backgroundObjekt2\" src=\"media/img/ufo.png\" alt=\"UFO\">"
    },
    "tutorial": {
        "texts": [
            "Kreise mit [A] und [D] um den Planeten und zerstöre mit [W] Feindliche UFOs",
            "Drehe den Satelieten mit [J] und [L] um aus anderen Winkeln zu schiesen",
            "Lasse keine Feinde den Planeten treffen sonst wird er zerstört und du verlierst!"
        ]
    }
}

const backButtonMain = content.backButtons.main;
const backButtonGame = content.backButtons.game;
const mainMenu = content.mainMenu.html;
const optionsMenu = content.optionsMenu.html;
const tutorialText = content.tutorial.texts;


function generateBackground() {
    const body = document.getElementById("body");
    body.style.backgroundColor = "#" + mainColorList[mainColor];
    background.innerHTML = content.background.html;
}

function generateMain() {
    output.innerHTML = mainMenu;
    generateBackground();
}

function generateOptions() {
    if (inGame) {
        output.innerHTML = optionsMenu + backButtonGame;
    } else {
        output.innerHTML = optionsMenu + backButtonMain;
    }
    generateColorBoxes("colorBoxes");
}

function generateColorBoxes(containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = "";

    for (let i = 0; i < mainColorList.length; i++) {
        const box = document.createElement("div");

        box.className = "colorBox";
        box.style.backgroundColor = "#" + mainColorList[i];

        box.onclick = function () {
            changeColor(i);
        };

        container.appendChild(box);
    }
}

function changeColor(index) {
    mainColor = index;
    console.log("Farbe geändert zu: " + mainColorList[mainColor]);
    background.style.backgroundColor = "#" + mainColorList[mainColor];
}

function generateTutorial() {
    let tutorialHtml = `<div class="menuTitle"><h2>Tutorial</h2></div><div id="tutorialMenu">`;

    tutorialText.forEach((text, index) => {
        tutorialHtml += `<div class="tutorialSubBox"><p>${index + 1}. ${content.tutorial.texts[index]}</p></div>`;
    });

    tutorialHtml += `</div>`;
    output.innerHTML = tutorialHtml + backButtonMain;
}

function startGame() {
    inGame = true;
    output.innerHTML = "";
    background.innerHTML = "";
    document.getElementById("canvas").style.display = "block";
    initGame();
}

generateMain();