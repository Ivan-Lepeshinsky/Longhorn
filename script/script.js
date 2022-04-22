"use strict";

localStorage.clear();
//блоки игры
let wraperMain = document.getElementById("wraper_menu"); // блок-врапер главного меню
let mainMenu = maimMenuCreate(); //блок главного меню
let rulesBlock = rulesCreate(); // блок правил
let scoresBlock = scoreCreate(); // блок очков
let gameZone; // визуальная часть игры на экране для SPA
let gameState = 0; // состояние игры
//0 - игра загружене
//1 - создано игровое поле и игра начата
//2 - игра закончена

// состояние игры в локальном хранилище
localStorage["gameState"] = gameState;

let activePlayer = firstPlayer(); //активный игрок
let playerObjLocation; // позиция игрока в связке с объектоа на поле
let playerPosX; // координата для массива объектов поля по Х
let playerPosY; // координата для массива объектов поля по У
let priviousMove; // предыдуший ход
let cowsType = ["brown", "black", "grey", "white"]; // цвета коров

let playerMoves = 0; // количество шагов игрока
let dragallow = 1; // было ли перетягивание коров
// 0 - перетягивание состоялось и запрещено
// 1 - перетягивание разрешено
let dragState = 0; // состояние драгдропа
// не начат
// в процессе
let cowsRemain = { black: 9, brown: 9, grey: 9, white: 9 };
let zoneland; // зона посадки коров у игрока
let colorChoose; // выбранный цвет коров для перетягивания
let cowsamountChoose = 0; // число выбранных коров для определния числа ходов и записи в объект игрока

// состояние игры в локальном хранилище
// if (localStorage.getItem("gameState") == null) {
// localStorage["gameState"] = gameState;
// }
//else if (localStorage.getItem("gameState") == 1) {
//   document.getElementById("game_start").innerHTML = "Продолжить";
// }

//класс для объектов поля и игроков, хранит информацию о цисле коров, методы добавления и удаления.
class Storage {
  name;
  maxCows;
  cows = {};
  constructor(max, total, brown, black, grey, white, name) {
    this.name = name;
    this.maxCows = max;
    this.cows.total = total;
    this.cows.brown = brown;
    this.cows.black = black;
    this.cows.grey = grey;
    this.cows.white = white;
  }
  addCow(key, value) {
    this.cows[key] += value;
    this.cows.total += value;
  }

  remoweCow(key, value) {
    this.cows[key] -= value;
    this.cows.total -= value;
  }
}
// объекты игрового поля, имя = файл с изображением
let BC = new Storage(5, 0, 0, 0, 0, 0, "BC");
let CS = new Storage(4, 0, 0, 0, 0, 0, "CS");
let DF = new Storage(4, 0, 0, 0, 0, 0, "DF");
let KR = new Storage(4, 0, 0, 0, 0, 0, "KR");
let MJ = new Storage(4, 0, 0, 0, 0, 0, "MJ");
let NH = new Storage(6, 0, 0, 0, 0, 0, "NH");
let RV = new Storage(4, 0, 0, 0, 0, 0, "RV");
let ST = new Storage(3, 0, 0, 0, 0, 0, "ST");
let TL = new Storage(2, 0, 0, 0, 0, 0, "TL");

// объекты игроки , имя = файл с изображением
let P1 = new Storage(36, 0, 0, 0, 0, 0, "P1");
let P2 = new Storage(36, 0, 0, 0, 0, 0, "P2");
let playerArr = [, P1, P2];

let landArr = [BC, CS, DF, KR, MJ, NH, RV, ST, TL]; //массив объектов для создания случайного поля
let landMap = [[], [], []]; // карта

window.addEventListener("beforeunload", (e) => {
  if (localStorage.getItem("gameState") == 1) {
    var confirmationMessage = "O";
    (e || window.event).returnValue = confirmationMessage;
    // localStorage.clear();
    return confirmationMessage;
  }
});

window.onhashchange = switchToStateFromURLHash;

