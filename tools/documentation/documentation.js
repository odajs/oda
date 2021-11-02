import '../../oda.js';
import '../../components/viewers/md-viewer/md-viewer.js'

ODA({
    is: 'oda-documentation',
    template: `
        <oda-md-viewer ~if="src" :src class="flex" style="border: none"></oda-md-viewer>
    `,
    props: {
        item: Object,
        src() {
            if (this.item?.content?.abstract)
                return this.item.content.abstract;
            if (this.item?.name?.includes('.md') && this.item?.$level === 0)
                return this.item?.$id || this.item?.content?.link || this.item?.content?.src || '';
            return '';
        }
    }
})
