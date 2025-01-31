const distPath = import.meta.url.split('/').slice(0, -1).join('/') + '/dist/';

ODA({ is: 'oda-jspreadsheet-editor',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <iframe style="border: none; width: 100%; height: 100%;"></iframe>
    `,
    $public: {
        toolbar: {
            $def: false,
            set(n) {
                this.setEditor();
            }
        },
        tabs: {
            $def: false,
            set(n) {
                this.setEditor();
            }
        },
        types: '', // '[{}, {}, { "0": "dropdown", "1": "text", "2": "numeric", "3": "hidden", "4": "dropdown", "5": "checkbox", "6": "radio", "7": "calendar", "8": "image", "9": "color", "10": "html" }]'
        list: '', // '[{}, {}, { "4": ["alfa romeo", "audi", "bmw", "honda"], "0": ["001", "002", "003"] }]'
        masks: '' // '[{}, {}, { "2": "#.##0,00" }]'
    },
    worksheets: undefined,
    get data() {
        const parse = (str) => {
            try {
                return JSON.parse(str);
            } catch (err) { console.log(err) }
        }
        let types, list, masks,
            worksheets = '[{ minDimensions: [5, 1] }]';
        if (this.worksheets) {
            worksheets = this.worksheets;
            if (typeof worksheets == "string") {
                worksheets = parse(worksheets);
            }
            if (this.types) {
                types = parse(this.types);
                (types || []).map((i, idx) => {
                    (Object.keys(i)).map(k => {
                        if (worksheets[idx]?.columns?.[+k])
                            worksheets[idx].columns[+k].type = i[k];
                    })
                })
            }
            if (this.list) {
                list = parse(this.list);
                (list || []).map((i, idx) => {
                    (Object.keys(i)).map(k => {
                        if (worksheets[idx]?.columns?.[+k])
                            worksheets[idx].columns[+k].source = i[k];
                    })
                })
            }
            if (this.masks) {
                masks = parse(this.masks);
                (masks || []).map((i, idx) => {
                    (Object.keys(i)).map(k => {
                        if (worksheets[idx]?.columns?.[+k])
                            worksheets[idx].columns[+k].mask = i[k];
                    })
                })
            }
            worksheets = JSON.stringify(worksheets);
        }
        return `{
            worksheets: ${worksheets},
            tabs: ${this.tabs},
            toolbar: ${this.toolbar}
        }`
    },
    attached() {
        this.setEditor();
    },
    setEditor() {
        const iframe = this.$('iframe');
        if (iframe) {
            iframe.srcdoc = '';
            this.async(() => {
                iframe.onload = () => {
                    iframe.contentDocument.addEventListener("change", (e) => {
                        this.value = e.detail;
                        // console.log(e.detail)
                        this.fire('change', e.detal);
                    })
                    iframe.contentDocument.addEventListener("pointerdown", (e) => {
                        this.fire('sheet-tap');
                    })
                    this.grid = iframe.contentWindow.gridJspreadsheet;
                }
                iframe.srcdoc = this.srcdoc(this.data);
            })
        }
    },
    srcdoc(src) {
        return `
<script src="${distPath}jspreadsheet.js"></script>
<script src="${distPath}jsuites.js"></script>
<link rel="stylesheet" href="${distPath}jspreadsheet.css" type="text/css" />
<link rel="stylesheet" href="${distPath}jsuites.css" type="text/css" />
<style>
    * {
        font-family: Roboto, Tahoma, Verdana, sans-serif;
    }
    @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url(${distPath}woff.woff2) format('woff2');
    }
    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
    }
</style>

<div id="spreadsheet"></div>

<script>
    const copy = () => {
        // return JSON.stringify(grid[0].parent.getConfig(), null, 4);
        return grid[0].parent.getConfig();
    }
    let grid = window.gridJspreadsheet = jspreadsheet(document.getElementById('spreadsheet'), ${src});
    grid[0].parent.config.onchange = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.oninsertrow = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.ondeleterow = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.oninsertcolumn = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.ondeletecolumn = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onmoverow = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onmovecolumn = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onresizerow = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onresizecolumn = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onmerge = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onchangeheader = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onchangestyle = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onchangemeta = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onundo = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.onredo = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
    grid[0].parent.config.oncomments = () => { document.dispatchEvent(new CustomEvent('change', { detail: copy() })) }
</script>
        `
    }
})
