ODA({is:'oda-minesweeper',
    template:`
        <style>
            :host{
                align-self: center;
                @apply --vertical;
                @apply --border;
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
        iconSize: 100,
        cols:{
            default: 10,
            // save: true
        },
        rows:{
            default: 10,
            // save: true
        },
        mineCount:{
            default: 30,
            // save: true
        },
    },
    model: [],
    init(){
        const model = [];
        for (let x=0; x<this.rows; x++){
            for (let y=0; y<this.cols; y++){
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
                @apply --border;
                @apply --horizontal;
                align-items: center;
                justify-content: space-between;
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
    `
})
ODA({is:'oda-minesweeper-mine', imports: '@oda/button',
    template:`
        <style>
            :host{
                position: relative;
            }
            oda-button{
                @apply --border;
            }
            .floor{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0px;
                top: 0px;
                text-align: center;
                font-size: xxx-large;
            }
        </style>
        <span ~if="mine?.status === 'opened'" class="floor">{{count}}</span>
        <oda-button class="content" style="padding: 0px;" ~if="mine?.status !== 'opened'" @tap="onTap" @down="onDown" :icon :icon-size></oda-button>
        
    `,
    mine: null,
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
            case 'opened':{
                return 'odant:spin';
            }
            case 'locked':{
                return 'odant:spin';
            }
            case 'bang':{
                return 'icons:error';
            }
        }
        return ' ';
    },
    onDown(e){
        if (e.detail.sourceEvent.button>0){
            if (this.mine.status !== 'locked')
                this.mine.status = 'locked';
            else
                this.mine.status = '';
        }

    },
    onTap(e){
        if (this.mine.status === 'locked')
            return;
        if (this.mine.mine)
            this.game.bang();
        else
            this.mine.status = 'opened';
    }
})
ODA({is:'oda-minesweeper-display',
    template:`
    дисплей 
`
})