Компонент **app-layout** предназначен для создания окна приложения ODA-фреймворка. Зонирование состоит из 5 основных слотов: Top, Main, Bottom и двух Drawers (правого и левого). Подробнее эта тема расписана в разделе [обучение](ССЫЛКА НА СООТВЕТСТВУЮЩИЙ РАЗДЕЛ В ОБУЧЕНИИ).

Для его использования необходимо подключить JS-модуль «**app-layout.js**» и добавить в HTML-код пользовательский тэг «**oda-app-layout**».

Например:

```html _run_line_edit_[demo.html]_h=300_
<meta charset="UTF-8">
<script type="module" src="../../../oda.js"></script>
<script type="module" src="/components/layouts/app-layout/app-layout.js"></script>
<oda-app-layout>
        <div slot="top">TOP</div>
        <div slot="main">MAIN</div>
        <div slot="bottom">BOTTOM</div>
        <div slot="left-drawer">LEFT</div>
        <div slot="right-drawer">RIGHT</div>
</oda-app-layout>
```