let SPAState = {};
function switchToStateFromURLHash() {
  let URLHash = window.location.hash;
  let stateStr = URLHash.substr(1);

  if (stateStr != "") {
    let parts = stateStr.split("_");
    SPAState = { pagename: parts[0] };
  } else SPAState = { pagename: "Main" };

  let pageHTML = "";
  switch (SPAState.pagename) {
    case "Main":
      pageHTML = mainMenu;
      break;
    case "Rules":
      pageHTML = rulesBlock;
      break;
    case "Score":
      pageHTML = scoresBlock;
      break;
    case "Start":
      pageHTML = "";
      break;
  }
  if (SPAState.pagename != "Start") {
    wraperMain.appendChild(pageHTML);
  }

  menumove(SPAState.pagename);
}

function switchToState(newState) {
  var stateStr = newState.pagename;
  location.hash = stateStr;
}

function switchToMain() {
  switchToState({ pagename: "Main" });
}

function switchToRules() {
  switchToState({ pagename: "Rules" });
}

function switchToScore() {
  switchToState({ pagename: "Score" });
}
function switchToStartGame() {
  switchToState({ pagename: "Start" });
}

switchToStateFromURLHash();

//функции анимации меню
function menumove(EO) {
  if (EO == "Start") {
    mainMenuMove();
    setTimeout(gameInit, 500);
  } else if (EO == "Rules") {
    mainMenuMove();
    setTimeout(rulesMove, 500);
  } else if (EO == "Score") {
    mainMenuMove();
    setTimeout(scoresMove, 500);
  } else if (EO == "Main") {
    if (
      window.getComputedStyle(rulesBlock).getPropertyValue("top") == "-50px"
    ) {
      rulesMove();
    }
    if (gameZone != undefined) {
      wraperMain.removeChild(gameZone);
      document.body.style.background =
        "url(assets/background.jpg) no-repeat center";
      gameZone = undefined;
    }
    setTimeout(mainMenuMove, 500);
  } else if (EO == "scores_back") {
    scoresMove();
    setTimeout(mainMenuMove, 500);
  }
}

