ODA({is: 'oda-calculator', imports: '@oda/button',
    template: /*html*/ `
        <style>
            :host {
                @apply --vertical;
                max-width: 300px;
            }
            input {
                margin-left: 10px;
            }
            .header {
                @apply --header
            }
        </style>

        <div class="border" style="margin: 8px; text-align: right">
            <span style="font-size: small" class="dimmed">{{value}}</span>
            <div style="font-size: large">{{expression}}</div>
        </div>
        <div ~for="model?.rows" class="horizontal between">
            <oda-button ~for="btn in item" :label="btn.label" @tap="add(btn)" ~props="btn.props"></oda-button>
        </div>
    `,

    hostAttributes: {
        tabindex: 1
    },
    keyBindings: {
        p () {
            alert('HI')
        }
    },
    signs: ['+', '-', '*', '/'],
    value: '0',
    expression: '0',
    hideExpression: '0',
    model: {
        rows: [
            [
                {label: 'C', props:{class: "content"}, exec () {
                        this.hideExpression = '0';
                        this.expression = '0';
                        this.value = 0;
                    }
                },
                {label: '%', exec (e) {
                        this.calcPercent (e.label)
                    }
                }, 
                {label: '🠔', exec () {
                        this.deleteElement();
                    }
                }
            ],
            [  
                {label: 1},
                {label: 2}, 
                {label: 3},
                {label: '*'} 
            ],
            [
                {label: 4}, 
                {label: 5},
                {label: 6},
                {label: '/'} 
            ],
            [
                {label: 7},
                {label: 8}, 
                {label: 9},
                {label: '-'}  
            ], 
            [
                {label: 0},
                {label: '.', exec () {
                    this.getFraction()
                }},
                {label: '=', props: {class: "header"}, exec () {
                        this.calc();
                    }
                },
                {label: '+'} 
            ]
        ]
    },
    //Запись значения нажатой кнопки в строку, проверка корректности выражения
    add (btn) {
        if (this.signs.some((e) => e === btn.label)) {
            return this.stringValidation(btn.label)
        } 
        if (this.expression == '0' && btn.label !== '.' && btn.label !== '%') {
            this.getString().replace(/^0+(?!\.)/gm, '0') // убираем лишние нули вначале числа
            this.expression = '';
            this.hideExpression = '';
        } else if (this.getString()[this.expression.length - 1] === '%' && /\d/.test(btn.label)) {
            this.expression = this.getString() + '*'; 
            this.hideExpression = this.hideExpression + '*'; 
        }
        // btn.exec ? btn.exec.call(this, btn) : this.expression = this.getString() + btn.label;
        if (btn.exec) {
            btn.exec.call(this, btn)
        } else {
            this.hideExpression = this.hideExpression + btn.label;
            this.expression = this.getString() + btn.label;
        } 
    },
    // Получение результата вычислений, записанных в строке, а так же запись его в value и expression
    calc () {
        console.log(this.hideExpression)
        if (this.expression) {
            if (this.getString().search(/\D$/) !== -1 && this.getString().match(/\D$/)[0] !== '%') {
                this.deleteElement();
            } 
            this.value = (new Function([], `with (this) {return ${this.hideExpression}}`)).call(this);
            const result = this.expression;
            this.expression = this.value;
            this.value = result + '=';
        } else {
            this.expression = '0';
            this.hideExpression = '0';
        }
    },
    // Удаление последнего символа в строке
    deleteElement () {
        if (this.expression === '' || this.getString().length === 1) { // если строка пустая или в ней всего 1 символ, строка принимает значение 0
            this.expression = '0';
        } else {
            this.hideExpression = this.hideExpression.replace(/.$/, '');
            this.expression = this.getString().replace(/.$/, '');
        }
    },
    // Правильное написание десятичных чисел
    getFraction () {
        const arr = this.getString().match(/(\d*)?\.?(\d*)?/g) // получаем массив всех введенных чисел для дальнейших проверок
        if (arr[(arr.length - 2)].match(/\./) || this.getString().match(/\D$/)) { // проверяем нет ли перед точкой в числе еще одной точки, либо математического знака
            return
        }
        this.expression += '.';
        this.hideExpression += '.';
    },
    // Проверяем возможность написания математических знаков в выражении
    stringValidation (btn) {
        if (this.expression === '0') { // исключаем возможность написания математических знаков в пустой строке
            return
        } else if (this.signs.some((e) => e === this.getString()[this.expression.length - 1]) || this.getString()[this.expression.length - 1] === '.') { // исключаем возможность написания нескольких математических знаков подряд
            this.hideExpression = this.hideExpression.replace(/.$/, btn);
            return this.expression = this.getString().replace(/.$/, btn);
        }
            this.hideExpression = this.hideExpression + btn;
            return this.expression = this.getString() + btn
    },
    //  Вычисляем проценты
    calcPercent (btn = '') {
        this.stringValidation (btn);
        const arr = this.hideExpression.match(/(\d*)?\.?\d*/g).filter(Boolean); // выписываем в массив все введенные в калькулятор числа
        arr[arr.length - 1] *= 0.01;
        this.hideExpression = this.hideExpression.replace(/\d*\.?(\d*)?\D$/, arr[arr.length - 1]) // сразу высчитываем процент от числа
    },
    // Преобразование выражения в строку для дальнейших действий
    getString () {
        return this.expression.toString()
    }
})