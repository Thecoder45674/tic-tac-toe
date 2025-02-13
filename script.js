/*
** The GameBoard represents the state of the board
** Each square holds a Cell
** and exposes placeMove method to add Cells to the square
*/
function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Populate the board with new Cell instances
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        };
    };

    // Function to return the board
    const getBoard = () => board;

    // Function to place move in cell
    const placeMove = (row, column, player) => {
        const cell = board[row][column];

        if (cell.getValue() !== 0) {
            return;
        }
        cell.addMove(player);
    }

    return { getBoard, placeMove};
};

/*
** A Cell represents one square on the board and can have one of
0: no token currently in square
1: Player One token
2: Player Two token 
*/
function Cell() {
    let value = 0;

    // Accept player moves to change the value of the cell
    const addMove = (player) => {
        value = player;
    }

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
    
    return { addMove, getValue };
};

/*
** The GameController is responsible for controlling the flow state
** of the game turns as well as the outcome of the game
*/
function GameController (playerOneName, playerTwoName) {
    const board = GameBoard();
    const players = [
        { name: playerOneName, token: 1}, 
        { name: playerTwoName, token: 2}
    ];
    let activePlayer = players[0];

    //  Function to switch the active player
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    // Check if the game is over
    const isGameOver = () => {
        const currentBoard = board.getBoard();
        return checkForWinner(currentBoard) || isDraw((currentBoard));
    };

    const getBoard = () => board.getBoard();

    const checkForWinner = (board) => {
        // Check rows and columns for a winner
        for (let i = 0; i < 3; i++) {
            if (board[i][0].getValue() && board[i][0].getValue() === board[i][1].getValue() 
                && board[i][1].getValue() === board[i][2].getValue()) return true; // Row winner

            if (board[0][i].getValue() && board[0][i].getValue() === board[1][i].getValue() 
                && board[1][i].getValue() === board[2][i].getValue()) return true; // Column winner
        }
        // Check diagonals for a winner
        if (board[0][0].getValue() && board[0][0].getValue() === board[1][1].getValue() 
            && board[1][1].getValue() === board[2][2].getValue()) return true; // Diagonal winner
        
        if (board[0][2].getValue() && board[0][2].getValue() === board[1][1].getValue() 
            && board[1][1].getValue() === board[2][0].getValue()) return true; // Diagonal winner
        return false; // No winner
    };

    // Function to check if the game is a draw
    const isDraw = (board) => 
        board.every(row => row.every(cell => cell.getValue() !== 0)) && !checkForWinner(board);

    const playRound = (row, column) => {
        if (!isGameOver()) {
            board.placeMove(row, column, getActivePlayer().token);
            if (!isGameOver()) {
                switchPlayerTurn();
            }
        }
    }

    return { playRound, getActivePlayer, getBoard, isGameOver, checkForWinner};
}

function ScreenController() {
    const game = GameController("Player 1", "Player 2");
    const textDiv = document.querySelector(".text");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        // Clear the board
        boardDiv.textContent = "";

        // Get the latest board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Check if the game is over and display appropriate message
        if (game.isGameOver()) {
            if (game.checkForWinner(board)) {
                textDiv.textContent = `${activePlayer.name} wins!`; // Player wins
            } else {
                textDiv.textContent = "It's a draw!"; // Game draw
            }
            return; // Stop further updates
        }

        // Display player's turn
        textDiv.textContent = `${activePlayer.name}'s turn`;

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.column = colIndex;
                cellButton.dataset.row = rowIndex;

                cellButton.textContent = cell.getValue();
                
                boardDiv.appendChild(cellButton);
            });
        });
    };

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        // Ensure a valid selection
        if (selectedColumn === undefined || selectedRow === undefined || game.isGameOver()) return;

        game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();
};

ScreenController();