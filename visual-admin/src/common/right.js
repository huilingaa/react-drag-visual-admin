import React from 'react';
import './right.css'
import utils from '../utils'
import getProps from '../utils/getProps'
import getEvent from '../utils/getEvent'
import MonacoEditor from '../component/monaco';
import { Tabs } from 'antd';
import {Tooltip, Form, Input, Button, Switch, Select, Radio, Collapse, Drawer } from 'antd';
import DataConfig from '../component/dataConfig'
import List from '../component/list'
import serialize from 'serialize-javascript';
import EditStyle from '../component/editStyle'
const { Option } = Select;
const { TabPane } = Tabs;
export default class App extends React.Component {
  constructor(props) {
    super(props)
    let editObj = utils.deepCopy(props.state.editObj);
    let eventArr = getEvent(props.state.editObj.nameSpace);
    this.state = {
      ...props.state, showDataConfig: false, editObj: editObj, eventKey: [],
      eventData: {
        type: eventArr ? "组件事件" : "原生事件",
        data: eventArr || ["onClick", "onChange", "onBlur", "onMouseDown"]
      }
    };
    this.handleChange = utils.deounce(this.handleChange.bind(this), 50);
    this.handleEventClick = this.handleEventClick.bind(this)
    this.showEvent = this.showEvent.bind(this)
    this.confirmEvent = this.confirmEvent.bind(this)
    this.delEvent = this.delEvent.bind(this)
    this.onChangeEvent = this.onChangeEvent.bind(this)
  }

  //当前节点树发生改变，镜像数据给当前state  目的，在编辑完毕数据后，创建新的schema给 分发组件，用以分发刷新数据
  componentWillReceiveProps(props, state) {
    this.setState({
      ...props.state
    })
  }
  /*
   * 该方法用以可以直接进行赋值的属性，例如input change switch change
   */
  handleChange = (data, value) => {
    let { name: key, type } = data;
    let schema = utils.deepCopy(this.state.schema);
    let editObj = utils.deepCopy(this.state.editObj);
    switch (type) {
      case "boolean":
        editObj.props[key] = value;
        break;
      case "loop":
        editObj.loop = value;
        break;
      default:
        editObj.props[key] = value;
        break
    }

    utils.replaceObj(schema, this.state.editObj.key.split("-"), editObj);
    this.props.changeSchema({
      schema: schema,
      editObj: editObj
    })
   
  }
   /*
   * 添加函数事件
   */
  handleEventClick = (values) => {
    let value = values["event"];
   
    if (!values) return;
    let editObj = utils.deepCopy(this.state.editObj);
    if (editObj.props[value]) return;
    // eslint-disable-next-line no-new-func
    editObj.props[value] = new Function(`return function ${value}(e) {}`)();
    let schema = utils.deepCopy(this.state.schema);
    utils.replaceObj(schema, String(this.state.editObj.key).split("-"), editObj);

    this.props.changeSchema({
      schema: schema,
      editObj: editObj
    })
   
  }
  /*
   * 显示event事件
   */
  showEvent = (key, language,defaultValue="") => {
    let keyArr = String(key).split("-");
    let target = keyArr.length === 1 ? this.state.editObj[keyArr[0]] : this.state.editObj[keyArr[0]][keyArr[1]];
    if (typeof target == "function") {
      defaultValue = serialize(target,{space: 2});
    } else {
      if (typeof target === "object") {
        defaultValue = JSON.stringify(target, null, 2)
      } else {
        defaultValue = defaultValue||"{}"
      }
    }
    this.setState({
      eventDia: true,
      eventKey: keyArr,
      language: language,
      defaultValue: defaultValue
    })

  }
  /*
   * 改变event事件
   */
  onChangeEvent = (val) => {
    let editObj = utils.deepCopy(this.state.editObj);
    let changeKey = this.state.eventKey
    console.log(val)
    try {
      if (changeKey.length === 1) {
        editObj[changeKey[0]] =  new Function(`return ` + val)();
      } else {
        if (/^on.*/.test(changeKey[1])) {
          // eslint-disable-next-line no-new-func
          editObj[changeKey[0]][changeKey[1]] = new Function(`return ` + val)();
        } else {
          editObj[changeKey[0]][changeKey[1]] = JSON.parse(val);
        }
      }
    } catch (e) {
      console.log(e)
    }
    console.log(editObj)
    this.setState({
      editObj: editObj
    })
  }
  /*
   * event类的事件，需要进行monaco编辑器的事件，需要再次确认以后，转换为当前类型并同步给节点树
   */
  confirmEvent = (key) => {
    let schema = utils.deepCopy(this.state.schema);
    let editObj = utils.deepCopy(this.state.editObj);

    utils.replaceObj(schema, String(this.state.editObj.key).split("-"), editObj);
    this.setState({
      eventDia: false
    })
    this.props.changeSchema({
      schema: schema,
      editObj: editObj
    })
  }

