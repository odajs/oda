import '../dialog/dialog.js';
ODA({is: 'oda-prompt', extends: 'oda-dialog',
    title: 'Input value',
    icon: 'iconoir:input-field'
})

ODA({is: 'oda-prompt-message',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            padding: 8px;
        }
        input {
            border: none;
            min-width: 0;
            background-color: transparent;
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: inherit;
            font-size: inherit;
            outline: none;
            padding: 4px 0px;
            @apply --flex;
        }
        fieldset {
            margin: 4px 0px;
            border-radius: 4px;
            border: 1px solid var(--dark-background);
            min-width: 0px;
        }
        legend {
            font-size: small;
            padding: 0px 8px;
        }
    </style>
    <fieldset class="horizontal">
        <legend>
            <label for="prompt" ~text="label"></label>
        </legend>
        <input id="prompt" autofocus :placeholder ::value>
    </fieldset>
    `,
    icon: 'icons:help',
    value: '',
    label: '',
    placeholder: 'Enter value',
    attached(){
        this.async(()=>{
            this.$('input').focus();
        })
    },
})

const prompt = ODA.showPrompt;
ODA.showPrompt = async (label='Prompt', params = {}, dialogParams, hostParams) => {
    return await prompt('oda-prompt-message', { label, ...params }, dialogParams, hostParams);
}