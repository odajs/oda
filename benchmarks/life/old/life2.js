import '../../oda.js';
let ROWS, COLS, FRACTION, BOARD = [], _BOARD = [], first = true;
const isAlive = ((row, col) => { return BOARD && BOARD[row] && BOARD[row][col] && BOARD[row][col].alive || false });
const liveNighbourCount = (row, col) => {
    return isAlive(row - 1, col - 1) + isAlive(row - 1, col) + isAlive(row - 1, col + 1)
        + isAlive(row, col - 1) + isAlive(row, col + 1)
        + isAlive(row + 1, col - 1) + isAlive(row + 1, col) + isAlive(row + 1, col + 1);
}
const willLive = (row, col) => {
    let neighbours = liveNighbourCount(row, col);
    return neighbours === 3 || neighbours === 2 && isAlive(row, col);
}
const generateBoardState = (liveFunc) => {
    _BOARD = [];
    for (let row = 0; row < ROWS; row++) {
        let newRow = []
        for (let col = 0; col < COLS; col++) newRow.push({ alive: liveFunc(row, col) });
        _BOARD.push(newRow);
        if (first) BOARD.push(newRow);
    }
    first = false;
    for (let row = 0; row < ROWS; row++)
        for (let col = 0; col < COLS; col++) {
            BOARD[row][col].alive = _BOARD[row][col].alive;
        }
}
const randomBoardState = () => { return generateBoardState(function () { return Math.random() < FRACTION }) }
ODA({
    is: 'oda-life', template: `
        <svg :width="cols * size" :height="rows * size">
            <g ~for="row, ri in rows">
                <rect ~for="col, ci in cols" :x="ci*size" :y="ri*size" :width="size-1" :height="size-1" :fill="_getFill(ri, ci)"/>
            </g>
        </svg>
    `,
    props: {
        rows: 90,
        cols: 190,
        size: 10,
        fraction: 0.2,
        colorAlive: 'gray',
        usejson: {
            default: false,
            reflectToAttribute: true
        }
    },
    _getFill(row, col) {
        let _cell = BOARD[row][col];
        return _cell.alive ? this.colorAlive : 'white';
    },
    attached() {
        ROWS = this.rows, COLS = this.cols, FRACTION = this.fraction;
        if (this.usejson) {
            fetch('./data.json')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    BOARD = data;
                    this._isLoad = true;
                });
        } else {
            randomBoardState();
            this._isLoad = true;
        }
        const loop = () => {
            setTimeout(() => {
                requestAnimationFrame(() => loop());
                this.render();
                generateBoardState(willLive);
            }, 1000 / 30);
        }
        loop();
    }
})
