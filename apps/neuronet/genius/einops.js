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
        let vars = [...outs, ...axis].map((o, i) =>{
            return 'let '+ o.a + o.a + ' = ' + o.d +';';
        }).join('\n') + '\nlet idx = 0;\n';
        vars += ins.map((_,i) => `let t${i} = t[${i}];\nlet m${i} = m[${i}]`).join('\n')+'\n';
        expr = expr[1]?.trim();

        let operator = expr?.length?expr:' * '; // выбор оператора

        expr = ins.map((t, i) => {
            let v = ''
            const idx_expr = t.toReversed().map(o=>{
                if (!v){
                    v = o.a+o.a;
                    return o.a;
                }
                let res = o.a + ' * ' + v
                v = (o.a + o.a) + ' * ' + v;
                return res
            }).join(' + ');
            t.var = `let idx_${i} = ${idx_expr};\n`;
            t.var += `mm${i}.push(idx_${i});\n`;
            return 'val_' + i;
        }).join(` ${operator} `)+';';

        let mm = ''
        const idx = outs.map(o => {
            let res = o.a + mm;
            mm +=' * ' + o.a + o.a;
            return res;
        }).join(' + ') || 0
        let ss = 'out.data';
        if(outs.length){
            ss += `[idx]`;
        }



        let out_for = vars + '\n' + outs.map((o, i) => {
            let a = o.a;
            let tab = '\t'.repeat(i)
            let res =  tab + `for(let ${a} = 0; ${a} < ${o.a+o.a}; ${a}++){`;
            for (let t = 0; t<ins.length; t++){
                let inp = ins[t];
                const idx = inp.findIndex(j => j.a === a);
                if (idx>-1){
                    inp.splice(idx, 1);
                    if (!inp.length){
                        res += '\n\t' + tab + inp.var;
                        res += '\n\t' + tab + 'let val_' + t + ' = t' + t + '[idx_' + t + '];'
                    }
                }
            }
            return res
        }).join('\n');
        out_for += '\n' + tensors.map((o,i) => '\t'.repeat(outs.length)+`let mm${i} = m${i}.grads[idx] = [];`).join('\n');
        let axis_for = '\n'+ins.map((inp, i) => {
            let result = (inp.length?('\t'.repeat(outs.length) + 'let val_' + i + ' = 0;'):'')+'\n'
            if (inp.length){
                result += inp.map((axis, a)=>{
                    let tab = '\t'.repeat(a + outs.length);
                    let res =  tab + `for(let ${axis.a} = 0; ${axis.a} < ${axis.a+axis.a}; ${axis.a}++){`;
                    return res;
                }).join('\n')+'\n'+'\t'.repeat(inp.length + outs.length) + inp.var;
                result += '\t'.repeat(inp.length + outs.length) + 'val_'+i+' += t'+i+'[idx_'+i+'];\n';

                result += '\t'.repeat(outs.length)+ '}'.repeat(inp.length)
            }
            return result;
        }).join('\n')+'\n';
        let main_expr = tensors.map((o,i) => '\t'.repeat(outs.length)+`m${i}.data[idx] = val_${i}`).join('\n');
        if (outs.length)
            main_expr += `\n${'\t'.repeat(outs.length)+ss} = ${expr}\n${'\t'.repeat(outs.length)}idx++;\n${'\t'.repeat(outs.length-1)}`;
        else
            main_expr += `\n${ss} = ${expr}\nidx++;`;
        main_expr = axis_for +  main_expr;
        main_expr += '}'.repeat(outs.length);
        expr = out_for + main_expr;


        const data = outs.length?new Float32Array(outs.reduce((r,a)=> r * a.d, 1)):0;
        const out = Tensor.from(data);
        out.reshape(outs.map(i=>i.d));
        out.children = tensors.map(t => Tensor.zeros(out.shape, 'medium', t));
        const fn = new Function('t', 'm', 'out', expr);
        fn(tensors.map(t=>t.data), out.children, out);
        out.label = 'einsum: \"'+in_expr+'\"' + (out.shape.length?(' ('+out.shape+')'):'');
        console.timeEnd(in_expr)
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