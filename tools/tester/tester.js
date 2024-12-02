ODA({is: 'oda-tester', imports: '@oda/app-layout, @tools/property-grid, @tools/mobile, @tools/all-containers', extends: 'oda-app-layout',
    template: /*html*/`
    <app-layout-toolbar class="header" slot="header">
        <div class="horizontal" slot="header-left" style="align-items:center; width: 100%">
            <oda-button class="no-flex" ~for="views" :icon="$for.item.icon" :title="$for.item.label" allow-toggle :toggled="focused === $for.item" @tap="focused = $for.item"></oda-button>
        </div>
        <div class="horizontal" slot="header-left" style="align-items:center; width: 100%">
            <oda-button class="no-flex" ~for="customButtons" ~props="$for.item"></oda-button>
        </div>
        <span class="flex" slot="header-center" style="font-weight: bold; font-size: large; text-align: center">{{label}}</span>
     </app-layout-toolbar>
    <slot style="display: none" @slotchange="onSlot" class="flex"></slot>
    <oda-property-grid group-expanding-mode="all" slot="right-panel" :label :inspected-object="component" opened allow-expert-mode></oda-property-grid>
    <div ~is="focused?.is" slot="main" :component class="flex" style="width: 100%; height: 100%;"></div>
    `,
    attached(){
        this.async(()=>{
            this.leftPanelElement.opened = true;
        })
    },
    customButtons:[],
    addButton(props){
        this.customButtons.push(props);
    },
    $public: {
        label: {
            get() {
                return this.component && (this.component.localName || this.component.label || this.component.title || 'component') || 'no component';
            }
        },
        component: {
            $type: Object
        },
        views: [
            { icon: 'enterprise:computer-screen', is:'oda-tester-container'},
            { icon: 'device:devices', is: 'oda-mobile'},
            { icon: 'icons:settings-overscan', is: 'oda-all-containers'},
        ],
        focused:{
            get() {
                return this.views[0];
            }
        },
        get hideToolbar() { return false }
    },
    async onSlot(e) {
        if (this.component) return;
        const els = e.target.assignedElements();
        await ODA.waitReg(els[0].localName);
        this.component = els[0];
    }
});

ODA({is: 'oda-tester-container',
    template: /*html*/`
        <style>
            :host{
                @apply --vertical;
                overflow: overlay;
            }
            ::slotted(*){
                max-width: 100%;
                max-height: 100%;
            }
        </style>
        <slot></slot>
    `,
    $public: {
        component: {
            set(n) {
                if (n instanceof HTMLElement)
                    this.appendChild(n);
            }
        }
    }
})