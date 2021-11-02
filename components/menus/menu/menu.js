// import '../../layouts/title/title.js';
import '../../buttons/icon/icon.js';
import '../../../tools/containers/containers.js';
ODA({ is: 'oda-menu', template: /*html*/`
    <style>
        ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
        ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 2px;
            background: var(--body-background);
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
        }
        :host {
            min-width: 100px;
            /*max-width: 100vw;*/
            /*max-height: 100vh;*/
            @apply --vertical;
            overflow: hidden;
        }
        :host>div{
            overflow-y: auto;
        }
        :host>div[not-group]:hover, div[not-group]>.row:hover{

            outline: 1px dotted;
            @apply --active;
        }
        .row{
            align-items: center;
        }
        span{
            padding: 4px 8px;
        }
        oda-icon{
            opacity: .5;
            align-items: center;
        }
        .item:hover{
            @apply --active;
        }
    </style>
<!--    <oda-title ~if="title" :title :icon :allow-close></oda-title>-->
    <div class="vertical flex">
        <div ~for="items" ~if="!item.hidden" class="horizontal item no-flex"  @tap.stop="_tap" :item :not-group="!item.group" ~style="getStyle(item)">
            <oda-icon class="header" ~if="!item?.group" :icon="item?.icon" :icon-size="iconSize * .7" ~style="{padding: iconSize/8+'px'}" style="filter: invert(1)"></oda-icon>
            <div class="flex horizontal row" ~class="item.group?'header':'content'">
                <div ~is="getTemplate(item)" class="flex row horizontal" :icon-size :item><span>{{item.label}}</span></div>
                <oda-button ~if="item?.items?.length" icon="icons:arrow-drop-up:90" :item @tap.stop="showSubMenu"></oda-button>
            </div>
        </div>
    </div>
    `,
    top: 0,
    props: {
        allowClose: false,
        icon: '',
        title: '',
        template: '',
        items: [],
        iconSize: 24,
        focusedItem: {
            set(n) {
                if (n) {
                    if (this.root) this.root.focusedItem = n;
                    this.parentElement.fire('ok');
                }
            }
        }
    },
    getStyle(item){
        const s = {};
        if (item?.group){
            s.position = 'sticky';
            s.top =  '0px';
            s.zIndex = 1;
            s.fontSize = 'x-small';
            s.filter = 'invert(.7)';
        }
        else{
            s.position = 'relative';
            s.top = this.top + 'px';
            s.zIndex = 0;
            s.fontSize = 'normal';
        }
        return s;
    },
    getTemplate(item){
        return item.is || item.template || (!item.group && this.template) || 'div';
    },
    async showSubMenu(e) {
        await ODA.showDropdown('oda-menu', { items: e.target.item.items, root: this, template: this.template }, { parent: e.target });
    },
    _tap(e) {
        this.focusedItem = e.currentTarget.item;
    }
});