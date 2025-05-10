let currentPlayer = 'red'; // red starts first
let gameBoard = Array(6).fill().map(() => Array(7).fill(null)); // 6 rows, 7 columns
let isAI = false; // Initially AI is disabled
let aiPlayer = 'yellow'; // AI plays yellow
let humanPlayer = 'red'; // Human plays red

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
    if (isAI && currentPlayer === aiPlayer) return; // Don't allow human player to click when AI is playing

    // Find the first available row in the selected column
    for (let row = 5; row >= 0; row--) {
        if (!gameBoard[row][col]) {
            gameBoard[row][col] = currentPlayer;
            updateBoard();
            if (checkWinner(row, col)) {  // Check if the move results in a win
                document.getElementById('message').innerText = `${currentPlayer} wins!`;
                setTimeout(() => alert(`${currentPlayer} wins!`), 100);
            } else {
                // Only switch players if no one has won
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red'; // Switch player
                updateTurnDisplay(); // Update turn display
                
                if (currentPlayer === aiPlayer && isAI) {
                    aiMove(); // AI's turn
                }
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
            cell.classList.add(gameBoard[row][col]);  // Add red/yellow class based on player
        } else {
            cell.classList.remove('red', 'yellow');  // Remove any color classes if empty
        }
    });
}

// Update the "Current Turn" display
function updateTurnDisplay() {
    const currentPlayerElement = document.getElementById('current-player');
    currentPlayerElement.innerText = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s`;  // Capitalize first letter (Red's / Yellow's)
    currentPlayerElement.style.color = currentPlayer;  // Change the color of the text (red or yellow)
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

// Minimax algorithm for AI to make a decision
function aiMove() {
    // Ensure the AI only makes a move when it's yellow's turn
    if (currentPlayer !== aiPlayer) return; // Don't let AI play if it's not its turn

    const bestMove = minimax(gameBoard, 4, -Infinity, Infinity, true);
    handleMove(bestMove); // Handle the AI move as if it was a human move
}

// Get available columns for AI to drop a piece
function getAvailableColumns() {
    const availableColumns = [];
    for (let col = 0; col < 7; col++) {
        if (gameBoard[0][col] === null) {
            availableColumns.push(col);
        }
    }
    return availableColumns;
}

// Toggle AI state
function toggleAI() {
    isAI = !isAI;
    const toggleButton = document.getElementById('toggle-ai-btn');
    if (isAI) {
        toggleButton.innerText = 'AI: On';
    } else {
        toggleButton.innerText = 'AI: Off';
    }

    // If the AI is on and it's yellow's turn, let the AI make a move immediately
    if (isAI && currentPlayer === aiPlayer) {
        aiMove();
    }
}

// Initialize the game
createBoard();
updateTurnDisplay();

document.getElementById('toggle-ai-btn').addEventListener('click', toggleAI);

// Minimax function for the AI's decision-making
function minimax(board, depth, alpha, beta, isMaximizingPlayer) {
    const availableColumns = getAvailableColumns();
    if (depth === 0 || availableColumns.length === 0) {
        return evaluateBoard(board); // Return a heuristic evaluation of the board
    }

    let bestMove = availableColumns[0];
    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const col of availableColumns) {
            const row = getAvailableRow(col);
            board[row][col] = aiPlayer;
            const eval = minimax(board, depth - 1, alpha, beta, false);
            board[row][col] = null;
            if (eval > maxEval) {
                maxEval = eval;
                bestMove = col;
            }
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break;  // Beta cutoff
        }
    } else {
        let minEval = Infinity;
        for (const col of availableColumns) {
            const row = getAvailableRow(col);
            board[row][col] = humanPlayer;
            const eval = minimax(board, depth - 1, alpha, beta, true);
            board[row][col] = null;
            if (eval < minEval) {
                minEval = eval;
                bestMove = col;
            }
            beta = Math.min(beta, eval);
            if (beta <= alpha) break;  // Alpha cutoff
        }
    }

    return bestMove;
}

// Evaluate the board (simple heuristic)
function evaluateBoard(board) {
    // For simplicity, the evaluation is based on number of possible connections
    return 0; // Placeholder, can be expanded for better AI behavior
}

// Get the next available row in a column
function getAvailableRow(col) {
    for (let row = 5; row >= 0; row--) {
        if (gameBoard[row][col] === null) {
            return row;
        }
    }
    return -1; // No available row
}
