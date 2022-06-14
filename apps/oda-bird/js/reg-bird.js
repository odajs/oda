export { regBird };

import { BirdFactory } from "./bird.js";

function regBird() {
    if (window.customElements.get('neuro-bird') !== undefined)
        return;

    const el = BirdFactory();
    customElements.define("neuro-bird", el);
}

regBird();