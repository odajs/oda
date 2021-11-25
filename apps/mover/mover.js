export default class Mover {
    x; y; angle; #step; #rotate;
    #toRad = Math.PI / 180
    constructor(x = 0, y = 0, angle = 0, step = 10, rotate = 90) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.#step = step;
        this.#rotate = rotate;
    }
    left(rotate = this.#rotate) {
        this.angle += rotate;
    }
    right(rotate = this.#rotate) {
        this.angle -= rotate;
    }
    forward(step = this.#step) {
        const rad = (-this.angle) * this.#toRad;
        this.x += step * Math.cos(rad)
        this.y -= step * Math.sin(rad)
    }
    back(step = this.#step) {
        this.forward(-step)
    }
    sets(s = {}) {
        this.x = s.x;
        this.y = s.y;
        this.angle = s.angle;
    }
    toString() {
        return `x: ${this.x}, y: ${this.y}, angle: ${this.angle}`;
    }
}