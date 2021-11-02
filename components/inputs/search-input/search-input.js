//import search from "../../../../core/structure/server/methods/search/search";

ODA({is: "oda-search-input", imports:['@oda/button'],
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                padding: 8px;
                outline: 1px solid rgba(0, 0, 0, .5);
                outline-offset: -10px;
                min-height: 32px;
                @apply --no-flex;
                align-items: center;
            }

            input {
                /*@apply --flex;*/
                padding: 6px;
                /*min-width: 50px;*/
                width: 100%;
                border: none;
                outline: none;
            }
        </style>
        <input placeholder="search..." ::value>
        <oda-button icon="icons:search" @tap="search"></oda-button>
    `,
    props: {
        value: {
            type: String,
            set(n, o) {
                this.fire('changed', n);
            }
        },
    },
    listeners: {
        keydown(e) {
            if (e.key === 'Enter') {
                this.search();
            }
        }
    },
    search(e) {
        this.fire('search', this.value);
    },
});

