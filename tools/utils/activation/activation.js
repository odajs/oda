export function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}
export function sigmoidDer(val) {
    return val * (1 - val);
}
export function forwardPropagation(A,B, target){
    let res = 0;
    for(let i = 0; i<A.length; i++){
        res += (A[i] * B[i]);
    }
    res = {mult: res};
    res.predict = sigmoid(res.mult);
    res.error = res.predict - target;
    res.derivate = sigmoidDer(res.predict);
    res.loss = (res.error * res.error) / 2;
    return res;
}