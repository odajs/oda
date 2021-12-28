ODA({ is: 'oda-wysiwyg', imports: '@oda/button, @oda/ace-editor, @oda/palette, @tools/containers, ./pell.js', template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
        }
        .pell {
            border: 1px solid var(--border-color);
            box-sizing: border-box;
        }

        .pell-content {
            box-sizing: border-box;
            outline: 0;
            overflow-y: auto;
            padding: 10px;
        }

        .pell-actionbar {
            background-color: var(--layout-background);
            border-bottom: 1px solid var(--border-color);
            position: sticky;
            top: 0px;
            z-index: 10;
            display: none;
            flex-wrap: wrap;
        }

        :host([editable]) .pell-actionbar {
            display: flex;
        }

        .pell-button {
            background-color: var(--layout-background);
            border: solid 1px var(--border-color);
            border-radius: 2px;
            margin: 1px;
            cursor: pointer;
            height: 24px;
            outline: 0;
            width: 30px;
            vertical-align: bottom;
        }

        .pell-button-selected {
            background-color: var(--selected-background);
        }

        .pell-button:hover {
            filter: brightness(80%);
        }
    </style>
    <div ref="editor" class="flex"></div>
    <div ~if="syspanel" class="horizontal" style="position: sticky; bottom: 0; background-color: var(--layout-background); border-top: 1px solid var(--border-color);">
        <oda-button icon="editor:mode-edit" @tap.stop="editable=!editable" :label="editable?'Switch to View mode':'Switch to Edit mode'" style="opacity: 0.7"></oda-button>
        <oda-button icon="icons:open-in-browser" @tap.stop="_open" label="Open in browser" style="opacity: 0.7"></oda-button>
    </div>`,
    props: {
        editable: {
            default: false,
            reflectToAttribute: true,
            set(n) {
                if (this.editor?.content)
                    this.editor.content.contentEditable = n;
            }
        },
        value: {
            type: String,
            set(n) {
                if (this.editor) this.editor.content.innerHTML = n ? n : '';
            }
        },
        editor: {
            type: [Object, HTMLElement]
        },
        syspanel: false
    },
    detached(e) {
        this.editor.innerHTML = '';
    },
    async attached() {
        this.editor = pell.init({
            element: this.$refs.editor,
            onChange: html => this.fire('change', html),
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
                        let ctrl = document.createElement('oda-palette');
                        let val = await ODA.showDialog(ctrl, {
                            title: 'Select Color',
                            buttons: []
                        });
                        if (val) pell.exec('foreColor', val.value)
                    }
                },
                {
                    name: 'backColor',
                    icon: '&#9733',
                    title: 'backColor',
                    result: async () => {
                        let ctrl = document.createElement('oda-palette');
                        let val = await ODA.showDialog(ctrl, {
                            title: 'Select Color',
                            buttons: []
                        });

                        if (val) pell.exec('backColor', val.value)
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
                    result: function result() {
                        var url = window.prompt('c-center, f-full, l-left, r-right, i-indent, o-outdent, 1-7 fontSize, s-subScript, u-superScript, z-unLink, <-undo, >-redo, x-removeFormat');
                        if (url) {
                            url = url.toLowerCase();
                            switch (url) {
                                case 'c':
                                    url = 'justifyCenter'
                                    break;
                                case 'f':
                                    url = 'justifyFull'
                                    break;
                                case 'l':
                                    url = 'justifyLeft'
                                    break;
                                case 'r':
                                    url = 'justifyRight'
                                    break;
                                case 'x':
                                    url = 'removeFormat'
                                    break;
                                case 'i':
                                    url = 'inDent'
                                    break;
                                case 'o':
                                    url = 'outDent'
                                    break;
                                case 's':
                                    url = 'subScript'
                                    break;
                                case 'u':
                                    url = 'superScript'
                                    break;
                                case 'z':
                                    url = 'unLink'
                                    break;
                                case '<':
                                    url = 'undo'
                                    break;
                                case '>':
                                    url = 'redo'
                                    break;
                                case '1': case '2': case '3': case '4': case '5': case '6': case '7':
                                    pell.exec('fontSize', url);
                                    return;
                            }
                            pell.exec(url);
                        }
                    }
                },
                {
                    name: 'viewSource',
                    icon: '&lt;/&gt;',
                    title: 'View source code',
                    result: async () => {
                        let ctrl = document.createElement('oda-ace-editor');
                        ctrl.style.height = (window.innerHeight - window.innerHeight * 0.18) + 'px';
                        ctrl.style.width = (window.innerWidth - window.innerWidth * 0.18) + 'px';
                        ctrl.value = this.editor.content.innerHTML;
                        ctrl.mode = 'html';
                        ctrl.wrap = true;
                        ctrl.addEventListener('keydown', (e) => {
                            if (e.code === 'Enter') {
                                e.stopPropagation();
                            }
                        });
                        let val = await ODA.showDialog(ctrl, {
                            title: 'Ace HTML editor',
                            buttons: []
                        });
                        this.editor.content.innerHTML = val.value;
                    }
                },
            ],
        });
        this.editor.content.contentEditable = this.editable;
        this.editor.content.innerHTML = this.value ? this.value : '';
    },
    _open() {
        let newWin = window.open("about:blank", "HTML");
        newWin.document.write(this.editor.content.innerHTML);
    }
})
