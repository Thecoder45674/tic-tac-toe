/* 
** The GameBoard represents the stat of the board
** Each square holds a Cell
** and expose placeToken method to  be able add Cells to square
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

    // Function to place token in cell
    const placeToken = (row, column, player) => {
        const cell = board[row][column];

        if (cell.getValue() !== 0) {
            console.log('Cell is already occupied!');
            return;
        }
        cell.addToken(player);
    }

    // Function to  print the board
    const printBoard = () => {
        const boardWithCellValues = 
            board.map(cellRow => cellRow.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return { getBoard, placeToken, printBoard };
};

/*
 A Cell represents one square on the board and can have one off
0: no token currently in square
1: Player One token
2: Player Two token 
*/
function Cell() {
    let value = 0;

    // Accept player tokes to cahnge value of the cell
    const addToken = (player) => {
        value = player;
    }

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
    
    return {addToken, getValue};
};

/*
** The GameController is responsible for controlling the flow state
** of the game turns as well as the outcome of the game
*/
function GameController (playerOneName, playerTwoName) {
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            token: 1
        }, 
        {
            name: playerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;
    let gameActive = true;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkForWinner = (board) => {
        // Check rows and columns for a winner
        for (let i = 0; i < 3; i++) {
            if (board[i][0].getValue() && board[i][0].getValue() === board[i][1].getValue() && board[i][1].getValue() === board[i][2].getValue()) return true; // Row winner
            if (board[0][i].getValue() && board[0][i].getValue() === board[1][i].getValue() && board[1][i].getValue() === board[2][i].getValue()) return true; // Column winner
        }
        // Check diagonals for a winner
        if (board[0][0].getValue() && board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) return true; // Diagonal winner
        if (board[0][2].getValue() && board[0][2].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][0].getValue()) return true; // Diagonal winner
        return false; // No winner
    };

    // Function to check if the game is a draw
    const isDraw = (board) => 
        board.every(row => row.every(cell => cell.getValue() !== 0)) && !checkForWinner(board);
}

