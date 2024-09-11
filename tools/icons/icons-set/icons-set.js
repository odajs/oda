import { copyToClipboard } from "../icons-tree/icons-tree.js";

ODA({ is: 'oda-icons-set',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                justify-content: center;
                flex-wrap: wrap;
                width: 100%;
            }
        </style>
        <oda-icon
            ~for="icons"
            class="icon"
            :icon="$for.item.icon || $for.item"
            :icon-size
            style="position: relative; padding: 8px; cursor: pointer; outline-offset: -2px;"
            :title="$for.item.icon"
            @tap="copy($for.item.icon)"
            @dblclick="dblclick($for.item.icon)"
            ~style="{outline: $for.item.icon === selectedIcon ? '2px solid blue' : ''}"
        ></oda-icon>
    `,
    $public: {
        iconSize: {
            $def: 48,
            $save: true
        },
        selectedIcon: ''
    },
    icons: [],
    async copy(icon) {
        this.selectedIcon = icon;
        copyToClipboard(icon);
    },
    dblclick(icon) {
        this.copy(icon);
        this.dispatchEvent(new CustomEvent("ok", { detail: this.selectedIcon, bubbles: true, composed: true }));
    }
})
