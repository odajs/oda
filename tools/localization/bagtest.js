ODA({ is: 'oda-bagtest', template: /*html*/`  
    <h1 >Просто</h1>
    <oda-aaa ::con></oda-aaa>
    <div><slot name='ttt'></slot></div>
    <h1 ~if='con==0' :ttt='con' :ww='con==0' :slot='"ttt"' >Тайна 0</h1>
    <h1 ~if='con==1' :ttt='con' :ww='con==1' :slot='"ttt"' >Тайна 1</h1>
    <h1 ~if='con==2' :ttt='con' :ww='con==2' :slot='"ttt"' >Тайна 2</h1>
    `,
    props:{ con:0}
})


ODA({ is: 'oda-aaa', template: /*html*/`  <style> :host {display:flex;} </style>
    <h2 @tap="con=0; render()">1</h2>
    <h2 @tap="con=1">2</h2>
    <h2 @tap="con=2">3</h2>  `,
})