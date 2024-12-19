const Groups = {}
ODA({is: 'oda-button', extends: 'oda-icon',
    imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            opacity: 0.8;
            padding: 4px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            outline-offset: -1px;
            overflow: hidden;
            @apply --no-flex;
            border-radius: 4px;
        }
        :host([icon-pos=right]) {
            flex-direction: row-reverse !important;
        }
        :host([icon-pos=top]) {
            flex-direction: column !important;
        }
        :host([icon-pos=bottom]) {
            flex-direction: column-reverse !important;
        }
        :host(:hover) {
            opacity: 1;
        }
        label {
            display: block;
            align-self: center;
            white-space: nowrap;
            overflow-x: hidden;
            text-overflow: ellipsis;
            margin: 4px;
            cursor: inherit;
        }
        :host(:active), :host([toggled]) {
            filter: contrast(.6);
            outline: 1px dotted silver;
            @apply --active;
            outline-offset: -1px;
        }
    </style>
    <style>
        .icon {
            display: {{icon?'block':'none'}};
        }
    </style>
    <label ~if="label">{{label}}</label><slot></slot>`,

    $public: {
        iconPos: {
            $def: 'left',
            $list: ['left', 'right', 'top', 'bottom'],
            $attr: true,
        },
        label: String,
        toggled: {
            $def: false,
            $attr: true,
            set(n, o) {
                if (n && this.toggleGroup) {
                    for (let button of Groups[this.toggleGroup]) {
                        if (button !== this && (button.parentElement === this.parentElement || button.domHost === this.domHost))
                            button.toggled = false;
                    }
                }
            }
        },
        allowToggle: false,
        toggleGroup: {
            $type: String,
            set(n, o) {
                if (o) {
                    (Groups[o] || []).remove(this);
                }
                if (n) {
                    Groups[n] = Groups[n] || [];
                    Groups[n].add(this);
                }
            }
        }
    },
     $listeners: {
        tap(e) {
            if (this.allowToggle) {
                e.preventDefault();
                e.stopPropagation();
                this.toggled = !this.toggled;
            }
        },
        keydown(e) {
            if (e.keyCode === 13) this.click();
        }
    }
});