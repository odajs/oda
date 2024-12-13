export default {
    get allowUse() {
        return false;
    }
}

import './icons-tree/icons-tree.js';
import './icons-set/icons-set.js';
ODA({ is: 'oda-icons',
    template: /*html*/`
        <style>
            :host {
                height: 100%;
                overflow: auto;
            }
        </style>
        <oda-icons-tree
            ~if="!hideTree"
            title="icons"
            label="icons"
            ::focused-row
            ::filter-val
            slot="left-panel"
        ></oda-icons-tree>
        <oda-icons-set :icons :icon-size ::selected-icon></oda-icons-set>
    `,
    $public: {
        iconSize: {
            $def: 48,
            $save: true
        },
        selectedIcon: {
            $def: '',
            set(n) {
                if (!this.filterVal)
                    this.focusedRow = this.icons.find(i => i.icon === n);
            }
        }
    },
    focusedRow: {
        $type: Object,
        set(n) {
            if (n?.icon) {
                this.selectedIcon = n.icon;
                if (!this.filterVal) {
                    let icons = n.items?.length ? n.items : n.__parent__?.items || this.icons;
                    icons.sort((a, b) => a.name < b.name ? -1 : b.name > a.name ? 1 : 0);
                    this.icons = icons;
                }
            }
        }
    },
    hideTree: false,
    filterVal: {
        set(n) {
            if (n) {
                this.async(() => {
                    let icons = this.$('oda-icons-tree').filteredItems.filter(i => i.icon !== 'odant:folder');
                    if (icons.length > 1000) {
                        icons = icons.slice(0, 1000).map(i => i.icon);
                        icons.push('spinners:3-dots-fade');
                    }
                    this.icons = icons;
                }, 500)
            } else {
                this.hideTree = true;
                this.focusedRow = undefined; // this.focusedRow.items?.length ? this.focusedRow.items : [{ icon: this.focusedRow.icon, label: this.focusedRow.label }];
                this.async(() => this.hideTree = false);
            }
        }
    },
    icons: [],
    _icons: [],
    async attached() {
        this.layoutHost?.panels?.forEach(p => p.opened = true);
    },
})
