const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let field = [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]];
let counter = 0;
let isWin = false;

startGame();
addResetListener();

function startGame() {
    renderGrid(3);
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
    if (field[row][col] === ZERO || field[row][col] === CROSS || isWin)
        return;
    let move = counter % 2 === 0 ? CROSS : ZERO;
    counter++;
    console.log(`Clicked on cell: ${row}, ${col}, move: ${move}`);
    field[row][col] = move;
    renderSymbolInCell(move, row, col);
    checkForWinner();
}

function checkForWinner() {
    // Проверка строк
    for (let i = 0; i < 3; i++) {
        if (field[i][0] !== EMPTY && field[i][0] === field[i][1] && field[i][1] === field[i][2]) {
            highlightWinningCells([{row: i, col: 0}, {row: i, col: 1}, {row: i, col: 2}]);
            announceWinner(field[i][0]);
            return;
        }
    }
    // Проверка столбцов
    for (let j = 0; j < 3; j++) {
        if (field[0][j] !== EMPTY && field[0][j] === field[1][j] && field[1][j] === field[2][j]) {
            highlightWinningCells([{row: 0, col: j}, {row: 1, col: j}, {row: 2, col: j}]);
            announceWinner(field[0][j]);
            return;
        }
    }
    // Проверка главной диагонали
    if (field[0][0] !== EMPTY && field[0][0] === field[1][1] && field[1][1] === field[2][2]) {
        highlightWinningCells([{row: 0, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}]);
        announceWinner(field[0][0]);
        return;
    }
    // Проверка побочной диагонали
    if (field[0][2] !== EMPTY && field[0][2] === field[1][1] && field[1][1] === field[2][0]) {
        highlightWinningCells([{row: 0, col: 2}, {row: 1, col: 1}, {row: 2, col: 0}]);
        announceWinner(field[0][2]);
        return;
    }
    // Проверка на ничью
    if (counter === 9) {
        announceDraw();
    }
}

function highlightWinningCells(cells) {
    cells.forEach(cell => {
        const targetCell = findCell(cell.row, cell.col);
        targetCell.style.color = 'red';
    });
}

function announceWinner(winner) {
    alert(`Победил игрок ${winner}!`);
    isWin = true;
}

function announceDraw() {
    alert('Победила дружба!');
    isWin = true;
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    field = [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]];
    counter = 0;
    isWin = false;
    clearField();
    console.log('reset!');
}

function clearField() {
    for (let x = 0; x < field.length; x++) {
        for (let y = 0; y < field[0].length; y++) {
            renderSymbolInCell(EMPTY, x, y);
        }
    }
}

/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
