import React from 'react';
import './App.css';
// import Main from './common/main'
import Left from './common/left'
import Components from './common/components'
// import Right from './common/right'
import Head from './common/head'
import utils from './utils'
import getData from './utils/getData'
// import SchemaData from './component/schemaData';
import { Tooltip, Button } from 'antd';
let ide = utils.getQueryParam("ide");
export default class App extends React.Component {
  constructor(props) {
    super(props)
    let schema = new Function("return " + getData)();
    console.log('我我哦我', schema)
    this.state = {
      schema: schema,//树schema
      editObj: { ...schema[0], key: "0" },//当前正在编辑的对象
      selectTabs: "shu,ku,", //当前显示的面板，树结构，组件库
      type: "drag",//状态，布局状态和预览状态
      resetTime: Date.now()
    }
    this.ideIframe = React.createRef();
    this.handleSelectTabs=this.handleSelectTabs.bind(this);
    this.changeSchema=this.changeSchema.bind(this)
    window.changeSchema = (val) => {
      this.changeSchema(val);
    };
  }

  /*
 * 当前展示的面板，选中的面板处理函数
 */
  handleSelectTabs = (e, type) => {
    let flag = this.state.selectTabs.includes(type);
    let str = flag ? this.state.selectTabs.replace(type + ",", "") : (this.state.selectTabs + type + ",");
    this.setState({
      selectTabs: str
    })
  }
  /*
  * 分发改变state函数给其他面板，节点树面板，右侧属性栏面板，画布面板
  */
  changeSchema = (obj) => {
    if (obj.editObj) {
      window.editObj = obj.editObj;
    }
    if (obj.schema) {
      obj.schemaFlag = true;
    }
    window.obj = { ...obj };
    if (Object.keys(obj))
      this.setState({
        ...obj
      })
    window.ideIframe && window.ideIframe.window && window.ideIframe.window.changeSchema && window.ideIframe.window.changeSchema(obj)
  }

  render() {
    return (
      <div className="allBg">
        {
          (!ide) ? <Head schema={this.state.schema} schemaFlag={this.state.schemaFlag} changeSchema={this.changeSchema} ></Head> : null
        }
        <div className="myWrap">
          {
            (!ide) ? <div className="myTabs">
              <Tooltip title="节点树" placement="right">
                <span onClick={(e) => {
                  this.handleSelectTabs(e, "shu")
                }} title="节点树" className={"iconfont tabsItem icon-jiedianxuanze" + (this.state.selectTabs.includes("shu") ? " itemSelect" : "")}></span>

              </Tooltip>
              <Tooltip title="组件库" placement="right">
                <span
                  onClick={(e) => {
                    this.handleSelectTabs(e, "ku")
                  }}
                  title="组件库"
                  className={"iconfont tabsItem icon-kufang" + (this.state.selectTabs.includes("ku") ? " itemSelect" : "")}></span>
              </Tooltip>

              <Tooltip title="schema源码" placement="right">
                <span
                  onClick={(e) => {
                    this.setState({
                      showSchema: true
                    })
                  }}
                  title="schema源码"
                  className={"iconfont tabsItem icon-daima"}></span>
              </Tooltip>
            </div> : null
          }
          {/* {
              this.state.selectTabs.includes("shu")&&(!ide)?<Left state={{schema:this.state.schema,editObj:this.state.editObj}} changeSchema={this.changeSchema}></Left>:null
            } */}
            {/* {
              this.state.selectTabs.includes("ku")&& (!ide)?<Components ></Components>:null
            } */}
              <div className={this.state.showPreview?"showPreview":"main"}>
                {/* {(!ide)&&(this.state.showPreview)?<Button className="showPreviewButton" onClick={()=>{
                  this.changeSchema({showPreview:!this.state.showPreview});
                }}>返回搭建</Button>:null}
                {
                  ide?<Main schema={this.state.schema} resetTime={this.state.resetTime} showPreview={this.state.showPreview} selectKey={this.state.editObj.key} type={this.state.type}></Main>:<iframe name="ideIframe" title="ide" className="ideIframe" ref={this.ideIframe} src={window.origin+"?ide=true"}></iframe>
                } */}
              </div>
            {/* {
               (!ide)?<Right key={this.state.editObj.key} state={{schema:this.state.schema,editObj:this.state.editObj}} changeSchema={this.changeSchema}></Right>:null
            } */}
        </div>


      </div>
    )
  }
}


