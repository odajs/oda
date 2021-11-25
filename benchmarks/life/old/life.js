import '../../oda.js';
let REFS, ROWS, COLS, FRACTION;
const getCell = (row, col) => { if (REFS['board-' + row]) return REFS['board-' + row][0].getElementById(`${row}-${col}`) }
const isAlive = (row, col) => { return getCell(row, col)?.classList.contains('alive') || false }
const willLive = (row, col) => {
    let neighbours = isAlive(row - 1, col - 1) + isAlive(row - 1, col) + isAlive(row - 1, col + 1)
        + isAlive(row, col - 1) + isAlive(row, col + 1)
        + isAlive(row + 1, col - 1) + isAlive(row + 1, col) + isAlive(row + 1, col + 1);
    return neighbours === 3 || neighbours === 2 && isAlive(row, col);
}
const generateBoardState = (liveFunc) => {
    let stateArray = [];
    for (let row = 0; row < ROWS; row++) {
        let newRow = [];
        for (let col = 0; col < COLS; col++) newRow.push(liveFunc(row, col));
        stateArray.push(newRow);
    }
    for (let row = 0; row < ROWS; row++)
        for (let col = 0; col < COLS; col++) {
            let cell = getCell(row, col);
            if (cell.classList.contains('alive') !== stateArray[row][col]) {
                if (stateArray[row][col]) {
                    cell.classList.add('alive');
                } else cell.classList.remove('alive');
            }
        }
}
const randomBoardState = () => { return generateBoardState(function () { return Math.random() < FRACTION; }); }
ODA({
    is: 'oda-life', template: `
        <style>
            svg rect { fill: white; }
            svg rect.alive { fill: {{colorAlive}}; }
        </style>
        <svg :ref="'board-'+ ri" ~for="r,ri in rows" width="100%" :height="size">
            <rect ~for="c,ci in cols" :id="ri + '-' + ci" :x="ci*size" :y="0" :width="size-1" :height="size-1"/>
        </svg>
    `,
    props: { rows: 90, cols: 190, size: 10, fraction: 0.2, colorAlive: 'gray' },
    attached() {
        setTimeout(() => {
            REFS = this.$refs, ROWS = this.rows, COLS = this.cols, FRACTION = this.fraction;
            randomBoardState();
            const loop = () => {
                setTimeout(() => {
                    requestAnimationFrame(() => loop());
                    generateBoardState(willLive);
                }, 1000 / 30);
            }
            loop();
        }, 100);
    }
})
