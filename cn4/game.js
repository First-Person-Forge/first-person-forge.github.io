// game.js

// Initial game setup
let currentPlayer = 'red'; // red starts first
let gameBoard = Array(6).fill().map(() => Array(7).fill(null)); // 6 rows, 7 columns

// Create the game board dynamically
function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';  // Clear the existing grid
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => handleMove(col));
            board.appendChild(cell);
        }
    }
}

// Handle a move when a player clicks on a column
function handleMove(col) {
    // Find the first available row in the selected column
    for (let row = 5; row >= 0; row--) {
        if (!gameBoard[row][col]) {
            gameBoard[row][col] = currentPlayer;
            updateBoard();
            if (checkWinner(row, col)) {  // Check if the move results in a win
                document.getElementById('message').innerText = `${currentPlayer} wins!`;
                setTimeout(() => alert(`${currentPlayer} wins!`), 100);
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red'; // Switch player
            }
            break;
        }
    }
}

// Update the visual board
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        if (gameBoard[row][col]) {
            cell.classList.add(gameBoard[row][col]);
        } else {
            cell.classList.remove('red', 'yellow');  // Remove any color if the cell is empty
        }
    });
}

// Check if there's a winner
function checkWinner(row, col) {
    if (checkDirection(row, col, 1, 0) || // Horizontal
        checkDirection(row, col, 0, 1) || // Vertical
        checkDirection(row, col, 1, 1) || // Diagonal /
        checkDirection(row, col, 1, -1)) { // Diagonal \
        return true;
    }
    return false;
}

// Check a given direction for a winning condition
function checkDirection(row, col, rowDir, colDir) {
    let count = 1;
    let r = row + rowDir;
    let c = col + colDir;
    
    // Check one direction
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && gameBoard[r][c] === currentPlayer) {
        count++;
        r += rowDir;
        c += colDir;
    }
    
    r = row - rowDir;
    c = col - colDir;

    // Check the other direction
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && gameBoard[r][c] === currentPlayer) {
        count++;
        r -= rowDir;
        c -= colDir;
    }

    return count >= 4;
}

// Reset the game
function resetGame() {
    gameBoard = Array(6).fill().map(() => Array(7).fill(null));  // Reset game board
    currentPlayer = 'red';  // Reset to red's turn
    updateBoard();  // Update the visual grid
    document.getElementById('message').innerText = '';  // Clear any win message
}

// Initialize the game
createBoard();
