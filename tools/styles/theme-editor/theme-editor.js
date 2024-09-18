class themeVars extends ROCKS({
    $public: (() => {
        const styles = {}, media = [];
        const fn =(rule, _scope = 'no-scope', isMedia = false) => {
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
                            styles[scope].vars.push( { var: { [propName.trim()]: v }, isMedia });
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
                    $editor: key.includes('color') || key.includes('background') ? '@oda/color-picker[oda-color-picker]' : 'oda-pg-string',
                    $def: val,
                    set: (n) => { ODA.updateStyle({ [key]: n }) }
                }
            })
        })
        Object.values(vars).map(i => {
            i.$group = groups[i.$group]?.length > 1 ? i.$group : 'vars';
        })
        // console.log(vars);
        return vars;
    })()
}) { }

ODA({ is: 'oda-theme-editor', imports: '@tools/property-grid, @oda/color-picker',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                background: var(--content-background);
            }
        </style>
        <div class="horizontal" ~if="!hideSwitchBtn" style="align-items: center; margin-left: 8px;" >
            <div>Switch Light/Dark mode: </div>
            <oda-toggle size="24" ::toggled></oda-toggle>
        </div>
        <div class="horizontal wrap no-flex" style="position: relative; overflow: auto; flex-wrap: wrap; white-space:wrap; overflow-y: auto;">
            <oda-button ~class="$for.item.length === 1 ? $for.item[0].k : $for.key" class="border" ~for="attr" style="width: 240px; height: 80px; margin: 4px; font-size: larger; padding: 4px;" @tap="showInfo($for.item)">
                {{$for.item.length === 1 ? $for.item[0].k : $for.key}}
            </oda-button>
        </div>
        <oda-property-grid slot="right-panel" class="vertical flex border" label="Theme settings"  :inspected-object="vars" style="padding:0"></oda-property-grid>
    `,
    toggled: {
        $def: false,
        set(n) {
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
    get attr() {
        const a = {};
        Object.keys(cssRules).map(k => {
            if (cssRules[k].includes('var('))
            if (k !== '--help-after' && k !== '--cover')
                {
                    const group = k.split('-')[2];
                    a[group] ||= [];
                    a[group].push({ k: k.slice(2), v: cssRules[k] });
                }
        })
        console.log(a);
        return a;
    },
    async showInfo(item) {
        console.log(item);
        const res = await ODA.showDropdown('oda-property-grid', { inspectedObject: item.vars }, { });
    },
    async switchTheme(theme = this.theme) {
        let wins = [ top ];
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
        }, 100)
        return theme;
    },
    pgChanged(e) {
        console.log(e)
    },
    ready() {
        this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.toggled = this.theme === 'dark';
        this.switchTheme();
    }
})
