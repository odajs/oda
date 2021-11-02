import { description } from './description/_info.js';
import { props } from './props/_info.js';
import { demo } from './demo/_info.js';
export const info = {
    api: 'oda-menu',
    source: [
        { label: 'menu.js', src: './menu.js', title: 'source code oda-menu' },
    ],
    description: description || undefined,
    props: props || undefined,
    demo: demo || undefined,
    about: `
        <div style="border: 1px solid ; color: #6699cc; background-color: lightyellow; margin: 10px;padding: 10px;border-radius: 2px;">
            <div horizontal=""><b><span>Component menu inherited from icon</span></b><span> - is ODA component.</span></div>
            <div>supported by - '<a href="mailto:support@odajs.org">ODA</a>', author - '<a href="mailto:support@odajs.org">R.A. Perepelkin</a>'</div>
            <div>Distributed under the BIS LLC.</div>
            <div>Copyright (c) 2007-2020. All rights reserved.</div>
            <div><a target="_blank" href="https://www.odajs.org">https://www.odajs.org</a></div>
        </div>`
}