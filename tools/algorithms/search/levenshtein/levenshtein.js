'use strict';
const cache = []
const codes = []

export function levenshtein(value, other, insensitive) {
    if (!value) return 100;
    let length
    let lengthOther
    let code
    let result
    let distance
    let distanceOther
    let index
    let indexOther

    if (value === other) {
        return 0
    }

    length = value.length
    lengthOther = other.length

    if (length === 0) {
        return lengthOther
    }

    if (lengthOther === 0) {
        return length
    }

    if (insensitive) {
        value = value.toLowerCase()
        other = other.toLowerCase()
    }

    index = 0

    while (index < length) {
        codes[index] = value.charCodeAt(index)
        cache[index] = ++index
    }

    indexOther = 0

    while (indexOther < lengthOther) {
        code = other.charCodeAt(indexOther)
        result = distance = indexOther++
        index = -1

        while (++index < length) {
            distanceOther = code === codes[index] ? distance : distance + 1
            distance = cache[index]
            cache[index] = result =
                distance > result
                    ? distanceOther > result
                    ? result + 1
                    : distanceOther
                    : distanceOther > distance
                    ? distance + 1
                    : distanceOther
        }
    }

    return result
}
export function levenshteinList(value, array, insensitive) {
    let res = array.map(v=>{
        return {value: v, distance:levenshtein(value, v, insensitive)}
    }).sort((a, b)=>{
        return a.distance>b.distance?1:-1;
    })
    return res;
}