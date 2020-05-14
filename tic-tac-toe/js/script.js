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

  getGameSettings();

  originalBoard = Array.from(Array(9).keys());

  for (let cell of cells) {
    cell.classList.remove("active");

    cell.innerText = "";
    cell.style.removeProperty("background-color");
    cell.addEventListener("click", turnClick, false);
  }
}

function getGameSettings() {
  const difficulties = document.getElementsByName("difficulty");
  for (let d of difficulties) {
    if (d.checked) {
      difficulty = d.value;
      break;
    }
  }

  const players = document.getElementsByName("player");
  let player;
  for (let p of players) {
    if (p.checked) {
      player = p.value;
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
  for (let cell of cells) {
    cell.removeEventListener("click", turnClick, false);
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
  let availableSpots = emptySquares();

  if (checkWin(newBoard, humanPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, AIPlayer)) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let spot of availableSpots) {
    let move = {};
    move.index = newBoard[spot];
    newBoard[spot] = player;

    if (player == AIPlayer) {
      let result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, AIPlayer);
      move.score = result.score;
    }

    newBoard[spot] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === AIPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
