onconnect = function( e ) {
    const port = e.ports[0];
    url = port.url;
    port.onmessage = onmessage.bind(port);
}
onmessage = async function (e) {
    switch(e.data?.type){
        case 'init':{
            url = e.data.url;
        } break;
        case 'svg': {
            for (let i in e.data.svg){
                const icon = e.data.name + ':' + i;
                icons[icon] = e.data.svg[i];
                icons[icon].icon = icon;
            }
            resolves[e.data.resId]();
            delete resolves[e.data.resId];
        } break;
        default:{
            let n = e.data;
            if (/:[0-9]+$/.test(n)) {
                let s = n.match(/:[0-9]+$/)[0];
                n = n.replace(s, '');
            }
            let icon = icons[n];
            try {
                if (icon !== undefined){
                    this.postMessage(icon);
                }
                else if (isSVG(n)) {
                    n = n.split(':');
                    let name = n.shift();
                    await loadIcons(name, this);
                    this.postMessage({icon: e.data, type: 'request'});
                }
                else {
                    if (!n.includes('.'))
                        n += '.png';
                    if (!n.includes('/'))
                        n = url + '/tools/icons/png/' + n;
                    let file = await fetch(n);
                    if (!file.ok)
                        throw new Error(`icon file "${n}" not found!`)
                    file = await file.blob();
                    const body = await new Promise(async resolve => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            resolve(reader.result);
                        }
                    });
                    this.postMessage({icon: e.data, body});

                }
            }
            catch (err) {
                console.warn(err);
            }
        } break;
    }
}
const libs = {};
const icons = {};
function isSVG(str) {
    return (str.includes(':') && !str.includes('/'));
}
function loadIcons(name, port) {
    return libs[name] ??= fetch(url + '/tools/icons/svg/' + name + '.html').then(doc=>{
        return doc.text().then(doc=>{
            return new Promise((resolve, reject) =>{
                resolves[++resId] = resolve;
                port.postMessage({resId, type: 'svg', doc, name});
                return libs[name] = {};
            });
        })
    }).catch(e=>{
        return libs[name] = {};
    })
}
let url;
const resolves = {};
let resId = 0;