function mainMenuMove() {
  if (window.getComputedStyle(mainMenu).getPropertyValue("opacity") == "0") {
    mainMenu.style.opacity = 1;
  } else mainMenu.style.opacity = "0";
}
function rulesMove() {
  if (window.getComputedStyle(rulesBlock).getPropertyValue("top") == "2000px") {
    rulesBlock.style.top = "-50px";
    wraperMain.removeChild(mainMenu);
  } else rulesBlock.style.top = "2000px";
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
//созадем главный экран
function maimMenuCreate() {
  let mainMenu = document.createElement("div");
  mainMenu.id = "mainMenu";
  let title = document.createElement("div");
  title.classList.add("title");
  let gameName = document.createElement("div");
  gameName.id = "game_name";
  gameName.innerHTML = "LONGHORN";
  title.appendChild(gameName);
  let menu = document.createElement("div");
  menu.classList.add("menu");
  let gameStart = document.createElement("button");
  gameStart.classList.add("menu_button");
  gameStart.id = "game_start";
  gameStart.innerHTML = "Новая игра";
  gameStart.addEventListener("click", switchToStartGame);
  // нужно будет поправить функцию

  let rules = document.createElement("button");
  rules.classList.add("menu_button");
  rules.id = "rules";
  rules.innerHTML = "Правила";
  rules.addEventListener("click", switchToRules);
  let score = document.createElement("button");
  score.classList.add("menu_button");
  score.id = "score";
  score.innerHTML = "Рекорды";
  score.addEventListener("click", switchToScore);
  menu.appendChild(gameStart);
  menu.appendChild(rules);
  menu.appendChild(score);
  mainMenu.appendChild(title);
  mainMenu.appendChild(menu);
  return mainMenu;
}

// создаем правила
function rulesCreate() {
  let rulesPage = document.createElement("div");
  rulesPage.id = "rules_page";
  let article = document.createElement("article");
  let p = `<p>Ход игры</p>
  <p>
    Жетон преступника показывает, чей сейчас ход. В свой ход преступник
    должен: 1. Украсть быков 2. Передвинуть и перевернуть жетон
    преступника
  </p>
  <p>
            1. Украсть быков В локации, где находится жетон преступника, он
            крадёт всех быков одного (и только одного) цвета на свой выбор.
            Фигурки украденных быков игрок кладёт перед собой, формируя стадо,
            стоимость которого он подсчитает в конце игры.
          </p>
          <p>
            Если после кражи в локации не осталось ни одного быка, то к данному
            игроку ОБЯЗАТЕЛЬНО применяется эффект жетона Действия,
            расположенного в этой локации.
          </p>
          <p>Эффекты жетонов действия (функционал под вопросом)</p>
          <p>
            2. Передвинуть и перевернуть жетон преступника Игрок ДОЛЖЕН
            передвинуть жетон преступника в другую локацию на столько шагов,
            сколько быков он только что украл. Передвигать жетон можно по
            вертикали и по горизонтали, нельзя двигаться на шаг вперёд, а потом
            сразу на шаг назад между двумя локациями. Когда жетон передвинут, он
            переворачивается: таким образом ход передаётся противнику.
          </p>
          <p>
            Важно: если все локации, находящиеся на нужном расстоянии, уже
            опустели, игра заканчивается и происходит подсчёт очков. Если на
            нужном расстоянии осталась хотя бы одна локация с быками, игрок
            должен передвинуть жетон в эту локацию (или одну из таких локаций).
          </p>
          <p>Конец игры Игра заканчивается в трёх случаях:</p>
          <p>
            1. Если один из преступников активирует жетон Шерифа (он немедленно
            проигрывает).
          </p>
          <p>
            2. Если игроку удаётся собрать 9 быков одного цвета (он немедленно
            побеждает в игре). (Важно: если один игрок одновременно выполнил
            условия 1 и 2, то действует условие 1 – он проигрывает.)
          </p>
          <p>
            3. Если все локации, куда только что укравший быков игрок может
            переместить жетон (локации на расстоянии, равном числу украденных им
            быков), опустели. В таком случае игроки подсчитывают стоимость
            своего стада и прибавляют стоимость полученных ими золотых слитков.
            Побеждает тот, кто набрал больше победных очков! Стоимость стада: за
            каждого быка в вашем стаде вы получаете $100, умноженных на
            количество быков того же цвета, оставшихся на игровом поле.
          </p>`;
  article.innerHTML = p;
  let button = document.createElement("button");
  button.classList.add("menu_button");
  button.id = "rules_back";
  button.innerHTML = "Назад";
  button.addEventListener("click", switchToMain);
  rulesPage.appendChild(article);
  rulesPage.appendChild(button);
  return rulesPage;
}

// создаем рекорды

function scoreCreate() {
  let s = document.createElement("div");

  //   <div id="scores_page">
  //   <table>
  //     <tr>
  //       <td>игрок</td>
  //       <td>1000</td>
  //     </tr>
  //     <tr>
  //       <td>Игрок</td>
  //       <td>900</td>
  //     </tr>
  //   </table>
  //   <button class="menu_button" id="scores_back">Назад</button>
  // </div>;
  return s;
}

// html верска игровой области
function fieldHtmlCreate() {
  gameZone = document.createElement("div");
  gameZone.id = "gameZone";
  let field = document.createElement("div");
  field.id = "field";

  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      let div = document.createElement("div");
      div.classList.add("land_div");
      div.id = `${landMap[i][j].name}`;
      div.addEventListener("mousedown", dragdrop);
      let img = document.createElement("img");
      img.src = `assets/${landMap[i][j].name}.jpg`;
      img.classList.add("land");
      div.appendChild(cowDivCreate());
      div.appendChild(img);
      field.appendChild(div);
    }
  }

  let playerZone = document.createElement("div");
  playerZone.id = "player_zone";

  for (let i = 1; i <= 2; i++) {
    let player = document.createElement("div");
    player.id = `player_${i}`;
    let img = document.createElement("img");
    img.src = `assets/P${i}.jpg`;
    img.classList.add("icon");
    player.appendChild(img);
    player.appendChild(cowDivCreate());
    player.addEventListener("mouseover", dragdropend);
    playerZone.appendChild(player);
  }

  gameZone.appendChild(field);
  gameZone.appendChild(playerZone);
  let sB = document.getElementById("game_start");
  sB.innerHTML = "Продолжить";
  wraperMain.removeChild(mainMenu);
  wraperMain.appendChild(gameZone);
}

