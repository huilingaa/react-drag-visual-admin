import React from 'react';
import './editStyle.css'
import {Button,Input} from 'antd';
import utils from '../utils'
export default class App extends React.Component {
  constructor(props) {
    super(props);
    let editObj = utils.deepCopy(props.state.editObj);
    editObj.props=editObj.props||{};
    editObj.props.style=editObj.props.style||{}
    this.state = {
        ...props.state, showDataConfig: false, editObj: editObj, eventKey: [],
    };
    this.handleChange = utils.deounce(this.handleChange.bind(this), 50);
  }


  componentWillReceiveProps(props, state) {
    let editObj = utils.deepCopy(props.state.editObj);
    editObj.props=editObj.props||{};
    editObj.props.style=editObj.props.style||{}
    this.setState({
        editObj:editObj
    })
  }
   /*
   * 该方法用以可以直接进行赋值的属性，例如input change switch change
   */
  handleChange = (data, value) => {
    console.log(data,value)
    let { name: key } = data;
    let schema = utils.deepCopy(this.state.schema);
    let editObj = utils.deepCopy(this.state.editObj);
    editObj.props.style[key] = value;
    utils.replaceObj(schema, this.state.editObj.key.split("-"), editObj);
    this.props.changeSchema({
      schema: schema,
      editObj: editObj
    })
  }
 
  render() {
    return (
      <div>
           
                  {/* <div className="div-wrap">
                        <div  className="div-marigin-top">
                            <input   />
                        </div>
                        <div  className="div-marigin-bottom">
                            <input    />
                        </div>
                        <div  className="div-marigin-left">
                            <input    />
                        </div>
                        <div  className="div-marigin-right">
                            <input    />
                        </div>
                        <div  className="div-padding-top">
                            <input   />
                        </div>
                        <div  className="div-padding-bottom">
                            <input    />
                        </div>
                        <div  className="div-padding-left">
                            <input    />
                        </div>
                        <div  className="div-padding-right">
                            <input    />
                        </div>
                    </div> */}
                {
                    [{
                        name:"width",
                        title:"宽度"
                   },{
                        name:"height",
                        title:"高度"
                    },{
                        name:"margin",
                        title:"外边距"
                    },{
                        name:"padding",
                        title:"内边距"
                    },{
                        name:"background",
                        title:"背景色"
                    },{
                        name:"font",
                        title:"字号"
                    },{
                        name:"color",
                        title:"文字颜色"
                    }].map((v,i)=>{
                        return <div className="propDiv" key={i}>
                        <span className="propText">{v.title}</span>
                        {
                            /\{\{.*\}\}/.test(String(this.state.editObj.props.style[v.name]))? <Input  defaultValue={(this.state.editObj.props.style[v.name]?String(this.state.editObj.props.style[v.name]):"").replace(/\{|\}/gi, "")} className="propMain" prefix="{{" suffix="}}"
                            onChange={(e) => {
                              this.handleChange(v, "{{" + e.target.value + "}}")
                            }}
                            />:<Input  defaultValue={(this.state.editObj.props.style[v.name]?String(this.state.editObj.props.style[v.name]):"").replace(/\{|\}/gi, "")} className="propMain"
                            onChange={(e) => {
                                this.handleChange(v,e.target.value)
                            }}
                            />
                        }
                          
                        <Button type="link" onClick={()=>{
                            if (/\{\{.*\}\}/.test(String(this.state.editObj.props.style[v.name]))) {
                                this.handleChange(v, "")
                              } else {
                                this.handleChange(v, "{{}}")
                              }
                        }} className="propButton" icon={<i className="iconfont icon-daima"></i>}></Button>
                      </div>
                    })
                }
                
                                    
      </div>
    )
  }
}


