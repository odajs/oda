const bpmnFolderPath = import.meta.url.split('/bpmn-modeler')[0]
ODA({ is: 'oda-bpmn-modeler', template: /*template*/`
        <link rel="stylesheet" href="${bpmnFolderPath}/dist/assets/bpmn-js.css">
        <link rel="stylesheet" href="${bpmnFolderPath}/dist/assets/diagram-js.css">
        <link rel="stylesheet" href="${bpmnFolderPath}/dist/assets/bpmn-font/css/bpmn.css">

        <script @load="scriptLoaded = true" src="${bpmnFolderPath}/dist/bpmn-modeler.development.js"></script>
    `,
    $public: {
        get bpmn() {
            return this.scriptLoaded ? new BpmnJS({ container: this[CORE_KEY].shadowRoot }) : undefined
        },
        get eventBus() {
            return this.bpmn?.get('eventBus')
        },
        url: String
    },
    scriptLoaded: Boolean,
    $observers: {
        async loadScheme(bpmn, url) {
            if (bpmn && url) {
                const response = await fetch(url)
                const xml = await response.text()
                bpmn.importXML(xml)
            }
        }
    },
    attached() {
        let fontFaceSheet = new CSSStyleSheet()
        fontFaceSheet.replaceSync(`@font-face {
            font-family: 'bpmn';
            src: url('${bpmnFolderPath}/dist/assets/bpmn-font/font/bpmn.eot?21877404');
            src: url('${bpmnFolderPath}/dist/assets/bpmn-font/font/bpmn.eot?21877404#iefix') format('embedded-opentype'),
                 url('${bpmnFolderPath}/dist/assets/bpmn-font/font/bpmn.woff2?21877404') format('woff2'),
                 url('${bpmnFolderPath}/dist/assets/bpmn-font/font/bpmn.woff?21877404') format('woff'),
                 url('${bpmnFolderPath}/dist/assets/bpmn-font/font/bpmn.ttf?21877404') format('truetype'),
                 url('${bpmnFolderPath}/dist/assets/bpmn-font/font/bpmn.svg?21877404#bpmn') format('svg');
            font-weight: normal;
            font-style: normal;
        }`)
        if(!document.adoptedStyleSheets.some(sheet => sheet.cssRules[0].cssText === fontFaceSheet.cssRules[0].cssText))
            document.adoptedStyleSheets = [...document.adoptedStyleSheets, fontFaceSheet]
    }
});