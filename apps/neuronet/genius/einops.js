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
        const tensors = sources.map(t=>Tensor.from(t));
        let operator = ' * ';
        const label = 'einsum: \"'+in_expr+'\"';
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
        vars += 'let out = '+(outs.length?'new Float32Array('+outs.reduce((r,a)=> r * a.d, 1)+')':'0') + ';';
        expr = expr[1]?.trim();
        if(expr?.length)
            operator = expr;
        expr = ins.map((t, i) => {
            t.reverse();
            let mm = ''
            let idx = t.map(o => {
                let res = o.a + mm;
                mm +=' * ' + o.a + o.a;
                return res;
            }).join(' + ');
            t.var = `let idx_${i} = ${idx};\n`;
            idx = 'iii'+ i;
            return 'val_' + i;
        }).join(` ${operator} `)+';';

        let mm = ''
        const idx = outs.map(o => {
            let res = o.a + mm;
            mm +=' * ' + o.a + o.a;
            return res;
        }).join(' + ') || 0
        let ss = 'out';
        if(outs.length){
            ss += `[idx]`;
        }


        let out_for = vars + '\n'+[...outs/*, ...axis*/].map((o, i) => {
            let a = o.a;
            let tab = '\t'.repeat(i)
            let res =  tab + `for(let ${a} = 0; ${a} < ${a + a}; ${a}++){`;
            for (let t = 0; t<ins.length; t++){
                let inp = ins[t];
                const idx = inp.findIndex(j => j.a === a);
                if (idx>-1){
                    inp.splice(idx, 1);
                    if (!inp.length){
                        res += '\n\t' + tab + inp.var;
                        res += '\n\t' + tab + 'let val_' + t + ' = t_' + t + '[idx_' + t + '];'
                    }
                }
            }
            return res
        }).join('\n');
        let axis_for = '\n'+ins.map((a, i) => {
            return (a.length?('\t'.repeat(outs.length) + 'let val_' + i + ' = 0;'):'')
        }).join('\n')+'\n';
        axis_for += axis.map((o, i) => {
            let a = o.a;
            let tab = '\t'.repeat(i+outs.length)
            let res =  tab + `for(let ${a} = 0; ${a} < ${a + a}; ${a}++){`;
            for (let t = 0; t<ins.length; t++){
                let inp = ins[t];
                const idx = inp.findIndex(j => j.a === a);
                if (idx>-1){
                    inp.splice(idx, 1);
                    if (!inp.length){
                        res += '\n\t'+tab + inp.var;
                        res += '\t' + tab + 'val_' + t + ' += t_' + t + '[idx_' + t + '];\n'
                    }
                }
            }
            return res
        }).join('\n') + '\n'+ '\t'.repeat(outs.length)+'}'.repeat(axis.length);

        let main_expr = axis_for + `\n${'\t'.repeat(outs.length)+ss} = ${expr}\n${'\t'.repeat(outs.length)}idx++;\n${'\t'.repeat(outs.length-1)}`;
        main_expr += '}'.repeat(outs.length);
        expr = out_for + main_expr;
        expr = expr + '\n return out';

        const ein =  {
            fn:new Function([...tensors.map((_,i)=>'t_'+i)], expr),
            outs,
            label
        }
        let data = ein.fn(...tensors.map(t=>t.data));
        const out = Tensor.from(data).reshape(outs.map(i=>i.d));
        out.children = tensors;
        out.label = ein.label + (out.shape.length?(' ('+out.shape+')'):'');
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