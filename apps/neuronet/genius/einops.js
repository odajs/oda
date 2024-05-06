import {Tensor, GRADIENT_DIVIDER} from "./tor.js";
export class EO{
    static einsums = {};
    static parse_shape(expr, tensor){
        const shape = tensor.shape;
        const vars = expr.split('');
        if(vars.length !== shape.length)
            throw new Error(`Shape size [${shape.length}] does not match variable count [${vars.length}]`);
        vars.reduce((r, d, i)=>{
            d = d.trim();
            switch (d){
                case '_':{

                } break;
                default:{
                    r[d] = shape[i];
                }
            }
            return r
        },{})
    }
    static einsum(in_expr, ...sources){
        const tensors = sources.map(t => Tensor.from(t));
        let expr = in_expr.split('->');                            // Разделение выражения на вход и выход
        const axis = [];
        const terms = expr[0].trim().split(',');            // Разделение входа на термы
        const inputs = terms.map((term, i)=>{                  // Анализ входных термов по размерностям
            term = term.trim();
            const tensor = tensors[i];
            return term.split('').map((a, j)=>{            // Разделение терма на индексы и их анализ
                let d =  tensor.shape[j];
                let ax = axis.find(v => v.a === a);
                if(ax === undefined){
                    ax = {a, d};
                    axis.push(ax);
                }
                else if(ax.d !== d)
                    throw new Error(`Axis '${a}' == ${ax.d} but on tensor №${i+1} this axis == ${d}`);
                return ax;
            })
        });
        expr = expr[1].split(':');
        let outs = expr[0].trim().split('').map(a => {   // Разделение выходного терма на индексы и их анализ
            if(!a) return;
            let idx = axis.findIndex(v => v.a === a);
            if(idx < 0)
                throw new Error(`Unknown axis: '${a}'`);
            let ax = axis[idx];
            axis.splice(idx, 1);
            return ax;
        }).filter(i=>i)
        expr = expr[1]?.trim();
        let operator = expr?.length?expr:'mul'; // выбор оператора
        let vars = [
            [...outs, ...axis].map((o, i) =>`let _${o.a} = ${o.d};`).join('\n'),
            inputs.map((_, i) => `let t${i} = t[${i}].data;`).join('\n'),
            inputs.map((_, i) => `let idx${i} = 0;`).join('\n'),
            inputs.map((_, i) => `let v${i} = 0;`).join('\n')
        ].join('\n');
        if (outs.length)
            vars += `\nlet idx = -1;\n`;

        const out_tabs = '\t'.repeat(outs.length);

        let data_idx = (outs.length)?`[++idx]`:'';
        inputs.map((t, i) => {
            let expr = ''
            let m = ''
            for (let o of t.toReversed()){
                if (m)
                    expr += ' + ' + m;
                expr += o.a;
                m =  '_' + o.a +' * (';
            }
            expr += ')'.repeat(t.length - 1);
            t.idx_expr = expr;
        })

        let out_for = outs.map((o, i) => {
            let axis_name = o.a;
            let tab = '\t'.repeat(i)
            let res = tab + `for(let ${axis_name} = 0; ${axis_name} < _${axis_name}; ${axis_name}++){`;
            return res
        }).join('\n')+'\n'
        const input_for_func = function (ts, back = false){
            const uses = outs.map(o => o.a);
            let result = ''
            let cl = 0;
            let tab = 0
            let tabs = out_tabs;
            let backs = '';
            inputs.map((input, i)=>{
                for (let axis of input){
                    if (uses.includes(axis.a))
                        continue;
                    uses.push(axis.a);
                    result+= tabs + `for(let ${axis.a} = 0; ${axis.a} < _${axis.a}; ${axis.a}++){\n`
                    cl++;
                    tab++
                    tabs = out_tabs + '\t'.repeat(tab)
                }
                result += tabs+`idx${i} = ${input.idx_expr};\n`;
                result += tabs+`v${i} = t${i}[idx${i}];\n`;
                backs += tabs+`grad${i}[idx${i}] += ${inputs.map((_, gi)=>{
                    if (gi !== i)
                        return 'v'+gi
                }).filter(n=>n).join(` ${operators[operator]} `)}`;
                if(inputs.length>1)
                    backs +=' * ';
                backs += '_g;\n';


            })
            if (!back)
                result += tabs + 'res += ' + inputs.map((_,i)=>'v'+i).join(` ${operators[operator]} `) + ';\n';
            else{
                result += backs;
            }
            result += Array(cl).fill('').map((c, i)=> out_tabs + '\t'.repeat(i) + '}').toReversed().join('\n')
            return result + '\n';
        }

        function build_expr(mode = ''){
            let body = '';
            switch (mode){
                case 'mul':{
                    body += input_for_func(inputs, true);
                } break;
                default:{
                    body += input_for_func(inputs);
                    body += out_tabs + `out.data${data_idx}`;
                    body += ' = res;';
                }
            }
            // body += '\n'+out_tabs + 'idx++'

            if (mode !== ''){
                vars += '\nlet grad = out.grad\n';
                vars += inputs.map((_, i) => `let grad${i} = t[${i}].grad;`).join('\n')
            }

            let result = vars + '\n';
            result += out_for + '\n'
            if (mode !== ''){
                result += out_tabs + `let _g = grad${data_idx} / ${GRADIENT_DIVIDER ** 2}\n`;
            }
            else
                result +=  out_tabs + `let res = 0;`;
            result += /*axis_for + */'\n' + body + '\n';
            result += outs.map((_, i)=>'\t'.repeat(i)+'}').toReversed().join('\n');
            return result;
        }


        let fwd_expr = build_expr();
        const data = outs.length?new Float32Array(outs.reduce((r,a)=> r * a.d, 1)):0;
        const out = Tensor.from(data);
        out.reshape(outs.map(i=>i.d));
        out.children = tensors;
        const fn = new Function('t', 'out', fwd_expr);
        let back_expr = build_expr(operator);
        const back_fn = new Function('t', 'out', back_expr);
        out._back = function (){
            // console.time(in_expr+'-back')
            back_fn(tensors, out);
            // console.timeEnd(in_expr+'-back')
        }
        // console.time(in_expr)
        fn(tensors, out);
        // console.timeEnd(in_expr)
        out.label = 'einsum: \"'+in_expr+'\"' + (out.shape.length?(' ('+out.shape+')'):'');



        return out;
    }
    static rearrange(expr, tensor){

    }
    static reduce(expr, tensor, agg_func = 'max'){

    }
    static repeat(expr, tensor, vars = {}){

    }
    static pack(expr, inputs){

    }
    static unpack(expr, inputs){

    }
}
const operators = {
    'mul': ' * ',
    '*': ' * ',
    'div': ' / ',
    '/': ' / ',
    'plus': ' + ',
    '+': ' + ',
    'add': ' + ',
    'minus': ' - ',
    '-': ' - ',
}

