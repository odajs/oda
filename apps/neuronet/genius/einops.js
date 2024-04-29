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
            'let' + [...outs, ...axis].map((o, i) =>` ${o.a}`).join(',') + ';',
            inputs.map((_, i) => `let t${i} = t[${i}].data;`).join('\n')].join('\n');
        if (outs.length)
            vars +='\nlet idx = 0;\n';

        const out_tabs = '\t'.repeat(outs.length);
        let body = out_tabs;
        let data_idx = (outs.length)?`[idx]`:'';
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
            t.var = `v${i} = t${i}[${expr}];\n`;
            t.back = `grad${i}[${expr}] += v${i};`;
        })



        let out_for = outs.map((o, i) => {
            let a = o.a;
            let tab = '\t'.repeat(i)
            let res = tab + `${a} = -1;\n`;
            res += tab + `while(++${o.a}<_${o.a}){`;
            for (let t = 0; t<inputs.length; t++){
                let inp = inputs[t];
                const idx = inp.findIndex(j => j.a === a);
                if (idx>-1){
                    inp.splice(idx, 1);
                    if (!inp.length){
                        // res += `\n\t${tab}let v${t} = 0;`
                        res += '\n\t' + tab + 'let ' + inp.var.replace('+=', '=');

                    }
                }
            }
            return res
        }).join('\n')+'\n' + out_tabs + 'let res = 0;\n';

        let axis_for = '\n'+inputs.map((inp, i) => {
            return (inp.length?(out_tabs + 'let v' + i + ' = 0;'):'');
        }).join('\n')+'\n';

        const anl_func = function (axis, var_back = 'var'){
            let result = ''
            const cl = axis.map((o, i)=>{
                let axis_name = o.a;
                result += '\t'.repeat(i + outs.length) + `${axis_name} = -1;\n`;
                result += '\t'.repeat(i + outs.length) + `while(++${axis_name}<_${axis_name}){\n`;
                result += inputs.map((input, idx)=>{
                    if(input.some(a=>a.a === axis_name))
                        return'\t'.repeat(i + outs.length + 1) + `v${idx} = t${idx}[${axis_name}];`;
                    return ''
                }).join('\n')+'\n';
                return '\t'.repeat( (axis.length - i - 1) + outs.length) + '}';
            }).join('\n')+'\n';
            result += '\t'.repeat(axis.length + outs.length) + 'res += ' + inputs.map((_,i)=>'v'+i).join(` ${operators[operator]} `) + ';\n';
            result += cl;
            return result + '\n';
        }

        function build_expr(mode = ''){
            switch (mode){
                case 'mul':{
                    body += `let v = out.data${data_idx} * grad${data_idx} / ${GRADIENT_DIVIDER}\n`;
                    body += inputs.map((_, i) => {
                        return out_tabs + `v${i} = v / v${i};`
                    }).join('\n')+'\n'
                    const ins_clone = structuredClone(axis);
                    body += anl_func(ins_clone, 'back')
                } break;
                default:{
                    body += `out.data${data_idx}`;
                    body += ' = res;'// + ins.map((_, i) => 'v' + i).join(` ${operators[operator]} `);
                }
            }

            if (mode !== ''){
                vars += '\nlet grad = out.grad\n';
                vars += inputs.map((_, i) => `let grad${i} = t[${i}].grad;`).join('\n')
            }


            let result = vars + '\n';
            result += out_for+ '\n'

            result += axis_for + '\n' + anl_func(axis) +  body;
            if (outs.length)
                result += '\n' + out_tabs + 'idx++;\n'
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