import Color from "./dist/color.js";

ODA({ is: 'oda-color-picker-oklch',
    template: `
        <style>
            :host {
                @apply --horizontal;
                @apply --border;
                @apply --shadow;
                position: relative;
                max-width: {{width + (showPalette ? height : 0)}}px;
                width: {{width + (showPalette ? height : 0)}}px;
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
                width: {{height}};
                min-width: {{height}};
                max-height: {{height}};
                height: {{height}};
            }
            .cell {
                box-sizing: border-box;
                cursor: pointer;
                width: {{(height - 10) / 10}}px;
                height: {{(height - 10) / 10}}px;
            }
            .result {
                background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
                background-position: 0px 0px, 10px 10px;
                background-size: 20px 20px;
                overflow: hidden;    
            }
            [selected-history] {
                outline: 1px outset light-dark(black, white);
            }
        </style>
        <div class="vertical" ~style="{minWidth: width - 8 + 'px'}" style="margin: 4px; border-radius: 4px;">
            <div class="result horizontal flex border">
                <div style="width: 30%; height: 100%; cursor: pointer" ~style="{background: srcValue || value}" @tap="srcValue=value"></div>
                <div class="flex" style="cursor: pointer" ~style="{backgroundColor: value}" @tap="srcValue=''"></div>
            </div>
            <div class="horizontal">
                <input class="flex border" type="text" :value="value" style="padding: 2px; font-size: 14px; margin: 4px 0; text-align: center;" @change="setValue">
                <oda-button icon="box:i-chevron-down" @tap="_selectNamedColors"></oda-button>
            </div>
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
            <div class="horizontal" style="align-items: center;">
                <div class="vertical flex" style="cursor: pointer">
                    <div class="horizontal flex" style="width: 100%; margin-bottom: 4px;">
                        <div ~for="historyLength || 0" class="border" style="width: 100%; margin-right: 2px;" @tap="_historyTap($event, $for.index)" ~style="{background: history?.['s'+$for.index] || '', height: (historyH || 16)+'px'}" :selected-history="historyIdx === $for.index"></div>
                    </div>
                    <div class="horizontal flex">
                        <div ~for="historyLength" class="border" style="width: 100%;margin-right: 2px;" @tap="_historyTap($event, $for.index+historyLength)" ~style="{background: history?.['s'+($for.index+historyLength)] || '', height: (historyH || 16)+'px'}" :selected-history="historyIdx === $for.index+historyLength"></div>
                    </div>
                </div>
                <oda-button icon="carbon:color-palette" class="border no-flex" style="margin-left: 4px; padding: 4px; border-radius: 4px;"  allow-toggle ::toggled="showPalette" title="show / hide palette"></oda-button>
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
        historyLength: {
            $def: 8,
            // $save: true
        },
        historyH: {
            $def: 16,
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
        srcValue: {
            $def: '',
            set(n) {
                this.setValue(n, true);
            }
        },
        historyIdx: {
            $def: 0,
            $save: true
        },
        showColors: false,
    },
    get vColor() {
        return new Color(this.value);
    },
    history: {
        $def: {},
        $save: true
    },
    attached() {
        this.history ||= {};
        this.isReady = true;
    },
    refreshValue() {
        if (this.isReady) {
            this.value = undefined;
            const idx = this.historyIdx;
            this.history['s' + idx] = this.value;
            this.history = { ...this.history };
            this.fire('color-changed', this.value);
        }
    },
    setValue(e, skip) {
        this.refreshValue();
        let val = e?.target?.value || e || '';
        try {
            let color = new Color(val);
            let l = Math.round(color.oklch[0] * 100) / 100,
                c = Math.round(color.oklch[1] * 1000) / 1000,
                h = Math.round((color.oklch[2] || 0) * 100) / 100,
                a = Math.round(color.alpha * 100) / 100,
                _a = a >= 1 ? '' : ` / ${color.alpha}`;
            val = `oklch(${l} ${c} ${h}${_a})`;
            if (!skip)
                this.srcValue = val;
            this.l = l;
            this.c = c;
            this.h = h;
            this.a = a;
            this.value = val;
        } catch (err) { }
    },
    historyClear(e) {
        this.history = {};
        this.history = { ...this.history };
    },
    _historyTap(e, idx) {
        if (this.history['s' + idx])
            this.setValue(this.history['s' + idx], true);
        this.historyIdx = idx;
    },
    async _selectNamedColors(e) {
        const res = await ODA.showDropdown('oda-select-colors', {}, { anchor: 'right-top', align: 'left', parent: e.target, maxHeight: this.height, minWidth: this.width, maxWidth: this.width, title: 'Select color' });
        if (res?.result) {
            this.setValue(res.result);
        }
    }
})

ODA({ is: 'oda-select-colors', 
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                background: var(--content-background);
                margin: 4px;
            }
            input {
                border: none;
                outline: none;
                border-bottom: 1px solid var(--border-color);
            }
        </style>
        <div class="horizontal">
            <input id="search" type="search" style="border-bottom: 1px solid var(--border-color)" @input="searchString = $('#search').value">
            <oda-button icon="bootstrap:search" icon-size="16" @tap="searchString = $('#search').value"></oda-button>
        </div>
        <div class="vertical flex" style="overflow: hidden; overflow-y: auto;">
            <div class="horizontal" ~for="namedColors" style="align-items: center; cursor: pointer;" @tap="fire('ok',  $for.item)">
                <div style="min-width: 60px; max-width: 60px; height: 32px; margin: 4px;" ~style="{background: $for.item}"></div>
                <div style="overflow-wrap: anywhere; white-space: normal; font-size: 14px; padding: 4px;">{{$for.item}}</div>
            </div>
        </div>
    `,
    searchString: '',
    get namedColors() {
        return namedColors.filter(i => i.toLocaleLowerCase().includes(this.searchString.toLocaleLowerCase() || ''));
    },
})

