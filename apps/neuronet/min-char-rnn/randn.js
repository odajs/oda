// import './numjs.min.js'

let iset = 0, gset;

export default function randn() {
    let v1, v2, fac, rsq;
    if (iset == 0) {
        do {
            v1 = 2.0 * Math.random() - 1.0;
            v2 = 2.0 * Math.random() - 1.0;
            rsq = v1 * v1 + v2 * v2;
        } while ((rsq >= 1.0) || (rsq == 0));
        fac = Math.sqrt(-2.0 * Math.log(rsq) / rsq);
        gset = v1 * fac;
        iset = 1;
        return v2 * fac;
    } else {
        iset = 0;
        return gset;
    }
}

// export default function nj_random_randn(a, b = 1) { let arr = []
//     for (let i=0;i<a*b;i++) arr.push(randn())
//     return nj.array(arr).reshape(a,b)
// }
