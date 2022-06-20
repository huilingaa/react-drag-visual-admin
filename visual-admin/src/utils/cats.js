export default [
    {
        "name":"常用类",
        "data":[
            {
                nameSpace:"div",
                title:"层标签 div容器",
                props:{
                    children:""
                },
                children:[]
            },
            { 
                nameSpace:"text",
                title:"文本 Text",
                props:{
                    children:"这是默认文本"
                },
                children:[]
            },
            {
                nameSpace:"img",
                title:"图片 Picture",
                props:{
                    src:"https://gw.alicdn.com/tfs/TB1RzxEGG61gK0jSZFlXXXDKFXa-64-64.png"
                },
                children:[]
            },
            {
                nameSpace:"button",
                title:"按钮",
                props:{
                    children:"提交"
                },
                children:[]
            }
        ]
    },
    {
        "name":"表单类",
        "data":[
            {
                nameSpace:"input",
                title:"输入框input",
                props:{
                    value:""
                },
                children:[]
            },
            { 
                nameSpace:"select",
                title:"选择框select",
                props:{
                    style:{
                        width:"100px"
                    },
                    placeholder:"请选择",
                    options:[{label:"名称",value:"name"}]
                },
                children:[]
            },
            { 
                nameSpace:"switch",
                title:"开关switch",
                props:{
                    checked:true
                },
                children:[]
            },
            { 
                nameSpace:"radio",
                title:"单选框radio",
                props:{
                    options:[{label:"名称",value:"name"},
                    {label:"名称2",value:"name2"}]
                },
                children:[]
            },
            { 
                nameSpace:"dataPicker",
                title:"日期选择框datePicker",
                props:{
                },
                children:[]
            },
            {
                nameSpace:"form",
                title:"表单form",
                props:{
                   
                },
                children:[]
            },
            {
                nameSpace:"formItem",
                title:"表单formItem",
                props:{
                    label:"字段名"
                },
                children:[]
            }
        ]
    },{
        "name":"列表类",
        "data":[
            {
                nameSpace:"table",
                title:"table容器",
                props:{
                    children:""
                },
                children:[]
            },
            {
                nameSpace:"table",
                title:"table容器示例",
                "props": {
                    "dataSource":"{{this.state.list}}",
                    children: []
                },
                "children": [
                    {
                        "nameSpace": "tableColumn",
                        "props": { "title": "信息", "dataIndex": "name" },
                        "children": [
                            { "nameSpace": "text", "props": { "children": "{{this.record.name}}" }, "children": [] },
                            { "nameSpace": "img", "props": { 
                                "src": "{{this.record.pic}}",
                                "style":{
                                    "height":"40px",
                                    "borderRadius":"20px",
                                    "marginLeft":"10px"
                                }
                            }, "children": [] }
                        ],
                    },
                    { "nameSpace": "tableColumn", "props": { "title": "地址", "dataIndex": "address" }, "children": [] },
                    { "nameSpace": "tableColumn", "props": { "title": "年龄", "dataIndex": "age" }, "children": [] },
                    { "nameSpace": "tableColumn", "props": { "title": "操作", "dataIndex": "do" }, 
                        "children": [
                            {
                                nameSpace:"button",
                                title:"按钮",
                                props:{
                                    children:"编辑",
                                    size:"small",
                                    type:"primary"
                                },
                                children:[]
                            },
                            {
                                nameSpace:"button",
                                title:"按钮",
                                props:{
                                    children:"删除",
                                    size:"small",
                                    "style":{
                                        "marginLeft":"10px"
                                    }
                                },
                                children:[]
                            }
                        ] 
                    },
                ]
            },
            { 
                nameSpace:"tableColumn",
                title:"table子容器tableColumn",
                props:{
                    children:"这是默认文本"
                },
                children:[]
            },
            {
                nameSpace:"pagination",
                title:"分页Pagination",
                props:{
                    pageSize:10,
                    defaultCurrent:1,
                    total:100,
                    showSizeChanger:false
                },
                children:[]
            }
        ]
    },
    {
        "name":"信息类",
        "data":[
            {
                nameSpace:"modal",
                title:"弹层Modal",
                props:{
                    children:""
                },
                children:[]
            },
            {
                nameSpace:"div",
                title:"弹层Modal示例",
                props:{
                    children:""
                },
                children:[
                    {
                        nameSpace:"button",
                        props:{
                            "children":"点我弹出提示",
                            "onClick":function onClick(e){
                                this.setState({
                                    visible:true
                                })
                            }
                        },
                        children:[]
                    },
                    {
                        nameSpace:"modal",
                        title:"弹层Modal",
                        props:{
                            visible:"{{this.state.visible}}",
                            title:"Basic Modal",
                            "onOk":function onOk(e){
                                this.setState({
                                    visible:false
                                })
                            },
                            "onCancel":function onCancel(e){
                                this.setState({
                                    visible:false
                                })
                            },
                            "onClose":function onClose(e){
                                this.setState({
                                    visible:false
                                })
                            }
                        },
                        children:[
                            { 
                                nameSpace:"text",
                                title:"文本 Text",
                                props:{
                                    children:"这是默认文本"
                                },
                                children:[]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name":"图表类",
        "data":[
            {
                nameSpace: "column",
                title:"柱状图",
                props: {
                    data: [
                        { "name": "London", "月份": "Jan.", "月均降雨量": 300.9 },
                        { "name": "London", "月份": "Feb.", "月均降雨量": 28.8 },
                        { "name": "London", "月份": "Mar.", "月均降雨量": 39.3 },
                        { "name": "London", "月份": "Apr.", "月均降雨量": 81.4 },
                        { "name": "London", "月份": "May", "月均降雨量": 47 },
                        { "name": "London", "月份": "Jun.", "月均降雨量": 20.3 },
                        { "name": "London", "月份": "Jul.", "月均降雨量": 24 },
                        { "name": "London", "月份": "Aug.", "月均降雨量": 35.6 },
                        { "name": "Berlin", "月份": "Jan.", "月均降雨量": 12.4 },
                        { "name": "Berlin", "月份": "Feb.", "月均降雨量": 23.2 },
                        { "name": "Berlin", "月份": "Mar.", "月均降雨量": 34.5 },
                        { "name": "Berlin", "月份": "Apr.", "月均降雨量": 99.7 },
                        { "name": "Berlin", "月份": "May", "月均降雨量": 52.6 },
                        { "name": "Berlin", "月份": "Jun.", "月均降雨量": 35.5 },
                        { "name": "Berlin", "月份": "Jul.", "月均降雨量": 37.4 },
                        { "name": "Berlin", "月份": "Aug.", "月均降雨量": 42.4 },
                    ],
                    height: "300",
                    filedX: "月份",
                    filedY: "月均降雨量",
                    color: "name",
                    adjust: true,
                    scale: "月均降雨量",
                    showToolTip: false
                },
                children: []
            },
            {
                nameSpace: "line",
                title:"折线图",
                props: {
                    data: [
                        { month: 'Jan', city: 'Tokyo', temperature: 7 },
                        { month: 'Jan', city: 'London', temperature: 3.9 },
                        { month: 'Feb', city: 'Tokyo', temperature: 6.9 },
                        { month: 'Feb', city: 'London', temperature: 4.2 },
                        { month: 'Mar', city: 'Tokyo', temperature: 9.5 },
                        { month: 'Mar', city: 'London', temperature: 5.7 },
                        { month: 'Apr', city: 'Tokyo', temperature: 14.5 },
                        { month: 'Apr', city: 'London', temperature: 8.5 },
                        { month: 'May', city: 'Tokyo', temperature: 18.4 },
                        { month: 'May', city: 'London', temperature: 11.9 },
                        { month: 'Jun', city: 'Tokyo', temperature: 21.5 },
                        { month: 'Jun', city: 'London', temperature: 15.2 },
                        { month: 'Jul', city: 'Tokyo', temperature: 25.2 },
                        { month: 'Jul', city: 'London', temperature: 17 },
                        { month: 'Aug', city: 'Tokyo', temperature: 26.5 },
                        { month: 'Aug', city: 'London', temperature: 16.6 },
                        { month: 'Sep', city: 'Tokyo', temperature: 23.3 },
                        { month: 'Sep', city: 'London', temperature: 14.2 },
                        { month: 'Oct', city: 'Tokyo', temperature: 18.3 },
                        { month: 'Oct', city: 'London', temperature: 10.3 },
                        { month: 'Nov', city: 'Tokyo', temperature: 13.9 },
                        { month: 'Nov', city: 'London', temperature: 6.6 },
                        { month: 'Dec', city: 'Tokyo', temperature: 9.6 },
                        { month: 'Dec', city: 'London', temperature: 4.8 },
                    ],
                    height: "300",
                    filedX: "month",
                    filedY: "temperature",
                    color: "city",
                    adjust: true,
                    scale: "temperature",
                    showToolTip: false
                },
                children: []
            }
        ],
    },
    {
        "name":"自定义组件",
        "data":[
            /*自定义扩展*/
                
      {
        nameSpace:"myComponent",
        title:"测试自定义组件",
        props:{
            children:""
        },
        children:[]
      }
      
            /*自定义扩展*/
        ]
    }
    
]