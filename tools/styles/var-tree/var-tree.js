ODA({is:'oda-tools-styles-var-tree', imports: '@tools/property-grid', extends: 'oda-property-grid',
    ready(){
        const  result = Array.from(document.styleSheets).map(e=>{
            const rules = Array.from(e.cssRules).filter(r=>r.selectorText === ':root')
            return rules.map(s=>{
                return Array.from(s.style).map(n=>{
                        const v = s.styleMap.get(n);
                        const vv = v.toLocaleString().trim();
                        if (vv.startsWith('{')) return undefined;
                        return [n, vv]
                    }
                ).filter(Boolean);
            })
        }).flat()
        console.log(result)
        const data = {}
        const props = result.reduce((res, e, idx)=>{
            e.forEach(obj =>{
                res[obj[0]] = {
                    default: obj[1],
                    category: idx+1,
                }
                Object.defineProperty(data, obj[0], {
                    configurable: true,
                    set(n){
                        obj[1] = n;
                        ODA.updateStyle({[obj[0]]: n});
                    },
                    get(){
                        return obj[1];
                    }
                })
            })
            return res;

        }, {});
        data.props = props;
        this.inspectedObject = data;
    },

})