const Groups = {}
ODA({is: 'oda-button', extends: 'oda-icon',
    imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host{
            border: 1px solid transparent;
            @apply --horizontal;
            opacity: 0.8;
            padding: 4px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            outline-offset: -1px;
            overflow: hidden;
            @apply --no-flex;
        }
        :host([icon-pos=right]){
            flex-direction: row-reverse !important;
        }
        :host([icon-pos=top]){
            flex-direction: column !important;
        }
        :host([icon-pos=bottom]){
            flex-direction: column-reverse !important;
        }
        :host(:hover){
            opacity: 1;
        }
        span{
            display: block;
            align-self: center;
            white-space: nowrap;
            overflow-x: hidden;
            text-overflow: ellipsis;
            margin: 0px 4px;
        }
        :host(:active), :host([toggled]){
            @apply --content;
            opacity: 0.999;
            border: 1px solid rgba(0,0,0,0.5) !important;
        }
        :host([disabled]){ /* todo: должно работать от глобального стиля */
            @apply --disabled;
        }
        .icon{
            display: {{icon?'block':'none'}};
        }
    </style>
    <span class="label" ~if="label">{{label}}</span><slot></slot>`,
    props: {
        iconPos: {
            default: 'left',
            list: ['left', 'right', 'top', 'bottom'],
            reflectToAttribute: true
        },
        label: String,
        toggled: {
            default: false,
            reflectToAttribute: true,
            set(n, o){
                if (n && this.toggleGroup){
                    for (let button of Groups[this.toggleGroup]){
                        if(button !== this && (button.parentElement === this.parentElement || button.domHost === this.domHost))
                            button.toggled = false;
                    }
                }
            }
        },
        allowToggle: false,
        toggleGroup: {
            type: String,
            set(n, o){
                if (o){
                    (Groups[o] || []).remove(this);
                }
                if (n){
                    Groups[n] =  Groups[n] || [];
                    Groups[n].add(this);
                }
            }
        }
    },
    listeners: {
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