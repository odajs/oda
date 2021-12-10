ODA({is:'oda-minesweeper',
    template:`
        <style>
            :host{
                /*align-self: center;*/
                @apply --vertical;
                /*@apply --border;*/
            }
        </style>
        <oda-minesweeper-title></oda-minesweeper-title>
        <oda-minesweeper-field></oda-minesweeper-field>
    `,
    get game(){
        return this;
    },
    attached(){
        this.init();
    },

    props:{
        iconSize: {
            default: 48,
        },
        colors:['', 'blue', 'green', 'red', 'magenta'],

        cols:{
            default: 10,
            // save: true
        },
        rows:{
            default: 10,
            // save: true
        },
        mineCount:{
            default: 20,
            // save: true
        },
        borderWidth:{
            default: 4,
            save: true
        }
    },
    model: [],
    init(){
        const model = [];
        for (let x=0; x<this.cols; x++){
            for (let y=0; y<this.rows; y++){
                model.push({x, y})
            }
        }
        for (let i = 0; i <this.mineCount ; i++) {
            let pos;
            do{
                pos = Math.floor(Math.random() * model.length);
                console.log('+')
            } while (model[pos].mine);
            model[pos].mine = true;
        }
        this.model = model;
    },
    bang(){
        this.model.forEach(i=>{
            i.status = (i.mine?'bang':'opened');
        })
    }
})
ODA({is:'oda-minesweeper-title', imports: '@oda/button',
    template:`
        <style>
            :host{
                @apply --horizontal;
                @apply --header;
                align-items: center;
                justify-content: space-between;
                @apply --border;
                border-width: {{borderWidth}}px;
                box-sizing: border-box;
                border-left-color: var(--content-background);
                border-top-color: var(--content-background);
                border-right-color: var(--header-background);
                border-bottom-color: var(--header-background);
            }
        </style>
        <oda-minesweeper-display></oda-minesweeper-display>
        <oda-button @tap="domHost.init()" icon="icons:face"></oda-button>
<!--        <input type="number" ::value="rows">-->
        <oda-minesweeper-display></oda-minesweeper-display>
    `,
})
ODA({is:'oda-minesweeper-field',
    template:`
        <style>
            :host{
                @apply --horizontal;
                @apply --header;
                flex-wrap: wrap;
                width: {{iconSize * cols}}px;
            }
        </style>
<!--        <oda-minesweeper-mine  :icon-size ~for="model" :mine="item" ~style="{maxWidth: iconSize+'px', height: iconSize+'px'}"></oda-minesweeper-mine>-->
        <div ~for="(row, rowIdx) in rows" class="horizontal flex">
            <oda-minesweeper-mine class="no-flex" :icon-size ~for="(col, colIdx) in cols" :mine="model.find(i=>(i.y === rowIdx && i.x === colIdx))" ~style="{width: iconSize+'px', height: iconSize+'px'}"></oda-minesweeper-mine>
        </div>
    `,
})
ODA({is:'oda-minesweeper-mine', imports: '@oda/icon',
    template:`
        <style>
            :host{
                position: relative;
                align-items: center;
                @apply --horizontal;
                outline: 1px dotted white;
            }
            .btn{
                @apply --border;
                border-width: {{borderWidth}}px;
                box-sizing: border-box;
                border-left-color: var(--content-background);
                border-top-color: var(--content-background);
                border-right-color: var(--header-background);
                border-bottom-color: var(--header-background);
                width: 100%;
                height: 100%;
                align-items: center;
                z-index: 1;
                opacity: .8;
            }
            .floor{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0px;
                top: 0px;
                text-align: center;
                font-size: x-large;
                align-items: center;
                font-weight: bolder;
                
            }
        </style>
        <div ~if="count !== 0" class="horizontal floor">
            <span class="flex" ~style="{color: colors[count]}">{{count}}</span>
        </div>
        <button :error="mine?.error && 'bang!!!'" class="flex vertical btn" style="padding: 0px;" ~if="mine?.status !== 'opened'" @tap="onTap" @down="onDown" :icon :icon-size>
            <oda-icon class="flex" :icon :icon-size="iconSize*.5"></oda-icon>
        </button>
    `,
    set mine(n){
        if (n)
            n.el = this;
    },
    get count(){
        if (this.mine.mine) return ''
        let count = 0;
        for (let x = (this.mine.x - 1); x <= (this.mine.x + 1); x++){
            for (let y = (this.mine.y - 1); y <= (this.mine.y + 1); y++) {
                const item = this.model.find(i=>(i.y === y && i.x === x))
                if (!item) continue;
                if (item === this.mine) continue;
                if (!item.mine) continue;
                count++;
            }
        }
        return count;
    },
    get icon(){
        switch (this.mine?.status){
            case 'opened':
                return 'odant:spin';
            case 'locked':
                return 'icons:block';
            case 'bang':
                return 'icons:error';
        }
        return ' ';
    },
    onDown(e){
        if (e.detail.sourceEvent.button > 0){
            if (this.mine.status !== 'locked')
                this.mine.status = 'locked';
            else
                this.mine.status = '';
        }
    },
    onTap(e){
        if (this.mine.status === 'locked')
            return;
        if (this.mine.mine){
            this.mine.error = true;
            this.game.bang();
        }
        else
            this.open();
    },
    open(){
        if (this.mine.status === 'opened') return;
        if (this.mine.mine) return;
        this.mine.status = 'opened';
        if (this.count === 0){
            for (let x = (this.mine.x - 1); x <= (this.mine.x + 1); x++){
                for (let y = (this.mine.y - 1); y <= (this.mine.y + 1); y++) {
                    const item = this.model.find(i=>(i.y === y && i.x === x))
                    if (!item) continue;
                    if (item === this.mine) continue;
                    item.el.open();
                }
            }
        }
    }
})
ODA({is:'oda-minesweeper-display',
    template:`
        <style>
            :host{
                @apply --border;
                border-width: {{borderWidth}}px;
                box-sizing: border-box;
                border-left-color: var(--content-background);
                border-top-color: var(--content-background);
                border-right-color: var(--header-background);
                border-bottom-color: var(--header-background);
            }
        </style
        <div>
            дисплей
        </div>
        
    `
})