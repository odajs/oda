class themeVarList extends ROCKS({
    $public: (()=>{
        return Array.from(document.styleSheets).map(e=>{
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
        }).flat().flat().reduce((akk, x)=>{
            let editor = (x[0].includes('color')) ? '@oda/color-picker[oda-color-picker]' :
                         (x[0].includes('background')) ? '@oda/color-picker[oda-color-picker]' :
                         'oda-pg-string'
            akk[x[0]] = {
                $def: x[1],
                $editor: editor,
                set(n){
                    if (n) ODA.updateStyle({ [x[0]]: n });
                }
            }
            return akk
        },{});
    })()
}){}
ODA({ is: 'oda-theme-editor', 
    template: /*html*/`
        <div slot="left-panel" opened title="Select theme" label="themes" class="vertical flex border" style="overflow: auto;">
            <oda-button :active="theme==$for.item.name" ~for="themes" @tap="theme = $for.item.name">{{$for.item.name}}</oda-button>
        </div>
        <oda-property-grid slot="right-panel" class="vertical flex border" label="Theme settings" :inspected-object="cssInspected" style="padding:0"></oda-property-grid>
        <oda-button  @tap="_download()" icon='icons:file-download'>download modified value</oda-button>        
    `,
    themes: ['<none>'],
    $public: {
        cssInspected: { $def() { return new themeVarList(); } },        
        theme:{
            $def:'<none>',
            async set (x) {
                if (x=='<none>') { this._resetCSS() }
                else {
                    const src = 'themes/' + this.themes.filter(o => o.name==x )[0].src
                    const cTheme = await (await fetch(src)).json()
                    for (let k in cTheme) { this.cssInspected[k]=cTheme[k] }
                }
            }
        },
    },
    _whatsNewCSS() {
        let descrs = this.cssInspected.constructor.__rocks__.descrs
        return Object.keys(this.cssInspected).filter(s=>s.slice(0,3)=='#--').map(s=>s.slice(1)).reduce((akk,k)=>{
            if (descrs[k].$def()!=this.cssInspected[k]) akk.push({new:this.cssInspected[k], def:descrs[k].$def(), name:k})
            return akk
        },[])
    },
    _resetCSS () { this._whatsNewCSS().forEach(e => this.cssInspected[e.name]=e.def)  },
    _download(){
        let json = this._whatsNewCSS().reduce((akk,o)=>{ akk[o.name]=o.new; return akk},{})
        if (Object.keys(json).length!=0) {
        var fakeElem = document.createElement('a')
            fakeElem.setAttribute("href",  'data:application/json;charset=utf-8,'+ JSON.stringify(json, null, 2))
            fakeElem.setAttribute("download", "theme.json");
            fakeElem.click();
            fakeElem.remove();
        }
    },
    attached() {
        fetch('themes/_.dir').then(r=>{ r.json().then(dir => {
            const list = [{name:'<none>'}].concat(dir)
            this.constructor.__rocks__.descrs.theme.$list=list.map(o=>o.name)
            this.themes=list
        }) })
    },
})
