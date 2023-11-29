let path = import.meta.url;
ODA({is: 'oda-markdown-editor', imports: '@oda/button, @oda/simplemde-editor, @oda/divider, @oda/md-viewer, @oda/ace-editor',
    template:`
        <style>
           :host{
                @apply --vertical;
                @apply --flex;
                min-height: 20px;
                height: 100%;
                position: relative;
            }
        </style>
        <div class="horizontal flex" style="overflow: hidden;">
            <div ~if="!readOnly && editMode" style="overflow: hidden; position: relative" ~style="{width: hideResultView ? '100%' : '50%'}">
                <oda-simplemde-editor ~if="type==='simplemde'" :value="src" @change="onchange"></oda-simplemde-editor>
                <oda-ace-editor ~if="type==='ace'" :src="src" @change="onchange" class="flex" highlight-active-line="false" show-print-margin="false" theme="solarized_light" mode="markdown" min-lines=1></oda-ace-editor></oda-ace-editor>
            </div>
            <oda-divider ~if="!readOnly" size="3" color=transparent></oda-divider>
            <div ~if="readOnly || !hideResultView || !editMode" style="overflow-x: hidden; flex: 1">
            <oda-md-viewer class="flex" :src="fount || ''" :srcmd="fount ? '' : value" :edit-mode="!readOnly" padding="0 2px"></oda-md-viewer>
            </div>
        </div>
        <div ~if="syspanel" class="horizontal header shadow" style="position: sticky; bottom: 0; border-top: 1px solid var(--border-color); z-index: 9;">
            <oda-button ~if="!readOnly" :toggled="editMode" icon="box:s-edit" title="edit mode" @tap.stop="editMode=!editMode"></oda-button>
            <oda-button ~if="editMode" :toggled="hideResultView" icon="box:i-hide" title="hide result" @tap.stop="hideResultView=!hideResultView"></oda-button>
            <oda-button icon="carbon:data-table-reference" title="open in new tab" @tap.stop="_open"></oda-button>
        </div>
    `,
    $public:{
        $pdp: true,
        type:{
            $def: 'simplemde',
            $list: ['simplemde', 'ace'],
            set(n) {
                this.src = this.value;
            },
            $save: true
        },
        editMode: {
            $def: false,
            set(n) {
                this.src = this.value;
            }
        },
        readOnly: {
            $def: true,
            set(n) {
                this.src = this.value;
                this.$render();
            }
        },
        syspanel: false,
        hideResultView: false,
    },
    src: '',
    fount: '',
    set source(v) {
        if (v !== undefined && !this.src)
            this.value = v;
    },
    set value(v) {
        if (v !== undefined && !this.src)
            this.src = v;
    },
    onchange(e) {
        this.value = e.detail.value;
        this.fire('change', this.value);
    },
    async _open() {
        const lzs = path.replaceAll('components/editors/markdown-editor/markdown-editor.js', 'tools/jupyter/lib/lz-string.js');
        if (!this.LZString) {
            const { LZString } = await import(lzs);
            this.LZString = LZString;
        }
        const str = this.LZString.compressToEncodedURIComponent(this.value);
        let url = path.replaceAll('editors/markdown-editor/markdown-editor.js', 'viewers/md-viewer/md-viewer.html') + '?lzs=' + str;
        window.open(url, '_blank').focus();
    }
})
