const bpmnFolderPath = import.meta.url.split('/bpmn-viewer')[0]
ODA({ is: 'oda-bpmn-viewer', template: /*template*/`
        <link rel="stylesheet" href="${bpmnFolderPath}/dist/assets/bpmn-js.css">
        <script @load="scriptLoaded = true" src="${bpmnFolderPath}/dist/bpmn-viewer.development.js"></script>
    `,
    $public: {
        get bpmn() {
            return this.scriptLoaded ? new BpmnJS({container: this[CORE_KEY].shadowRoot}) : undefined
        },
        url: String
    },
    scriptLoaded: Boolean,
    $observers: {
        async loadScheme(bpmn, url) {
            if(bpmn && url) {
                const response = await fetch(url)
                const xml = await response.text()
                bpmn.importXML(xml)
            }
        }
    }
});