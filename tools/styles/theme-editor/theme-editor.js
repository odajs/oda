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

ODA({ is: 'oda-theme-editor', imports: '@tools/property-grid, @oda/color-picker',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
            }
            input {
                border: none;
                width: 100%;
                padding: 2px;
                outline: none;
                border-bottom: 1px solid var(--border-color, lightgray);

            }
            legend{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                font-size: x-small;
            }
        </style>
        <div class="horizontal wrap flex" style="justify-content: center; position: relative; overflow: auto; flex-wrap: wrap; white-space:wrap; overflow-y: auto;">
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
        </div>
        <oda-property-grid slot="right-panel" class="vertical flex border" label="Theme settings"  :inspected-object="vars" style="padding:0"></oda-property-grid>
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
        // console.log(elms);
        return elms;
    }
})
