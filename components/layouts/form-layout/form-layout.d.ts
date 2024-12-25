class odaFormLayout extends odaComponent {
    title = '';
    icon = '';
    subIcon = '';
    iconSize = 24;
    allowClose = false;

    sidePadding: number;
    _parentWidth = 0;
    _parentHeight = 0;
    float: boolean;
    dialog: boolean;

    unique = '';
    _parentForm: odaFormLayout;

    zIndex: number;
    focused: boolean;

    track(e: TrackEvent)

    _getAllForms(): Set<FormLayout>;
    _getChildForms(): Set<FormLayout>;

    _top(): void;

    _applyMove(): void;
    _applyResize(): void;
    _checkTitleIsSmall(): boolean;
    _updateTrackListen(): void;
    _resize(): void;
    _setTransform(): void;
    _toggleSize(): void;
}
