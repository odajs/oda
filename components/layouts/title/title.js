ODA({is: 'oda-title', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --no-flex;
            @apply --header;
            align-items: center;
            position: sticky;
            position: -webkit-sticky;
            top: 0px;
            z-index: 1;
            background-color: black;
            /*filter: invert(1);*/
        }
        .title {
            @apply --horizontal;
            @apply --flex;
            @apply --header;
            color: white;
            fill: white;
            background-color: black;
            padding: 4px;
            align-items: center; 
        }
        oda-button {
            padding: 0px;
        }
    </style>
    <slot name="title-left"></slot>
    <div class="title">
        <oda-icon ~if="icon" :icon-size :icon></oda-icon>
        <span class="label flex" ~html="title"></span>
        <div class="horizontal no-flex" style="margin-left: 8px;">
            <oda-button ~if="help" :icon-size icon="icons:help" @tap="_help"></oda-button>
            <oda-button ~if="allowClose" :icon-size icon="icons:close" @tap="fire('cancel')" style="background-color: red"></oda-button>
        </div>
    </div>`,
    props: {
        title: '',
        icon: '',
        allowClose: false
    },
    help: '',
    _help(e) {

    }
});