// верстки блока коров для поля и области игрока
function cowDivCreate() {
  let cowarr = ["black", "brown", "grey", "white"];
  let cowDiv = document.createElement("div");
  cowDiv.classList.add("land_cows");
  cowDiv.addEventListener("touchstart", touchStrat);
  for (let i = 0; i < cowarr.length; i++) {
    let cow = document.createElement("div");
    cow.classList.add("cow");
    cow.setAttribute("data-cowtype", `${cowarr[i]}`);
    let img = document.createElement("img");
    img.classList.add("cow_img");
    img.src = `assets/cow_${cowarr[i]}.png`;
    let span = document.createElement("span");
    cow.appendChild(img);
    cow.appendChild(span);
    cowDiv.appendChild(cow);
  }
  return cowDiv;
}

//верстка жетона игрока SVG
function playerToken() {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.setAttribute("width", 250);
  svg.setAttribute("height", 250);

  svg.id = "playerToken";
  let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  let clipPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "clipPath"
  );
  clipPath.id = "clip";
  let mask = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  mask.setAttribute("r", 50);
  mask.setAttribute("cx", 125);
  mask.setAttribute("cy", 125);
  clipPath.appendChild(mask);
  defs.appendChild(clipPath);
  svg.appendChild(defs);

  let playerToken = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  playerToken.setAttribute("r", 50);
  playerToken.setAttribute("cx", 125);
  playerToken.setAttribute("cy", 125);
  playerToken.setAttribute("stroke", "green");
  playerToken.setAttribute("stroke-width", 3);

  let playerImage = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "image"
  );
  playerImage.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "href",
    `assets/P${activePlayer}.jpg`
  );
  playerImage.setAttribute("width", 150);
  playerImage.setAttribute("height", 150);
  playerImage.setAttribute("x", 50);
  playerImage.setAttribute("y", 50);
  playerImage.id = "playerTimage";
  playerImage.setAttribute("clip-path", "url(#clip)");

  svg.appendChild(playerToken);
  svg.appendChild(playerImage);
  for (let i = 1; i <= 4; i++) {
    let polcoords = [
      ,
      "25,125 70,100 70,150",
      "225,125 180,100 180,150",
      "100,70 125,25 150,70",
      "100,180 125,225 150,180",
    ];
    let polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    polygon.setAttribute("points", polcoords[i]);
    polygon.setAttribute("fill", "green");
    polygon.setAttribute("stroke", "white");
    polygon.setAttribute("stroke-width", 2);
    polygon.classList.add("polygon");
    polygon.addEventListener("mousedown", clickSound);
    polygon.id = `AR${i}`;
    svg.appendChild(polygon);
  }

  let strLoc;
  let start;
  if (localStorage.getItem("playerLocation") == null) {
    strLoc = landArr[randomDiap(0, 8)].name;
    start = document.getElementById(strLoc);
    localStorage.playerLocation = strLoc;
    start.appendChild(svg);
  } else {
    strLoc = localStorage.getItem("playerLocation");
    start = document.getElementById(strLoc);
    start.appendChild(svg);
  }
}

//инициализация игрового экрана
function gameInit() {
  document.body.style.background = "url(assets/game_bg.jpg) no-repeat center";
  if (localStorage.getItem("gameState") == 0) {
    fieldCreator();
    landStartFill(landArr);
    fieldHtmlCreate();
    gameState = 1;
    localStorage["gameState"] = JSON.stringify(gameState);
    localStorage.map = JSON.stringify(landMap);
  } else {
    landMap = JSON.parse(localStorage.getItem("map"));
    fieldHtmlCreate();
  }
  playerToken();
  updateCows();
  playerLocation();
}

