ODA({is: 'oda-modal', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                justify-content: center;
                position: relative;
                z-index: 100;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                @apply --vertical;
                animation: fadin 5s ease-in-out;
                background-color: rgba(0, 0, 0, 0.2);
                pointer-events: none;
            }
            ::slotted(*) {
                @apply --flex;
            }
            :host > div {
                align-self: center;
                overflow: hidden;
                pointer-events: initial;
                animation: scale {{animation}}ms ease-in-out;
                max-height: {{maxHeight?maxHeight:'90%'}};
                max-width: {{maxWidth?maxWidth:'90%'}};
                min-width: {{minWidth?minWidth:'initial'}};
                min-height: {{minHeight?minHeight:'initial'}};
            }
            @keyframes fadin {
                from {background-color: rgba(0, 0, 0, 0)}
                to {background-color: rgba(0, 0, 0, 0.2)}
            }
            @keyframes scale {
                from {transform:scale(0)}
                to {transform:scale(1)}
            }
            oda-button {
                opacity: .7;
            }
            oda-button:hover {
                opacity: 1 !important;
            }
        </style>
        <div class="vertical shadow">
            <div class="horizontal no-flex accent-invert" style="align-items: center; overflow: hidden;">
                <oda-icon
                    ~if="icon"
                    no-flex
                    :icon
                    :icon-size
                    :sub-icon
                    style="margin-left: 8px;"
                ></oda-icon>
                <label
                    ~if="title"
                    ~html="title"
                    class="flex"
                    style="text-overflow: ellipsis; white-space: nowrap; padding: 8px; overflow: hidden;"
                ></label>
                <div class="flex" style="overflow: auto;">
                    <slot class="no-flex" name="modal-title"></slot>
                </div>
                <oda-button
                    :icon-size="iconSize + 4"
                    icon="icons:close"
                    style="background-color: red; align-self: flex-start;"
                    @tap.stop="cancel"
                ></oda-button>
            </div>
            <slot
                class="flex content vertical"
                style="overflow: auto;"
                @slotchange="onSlotChange"
                @dblclick.stop
            ></slot>
        </div>
    `,
    help: '',
    $public: {
        icon: '',
        subIcon: '',
        animation: 200,
        iconSize: 24,
        minHeight: undefined,
        minWidth: undefined,
        maxHeight: undefined,
        maxWidth: undefined,
    },
    $pdp: {
        title: '',
        get container() {
            return this;
        },
        control: null,
    },
    onSlotChange(e) {
        this.control ??= e.target.assignedNodes()?.[0];
    },
    cancel(e) {
        this.container.fire('cancel');
    }
})

ODA({is: 'oda-dialog-message', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                align-items: center;
                font-size: large;
            }
            label {
                word-wrap: break-word;
                white-space: pre-line;
                font-size: large;
                margin: 8px;
            }
        </style>
        <oda-icon
            ~if="icon"
            warning
            :icon
            :icon-size
            style="margin: 8px 8px 8px 16px; border-radius: 50%;"
        ></oda-icon>
        <label
            class="flex"
            ~html="message"
            ~style="{textAlign: icon?'left':'center'}"
        ></label>
    `,
    iconSize: 64,
    message: '',
    icon: 'icons:warning',
    title: 'Message'
})