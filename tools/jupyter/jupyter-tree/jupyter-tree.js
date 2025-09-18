ODA({
    is: 'oda-jupyter-tree', imports: '@oda/tree', extends: 'oda-tree',
    allowFocus: true,
    get dataSet() {
        return [this.notebook];
    },
    cellTemplate: 'oda-jupyter-tree-cell',
    autoFixRows: true,
    hideRoot: true,
    hideTop: true,
    allowSelection: 'level'
});
ODA({
    is: 'oda-jupyter-tree-cell', extends: 'oda-table-cell-base',
    template: /*html*/`
        <style>
            span{
                padding: 0px 8px;
            }
            .btn-code:hover{
                border-radius: 50%;
                @apply --success-invert;
            }
            .circular-progress-container {
                margin: 4px 0px 4px 4px;
            }
            .hidden-progress {
                position: absolute;
                opacity: 0;
                width: 0;
                height: 0;
            } 
            .circular-progress {
                --size: 32px;
                --border-width: 3px;
                --progress: 0;
                
                width: var(--size);
                height: var(--size);
                border-radius: 50%;
                background: conic-gradient(
                #3498db calc(var(--progress) * 3.6deg),
                #eee 0deg
                );
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }     
            .circular-progress::before {
                content: '';
                position: absolute;
                width: calc(100% - var(--border-width) * 2);
                height: calc(100% - var(--border-width) * 2);
                background: white;
                border-radius: 50%;
            }
            .progress-text {
                position: relative;
                font-family: Arial, sans-serif;
                font-size: 10px;
                color: #333;
                z-index: 1;
            }
        </style>
        <div ~if="item.type === 'code' && cell?.showProgress" class="circular-progress-container" @down.stop="onTap" style="margin-left: 0px; cursor: pointer;">
            <progress class="hidden-progress" max="100" :value="jupyter.progress"></progress>
            <div class="circular-progress" :style="progressStyle">
                <span class="progress-text">{{jupyter.progress}}%</span>
            </div>
        </div>
        <oda-button class="btn-code" ~if="item.type ==='code' && !cell?.showProgress" :icon @down.stop="onTap" :error="!!item?.fn" :info-invert="item?.autoRun" :success="!item?.time" style="border-radius: 50%;  transform: scale(.8);"></oda-button>
        <span class="field-control flex" ~is="template" :column :item ::value style="overflow: hidden">{{value ?? ''}}</span>
        <oda-button ~if="item.type ==='code'" :icon="iconEye" title="Hide/Show" style="border-radius: 50%; transform: scale(0.8);" @tap="toggleOutput" scale=".5"></oda-button>
    `,
    progressStyle() {
        return`--progress: ${this.jupyter.progress}`
    },
    focused: {
        $type: Boolean,
        $def: false,
        $attr: true,
    },
    $public: {
        $pdp: true,
        template: 'span',
        get value() {
            return this.item?.[this.column?.[this.columnId]] ?? '';
        },
        set value(n) {
            this.item[this.column[this.columnId]] = n;
        }
    },
    bold: {
        $attr: true,
        get() {
            return !!this.item?.h || this.item?.constructor.name === 'JupyterNotebook';
        }
    },
    error: {
        $attr: true,
        get() {
            let error = (this.item?.type === 'code' && this.item?.status === 'error');
            if (error)
                this.domHost.setAttribute('error', '');
            else
                this.domHost.removeAttribute('error');
            return error;
        }
    },
    dimmed: {
        $attr: true,
        get() {
            return this.item?.hideCode;
        }
    },
    get icon() {
        return this.cell?.fn ? 'av:stop' : 'av:play-circle-outline';
    },
    get iconEye() {
        return this.cell?.cell?.hideCode ? 'bootstrap:eye-slash' : 'bootstrap:eye';
    },
    onTap(e) {
        this.cell?.run();
    },
    get cell() {
        return  this.jupyter.getCell(this.item.id);
    },
    toggleOutput() {
        this.cell.cell.hideCode = !this.cell.cell.hideCode;
    },
    $listeners: {
        tap(e) {
            this.cell.highlighted = true;
            this.async(() => this.cell.highlighted = false, 1200);
            let id = e.target.cell?.cell?.id;
            this.jupyter._lastId ||= this.jupyter?.focusedCell?.id;
            if (this.jupyter._lastId === this.jupyter?.focusedCell?.id) {
                let visibleTop = this.jupyter.scrollTop,
                    visibleBottom = visibleTop + this.jupyter.offsetHeight,
                    el = this.jupyter.getCell(id),
                    elTop = el.offsetTop,
                    elBottom = elTop + el.offsetHeight;
                // console.log(visibleTop, visibleBottom, elTop, elBottom);
                if ((elTop >= visibleTop && elTop <= visibleBottom) || (elBottom >= visibleTop && elBottom <= visibleBottom)) return;
                // console.log('scroll');
                this.cell?.scrollToCell?.();
            }
            this.jupyter._lastId = id;
        }
    }
})