//функция генерации случайного поля игры
function fieldCreator() {
  let lendUsedarr = [];
  let n;
  let randLand;
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      do {
        n = randomDiap(0, 8);
        randLand = landArr[n];
      } while (lendUsedarr.includes(randLand));
      landMap[i][j] = randLand;
      lendUsedarr.push(randLand);
    }
  }
}

//функция заполнения коровами объектов игрового поля
function landStartFill(arr) {
  let cav = {
    brown: 9,
    black: 9,
    grey: 9,
    white: 9,
  };
  for (let i = 0; i < arr.length; i++) {
    landFillCows(arr[i], cav);
  }
}
//функция заполнения коровами одного объекта игрового поля
function landFillCows(LN, cav) {
  let n = 1; //поштучное добавление коров на поле
  let cc; // числовое значение выбранного цвета
  let cu; // выбранный случайно цвет
  do {
    cc = randomDiap(0, 3);
    cu = cowsType[cc];
  } while (n > cav[cu]);
  LN.addCow(cu, n);
  cav[cu] -= n;
  if (LN.cows.total < LN.maxCows) {
    landFillCows(LN, cav);
  }
}

function randomDiap(n, m) {
  return Math.floor(Math.random() * (m - n + 1)) + n;
}

//обновление состояния коров
function updateCows() {
  for (let i = 0; i < landArr.length; i++) {
    let s = landArr[i].name;
    let land = document.getElementById(`${s}`);
    let cows = land.childNodes[0].childNodes;
    if (landArr[i].cows.black == 0) {
      cows[0].classList.add("vis");
    } else {
      cows[0].childNodes[1].innerHTML = landArr[i].cows.black;
      cows[0].classList.remove("vis");
    }
    if (landArr[i].cows.brown == 0) {
      cows[1].classList.add("vis");
    } else {
      cows[1].childNodes[1].innerHTML = landArr[i].cows.brown;
      cows[1].classList.remove("vis");
    }
    if (landArr[i].cows.grey == 0) {
      cows[2].classList.add("vis");
    } else {
      cows[2].childNodes[1].innerHTML = landArr[i].cows.grey;
      cows[2].classList.remove("vis");
    }
    if (landArr[i].cows.white == 0) {
      cows[3].classList.add("vis");
    } else {
      cows[3].childNodes[1].innerHTML = landArr[i].cows.white;
      cows[3].classList.remove("vis");
    }
  }

  //обновление состояния коров в болоке игроков
  for (let i = 1; i <= 2; i++) {
    let player = document.getElementById(`player_${i}`);
    let cows = player.childNodes[1].childNodes;

    if (playerArr[i].cows.black == 0) {
      cows[0].classList.add("vis");
    } else {
      cows[0].childNodes[1].innerHTML = playerArr[i].cows.black;
      cows[0].classList.remove("vis");
    }
    if (playerArr[i].cows.brown == 0) {
      cows[1].classList.add("vis");
    } else {
      cows[1].childNodes[1].innerHTML = playerArr[i].cows.brown;
      cows[1].classList.remove("vis");
    }
    if (playerArr[i].cows.grey == 0) {
      cows[2].classList.add("vis");
    } else {
      cows[2].childNodes[1].innerHTML = playerArr[i].cows.grey;
      cows[2].classList.remove("vis");
    }
    if (playerArr[i].cows.white == 0) {
      cows[3].classList.add("vis");
    } else {
      cows[3].childNodes[1].innerHTML = playerArr[i].cows.white;
      cows[3].classList.remove("vis");
    }
  }
}
// первый игрок при начале игры
function firstPlayer() {
  return randomDiap(1, 2);
}

// Местоположение игрока с привязкой к карте
function playerLocation() {
  let location = localStorage.getItem("playerLocation");
  for (let i = 0; i < landMap.length; i++) {
    for (let j = 0; j < landMap[i].length; j++) {
      if (landMap[i][j].name == location) {
        // playerPosition[i][j] = 1;
        playerObjLocation = landMap[i][j];
        playerPosX = j;
        playerPosY = i;
      }
    }
  }
}

