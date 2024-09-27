let _vars;
class themeVars extends ROCKS({
    $public: (() => {
        const styles = {}, media = [];
        const fn = (rule, _scope = 'no-scope', isMedia = false) => {
            let scope = _scope;
            if (rule.selectorText === ':root') {
                styles[scope] ||= { rules: [] };
                styles[scope].rules.push({ rule });
                [...(rule?.style || [])].map(i => {
                    if (i === "--style-group") {
                        scope = _scope + '-' + rule.style.getPropertyValue(i).trim().replaceAll('\'', '');
                        styles[scope] ||= {}
                    }
                });
                [...(rule?.style || [])].map(propName => {
                    if (propName?.indexOf("--") === 0) {
                        const v = rule.style.getPropertyValue(propName).trim();
                        if (propName !== '--style-group') {
                            styles[scope].vars ||= [];
                            styles[scope].vars.push({ var: { [propName.trim()]: v }, isMedia });
                        }
                    }
                });
            }
        }
        [...top.document.styleSheets].map(sheet => {
            const scope = sheet.ownerNode.getAttribute('scope') || 'no-scope';
            [...sheet.cssRules].map(rule => {
                fn(rule, scope);
                if (rule?.media?.mediaText.includes("prefers-color-scheme")) {
                    [...rule.cssRules].map(rule => fn(rule, scope, true));
                }
            })
        })
        // console.log(styles)
        let vars = {}, groups = [];
        Object.keys(styles).map(s => {
            styles[s].vars?.map(v => {
                const key = Object.keys(v.var)[0],
                    val = Object.values(v.var)[0],
                    $group = key.split('-')[2];
                groups[$group] ||= [];
                groups[$group].push($group);
                vars[key] = {
                    $public: true,
                    $group,
                    $editor: key.includes('color') || key.includes('background') ? 'oda-theme-editor-color-picker' : 'oda-pg-string',
                    $def: val,
                    set: (n) => updateStyle(key, n)
                }
            })
        })
        Object.values(vars).map(i => {
            i.$group = groups[i.$group]?.length > 1 ? i.$group : ' ';
        })
        // console.log(vars);
        _vars = vars;
        return vars;
    })()
}) { }

let changes = {},
    isDark = false,
    themeEditor;
const updateStyle = (key, val) => {
    let newVal = val;
    changes[key] ||= {};
    changes[key].defVal ||= _vars[key].$def;
    if (_vars[key].$def?.includes('light-dark')) {
        val = val.replaceAll(',', ' ');
        // console.log(_vars[key].$def);
        let v = (_vars[key].$def).split('light-dark(');
        if (isDark) {
            val = 'light-dark(' + v[1].split(',')[0] + ', ' + val + ')';
        } else {
            val = 'light-dark(' + val + ', ' + v[1].split(',')[1];
        }
        // console.log(val)
    }
    ODA.updateStyle({ [key]: val });
    changes[key].val = val;
    changes[key].isDark = isDark;
    changes[key].newVal = newVal;
    if (themeEditor) {
        themeEditor.vars[key] = newVal;
        themeEditor.isChanged = true;
    }
    // console.log(changes)
}

