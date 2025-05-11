// Set up the board
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
  98: 78
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
  80: 100
};

let player1Pos = 1;
let player2Pos = 1;
let currentPlayer = 1;

// Create the game board dynamically
function createBoard() {
  const board = document.getElementById('board');
  for (let i = 100; i >= 1; i--) {
    const cell = document.createElement('div');
    cell.id = `cell-${i}`;
    board.appendChild(cell);
  }
  updateBoard();
}

// Update the positions of the snakes and ladders
function updateBoard() {
  // Clear any existing snakes/ladders arrows
  document.querySelectorAll('.snake-arrow, .ladder-arrow').forEach(arrow => arrow.remove());

  // Draw the snakes and ladders on the board
  Object.keys(snakes).forEach((startPos) => {
    const endPos = snakes[startPos];
    drawSnakeLadder(startPos, endPos, 'snake');
  });

  Object.keys(ladders).forEach((startPos) => {
    const endPos = ladders[startPos];
    drawSnakeLadder(startPos, endPos, 'ladder');
  });
}

// Draw an arrow indicating a snake or ladder
function drawSnakeLadder(start, end, type) {
  const startCell = document.getElementById(`cell-${start}`);
  const endCell = document.getElementById(`cell-${end}`);
  
  const arrow = document.createElement('div');
  arrow.classList.add(type === 'snake' ? 'snake-arrow' : 'ladder-arrow');
  
  startCell.appendChild(arrow);
}

// Roll the dice and move the current player
function rollDice() {
  const diceRoll = Math.floor(Math.random() * 6) + 1;
  document.getElementById('dice-result').innerText = `You rolled a ${diceRoll}!`;

  if (currentPlayer === 1) {
    player1Pos += diceRoll;
    if (player1Pos > 100) player1Pos = 100;
    document.getElementById('turn').innerText = "Player 2's Turn";
    currentPlayer = 2;
  } else {
    player2Pos += diceRoll;
    if (player2Pos > 100) player2Pos = 100;
    document.getElementById('turn').innerText = "Player 1's Turn";
    currentPlayer = 1;
  }

  handleSnakesAndLadders();
  updatePlayers();
}

// Handle the effects of snakes and ladders
function handleSnakesAndLadders() {
  if (snakes[player1Pos]) player1Pos = snakes[player1Pos];
  if (ladders[player1Pos]) player1Pos = ladders[player1Pos];

  if (snakes[player2Pos]) player2Pos = snakes[player2Pos];
  if (ladders[player2Pos]) player2Pos = ladders[player2Pos];
}

// Update player positions on the board
function updatePlayers() {
  document.querySelectorAll('.player').forEach(p => p.remove());

  const player1 = document.createElement('div');
  player1.classList.add('player', 'player1');
  document.getElementById('cell-' + player1Pos)?.appendChild(player1);

  const player2 = document.createElement('div');
  player2.classList.add('player', 'player2');
  document.getElementById('cell-' + player2Pos)?.appendChild(player2);
}

// Initialize the game
createBoard();
