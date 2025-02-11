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
            board[i].push(new Cell());
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
        const boardWithCellValues = board.map((cellRow) => {
            return cellRow.map(cell => cell.getValue())
        })
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
** The GameController is responsible for controlling the folow state
** of the game turns as well as the outcome of the game
*/
/*
function GameController () {
    
}
*/
