// Сам класс new Zipper(<fun>,<argsDem> [, <strict>]) создает класс наследуемый от функции и который можно использовать как функцию
// где <fun> -- функция запаковки, <argsDem> -- список размерности аргументов принимаемых <fun>, 
//     <strict> -- размерность аргументов строго больше размерности целевой ф-и, по умолчанию false

export const ERROR = {
    NUM_ARGUMENTS: (args_fun, args_in) => new Error(`Zipper: У zip-функции ${args_fun} аргуметов, но подаем ${args_in}.`),
    ARGUMENT_BAD: (nom,l,l1,l2) => new Error(`Zipper: Ошибка ${nom} аргумента  на уровне ${l}. Размерность ${l1}, но есть ${l2}.`),
    SHAPE_LESS_FUN: (i, dIn ,dFun) => new Error(`Zipper: Ошибка ${i} аргумента, размерность: ${dIn}. Размерность ф-и: ${dFun}. Установите strict=false.`),
    NO_SOLUTIONS: (level,arg,d1,d2) => new Error(`Zipper: Аргумент ${arg} на уровне ${level} размерности ${d1}, а требует ${d2}. Нет решения.`),
}

export default class Zipper extends Function{
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
        if (this.argsDem.length !== args.length) ERROR.NUM_ARGUMENTS (this.argsDem.length,args.length)

        let getShape = (ts,akk=[]) => (Array.isArray(ts))? getShape(ts[0],akk.concat([ts.length])):akk
        let argShapes = args.map(arg => getShape(arg)) // посчитали Shape для всех аргументов

        let testShapes = (shape,arg,nom,level=0) => 
            !shape[0]? {}: (shape[0] !==  arg.length)? ERROR.ARGUMENT_BAD (nom,level,shape[0],arg.length)
            : arg.forEach(sA => testShapes(shape.slice(1),sA,nom,level++) )
        argShapes.forEach((s,i) => testShapes(s,args[i],i)) // проверили размерность входящих аргументов

        let sadowShapes = argShapes.map((s,i) => s.slice(0,-this.argsDem[i]))
        let rezShape = sadowShapes.reduce((akk,cur) => (akk.length>cur.length)?akk:cur, [])

        argShapes.forEach((s,i) => {
            let deltaR = ((a,b)=>(a>b)? a-b: this.strict? ERROR.SHAPE_LESS_FUN(i,b,a): 0)(this.argsDem[i], s.length)  
            let deltaL = rezShape.length - sadowShapes[i].length
            args[i] = [...new Array(deltaR+deltaL)].reduce(akk=>[akk],args[i])
            argShapes[i] = getShape(args[i])
        })
        sadowShapes = argShapes.map((s,i) => s.slice(0,-this.argsDem[i]))

        let col=(new Array(sadowShapes[0].length)).fill(1)
        sadowShapes.forEach((s,i)=> s.forEach((dem,j)=> 
            ((a,b) => ((a===1)&&(b>a))? col[j]=dem: ((b!==1)&&(b!==a))? ERROR.NO_SOLUTIONS(j,i,b,a):{}) (col[j],dem)  ))

        let makeMagic = (funArgs, shape, l=0) => {
            if (shape.length === 0) return this.fun(...funArgs)
            let newArgs = []
            for (let j=0;j<shape[0];j++) newArgs[j] = args.map((a,i)=> 
                (sadowShapes[i][l] === 0)? funArgs[i] : (sadowShapes[i][l] === 1)? funArgs[i][0] : funArgs[i][j]  )
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
// console.log('sqrZ (',x,') = ', sqrZ(x))

// ф-я concat, от 2 аргументов, размерности 1 (вектор)
let concatZ =  new Zipper((a,b)=>a.concat(b),[1,1])
// console.log('concatZ =',concatZ(x,y))


let concat3 =  new Zipper((a,b,c)=>a.concat(b).concat(c), [1,1,1] )
// console.log('concat3 = ',concat3(9,x,y))
let cc = 1
let a = testTen([1,2,3,4],()=>1)
let b = testTen([3,4],()=>2)
let c = testTen([3,1],()=>{cc++;return cc})
console.log('concat3 = ',concat3(a,b,c))

// размерность может быть разной 
let fun3 =  new Zipper((a,b,c)=> [a,b[0],c[0][0]], [0,1,2] )
// console.log('fun3 = ',fun3(3,y,x))



// можно стыковать
// console.log('sqrZ(fun3.. = ',sqrZ(fun3(3,y,x)))

// можно использовать внутри
let sqrZ2 = new Zipper((x)=>sqrZ(x+1),[0])
// console.log('sqrZ2 (',x,') = ', sqrZ2(x))


