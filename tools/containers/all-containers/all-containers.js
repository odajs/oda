import '../containers.js';
ODA({ is: 'oda-all-containers', //imports: '@tools/containers.js',
    template: /*html*/`
    <style>
        :host {
            @apply --header;
            @apply --horizontal;
            flex-wrap: wrap;
            overflow: auto;
            justify-content: center;
            align-items: center;
        }
        div {
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
        <h2>ODA.{{('show-'+$for.item).toCamelCase()}}(id)</h2>
        <button @tap="open" :container="$for.item">Press me...</button>
    </div>
    `,
    $public: {
        component: {
            set(n) {
                if (n) {
                    this.appendChild(n);
                    if (this.component.localName.includes('editor')) {
                        this.component.style.width = '400px';
                        this.component.style.height = '300px';
                    }
                }
            }
        },
        containers: {
            $type: Array,
            get() {
                return ODA.containers?.items;
            }
        }
    },
    attached() {
        this.async(() => {
            this.$render();
        }, 100)
    },
    getLabel(item) {
        return item.toCamelCase();
    },
    open(e) {
        let flex = e.target.attributes['container'].value === 'modal' ? 'flex' : 'no-flex';
        ODA[('show-' + e.target.attributes['container'].value).toCamelCase()](this.component, {}, { showBtnClose: true, parent: e.target, flex }).then(res => {
            console.dir(res);
        }).catch(e => {
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