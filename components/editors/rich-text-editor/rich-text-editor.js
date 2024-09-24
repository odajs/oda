const libPath = import.meta.url.split('/').slice(0, -1).join('/') + '/lib/';
ODA({ is: 'oda-rich-text-editor', imports: '@oda/button, @oda/color-picker-oklch, @oda/selector',
    template: `
        <style>
            .menu::-webkit-scrollbar { width: 4px; height: 4px; }
            .menu::-webkit-scrollbar-track { background: #f0f0f0; }
            .menu::-webkit-scrollbar-thumb { background-color: #d0d0d0; }
            :host {
                @apply --vertical;
                @apply --flex;
                height: 100%;
            }
            .menu {
                align-items: center;
                height: 36px;
                overflow: hidden;
                overflow-x: auto;
            }
            .editor {
                border: none;
                width: 100%;
                height: 100%;
            }
            .menu-divider {
                width: 1px;
                height: 60%;
                margin: 0 4px 0 8px;
                display: inline-block;
                background-color: gray;
            }
            input {
                outline: none;
                border-color: 1px solid lightgray;
                margin: 0 4px;
                width: 32px;
            }
        </style>
        <div ~if="showHeader" class="menu horizontal header shadow">
            <oda-button :icon-size="iconSize" icon="box:i-undo" title="undo (ctrl+z)" @tap="_exe('Undo')" ~style="{opacity: state?.undo ? '1' : '.3'}"></oda-button>
            <oda-button :icon-size="iconSize" icon="box:i-redo" title="redo (ctrl+y)" @tap="_exe('Redo')" ~style="{opacity: state?.redo ? '1' : '.3'}"></oda-button>
            <oda-button :icon-size="iconSize" icon="box:i-paint-roll" title="painter" @tap="_exe('Painter')"></oda-button>
            <oda-button :icon-size="iconSize" icon="box:i-eraser" title="clear format" @tap="_exe('Format')"></oda-button>
            <div class="menu-divider"></div>
            <oda-selector :icon-size="iconSize" :items="fontItems" title="font family" :value="state?.font || ''" width="120px" style="width: 100px; border: 1px solid light gray; background: white; padding: 1px; margin-left: 4px;" @change="_tap('font', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize" :items="sizeItems" title="font size" :value="state?.size || ''" width="110px" style="width: 50px; border: 1px solid light gray; background: white; padding: 1px; margin-left: 4px;" @change="_tap('size', $event)"></oda-selector>
            <oda-button :icon-size="iconSize" icon="box:i-font-size" title="increase font size (⌘+[)" @tap="_exe('SizeAdd')"></oda-button>
            <oda-button :icon-size="iconSize - 6" icon="box:i-font-size" title="decrease font size (⌘+])" @tap="_exe('SizeMinus')"></oda-button>
            <oda-button :icon-size="iconSize" icon="bootstrap:type-bold" title="bold" @tap="_exe('Bold')" ~style="{opacity: state?.bold ? '1' : '.3'}"></oda-button>
            <oda-button :icon-size="iconSize" icon="bootstrap:type-italic" title="italic" @tap="_exe('Italic')" ~style="{opacity: state?.italic ? '1' : '.3'}"></oda-button>
            <oda-button :icon-size="iconSize" icon="bootstrap:type-underline" title="underline" @tap="_exe('Underline')" ~style="{opacity: state?.underline ? '1' : '.3'}"></oda-button>
            <oda-button :icon-size="iconSize" icon="bootstrap:type-strikethrough" title="strikeout" @tap="_exe('Strikeout')" ~style="{opacity: state?.strikeout ? '1' : '.3'}"></oda-button>
            <oda-button :icon-size="iconSize" icon="bootstrap:superscript" title="superscript" @tap="_exe('Superscript')" ~style="{opacity: state?.superscript ? '1' : '.3'}"></oda-button>
            <oda-button :icon-size="iconSize" icon="bootstrap:subscript" title="subscript" @tap="_exe('Subscript')" ~style="{opacity: state?.Subscript ? '1' : '.3'}"></oda-button>
            <oda-txt-picker-oklch size="16" :value="state?.color || 'oklch(0 0 0)'" @change="_tap('color', $event)" style="margin-right: 8px"></oda-txt-picker-oklch>
            <oda-txt-picker-oklch size="16" :value="state?.highlight || 'oklch(1 0 0)'" @change="_tap('highlight', $event)"></oda-txt-picker-oklch>
            <div class="menu-divider"></div>
            <oda-selector :icon-size="iconSize" :items="titleItems" title="font title" :value="size" width="100px" style="width: 60px; border: 1px solid light gray; background: white; padding: 1px; margin-left: 4px;" @change="_tap('title', $event)"></oda-selector>
            <oda-button :icon-size="iconSize" icon="box:i-align-left" title="align left" @tap="_tap('left')"></oda-button>
            <oda-button :icon-size="iconSize" icon="box:i-align-middle" title="align center" @tap="_tap('center')"></oda-button>
            <oda-button :icon-size="iconSize" icon="box:i-align-right" title="align right" @tap="_tap('right')"></oda-button>
            <oda-button :icon-size="iconSize" icon="box:i-align-justify" title="align justify" @tap="_tap('alignment')"></oda-button>
            <oda-selector :icon-size="iconSize" icon="bootstrap:arrows-expand" icon2="false" title="rowmargin" :items="rowmarginItems" width="84px" style="min-width: 24px;max-width: 24px;" @change="_tap('rowmargin', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize" icon="bootstrap:list-ul" icon2="false" title="list type" :items="listItems" width="60px" style="min-width: 24px;max-width: 24px;" @change="_tap('list', $event)"></oda-selector>
            <div class="menu-divider"></div>
            <oda-selector :icon-size="iconSize - 3" :items="tableItems" title="table" show-ok label="Set table" icon="bootstrap:table" icon2="false" width="140px" style="margin-left: 4px;width: 24px; display: block;" @change="_tap('table', $event)"></oda-selector>
            <oda-button for="image" :icon-size="iconSize - 2" icon="bootstrap:image" title="image" @tap="$('#image').click()"></oda-button>
            <input id="image" type="file" @change="_tap('image', $event)" hidden>
            <oda-selector :icon-size="iconSize" :items="blockItems" title="block (video / iframe)" show-ok label="Block (video / iframe)" icon="notification:ondemand-video" icon2="false" width="280px" style="margin-left: 4px;width: 24px; display: block;" @change="_tap('block', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize" :items="linkItems" show-ok label="Hyperlink" icon="bootstrap:link" icon2="false" width="280px" style="width: 28px; display: block;" @change="_tap('link', $event)"></oda-selector>
            <oda-button :icon-size="iconSize - 3" icon="bootstrap:check-square" title="checkbox" @tap="_tap('checkbox')"></oda-button>
            <oda-button :icon-size="iconSize" icon="unicon:clock" title="date" @tap="_tap('date')"></oda-button>
            <oda-selector :icon-size="iconSize" :items="codeItems" show-ok title="code block" label="Code block" icon="bootstrap:code-slash" icon2="false" width="280px" style="width: 28px; display: block;" @change="_tap('code', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize" :items="barcodeItems" show-ok title="barcode" label="Barcode" icon="shopping:barcode" icon2="false" width="280px" style="width: 28px; display: block;" @change="_tap('barcode', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize - 3" :items="qrcodeItems" show-ok title="QR code" label="QR code" icon="bootstrap:qr-code" icon2="false" width="280px" style="width: 28px; display: block;" @change="_tap('qrcode', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize" :items="latexItems" show-ok title="latex" label="LaTeX" icon="carbon:function-math" icon2="false" width="280px" style="width: 28px; display: block;" @change="_tap('latex', $event)"></oda-selector>
            <oda-button :icon-size="iconSize" icon="bootstrap:activity" title="separator" @tap="_tap('separator')"></oda-button>
            <oda-button :icon-size="iconSize" icon="carbon:page-break" title="page break" @tap="_tap('pageBreak')"></oda-button>
            <div class="menu-divider"></div>
            <oda-button :icon-size="iconSize - 3" icon="eva:f-minus" title="scale minus" @click="_exe('PageScaleMinus')"></oda-button>
            <span  @click="_exe('PageScaleRecovery')" style="font-size: small; cursor: pointer; max-width: 36px; min-width: 36px; text-align: center">{{_scale || '100%'}}</span>
            <oda-button :icon-size="iconSize - 3" icon="eva:f-plus" title="scale add" @click="_exe('PageScaleAdd')"></oda-button>
            <oda-selector :icon-size="iconSize - 3" :items="directionsItems" title="paper directions" label="Paper directions" :icon="dirUrl" icon2="false" width="160px" style="width: 24px; display: block;" @change="_tap('directions', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize - 3" :items="paperSizeItems" title="paper size" label="Paper size" icon="bootstrap:aspect-ratio" icon2="false" width="120px" style="width: 24px; display: block;" @change="_tap('paperSize', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize - 3" :items="paperMarginItems" show-ok title="paper margin" label="Paper margin" icon="bootstrap:border" icon2="false" width="160px" style="width: 24px; display: block;" @change="_tap('paperMargin', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize - 3" :items="modeItems" title="page mode" label="Page mode" icon="carbon:insert-page" icon2="false" width="160px" style="width: 24px; display: block;" @change="_tap('pageMode', $event)"></oda-selector>
            <oda-selector :icon-size="iconSize - 3" :items="watermarkItems" show-ok hide-input title="watermarks" label="Watermarks" icon="iconoir:sea-waves" icon2="false" width="240px" hide-input style="display: block;" @change="_tap('watermarks', $event)"></oda-selector>
            <div class="menu-divider"></div>
            <oda-button :icon-size="iconSize - 3" icon="bootstrap:x-square" title="clear all" @click="_tap('clearAll')"></oda-button>
            <div class="menu-divider"></div>
            <!-- <oda-button :icon-size="iconSize" icon="bootstrap:search" search="code" @tap="_tap('search', $event)"></oda-button> --!>
            <oda-button :icon-size="iconSize" icon="bootstrap:printer" title="print" @tap="_tap('print')"></oda-button>
            <oda-button for="files" :icon-size="iconSize" icon="bootstrap:folder2-open" title="open file" @tap="$('#files').click()"></oda-button>
            <input id="files" type="file" style="width: 60ch; position: fixed; padding: 2px; top: 40px" accept=".json" hidden @change="load('', $event)"/>
            <oda-button :icon-size="iconSize + 3" icon="carbon:save" title="save" @tap="save"></oda-button>
            <oda-button ~if="fillData" :icon-size="iconSize" icon="bootstrap:magic" title="fill" @tap="fill"></oda-button>
        </div>
        <iframe class="editor"></iframe>
    `,
    $public: {
        iconSize: 20,
        showHeader: true,
        src: {
            set(v) {
                this.load();
            }
        },
        dateFormat: 'yyyy-MM-dd',
        fullDate: false,
        fireOnFill: false
    },
    state: undefined,
    fillData: undefined,
    _scale: '',
    sizeItems: [
        { label: 5, lblStyle: 'padding: 2px; margin: 0; fontSize: 5px' },
        { label: 6, lblStyle: 'padding: 2px; margin: 0; fontSize: 6px' },
        { label: 7, lblStyle: 'padding: 2px; margin: 0; fontSize: 7px' },
        { label: 8, lblStyle: 'padding: 2px; margin: 0; fontSize: 8px' },
        { label: 9, lblStyle: 'padding: 2px; margin: 0; fontSize: 9px' },
        { label: 10, lblStyle: 'padding: 2px; margin: 0; fontSize: 10px' },
        { label: 12, lblStyle: 'padding: 2px; margin: 0; fontSize: 12px' },
        { label: 14, lblStyle: 'padding: 2px; margin: 0; fontSize: 14px' },
        { label: 16, lblStyle: 'padding: 2px; margin: 0; fontSize: 16px' },
        { label: 18, lblStyle: 'padding: 2px; margin: 0; fontSize: 18px' },
        { label: 20, lblStyle: 'padding: 2px; margin: 0; fontSize: 20px' },
        { label: 22, lblStyle: 'padding: 2px; margin: 0; fontSize: 22px' },
        { label: 24, lblStyle: 'padding: 2px; margin: 0; fontSize: 24px' },
        { label: 26, lblStyle: 'padding: 2px; margin: 0; fontSize: 26px' },
        { label: 28, lblStyle: 'padding: 2px; margin: 0; fontSize: 28px' },
        { label: 30, lblStyle: 'padding: 2px; margin: 0; fontSize: 30px' },
        { label: 32, lblStyle: 'padding: 2px; margin: 0; fontSize: 32px' }
    ],
    titleItems: [
        { title: '', label: 'Text', lblStyle: 'padding: 2px; margin: 0 ' },
        { title: 'first', label: 'H1', is: 'H1', lblStyle: 'padding: 2px; margin: 0 ' },
        { title: 'second', label: 'H2', is: 'H2', lblStyle: 'padding: 2px; margin: 0 ' },
        { title: 'third', label: 'H3', is: 'H3', lblStyle: 'padding: 2px; margin: 0 ' },
        { title: 'fourth', label: 'H4', is: 'H4', lblStyle: 'padding: 2px; margin: 0 ' },
        { title: 'fifth', label: 'H5', is: 'H5', lblStyle: 'padding: 2px; margin: 0 ' },
        { title: 'sixth', label: 'H6', is: 'H6', lblStyle: 'padding: 2px; margin: 0 ' }
    ],
    fontItems: [
        { label: 'Yahei', style: 'fontFamily: Yahei' },
        { label: 'Arial', style: 'fontFamily: Arial' },
        { label: 'Georgia', style: 'fontFamily: Georgia' },
        { label: 'Cursive', style: 'fontFamily: cursive' },
        { label: 'Monospace', style: 'fontFamily: monospace' },
        { label: 'Serif', style: 'fontFamily: serif' },
        { label: 'Sans-serif', style: 'fontFamily: sans-serif' },
        { label: 'Segoe UI', style: 'fontFamily: Segoe UI' },
        { label: 'Ink Free', style: 'fontFamily: Ink Free' },
        { label: 'Fantasy', style: 'fontFamily: Fantasy' },
        { label: 'Helvetica', style: 'fontFamily: Helvetica' },
        { label: 'Times', style: 'fontFamily: Times' },
    ],
    listItems: [
        { icon: 'bootstrap:list-ol', label: ' - 1', listType: 'ol', listStyle: 'decimal' },
        { icon: 'bootstrap:list-ul', label: ' - ●', listType: 'ul', listStyle: 'disc' },
        { icon: 'bootstrap:list-task', label: ' - ○', listType: 'ul', listStyle: 'circle' },
        { icon: 'bootstrap:list-stars', label: ' - ■', listType: 'ul', listStyle: 'square' }
    ],
    rowmarginItems: [
        { label: 0.1 },
        { label: 0.25 },
        { label: 0.5 },
        { label: 0.75 },
        { label: 1.0 },
        { label: 1.25 },
        { label: 1.75 },
        { label: 2.0 },
        { label: 2.5 },
        { label: 3.0 }
    ],
    tableItems: [
        { label: 'column', lblStyle: 'min-width: 60px', icon: '', type: 'number', value: 5 },
        { label: 'row', lblStyle: 'min-width: 60px', icon: '', type: 'number', value: 3 }
    ],
    linkItems: [
        { label: 'text', lblStyle: 'max-width: 30px', inpStyle: 'border-bottom: 1px solid gray; margin: 0 4px', type: 'text', value: '' },
        { label: 'link', lblStyle: 'max-width: 30px', inpStyle: 'border-bottom: 1px solid gray; margin: 0 4px', type: 'text', value: '' },
    ],
    blockItems: [
        { label: 'iframe', lblStyle: 'min-width: 70px; max-width: 70px', type: 'checkbox', value: 'true' },
        { label: 'width', inpStyle: 'border-bottom: 1px solid gray', lblStyle: 'min-width: 70px; max-width: 70px', type: 'number', value: '300' },
        { label: 'height', inpStyle: 'border-bottom: 1px solid gray', lblStyle: 'min-width: 70px; max-width: 70px', type: 'number', value: '200' },
        { label: 'code:', isLabel: true, hideIcon: true },
        { label: 'value', type: 'textarea', value: '', style: 'height: 200px' },
    ],
    latexItems: [
        { label: 'latex', type: 'textarea', value: '\\sqrt[n]{1+x+x^2+x^3+...+x^n}', style: { height: '200px' } }
    ],
    get listStyle() {
        return this.state?.listStyle ? this.listItems.find(i => i.listStyle === this.state.listStyle)?.label : ''
    },
    get size() {
        return this.state?.level ? this.titleItems.find(i => i.title === this.state.level)?.label : 'Text'
    },
    get directionsItems() {
        return [
            { label: 'vertical', classLbl: 'no-flex ml4', icon: 'bootstrap:file' },
            { label: 'horizontal', classLbl: 'no-flex ml4', icon: 'bootstrap:textarea-resize' }
        ]
    },
    get paperSizeItems() {
        return [
            { label: 'A5', psize: '565*796' },
            { label: 'A4', psize: '794*1123' },
            { label: 'A3', psize: '1125*1593' },
            { label: 'A2', psize: '1593*2251' },
            { label: 'Envelope 5', psize: '412*488' },
            { label: 'Envelope 6', psize: '450*866' },
            { label: 'Envelope 7', psize: '609*862' },
            { label: 'Envelope 9', psize: '862*1221' },
            { label: 'Letter', psize: '813*1054' },
            { label: 'Legal', psize: '813*1266' }
        ]
    },
    get paperMarginItems() {
        return [
            { label: 'top', lblStyle: 'min-width: 70px', icon: '', type: 'number', value: 20 },
            { label: 'bottom', lblStyle: 'min-width: 70px', icon: '', type: 'number', value: 20 },
            { label: 'left', lblStyle: 'min-width: 70px', icon: '', type: 'number', value: 20 },
            { label: 'right', lblStyle: 'min-width: 70px', icon: '', type: 'number', value: 20 },
        ]
    },
    get modeItems() {
        return [
            { label: 'continuity' },
            { label: 'linkage' },
            { label: 'paging' }
        ]
    },
    get watermarkItems() {
        return [
            { label: 'text', lblStyle: 'max-width: 40px; min-width: 40px', type: 'text', value: '', classInp: 'w100 m4', inpStyle: 'border-bottom: 1px solid gray' },
            { label: 'color', inpStyle: 'width: 50%', type: 'color', value: '#AEB5C0' },
            { label: 'size', lblStyle: 'width: 50%', type: 'number', value: '200' },
        ]
    },
    codeItems: [
        { label: 'code', type: 'textarea', value: '', style: { height: '200px' } }
    ],
    barcodeItems: [
        { label: 'content:', isLabel: true, hideIcon: true },
        { label: 'code', type: 'textarea', value: '12345678901234567890', style: { height: '60px' } },
        { label: 'width', inpStyle: 'border-bottom: 1px solid gray', lblStyle: 'min-width: 70px; max-width: 70px', type: 'number', value: '200' },
        { label: 'height', inpStyle: 'border-bottom: 1px solid gray', lblStyle: 'min-width: 70px; max-width: 70px', type: 'number', value: '100' },
    ],
    qrcodeItems: [
        { label: 'content:', isLabel: true, hideIcon: true },
        { label: 'code', type: 'textarea', value: 'https://odajs.org/components/editors/rich-text-editor/', style: { height: '60px' } },
        { label: 'width', inpStyle: 'border-bottom: 1px solid gray', lblStyle: 'min-width: 70px; max-width: 70px', type: 'number', value: '200' },
        { label: 'height', inpStyle: 'border-bottom: 1px solid gray', lblStyle: 'min-width: 70px; max-width: 70px', type: 'number', value: '200' },
    ],
    get dirUrl() { return this.editor?.command.getOptions().paperDirection === 'horizontal' ? 'bootstrap:textarea-resize' : 'bootstrap:file' },
    getValue() {
        let data = this.editor.command.getValue();
        data = JSON.stringify({ value: data }, null, '\t');
        return data;
    },
    setValue(v) {
        if (this.editor) {
            const src = v ? JSON.parse(v) : '';
            if (src?.value?.data)
                this.editor.command.executeSetValue(src.value.data);
        }
    },
    attached() {
        this.async(() => {
            option.watermark = this.watermark || option.watermark;
            this.iframe = this.$('iframe');
            this.iframe.addEventListener("load", () => {
                const doc = this.iframe.contentDocument;
                this.editor = doc.$editor;
                this.editor.doc = doc;
                this.editor.listener.rangeStyleChange = (state) => {
                    this.state = state;
                }
                this.editor.listener.contentChange = () => {
                    if (this.isReady)
                        this.fire('change');
                }
                this.editor.listener.pageScaleChange = (e) => {
                    this._scale = `${Math.floor(e * 10 * 10)}%`;
                }
                this.load();
            })
            this.iframe.srcdoc = srcDoc;
        }, 100)
    },
    _exe(cmd) { this.editor.command['execute' + cmd]?.() },
    _tap(i, e) {
        // console.log(i);
        const ed = this.editor, cmd = ed?.command, doc = ed?.doc;
        if (!ed) return;
        const cmds = {
            font: () => { cmd.executeFont(e.detail.value.value) },
            title: () => { cmd.executeTitle(e.detail.value.result.$item.title || null) },
            size: () => { cmd.executeSize(Number(e.detail.value.value || 16)) },
            rowmargin: () => { cmd.executeRowMargin(Number(e.detail.value.value || 1)) },
            list: () => { cmd.executeList(e.detail.value.result.$item.listType || null, e.detail.value.result.$item.listStyle || null) },
            color: () => { cmd.executeColor(e.detail.value) },
            highlight: () => { cmd.executeHighlight(e.detail.value) },
            left: () => { cmd.executeRowFlex(doc.RowFlex.LEFT) },
            center: () => { cmd.executeRowFlex(doc.RowFlex.CENTER) },
            right: () => { cmd.executeRowFlex(doc.RowFlex.RIGHT) },
            alignment: () => { cmd.executeRowFlex(doc.RowFlex.ALIGNMENT) },
            table: async () => { cmd.executeInsertTable(e.detail.value.result.row, e.detail.value.result.column) },
            image: () => {
                const file = e.target.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    const image = new Image();
                    const value = fileReader.result;
                    image.src = value;
                    image.onload = () => {
                        cmd.executeImage({
                            value,
                            width: image.width,
                            height: image.height
                        })
                        this.$('#image').value = '';
                    }
                }
            },
            link: async () => {
                cmd.executeHyperlink({
                    type: 'hyperlink',
                    value: e.detail.value.result.text,
                    icon: e.detail.value.result.link,
                    valueList: e.detail.value.result.text.split('').map(n => ({
                        value: n,
                        size: 16
                    }))
                })
            },
            checkbox: () => {
                this.editor.command.executeInsertElementList([
                    {
                        type: doc.ElementType.CHECKBOX,
                        value: ''
                    }
                ])
            },
            date: () => {
                console.log(this._fullDate)
                const date = new Date(),
                    year = date.getFullYear().toString(),
                    month = (date.getMonth() + 1).toString().padStart(2, '0'),
                    day = date.getDate().toString().padStart(2, '0'),
                    hour = date.getHours().toString().padStart(2, '0'),
                    minute = date.getMinutes().toString().padStart(2, '0'),
                    second = date.getSeconds().toString().padStart(2, '0'),
                    dateString = `${year}-${month}-${day}`,
                    dateTimeString = `${dateString} ${hour}:${minute}:${second}`,
                    value = this.fullDate ? dateTimeString : dateString;
                cmd.executeInsertElementList([
                    {
                        type: doc.ElementType.DATE,
                        value,
                        dateFormat: this.dateFormat || 'yyyy-MM-dd',
                        valueList: [
                            {
                                value: value.trim()
                            }
                        ]
                    }
                ])
            },
            latex: async () => {
                cmd.executeInsertElementList([{ type: doc.ElementType.LATEX, value: e.detail.value.result.latex }]);
            },
            block: async () => {
                const res = e.detail.value.result;
                const block = { type: res.iframe ? 'iframe' : 'video' }
                if (block.type === 'iframe') {
                    block.iframeBlock = { src: res.value }
                } else if (block.type === 'video') {
                    block.videoBlock = { src: res.value }
                }
                const blockElement = {
                    type: doc.ElementType.BLOCK,
                    value: '',
                    height: Number(res.height),
                    block
                }
                if (res.width) {
                    blockElement.width = Number(res.width);
                }
                cmd.executeInsertElementList([blockElement]);
            },
            separator: () => {
                let payload = [];
                let separator = ['0,0', '1,1', '3,1', '4,4', '7,3,3,3', '6,2,2,2,2,2'];
                this._curSeparator ||= 0;
                const separatorDash = separator[this._curSeparator].split(',').map(Number);
                if (separatorDash) {
                    const isSingleLine = separatorDash.every(d => d === 0)
                    if (!isSingleLine) {
                        payload = separatorDash
                    }
                }
                cmd.executeSeparator(payload);
                this._curSeparator += 1;
                this._curSeparator = this._curSeparator >= separator.length ? 0 : this._curSeparator;
            },
            pageBreak: () => { cmd.executePageBreak() },
            directions: () => { cmd.executePaperDirection(e.detail.value.result.$item.label) },
            paperSize: () => { cmd.executePaperSize(e.detail.value.result.$item.psize.split('*')[0], e.detail.value.result.$item.psize.split('*')[1]) },
            paperMargin: () => {
                cmd.executeSetPaperMargin([
                    Number(e.detail.value.result.top || 20),
                    Number(e.detail.value.result.right || 20),
                    Number(e.detail.value.result.bottom || 20),
                    Number(e.detail.value.result.left || 20)
                ])
            },
            clearAll: () => {
                if (!confirm('Clear all data ?')) return;
                this.setValue(JSON.stringify({ value: { data: { "header": [], "main": [], "footer": [] } } }));
                cmd.executePaperDirection('vertical');
                cmd.executeSetPaperMargin([20, 20, 20, 20]);
                cmd.executePaperSize(794, 1193);
                cmd.executeDeleteWatermark();
                this._exe('PageScaleRecovery');
            },
            pageMode: () => {
                this._pageMode = e.detail.value.value;
                cmd.executePageMode(this._pageMode)
            },
            watermarks: () => {
                if (!e.detail.value.result.text) {
                    cmd.executeDeleteWatermark();
                } else {
                    cmd.executeAddWatermark({
                        data: e.detail.value.result.text,
                        color: e.detail.value.result.color,
                        size: Number(e.detail.value.result.size)
                    })
                }
            },
            code: async () => {
                cmd.executeInsertCodeblock(e.detail.value.result.code);
            },
            barcode: async () => {
                cmd.executeInsertBarcode1D(e.detail.value.result.code, Number(e.detail.value.result.width || 200), Number(e.detail.value.result.height || 100));
            },
            qrcode: async () => {
                cmd.executeInsertBarcode2D(e.detail.value.result.code, Number(e.detail.value.result.width || 200), Number(e.detail.value.result.height || 100));
            },
            print: () => {
                if (!this._pageMode || this._pageMode === 'continuity') {
                    if (confirm('Continuous page mode is set, in this mode all print data will be placed on one page. Are we printing?'))
                        cmd.executePrint();
                } else {
                    cmd.executePrint();
                }
            }
        }
        cmds[i]?.();
    },
    fill() {
        if (!this.fillData)
            return;
        if (!this.fireOnFill)
            this.isReady = false;
        const value = this.editor.command.getValue(),
            data = {};
        for (const key in value.data) {
            let val = value.data[key];
            val.map(i => {
                for (let key in this.fillData) {
                    i.value = i.value.replace('{' + key + '}', this.fillData[key]);
                }
                data[key] ||= [];
                data[key].push(i);
                let num;
                if (i.type === 'table') {
                    let trList, fillDataTable;
                    i.trList.map(tr => {
                        if (tr.tdList[0].value?.[0]?.value.startsWith('{#')) {
                            trList = i.trList;
                            num = tr.tdList[0].value[0].value.split('-')[0].replace('{#', '');
                            fillDataTable = this.fillDataTables?.['table' + num].main;
                        } else {
                            tr.tdList.map(td => {
                                td.value.map(v => {
                                    for (let key in this.fillData)
                                        v.value = v.value.replace('{' + key + '}', this.fillData[key]);
                                })
                            })
                        }
                    })
                    if (trList) {
                        let str = JSON.stringify(trList[1]);
                        trList.splice(1, 1);
                        let count = fillDataTable.length || 0;
                        for (let i = 0; i < count; i++) {
                            let row = JSON.parse(str)
                            let fill = fillDataTable[i]
                            row.tdList.map(td => {
                                td.value.map(v => {
                                    for (let key in fill)
                                        v.value = v.value.replace('{#' + num + '-' + key + '}', fill[key]);
                                })
                            })
                            trList.splice(-1, 0, row);
                        }
                    }
                }
            })
        }
        this.editor.command.executeSetValue(data);
        this.async(() => this.isReady = true, 500);
    },
    async load(src = this.src, e) {
        if (!src && !e) return;
        if (!e && typeof src === 'string') {
            let response = await fetch(src);
            src = await response.text();
            src = await JSON.parse(src);
            if (this.editor) {
                if (src?.value?.data)
                    this.editor.command.executeSetValue(src.value.data);
            }
        } else {
            const file = e.target.files[0] || src;
            const reader = new FileReader();
            reader.onload = async e => {
                src = await JSON.parse(e.target.result);
                if (src?.value?.data)
                    this.editor.command.executeSetValue(src.value.data);
            }
            reader.readAsText(file, 'UTF-8');
        }
        this.$('#files').value = null;
        if (this.isReady)
            this.fire('change');
        this.async(() => this.isReady = true, 1000);
    },
    save() {
        let data = this.editor.command.getValue();
        data = JSON.stringify({ value: data }, null, '\t');
        if (!data) return;
        const blob = new Blob([data], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = ('template') + '.json';
        a.click();
    }
})

