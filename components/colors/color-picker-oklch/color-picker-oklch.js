import Color from "./dist/color.js";
import rgbHex from './dist/rgb-hex.js';

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
            .convertor {
                box-sizing: border-box;
                width: {{width - 8}}px;
                height: {{height - 46}}px;
                position: absolute;
                background: var(--content-background);
                left: 4px;
                top: 4px;
            }
            .cell {
                box-sizing: border-box;
                cursor: pointer;
                width: {{(height - 10) / 10}}px;
                height: {{(height - 10) / 10}}px;
            }
            .btn {
                opacity: .1;
            }
            .btn:hover {
                opacity: .5;
            }
            .result {
                background-image: 
                    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),
                    linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
                background-position: 0px 0px, 10px 10px;
                background-size: 20px 20px;
                overflow: hidden;    
            }
        </style>
        <div ~if="showColors" class="vertical border" ~style="{width: width - 8 + 'px', height: height -10 + 'px'}" style="position: absolute; z-index: 1; margin: 4px; border-radius: 4px; background: white; height: 100%;">
            <div class="verticl flex" style="overflow-y: auto;">
                <div class="horizontal" ~for="namedColors" style="align-items: center; cursor: pointer;" @tap="_selectColor($for.item)">
                    <div style="min-width: 60px; max-width: 60px; height: 24px; margin: 2px;" ~style="{background: $for.item}"></div>
                    <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{$for.item}}</div>
                </div>
            </div>
            <oda-button icon="iconoir:cancel" style="border-top: 1px solid lightgray"  @tap="showColors=false">cancel</oda-button>
        </div>
        <div class="vertical" ~style="{minWidth: width - 8 + 'px'}" style="margin: 4px; border-radius: 4px;">
            <div class="result horizontal flex border">
                <div style="width: 30%; height: 100%; cursor: pointer" ~style="{background: srcValue || value}" @tap="srcValue=value"></div>
                <div class="flex" style="cursor: pointer" ~style="{backgroundColor: value}" @tap="srcValue=''"></div>
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
                        <div ~for="storeLength" class="border" style="width: 100%;margin-right: 2px; margin-bootom: 1px;" @mousedown="_storeDown($event, $for.index)" @pointerup="_storeUp($event, $for.index)" ~style="{background: store?.['s'+$for.index] || '', height: storeH || '16px'}"></div>
                    </div>
                    <div class="horizontal flex">
                        <div ~for="storeLength" class="border" style="width: 100%;margin-right: 2px; margin-top: 1px;" @mousedown="_storeDown($event, $for.index+storeLength)" @pointerup="_storeUp($event, $for.index+storeLength)" ~style="{background: store?.['s'+($for.index+storeLength)] || '', height: storeH || '16px'}"></div>
                    </div>
                </div>
                <div class="horizontal" style="justify-content: flex-end; margin: 4px 1px 1px 1px;">
                    <oda-button icon="carbon:clean" class="border flex" style="margin-right: 4px; padding: 4px; border-radius: 4px;"  @tap="_clear" title="clear history"></oda-button>
                    <oda-button icon="box:s-color-fill" class="border flex" style="margin-right: 4px; padding: 4px; border-radius: 4px;"  @tap="showColors = true" title="select colors"></oda-button>
                    <oda-button icon="carbon:copy" class="border flex" style="margin-right: 4px; padding: 4px; border-radius: 4px;"  allow-toggle ::toggled="showConvertor" title="show convertor"></oda-button>
                    <oda-button icon="carbon:color-palette" class="border flex" style="margin-right: 4px; padding: 4px; border-radius: 4px;"  allow-toggle ::toggled="showPalette" title="show / hide palette"></oda-button>
                    <oda-button icon="iconoir:cancel" class="border flex" style="margin-right: 4px; padding: 4px; border-radius: 4px;"  @tap="_cancel" title="cancel"></oda-button>
                    <oda-button icon="bootstrap:check2-square" class="border flex" style="padding: 4px; border-radius: 4px;"  @tap="_ok" title="ok"></oda-button>
                </div>
            </div>
        </div>
        <div ~if="showPalette" class="palette horizontal center" style="flex-wrap: wrap; ">
            <div ~for="100" class="cell" ~style="{borderBottom: $for.index<90 ? '1px solid lightgray' : '', borderRight: ($for.index+1)%10 ? '1px solid lightgray' : '', background: 'oklch(' + ($for.index / 100) + ' ' + c + ' ' + h + ' / ' + (a >= 0 ? a : 1) + ')'}" @click="l = $for.index / 100"></div>
        </div>
        <div ~if="showConvertor" class="convertor vertical border">
            <div class="result horizontal flex" style="position: relative">
                <div class="flex" ~style="{backgroundColor: value}" style="border-bottom: 1px solid var(--border-color)"></div>
            </div>
            <div class="vertical" ~for="['oklch','srgb','hsl']" style="padding: 2px; border-bottom: 1px solid lightgray">
                <div class="horizontal flex" style="font-size: x-small; align-items: center">
                    <div class="flex">{{$for.item}}</div>
                    <oda-button class="btn" icon="carbon:copy" @tap="_copyToClipboard(vColor.to($for.item).toString())"></oda-button>
                </div>
                <div style="font-size: small; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{vColor.to($for.item).toString()}}</div>
            </div>
            <div class="horizontal" style="font-size: x-small; align-items: center; margin: 2px">
                <div class="flex">hex</div>
                <oda-button class="btn" icon="carbon:copy" @tap="_copyToClipboard(rgbHexVal)"></oda-button>
            </div>
            <div style="font-size: small;  white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{rgbHexVal}}</div>
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
        storeH: {
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
        clipValue: '',
        clickTime: 500,
        showConvertor: false,
        showColors: false,
    },
    get namedColors() {
        return namedColors;
    },
    get vColor() {
        return new Color(this.value);
    },
    get rgbHex() {
        return rgbHex;
    },
    get rgbHexVal() {
        let val = rgbHex(this.vColor?.to('srgb').toString());
        return '#' + val;
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
        let s = this.storeLength - 5;
        this.store['s' + (s + 0)] ||= 'oklch(0 0 0)';                   // black
        this.store['s' + (s + 1)] ||= 'oklch(.32 0 0)';                 // black lightness - 20%
        this.store['s' + (s + 2)] ||= 'oklch(.51 0 0)';                 // black lightness - 40%
        this.store['s' + (s + 3)] ||= 'oklch(.68 0 0)';                 // black lightness - 60%
        this.store['s' + (s + 4)] ||= 'oklch(.85 0 0)';                 // black lightness - 80%
        this.store['s' + (s * 2 + 5)] ||= 'oklch(0.63 0.258 29.23)';    // red
        this.store['s' + (s * 2 + 6)] ||= 'oklch(0.52 0.177 142.5)';    // green
        this.store['s' + (s * 2 + 7)] ||= 'oklch(0.45 0.313 264.05)';   // blue
        this.store['s' + (s * 2 + 8)] ||= 'oklch(0.99 0.04 107.11)';    // lightyellow
        this.store['s' + (s * 2 + 9)] ||= 'oklch(1 0 0)';               // white
    },
    refreshValue() {
        if (this.isReady)
            this.value = undefined;
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
        this.store = { ...this.store };
        this.async(() => this._setsValue = false, this.clickTime + 1);
    },
    _selectColor(color) {; 
        this.showColors = false;
        this.setValue(color, true);
    },
    async _ok() {
        this.fire('ok', this.value);
        await navigator?.clipboard?.writeText(this.clipValue || this.value);
    },
    _cancel() {
        this.fire('cancel');
    },
    _clear() {
        this.store = {};
        // this._init();
    },
    async _copyToClipboard(v) {
        // console.log(v);
        this.clipValue = v;
        await navigator?.clipboard?.writeText(v);
    }
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