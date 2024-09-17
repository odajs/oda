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
        let vars = {}
        Object.keys(styles).map(s => {
            styles[s].vars?.map(v => {
                const key = Object.keys(v.var)[0],
                    val = Object.values(v.var)[0];
                vars[key] = {
                    $public: true,
                    $group: s,
                    $editor: key.includes('color') || key.includes('background') ? '@oda/color-picker[oda-color-picker]' : 'oda-pg-string',
                    $def: val
                }
            })
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
            input {
                border: none;
                width: 100%;
                padding: 2px;
                outline: none;
                border-bottom: 1px solid var(--border-color, lightgray);
                background: transparent;
            }
            legend{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                font-size: x-small;
            }
        </style>
        <div class="horizontal" ~if="!hideSwitchMode" style="align-items: center; margin-left: 8px;" >
            <div>Switch Light/Dark mode: </div>
            <oda-toggle size="24" ::toggled></oda-toggle>
        </div>
        <!-- <div class="horizontal wrap flex" style="justify-content: center; position: relative; overflow: auto; flex-wrap: wrap; white-space:wrap; overflow-y: auto;">
            <div class="border no-flex" ~for="elements" style="width: 300px; margin: 4px; padding-bottom: 4px; position: relative">
                <div style="font-size: larger; padding: 4px;" ~style="$for.item.style">
                    <div>{{$for.key}}</div>
                </div>
                <fieldset ~for="$for.item.vars" class="vertical flex" style="position: relative; border-radius: 2px; border: 1px solid var(--border-color, lightgray);">
                    <legend>{{$$for.item.k}}</legend>
                    <input :value="$$for.item.v"></input>
                    <oda-color-picker ~if="$$for.item.k?.includes('color') || $$for.item.k?.includes('background')" :value="$$for.item.v" style="top: -7px;height: 14px;width: 14px; position: absolute; right: 4px; border: none; cursor: pointer; border: 1px solid var(--border-color, lightgray);"></oda-color-picker>
                </fieldset>
            </div>
        </div> -->
        <oda-property-grid slot="right-panel" class="vertical flex border" label="Theme settings"  :inspected-object="vars" style="padding:0"></oda-property-grid>
    `,
    toggled: {
        $def: false,
        set(n) {
            this.theme = n ? 'dark' : 'light';
            this.switchTheme();
        }
    },
    hideSwitchMode: false,
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
    get elements() {
        const elms = {};
        Object.keys(this.vars.constructor.__rocks__.descrs).map(k => {
            const i = this.vars.constructor.__rocks__.descrs[k],
                v = this.vars[k],
                group = k.split('-')[2];
            elms[group] ||= { vars: [], style: {} };
            elms[group].vars.push({ group, k, v });
            if (k.includes('-color')) elms[group].style.color = v;
            if (k.includes('-background')) elms[group].style.background = v;
        })
        // console.log(elms);
        return elms;
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
    ready() {
        this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.toggled = this.theme === 'dark';
        this.switchTheme();
    }
})
