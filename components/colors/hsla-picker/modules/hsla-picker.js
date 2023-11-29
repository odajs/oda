import Picker from './picker.js'

customElements.define('hsla-picker', class extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' });
        let parent = this.parent = document.createElement('div');
        parent.setAttribute('id', 'parent');
        shadow.appendChild(parent);
        let picker = new Picker(parent);
        picker._shadow = shadow;
        picker._parent = parent;
        parent.onclick = () => picker.show(this.color);
        picker.on_done = (colour) => this.color = parent.style.background = colour.hsla().toString();
        picker.on_change = (colour) => this.color = parent.style.background = colour.hsla().toString();
    }
    static get observedAttributes() { return ['size', 'color'] }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue)
            this.parent.setAttribute('style', `width:${this.size || 24}px;height:${this.size || 24}px;border:1px solid gray;cursor:pointer;background:${this.color || ''}`);
    }

    get size() { return this.getAttribute('size') }
    set size(newValue) { this.setAttribute('size', newValue) }

    get color() { return this.getAttribute('color') }
    set color(newValue) {
        this.setAttribute('color', newValue);
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: newValue }));
    }
})
