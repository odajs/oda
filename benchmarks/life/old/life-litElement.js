import { LitElement, html, css, svg } from 'https://cdn.pika.dev/lit-element';

let ROWS, COLS, FRACTION, BOARD = [], _BOARD = [], first = true;
const isAlive = ((row, col) => { return BOARD && BOARD[row] && BOARD[row][col] && BOARD[row][col].alive || false });
const willLive = (row, col) => {
    const neighbours = isAlive(row - 1, col - 1) + isAlive(row - 1, col) + isAlive(row - 1, col + 1)
        + isAlive(row, col - 1) + isAlive(row, col + 1)
        + isAlive(row + 1, col - 1) + isAlive(row + 1, col) + isAlive(row + 1, col + 1);
    return neighbours === 3 || neighbours === 2 && isAlive(row, col);
}
const generateBoardState = (liveFunc = willLive) => {
    if (first) liveFunc = () => { return Math.random() < FRACTION };
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

customElements.define('lit-life', class LitLife extends LitElement {
    static get properties() {
        return {
            // rows: { type: Number },
            // cols: { type: Number },
            // size: { type: Number },
            // fraction: { type: Number }
        }
    }

    constructor() {
        super();
        ROWS = this.rows = 90;
        COLS = this.cols = 190;
        FRACTION = this.fraction = 0.2;
        this.size = 10;
    }

    static get styles() {
        return css`
            svg rect { fill: #f0f0f0; }
            svg rect.alive { fill: #777; }
        `;
    }

    render() {
        return html`
            <svg width="${this.cols * this.size}" height="${this.rows * this.size}">
                ${BOARD.map((row, r) =>
                    svg`<g>
                        ${row.map((col, c) => svg`<rect class="${col.alive ? 'alive' : ''}" x="${c * this.size}" y="${r * this.size}" width="${this.size-1}" height="${this.size-1}"/>`)}
                    </g >`
                )}
            </svg>
        `;
    }

    firstUpdated() {
        super.firstUpdated();
        this.loop();
    }

    loop() {
        generateBoardState();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => this.requestUpdate());
            setTimeout(() => { requestAnimationFrame(() => this.loop()) }, 1000 / 60);
        })
    }
})
