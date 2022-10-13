ODA({is: 'oda-translate-test',
    template: `
            <style>
                :host{
                    @apply --vertical;
                    padding: 16px;
                }
                div{
                    margin-bottom: 16px;
                }
            </style>
            <label>Просто текст (div):</label>
            <div bold>phrase for translate</div>
            <label>Просто текст (label):</label>
            <label bold>phrase for translate</label>
            <label>binding:</label>
            <label bold>binding: {{text}}</label>
            <label>~text:</label>
            <label bold ~text="text"></label>
            <label>~html -> text:</label>
            <label bold ~html="text"></label>
            <label>~html -> html:</label>
            <label bold ~html="html"></label>
        `,
    get text(){
        return 'phrase for translate '+document.location.hash.substring(1);
    },
    get html(){
        return '<label>'+this.text+' - html</label>';
    }
})