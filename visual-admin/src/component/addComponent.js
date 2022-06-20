import React from 'react';
import {Form, Input, Button, Drawer } from 'antd';
import serialize from 'serialize-javascript';

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
       schema:serialize(props.schema,{space: 2})
    }
    this.confirm=this.confirm.bind(this);
    this.onChangeEvent=this.onChangeEvent.bind(this);
    this.addForm=React.createRef();
  }
  onChangeEvent=(str)=>{
      this.setState({
        schema:str
      })
  }
  confirm=(obj)=>{
    this.addForm.current.submit();
  }
  formSubmit=(val)=>{
  }
  render() {
    
    return (
         <Drawer
          title={"添加自定组件"}
          placement="left"
          width="560"
          height="500"
          closable={false}
          visible={this.props.showDraw}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" style={{ marginRight: "10px" }} onClick={() => { this.confirm() }}>确定</Button>
              <Button onClick={() => { this.props.changeState({ showDraw: false }) }}>取消</Button>
            </div>
          }
        >
          <Form ref={this.addForm}  onFinish={(val)=>{
            this.formSubmit(val)
          }} labelCol={{
            span:4
          }}>
            <Form.Item label="组件名称" rules={[
              {
                required: true,
                message: '请输入组件名称',
              },
            ]} name="name">
               <Input  />
            </Form.Item>
            <Form.Item label="中文描述" rules={[
              {
                required: true,
                message: '请输入中文描述',
              },
            ]} name="chinaName">
               <Input  />
            </Form.Item>
            <Form.Item label="npm包名称" rules={[
              {
                required: true,
                message: '请输入npm包名称',
              },
            ]} name="npm">
               <Input  />
            </Form.Item>
            <Form.Item label="包版本号" rules={[
              {
                required: true,
                message: '请输入包版本号',
              },
            ]} name="edition">
               <Input  />
            </Form.Item>
          </Form>
        </Drawer>
      
    )
  }
}


