class odaAppLayout extends odaFormLayout {
    showTitle = false;
    hideHeader: boolean;
    autoCompact: boolean;
    compact: boolean;
    compactThreshold: number;
    appHeader: odaComponent;
    leftPanelElement: odaAppLayoutDrawer;
    rightPanelElement: odaAppLayoutDrawer;
}

class odaAppLayoutDrawer extends odaComponent{
    pos: 'left' | 'right';
    tabs: TabIte[];
    controls: Array<DrawerControl>;
    focusedIndex: number;
    openedControl: DrawerControl;
}

type DrawerControl = odaComponent & { icon: string, label: string, order: number };

type TabItem = {
    icon: string,
    subIcon: string,
    label: string,
    title: string,
    order: number,
    $item: any
};