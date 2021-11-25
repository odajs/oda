export { regDino };

import { DinoFactory } from "./neuro-dino.js";

function regDino() {
    if (window.customElements.get('neuro-dino') !== undefined)
        return;
    const el = DinoFactory();
    customElements.define("neuro-dino", el);
}

regDino();