const jsKomment = "<!-- Kommentar im js -->";
const mainColorList = ["FF7F50", "FF6F61", "AF7AC5", "5DADE2", "58D68D", "FDF2E9"];
const output = document.getElementById("content");
const background = document.getElementById("background");
const backButtonMain = `<div id="backButton" onclick="generateMain()">Zurück</div>`;
const backButtonGame = `<div id="backButton" onclick="generateGamePause()">Zurück</div>`;

let inGame = false;
let mainColor = 0;

const mainMenu = `
    <div id="main">
        <div id="header">
            <img id="orbitLogo" src="media/img/orbit-Logo.png" alt="Orbit-Logo">
            <h1>rbit</h1>
        </div>
        <div class="MenuSelect">
            <div class="mainButton" id="startButton" onclick="startGame()">Spielen</div>
            <div class="mainButton" onclick="generateOptions()">Optionen</div>
            <div class="mainButton" onclick="generateTutorial()">Tutorial</div>
        </div>
    </div>`;

const optionsMenu = `
    <div class="menuTitle"><h2>Optionen</h2></div>
    <div id="optionsMenu">
        <div id="volumeBox">
            <img id="soundIcon" src="media/img/soundIcon.png" alt="Lautstärke">
            ${/*Durch shoelace js eingefügter Lautstärkeregler*/ jsKomment}
        </div>
        <h2>Farben</h2>
        <div id="colorBoxes">
            <div class="colorBox" id="BoxOrange"></div>
            ${/* Die 6 Farben */ jsKomment}
        </div>
    </div>`

const tutorialText = [
    `Kreise mit [A] und [D] um den Planeten und zerstöre mit [W] Feindliche UFOs`,
    `Drehe den Satelieten mit [J] und [L] um aus anderen Winkeln zu schiesen`,
    `Lasse keine Feinde den Planeten treffen sonst wird er zerstört und du verlierst!`
]

const tutorialMenu = `
    <div class="menuTitle"><h2>Tutorial</h2></div>
    <div id="tutorialMenu">
        <div class="tutorialSubBox">
            <p>${tutorialText[0]}</p>
            <img src="../media/img/ufo.png" alt="UFO">
        </div>
        <div class="tutorialSubBox">
            <p>${tutorialText[1]}</p>
            <img src="../media/img/satelite.png" alt="Satelit">
        </div>
        <div class="tutorialSubBox">
            <p>${tutorialText[2]}</p>
            <img src="../media/img/orbit-Logo.png" alt="Planet">
        </div>
    </div>`;

function generateBackground() {
    const body = document.getElementById("body");
    body.style.backgroundColor = "#" + mainColorList[mainColor];
    // Hintergrund Objekte
    background.innerHTML = `
        <img class="backgroundObject" id="backgroundObjekt1" src="media/img/satelite.png" alt="Satelite">
        <img class="backgroundObject" id="backgroundObjekt2" src="media/img/ufo.png" alt="UFO">
    `;
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

        box.className = "color-box";
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
    output.innerHTML = tutorialMenu + backButtonMain;
}

generateMain();