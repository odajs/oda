// Сам класс new Zipper(<fun>,<argsDem> [, <strict>]) создает класс наследуемый от функции и который можно использовать как функцию
// где <fun> -- функция запаковки, <argsDem> -- список размерности аргументов принимаемых <fun>, 
//     <strict> -- размерность аргументов строго больше размерности целевой ф-и, по умолчанию false

export const ERROR = {
    NUM_ARGUMENTS_NOT_MATCH: (num_args, ) => new Error(`Item "${pathname}" not found`),
    // let err0 = (n1,n2) => {
    //     throw new Error()
    //     console.error(`Zipper: Ошибка, количество аргументов функции ${n1}, но подали ${n2}.`)
    // }
    ITEM_NOT_FOUND: (pathname) => new Error(`Item "${pathname}" not found`),
    UNKNOWN_ITEM_METHOD: (item, method) => new Error(`Unknown method "${method}" for item "${JSON.stringify(item)}"`),
    FILE_NOT_FOUND: (path) => new Error(`File "${path}" not found`),
    UNAVAILABLE_ITEM_METHOD: (descr) => new Error(`Unavailable item method "${JSON.stringify(descr)}"`),
    LOADED_MODULE_CORRUPTED: (pathname) => new Error(`Loaded module "${pathname}" is corrupted`),
}

class Zipper extends Function{
    constructor(fun,argsDem,strict=false) {
        super()
        this.fun = fun
        this.argsDem = argsDem
        this.strict = strict
        return new Proxy(this, {
            apply(target, _, args) { return target.__call__(...args) }
        })
    }
    __call__() {
        let args = [...arguments]
        let err0 = (n1,n2) => {
            throw new Error()
            console.error(`Zipper: Ошибка, количество аргументов функции ${n1}, но подали ${n2}.`)
        }
        if (this.argsDem.length !== args.length) { // проверили кол-во аргументов
            ERROR.NUM_ARGUMENTS_NOT_MATCH(this.argsDem.length,args.length);
            // err0(this.argsDem.length,args.length); return
        }

        let getShape = (ts,akk=[]) => (Array.isArray(ts))? getShape(ts[0],akk.concat([ts.length])):akk
        let argShapes = args.map(arg => getShape(arg)) // посчитали Shape для всех аргументов
        let err1 = (i, dIn ,dFun) => {console.error(`Zipper: Ошибка ${i} аргумента, размерность: ${dIn}. Размерность ф-и: ${dFun}. Установите strict=false.`)}
        argShapes.forEach((s,i)=> { // расширим, 
            let dem =this.argsDem[i] - s.length 
            return (dem>0)? this.strict? err1(i,s.length,this.argsDem[i]): args[i] = [...new Array(dem)].reduce(akk=>[akk],args[i]): {}
        })
        if (!this.strict) argShapes = args.map(arg => getShape(arg)) // поправим размерность

        let err2 = (nom, l ,l1,l2) => {
            console.error(`Zipper: Ошибка аргумента ${nom} на уровне ${l}. Размерность ${l1}, но есть ${l2}.`)
        }
        let testShapes = (shape,arg,nom,level=0) => {
            if (shape[0] === undefined) return true
            if (shape[0] !==  arg.length) {err2(nom,level,shape[0],arg.length); return false}
            return arg.map(sA => testShapes(shape.slice(1),sA,nom,level++) ).every((a)=>a)            
        }
        if (argShapes.map((s,i) => testShapes(s,args[i],i) ).every((a)=>!a) ) return // проверили размерность входящих аргументов
        
        let maskShapes = argShapes.map((s,i) => s.slice(0,s.length-this.argsDem[i]) )
        let maxDepth =  Math.max(...maskShapes.map(s => s.length))
        maskShapes = maskShapes.map(s => new Array(maxDepth-s.length).fill(0).concat(s))

        let rezShape = maskShapes[0].map((_,i) => {            
            let maxS = maskShapes.map(arg => arg[i]).filter(d => d>1)
            return  (maxS.length === 0)? 1 : (maxS.length === 1)? maxS[0]: -1
        })
        
        let err3 = () => console.error(`Zipper: Неизвестно как такое Зиппить`)
        if (rezShape.includes(-1)) { err3(); return }

        let makeMagic = (funArgs, shape, l=0) => {
            if (shape.length === 0) return this.fun(...funArgs)
            let newArgs = []
            for (let j=0;j<shape[0];j++) newArgs[j] = args.map((a,i)=> 
                (maskShapes[i][l] === 0)? funArgs[i] : (maskShapes[i][l] === 1)? funArgs[i][0] : funArgs[i][j]  )
            return newArgs.map(a => makeMagic(a, shape.slice(1)),l++ )
        }

        return makeMagic(args,rezShape)
    }
}

// testTen(<shape>,<filling>) -- ф-я для удобства создания тестовых примеров, где <shape> -- размерность, <filling> -- ф-я заполнения
function testTen(shape,filling) {
    if (shape[0] === undefined) return filling()
    else return [...new Array(shape[0])].map(() => testTen(shape.slice(1),filling) )
}
// Набор тестовых аргументов
let x = testTen([2,3,1,4,5,6],()=>2)
let y = testTen([2],()=>(Math.random()*10).toFixed(0)*1) // заполнено целыми от [0-9]
let bad = [[[1,1],[2,2]],[[3,3],[4,4],[5,5]]] // пример поломанного аргумента
// console.log(x,y)

// Тестовые ф-и
// ф-я одного аргумента нулевой размерности (число), возводит в квадрат
let sqrZ = new Zipper((x)=>x**2,[0])
console.log('sqrZ (',x,') = ', sqrZ(x))

// ф-я concat, от 2 аргументов, размерности 1 (вектор)
let concatZ =  new Zipper((a,b)=>a.concat(b),[1,1])
console.log('concatZ =',concatZ(x,y))


let concat3 =  new Zipper((a,b,c)=>a.concat(b).concat(c), [1,1,1] )
console.log('concat3 = ',concat3(9,x,y))

// размерность может быть разной 
let fun3 =  new Zipper((a,b,c)=> [a,b[0],c[0][0]], [0,1,2] )
console.log('fun3 = ',fun3(3,y,x))

// можно стыковать
// console.log('sqrZ(fun3.. = ',sqrZ(fun3(3,y,x)))

// можно использовать внутри
let sqrZ2 = new Zipper((x)=>sqrZ(x+1),[0])
console.log('sqrZ2 (',x,') = ', sqrZ2(x))


