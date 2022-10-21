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
            <label bold>Phrase for translate</label>
            <label>binding:</label>
            <label bold>BINDING: {{text}}</label>
            <label>~text:</label>
            <label bold ~text="text"></label>
            <label>~html -> text:</label>
            <label bold ~html="text"></label>
            <label>~html -> html:</label>
            <label bold ~html="html"></label>
            
            <label>~text -> html:</label>
            <label bold ~text="html"></label>
            
            <label>~html -> html: (div)</label>
            <div bold ~html="html"></div>
        `,
    get text(){
        return 'phrase for Translate '+document.location.hash.substring(1);
    },
    get html(){
        return '<label>'+this.text+' - <i>HTML</i> <i style="color:red">phrase</i></label>';
    }
})