//drag&drop для коров с поля в область игрока
function dragdrop(EO) {
  if (dragallow == 0) {
    EO.preventDefault();
  } else if (EO.target.className == "land") {
    EO.preventDefault();
  } else {
    if (EO.currentTarget.id == localStorage.getItem("playerLocation")) {
      let el = EO.target.parentNode;
      colorChoose = el.getAttribute("data-cowtype");
      cowsamountChoose = +EO.target.nextSibling.innerHTML;
      zoneland = document.getElementById(`player_${activePlayer}`);
      zoneland.classList.add("land_cows_landing");
      dragState = 1;
      playerMoves = cowsamountChoose;
    } else {
      EO.preventDefault();
    }
  }
}

function dragdropend(EO) {
  if (dragState == 1) {
    let pl = EO.currentTarget.id.split("_");
    if (activePlayer == pl[1]) {
      zoneland.classList.remove("land_cows_landing");
      playerObjLocation.remoweCow(colorChoose, cowsamountChoose);
      cowsRemain[colorChoose] -= cowsamountChoose;
      activePlayer == 1
        ? P1.addCow(colorChoose, cowsamountChoose)
        : P2.addCow(colorChoose, cowsamountChoose);
      updateCows();
      dragallow = 0;
      colorChoose = "";
      cowsamountChoose = 0;
      dragState = 0;
      arrowVisible();
    }
  }
}

// функции движения фишки

document.addEventListener("keydown", keysMovemet);
document.addEventListener("mousedown", mouseMovemet);

//движение мышкой по стрелкам
function mouseMovemet(EO) {
  if (playerMoves != 0) {
    if (EO.target.id == "AR3" && priviousMove != "up") {
      movement("up");
    }
    if (EO.target.id == "AR4" && priviousMove != "down") {
      movement("down");
    }
    if (EO.target.id == "AR1" && priviousMove != "left") {
      movement("left");
    }
    if (EO.target.id == "AR2" && priviousMove != "right") {
      movement("right");
    }
  }
}
// движение клавишами
function keysMovemet(EO) {
  if (playerMoves != 0) {
    if (EO.code == "ArrowUp" && priviousMove != "up") {
      movement("up");
    }
    if (EO.code == "ArrowDown" && priviousMove != "down") {
      movement("down");
    }
    if (EO.code == "ArrowLeft" && priviousMove != "left") {
      movement("left");
    }
    if (EO.code == "ArrowRight" && priviousMove != "right") {
      movement("right");
    }
  }
}
// визуал стрелок от допустимых ходов
function arrowVisible() {
  let left = document.getElementById("AR1");
  let right = document.getElementById("AR2");
  let up = document.getElementById("AR3");
  let down = document.getElementById("AR4");

  let arrows = document.getElementsByTagName("polygon");
  playerMoves != 0 ? allvis("remove") : allvis("add");
  function allvis(e) {
    for (let i = 0; i < arrows.length; i++) {
      arrows[i].classList[e]("polygon");
    }
  }

  if (priviousMove == "left") {
    left.classList.add("polygon");
  }
  if (priviousMove == "up") {
    up.classList.add("polygon");
  }
  if (priviousMove == "right") {
    right.classList.add("polygon");
  }
  if (priviousMove == "down") {
    down.classList.add("polygon");
  }
  if (playerPosX == 0) {
    left.classList.add("polygon");
  }
  if (playerPosX == 2) {
    right.classList.add("polygon");
  }
  if (playerPosY == 0) {
    up.classList.add("polygon");
  }
  if (playerPosY == 2) {
    down.classList.add("polygon");
  }
}

