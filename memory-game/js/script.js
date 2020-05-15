const cards = document.querySelectorAll(".memory-card");

let hasFlippedCard;
let lockBoard;
let firstCard, secondCard;

document.addEventListener("DOMContentLoaded", function () {
  startGame();
});

function startGame() {
  resetBoard();

  for (let card of cards) {
    card.classList.remove("flip");
    card.classList.remove("disabled");
    card.addEventListener("click", flipCard);
  }

  shuffle();
}

function shuffle() {
  cards.forEach((card) => {
    let randomPosition = Math.floor(Math.random() * 12);
    card.style.order = randomPosition;
  });
}

function flipCard() {
  // do not let fliping any other card while two cards are visible
  if (lockBoard) return;

  // do not let clicking twice in the same card
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
  } else {
    // second click
    hasFlippedCard = false;
    secondCard = this;

    checkForMatch();
  }
}

function checkForMatch() {
  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    // it is a match
    disableCards();
  } else {
    // not a match
    unflipCards();
  }

  // using ternary operator
  //(firstCard.dataset.framework === secondCard.dataset.framework) ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  firstCard.classList.add("disabled");
  secondCard.classList.add("disabled");

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}
