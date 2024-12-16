ODA({is: 'oda-tree', imports: '@oda/table', extends: 'this, oda-table',
    template: /*html*/`
    <style>
        div {
            min-height: {{iconSize}}px;
            border-radius: 0px !important;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 4px;
            gap: 2px;
        }
        div > input {
            outline: none;
            border: none;
            width:  100%;
            padding: 4px 8px;
            border-radius: 4px;
        }
    </style>
    <div ~show="!hideSearch" class="horizontal no-flex accent-invert">
        <input
            class="flex content dimmed"
            type="search"
            :value="searchText"
            placeholder="search..."
            @input="onSearchInput"
            @keydown="onSearchKeyDown"
        >
        <oda-button ~show="!hideSearchButton" icon="icons:search" :icon-size @tap="onSearchInput"></oda-button>
        <slot name="search-buttons"></slot>
    </div>
    `,
    $public: {
        icon: 'icons:tree-structure',
        focusedRow: Object,
        autoWidth: true,
        keyName: 'name',
        disableColumnsSave: true,
        hideSearch: false,
        hideSearchButton: false,
        searchText: {
            $type: String
        },
    },
    get columns() {
        return [{ name: this.keyName, treeMode: true }];
    },
    get searchInput() {
        return this.$('div > input');
    },
    attached() {
        this.async(() => {
            this.searchInput?.focus();
        }, 100)
    },
    onSearchInput(e) {
        this.searchText = (e.target.value || '');
    },
    onSearchKeyDown(e) {
        if (e.keyCode === 27) {
            this.searchInput?.blur?.();
        }
    },
    onSearchButtonTap(e) {

    }
});