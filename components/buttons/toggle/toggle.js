ODA({is: 'oda-toggle', template: /*html*/`
     <style>
        :host {
            @apply --vertical;
            --toggle-size: 24;
            margin: 0;
            padding: 0;

        }
        input {
            cursor: pointer;
            width: calc(var(--toggle-size) * 2px);
            height: calc(var(--toggle-size) * 1px);
            -webkit-appearance: none;
            -moz-appearance: none;
            background: #c6c6c6;
            outline: none;
            border-radius: calc(var(--toggle-size) * 0.5px);
            box-shadow: inset 0 0 5px rgba(0,0,0, .2);
            transition: 0.5s;
            position: relative;
        }
        input:checked {
            background-color: green;
        }
        input::before {
            content: '';
            position: absolute;
            width: 50%;
            height: 100%;
            border-radius: 50%;
            top: 0;
            left: 0;
            background: #fff;
            transform: scale(1.0);
            box-shadow: 0 2px 5px rgba(0,0,0, .2);
            transition: 0.25s;
        }
        input:checked::before {
            left: 50%;
        }
    </style>
    <input type="checkbox" ::checked="toggled">`,
    props: {
        toggled: false,
        size: {
            type: Number,
            default: 24,
            set(size) {
                this.style.setProperty('--toggle-size', String(size));
            }
        }
    }
});
