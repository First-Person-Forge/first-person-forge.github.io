let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let isAIEnabled = false; // Variable to toggle AI on/off
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart');
const toggleAIButton = document.getElementById('toggleAI');

// Minimax algorithm (unchanged from previous code)
function minimax(board, depth, isMaximizingPlayer) {
  const winner = checkWinner(board);
  if (winner === 'X') return -10 + depth;
  if (winner === 'O') return 10 - depth;
  if (board.every(cell => cell !== '')) return 0;

  if (isMaximizingPlayer) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = '';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = '';
      }
    }
    return best;
  }
}

function bestMove() {
  let bestVal = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === '') {
      gameBoard[i] = 'O';
      let moveVal = minimax(gameBoard, 0, false);
      gameBoard[i] = '';
      if (moveVal > bestVal) {
        move = i;
        bestVal = moveVal;
      }
    }
  }
  return move;
}

function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (let [a, b, c] of winPatterns) {
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Handle cell click
function handleCellClick(event) {
  const cellIndex = event.target.getAttribute('data-cell-index');

  if (gameBoard[cellIndex] !== '' || !isGameActive || (currentPlayer === 'O' && isAIEnabled)) return;

  gameBoard[cellIndex] = currentPlayer;
  event.target.innerText = currentPlayer;

  if (checkWinner(gameBoard)) {
    statusText.innerText = `${currentPlayer} Wins!`;
    isGameActive = false;
    return;
  }

  if (gameBoard.every(cell => cell !== '')) {
    statusText.innerText = "It's a Draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.innerText = currentPlayer === 'X' ? "Player X's Turn" : "AI's Turn";

  if (isAIEnabled && currentPlayer === 'O') {
    aiMove();
  }
}

// AI makes a move
function aiMove() {
  const aiMoveIndex = bestMove();
  gameBoard[aiMoveIndex] = 'O';
  cells[aiMoveIndex].innerText = 'O';

  if (checkWinner(gameBoard)) {
    statusText.innerText = "AI Wins!";
    isGameActive = false;
    return;
  }

  if (gameBoard.every(cell => cell !== '')) {
    statusText.innerText = "It's a Draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.innerText = "Player X's Turn";
}

// Toggle AI On/Off
function toggleAI() {
  isAIEnabled = !isAIEnabled;
  toggleAIButton.innerText = isAIEnabled ? "Turn AI Off" : "Turn AI On";
  statusText.innerText = isAIEnabled ? "AI's Turn" : "Player X's Turn";
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  isGameActive = true;
  cells.forEach(cell => cell.innerText = '');
}

// Restart the game
function restartGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  isGameActive = true;
  currentPlayer = 'X';
  statusText.innerText = isAIEnabled ? "AI's Turn" : "Player X's Turn";
  cells.forEach(cell => cell.innerText = '');
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
toggleAIButton.addEventListener('click', toggleAI);

statusText.innerText = "Player X's Turn";
