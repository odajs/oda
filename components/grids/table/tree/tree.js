ODA({is: 'oda-tree', imports: '@oda/table', extends: 'this, oda-table',
    template: /*html*/`
    <style>
        .search-container {
            min-height: {{search_height}}px;
            max-height: {{search_height}}px;
            border-radius: 0px !important;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 8px;
            gap: 2px;
        }
        .filter {
            outline: none;
            border: none;
            width:  100%;
            padding: 0px 16px;
            border-radius: 16px;
        }
    </style>
    <div ~show="showSearch" class="horizontal no-flex accent-invert search-container">
        <input
            class="flex content dimmed filter"
            type="search"
            :value="searchText"
            placeholder="Filter..."
            @input="onSearchInput"
            @keydown="onSearchKeyDown"
        >
<!--        <oda-button ~show="!hideSearchButton" icon="icons:search" :icon-size @tap="onSearchInput"></oda-button>-->
        <slot name="search-buttons"></slot>
    </div>
    `,
    get search_height(){
        return this.iconSize + this.iconSize / 2 + 4;
    },
    $public: {
        icon: 'icons:tree-structure',
        focusedRow: Object,
        autoWidth: true,
        keyName: 'name',
        disableColumnsSave: true,
        showSearch: false,
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
});