ODA({is: 'oda-panel-simple', imports: '@oda/icon, @oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                position: relative;
                overflow: hidden;
                min-height: 32px;
                flex: {{src?.open || src?.opened ? 1 : 0}};
            }
            .panel_header {
                display: flex;
                flex: 1;
                margin: 1px;
                border: 1px solid grey;
                background-color: lightgray;
            }
            .panel_header, .panel_tab {
                align-items: center;
                overflow: hidden;
                max-height: 28px;
                min-height: 28px;
                cursor: pointer;
            }
            .panel_content {
                flex: 1;
                overflow: hidden;
                margin: 1px;
                border: 1px solid darkgrey; 
            }
        </style>
        <div class="panel_header" @tap="opened">
            <div ~for="(i,idx) in (tabs || [])" class="horizontal panel_tab">
                <oda-icon ~if="!(src?.open || i.open || idx > 0)" :icon="src?.open || src?.opened ? 'icons:arrow-drop-down' : 'icons:arrow-drop-down:270'" icon-size="18"></oda-icon> 
                <oda-icon ~if="i.icon" :icon="i.icon || ''" icon-size="16" @tap="tabclick($event, idx)" style="padding: 0 4px" ~style="{opacity: indx === idx ? 1 : .3}"></oda-icon>
                <span ~if="i.label" @tap="tabclick($event, idx)" style="padding: 0 4px" ~style="{opacity: indx === idx ? 1 : .3}">{{i.label || ''}}</span>
                <div style="height: 28px; width: 1px" ~style="{'border-right': tabs.length > 1 ? '1px solid darkgray' : 'unset'}"></div>
            </div>
            <div style="flex: 1"></div>
            <div ~if="src?.open || src?.opened" class="horizontal">
                <oda-button ~for="btn in (tabs[indx]?.btns || [])" class="btn" icon-size=18 :icon="btn.icon" :title="btn.title || btn.label || btn.icon" :allow-toggle="btn.allowToggle" :toggled="btn.toggled"
                style="font-size: 14px" @down="btnclick">{{btn.label || ''}}</oda-button>
                <div style="width: 4px"></div>
            </div>
        </div>
        <div ~if="src?.open || src?.opened" class="panel_content">
            <div ~if="tabs[indx]?.template" ~is="tabs[indx].template" ::value="tabs[indx].content"></div>
            <slot ~if="!tabs[indx]?.template">{{tabs[indx]?.content}}</slot>
        </div>
    `,
    attached() {
        document.addEventListener("oda-panel-simple-click", (e) => {
            const src = e?.detail?.src;
            if (e?.detail?.uuid === this.uuid && src?.single && src.single === this.src?.single) {
                this.src.opened = this.src === src;
            }
        });
    },
    deattached() {
        document.removeEventListener("oda-panel-simple-click");
    },
    src: {},
    indx: 0,
    get tabs() { return this.src?.tabs || (this.src ? [this.src] : []) },
    opened() {
        if (this.src?.single) {
            document.dispatchEvent(new CustomEvent("oda-panel-simple-click", {
                detail: { src: this.src, uuid: this.uuid }
            }))
        } else {
            this.src.opened = !this.src?.opened;
        }
    },
    btnclick(e) {
        e.stopPropagation();
        console.log(e.target.title)
        this.fire('oda-panel-simple-button-click', { uuid: this.uuid, act: e.target.title, src: this.src, sourceEvent: e });
    },
    tabclick(e, idx) {
        e.stopPropagation();
        if (this.tabs.length > 1) {
            this.indx = idx;
            this.src.opened = true;
        } else {
            this.opened();
        }
    }
})
