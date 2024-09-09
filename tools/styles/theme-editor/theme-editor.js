class themeVars extends ROCKS({
    $public: (() => {
        let styles = document.head.querySelectorAll('style');
        styles = Array.from(styles).filter(i => Array.from(i.sheet.cssRules).some(r => r.selectorText === ':root'));
        styles = styles.map(s => {
            return {
                scope: s.getAttribute('scope'),
                style: s,
                vars: {},
                rules: []
            }
        })
        const isCorrectRule = (rule) => rule.type === 1 || rule.type === 4;
        const getRules = (rules = []) => {
            return rules.map(r => {
                if (isCorrectRule(r)) {
                    if (r.type === 4)
                        return r.cssRules[0];
                    return r;
                }
            })
        }
        styles.map(s => s.rules = [...s.rules, ...getRules(Array.from(s.style.sheet.cssRules))]);
        styles.map(s => s.rules.map(rule =>
            [...(rule?.style || [])].map(propName => {
                if (propName?.indexOf("--") === 0)
                    s.vars[propName.trim()] = rule.style.getPropertyValue(propName).trim();
            })
        ))
        let vars = {}
        styles.map(s => {
            Object.keys(s.vars).map(k => {
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
            <div class="horizontal wrap flex" style="min-width: 100px; overflow: auto; flex-wrap: wrap; white-space:wrap; overflow-y: auto;">
                <div class="border no-flex" ~for="elements" style="width: 300px; margin: 4px;" ~style="$for.item.style">
                    <span style="font-size: larger">{{$for.key}}</span>
                    <div ~for="$for.item.vars" style="margin-left: 16px; font-size: small">{{$$for.item.k}}: {{$$for.item.v}};</div>
                </div>
            </div>
            <oda-divider use_px reverse @end-splitter-move="reSize"></oda-divider>
            <div class="vertical no-flex" style="min-width: 100px" ~style="{width: width+'px'}">
                <oda-property-grid class="flex" label="Theme settings" :inspected-object="vars" style="padding:0"></oda-property-grid>
            </div>
        </div>
    `,
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
        console.log(elms);
        return elms;
    } ,
    $public: {
        width: {
            $def: 240,
            $save: true
        }
    },
    reSize(e) {
        this.width = Math.round(e.detail.value.w);
    }
})
