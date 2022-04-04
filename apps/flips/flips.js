import confetti from "https://cdn.skypack.dev/canvas-confetti";
ODA({ is: 'oda-flips', imports: '@oda/icon, @oda/button',
    template: `
        <style>
            :host {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 100%;
                box-sizing: border-box;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            header {
                position: absolute;
                top: 0;
                max-width: 100%;
                min-width: 100%;
                display: flex;
                flex: 1;
                align-items: center;
                border-bottom: 1px solid lightgray;
                padding: 2px;
                z-index: 9;
                max-height: 44px;
                overflow: hidden;
                box-sizing: border-box;
            }
            .txt {
                text-align: center;
                font-size: 22px;
                color: gray;
                white-space:nowrap;
            }
            .board {
                display: flex;
                flex-direction: column;
                align-self: center;
                justify-content: center;
                background-color: lightgray;
                border: 1px solid darkgray;
                width: 95vmin;
                max-height: 95vmin;
                position: relative;
                flex: 1;
                margin: 64px 8px 16px 8px;
                padding: 5px;
                overflow: hidden;
            }
            .row {
                display: flex;
                flex: 1;

            }
            .cell {
                display: flex;
                flex: 1;
                margin: calc(1px + 1vmin/2);
                background-color: transparent;
                perspective: 1000px;
                cursor: pointer;
            }
            .cell-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                position: relative;
                text-align: center;
                transition: transform 0.6s;
                transform-style: preserve-3d;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                border: 1px solid darkgray;
            }
            ._selected .cell-inner {
                transform: rotateY(180deg);
                opacity: 1;
            }
            .cell-front, .cell-back {
                position: absolute;
                width: 100%;
                height: 100%;
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
                font-weight: 500;
            }
            .cell-back {
                background-color: #bbb;
                color: black;
            }
            .cell-front {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                background-color: white;
                transform: rotateY(180deg);
            }
            .odd {
                color: transparent;
                font-size: 0;
                opacity: 1;
                background-size: cover;
                background-repeat: no-repeat;
            }
            .solved {
                opacity: {{end ? 1 : .3}};
            }
            .cell:hover .cell-inner {
                transform: {{babyMode ? "rotateY(180deg)" : ""}};
            }
            .cell-front, .cell-back {
                font-size: {{14 + this.fontSize - 100 <= 14 ? 14 : 14 + this.fontSize - 100}}px;
            }
        </style>
        <header>
            <oda-button icon="icons:remove" icon-size=24 @tap="--row;init()"></oda-button><div class="txt">{{row}}</div><oda-button icon="icons:add" icon-size=24  @tap="++row;init()"></oda-button>
            <oda-button icon="icons:remove" icon-size=24 @tap="--column;init()" style="margin-left: 8px"></oda-button><div class="txt">{{column}}</div><oda-button icon="icons:add" icon-size=24  @tap="++column;init()"></oda-button>
            <div style="display: flex; flex-direction: column; flex: 1; width: 100%">
                <div class="txt" style="width: 100%; ">flips - {{mode}}</div>
                <div style="display: flex; width: 100%; justify-content: center; align-items: center">
                    <div style="color: green; flex: 1; text-align: right; font-weight: 600; opacity: .5">{{isOk || '0'}}</div>
                    <div style="padding: 0 4px"> : </div>
                    <div style="color: red; flex: 1; font-weight: 600; opacity: .5">{{isError || '0'}}</div>
                </div>
            </div>
            <oda-button icon="icons:face" icon-size=24 @tap="babyMode = !babyMode" title="baby mode" allow-toggled :toggled="babyMode" style='margin: 0 8px 0 44px'></oda-button>
            <oda-button icon="icons:extension" icon-size=24 @tap="setMode" title="mode" style="margin-right: 8px"></oda-button>
            <oda-button icon="icons:refresh" icon-size=24 @tap="document.location.reload()" title="refresh" style="margin-right: 8px"></oda-button>
        </header>
        <div  id="board" class="board" @click.stop>
            <div ~for="rw in [...Array(+row).keys()]" class="row">
                <div ~for="col in [...Array(+column).keys()]" class="cell" ~class="{_selected: (solved.includes(column * rw + col)) || (column * rw + col) === card1?.id || (column * rw + col) === card2?.id, solved: solved.includes(column * rw + col)}"
                        @click.stop="ontap($event, (column * rw + col), cards?.[(column * rw + col)])">
                    <div class="cell-inner">
                        <div class="cell-front" ~style="{color: 'hsla(' + (cards?.[column * rw + col]?.c || 0) + ', 60%, 50%, 1)'}">
                            <div ~is="mode === 'images' || mode === 'colors' ||(column * rw + col) === odd? 'img' : 'div'" :src="cards?.[(column * rw + col)]?.v || './icon.png'" style="max-width: 100%; max-height: 100%;">{{cards?.[(column * rw + col)]?.v}}</div>
                        </div>
                        <div class="cell-back" style="display: flex; align-items: center; justify-content: center">
                            <img ~if="(column * rw + col) === odd" src="./icon.png" style="max-width: 100%;max-height: 100%;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        row: { default: 3, save: true, category: 'settings' },
        column: { default: 3, save: true, category: 'settings' },
        mode: { default: 'images', save: true, category: 'settings' },
        timeToClose: { default: 750, category: 'settings' },
        babyMode: { default: false, save: true, category: 'settings' },
    },
    fontSize: 32, isOk: 0, isError: 0, step: 0, cards: [], card1: {}, card2: {}, solved: [], end: false,
    get odd() { return (this.row * this.column) % 2 === 0 ? '' : Math.floor(this.row * this.column / 2) },
    _fontSize() { return Math.min(this.$('#board')?.offsetWidth / this.column + this.column * 4, this.$('#board')?.offsetHeight / this.row + this.row * 4) },
    listeners: {
        resize(e) { this.fontSize = this._fontSize() }
    },
    attached() {
        setTimeout(() => this.init(), 100);
    },
    init() {
        this.row = this.row < 2 ? 2 : this.row > 10 ? 10 : this.row;
        this.column = this.column < 2 ? 2 : this.column > 10 ? 10 : this.column;
        this._confetti && clearInterval(this._confetti);
        this.fontSize = this._fontSize();
        this.isOk = this.isError = 0;
        this.card1 = this.card2 = undefined;
        this.solved = [];
        this.cards = [];
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        const rusAlphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
        const digital1_9 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const images = [];
        let url = this.$url.replace('flips.js', 'cards/cards-');
        for (let i = 1; i <= 140; i++) { images.push(url + (i < 10 ? '00' + i : i < 100 ? '0' + i : i) + '.jpg') }
        const colors = [];
        url = this.$url.replace('flips.js', 'colors/colors-');
        for (let i = 1; i <= 12; i++) { colors.push(url + (i < 10 ? '00' + i : i < 100 ? '0' + i : i) + '.jpg') }
        let length = (this.row * this.column) - (this.odd ? 1 : 0);
        this.step = 360 / (length / 2);
        const mode = { images, '1...9': digital1_9, 'ABC...': alphabet, 'АБВ...': rusAlphabet, colors };
        const arr = mode[this.mode] || images;
        let unique = [];
        const uniqueCards = [];
        for (let i = 0; i < length / 2; i++) {
            const color = i * this.step;
            if (this.mode === 'digital') {
                uniqueCards.push({ v: i, c: color }, { v: i, c: color })
            }
            else {
                if (unique.length === 0) {
                    unique = [...Array(arr.length).keys()];
                }
                const randomNumber = Math.floor(Math.random() * unique.length);
                const random = arr[unique[randomNumber]];
                uniqueCards.push({ v: random, c: color }, { v: random, c: color })
                unique[randomNumber] = unique[unique.length - 1];
                unique.pop();
            }
        }
        this.cards = [];
        while(uniqueCards.length !== 0) {
            const randomNumber = Math.floor(Math.random() * uniqueCards.length);
            this.cards.push(uniqueCards[randomNumber]);
            uniqueCards[randomNumber] = uniqueCards[uniqueCards.length - 1];
            uniqueCards.pop();
        }
        //this.cards = this.cards.sort(() => Math.random() - 0.5);
        if (this.odd) this.cards.splice(this.odd, 0, -1);
    },
    setMode() {
        const mode = ['images', '1...9', 'digital', 'ABC...', 'АБВ...', 'colors'];
        let idx = mode.indexOf(this.mode);
        idx = ++idx >= mode.length ? 0 : idx;
        this.mode = mode[idx];
        this.init();
    },
    ontap(e, id, value) {
        if (id === this.odd || this.solved.includes(id) || this.card1?.id === id || value.v < 0) return;
        this.tapEffect ||= new Audio('./audio/click.mp3');
        this.tapEffect.volume = 0.2;
        this.tapEffect.play();
        if (!this.card1) this.card1 = { id, value };
        else if (!this.card2) {
            this.card2 = { id, value };
            const color = this.mode === 'images' || this.mode === 'colors' || this.card1.value.c === this.card2.value.c;
            if (this.card1.value.v === this.card2.value.v && color) {
                this.solved ||= [];
                setTimeout(() => {
                    ++this.isOk;
                    this.solved.push(this.card1.id, this.card2.id);
                    this.card1 = this.card2 = undefined;
                    this.end = this.solved.length >= this.cards.length - (this.odd ? 2 : 0);
                    if (this.end) {
                        this.endEffect ||= new Audio('./audio/end.mp3');
                        this.endEffect.volume = 0.2;
                        this.endEffect.play();
                        function randomInRange(min, max) { return Math.random() * (max - min) + min }
                        this._confetti = setInterval(() =>
                            confetti({
                                angle: randomInRange(30, 150), spread: randomInRange(50, 70),
                                particleCount: randomInRange(50, 100), origin: { y: .55 }
                            }), 600);
                        setTimeout(() => this._confetti && clearInterval(this._confetti), 2000);
                    } else {
                        this.okEffect ||= new Audio('./audio/ok.mp3');
                        this.okEffect.volume = 0.5;
                        this.okEffect.play();
                    }
                }, this.timeToClose);
            } else {
                this.errEffect ||= new Audio('./audio/error.mp3');
                this.errEffect.volume = 0.075;
                this.errEffect.play();
                ++this.isError;
                setTimeout(() => this.card1 = this.card2 = undefined, this.timeToClose);
            }
        }
    }
})
