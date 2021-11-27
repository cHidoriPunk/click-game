class ScoreItem {
  constructor(scoreDate, playerName, scoreTime, timeStamp, mouseCoordinates) {
    this.scoreDate = scoreDate;
    this.playerName = playerName;
    this.scoreTime = scoreTime;
    this.timeStamp = timeStamp;
    this.mouseCoordinates = mouseCoordinates;
  }
  getScoreDate() {
    return this.scoreDate;
  }
  getPlayerName() {
    return this.playerName;
  }
  getScoreTime() {
    return this.scoreTime;
  }
  getTimeStamp() {
    return this.timeStamp;
  }
  getCoordinatesObj() {
    return this.mouseCoordinates;
  }
}

const clockHandElem = document.querySelector('#clock-hand');
const scoresContainer = document.querySelector('#scores');
const actionZone = document.querySelector('#action-zone');
const scoresTable = document.querySelector("#scores");
let scoresObj = { "scores": [] };
let nameLessNumOfTrys = 0;
let startDate, endDate;
let coordinates = [];
let coordinatesObjData = {};
let tableSortInit = false;

const startGame = () => {
  window.scrollTo(0, 0);
  startDate = new Date();
  clockHandElem.classList.add('animate-clock');
  actionZone.classList.add("active");
  document.querySelector('#action-zone').addEventListener("click", handleClicks);
}

const handleClicks = (ev) => {
  if (!ev.target.parentElement.matches(".click-zone")) { return; }
  let targetParent = ev.target.parentElement;
  targetParent.classList.add('collected');
  let countElements = document.querySelectorAll('.collected').length;
  if (countElements === 1) {
    ev.currentTarget.addEventListener("mousemove", getPlayerMovement, true);
  }
  if (countElements === 3) {
    ev.currentTarget.removeEventListener("mousemove", getPlayerMovement, true);
    document.querySelectorAll('.collected').forEach(item => {
      item.classList.remove('collected');
    });
    clockHandElem.style.transform = clockHandElem.style.transform;
    clockHandElem.classList.remove('animate-clock');
    const title = 'Please Fill Your Name';
    const content = `<form name="addscore"><div class="form-group"><label for="player_name">What's Your Name?</label><input name="player_name" class="form-control" type="text" onkeypress="if(event.keyCode ==13){ return false; }"/></div><div class="text-right"><button id="send-score" type="button" class="btn btn-default">Send</button></div></form>`;
    showModal(title, content);
    endDate = new Date();
    addScoreValidate();
  }
}

const theNameLess = () => {
  nameLessNumOfTrys++;
  let reply = "";
  const myArray = ['What\'s your name?', 'How are you called?', 'Give me a name..', 'One might call you..?', 'Your name is..?'];
  reply = myArray[Math.floor(Math.random() * myArray.length)];
  if (nameLessNumOfTrys > 4) {
    reply = 'A Girl As No Name';
  }
  if (nameLessNumOfTrys > 5) {
    reply = $('input[name="player_name"]').val('Arya Stark');
    nameLessNumOfTrys = 0;
  }
  return reply;
}

const showScores = () => {
  scoresContainer.innerHTML = "";
  let existing = localStorage.getItem("clickGameSavedScores");
  existing = existing ? JSON.parse(existing) : scoresObj;
  if (existing.scores.length) {
    scoresObj = existing;
  }
  existing?.scores?.forEach((item, index) => {
    tRow = document.createElement("tr");
    tRow.innerHTML = `<td>${item.scoreDate}</td><td>${item.playerName}</td><td>${item.scoreTime}</td><td><button type="button" onclick="showGraph(${index})">Show Graph</button></td>`;
    scoresTable.appendChild(tRow);
  });
  if (!tableSortInit) {
    $("#high_scores table").tablesorter({ headers: { 3: { sorter: false } } });
    tableSortInit = true;
  }
  if (tableSortInit) {
    $("#high_scores table").trigger("update");
  }
}

const showGraph = (id) => {
  showModal('Score Graph', '<canvas id="myCanvas"></canvas>');
  var canvas = document.querySelector('#myCanvas');
  var ctx = canvas.getContext("2d");
  ctx.canvas.width = 568;
  ctx.canvas.height = 568;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#2E4272";
  let coordinates = JSON.parse(JSON.parse(localStorage.getItem('clickGameSavedScores')).scores[id].mouseCoordinates).lines[0];
  coordinates.forEach((line) => {
    let coordX = line[0] / 2;
    let coordY = line[1] / 2;
    ctx.lineTo(coordX, coordY);
  })
  ctx.stroke();
}

const getPlayerMovement = (ev) => {
  coordinates.push([ev.clientX - (ev.currentTarget.getBoundingClientRect().left - ev.currentTarget.offsetWidth / 2), ev.clientY - (ev.currentTarget.getBoundingClientRect().top - ev.currentTarget.offsetHeight / 2)]);
}

let scoreDate = () => {
  let MyDate = new Date();
  return ('0' + MyDate.getDate()).slice(-2) + '/' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '/' + MyDate.getFullYear();
}

let scoreTime = (endDate, startDate) => {
  return (endDate - startDate) / 1000 + " sec";
}

let timeStamp = () => {
  return Math.round(new Date().getTime() / 1000);
}

let addScoreItem = (newItem) => {
  scoresObj.scores.push(newItem);
  localStorage.setItem("clickGameSavedScores", JSON.stringify(scoresObj));
  console.log(scoresObj);
  coordinates = [];
  coordinatesObjData = {};
}

function showModal(title, content) {
  $('#myModal').find('.modal-title').html(title);
  $('#myModal').find('.modal-body').html(content);
  $('#myModal').modal({ show: true, keyboard: true, backdrop: true });
}

function addScoreValidate() {
  document.querySelector('#action-zone').removeEventListener("click", handleClicks);
  document.querySelector('button[id="send-score"]').addEventListener("click", () => {
    let playerName = document.querySelector('input[name="player_name"]');
    let playerNameValue = playerName.value;
    if (playerNameValue) {
      coordinatesObjData = JSON.stringify({ "lines": [coordinates] });
      let newScoreItem = new ScoreItem(scoreDate(), playerNameValue, scoreTime(endDate, startDate), timeStamp(), coordinatesObjData);
      addScoreItem(newScoreItem);
      $('html,body').animate({
        scrollTop: $('#high_scores').offset().top
      }, 1000);
      clearModal();
      showScores();
    } else {
      playerName.placeholder = theNameLess();
    }
  });
}

function clearModal() {
  $('#myModal').modal('hide');
  $('#myModal .modal-title').html('');
  $('#myModal .modal-body').html('');
}

window.addEventListener("load", () => {
  window.addEventListener("keypress", (ev) => {
    if (ev.code !== "Space") { return; }
    ev.preventDefault();
    startGame();
  });
  document.querySelector("#clearResultsTable").addEventListener("click", () => {
    localStorage.removeItem("clickGameSavedScores");
    scoresContainer.innerHTML = "";
  });
  $('#myModal').on('shown.bs.modal', function () {
    $(this).find("input").focus();
  });
  $('#myModal').on('hidden.bs.modal', function () {
    clockHandElem.style.transform = "";
  });
  showScores();
});