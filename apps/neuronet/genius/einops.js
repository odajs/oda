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
        const tensors = sources.map(t=>Tensor.from(t));
        let operator = 'mul';
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
        }).join('\n');

        expr = expr[1]?.trim();
        if(expr?.length)
            operator = expr;
        let indexes = '';
        let vvvvv = '';
        expr = '('+ins.map((t, i) => {
            t.reverse();
            let mm = ''
            let idx = t.map(o => {
                let res = o.a + mm;
                mm +=' * ' + o.a + o.a;
                return res;
            }).join(' + ');
            indexes += '\nlet iii'+i+' = '+idx+';';
            vvvvv+=', iii'+i;
            idx = 'iii'+i;
            return 't_' + i + (idx?`[${idx}]`:'');
        }).join(`).${operator}(`)+')';

        outs.reverse();
        let mm = ''
        const idx = outs.map(o => {
            let res = o.a + mm;
            mm +=' * ' + o.a + o.a;
            return res;
        }).join(' + ') || 0
        let ss = 'out';
        if(outs.length){
            ss += `[ooo]`;
            indexes += `\nlet ooo = `+idx
            vvvvv = 'ooo'  + vvvvv
        }
        else{
            vvvvv = '\'_\''  + vvvvv
        }

        expr = `{\t${indexes}\n${ss}._sum(` + expr + `)\nconsole.log(${vvvvv})}`;
        expr = vars + '\n'+[...outs, ...axis].map((o, i) => {
            if (o.d)
                return '\t'.repeat(i) + `for(let ${o.a} = 0; ${o.a} < ${o.a+o.a}; ${o.a}++)`;
            return ''
        }).join('\n')+'\n' + expr;
        expr = expr + '\n return out';
        outs.reverse();
        const ein =  {
            fn:new Function(['out', ...tensors.map((_,i)=>'t_'+i)], expr),
            outs,
            label
        }

        const out = outs.length?Tensor.zeros(outs.map(o => o.d)):Tensor.from(0);
        out.children = tensors;
        out.data = ein.fn(out.data, ...tensors.map(t=>t.data));
        out.label = ein.label + (out.shape.length?(' ('+out.shape+')'):'');
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