// Initial game setup
let currentPlayer = 'red'; // red starts first
let gameBoard = Array(6).fill().map(() => Array(7).fill(null)); // 6 rows, 7 columns
let aiEnabled = false; // Flag to track whether AI is enabled

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
    if (aiEnabled && currentPlayer === 'yellow') return; // Block player move when AI is playing

    // Find the first available row in the selected column
    for (let row = 5; row >= 0; row--) {
        if (!gameBoard[row][col]) {
            gameBoard[row][col] = currentPlayer;
            updateBoard(row, col); // Update board and pass row/column to update
            if (checkWinner(row, col)) {  // Check if the move results in a win
                document.getElementById('message').innerText = `${currentPlayer} wins!`;
                setTimeout(() => alert(`${currentPlayer} wins!`), 100);
            } else {
                // Only switch players if no one has won
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red'; // Switch player
                if (aiEnabled && currentPlayer === 'yellow') {
                    document.getElementById('message').innerText = "AI's Turn!";
                    aiMove(); // Call AI move if enabled and it's AI's turn
                } else {
                    document.getElementById('message').innerText = "Player's Turn!";
                }
            }
            break;
        }
    }
}

// Update the visual board and trigger falling animation
function updateBoard(row, col) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const r = cell.dataset.row;
        const c = cell.dataset.col;
        if (gameBoard[r][c]) {
            cell.classList.add(gameBoard[r][c]);
            if (r == row && c == col) {
                cell.classList.add('falling'); // Add falling animation class to the cell
            }
        } else {
            cell.classList.remove('red', 'yellow');  // Clear the discs when reset
            cell.classList.remove('falling');  // Remove the falling animation
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

// AI Move (basic AI selects the first available row in a column)
function aiMove() {
    let col = -1;

    // AI will choose the first available column (simple strategy)
    for (let i = 0; i < 7; i++) {
        for (let row = 5; row >= 0; row--) {
            if (!gameBoard[row][i]) {
                col = i;
                gameBoard[row][i] = 'yellow';  // AI places its move
                updateBoard(row, i);  // Update board with AI move
                break;
            }
        }
        if (col !== -1) break;
    }

    // After AI move, check for win or change turn
    if (checkWinner(col, 5)) {  // Check if AI wins
        document.getElementById('message').innerText = "AI wins!";
        setTimeout(() => alert("AI wins!"), 100);
    } else {
        currentPlayer = 'red';  // Switch back to player after AI's move
        document.getElementById('message').innerText = "Player's Turn!";
    }
}

// Toggle the AI on/off
function toggleAI() {
    aiEnabled = !aiEnabled;  // Toggle the AI state
    document.getElementById('message').innerText = aiEnabled ? "AI is now active. Player's Turn!" : "AI is now off. Player's Turn!";
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