//движение фишки
function movement(dir) {
  switch (dir) {
    case "up":
      playerPosY != 0
        ? (playerPosY--, playerMoves--, (priviousMove = "down"))
        : playerPosY;
      break;
    case "down":
      playerPosY != 2
        ? (playerPosY++, playerMoves--, (priviousMove = "up"))
        : playerPosY;
      break;
    case "left":
      playerPosX != 0
        ? (playerPosX--, playerMoves--, (priviousMove = "right"))
        : playerPosX;
      break;
    case "right":
      playerPosX != 2
        ? (playerPosX++, playerMoves--, (priviousMove = "left"))
        : playerPosX;
      break;
  }
  let token = document.getElementById("playerToken");
  let currPos = document.getElementById(localStorage.getItem("playerLocation"));
  let destPos = document.getElementById(landMap[playerPosY][playerPosX].name);

  currPos.removeChild(token);
  destPos.appendChild(token);

  arrowVisible();

  localStorage.playerLocation = landMap[playerPosY][playerPosX].name;
  playerObjLocation = landMap[playerPosY][playerPosX];
  if (playerMoves == 0) {
    dragallow = 1;
    priviousMove = "";
    activePlayer == 1 ? (activePlayer = 2) : (activePlayer = 1);
    let portr = document.getElementById("playerTimage");
    portr.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      `assets/P${activePlayer}.jpg`
    );
    if (playerObjLocation.cows.total == 0) {
      gameEnd();
    }
  }
}

function gameEnd() {
  gameState = 2;
  localStorage["gameState"] = gameState;
  let P1score = score(P1);
  let P2score = score(P2);
  P1score > P2score
    ? alert(`Игра окончена, победил игрок 1 со счетом ${P1score}`)
    : alert(`Игра окончена, победил игрок 2 со счетом ${P2score}`);
}
function score(P) {
  let score = 0;
  for (let i = 0; i < cowsType.length; i++) {
    score += cowsRemain[cowsType[i]] * P.cows[cowsType[i]];
  }
  return score * 100 + "$";
}

// аудио
let playSong = document.getElementById("game_start");
playSong.addEventListener("mousedown", playaudio);

let song = new Audio();
song.src = "assets/song.mp3";
song.volume = 0.5;
song.loop = true;
let arclick = new Audio();
arclick.src =
  "http://www.kalmanovitz.co.il/courses/English/construction/Assets/Mousclik.wav";

function playaudio() {
  song.play();
}
function clickSound() {
  arclick.play();
}

// тач управление

document.addEventListener("touchmove", touchMove);
document.addEventListener("touchend", touchEnd);
let el;
var touchShiftX = 0;
var touchShiftY = 0;

function touchStrat(EO) {
  EO.preventDefault();
  console.log(EO.target);
  el = EO.target.parentNode;

  let touchInfo = EO.targetTouches[0];
  touchShiftX = touchInfo.pageX - el.offsetLeft;
  touchShiftY = touchInfo.pageY - el.offsetTop;
  if (dragallow == 0) {
    EO.preventDefault();
  } else if (
    EO.target.className == "land" ||
    EO.target.className == "land_cows"
  ) {
    EO.preventDefault();
  } else {
    if (
      EO.currentTarget.parentNode.id == localStorage.getItem("playerLocation")
    ) {
      el.style.position = "absolute";
      colorChoose = el.getAttribute("data-cowtype");
      cowsamountChoose = +EO.target.nextSibling.innerHTML;
      zoneland = document.getElementById(`player_${activePlayer}`);
      zoneland.classList.add("land_cows_landing");
      dragState = 1;
      playerMoves = cowsamountChoose;
    } else {
      EO.preventDefault();
    }
  }
}
function touchMove(EO) {
  if (dragallow == 0) {
    EO.preventDefault();
  } else if (EO.target.className == "land") {
    EO.preventDefault();
  }
  // EO.preventDefault();
  let touchInfo = EO.targetTouches[0];
  el.style.left = touchInfo.pageX - touchShiftX + "px";
  el.style.top = touchInfo.pageY - touchShiftY + "px";
}

function touchEnd(EO) {
  if (dragState == 1) {
    el.style.position = "relative";
    // let pl = EO.currentTarget.id.split("_");
    // if (activePlayer == pl[1]) {
    zoneland.classList.remove("land_cows_landing");
    playerObjLocation.remoweCow(colorChoose, cowsamountChoose);
    cowsRemain[colorChoose] -= cowsamountChoose;
    activePlayer == 1
      ? P1.addCow(colorChoose, cowsamountChoose)
      : P2.addCow(colorChoose, cowsamountChoose);
    updateCows();
    dragallow = 0;
    colorChoose = "";
    cowsamountChoose = 0;
    dragState = 0;
    arrowVisible();
    // }
  }
}
