"use strict";
//блоки игры
let mainMenu = document.getElementById("mainMenu"); //блок главного меню
let rulesBlock = document.getElementById("rules_page"); // блок правил
let scoresBlock = document.getElementById("scores_page"); // блок рекордов

//кнопки управления
let gameStart = document.getElementById("game_start"); //кнопка старта
let rulesButton = document.getElementById("rules"); // кнопка правила
let scoreButton = document.getElementById("score"); // кнопка правила
let rulesBack = document.getElementById("rules_back"); // кнопка назад в блоке правил
let scoresBack = document.getElementById("scores_back"); // кнопка назад в блоке пhtrjhljd

rulesButton.addEventListener("click", menumove);
scoreButton.addEventListener("click", menumove);
rulesBack.addEventListener("click", menumove);
scoresBack.addEventListener("click", menumove);

function menumove(EO) {
  if (EO.target.id == "rules") {
    mainMenuMove();
    setTimeout(rulesMove, 500);
  } else if (EO.target.id == "score") {
    mainMenuMove();
    setTimeout(scoresMove, 500);
  } else if (EO.target.id == "rules_back") {
    rulesMove();
    setTimeout(mainMenuMove, 500);
  } else if (EO.target.id == "scores_back") {
    scoresMove();
    setTimeout(mainMenuMove, 500);
  }
}

function mainMenuMove() {
  if (mainMenu.getAttribute("display") != "none") {
    mainMenu.style.opacity = 0;
    mainMenu.setAttribute("display", "none");
  } else {
    mainMenu.style.opacity = 1;
    mainMenu.setAttribute("display", "flex");
  }
}
function rulesMove() {
  if (
    rulesBlock.getAttribute("display") == "flex" ||
    rulesBlock.getAttribute("display") == null
  ) {
    rulesBlock.style.top = "-50px";
    rulesBlock.setAttribute("display", "block");
  } else {
    rulesBlock.style.top = "2000px";
    rulesBlock.setAttribute("display", "flex");
  }
}
function scoresMove() {
  if (
    scoresBlock.getAttribute("display") == "flex" ||
    scoresBlock.getAttribute("display") == null
  ) {
    scoresBlock.style.top = "100px";
    scoresBlock.setAttribute("display", "block");
  } else {
    scoresBlock.style.top = "2000px";
    scoresBlock.setAttribute("display", "flex");
  }
}
