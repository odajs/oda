ODA({ is: 'oda-pell-editor', imports: './lib/pell.js, @oda/hsla-picker, @oda/button',
    template: `
        <style>
            .pell { @apply --border; box-sizing: border-box; }
            .pell-content { @apply --content; @apply --flex; box-sizing: border-box; outline: 0; overflow-y: auto; padding: 10px; }
            .pell-actionbar { @apply --horizontal; flex-wrap: wrap; @apply --header; @apply --border; @apply --shadow; position: sticky; top: 0px; z-index: 98; display: none; }
            .pell-button { @apply --content; @apply --border; border-radius: 4px; width: {{iconSize * 1.5}}px; height: {{iconSize}}px; vertical-align: bottom; margin: 2px; cursor: pointer; }
            .pell-button-selected { @apply --dark; }
            .pell-button:hover { border: 1px solid var(--selected-color, red); }
            :host { @apply --vertical; height: 100%; max-height: 100%; overflow: hidden; }
            :host([editable]) .pell-actionbar {
                display: flex;
            }
        </style>
        <div class="vertical flex" @keydown.stop ~style="{height: syspanel?'calc(100% - 32px)':'100%;'}"></div>
        <div ~if="syspanel" class="horizontal header shadow" style="position: sticky; bottom: 0; border-top: 1px solid var(--border-color);">
            <oda-button ~if="!readOnly" :toggled="editMode" icon="box:s-edit" title="edit mode" @tap.stop="editMode=!editMode"></oda-button>
            <oda-button icon="carbon:data-table-reference" title="open in new tab" @tap.stop="_open"></oda-button>
        </div>
    `,
    $public: {
        iconSize: 24,
        src: {
            $def: '',
            set(n) {
                this.value = n;
            }
        },
        readOnly: {
            $def: false,
            set(n) {
                this.editor && (this.editor.content.contentEditable = !this.readOnly && this.editMode);
            }
        },
        value: {
            $def: '',
            get() {
                return this.editor.content.getInnerHTML() || '';
            },
            set(n) {
                this.editor && this.editor.content.innerHTML !== n && (this.editor.content.innerHTML = n);
            },
        },
        editMode: {
            $def: false,
            set(n) {
                this.editor && (this.editor.content.contentEditable = !this.readOnly && this.editMode);
            }
        },
        editable: {
            $hidden: true,
            $attr: true,
            get() {
                return !this.readOnly && this.editMode;
            }
        },
        syspanel: false
    },
    editor: undefined,
    get element() {
        return this.$?.('div');
    },
    attached() {
        this.init();
    },
    init() {
        this.async(() => {
            if (!this.element) return;
            this.editor ??= pell.init({
                element: this.element,
                onChange: () => {
                    this['#value'] = undefined;
                    const val = this.editor.content.getInnerHTML();
                    this.fire('change', val);
                },
                actions: [
                    'bold', 'italic', 'underline', 'strikethrough', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
                    {
                        name: 'foreColor', icon: '<div style="display: flex; align-itemc: center"><label>f.</label><oda-hsla-picker size="12" color="hsla(0, 0%, 23%, 1.00)" onChange="pell.exec(\'foreColor\', this.color)"></oda-hsla-picker></div>', title: 'foreColor', result: () => { }
                    },
                    {
                        name: 'backColor', icon: '<div style="display: flex; align-itemc: center"><label>b.</label><oda-hsla-picker size="12" color="hsla(0, 0%, 100%, 1.00)" onChange="pell.exec(\'backColor\', this.color)"></oda-hsla-picker></div>', title: 'backColor', result: () => { }
                    },
                    'olist', 'ulist', 'paragraph', 'quote', 'code', 'line', 'link', 'image', 'video', 'html',
                    {
                        name: 'Commands', icon: '✓', title: 'Commands',
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
                    }
                ],
            })
            this.editor.content.innerHTML ||= this.src || '';
            this.editor.content.contentEditable = !this.readOnly && this.editMode;
        }, 100)
    },
    _open() {
        let newWin = window.open("about:blank", "HTML");
        newWin.document.write(this.editor.content.getInnerHTML());
    }
})
