import '../../../components/grids/table/table.js';
ODA({
    is: 'oda-tools-dictionary-editor',
    extends: 'this, oda-table',
    template:`
        <div class="horizontal">
            <oda-button toggle-group="1" allow-toggle class="flex" ::toggled="useWords">Words</oda-button>
            <oda-button toggle-group="1" allow-toggle class="flex">Phrases</oda-button>
        </div>
        
    `,
    props:{
        src: Object,
        columns: [{name: 'text'}, {name: 'translate', template: {tag: 'input', props:{style: 'border: none;'}}}],
        showHeader: true,
        showFooter: true,
        colLines: true,
        rowLines: true,
        autoWidth: true,
        allowFocus: true,
        useWords: true
    },
    observers:[
        function SetDataSet (useWords, src){
            this.dataSet = useWords?src.words:src.phrases;
        }
    ]
})
ODA.onKeyPress('ctrl+shift+д, ctrl+shift+l', (e)=>{
    ODA.showDialog('oda-tools-dictionary-editor', {src: ODA.translates}).then(res=>{
        if (res){
            ODA.push(res)
        }
    })
})