let originalBoard;
let humanPlayer;
let AIPlayer;
let difficulty;

/* all the possible winning combinations of the game */
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cells = document.querySelectorAll(".cell");

document.addEventListener("DOMContentLoaded", function () {
  readyToBegin();
});

function readyToBegin() {
  document.querySelector(".modal.start-game").style.display = "inline-block";
}

function startGame() {
  document.querySelector(".modal.start-game").style.display = "none";
  document.querySelector(".modal.end-game").style.display = "none";

  for (let cell of cells) {
    cell.classList.remove("active");
  }

  getGameSettings();

  originalBoard = Array.from(Array(9).keys());

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function getGameSettings() {
  const difficulties = document.getElementsByName("difficulty");
  for (var i = 0; i < difficulties.length; i++) {
    if (difficulties[i].checked) {
      difficulty = difficulties[i].value;
      break;
    }
  }

  const players = document.getElementsByName("player");
  let player;
  for (var i = 0; i < players.length; i++) {
    if (players[i].checked) {
      player = players[i].value;
      break;
    }
  }

  if (player == "O") {
    humanPlayer = "O";
    AIPlayer = "X";
  } else {
    humanPlayer = "X";
    AIPlayer = "O";
  }
}

function turnClick(square) {
  // if the square is a type number means that it has not been clicked yet
  if (typeof originalBoard[square.target.id] == "number") {
    turn(square.target.id, humanPlayer);
    if (!checkWin(originalBoard, humanPlayer) && !checkTie()) {
      turn(bestSpot(), AIPlayer);
    }
  }
}

function turn(squareId, player) {
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;

  let gameWon = checkWin(originalBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);

  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).classList.add("active");
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose");
}

function declareWinner(who) {
  document.querySelector(".modal.end-game").style.display = "inline-block";
  document.querySelector("#end-game p").innerHTML = who;
}

function bestSpot() {
  if (difficulty == "easy") {
    return emptySquares()[0];
  } else {
    return minimax(originalBoard, AIPlayer).index;
  }
}

function emptySquares() {
  return originalBoard.filter((s) => typeof s == "number");
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let cell of cells) {
      cell.classList.add("active");
      cell.removeEventListener("click", turnClick, false);
    }

    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availableSpots = emptySquares();

  if (checkWin(newBoard, humanPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, AIPlayer)) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (var i = 0; i < availableSpots.length; i++) {
    var move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player == AIPlayer) {
      var result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, AIPlayer);
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === AIPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
