import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import {Button, Drawer } from 'antd';
import serialize from 'serialize-javascript';

export default class App extends React.Component{
  constructor(props){
    super(props)
    console.log(props)
    this.state={
       schema:serialize(props.schema,{space: 2})
    }
    this.confirm=this.confirm.bind(this);
    this.onChangeEvent=this.onChangeEvent.bind(this);
  }
  onChangeEvent=(str)=>{
      this.setState({
        schema:str
      })
  }
  confirm=(obj)=>{
    this.props.changeSchema({
      // eslint-disable-next-line no-new-func
      schema:new Function("return "+this.state.schema)(),
      showSchema:false
    })
  }
 
  render() {
    return (
         <Drawer
          title={"schema源码"}
          placement="left"
          width="560"
          closable={false}
          visible={this.props.showSchema}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" style={{ marginRight: "10px" }} onClick={() => { this.confirm() }}>确定</Button>
              <Button onClick={() => { this.props.changeSchema({ showSchema: false }) }}>取消</Button>
            </div>
          }
        >
          <div>
            <MonacoEditor
              width={512}
              height={window.innerHeight - 160}
              language={this.state.language}
              theme="vs-dark"
              defaultValue={this.state.schema}
              onChange={this.onChangeEvent}
              options={{
                selectOnLineNumbers: true
              }}
            />
          </div>
        </Drawer>
      
    )
  }
}


