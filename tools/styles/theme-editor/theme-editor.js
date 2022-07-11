ODA({is: 'oda-theme-editor', imports: '@oda/app-layout, @oda/color-picker, @oda/table, @tools/property-grid', extends: 'oda-app-layout',
    template: /*html*/`
        <style>
            :host {
                height: 100%;
                filter: {{filter}};
            }
            ._header {
                width: 100%;
                height: 32px;
                margin-bottom: 4px;
            }
            ._label {
                font-size: large;
                text-decoration: underline;
                margin: 8px;
                color: {{contentColor}};
            }
        </style>
        <div slot="title" class="horizontal flex header border">
            <div class="flex"></div>
            <div>
                <div style="font-size:x-large">oda-theme-editor-000</div>
            </div>
            <div class="flex"></div>
        </div>
        <div slot="left-panel" class="vertical flex border" style="overflow: auto;">
            <oda-button ~for="themes" @tap="theme = item">{{item}}</oda-button>
        </div>
        <div slot="main" class="vertical flex" style="margin:10px; border: 1px solid lightgray; position: relative; width: 100%;">
            <div class="_header horizontal header border" style="justify-content: center">Header</div>
            <div class="flex _main vertical">
                <div class="center no-flex _label">Main</div>
                <div class="flex horizontal">
                    <div class="vertical flex shadow border" style="margin: 12px; padding: 4px;">
                        <div class="_label">Icons:</div>
                        <div class="buttons horizontal">
                            <oda-icon icon="icons:search" class="content" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:code" class="accent" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:check-box" class="success" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:warning" class="warning" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:error" class="error" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:info" class="info" style="margin: 4px"></oda-icon>
                        </div>
                        <div class="_label">Icons (invert):</div>
                        <div class="buttons horizontal">
                            <oda-icon icon="icons:search" class="content-invert" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:code" class="accent-invert" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:check-box" class="success-invert" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:warning" class="warning-invert" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:error" class="error-invert" style="margin: 4px"></oda-icon>
                            <oda-icon icon="icons:info" class="info-invert" style="margin: 4px"></oda-icon>
                        </div>
                        <div  class="_label">Buttons:</div>
                        <div class="buttons horizontal">
                            <oda-button class="content" style="margin: 4px; width: 62px;">Normal</oda-button>
                            <oda-button class="accent" style="margin: 4px; width: 62px;">Accent</oda-button>
                            <oda-button class="success" style="margin: 4px; width: 62px;">Succes</oda-button>
                            <oda-button class="warning" style="margin: 4px; width: 62px;">Warning</oda-button>
                            <oda-button class="error" style="margin: 4px; width: 62px;">Error</oda-button>
                            <oda-button class="info" style="margin: 4px; width: 62px;">Info</oda-button>
                        </div>
                        <div class="buttons horizontal">
                            <oda-button class="content border" style="margin: 4px; width: 60px;">Normal</oda-button>
                            <oda-button class="accent border" style="margin: 4px; width: 60px;">Accent</oda-button>
                            <oda-button class="success border" style="margin: 4px; width: 60px;">Succes</oda-button>
                            <oda-button class="warning border" style="margin: 4px; width: 60px;">Warning</oda-button>
                            <oda-button class="error border" style="margin: 4px; width: 60px;">Error</oda-button>
                            <oda-button class="info border" style="margin: 4px; width: 60px;">Info</oda-button>
                        </div>
                        <div class="buttons horizontal">
                            <oda-button class="content content-invert" style="margin: 4px; width: 62px;">Normal</oda-button>
                            <oda-button class="accent accent-invert" style="margin: 4px; width: 62px;">Accent</oda-button>
                            <oda-button class="success success-invert" style="margin: 4px; width: 62px;">Succes</oda-button>
                            <oda-button class="warning warning-invert" style="margin: 4px; width: 62px;">Warning</oda-button>
                            <oda-button class="error error-invert" style="margin: 4px; width: 62px;">Error</oda-button>
                            <oda-button class="info info-invert" style="margin: 4px; width: 62px;">Info</oda-button>
                        </div>
                    </div>
                    <div class="vertical flex shadow border" style="overflow:hidden; margin: 12px 18px 12px 0px;">
                        <oda-table ref="table" allow-check="double" lazy col-lines row-lines show-footer show-group-footer show-header allow-focus allow-selection allow-sort even-odd style="height: 100px"></oda-table>
                    </div>
                </div>
            </div>
            <div class="_header horizontal header border" style="justify-content: center">Footer</div>
        </div>
        <oda-property-grid slot="right-panel" class="vertical flex border" label="Theme settings" :inspected-object="this" style="padding:0"></oda-property-grid>
    `,
    props: {
        themes: Array,
        theme: {
            category: 'themes',
            type: String,
            list: ['light', 'dark', 'carmine', 'dark moon', 'soft blue', 'dark violet', 'green mist'],
            default: 'light',
            set(n) {
                const fn = {
                    'light': () => {
                        this.backgroundColor = '#F0F0F0';
                        this.contentColor = '#0F0F0F';

                    },
                    'dark': () => {
                        this.backgroundColor = '#0F0F0F';
                        this.contentColor = '#F0F0F0';
                    },
                    'carmine': () => {
                        this.backgroundColor = '#960018';
                        this.contentColor = '#DDACB4';
                    },
                    'dark moon': () => {
                        this.backgroundColor = 'gray';
                        this.contentColor = 'lightgray';
                    },
                    'soft blue': () => {
                        this.backgroundColor = 'lightblue';
                        this.contentColor = 'blue';
                    },
                    'dark violet': () => {
                        this.backgroundColor = 'darkviolet';
                        this.contentColor = 'lavender';
                    },
                    'green mist': () => {
                        this.backgroundColor = 'lightgreen';
                        this.contentColor = 'green';
                    }
                }
                if (fn[n]) fn[n]();
            }
        },

        filters: {
            label: 'Filters',
            category: 'filters',
            type: String,
            list: ['none', 'invert(1)', 'brightness(0.9)', 'blur(1px)', 'contrast(1.5)', 'grayscale(1)'],
            set(v) {
                if (v) {
                    if (v === 'none') {
                        this.filter = '';
                    } else {
                        if (this.filter.includes(v))
                            this.filter = this.filter.replace(v + ' ', '');
                        else
                            this.filter += v + ' ';
                    }
                    setTimeout(() => {
                        this.filters = '';
                    }, 100);
                }
            }
        },
        filter: {
            label: 'Style filter',
            category: 'filters',
            type: String
        },

        contentColor: {
            label: '--content-color',
            category: 'Basic settings',
            type: String,
            editor: '@oda/color-picker',
            default: '#0F0F0F',
            set(v) {
                if (v) ODA.updateStyle({ '--content-color': v });
            }
        },
        backgroundColor: {
            label: '--content-background',
            category: 'Basic settings',
            type: String,
            editor: '@oda/color-picker',
            default: '#F0F0F0',
            set(v) {
                if (v) ODA.updateStyle({ '--content-background': v });
            }
        },
        accentColor: {
            label: '--accent-color',
            category: 'Basic settings',
            type: String,
            editor: '@oda/color-picker',
            default: '#0000FF',
            set(v) {
                if (v) ODA.updateStyle({ '--accent-color': v });
            }
        },
        succesColor: {
            label: '--success-color',
            category: 'Basic settings',
            type: String,
            editor: '@oda/color-picker',
            default: '#00FF00',
            set(v) {
                if (v) ODA.updateStyle({ '--success-color': v });
            }
        },
        warningColor: {
            label: '--warning-color',
            category: 'Basic settings',
            type: String,
            editor: '@oda/color-picker',
            default: '#FFA500',
            set(v) {
                if (v) ODA.updateStyle({ '--warning-color': v });
            }
        },
        errorColor: {
            label: '--error-color',
            category: 'Basic settings',
            type: String,
            editor: '@oda/color-picker',
            default: '#FF0000',
            set(v) {
                if (v) ODA.updateStyle({ '--error-color': v });
            }
        },
        infoColor: {
            label: '--info-color',
            category: 'Basic settings',
            type: String,
            editor: '@oda/color-picker',
            default: '#8A2BE2',
            set(v) {
                if (v) ODA.updateStyle({ '--info-color': v });
            }
        },
        borderColor: {
            label: '--border-color',
            category: 'Basic settings',
            type: String,
            editor: '@oda/color-picker',
            default: '#808080',
            set(v) {
                if (v) ODA.updateStyle({ '--border-color': v });
            }
        },
        borderRadius: {
            label: '--border-radius',
            category: 'Basic settings',
            type: String,
            default: '0px',
            set(v) {
                if (v) ODA.updateStyle({ '--border-radius': v });
            }
        },

        headerColor: {
            label: '--header-color',
            category: 'colors',
            type: String,
            editor: '@oda/color-picker',
            default: '#0F0F0F',
            set(v) {
                if (v) ODA.updateStyle({ '--header-color': v });
            }
        },
        headerBackground: {
            label: '--header-background',
            category: 'colors',
            type: String,
            editor: '@oda/color-picker',
            default: '#C0C0C0',
            set(v) {
                if (v) ODA.updateStyle({ '--header-background': v });
            }
        },
        darkColor: {
            label: '--dark-color',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#FFFFFF',
            set(v) {
                if (v) ODA.updateStyle({ '--dark-color': v });
            }
        },
        darkBackground: {
            label: '--dark-background',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#808080',
            set(v) {
                if (v) ODA.updateStyle({ '--dark-background': v });
            }
        },
        focusedColor: {
            label: '--focused-color',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#0000FF',
            set(v) {
                if (v) ODA.updateStyle({ '--focused-color': v });
            }
        },
        selectedColor: {
            label: '--selected-color',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#000080',
            set(v) {
                if (v) ODA.updateStyle({ '--selected-color': v });
            }
        },
        selectedBackground: {
            label: '--selected-background',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#C0C0C0',
            set(v) {
                if (v) ODA.updateStyle({ '--selected-background': v });
            }
        },
        bodyColor: {
            label: '--body-color',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#555555',
            set(v) {
                if (v) ODA.updateStyle({ '--body-color': v });
            }
        },
        bodyBackground: {
            label: '--body-background',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#C0C0C0',
            set(v) {
                if (v) ODA.updateStyle({ '--body-background': v });
            }
        },
        sectionColor: {
            label: '--section-color',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#D3D3D3',
            set(v) {
                if (v) ODA.updateStyle({ '--section-color': v });
            }
        },
        sectionBackground: {
            label: '--section-background',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#000000',
            set(v) {
                if (v) ODA.updateStyle({ '--section-background': v });
            }
        },
        layoutColor: {
            label: '--layout-color',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#f5f5f5',
            set(v) {
                if (v) ODA.updateStyle({ '--layout-color': v });
            }
        },
        layoutBackground: {
            label: '--layout-background',
            category: 'colors',
            editor: '@oda/color-picker',
            type: String,
            default: '#000000',
            set(v) {
                if (v) ODA.updateStyle({ '--layout-background': v });
            }
        },

        categories: {
            type: Array,
            default: ['themes', 'filters', 'Basic settings', 'colors'],
            shared: true
        },
        showButtons: {
            type: Boolean,
            default: false,
            shared: true
        }
    },
    attached() {
        setTimeout(() => {
            this.themes = this.props.theme.list;
            this.$refs.table.columns = [
                { fix: 'left', width: 16 },
                { name: 'right', fix: 'right' },
                { name: 'col1', treeMode: true },
                { name: 'number', summary: 'sum' },
                { name: 'left', fix: 'left' }
            ];
            this.$refs.table.dataSet = [
                { col1: "1 строка", number: 12345.6789 },
                { col1: "2 строка", number: 56789.1234 },
                { col1: "3 строка" },
                { col1: "4 строка" },
                { col1: "5 строка" },
                { col1: "6 строка" },
                { col1: "7 строка", items: [{ col1: 'новая строка' }] },
                { col1: "8 строка" },
                { col1: "9 строка" },
                { col1: "10 строка" },
            ];
        }, 500);
    }
})
