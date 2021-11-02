ODA({is: 'oda-title',
    imports:['@oda/button'],
    template: `
    <style>
        :host {
            @apply --horizontal;
            @apply --no-flex;
            @apply --header;
            align-items: center;
            padding: 4px;
            position: sticky;
            position: -webkit-sticky;
            top: 0px;
            z-index: 1;
            color: white;
            fill: white;
            background-color: black;
            /*filter: invert(1);*/
        }
        oda-button{
            padding: 0px;
        }
    </style>
    <slot></slot>
    <oda-icon ~if="icon" :icon-size :icon></oda-icon>
    <span class="label bold flex">{{title}}</span>
    <div class="horizontal no-flex" style="margin-left: 8px;">
        <oda-button ~if="help" :icon-size icon="icons:help" @tap="_help"></oda-button>
        <oda-button ~if="allowClose" :icon-size icon="icons:close" @tap="fire('cancel')" style="background-color: red"></oda-button>    
    </div>`,
    props: {
        title: '',
        icon: '',
        allowClose: false
    },
    help: '',
    _help(e){

    }
});
