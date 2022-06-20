import React from 'react';
import cats from '../utils/cats'
import { Input } from 'antd';
import './components.css';
import utis from '../utils/index'

// Serialize-javascript 能够序列化 JavaScript 库成含有正则表达式和功能的 JSON 包

import serialize from 'serialize-javascript';
import AddComponent from '../component/addComponent'
const { Search } = Input;
const img = new Image()
img.src = 'https://gw.alicdn.com/tfs/TB1u9lvGFY7gK0jSZKzXXaikpXa-32-32.png'
img.height="10px"
export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
      catArr:cats
    }
    this.changeCat=utis.deounce(this.changeCat,1000)
    this.handleOndragStart = this.handleOndragStart.bind(this);
  }
  handleOndragStart =(e,data)=>{
    e.dataTransfer.setData("key","insert");
    let item=utis.deepCopy(data);
    item.icon=undefined;
    e.dataTransfer.setData("item",serialize(item));
    e.dataTransfer.setDragImage(img, 0, 0)
  }
  changeCat=(val)=>{
    this.setState({
      catArr:cats.map(v=>{
        return {...v,data:v.data.filter(v1=>{
          if(!val){
            return true;
          }
          return v1.nameSpace.includes(val)||v1.title.includes(val)
        })}
      })
    })
  }
  changeState=(obj)=>{
    this.setState({
      ...obj
    })
  }
  render() {
    return (
      <div className="components">
          <AddComponent showDraw={this.state.showDraw} changeState={this.changeState}></AddComponent>
          <div className="myTitle">
            组件库
          </div>
          
          <Search
            size={"small"}
            placeholder="关键词搜索组件库"
            enterButton="添加"
            onChange={(e) =>{
              this.changeCat(e.target.value)
            }}
            onSearch={value =>{
              this.setState({
                showDraw:true
              })
            }}
            style={{ width: 200 }}
          />
          <div>
            {
              this.state.catArr.map((v,i1)=>{
                return <ul key={"catUl"+i1}>
                  <div className="catTitle">
                    {v.name}
                  </div>
                  {
                    (Array.isArray(v.data) ? v.data : []).map((v,i)=>{
                      return <li key={`li-${String(i1)}-${String(i)}`} className="catLi">
                        <div draggable="true"  onDragStart={(e)=>{
                          e.stopPropagation();
                          this.handleOndragStart(e,v)
                        }} >
                         {
                           <span className={"iconfont "+(utis.iconArr[v.nameSpace]||"icon-ceng")}></span>
                         } {v.title}
                        </div>
                      </li>
                    })
                  }
                </ul>
              })
            }
          </div>
      </div>
    )
  }
}


