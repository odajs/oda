import '../modal/modal.js';
ODA({
    is:'oda-dialog',
    extends: 'oda-modal',
    template: /*html*/`
        <oda-dialog-footer :buttons slot="*" class=" no-flex"></oda-dialog-footer>
    `,
    props:{
        titleMode: 'auto',
        buttons: Array,
    }
})
ODA({
    is: 'oda-dialog-footer',
    template: /*html*/`
        <style>
            :host{
                @apply --horizontal;
                @apply --header;
            }
            oda-button{
                border: 1px solid darkgray;
                margin: 4px;
                padding: 4px;
                min-width: 50px;
            }
        </style>
        <div class="flex horizontal">
            <oda-button :icon="item.icon" ~for="buttons"></oda-button>
        </div>
        <div class="no-flex horizontal">
            <oda-button @tap="domHost.fire('ok')">OK</oda-button>
            <oda-button @tap="domHost.fire('cancel')">Cancel</oda-button>
        </div>
    `,
    props:{
        buttons:Array
    },
    close(e){
        ODA.console.log(e)
        ODA.console.status = "Изменился статус приложения"
    }
})