ODA({ is: 'oda-color-picker-oklch',
    template: `
        <style>
            :host {
                @apply --horizontal;
                @apply --border;
                @apply --shadow;
                position: relative;
                max-width: {{width + (showPalette ? height - 6 : 0)}}px;
                width: {{width + (showPalette ? height - 6 : 0)}}px;
                height: {{height}}px;
            }
            label {
                width: 18px;
                text-align: center;
            }
            input {
                @apply --flex;
                border: none;
                outline: none;
            }
            .color-ranges {
                align-items: center;
                margin: 2px;
                font-size: 14px;
            }
            .color-ranges input {
                appearance: none;
                height: {{rangeH}}px;
                width: 100%;
                border-radius: 8px;
                box-shadow: inset 0px 0px 15px 5px rgba(0, 0, 0, 0.1);
            }
            input::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: {{rangeH-4}}px;
                height: {{rangeH-4}}px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
            }
            input.lightness {
                background: linear-gradient(90deg, oklch(0 {{c}} {{h}}) 0%, oklch(1 {{c}} {{h}}) 100%);
            }
            input.chroma {
                background: linear-gradient(90deg, oklch({{l}} 0 {{h}}) 0%, oklch({{l}} .37 {{h}}) 100%);
            }
            input.hue {
                background: linear-gradient(90deg, oklch({{l}} {{c}} 0) 0%, oklch({{l}} {{c}} 36) 10%,oklch({{l}} {{c}} 72) 20%, oklch({{l}} {{c}} 108) 30%, oklch({{l}} {{c}} 144) 40%, oklch({{l}} {{c}} 180) 50%, oklch({{l}} {{c}} 216) 60%, oklch({{l}} {{c}} 252) 70%, oklch({{l}} {{c}} 288) 80%, oklch({{l}} {{c}} 324) 90%, oklch({{l}} {{c}} 360) 100%);
            }
            input.alpha {
                background: linear-gradient(90deg, oklch({{l}} {{c}} {{h}} / 0) 0%, oklch({{l}} {{c}} {{h}} / 1) 100%);
            }
            .palette {
                box-sizing: border-box;
                width: {{height - 6}};
                max-height: {{height - 6}};
                height: {{height - 6}};
            }
            .cell {
                box-sizing: border-box;
                cursor: pointer;
                width: {{(height - 10) / 10}}px;
                height: {{(height - 10) / 10}}px;
            }
        </style>
        <div class="vertical" ~style="{minWidth: (width) - 8 + 'px'}" style="margin: 4px; border-radius: 4px;">
            <div class="horizontal flex border">
                <div style="width: 30%; height: 100%; cursor: pointer" ~style="{background: _value || value}" @tap="_value=value"></div>
                <div class="flex" style="cursor: pointer" ~style="{backgroundColor: value}" @tap="_value=''"></div>
            </div>
            <input id="inp" class="no-flex border" type="text" :value="value" style="padding: 2px; font-size: 15px; margin: 4px 0; text-align: center;" @change="setValue">
            <div class="color-ranges h">
                <label>l</label>
                <input type="range" class="lightness" ::value="l" min="0" max="1" step="0.01">
            </div>
            <div class="color-ranges h">
                <label>c</label>
                <input type="range" class="chroma" ::value="c" min="0" max="0.37" step="0.001">
            </div>
            <div class="color-ranges h">
                <label>h</label>
                <input type="range" class="hue" ::value="h" min="0" max="360" step="1">
            </div>
            <div class="color-ranges h" style="margin-bottom: 4px;">
                <label>a</label>
                <input type="range" class="alpha" ::value="a" min="0" max="1" step="0.01">
            </div>
            <div class="color-input vertical">
                <div ~if="storeLength > 0" class="vertical flex" style="cursor: pointer">
                    <div class="horizontal flex" style="width: 100%">
                        <div ~for="storeLength" class="border" style="width: 100%; height: 16px;margin-right: 2px; margin-bootom: 1px;" @mousedown="_storeDown($event, $for.index)" @pointerup="_storeUp($event, $for.index)" ~style="{background: store?.['s'+$for.index] || ''}"></div>
                    </div>
                    <div class="horizontal flex">
                        <div ~for="storeLength" class="border" style="width: 100%; height: 16px;margin-right: 2px; margin-top: 1px;" @mousedown="_storeDown($event, $for.index+storeLength)" @pointerup="_storeUp($event, $for.index+storeLength)" ~style="{background: store?.['s'+($for.index+storeLength)] || ''}"></div>
                    </div>
                </div>
                <div class="horizontal" style="justify-content: flex-end; margin: 4px 1px 1px 1px;">
                    <oda-button icon="carbon:clean" class="border" style="margin-right: 4px; padding: 4px; border-radius: 4px;" :flex="storeLength===0" @tap="_clear" title="clear history"></oda-button>
                    <oda-button icon="carbon:color-palette" class="border" style="margin-right: 4px; padding: 4px; border-radius: 4px;" :flex="storeLength===0" @tap="_showPalette" title="show / hide palette"></oda-button>
                    <oda-button class="border" style="margin-right: 4px; padding: 4px; border-radius: 4px;" :flex="storeLength===0" @tap="_cancel">Cancel</oda-button>
                    <oda-button class="border" style="padding: 4px; border-radius: 4px;" :flex="storeLength===0" @tap="_ok">Ok</oda-button>
                </div>
            </div>
        </div>
        <div ~if="showPalette" class="palette horizontal center" style="flex-wrap: wrap; ">
            <div ~for="100" class="cell" ~style="{borderBottom: $for.index<90 ? '1px solid lightgray' : '', borderRight: ($for.index+1)%10 ? '1px solid lightgray' : '', background: 'oklch(' + ($for.index / 100) + ' ' + c + ' ' + h + ' / ' + (a >= 0 ? a : 1) + ')'}" @click="l = $for.index / 100"></div>
        </div>
    `,
    $public: {
        showPalette: {
            $def: false,
            $save: true
        },
        rangeH: {
            $def: 22,
            $save: true
        },
        l: {
            $def: 0,
            set(n) { this.refreshValue() },
            $save: true
        },
        c: {
            $def: 0,
            set(n) { this.refreshValue() },
            $save: true
        },
        h: {
            $def: 0,
            set(n) { this.refreshValue() },
            $save: true
        },
        a: {
            $def: .5,
            set(n) { this.refreshValue() },
            $save: true
        },
        width: {
            $def: 220,
            $save: true
        },
        height: {
            $def: 300,
            $save: true
        },
        storeLength: {
            $def: 10,
            $save: true
        },
        value: {
            $def: '',
            get() {
                if (this.a >= 0 && this.a < 1)
                    return `oklch(${this.l} ${this.c} ${this.h} / ${this.a})`;
                return `oklch(${this.l} ${this.c} ${this.h})`;
            }
        },
        _value: '',
        clickTime: 500
    },
    store: {
        $def: undefined,
        $save: true
    },
    attached() {
        this._init();
        this.isReady = true;
    },
    _init() {
        this.store ||= {};
        this.store['s5'] ||= 'oklch(0 0 0)';
        this.store['s6'] ||= 'oklch(.321 0 0)';
        this.store['s7'] ||= 'oklch(.510 0 0)';
        this.store['s8'] ||= 'oklch(.683 0 0)';
        this.store['s9'] ||= 'oklch(.845 0 0)';
        this.store['s15'] ||= 'oklch(0.63 0.26 29)';
        this.store['s16'] ||= 'oklch(0.52 0.18 140)';
        this.store['s17'] ||= 'oklch(0.45 0.31 260)';
        this.store['s18'] ||= 'oklch(.99 0.04 110)';
        this.store['s19'] ||= 'oklch(1 0 0)';
        if (this._values?.includes('oklch(')) {
            this.setValue(this._value, true);
        }
    },
    refreshValue() {
        if (this.isReady)
            this.value = undefined;
    },
    setValue(e, skip) {
        this.refreshValue();
        const val = e?.target?.value || e || '';
        if (!skip)
            this._value = val;
        if (val?.includes('oklch(')) {
            const res = val.replace('oklch(', '').replaceAll(')', ' ').replaceAll('/', ' ').replace(/\s+/g, ' ').split(' ');
            let l = res[0],
                c = res[1],
                h = res[2],
                a = res[3];
            if (l && c && h) {
                this.l = l.includes('%') ? l.replace('%', '') / 100 : +l;
                this.c = c.includes('%') ? c.replace('%', '') / 100  : +c;
                this.h = h.includes('none') ? 0 : + h;
                this.a = a ? a.includes('%') ? a.replace('%', '') / 100  : +a : 1;
            }
        } else {
            this.value = val;
        }
    },
    _storeDown(e, idx) {
        this.startStamp = e.timeStamp;
        this.async(() => {
            if (!this._setsValue)
                this.store['s' + idx] = this.value;
            this._setsValue = false;
        }, this.clickTime);
    },
    _storeUp(e, idx) {
        const ts = e.timeStamp - this.startStamp;
        this.store ||= {};
        if (ts < this.clickTime) {
            this._setsValue = true;
            this.setValue(this.store['s' + idx], true);
        }
        this.store = {...this.store};
        this.async(() => this._setsValue = false, this.clickTime + 1);
    },
    async _ok() {
        this.fire('ok', this.value);
        await navigator?.clipboard?.writeText(this.value);
    },
    _cancel() {
        this.fire('cancel');
    },
    _clear() {
        this.store = {};
        // this._init();
    },
    _showPalette() {
        this.showPalette = !this.showPalette;
        this.fire('resize');
    }
})
