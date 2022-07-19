
let count = 0;
ODA({ is: 'oda-dropdown-tester', imports: '@oda/button, @oda/icon, @oda/checkbox, @tools/containers',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                box-sizing: border-box;
            }
            .box {
                left: {{left}}px;
                top: {{top}}px;
                touch-action: none;
            }
            oda-checkbox {
                cursor: pointer;
            }
            oda-button {
                width: 240px; 
                margin: 2px;
                border: 1px solid gray
            }
            .clear {
                position: absolute;
                top: 4px;
                left: calc(50% - 60px);
                width: 120px; 
                z-index: 100;
                background: white;
            }
        </style>
        <button style="width: 100px; margin-left: 12px">{{label}}</-button>
        <oda-button class="clear" @tap="left=clientWidth/2-140;top=20;_lastX=_lastY=undefined">Clear position</oda-button>
        <div class="box vertical" dragable style="border: 1px solid red; padding: 8px; background: lightyellow;
            cursor: move; position: absolute" @pointerdown="_down">
            <label>{{label}}</label>
            <oda-button @tap="run">top</oda-button>
            <oda-button @tap="run">left</oda-button>
            <oda-button @tap="run">right</oda-button>
            <oda-button @tap="run">bottom</oda-button>
            <oda-button @tap="run">modal</oda-button>
            <div class="vertical" style="margin-top: 10px; align-items: left;justify-content: center;">
                <div class="horizontal" style="align-items:center"><oda-checkbox ::value="parent"></oda-checkbox>- Parent</div>
                <div class="horizontal" style="align-items:center"><oda-checkbox ::value="intersect"></oda-checkbox> - Intersect</div>
                <div class="horizontal" style="align-items:center"><oda-checkbox ::value="useParentWidth"></oda-checkbox> - useParentWidth</div>
                <div class="horizontal" style="align-items:center"><oda-checkbox ::value="showTitle"></oda-checkbox> - showTitle</div>
            </div>
        </div>
    `,
    get title() { return this.showTitle ? 'Заголовок' : '' },
    props: {
        label: 'no iFrame',
        left: {
            type: Number,
            default: 10,
            save: true
        },
        top: {
            type: Number,
            default: 50,
            save: true
        },
        parent: {
            type: Boolean,
            save: true
        },
        intersect: {
            type: Boolean,
            save: true
        },
        useParentWidth: {
            type: Boolean,
            save: true
        },
        showTitle: {
            type: Boolean,
            save: true
        },
    },
    get saveKey() { return this.label },
    _down(e) {
        this._lastX = e.pageX;
        this._lastY = e.pageY;
        document.addEventListener("pointermove", this.__doMove ||= this._doMove.bind(this));
        document.addEventListener("pointerup", this.__stopMove ||= this._stopMove.bind(this));
        document.addEventListener("pointercancel", this.__stopMove);
    },
    _doMove(e) {
        this.left += e.pageX - this._lastX;
        this.top += e.pageY - this._lastY;
        this._lastX = e.pageX;
        this._lastY = e.pageY;
    },
    _stopMove() {
        document.removeEventListener("pointermove", this.__doMove);
        document.removeEventListener("pointerup", this.__stopMove);
        document.removeEventListener("pointercancel", this.__stopMove);
    },
    async run(e) {
        e.stopPropagation();
        try {
            const res = await ODA.showDropdown('oda-test-menu', { icon: 'icons:warning', iconSize: 60 }, { animation: 500, parent: this.parent ? e.target : null, intersect: this.intersect, useParentWidth: this.useParentWidth, align: e.target.innerText, icon: 'icons:info', title: 'Block - 0', id: count });
        }
        catch (e) { }
    }
})
ODA({ is: 'oda-test-menu', imports: '@oda/button',
    template: `
        <style>
            :host{
                @apply --vertical;
                align-items: center;
                border: 4px solid red;
                overflow: auto;
            }
            h4 {
                padding: 0 16px;
                margin: 0;
            }
            .lbl:hover {
                background-color: silver;
            }
        </style>
        <h4 ~for="6" class="horizontal center lbl" style="cursor: pointer" @tap.stop="_isOk(index)">
            Запись - {{item}}
            <oda-button :id="'Title - ' + item" @tap.stop="ontap" icon="icons:add" icon-size="32" fill="gray"></oda-button>
        </h4>
        <oda-button :icon-size :icon fill="red"></oda-button>
    `,
    closeAfterOk: true,
    iconSize: 24,
    icon: '',
    async ontap(e) {
        e.stopPropagation();
        try {
            count ||= 0;
            count = +count + 1;
            const res = await ODA.showDropdown('oda-test-menu', { icon: 'icons:warning', iconSize: 60 }, { parent: e.target, animation: 500, align: 'right', title: 'Block - ' + count, icon: 'icons:info', id: count });
        }
        catch (e) { }
    },
    _isOk(e) {
        this.fire('ok', { detail: { index: e, el: this } });
    }
})
