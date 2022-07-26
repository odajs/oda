ODA({ is: 'oda-pell-editor', imports: '@oda/button, @oda/ace-editor, ./lib/pell.js, @oda/palette, @tools/containers',
    template: `
        <style>
            .pell { border: 1px solid rgba(10, 10, 10, 0.1); box-sizing: border-box; }
            .pell-content { box-sizing: border-box; outline: 0; overflow-y: auto; padding: 10px; }
            .pell-actionbar { display: flex; background-color: rgb(240, 240, 240); border: 1px solid rgba(10, 10, 10, 0.1); position: sticky; top: 0px; z-index: 1; flex-wrap: wrap; }
            .pell-button { background-color: white; border: solid 1px lightgray;  border-radius: 2px; margin: 1px; cursor: pointer; height: 24px; outline: 0; width: 30px; vertical-align: bottom; }
            .pell-button-selected { background-color: rgb(220, 220, 220); }
            .pell-button:hover { background-color: rgb(230, 230, 230); }
            :host {
                @aplly --vertical;
                position: relative;
            }
        </style>
        <div ~show="!_showAce" id="editor" @keydown.stop></div>
        <oda-button ~if="_showAce" icon="icons:close" @click="closeAce" style="position: absolute; z-index: 31; fill: red; right: 0"></oda-button>
        <oda-ace-editor ~if="_showAce" id="ace" mode="html" wrap="true" font-size="16"></oda-ace-editor>
    `,
    props: {
        src: '',
        readOnly: false,
    },
    get value() { return this.editor?.content?.innerHTML || '' },
    set value(v) { if (this.editor) this.editor.content.innerHTML = v },
    _showAce: false,
    attached() {
        this.async(() => {
            this._update();
        }, 300);
    },
    _update() {
        this.editor = pell.init({
            element: this.$('#editor'),
            onChange: () => this.fire('change', this.editor.content.innerHTML),
            actions: [
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'heading1',
                'heading2',
                'heading3',
                'heading4',
                'heading5',
                'heading6',
                {
                    name: 'foreColor',
                    icon: '&#9734;',
                    title: 'foreColor',
                    result: async () => {
                        try {
                            let res = await ODA.showDropdown('oda-palette', { gradientMode: false }, { resolveEvent: 'value-changed' });
                            if (res) pell.exec('foreColor', res.value);
                        } catch (error) { }
                    }
                },
                {
                    name: 'backColor',
                    icon: '&#9733',
                    title: 'backColor',
                    result: async () => {
                        try {
                            let res = await ODA.showDropdown('oda-palette', { gradientMode: false }, { resolveEvent: 'value-changed' });
                            if (res) pell.exec('backColor', res.value);
                        } catch (error) { }
                    }
                },
                'olist',
                'ulist',
                'paragraph',
                'quote',
                'code',
                'line',
                'link',
                'image',
                'video',
                'html',
                {
                    name: 'Commands',
                    icon: '✓',
                    title: 'Commands',
                    result: () => {
                        let url = window.prompt('c-center, f-full, l-left, r-right, i-indent, o-outdent, 1-7 fontSize, s-subScript, u-superScript, z-unLink, <-undo, >-redo, x-removeFormat');
                        if (!url) return;
                        url = url[0].toLowerCase();
                        const comm = {
                            'c': () => pell.exec('justifyCenter'),
                            'f': () => pell.exec('justifyFull'),
                            'l': () => pell.exec('justifyLeft'),
                            'r': () => pell.exec('justifyRight'),
                            'x': () => pell.exec('removeFormat'),
                            'i': () => pell.exec('inDent'),
                            'o': () => pell.exec('outDent'),
                            's': () => pell.exec('subScript'),
                            'u': () => pell.exec('superScript'),
                            'z': () => pell.exec('unLink'),
                            '<': () => pell.exec('undo'),
                            '>': () => pell.exec('redo'),
                            '1': () => pell.exec('fontSize', url),
                            '2': () => pell.exec('fontSize', url),
                            '3': () => pell.exec('fontSize', url),
                            '4': () => pell.exec('fontSize', url),
                            '5': () => pell.exec('fontSize', url),
                            '6': () => pell.exec('fontSize', url),
                            '7': () => pell.exec('fontSize', url),
                        }
                        comm[url] && comm[url]();
                    }
                },
                {
                    name: 'viewSource',
                    icon: '&lt;/&gt;',
                    title: 'View source code',
                    result: () => {
                        const value = this.editor.content.innerHTML;
                        this._showAce = true;
                        this.async(() => {
                            const ace = this.$('#ace');
                            ace.value = value;
                        }, 100)
                    }
                },
            ],
        });
        this.editor.content.contentEditable = !this.readOnly;
        this.value = this.src || '';
    },
    closeAce(e) {
        const value = this.$('#ace').value;
        this._showAce = false;
        this.editor.content.innerHTML = value;
        this.fire('change', this.editor.content.innerHTML);
    }
})