ODA({ is: 'oda-theme-editor', imports: '@tools/property-grid, @oda/color-picker',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                background: var(--content-background);
            }
        </style>
        <div class="horizontal" ~if="!hideSwitchBtn" style="align-items: center; margin: 8px;" >
            <div>Switch Light/Dark mode: </div>
            <oda-toggle size="24" ::toggled></oda-toggle>
            <oda-button class="border" @tap="clearChanges">Clear changes</oda-button>
        </div>
        <div class="horizontal wrap no-flex" style=" justify-content: center; position: relative; overflow: auto; flex-wrap: wrap; white-space:wrap; overflow-y: auto;">
            <oda-button ~class="$for.item.k" class="border" ~for="btns" style="pointer-events: unset; position: unset; min-width: 240px; height: 80px; margin: 4px; font-size: larger; padding: 4px;" @tap="showPropertyGrid($for.item)">
                {{$for.item.k}}
            </oda-button>
        </div>
        <oda-property-grid slot="right-panel" class="vertical flex border" label="Theme settings" :inspected-object="vars" style="padding:0"></oda-property-grid>
    `,
    toggled: {
        $def: false,
        set(n) {
            isDark = n;
            this.theme = n ? 'dark' : 'light';
            this.switchTheme();
        }
    },
    hideSwitchBtn: false,
    $public: {
        theme: {
            $def: 'light',
            $list: ['light', 'dark', 'light dark'],
            set(n) {
                this.toggled = n === 'dark';
            }
        }
    },
    vars: { $def() { return new themeVars() } },
    get btns() {
        const btns = [];
        Object.keys(cssRules).map(k => {
            if (cssRules[k].includes('var('))
                btns.push({ k: k.slice(2), v: cssRules[k] });
        })
        btns.sort((a, b) =>  a.k < b.k ? -1 : a.k > b.k ? 1 : 0);
        // console.log(btns);
        return btns;
    },
    async showPropertyGrid(item = []) {
        const props = new class props extends ROCKS({
            $public: (() => {
                const props = {};
                const vars = item.v.split('\n');
                vars.map(i => {
                    if (i.includes('var')) {
                        const key = i.split('var(')[1].split(')')[0].split(',')[0];
                        props[key] = {
                            $group: item.k,
                            $public: true,
                            $editor: key?.includes('color') || key?.includes('background') ? 'oda-theme-editor-color-picker' : 'oda-pg-string',
                            $def: changes[key]?.val || this.vars[key],
                            set: (n) => { updateStyle(key, n) }
                        }
                    }
                })
                return props;
            })()
        }) { }
        const res = await ODA.showDropdown('oda-property-grid', { inspectedObject: props }, { minWidth: '480px' });
    },
    get changes() {
        return changes;
    },
    set changes(v) {
        changes = v;
    },
    get isDark() {
        return isDark;
    },
    isChanged: false,
    isLoadChanges: false,
    clearChanges() {
        this.vars = new themeVars();
        this.btns = undefined;
        Object.keys(changes || {}).map(key => {
            ODA.updateStyle({ [key]: changes[key].defVal });
        })
        this.changes = changes = {};
        this.isChanged = this.isLoadChanges;
    },
    async switchTheme(theme = this.theme) {
        let wins = [top];
        wins = [...wins, ...Array.from(top)];
        wins.map(w => {
            let meta = w.document.getElementById('color-scheme');
            if (!meta) {
                meta = document.createElement('meta');
                meta.id = meta.name = "color-scheme";
                w.document.head.appendChild(meta);
            }
            meta.content = theme;
        })
        this.async(() => {
            this.vars = new themeVars();
            this.btns = undefined;
            Object.keys(changes || {}).map(key => {
                if (changes[key].isDark === this.toggled)
                    this.vars[key] = changes[key].newVal;
            })
        }, 100)
        return theme;
    },
    pgChanged(e) {
        console.log(e)
    },
    ready() {
        themeEditor = this;
        this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.toggled = this.theme === 'dark';
        this.switchTheme();
    }
})

ODA({ is: 'oda-theme-editor-color-picker', imports: '@oda/color-picker-oklch',
    template: `
        <style>
            :host {
                @apply --horizontal;
                @apply --flex;
                position: relative;
            }
        </style>
        <div style="display: block; margin: 4px;align-items: center; width: calc(100% - 40px); overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{value}}</div>
        <div class="border" style="width: 40px; margin: 4px; cursor: pointer;" ~style="{background: value}" @tap="openPicker"></div>
    `,
    value: '',
    async openPicker(e) {
        let val = this.value,
        light, dark;
        if (val.includes('light-dark')) {
            let v = val.replace('light-dark(', '').replace(')', '').split(',');
            dark = v[1];
            light = v[0];
            val = isDark ? dark : light;
        }
        let res = await ODA.showDropdown('oda-color-picker-oklch', { value: val, srcValue: val }, { });
        res = res.result;
        if (res) {
            this.value = res;
        }
    }
})
