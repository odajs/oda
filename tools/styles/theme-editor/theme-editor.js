class themeVars extends ROCKS({
    $public: (() => {
        let styles = document.head.querySelectorAll('style');
        styles = Array.from(styles).filter(i => {
            return Array.from(i.sheet.rules).some(r => r.selectorText === ':root');
        })
        styles = styles.map(s => {
            return {
                scope: s.getAttribute('scope'),
                style: s,
                vars: {}
            }
        })
        styles.map(s => s.rules = Array.from(s.style.sheet.rules).filter(rule => rule.selectorText === ':root'));
        styles.map(s => s.rules.map(rule => {
            [...rule.style].map(propName => {
                s.vars[propName.trim()] = rule.style.getPropertyValue(propName).trim();
            })
        }))
        let vars = {}
        styles.map(s => {
            Object.keys(s.vars).map(k=> {
                vars[k] = { 
                    $public: true, 
                    $group: s.scope, 
                    $editor: k.includes('color') || k.includes('background') ? '@oda/color-picker[oda-color-picker]' : 'oda-pg-string',
                    [k]: s.vars[k]
                }
            })
        })
        // console.log(vars);
        return vars;
    })()
}) { }

ODA({ is: 'oda-theme-editor', imports: '@oda/divider, @tools/property-grid',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
            }
        </style>
        <div class="horizontal flex" style="max-width: 100%; overflow: hidden;">
            <div class="flex" style="min-width: 100px">
            
            </div>
            <oda-divider use_px reverse @end-splitter-move="reSize"></oda-divider>
            <div class="vertical no-flex" style="min-width: 100px" ~style="{width: width+'px'}">
                <oda-property-grid class="flex" label="Theme settings" :inspected-object="vars" style="padding:0"></oda-property-grid>
            </div>
        </div>
    `,
    vars: null,
    $public: {
        width: {
            $def: 240,
            $save: true
        }
    },
    reSize(e) {
        this.width = Math.round(e.detail.value.w);
    },
    attached() {
        let tw = new themeVars();
        this.vars = tw;
    }
})