const tests = [
    (check = 15)=>{
        const v = Tensor.from([1, 2, 3, 4, 5]);
        const res = EO.einsum("i->", v);
        if (res.data !== check) throw new Error('Сумма всех значений вектора');
    },
    (check = 21)=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = EO.einsum("ij->", v);
        if (res.data !== check) throw new Error('Сумма всех значений матрицы');
    },
    (check = [9, 12])=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = EO.einsum("ij->j", v);
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Сумма значений по столбцам');
        }
    },
    (check = [3, 7, 11])=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = EO.einsum("ij->i", v);
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Сумма значений по строкам');
        }
    },
    (check = [[1, 3, 5], [2, 4, 6]])=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = EO.einsum("ij->ji", v);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Транспонирование');
        }
    },
    (check = [[5], [11], [17]])=>{
        const v1 = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const v2 = Tensor.from([[1, 2]]);
        const res = EO.einsum("ij,kj->ik", v1,  v2);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Умножение матрицы на вектор');
        }
    },
    (check = [[1, 2], [3, 4], [5, 6]])=>{
        const v1 = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const v2 = Tensor.from([[1, 0], [0, 1]]);
        const res = EO.einsum("ik,kj->ij", v1,  v2);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Умножение матрицы на матрицу');
        }
    },
    (check = 6)=>{
        const v1 = Tensor.from([[1, 2, 3]]);
        const v2 = Tensor.from([[1, 1, 1]]);
        const res = EO.einsum("ik,jk->", v1,  v2);
        if (res.data !== check) throw new Error('Скалярное произведение векторов');
    },
    (check = 15)=>{
        const v1 = Tensor.from([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        const res = EO.einsum("ii->", v1);
        if (res.data !== check) throw new Error('След матрицы');
    },
    (check = [[1, 0, 0], [0, 5, 0], [0, 0, 9]])=>{
        const v1 = Tensor.from([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        const v2 = Tensor.from([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const res = EO.einsum("ij,ij->ij", v1,  v2);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Адамарово (покомпонентное) произведение');
        }
    },
    (check = [[1, 0, 0], [2, 0, 0], [3, 0, 0]])=>{
        const v1 = Tensor.from([1, 2, 3]);
        const v2 = Tensor.from([1, 0, 0]);
        const res = EO.einsum("i,j->ij", v1,  v2);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Кронекерово (внешнее) произведение векторов');
        }
    },
    (check = [[[0, 1, 2], [1, 2, 3]], [[1, 2, 3], [2, 3, 4]], [[2, 3, 4], [3, 4, 5]]])=>{
        const v1 = Tensor.from([[[0, 1], [1, 2], [2, 3]], [[1, 2], [2, 3], [3, 4]], [[2, 3], [3, 4], [4, 5]]]);
        const res = EO.einsum("ijk->jki", v1);
        check = check.flat().flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Транспонирование тензора');
        }
    },
    (check = [[[2, 3], [5, 8], [8, 13]], [[5, 8], [8, 13], [11, 18]], [[8, 13], [11, 18], [14, 23]]])=>{
        const v1 = Tensor.from([[[0, 1], [1, 2], [2, 3]], [[1, 2], [2, 3], [3, 4]], [[2, 3], [3, 4], [4, 5]]]);
        const v2 = Tensor.from([[1, 2], [2, 3]]);
        const res = EO.einsum("ijk,nk->ijn", v1,  v2);
        check = check.flat().flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Произведение тензора на матрицу по третьей модев');
        }
    },
]

setTimeout(()=>{
    for (let test of tests)
        test()
})

