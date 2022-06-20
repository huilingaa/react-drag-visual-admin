import React from 'react';
import utils from '../utils'
import {  Button, Radio} from 'antd';
import io from 'socket.io-client'


export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            schema: props.schema,
            type:"drag"
        }
        this.schemaArr = [utils.deepCopy(props.schema)];
        this.step = 0;
    }
    //镜像树形结构给当前state
    componentWillReceiveProps(props) {
        if(props.schemaFlag){
            this.setState({
                schema:props.schema,
                schemaFlag:true,
            })
        }
    }
    /*
    *schema树形结构发生改变，保存树形结构历史
    */
    saveSchema = () => {
        if (!this.state.schemaFlag) return;
        this.schemaArr.push(utils.deepCopy(this.state.schema));
        this.step = this.schemaArr.length - 1;
        this.setState({
            schemaFlag: false
        })
    }
    /*
    * 对保存历史下一步操作
    */
    preStep = () => {
        if (this.step === 0) return;
        this.props.changeSchema({
            schema: this.schemaArr[--this.step]
        })
    }
    /*
    * 对保存历史上一步操作
    */
    nextStep = () => {
        if (this.step === this.schemaArr.length - 1) return;
        this.props.changeSchema({
            schema: this.schemaArr[++this.step]
        })
    }
    /*
    * 对保存历史上一步操作
    */
    reBuild = () => {
        // 创建socket连接，http使用ws协议，https使用wss协议
      const socket = io('http://localhost:7002/')
      socket.on('connect', () => {
        console.log('已连接!');
        socket.emit('build',"我是小黑");
      })
      // 接收消息
      socket.on('res', res => {
        // res返回格式有前后端自己协定
        console.log(res)
      })
    }
    render() {
        return (
            <div className="myHead">
                <img className="myLogo" alt="" src="/img/logo.png" />
                <div className="myHead-type" style={{ "marginLeft": "auto" }}>
                    <Radio.Group size="small" onChange={(e) => { 
                        this.setState({
                            type: e.target.value 
                        });
                        this.props.changeSchema({ type: e.target.value })
                    }} value={this.state.type}>
                        <Radio.Button value="drag" key={"drag"}>布局模式</Radio.Button>
                        <Radio.Button value="preview" key={"preview"}>预览模式</Radio.Button>
                    </Radio.Group>
                </div>
                <div style={{ display: "flex", "flexDirection": "row", "marginLeft": "auto" }}>
                    <div className="mySave">
                        <Button type="link" onClick={() => {
                            this.preStep()
                        }}>上一步</Button>
                        <Button type="link" onClick={() => {
                            this.nextStep()
                        }}
                        >下一步</Button>
                        <Button type={"primary"} disabled={!this.state.schemaFlag} onClick={() => {
                            this.saveSchema();
                        }} style={{ marginRight: "10px" }}>保存</Button>
                        <Button style={{ marginRight: "10px" }} onClick={() => {
                             this.props.changeSchema({ showPreview: !this.state.showPreview });
                        }}>预览</Button>
                        <Button onClick={() => {
                            this.reBuild();
                        }}>重启Ide</Button>
                    </div>
                </div>
            </div>
        )
    }
}


