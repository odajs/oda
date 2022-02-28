ODA({is: 'oda-udal',
    template: /*html*/`
        <style>
            :host{
                justify-content: center;
                position: absolute;
                z-index: 100;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background-color: rgba(0, 0, 0, 0.5);
                pointer-events: auto;
                @apply --vertical;  
            }
            :host .container{
                max-width: 100%;
                max-height: 100%;
                border: 1px solid black !important;
                @apply --shadow;
                min-width: 280px;
            }
            ::slotted(*){
                @apply --flex;
            }

        </style>
        <slot name="title">
            <oda-modal-title :title :slot="(fullSize || titleMode === 'full')?'title':(titleMode === 'auto'?'title1':'?')" class="no-flex" ~style="{alignItems: fullSize?'initial':'center'}" style="color: white; text-align: center;"></oda-modal-title>
        </slot>
        <div class="flex vertical" style="justify-content: center; overflow: hidden; padding: 16px;">
            <div class="container vertical shadow flex"  ~style="{alignSelf: fullSize?'initial':'center'}">
                <slot name="title1" style="margin-top: 30px;"></slot>
                <slot @tap.stop class="shadow content flex vertical" style="overflow: hidden;"></slot>
            </div>
        </div>
    `,
    props: {
        _zoom: 0,
        title: '',
        titleMode: {
            default: 'none',
            list: ['none', 'auto', 'full']
        },
        fullSize: false,
        animation: 0,
        iconSize: {
            default: 24,
        }
    }
})
ODA({is: 'oda-modal-title', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host{
                @apply --horizontal;
                @apply --header;
                align-items: center;
            }
        </style>
        <span class="flex">{{title}}</span>
        <oda-button @tap="domHost.fire('cancel')" class="no-flex" icon="icons:close"></oda-button>
    `,
    props: {
        title: ''
    }
})