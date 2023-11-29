
ODA({ is: 'oda-selector', imports: '@oda/icon, @tools/containers',
    template: `
        <div class="horizontal">
            <oda-icon :icon-size="iconSize" ~if="icon" id="icon1" :icon @tap="_openDD" style="cursor: pointer"></oda-icon>
            <input ~if="!hideInput" id="input" class="flex" :type="type" :value="value" @change="_change" style="margin-left: 4px; border:none; outline: none; min-width: 0px; background: transparent;"/>
            <oda-icon ~if="icon2 && icon2!=='false'" :icon="icon2" icon-size="10" @tap="_openDD" style="padding-right: 4px"></oda-icon>
        </div>
    `,
    iconSize: 20,
    icon: '',
    icon2: 'bootstrap:chevron-down',
    type: 'text',
    value: '',
    items: [],
    width: '160px',
    showOk: false,
    hideInput: false,
    label: '',
    _change(e) {
        this.value = e.target.value;
        this.fire('change', { value: e.target.value });
    },
    async _openDD(e) {
        if (e.target.id === 'icon1' && this.icon2 !== 'false') return;

        let result = await ODA.showDropdown('oda-selector-cells', { iconSize: this.iconSize, items: this.items || [], value: this.value, width: this.width, label: this.label, showOk: this.showOk }, { parent: this, useParent: true, align: 'left', intersect: true });
        result = result?.result;
        if (result) {
            const value = this.value = result.item?.label || this.label || '';
            const obj = { $item: result.item };
            result.items?.map(i => {
                obj[i.label] = i.value || i.label === value;
            })
            this.fire('change', { value, result: obj });
        }
    }
})

ODA({ is: 'oda-selector-cells', imports: '@oda/icon',
    template: `
        <style>
            :host {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                overflow: hidden;
                box-shadow: var(--box-shadow);
            }
            .row:hover {
                outline: 1px solid lightgray;
            }
            .inp {
                color: gray;
                font-family: Arial;
                text-align: left;
                outline: none;
                background: transparent;
                border: none;
                min-width: 0px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .ellipsis {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        </style>
        <div class="vertical flex" ~style="{width}" style="border: 1px solid lightgray; overflow: hidden">
            <div class="horizontal" style="background: lightgray; border: 1px solid gray;">
                <div class="flex" style="padding: 4px">{{label || value}}</div>
                <oda-icon :icon-size="iconSize" ~if="showOk" title="ok" icon="eva:f-checkmark-square" @tap="fire('ok', { items })" style="cursor: pointer;"></oda-icon>
                <oda-icon :icon-size="iconSize" title="cancel" icon="eva:f-close" @tap="fire('cancel')" style="cursor: pointer"></oda-icon>
            </div>
            <div class="vertical" style="overflow: hidden; overflow-y: auto; padding: 2px">
                <div ~for="items" class="vertical">
                        <textarea ~if="$for.item.type === 'textarea'" class="flex" ~class="$for.item.class || ''" ~style="$for.item.style || ''" style="resize: none; outline: none; border: 1px solid lightgray;" ::value="$for.item.value"></textarea>
                        <div ~if="$for.item.type !== 'textarea'" class="row horizontal align"  style="width: 100%;" ~class="$for.item.class || ''" ~style="$for.item.style || ''" @tap="_celltap($event, $for.item)">
                            <oda-icon ~if="!$for.item.hideIcon" :icon-size="$for.item.iconSize || 24" ~class="$for.item.iconClass || ''" ~style="$for.item.iconStyle || ''" :icon="$for.item.icon"></oda-icon>
                            <div ~is="$for.item.is || 'div'" class="cell flex ellipsis" style="padding: 4px" ~class="$for.item.lblClass || ''" ~style="$for.item.lblStyle || ''">{{$for.item.label || (typeof $for.item === 'string' ? $for.item : '')}}</div>
                            <input ~if="$for.item.type" class="inp ellipsis flex" style="padding: 4px" :type="$for.item.type" ::value="$for.item.value" ~class="$for.item.inpClass || ''" ~style="$for.item.inpStyle || ''">
                        </div>
                </div>
            </div>
        </div>
    `,
    iconSize: 20,
    value: '',
    items: [],
    width: '160px',
    showOk: false,
    label: '',
    _celltap(e, item) {
        if (item?.type || item?.isLabel)
            return;
        this.fire('ok', { item, items: this.items });
    }
})