  /*
   * event类的事件，需要进行monaco编辑器的事件，需要再次确认以后，转换为当前类型并同步给节点树
   */
  delEvent = (key) => {
    let schema = utils.deepCopy(this.state.schema);
    let editObj = utils.deepCopy(this.state.editObj);
    let keyArr = String(key).split("-");
    if(keyArr.length===1){
      delete editObj[keyArr[0]]
    }else{
      delete editObj[keyArr[0]][keyArr[1]]
    }


    utils.replaceObj(schema, String(this.state.editObj.key).split("-"), editObj);
    
    this.props.changeSchema({
      schema: schema,
      editObj: editObj
    })
  }
 /*
  * 根据props的当前dsl的类型，渲染不同的编辑组件
  */
  runderType = (item) => {//根据可枚举的属性 runder不同的修改组件去修改当前类型
    switch (item.type) {
      case "string":
        return <Input className="propMain" defaultValue={this.state.editObj.props[item.name]} onChange={(e) => {
          e.stopPropagation();
          this.handleChange(item, e.target.value)
        }} />
      case "array":
        return <Button block className="propMain" size="small" type="primary" onClick={(e) => {
          this.setState({ arrDia: true, arrData: this.state.editObj.props[item.name], eventKey: item.name })
        }} >点击设置</Button>
      case "radioGroup":
        return <Radio.Group size="small" value={this.state.editObj.props[item.name]} onChange={(e) => {
          this.handleChange(item, e.target.value)
        }}>
          {
            item.data.map(v => {
              return <Radio.Button key={"label" + v.label} value={v.value}>{v.label}</Radio.Button>
            })
          }
        </Radio.Group>
      case "function":
        return <div className={this.state.isFull ? "monacoViewFixed" : "monacoView"}>
          <MonacoEditor
            width={this.state.isFull ? window.innerWidth : 280}
            height={this.state.isFull ? window.innerHeight : 280}
            language="javascript"
            theme="vs-dark"
            value={this.state.editObj.props[item.name]}
            options={{
              selectOnLineNumbers: true
            }}
          />
          <span onClick={() => {
            this.setState({
              isFull: !this.state.isFull
            })
          }} className={"iconfont monacoViewIcon " + (!this.state.isFull ? "icon-iconset0430" : "icon-shouqi")} />
          <Button type="primary" onClick={() => { console.log(123) }} style={{ marginTop: "10px" }}>确定</Button>
        </div>
      case "json":
        return <Button block className="propMain" size="small" type="primary" onClick={(e) => {
          this.showEvent("props-" + item.name, "json","[]")
        }} >点击设置</Button>
      case 'boolean':
        return <Switch checked={!!this.state.editObj.props[item.name]} key={item.name} onChange={(checked) => {
          this.handleChange(item, checked)
        }} />
      default:
        break;
    }
  }
  render() {
    return (
      <div className="myRight">

        <Tabs>
        <TabPane tab="属性" key="1">
            <div className="propDiv" style={{borderBottom:"1px solid #eee","paddingBottom":"15px","marginBottom":"20px"}}>
              <span className="propText">
                当前选中
              </span>
              <div>
                {this.state.editObj.nameSpace}
              </div>
           
            </div>
            {//绑定的可枚举属性
              (this.state.editObj && this.state.editObj.nameSpace ? getProps(this.state.editObj.nameSpace) : []).map((v, i) => {
                return <div className="propDiv" key={"editObj" + i}>
                  <span className="propText">{v.title}</span>
                  {
                    /\{\{.*\}\}/.test(String(this.state.editObj.props[v.name])) ? <Input key={"runderType" + v.name} defaultValue={String(this.state.editObj.props[v.name]).replace(/\{|\}/gi, "")} className="propMain" prefix="{{" suffix="}}"
                      onChange={(e) => {
                        this.handleChange(v, "{{" + e.target.value + "}}")
                      }}
                    /> : this.runderType(v)
                  }
                  <Button type="link" className="propButton" onClick={() => {
                    if (/\{\{.*\}\}/.test(String(this.state.editObj.props[v.name]))) {
                      this.handleChange(v, "")
                    } else {
                      this.handleChange(v, "{{}}")
                    }

                  }} icon={<i className="iconfont icon-daima"></i>}></Button>
                </div>
              })
            }
            {//绑定的事件 除了page上的事件
              this.state.editObj && this.state.editObj.nameSpace && this.state.editObj.nameSpace !== "page" ? <Form name="validate_other" onFinish={(values) => {
                this.handleEventClick(values)
              }}>
                <Form.Item name="event" className="propDiv">
                  {/* <span className="propText">{this.state.eventData.type}</span> */}

                  <Select className="propMain" placeholder="请选择事件">
                    {
                      this.state.eventData.data.map(v => {
                        return <Option value={v} key={v}>{v}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
                {
                 ((this.state.editObj && this.state.editObj.props ? Object.keys(this.state.editObj.props):[]).filter(v => {
                    return v.indexOf("on") === 0
                  }) || []).map(v => {
                    return <div className="eventWrap" key={"eventDiv" + v}>
                      <span>{this.state.eventData.type}：</span>
                      <span className="textButton" onClick={() => {
                        this.showEvent("props-" + v, "javascript")
                      }}>{v}</span>
                      <span className="textButton iconfont icon-delete" onClick={() => {
                        this.delEvent("props-" + v)
                      }}></span>
                    </div>
                  })
                }
                <div>
                  <Button block size="small" htmlType="submit" type="primary">添加事件</Button>
                </div>
              </Form>:null
            }
         
          </TabPane>
          
        <TabPane tab="样式" key="2">
             <div className="propDiv" style={{borderBottom:"1px solid #eee","paddingBottom":"15px","marginBottom":"20px"}}>
              <span className="propText">
                当前选中
              </span>
              <div>
                {this.state.editObj.nameSpace}
              </div>
              <Tooltip title="修改组件样式" placement="left">
              <Button type="link" className="propButton" onClick={() => {
                this.showEvent("props-style", "json")
              }} icon={<i className="iconfont icon-daima"></i>}></Button>
               </Tooltip>
            </div>
              <EditStyle state={this.props.state} changeSchema={this.props.changeSchema}></EditStyle>
          </TabPane>
          
          <TabPane tab="数据" key="3">
            <DataConfig showDataConfig={this.state.showDataConfig} close={() => { this.setState({ showDataConfig: false }) }}></DataConfig>
            {
              this.state.editObj && this.state.editObj.nameSpace && this.state.editObj.nameSpace !== "page" ? <div className="propDiv">
                <span className="propText">循环数据</span>
                {
                  /\{\{.*\}\}/.test(String(this.state.editObj.loop)) ? <Input key="loop-input" prefix="{{" suffix="}}" className="propMain" defaultValue={String(this.state.editObj.loop).replace(/\{|\}/gi, "")} onChange={(e) => {
                    this.handleChange({ name: "", type: "loop" }, "{{" + e.target.value + "}}")
                  }} /> : <Input className="propMain" defaultValue={this.state.editObj ? this.state.editObj.loop : ""} onChange={(e) => {
                    this.handleChange({ name: "", type: "loop" }, e.target.value)
                  }} />
                }
                <Button type="link" className="propButton" onClick={() => {
                  if (/\{\{.*\}\}/.test(String(this.state.editObj.loop))) {
                    this.handleChange({ name: "", type: "loop" }, "")
                  } else {
                    this.handleChange({ name: "", type: "loop" }, "{{}}")
                  }
                }} icon={<i className="iconfont icon-daima"></i>}></Button>
              </div>:null
            }
            {
              this.state.editObj && this.state.editObj.nameSpace && this.state.editObj.nameSpace === "page" ? <div>
                <Collapse defaultActiveKey={['1', '2', '3']}>
                  <Collapse.Panel header="初始数据设置" key="1">
                    <Button onClick={() => {
                      this.showEvent("state", "json")
                    }} block size="small" htmlType="submit" type="primary">设置初始state</Button>
                    <div>
                      <Button type="link" size="small" className="data-reset" onClick={()=>{
                        this.props.changeSchema({
                          resetTime:Date.now()
                        })
                      }}>
                        <span className="iconfont icon-reset"> 重置初始数据 </span>  
                      </Button>  
                    </div> 
                  </Collapse.Panel>
                  <Collapse.Panel header="异步数据源" key="2">
                    <Button block size="small" onClick={() => { this.setState({ showDataConfig: true }) }} htmlType="submit" type="primary">添加异步数据源</Button>
                  </Collapse.Panel>
                  <Collapse.Panel header="异步数据处理函数" key="3">
                    <Button block size="small" htmlType="submit" type="primary" onClick={()=>{
                        this.showEvent("props-dataHandle", "javascript")
                    }}>异步数据源处理函数</Button>
                    <Button type="link"  size="small"  className="data-reset" onClick={(e)=>{
                        this.props.changeSchema({
                          resetTime:Date.now()
                        })
                      }}>
                        <span className="iconfont icon-reset"> 重置初始回调函数 </span>  
                      </Button>  
                  </Collapse.Panel>
                </Collapse>
              </div>:null
            }
          </TabPane>
        </Tabs>
        {//事件编辑器的值,属性编辑器，使用与更改事件，更改page的state属性
          this.state.eventDia ? <Drawer
            title={{ "state": "编辑初始数据","props-style":"编辑内联样式" }[this.state.eventKey.join("-")] || "属性编辑"}
            placement="right"
            width="560"
            closable={false}
            visible={this.state.eventDia}
            footer={
              <div style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginRight: "10px" }} onClick={() => { this.confirmEvent() }}>确定</Button>
                <Button onClick={() => { this.setState({ eventDia: false }) }}>取消</Button>
              </div>
            }
          >
            <div>
              <MonacoEditor
                width={512}
                height={window.innerHeight - 160}
                language={this.state.language}
                theme="vs-dark"
                key={this.state.eventKey.join("-")}
                defaultValue={this.state.defaultValue}
                onChange={this.onChangeEvent}
                options={{
                  selectOnLineNumbers: true
                }}
              />
            </div>
          </Drawer>:null
        }
        {
          this.state.arrDia ?<List arrDia={this.state.arrDia} key={"addDia"} data={this.state.arrData || []} comfirm={(value) => {
            this.handleChange({ name: this.state.eventKey, value: "" }, value)
          }} hide={() => { this.setState({ arrDia: false }) }}></List>:null
        }

      </div>
    )
  }
}


