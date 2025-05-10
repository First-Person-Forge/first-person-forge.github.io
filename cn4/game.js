let currentPlayer = 'red'; // red starts first
let gameBoard = Array(6).fill().map(() => Array(7).fill(null)); // 6 rows, 7 columns
let isAI = false; // Initially AI is disabled
let aiPlayer = 'yellow'; // AI will play yellow
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
            cell.classList.add(gameBoard[row][col]);
        } else {
            cell.classList.remove('red', 'yellow');  // Clear the discs when reset
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
    const bestMove = minimax(gameBoard, 4, -Infinity, Infinity, true);
    handleMove(bestMove);
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, alpha, beta, isMaximizingPlayer) {
    const availableColumns = getAvailableColumns();
    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;
    let bestCol = null;

    if (depth === 0 || checkGameOver()) {
        return evaluateBoard(board); // Return the score of the board
    }

    for (let col of availableColumns) {
        const row = getAvailableRow(col);
        board[row][col] = isMaximizingPlayer ? aiPlayer : humanPlayer;

        const score = minimax(board, depth - 1, alpha, beta, !isMaximizingPlayer);

        board[row][col] = null; // Undo the move

        if (isMaximizingPlayer) {
            if (score > bestScore) {
                bestScore = score;
                bestCol = col;
            }
            alpha = Math.max(alpha, score);
        } else {
            if (score < bestScore) {
                bestScore = score;
                bestCol = col;
            }
            beta = Math.min(beta, score);
        }

        if (beta <= alpha) break; // Alpha-beta pruning
    }

    if (depth === 4) {
        return bestCol; // Return the best column at the top level
    }

    return bestScore; // Return the best score at deeper levels
}

// Evaluate the board: +10 for AI win, -10 for human win, 0 for a draw or non-terminal state
function evaluateBoard(board) {
    let score = 0;

    // Check if AI is winning
    if (checkWinnerForPlayer(aiPlayer)) {
        score += 100;
    }

    // Check if human is winning
    if (checkWinnerForPlayer(humanPlayer)) {
        score -= 100;
    }

    // Look for potential threats and opportunities
    score += evaluateCenterControl(board);
    score += evaluatePotentialWins(board, aiPlayer);
    score -= evaluatePotentialWins(board, humanPlayer);

    return score;
}

// Check if a player has won
function checkWinnerForPlayer(player) {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === player) {
                if (checkDirection(row, col, 1, 0) || // Horizontal
                    checkDirection(row, col, 0, 1) || // Vertical
                    checkDirection(row, col, 1, 1) || // Diagonal /
                    checkDirection(row, col, 1, -1)) { // Diagonal \
                    return true;
                }
            }
        }
    }
    return false;
}

// Evaluate center control (more control over the center is better)
function evaluateCenterControl(board) {
    let score = 0;
    // Center column is most valuable (column 3)
    for (let row = 0; row < 6; row++) {
        if (board[row][3] === aiPlayer) {
            score += 3;
        }
        if (board[row][3] === humanPlayer) {
            score -= 3;
        }
    }
    return score;
}

// Evaluate potential winning moves
function evaluatePotentialWins(board, player) {
    let score = 0;
    // Check for opportunities to complete a 3-in-a-row or block the opponent
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === player) {
                if (checkDirection(row, col, 1, 0) || // Horizontal
                    checkDirection(row, col, 0, 1) || // Vertical
                    checkDirection(row, col, 1, 1) || // Diagonal /
                    checkDirection(row, col, 1, -1)) { // Diagonal \
                    score += 5;
                }
            }
        }
    }
    return score;
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

// Get the available row in a column
function getAvailableRow(col) {
    for (let row = 5; row >= 0; row--) {
        if (gameBoard[row][col] === null) {
            return row;
        }
    }
    return -1;
}

// Check if the game is over (either AI or human wins)
function checkGameOver() {
    return checkWinnerForPlayer(aiPlayer) || checkWinnerForPlayer(humanPlayer) || getAvailableColumns().length === 0;
}

// Toggle AI state
function toggleAI() {
    isAI = !isAI;
    const toggleButton = document.getElementById('toggle-ai-btn');
    if (isAI) {
        toggleButton.innerText = 'Disable AI';  // Change button text
        document.getElementById('message').innerText = 'AI is now active!';
        if (currentPlayer === aiPlayer) {
            aiMove(); // If AI is active and it’s its turn, make it play
        }
    } else {
        toggleButton.innerText = 'Activate AI';  // Change button text
        document.getElementById('message').innerText = 'AI is now disabled! You are playing against another player.';
    }
}

// Reset the game
function resetGame() {
    gameBoard = Array(6).fill().map(() => Array(7).fill(null));  // Reset game board
    currentPlayer = 'red';  // Reset to red's turn
    updateBoard();  // Update the visual grid
    document.getElementById('message').innerText = '';  // Clear any win message
    updateTurnDisplay(); // Reset the current player display
}

// Initialize the game
createBoard();
updateTurnDisplay(); // Show the initial turn (Red's turn)

// Attach toggleAI to the button
document.getElementById('toggle-ai-btn').addEventListener('click', toggleAI);

// Attach resetGame to the restart button
document.getElementById('reset-btn').addEventListener('click', resetGame);
