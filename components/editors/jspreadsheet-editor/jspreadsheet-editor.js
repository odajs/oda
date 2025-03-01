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
                if (n)
                    this.grid[0].parent.showToolbar();
                else
                    this.grid[0].parent.hideToolbar();
            }
        },
        tabs: {
            $def: false,
            set(n) {
                this.setEditor();
            }
        }
    },
    worksheetsDefault: '[{ minDimensions: [5, 1] }]',
    value: {
        get() {
            return this.worksheets;
        },
        set(n) {
            if (n) {
                if (Array.isArray(n))
                    n = JSON.stringify(v.worksheets || n);
                this.worksheets = n;
            }
        }
    },
    worksheets: undefined,
    get data() {
        let worksheets = this.worksheets || this.worksheetsDefault;
        if (Array.isArray(worksheets))
            try {
                worksheets = JSON.stringify(worksheets);
            } catch (err) { 
                console.error('Error stringify JSON:', err);
                worksheets = this.worksheets || this.worksheetsDefault;
            }

        const data = `{
            worksheets: ${worksheets},
            tabs: ${this.tabs},
            toolbar: true,
            contextMenu: function(o, x, y, e, items, section) {
                if (section == 'tabs') {
                    console.log(x)
                    items.unshift({ type: 'line' });
                    items.unshift({ 
                        title: 'Set pagination',
                        onclick: () => {
                            o.options.pagination = (prompt('Enter pagination', o.options.pagination || '10') || '');
                            elGrid.worksheets = JSON.stringify(o.parent.getConfig().worksheets);
                            setTimeout(() => elGrid.setEditor(x), 100);
                        } 
                    })
                }
                if (section == 'header') {
                    const fn = (type) => {
                        o.options.columns[x].type = type;
                        if (type === 'color') o.options.columns[x].render = 'square';
                        elGrid.worksheets = JSON.stringify(o.parent.getConfig().worksheets);
                        setTimeout(() => elGrid.setEditor(x), 100);
                    }
                    items.unshift({ type: 'line' });
                    items.unshift({ 
                        title: 'Set list',
                        onclick: () => {
                            o.options.columns[x].source = (prompt('Enter list', o.options.columns[x].source.join(', ') || 'value1, value2') || '').split(',');
                        } 
                    });
                    items.unshift({ 
                        title: 'Set mask',
                        onclick: () => {
                            o.options.columns[x].mask = prompt('Enter mask', o.options.columns[x].mask || '#.##0,00');
                        }
                    });

                    items.unshift({ 
                        title: 'Set type',
                        submenu: [ 
                            { title: 'text', onclick: (e) => { fn(e.outerText) } },
                            { title: 'numeric', onclick: (e) => { fn(e.outerText) } },
                            { title: 'dropdown', onclick: (e) => { fn(e.outerText) } },
                            { title: 'checkbox', onclick: (e) => { fn(e.outerText) } },
                            { title: 'radio', onclick: (e) => { fn(e.outerText) } },
                            { title: 'calendar', onclick: (e) => { fn(e.outerText) } },
                            { title: 'image', onclick: (e) => { fn(e.outerText) } },
                            { title: 'color', onclick: (e) => { fn(e.outerText) } },
                            { title: 'html', onclick: (e) => { fn(e.outerText) } }
                            ]
                        });
                    return items;
                }
            }
        }`
        // console.log(data);
        return data;
    },

    attached() {
        this.setEditor();
    },

    setEditor(x = 0) {
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
                    iframe.contentWindow.elGrid = this;
                    if (this.toolbar)
                        this.grid[0].parent.showToolbar();
                    else
                        this.grid[0].parent.hideToolbar();
                        this.grid[0].openWorksheet(x);
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
        return JSON.stringify(grid[0].parent.getConfig());
    }
    const createHandler = () => {
        document.dispatchEvent(new CustomEvent('change', { detail: copy() }));
    }
    let grid = window.gridJspreadsheet = jspreadsheet(document.getElementById('spreadsheet'), ${src});
    if (grid?.[0]?.parent) {
        const config = grid[0].parent.config;
        config.onchange = () => { createHandler() }
        config.oninsertrow = () => { createHandler() }
        config.ondeleterow = () => { createHandler() }
        config.oninsertcolumn = () => { createHandler() }
        config.ondeletecolumn = () => { createHandler() }
        config.onmoverow = () => { createHandler() }
        config.onmovecolumn = () => { createHandler() }
        config.onresizerow = () => { createHandler() }
        config.onresizecolumn = () => { createHandler() }
        config.onmerge = () => { createHandler() }
        config.onchangeheader = () => { createHandler() }
        config.onchangestyle = () => { createHandler() }
        config.onchangemeta = () => { createHandler() }
        config.onundo = () => { createHandler() }
        config.onredo = () => { createHandler() }
        config.oncreateworksheet = () => { createHandler() }
        config.ondeleteworksheet = () => { createHandler() }
        setTimeout(() => document.dispatchEvent(new CustomEvent('is-ok', { detail: grid })), 100)
    }
</script>
        `
    }
})
