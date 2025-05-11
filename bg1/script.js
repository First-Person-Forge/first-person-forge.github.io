const board = document.getElementById('board');
const diceResult = document.getElementById('dice-result');
const turnText = document.getElementById('turn');

let player1Pos = 1;
let player2Pos = 1;
let currentPlayer = 1;

const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

function createBoard() {
  board.innerHTML = '';
  for (let i = 100; i >= 1; i--) {
    const cell = document.createElement('div');
    cell.id = 'cell-' + i;
    cell.textContent = i;
    board.appendChild(cell);
  }
}

function updatePlayers() {
  document.querySelectorAll('.player').forEach(p => p.remove());

  const player1 = document.createElement('div');
  player1.classList.add('player', 'player1');
  document.getElementById('cell-' + player1Pos)?.appendChild(player1);

  const player2 = document.createElement('div');
  player2.classList.add('player', 'player2');
  document.getElementById('cell-' + player2Pos)?.appendChild(player2);
}

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  diceResult.textContent = `You rolled a ${roll}!`;

  if (currentPlayer === 1) {
    player1Pos = movePlayer(player1Pos, roll);
    currentPlayer = 2;
    turnText.textContent = "Player 2's Turn";
  } else {
    player2Pos = movePlayer(player2Pos, roll);
    currentPlayer = 1;
    turnText.textContent = "Player 1's Turn";
  }

  updatePlayers();
  checkWin();
}

function movePlayer(pos, roll) {
  let newPos = pos + roll;
  if (newPos > 100) return pos;

  if (snakes[newPos]) {
    alert(`🐍 Oops! Bitten by a snake! Go down from ${newPos} to ${snakes[newPos]}`);
    newPos = snakes[newPos];
  } else if (ladders[newPos]) {
    alert(`🪜 Woohoo! Ladder up from ${newPos} to ${ladders[newPos]}`);
    newPos = ladders[newPos];
  }

  return newPos;
}

function checkWin() {
  if (player1Pos === 100) {
    alert('🎉 Player 1 Wins!');
    resetGame();
  } else if (player2Pos === 100) {
    alert('🎉 Player 2 Wins!');
    resetGame();
  }
}

function resetGame() {
  player1Pos = 1;
  player2Pos = 1;
  currentPlayer = 1;
  updatePlayers();
  diceResult.textContent = "Roll the dice!";
  turnText.textContent = "Player 1's Turn";
}

createBoard();
updatePlayers();
