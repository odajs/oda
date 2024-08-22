ODA({ is: 'oda-local-dirs', imports: '@oda/code-editor',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
            }
            oda-code-editor {
                border: 1px solid gray;
                margin: 4px;
                padding: 4px;
            }
        </style>
        <oda-code-editor mode="json" :src></oda-code-editor>
    `,
    src: '',
    async attached() {
        let json = await loadDir();
        this.src = JSON.stringify(json, 0, 4);
    }
})

async function loadDir(root = {}, $path = ODA.rootPath, level = 0) {
    root.name ||= 'root';
    root.level = level;
    let path = root.$path ||= $path + '/';
    console.log(level)
    try {
        root.$structure = await ODA.loadJSON(path + '_help/structure.json');
    } catch (error) {
        // console.log(error);
    }
    if (!root.items) {
        try {
            let fileName = path + '__.dir';
            let dirs = await ODA.loadJSON(fileName);
            // root.$DIR = dirs?.$DIR;
            let items = (dirs.$DIR || []).map(i => {
                let item = {};
                item.name = i.path;
                return loadDir(item, path + i.path, level + 1);
            })
            root.items = await Promise.all(items);
        } catch (error) {
            // console.log(error);
            root.items = [];
        }
        return root;
    }
    return root;
}