const namedColors = [
    `AliceBlue`,
    `AntiqueWhite`,
    `Aqua`,
    `Aquamarine`,
    `Azure`,
    `Beige`,
    `Bisque`,
    `Black`,
    `BlanchedAlmond`,
    `Blue`,
    `BlueViolet`,
    `Brown`,
    `BurlyWood`,
    `CadetBlue`,
    `Chartreuse`,
    `Chocolate`,
    `Coral`,
    `CornflowerBlue`,
    `Cornsilk`,
    `Crimson`,
    `Cyan`,
    `DarkBlue`,
    `DarkCyan`,
    `DarkGoldenRod`,
    `DarkGray`,
    `DarkGrey`,
    `DarkGreen`,
    `DarkKhaki`,
    `DarkMagenta`,
    `DarkOliveGreen`,
    `Darkorange`,
    `DarkOrchid`,
    `DarkRed`,
    `DarkSalmon`,
    `DarkSeaGreen`,
    `DarkSlateBlue`,
    `DarkSlateGray`,
    `DarkSlateGrey`,
    `DarkTurquoise`,
    `DarkViolet`,
    `DeepPink`,
    `DeepSkyBlue`,
    `DimGray`,
    `DimGrey`,
    `DodgerBlue`,
    `FireBrick`,
    `FloralWhite`,
    `ForestGreen`,
    `Fuchsia`,
    `Gainsboro`,
    `GhostWhite`,
    `Gold`,
    `GoldenRod`,
    `Gray`,
    `Grey`,
    `Green`,
    `GreenYellow`,
    `HoneyDew`,
    `HotPink`,
    `IndianRed`,
    `Indigo`,
    `Ivory`,
    `Khaki`,
    `Lavender`,
    `LavenderBlush`,
    `LawnGreen`,
    `LemonChiffon`,
    `LightBlue`,
    `LightCoral`,
    `LightCyan`,
    `LightGoldenRodYellow`,
    `LightGray`,
    `LightGrey`,
    `LightGreen`,
    `LightPink`,
    `LightSalmon`,
    `LightSeaGreen`,
    `LightSkyBlue`,
    `LightSlateGray`,
    `LightSlateGrey`,
    `LightSteelBlue`,
    `LightYellow`,
    `Lime`,
    `LimeGreen`,
    `Linen`,
    `Magenta`,
    `Maroon`,
    `MediumAquaMarine`,
    `MediumBlue`,
    `MediumOrchid`,
    `MediumPurple`,
    `MediumSeaGreen`,
    `MediumSlateBlue`,
    `MediumSpringGreen`,
    `MediumTurquoise`,
    `MediumVioletRed`,
    `MidnightBlue`,
    `MintCream`,
    `MistyRose`,
    `Moccasin`,
    `NavajoWhite`,
    `Navy`,
    `OldLace`,
    `Olive`,
    `OliveDrab`,
    `Orange`,
    `OrangeRed`,
    `Orchid`,
    `PaleGoldenRod`,
    `PaleGreen`,
    `PaleTurquoise`,
    `PaleVioletRed`,
    `PapayaWhip`,
    `PeachPuff`,
    `Peru`,
    `Pink`,
    `Plum`,
    `PowderBlue`,
    `Purple`,
    `Red`,
    `RosyBrown`,
    `RoyalBlue`,
    `SaddleBrown`,
    `Salmon`,
    `SandyBrown`,
    `SeaGreen`,
    `SeaShell`,
    `Sienna`,
    `Silver`,
    `SkyBlue`,
    `SlateBlue`,
    `SlateGray`,
    `SlateGrey`,
    `Snow`,
    `SpringGreen`,
    `SteelBlue`,
    `Tan`,
    `Teal`,
    `Thistle`,
    `Tomato`,
    `Turquoise`,
    `Violet`,
    `Wheat`,
    `White`,
    `WhiteSmoke`,
    `Yellow`,
    `YellowGreen`,
]
