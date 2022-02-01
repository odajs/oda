ODA({is: 'oda-progress', imports:'@oda/button',
    template:`
            <style>
                :host{
                    @apply --vertical;
                    @apply --header;
                }
                div{
                    align-items: center;
                    cursor: pointer;
                }
                span{
                    @apply --flex;
                    margin: 1px;
                    text-align: center;
                    font-weight: bolder;
                    font-size: xx-small;
                    background: linear-gradient(to right, {{color}} {{percent}}%, white {{percent}}%, {{backColor}} 100%, transparent 100%);
                }
                label{
                    margin: 4px;
                }
            </style>
            <div class="horizontal">
                <label>{{label}}</label>
                <div ~style="{width: width +'px'}" class="flex horizontal">
                    <span>{{percent}}</span>
                </div>
                <oda-button :icon-size icon="icons:close"></oda-button>
            </div>
        `,
    props:{
        backColor:{
            default: 'white',
            save: true
        },
        color:{
            default: 'blue',
            save: true
        },
        iconSize: 16,
        width: 100
    },
    task: null,
    get percent(){
        return 33
    },
    get label(){
        return 'tasks [3]';
    },
    tasks:[]
})
ODA({is: 'oda-task-panel',
    template:`
        <style>
            :host{
                @apply --vertical;
            }
        </style>
        <oda-progress ~for="tasks" :task="item"></oda-progress>
    `,
    tasks:[
        {label: 'task 1', percent: 22, color: 'green', stoped: true}
    ]
})