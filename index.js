const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let field;
let counter = 0;
let isWin = false;

startGame();
addResetListener();

function startGame() {
    let dimension = parseInt(prompt("Введите ширину поля для игры в крестики-нолики:"));

    if (isNaN(dimension) || dimension <= 0)
        alert("Пожалуйста, введите положительное число!");

    field = createSquareArray(dimension);
    renderGrid(dimension);
}

function createSquareArray(size, initialValue = EMPTY) {
    let array = new Array(size);
    for (let i = 0; i < size; i++) {
        array[i] = new Array(size);
        for (let j = 0; j < size; j++) {
            array[i][j] = initialValue;
        }
    }
    return array;
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
    if (field[row][col] !== EMPTY || isWin) return;

    let move = counter % 2 === 0 ? CROSS : ZERO;
    counter++;
    console.log(`Clicked on cell: ${row}, ${col}, move: ${move}`);
    field[row][col] = move;
    renderSymbolInCell(move, row, col);

    if (checkForWinner(row, col, move)) {
        announceWinner(move);
    } else if (counter === field.length * field.length) {
        announceDraw();
    }
}

function checkForWinner(row, col, symbol) {
    const directions = [
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 }
    ];

    for (const direction of directions) {
        let count = 1; // Текущая клетка уже содержит символ
        count += countConsecutive(row, col, direction.dr, direction.dc, symbol);
        count += countConsecutive(row, col, -direction.dr, -direction.dc, symbol);

        if (count >= 3) {
            highlightWinningCells(row, col, direction.dr, direction.dc, symbol);
            return true;
        }
    }

    return false;
}

function countConsecutive(row, col, dr, dc, symbol) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < field.length && c >= 0 && c < field.length && field[r][c] === symbol) {
        count++;
        r += dr;
        c += dc;
    }

    return count;
}

function highlightWinningCells(row, col, dr, dc, symbol) {
    const cells = [];
    let r = row;
    let c = col;

    cells.push({ row: r, col: c });

    r = row + dr;
    c = col + dc;
    while (r >= 0 && r < field.length && c >= 0 && c < field.length && field[r][c] === symbol) {
        cells.push({ row: r, col: c });
        r += dr;
        c += dc;
    }

    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < field.length && c >= 0 && c < field.length && field[r][c] === symbol) {
        cells.push({ row: r, col: c });
        r -= dr;
        c -= dc;
    }

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
    counter = 0;
    isWin = false;
    startGame();
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