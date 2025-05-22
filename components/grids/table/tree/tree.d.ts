interface Tree extends Table {
    search_height: number;
    searchText: string;
    searchInput: HTMLInputElement;
    keyName: string;

    onSearchInput(e: InputEvent);
    onSearchKeyDown(e: KeyboardEvent);
}