const ILang = {
    contextmenu: {
        global: {
            cut: 'cut',
            copy: 'copy',
            paste: 'paste',
            selectAll: 'select All',
            print: 'print'
        },
        control: {
            delete: 'delete'
        },
        hyperlink: {
            delete: 'delete',
            cancel: 'cancel',
            edit: 'edit'
        },
        image: {
            change: 'change',
            saveAs: 'change',
            textWrap: 'change',
            textWrapType: {
                embed: 'embed',
                upDown: 'upDown'
            }
        },
        table: {
            insertRowCol: 'insertRowCol',
            insertTopRow: 'insertTopRow',
            insertBottomRow: 'insertBottomRow',
            insertLeftCol: 'insertLeftCol',
            insertRightCol: 'insertRightCol',
            deleteRowCol: 'deleteRowCol',
            deleteRow: 'deleteRow',
            deleteCol: 'deleteCol',
            deleteTable: 'deleteTable',
            mergeCell: 'mergeCell',
            mergeCancelCell: 'mergeCancelCell',
            verticalAlign: 'verticalAlign',
            verticalAlignTop: 'verticalAlignTop',
            verticalAlignMiddle: 'verticalAlignMiddle',
            verticalAlignBottom: 'verticalAlignBottom',
            border: 'border',
            borderAll: 'borderAll',
            borderEmpty: 'borderEmpty',
            borderExternal: 'borderExternal',
            borderTd: 'borderTd',
            borderTdBottom: 'borderTdBottom'
        }
    },
    datePicker: {
        now: 'now',
        confirm: 'confirm',
        return: 'return',
        timeSelect: 'timeSelect',
        weeks: {
            sun: 'sun',
            mon: 'mon',
            tue: 'tue',
            wed: 'wed',
            thu: 'thu',
            fri: 'fri',
            sat: 'sat',
        },
        year: 'year',
        month: 'month',
        hour: 'hour',
        minute: 'minute',
        second: 'second'
    },
    frame: {
        header: 'header',
        footer: 'footer'
    },
    pageBreak: {
        displayName: 'page break'
    }
}
const option = {
    width: 794, // Paper width. default: 794
    height: 1123, // Paper height. default: 1123
    margins: [20, 20, 20, 20], // Page margins. default: [100, 120, 100, 120]
    pageMode: 'continuity', // Paper mode: continuity, Linkage, Pagination. default: Pagination
    pageGap: 0,
    marginIndicatorSize: 5, // The margin indicator length. default: 35
    marginIndicatorColor: 'transparent', // The margin indicator color. default: #BABABA
    pageNumber: {
        disabled: true, // Whether to disable
        bottom: 10, // The size from the bottom of the page.default: 60
        size: 12, // font size.default: 12
        font: 'Yahei', // font.default: Yahei
        color: '#000000', // font color.default: #000000
        // rowFlex: 'CENTER', // Line alignment.default: CENTER
        format: '{pageNo}', // Page number format.default: {pageNo}。example：{pageNo}/{pageCount}
        numberType: 'ARABIC', // The numeric type. default: ARABIC
        startPageNo: 1, // Start page number.default: 1
        fromPageNo: 0 // Page numbers appear from page number.default: 0
    },
    header: {
        // disabled: true, // Whether to disable
        top: 10, // Size from the top of the page.default: 30
        maxHeightRadio: 'HALF' // Occupies the maximum height ratio of the page.default: HALF
    },
    footer: {
        // disabled: true, // Whether to disable
        bottom: 0, // The size from the bottom of the page.default: 30
        maxHeightRadio: 'HALF' // Occupies the maximum height ratio of the page.default: HALF
    },
    watermark: {
        data: '', // text.
        color: '#AEB5C0', // color.default: #AEB5C0
        opacity: '0.3', // transparency.default: 0.3
        size: 200, // font size.default: 200
        font: 'Yahei' // font.default: Yahei
    }
}
const srcDoc = `
<style>
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); }
    ::-webkit-scrollbar-thumb { border-radius: 10px; background: var(--body-background); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
    ::-webkit-scrollbar-thumb:hover { @apply --dark; width: 16px; }
</style>
<div style="display: flex; justify-content: center; position: relative; width: 100%; height: 100%;">
    <div class="canvas-editor" style="box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);"></div>
</div>
<script type="module">
    import { Editor, RowFlex, ElementType } from '${libPath}canvas-editor.es.js';
    import codeblockPlugin from '${libPath}plugins/codeblock.js';
    import barcodePlugin from '${libPath}plugins/barcode1d.js';
    import qrcodePlugin from '${libPath}plugins/barcode2d.js';
    const instance = new Editor(document.querySelector('.canvas-editor'), [], ${JSON.stringify(option)});
    instance.register.langMap('rus', ${JSON.stringify(ILang)});
    instance.command.executeSetLocale('rus');
    instance.use(codeblockPlugin);
    instance.use(barcodePlugin);
    instance.use(qrcodePlugin);
    document.$editor = instance;
    document.RowFlex = RowFlex;
    document.ElementType = ElementType;
</script>
`

ODA({ is: 'oda-txt-picker-oklch',
    template: `
        <style>
            :host {
                @apply --horizontal;
                position: relative;
            }
        </style>
        <div class="border" style="width: 20px; height: 20px; cursor: pointer;" ~style="{background: value}" @tap="openPicker"></div>
    `,
    value: '',
    async openPicker(e) {
        let val = this.value,
        light, dark;
        if (val.includes('light-dark')) {
            let v = val.replace('light-dark(', '').replaceAll(')', '').split(',');
            dark = v[1];
            light = v[0];
            val = isDark ? dark : light;
        }
        let res = await ODA.showDropdown('oda-color-picker-oklch', { value: val, _value: val }, { });
        res = res.result;
        if (res) {
            this.value = res;
            this.fire('change', this.value);
        }
    }
})
