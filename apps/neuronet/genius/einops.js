import {Tensor} from "./tor.js";
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
        console.time(in_expr)
        const tensors = sources.map(t => Tensor.from(t));

        let expr = in_expr.split('->');                            // Разделение выражения на вход и выход
        const axis = [];
        const terms = expr[0].trim().split(',');            // Разделение входа на термы
        const ins = terms.map((term, i)=>{                  // Анализ входных термов по размерностям
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
        const outs = expr[0].trim().split('').map(a => {   // Разделение выходного терма на индексы и их анализ
            if(!a) return;
            let idx = axis.findIndex(v => v.a === a);
            if(idx < 0)
                throw new Error(`Unknown axis: '${a}'`);
            let ax = axis[idx];
            axis.splice(idx, 1);
            return ax;
        }).filter(i=>i)
        expr = expr[1]?.trim();
        let operator = expr?.length?expr:' * '; // выбор оператора

        let vars = [
            [...outs, ...axis].map((o, i) =>`let _${o.a} = ${o.d};`).join('\n'),
            ins.map((_, i) => `let t${i} = t[${i}];`).join('\n'),
            'let idx = 0;'].join('\n');

        const out_tabs = '\t'.repeat(outs.length);
        expr = out_tabs + 'out.data';
        if(outs.length){
            expr += `[idx]`;
        }

        expr += ' = '+ins.map((t, i) => {
            let expr = ''
            let m = ''
            for (let o of t.toReversed()){
                if (m)
                    expr += ' + ' + m;
                expr += o.a;
                m =  '_' + o.a +' * (';
            }
            expr += ')'.repeat(t.length - 1);
            t.var = `v${i} += t${i}[${expr}];\n`;
            return 'v' + i;
        }).join(` ${operator} `)+';\n';
        expr += out_tabs + 'idx++;\n'

        let out_for = vars + '\n' + outs.map((o, i) => {
            let a = o.a;
            let tab = '\t'.repeat(i)
            let res =  tab + `for(let ${a} = 0; ${a} < _${o.a}; ${a}++){`;
            for (let t = 0; t<ins.length; t++){
                let inp = ins[t];
                const idx = inp.findIndex(j => j.a === a);
                if (idx>-1){
                    inp.splice(idx, 1);
                    if (!inp.length){
                        res += '\n\t' + tab + inp.var;
                        res += '\n\t' + tab + 'let v' + t + ' = t' + t + '[idx' + t + '];'
                    }
                }
            }
            return res
        }).join('\n');
        let axis_for = '\n'+ins.map((inp, i) => {
            return (inp.length?(out_tabs + 'let v' + i + ' = 0;'):'');
        }).join('\n')+'\n';
        const anl_func = function (ins, step = 0){
            return ins.map((inp, i) => {
                let result = '';
                let o;
                let j = 0;
                while(o = inp.shift()){
                    result += '\t'.repeat(step + j + outs.length) + `for(let ${o.a} = 0; ${o.a} < _${o.a}; ${o.a}++){`;
                    const any = ins.filter((iinp, ii)=>ii != i && iinp.some(oo=>oo.a === o.a));
                    result += '\n'+ any.map(any_inp=>{
                        const idx = any_inp.findIndex(any_o=>any_o.a === o.a);
                        any_inp.splice(idx, 1);
                        if (any_inp.length === 0){
                            return '\t'.repeat(step + 1 + j + outs.length) + any_inp.var;
                        }
                        return '';
                    }).join('\n');
                    result += anl_func(any, step + 1);
                    j++;
                }
                if (j){
                    result += '\t'.repeat(step + j + outs.length) + inp.var +'\n';
                    result += out_tabs + '\t'.repeat(step) + '}'.repeat(j);
                }
                return result;
            }).join('\n');
        }
        axis_for += '\n' + anl_func(ins);

        expr = axis_for +  expr;
        expr += outs.map((_, i)=>'\t'.repeat(i)+'}').toReversed().join('\n');
        expr = out_for + expr;

        const data = outs.length?new Float32Array(outs.reduce((r,a)=> r * a.d, 1)):0;
        const out = Tensor.from(data);
        out.reshape(outs.map(i=>i.d));
        out.children = tensors;
        const fn = new Function('t', 'out', expr);
        fn(tensors.map(t=>t.data), out);
        out.label = 'einsum: \"'+in_expr+'\"' + (out.shape.length?(' ('+out.shape+')'):'');
        console.timeEnd(in_expr)
        out._back = function (){
            console.log('back')
        }
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