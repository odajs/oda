import '../containers.js';
ODA({ is: 'oda-containers', //imports: '@tools/containers.js',
    template: `
        <style>
            :host{
                @apply --header;
                @apply --horizontal;
                flex-wrap: wrap;
                overflow: auto;
                justify-content: center;
                align-items: center;
            }
            div{
                @apply --content;            
                @apply --shadow;
                padding: 8px;
                @apply --no-flex;
                @apply --vertical;
                align-items: center;
                @apply --flex;
                width: 400px;
                max-width: 400px;
                margin: 16px;
                border: 1px solid;
                /*max-height: 150px;*/
            }
        </style>
        <slot hidden  @slotchange="onSlot"></slot>
        <div ~for="containers">
            <h2>ODA.{{('show-'+item).toCamelCase()}}(id)</h2>
            <button @tap="open" :container="item">Press me...</button>
        </div>
    `,
    props: {
        component: {
            set(n) {
                if (n) this.appendChild(n);
            }
        },
        containers: {
            type: Array,
            get() {
                return ODA.containers?.items || [];
            }
        }
    },
    getLabel(item){
        return item.toCamelCase();
    },
    open(e) {
        let flex = e.target.attributes['container'].value === 'modal' ? 'flex' : 'no-flex';
        ODA[('show-' + e.target.attributes['container'].value).toCamelCase()](this.component, {}, { parent: e.target, flex }).then(res=>{
            console.dir(res);
        }).catch(e=>{
            console.log('Отмена выбора');
        })
    },
    onSlot(e) {
        if (this.component) return;
        const els = e.target.assignedElements();
        if (!els.length) return;
        this.component = els[0];
    }
})