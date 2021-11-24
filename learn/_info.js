export const _srcIframe = { src: 'video' }
export default {
    folder: [
        {
            name: 'learn',
            label: 'Обучение',
            folder: [
                {
                    name: 'guide',
                    label: 'Руководство',
                    folder: [
                        {
                            name: 'introduction.md',
                            label: 'Вступление',
                            status: 'ok'
                        },
                        {
                            name: 'install.md',
                            label: 'Установка',
                            status: 'ok'
                        },
                        {
                            name: 'hello-world.md',
                            label: 'Компонент «Hello, World!»',
                            status: 'ok'
                        },
                        {
                            name: 'structure',
                            label: 'Структура компонента',
                            status: 'temp',
                            folder: [
                                {
                                    name: 'is.md',
                                    label: '<b style="color:blue">is</b>: Идентификатор компонента',
                                    status: 'check'
                                },
                                {
                                    name: 'extends.md',
                                    label: '<b style="color:blue">extends</b>: Признак наследования',
                                    status: 'check'
                                },
                                {
                                    name: 'template',
                                    label: '<b style="color:blue">template</b>: Шаблон компонента',
                                    content: {
                                        abstract: '\n~~~md\nПосмотреть [ВИДЕО-УРОК](https://youtu.be/ZRX5Srr6TqA?t=0) \nШаблон компонента задается атрибутом **template** с помощью шаблонных литералов, заключенных в обратные кавычки в формате **JSX**. \nВ соответствии со спецификацией [WEB components](https://en.wikipedia.org/wiki/Web_Components), стилизация задается внутри шаблона для каждого компонента\n~~~'
                                    },
                                    folder: [
                                        {
                                            name: 'jsx',
                                            label: 'JSX',
                                            content: {
                                                abstract: '\n~~~md\nJSX (JavaScript XML) является синтаксическим расширением языка JavaScript, совмещенным с описанием HTML-тэгов\n~~~'
                                            },
                                            folder: [
                                                {
                                                    name: 'html.md',
                                                    label: 'HTML-разметка',
                                                    status: 'temp'
                                                },
                                                {
                                                    name: 'directives',
                                                    label: 'Директивы',
                                                    content: {
                                                        abstract: '\n~~~md\nДирективы управляют поведением HTML-кода компонента во время его работы.\nВ JSX-разметке директивы начинаются с префикса **~** (тильда). \n~~~'
                                                    },
                                                    folder: [
                                                        {
                                                            name: '~for.md',
                                                            label: '<b style="color:brown">~for</b>: Управление циклом',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~is.md',
                                                            label: '<b style="color: brown">~is</b>: Динамическое изменение имени тега',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~style.md',
                                                            label: '<b style="color: brown">~style</b>: Стили',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~class.md',
                                                            label: '<b style="color: brown">~class</b>: Классы',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~props.md',
                                                            label: '<b style="color: brown">~props</b>: Групповой биндинг',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~text.md',
                                                            label: '<b style="color: brown">~text / {{}}</b>: Вставка текста',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~html.md',
                                                            label: '<b style="color: brown">~html</b>: Вставка HTML',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~show.md',
                                                            label: '<b style="color: brown">~show</b>: Отображение элемента',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~if.md',
                                                            label: '<b style="color: brown">~if / ~else / ~else-if</b>: Условная прорисовка',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~ref.md',
                                                            label: '<b style="color: brown">~ref</b>: Указатели на элементы',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~save-key.md',
                                                            label: '<b style="color: brown">~save-key</b>: Ключ хранилища',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~save-key2.md',
                                                            label: '<b style="color: brown">~save-key</b>: Дополнительные сведения',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: '~wake.md',
                                                            label: '<b style="color: brown">~wake</b>: Директива пробуждения',
                                                            status: 'check'
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: 'binding.md',
                                                    label: 'Биндинг. Директива <b style="color:brown">:</b>',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'double-binding.md',
                                                    label: 'Двойной биндинг. Директива <b style="color:brown">::</b>',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'events',
                                                    label: 'События',
                                                    status: 'test',
                                                    folder: [
                                                        {
                                                            name: 'event-directive.md',
                                                            label: 'Директива @',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'event-handling.md',
                                                            label: 'Обработчики событий',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'event-handling-params.md',
                                                            label: 'Параметры обработчиков',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'event-source.md',
                                                            label: 'Исходные события',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'event-retargeting.md',
                                                            label: 'Перенацеливание событий',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'event-modifier.md',
                                                            label: 'Модификаторы событий',
                                                            status: 'check'
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            name: 'style',
                                            label: 'Стилизация',
                                            content: {
                                                abstract: '\n~~~md\nstyle — это раздел шаблона компонента, в котором задаются CSS-стили отображения его элементов\n~~~'
                                            },
                                            folder: [
                                                {
                                                    name: 'global-style',
                                                    label: 'Глобальная стилизация',
                                                    folder: [
                                                        {
                                                            name: 'global-style.md',
                                                            label: 'Группы стилей',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'layouts-style.md',
                                                            label: '<b style="color:brown">layouts</b>: Стили оконных элементов',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'shadow-style.md',
                                                            label: '<b style="color:brown">shadow</b>: Стили теней',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'special-style.md',
                                                            label: '<b style="color:brown">special</b>: Стили диалоговых компонентов',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'effects-style.md',
                                                            label: '<b style="color:brown">effects</b>: Стили состояний',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'oda-style.md',
                                                            label: '<b style="color:brown">oda</b>: Стили анимаций',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'theme-style.md',
                                                            label: '<b style="color:brown">theme</b>: Стили сайта',
                                                            status: 'check'
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: 'css4',
                                                    label: 'Стилизация CSS4',
                                                    folder: [
                                                        {
                                                            name: 'var.md',
                                                            label: 'var: Пользовательские CSS-свойства',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'var-rule.md',
                                                            label: 'Правила задания CSS-свойств',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'apply.md',
                                                            label: 'Правило CSS @apply',
                                                            status: 'check'
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: 'local-style',
                                                    label: 'Локальная стилизация',
                                                    content: {
                                                        abstract: '\n~~~md\nЛокальная стилизация определяется CSS-стилями, указанными непосредственно в атрибутах style и class или с помощью одноименных директив, организуя inline-стилизацию любого элемента внутри компонента.\n~~~'
                                                    },
                                                    folder: [
                                                        {
                                                            name: 'style-attribute.md',
                                                            label: 'Inline-стилизация. Атрибут style',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'style-directive.md',
                                                            label: '~style: Динамическая локальная стилизация',
                                                            status: 'check'
                                                        }
                                                        ,
                                                        {
                                                            name: 'class-attribute.md',
                                                            label: 'Классовая стилизация. Атрибут class',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'class-directive.md',
                                                            label: '~class: Классовая динамическая стилизация',
                                                            status: 'check'
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: 'custom-elements-style',
                                                    label: 'Стилизация кастомных элементов v1.0',
                                                    folder: [
                                                        {
                                                            name: 'pseudo-class-host.md',
                                                            label: 'Стилизация хоста теневого дерева :host',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'pseudo-element-part.md',
                                                            label: 'CSS-часть part',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'exportparts.md',
                                                            label: 'exportparts: Переадресация теневых элементов',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'pseudo-element-slotted.md',
                                                            label: 'Слотовая стилизация ::slotted()',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'slot-stylization-management.md',
                                                            label: 'Управление слотовой стилизацией',
                                                            status: 'check'
                                                        },
                                                        {
                                                            name: 'pseudo-element-theme.md',
                                                            label: 'Глобальная переадресация ::theme',
                                                            status: 'check'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    name: 'props',
                                    label: '<b style="color:blue">props</b>: Свойства компонента',
                                    content: {
                                        abstract: '\n~~~md\n Свойства — это элементы компонента, предназначенные для чтения, хранения и изменения его данных.\n~~~'
                                    },
                                    folder: [
                                        {
                                            name: 'properties.md',
                                            label: 'Объявление свойств',
                                            status: 'check'
                                        },
                                        {
                                            name: 'props-modifiers',
                                            label: 'Модификаторы свойств',
                                            status: 'temp',
                                            folder: [
                                                {
                                                    name: 'list-props-modifiers.md',
                                                    label: 'Список модификаторов',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'default-modifier.md',
                                                    label: '<b style="color:brown">default</b>: Модификатор начального значения',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'type-modifier.md',
                                                    label: '<b style="color:brown">type</b>: Модификатор типа',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'reflect-to-attribute-modifier.md',
                                                    label: '<b style="color:brown">reflectToAttribute</b>: Модификатор атрибутов хоста',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'reactive-modifier.md',
                                                    label: '<b style="color:brown">reactive</b>: Модификатор реактивности',
                                                    status: 'edit'
                                                },
                                                {
                                                    name: 'freeze-modifier.md',
                                                    label: '<b style="color:brown">freeze</b>: Модификатор блокировки реактивности',
                                                    status: 'edit'
                                                },
                                                {
                                                    name: 'label-modifier.md',
                                                    label: '<b style="color:brown">label</b>: Модификатор имени',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'category-modifier.md',
                                                    label: '<b style="color:brown">category</b>: Модификатор группы',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'list-modifier.md',
                                                    label: '<b style="color:brown">list</b>: Модификатор списка значений',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'shared-modifier.md',
                                                    label: '<b style="color:brown">shared</b>: Модификатор сквозного биндинга',
                                                    status: 'check'
                                                }
                                            ]
                                        },
                                        {
                                            name: 'getters.md',
                                            label: 'Геттеры',
                                            status: 'check'
                                        },
                                        {
                                            name: 'setters.md',
                                            label: 'Сеттеры',
                                            status: 'check'
                                        },
                                        {
                                            name: 'getter-setter.md',
                                            label: 'Совместное использование геттера и сеттера',
                                            status: 'check'
                                        }
                                    ]
                                },
                                {
                                    name: 'host-attributes.md',
                                    label: '<b style="color:blue">hostAttributes</b>: Начальные значения атрибутов компонента',
                                    status: 'temp'
                                },
                                {
                                    name: 'observers.md',
                                    label: '<b style="color:blue">observers</b>: Обозреватели свойств компонента',
                                    status: 'check'
                                },
                                {
                                    name: 'listeners.md',
                                    label: '<b style="color:blue">listeners</b>: Слушатели событий компонента',
                                    status: 'check'
                                },
                                {
                                    name: 'key-bindings.md',
                                    label: '<b style="color:blue">keyBindings</b>: Обработка нажатий клавиш клавиатуры',
                                    status: 'check'
                                },
                                {
                                    name: 'methods.md',
                                    label: 'Методы',
                                    status: 'check'
                                },
                                {
                                    name: 'variables.md',
                                    label: 'Переменные',
                                    status: 'check'
                                },
                                {
                                    name: 'hooks',
                                    label: 'Хуки жизненного цикла',
                                    status: 'temp',
                                    folder: [
                                        {
                                            name: 'hooks-life-cycle.md',
                                            label: 'Диаграмма жизненного цикла',
                                            status: 'check'
                                        },
                                        {
                                            name: 'hook-created.md',
                                            label: '<b style="color:brown">created</b>: Хук создания',
                                            status: 'check'
                                        },
                                        {
                                            name: 'hook-ready.md',
                                            label: '<b style="color:brown">ready</b>: Хук готовности',
                                            status: 'check'
                                        },
                                        {
                                            name: 'hook-attached.md',
                                            label: '<b style="color:brown">attached</b>: Хук присоединения',
                                            status: 'check'
                                        },
                                        {
                                            name: 'hook-detached.md',
                                            label: '<b style="color:brown">detached</b>: Хук удаления',
                                            status: 'check'
                                        }
                                    ]
                                },
                                {
                                    name: 'slots.md',
                                    label: '<b style="color:blue">slot</b>: Слоты компонента',
                                    status: 'check'
                                },
                            ]
                        },
                        {
                            name: 'api',
                            label: 'API фреймворка',
                            status: 'check',
                            folder: [
                                {
                                    name: 'properties',
                                    label: 'Свойства компонента',
                                    status: 'check',
                                    folder: [
                                        {
                                            name: '$refs.md',
                                            label: '<b style="color: brown">$refs</b>: Внутренние идентификаторы',
                                            status: 'check'
                                        },
                                        {
                                            name: '$url.md',
                                            label: '<b style="color: brown">$url</b>: Полное имя модуля компонента',
                                            status: 'check'
                                        },
                                        {
                                            name: '$dir.md',
                                            label: '<b style="color: brown">$dir</b>: Путь к модулю компонента',
                                            status: 'check'
                                        },
                                        {
                                            name: '$dirInfo.md',
                                            label: '<b style="color: brown">$dirInfo</b>: Информация о папке компонента',
                                            status: 'check'
                                        },
                                    ]
                                },
                                {
                                    name: 'methods',
                                    label: 'Методы компонента',
                                    status: 'check',
                                    folder: [
                                        {
                                            name: 'listen.md',
                                            label: '<b style="color:brown">listen</b>: Регистрация обработчиков событий',
                                            status: 'check'
                                        },
                                        {
                                            name: 'unlisten.md',
                                            label: '<b style="color:brown">unlisten</b>: Удаление обработчиков событий',
                                            status: 'check'
                                        },
                                        {
                                            name: 'fire.md',
                                            label: '<b style="color:brown">fire</b>: Генерация пользовательского события',
                                            status: 'check'
                                        },
                                        {
                                            name: 'create.md',
                                            label: '<b style="color:brown">create</b>: Создание вложенных HTML-элементов',
                                            status: 'check'
                                        },
                                        {
                                            name: 'delay-functions',
                                            label: 'Функции временной задержки',
                                            status: 'check',
                                            folder: [
                                                {
                                                    name: 'async.md',
                                                    label: '<b style="color:brown">async</b>: Вызов функции с задержкой',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'debounce.md',
                                                    label: '<b style="color:brown">debounce</b>: Вызов функции с ограниченной частотой',
                                                    status: 'check'
                                                },
                                                {
                                                    name: 'interval.md',
                                                    label: '<b style="color:brown">interval</b>: Вызов функции с фиксированной частотой',
                                                    status: 'check'
                                                }
                                            ]
                                        },
                                        {
                                            name: '$super.md',
                                            label: '<b style="color: brown">$super</b>: Вызов родительских методов',
                                            status: 'check'
                                        },
                                    ]
                                },
                                {
                                    name: 'commands',
                                    label: 'Команды фреймворка',
                                    status: 'check',
                                    folder: [
                                        {
                                            name: 'console.md',
                                            label: '<b style="color: brown">ODA.console</b>: Работа с ODA-консолью',
                                            status: 'check'
                                        },
                                        {
                                            name: 'create-component.md',
                                            label: '<b style="color: brown">ODA.createComponent</b>: Создание компонента',
                                            status: 'check'
                                        },
                                        {
                                            name: 'load-component.md',
                                            label: '<b style="color: brown">ODA.loadComponent</b>: Загрузка компонента',
                                            status: 'check'
                                        },
                                        {
                                            name: 'show-modal.md',
                                            label: '<b style="color:brown">ODA.showModal</b>: Отображение модального окна',
                                            status: 'check'
                                        },
                                        {
                                            name: 'show-dialog.md',
                                            label: '<b style="color:brown">ODA.showDialog</b>: Отображение диалогового окна',
                                            status: 'check'
                                        },
                                        {
                                            name: 'show-drop-down.md',
                                            label: '<b style="color:brown">ODA.showDropdown</b>: Отображение выпадающего окна',
                                            status: 'check'
                                        },
                                        {
                                            name: 'load-url.md',
                                            label: '<b style="color:brown">ODA.loadURL</b>: Загрузка любого внешнего ресурса',
                                            status: 'check'
                                        },
                                        {
                                            name: 'load-json.md',
                                            label: '<b style="color:brown">ODA.loadJSON</b>: Загрузка внешнего JSON-ресурса',
                                            status: 'check'
                                        },
                                        {
                                            name: 'load-html.md',
                                            label: '<b style="color:brown">ODA.loadHTML</b>: Загрузка внешнего HTML-ресурса',
                                            status: 'check'
                                        },
                                        {
                                            name: 'push.md',
                                            label: '<b style="color:brown">ODA.push</b>: Отправка уведомлений',
                                            status: 'check'
                                        },
                                        {
                                            name: 'notify.md',
                                            label: '<b style="color:brown">ODA.notify</b>: Отправка предупреждающих уведомлений',
                                            status: 'check'
                                        },
                                        {
                                            name: 'push-message.md',
                                            label: '<b style="color:brown">ODA.pushMessage</b>: Отправка уведомлений',
                                            status: 'check'
                                        },
                                        {
                                            name: 'push-error.md',
                                            label: '<b style="color:brown">ODA.pushError</b>: Отправка уведомлений об ошибках',
                                            status: 'check'
                                        },
                                    ]
                                },
                                {
                                    name: 'parameters',
                                    label: 'Параметры фреймворка',
                                    status: 'check',
                                    folder: [
                                        {
                                            name: 'origin.md',
                                            label: '<b style="color: brown">ODA.origin</b>: Первоначальное определение URL-ресурса',
                                            status: 'check'
                                        },
                                        {
                                            name: 'language.md',
                                            label: '<b style="color: brown">ODA.language</b>: Предпочитаемый язык пользователя',
                                            status: 'check'
                                        },
                                        {
                                            name: 'telemetry.md',
                                            label: '<b style="color: brown">ODA.telemetry</b>: Мониторинг текущего состояния',
                                            status: 'check'
                                        }
                                    ]
                                },

                            ]
                        },
                        {
                            name: 'spa-routing.md',
                            label: 'SPA-роутинг',
                            status: 'check'
                        },
                        {
                            name: 'spa-routing2.md',
                            label: 'SPA-роутинг. Дополнительные сведения',
                            status: 'check'
                        },
                        {
                            name: 'my-first-component.md',
                            label: 'Мой первый компонент',
                            status: 'check'
                        }
                    ]
                },
                {
                    name: 'video-lessons',
                    label: 'Видео-уроки',
                    folder: [
                        {
                            name: 'introduction.md',
                            label: 'Вступление. Краткое описание фреймворка',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-1.md',
                            label: 'Урок №1. Установка фреймворка ODA.js',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-2.md',
                            label: 'Урок №2. Компонент «Hello, World!»',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-3.md',
                            label: 'Урок №3. is: идентификатор компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-4.md',
                            label: 'Урок №4. extends: Признак наследования',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-5.md',
                            label: 'Урок №5. template: Шаблон компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-6.md',
                            label: 'Урок №6. Директива ~for: Управление циклом',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-7.md',
                            label: 'Урок №7. Директива ~is: Динамическое изменение имени тега',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-8.md',
                            label: 'Урок №8. Директива ~style: Стили',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-9.md',
                            label: 'Урок №9. Директива ~class: Классы',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-10.md',
                            label: 'Урок №10. Директива ~props: Групповой биндинг',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-11.md',
                            label: 'Урок №11. Директива ~text: Вставка текста',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-12.md',
                            label: 'Урок №12. Директива ~html: Вставка HTML',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-13.md',
                            label: 'Урок №13. Директива ~show: Отображение элемента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-14.md',
                            label: 'Урок №14. Директивы ~if / ~else / ~else-if: Условная прорисовка',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-15.md',
                            label: 'Урок №15. Директива ~ref: Указатели на элементы',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-16.md',
                            label: 'Урок №16. Директива ~save-key: Ключ хранилища',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-17.md',
                            label: 'Урок №17. Директива ~wake: Директива пробуждения',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-18.md',
                            label: 'Урок №18. Биндинг. Директива :',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-19.md',
                            label: 'Урок №19. Двойной биндинг. Директива ::',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-20.md',
                            label: 'Урок №20. События: директива @',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-21.md',
                            label: 'Урок №21. Обработчики событий',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-22.md',
                            label: 'Урок №22. Параметры обработчиков событий',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-23.md',
                            label: 'Урок №23. Исходные события',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-24.md',
                            label: 'Урок №24. Перенацеливание событий',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-25.md',
                            label: 'Урок №25. Модификаторы событий',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-26.md',
                            label: 'Урок №26. Глобальная стилизация',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-27.md',
                            label: 'Урок №27. layouts: Стили оконных элементов',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-28.md',
                            label: 'Урок №28. shadow: Стили теней',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-29.md',
                            label: 'Урок №29. special: Стили диалоговых компонентов',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-30.md',
                            label: 'Урок №30. effects: Стили состояний',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-31.md',
                            label: 'Урок №31. oda: Стили анимаций',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-32.md',
                            label: 'Урок №32. var: Пользовательские CSS-свойства',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-33.md',
                            label: 'Урок №33. Правила задания CSS-свойств',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-34.md',
                            label: 'Урок №34. Правило CSS @apply',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-35.md',
                            label: 'Урок №35. Inline-стилизация. Атрибут style',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-36.md',
                            label: 'Урок №36. ~style: Динамическая локальная стилизация',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-37.md',
                            label: 'Урок №37. Классовая стилизация. Атрибут class',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-38.md',
                            label: 'Урок №38. ~class: Классовая динамическая стилизация',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-39.md',
                            label: 'Урок №39. Стилизация хоста теневого дерева :host',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-40.md',
                            label: 'Урок №40. CSS-часть part',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-41.md',
                            label: 'Урок №41. exportparts: Переадресация теневых элементов',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-42.md',
                            label: 'Урок №42. Слотовая стилизация ::slotted()',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-43.md',
                            label: 'Урок №43. Управление слотовой стилизацией',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-44.md',
                            label: 'Урок №44. props: Объявление свойств',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-45.md',
                            label: 'Урок №45. default: Модификатор начального значения',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-46.md',
                            label: 'Урок №46. type: Модификатор типа',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-47.md',
                            label: 'Урок №47. reflectToAttribute: Модификатор атрибутов хоста',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-48.md',
                            label: 'Урок №48. reactive: Модификатор реактивности',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-49.md',
                            label: 'Урок №49. freeze: Модификатор блокировки реактивности',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-50.md',
                            label: 'Урок №50. label: Модификатор имени',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-51.md',
                            label: 'Урок №51. category: Модификатор группы',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-52.md',
                            label: 'Урок №52. list: Модификатор списка значений',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-53.md',
                            label: 'Урок №53. shared: Модификатор сквозного биндинга',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-54.md',
                            label: 'Урок №54. Геттеры',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-55.md',
                            label: 'Урок №55. Сеттеры',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-56.md',
                            label: 'Урок №56. Совместное использование геттера и сеттера',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-57.md',
                            label: 'Урок №57. hostAttributes: Начальные значения атрибутов компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-58.md',
                            label: 'Урок №58. observers: Обозреватели свойств компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-59.md',
                            label: 'Урок №59. listeners: Слушатели событий компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-60.md',
                            label: 'Урок №60. keyBindings: Обработка нажатий клавиш клавиатуры',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-61.md',
                            label: 'Урок №61. Методы',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-62.md',
                            label: 'Урок №62. Диаграмма жизненного цикла',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-63.md',
                            label: 'Урок №63. created: Хук создания',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-64.md',
                            label: 'Урок №64. ready: Хук готовности',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-65.md',
                            label: 'Урок №65. attached: Хук присоединения',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-66.md',
                            label: 'Урок №66. detached: Хук удаления',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-67.md',
                            label: 'Урок №67. slot: Слоты компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-68.md',
                            label: 'Урок №68.  $refs: объект внутренних идентификаторов',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-69.md',
                            label: 'Урок №69. $url: полное имя модуля компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-70.md',
                            label: 'Урок №70. $dir: путь к модулю компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-71.md',
                            label: 'Урок №71. $dirInfo: информация о папке компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-72.md',
                            label: 'Урок №72. listen: метод регистрации обработчиков событий',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-73.md',
                            label: 'Урок №73. unlisten: метод удаления обработчиков событий',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-74.md',
                            label: 'Урок №74. fire: метод генерации пользовательского события',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-75.md',
                            label: 'Урок №75. create: метод создания вложенных HTML-элементов',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-76.md',
                            label: 'Урок №76. async: метод вызова функции с задержкой',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-77.md',
                            label: 'Урок №77. debounce: метод вызова функции с ограниченной частотой',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-78.md',
                            label: 'Урок №78. interval: метод вызова функции с фиксированной частотой',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-79.md',
                            label: 'Урок №79. $super: вызов родительских методов',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-80.md',
                            label: 'Урок №80. ODA.console: Работа с ODA-консолью',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-81.md',
                            label: 'Урок №81. ODA.createComponent: Создание компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-82.md',
                            label: 'Урок №82. ODA.loadComponent: Загрузка компонента',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-83.md',
                            label: 'Урок №83. ODA.showModal: Отображение модального окна',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-84.md',
                            label: 'Урок №84. ODA.showDialog: Отображение диалогового окна',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-85.md',
                            label: 'Урок №85. ODA.showDropdown: Отображение выпадающего окна',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-86.md',
                            label: 'Урок №86. ODA.loadURL: Загрузка любого внешнего ресурса',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-87.md',
                            label: 'Урок №87. ODA.loadJSON: Загрузка внешнего JSON-ресурса',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-88.md',
                            label: 'Урок №88. ODA.loadHTML: Загрузка внешнего HTML-ресурса',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-89.md',
                            label: 'Урок №89. ODA.push: Отправка уведомлений',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-90.md',
                            label: 'Урок №90. ODA.notify: Отправка предупреждающих уведомлений',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-91.md',
                            label: 'Урок №91. ODA.pushMessage: Отправка уведомлений',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-92.md',
                            label: 'Урок №92. ODA.pushError: Отправка уведомлений об ошибках',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-93.md',
                            label: 'Урок №93. ODA.origin: Первоначальное определение URL-ресурса',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-94.md',
                            label: 'Урок №94.ODA.language: Предпочитаемый язык пользователя',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-95.md',
                            label: 'Урок №95. ODA.telemetry:  Мониторинг текущего состояния',
                            status: 'temp'
                        },
                        {
                            name: 'lesson-96.md',
                            label: 'Урок №96. SPA-роутинг',
                            status: 'temp'
                        },
                    ]
                }
            ]
        },
        {
            name: 'components',
            label: 'Компоненты',
            folder: [
                {
                    name: 'buttons',
                    label: 'Кнопки',
                    content: {
                        abstract: '\n~~~md\n<b>Components:</b> button, checkbox, icon, icon-ext, toggle\n~~~',
                    },
                    folder: [
                        {
                            name: 'button',
                            label: '<b style="color: #d63200">oda-button:</b> Кнопка',
                            content: {
                                link: 'index.html'
                            },
                            status: 'check'
                        },
                        {
                            name: 'icon',
                            label: '<b style="color: #d63200">oda-icon:</b> Иконка',
                            content: {
                                link: 'index.html'
                            },
                            status: 'check'
                        },
                        {
                            name: 'checkbox',
                            label: '<b style="color: #d63200">oda-checkbox:</b> Флажок',
                            content: {
                                link: 'index.html'
                            },
                            status: 'check'
                        },
                        {
                            name: 'toggle',
                            label: '<b style="color: #d63200">oda-toggle:</b> Тумблер',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        }
                    ]
                },
                {
                    name: 'colors',
                    label: 'Цвета',
                    folder: [
                        {
                            name: 'palette',
                            label: '<b style="color: #73abfe">oda-palette:</b> Палитра',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'color-picker',
                            label: '<b style="color: #73abfe">oda-color-picker:</b> Пикер цвета',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'cpicker',
                            label: '<b style="color: #73abfe">oda-color-cpicker:</b> Пикер с ползунками',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        }
                    ]
                },
                {
                    name: 'editors',
                    label: 'Редакторы',
                    folder: [
                        {
                            name: 'ace-editor',
                            label: '<b style="color: #e689fe">oda-ace-editor:</b> ace-редактор',
                            content: {
                                link: 'index.html'
                            },
                            status: 'check'
                        },
                        {
                            name: 'html-editor',
                            label: '<b style="color: #e689fe">oda-html-editor:</b> html-редактор',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'md-editor',
                            label: '<b style="color: #e689fe">oda-md-editor:</b> md-редактор',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        }
                    ]
                },
                {
                    name: 'grids',
                    label: 'Grids & Trees',
                    folder: [
                        {
                            name: 'list',
                            label: '<b style="color: #42b983">oda-list:</b> Простой список',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'listbox',
                            label: '<b style="color: #42b983">oda-list-box:</b> Список-контейнер',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'table',
                            label: '<b style="color: #42b983">oda-table:</b> Таблица',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'tree',
                            label: '<b style="color: #42b983">oda-tree:</b> Дерево',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        }
                    ]
                },
                {
                    name: 'layouts',
                    label: 'Layouts & Containers',
                    folder: [
                        {
                            name: 'accordion',
                            label: '<b style="color: #f66">oda-accordion:</b> Аккордеон',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'app-layout',
                            label: '<b style="color: #f66">oda-app-layout:</b> App-layout',
                            content: {
                                link: 'index.html'
                            },
                            status: 'check'
                        },
                        {
                            name: 'form-layout',
                            label: '<b style="color: #f66">oda-form-layout:</b> Form-layout',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'scroll-box',
                            label: '<b style="color: #f66">oda-scroll-box:</b> Scroll-box',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'site-layout',
                            label: '<b style="color: #f66">oda-site-layout:</b> Site-layout',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'splitter',
                            label: '<b style="color: #f66">oda-splitter:</b> Сплиттер',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'title',
                            label: '<b style="color: #f66">oda-title:</b> Заголовок',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        // {
                        //     name: 'dropdown',
                        //     label: '<b style="color: #f66">oda-dropdown:</b> dropdown',
                        //     content: {
                        //         link: 'index.html'
                        //     },
                        //     status: 'temp'
                        // }
                    ]
                },
                {
                    name: 'menus',
                    label: 'Меню',
                    folder: [
                        {
                            name: 'menu',
                            label: '<b style="color: #fed085">oda-menu:</b> Меню',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        }
                    ]
                },
                {
                    name: 'viewers',
                    label: 'Просмотрщики',
                    folder: [
                        {
                            name: 'qr-code',
                            label: '<b style="color: #43846b">oda-qr-code:</b> просмотр QR-кода',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        },
                        {
                            name: 'chart',
                            label: '<b style="color: #43846b">oda-chart:</b> графики',
                            content: {
                                link: 'index.html'
                            },
                            status: 'temp'
                        }
                    ]
                }
            ]
        },
        {
            name: 'apps',
            label: 'Приложения',
            content: {
                'tag': 'iframe',
                'attrs': {
                    'src': 'index.html'
                }
            },
            folder: [
                {
                    name: 'valuta',
                    label: 'Курсы валют',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'credit-calculator',
                    label: 'Кредитный калькулятор',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'tetris',
                    label: 'Tetris',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'oda-doom',
                    label: 'oda-doom',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'l-system',
                    label: 'L-System',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'bugs',
                    label: 'Smart bugs',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'in-yan',
                    label: 'Инь ян',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'figure-digit',
                    label: 'Распознавание рукописных цифр',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                }
            ]
        },
        {
            name: 'benchmarks',
            label: 'Тесты',
            content: {
                'tag': 'iframe',
                'attrs': {
                    'src': 'index.html'
                }
            },
            folder: [
                {
                    name: 'dbmon',
                    label: 'DB monster framerate test',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'sierpinski',
                    label: 'Sierpinski triangle animation test',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'performance',
                    label: 'Repaint rate test',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'life',
                    label: 'Games Of Life',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'houdini',
                    label: 'houdini CSS',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                },
                {
                    name: 'raf',
                    label: 'requestAnimationFrame vs setTimeout',
                    content: {
                        link: 'index.html'
                    },
                    folder: []
                }
            ]
        },
        {
            name: 'locales',
            label: 'Языки',
            content: {
                abstract: 'Тут какая-то аннотация',
                link: './learn/docs/guide/introduction.md'
            },
            folder: [
                {
                    name: 'ru',
                    label: 'Русский',
                    'icon': 'flags:ru',
                    'execute': 'setLocale'
                },
                {
                    name: 'en',
                    label: 'English',
                    'icon': 'flags:us'
                },
                {
                    name: 'fr',
                    label: 'Français',
                    'icon': 'flags:fr'
                },
                {
                    name: 'cn',
                    label: '中文 (chinese)',
                    'icon': 'flags:cn'
                },
                {
                    name: 'ja',
                    label: '日本語 (japanese)',
                    'icon': 'flags:jp'
                },
                {
                    name: 'ua',
                    label: 'Українська',
                    'icon': 'flags:ua'
                }
            ]
        },
        {
            name: 'themes',
            label: 'Темы',
            folder: [
                {
                    name: 'default',
                    'execute': 'setStyle'
                },
                {
                    name: 'blue',
                    'execute': 'setStyle',
                    content: {
                        'src': 'blue.json'
                    }
                },
                {
                    name: 'orange',
                    'execute': 'setStyle',
                    content: {
                        'src': 'orange.json'
                    }
                },
                {
                    name: 'green',
                    'execute': 'setStyle',
                    content: {
                        'src': 'green.json'
                    }
                }
            ]
        }
    ]
}