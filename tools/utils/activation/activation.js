export function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}
export function sigmoidDer(val) {
    return val * (1 - val);
}