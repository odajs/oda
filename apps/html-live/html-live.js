import '../../components/buttons/button/button.js';
import '../../components/editors/ace-editor/ace-editor.js';
import { LZString } from './lib/lz-string.js';

ODA({
    is: 'oda-html-live',
    template: `
        <style>
            :host {
                height: calc(100% - 34px);
            }
            #main {
                position: relative;
                display: flex;
                height: 100%;
                color: #505050;
            }
            .main-panel {
                margin: 4px;
                border: 1px solid lightgray;
                overflow: auto;
                min-width: 0;
            }
            .splitter {
                max-width: 4px;
                min-width: 4px;
                cursor: col-resize;
                z-index: 9;
            }
            .splitter:hover, .splitter-move {
                background-color: lightgray;
            }
            .iframe-pe {
                pointer-events: none;
            }
            .btns {
                display: flex;
                flex-direction: row-reverse;
                align-items: center;
            }
        </style>
        <div class="btns">
            <oda-button icon="image:filter-2" @tap="_resize(0)" style="margin-right:8px" fill="gray"></oda-button>
            <oda-button icon="icons:more-vert" @tap="_resize(2)" style="margin-right:4px" fill="gray"></oda-button>
            <oda-button icon="image:filter-1" @tap="_resize(1)" style="margin-right:4px" fill="gray"></oda-button>
            <oda-button icon="icons:launch" @tap="_open" title="open in new window" style="margin-right:8px" fill="gray"></oda-button>
            <oda-button icon="icons:refresh" @tap="_reload" title="reload page" style="margin-right:4px" fill="gray"></oda-button>
            <label style="margin-right: auto; padding-left: 4px; color: gray">oda-html-live</label>
        </div>
        <div id="main">
            <div class="main-panel" ~style="{width: _widthL+'px', display: _widthL > 0 ? '':'none'}">
                <oda-ace-editor id="editor" @change="_change()" :options></oda-ace-editor>
            </div>
            <div class="splitter" ~class="_action === 'splitter-move' ? 'splitter-move' : ''" @pointerdown="_pointerdown"></div>
            <div class="main-panel" ~show="this._widthL < clientWidth" style="flex: 1">
                <iframe id="iframe" ~class="_action === 'splitter-move' ? 'iframe-pe' : ''" :srcdoc="src || ''" style="width: 100%; border: none; height: 100%"></iframe>
            </div>
        </div>
    `,
    props: {
        _widthL: { type: Number, default: 600, save: true },
        src: '',
        lzs: '',
        options: { fontSize: 16, wrap: true }
    },
    _action: '',
    get editor() {
        return this.$('oda-ace-editor')?.editor
    },
    attached() {
        const int = setInterval(() => {
            if (this.editor) {
                this._location = window.location.href;
                let _s = this._location.split('?')[1];
                _s = _s || this.lzs;
                this.editor.setValue(_s ? LZString.decompressFromEncodedURIComponent(_s) : this.src);
                this.editor.setTheme('ace/theme/cobalt');
                this.editor.session.setMode('ace/mode/html');
                this.editor.session.selection.clearSelection();
                clearInterval(int);
            }
        }, 100);
    },
    _change() {
        this.src = cssIframe + this.editor.getValue();
    },
    _pointerdown(e) {
        e.stopPropagation();
        e.preventDefault();
        this._action = 'splitter-move';
        document.addEventListener("pointermove", this.__move = this.__move || this._move.bind(this), false);
        document.addEventListener("pointerup", this.__up = this.__up || this._up.bind(this), false);
        document.addEventListener("pointercancel", this.__up = this.__up || this._up.bind(this), false);
    },
    _up() {
        this._action = '';
        document.removeEventListener("pointermove", this.__move, false);
        document.removeEventListener("pointerup", this.__up, false);
        document.removeEventListener("pointercancel", this.__up, false);
    },
    _move(e) {
        e.preventDefault();
        if (this._action = 'splitter-move') {
            this._widthL = this._widthL + e.movementX;
            this._widthL = this._widthL <= 0 ? 0 : this._widthL >= this.clientWidth ? this.clientWidth : this._widthL;
            this._fire();
        }
    },
    _open() {
        let url = this.$url.replace('html-live.js', 'index.html#?') + LZString.compressToEncodedURIComponent(this.editor.getValue());
        window.open(url, '_blank').focus();
    },
    _reload() {
        window.location.href = this.$url.replace('html-live.js', 'index.html#?') + LZString.compressToEncodedURIComponent(this.editor.getValue());
        setTimeout(() => window.location.reload(), 100);
    },
    _resize(v) {
        this._widthL = v ? this.clientWidth / v : 0;
        this._fire();
    },
    _fire() {
        this.async(() => {
            this.editor.setOptions({'wrap': false});
            this.editor.setOptions({'wrap': true});
            this.fire('resize');
        }, 100)
    }
})

const cssIframe = `
<style>
    body { font-family: Roboto, Noto, sans-serif; line-height: 1.5; }
    ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: lightgray; } ::-webkit-scrollbar-thumb { background-color: gray; }
</style>
`
