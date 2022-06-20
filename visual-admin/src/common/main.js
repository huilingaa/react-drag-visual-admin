import React from 'react';
import utils from '../utils/index'
import { Button, Table, Pagination, Form, Input, Select, Radio, Switch, DatePicker, Modal } from 'antd';
import './main.css'
import Column from '../component/column';
import Line from '../component/line';

let resetTime = "";
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleRender = this.handleRender.bind(this);
    this.state = {
      ...props.schema[0].state,
      resetTime: props.resetTime,
    };
    resetTime = props.resetTime;
    this.textAreaRef = React.createRef();
    window.t = this;
    this.modal = Modal;
  }
  //镜像树形结构给当前state
  static getDerivedStateFromProps(props, state) {
    try {
      if (resetTime !== props.resetTime) {
        resetTime = props.resetTime;
        return props.schema[0].state || {}
      }
      return {}
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  //当前节点为page节点，需要分配当前page state给顶层state  ，并且执行异步数据源，和异步数据源处理函数
  handlePageRender = (node, key) => {
    node = utils.deepCopy(node);
    delete node.state;
    delete node.props.dataHandle;
    return this.handleRender(node, key, this, "0")
  }

  //针对可拖拽的节点，画布也可以进行拖拽增加节点  
  handleDragOver = (e) => {
    // e.preventDefault();
    // e.stopPropagation()
    let allNum = utils.getOffsetLeft(e.currentTarget);
    let diffNum = e.pageX - allNum;
    let position = "";
    if (diffNum < e.target.offsetWidth / 2) {
      position = "beforeSelect";
    } else {
      position = "afterSelect";
    }
    e.currentTarget.setAttribute("data-postion", position);
    window._position = position;
  }
  //拖拽节点离开事件，样式修复
  handleOndragLeave = (e, key) => {
    e.currentTarget.setAttribute("data-postion", "");
  }
  //拖拽节点离开事件，拖放事件
  handleDrop = (e, endKey) => {
    e.preventDefault();
    e.stopPropagation()
    e.currentTarget.setAttribute("data-postion", "");
    let endKeyArr = endKey.split("-");
    let schema = utils.deepCopy(this.props.schema);
    let nowObj = {}
    // eslint-disable-next-line no-new-func
    nowObj = new Function("return " + e.dataTransfer.getData("item"))();
    utils.inserObj(schema, endKeyArr, { ...nowObj }, window._position);
    window.parent.changeSchema({
      schema: [...schema]
    })
  }

  //渲染引擎，渲染整个节点树
  handleRender = (target, key, parent, orginKey) => {
    let node = utils.deepCopy(target);
    try {
      node.__proto__ = parent;
    } catch (e) {
      console.log("原型链报错")
      console.log(e)
    }

    if (node.props && node.props.ishide) {//是否要隐藏节点
      return null;
    }

    if (node.hasOwnProperty("loop") && node.loop) {  //是否循环，首先处理循环
      try {
        // eslint-disable-next-line no-new-func
        let arr = new Function("return " + node.loop.replace(/\{|\}/gi, "")).bind(node)();
        return (Array.isArray(arr) ? arr : []).map((v, i) => {
          console.log(v)
          console.log(node)
          node = utils.deepCopy(node)
          node["item"] = v;
          node["index"] = i;
          node.loop = undefined;
          return this.handleRender(node, key + "-loop-" + i, parent, orginKey)
        })
      } catch (e) {
        console.log("循环报错")
        console.log(e)
      }
      return null;
    }
    //解析模板字符串
    const parseObject = (obj, node) => {
      Object.keys(obj).forEach(v => {
        let matchs = String(obj[v]).match(/\{\{.*?\}\}/);
        if (matchs && obj[v]) {
          try {
            // eslint-disable-next-line no-new-func
            obj[v] = new Function("return " + obj[v].replace(/\{|\}/gi, "")).bind(node)();
          } catch (e) {
            obj[v] = "";
          }
        }
        if (typeof node.props[v] === "function") {
          obj[v] = obj[v].bind(node);
        }
        if (matchs && ["{{this}}", "{{t}}", "{{this.state}}"].includes(matchs[0])) {
          obj[v] = String(obj[v])
        }
        //如果解析出来是一个对象，并且里面仍然含有模板字符串，需要再次往下解析，否则不再解析
        if (obj[v] === "")
          if (typeof obj[v] === "object" && /\{\{.*\}\}/.test(JSON.stringify(obj[v]))) {
            parseObject(obj[v], node)
          }
      })
    }
    parseObject(node.props, node);//批量处理属性榜单
    let children = [];
    if (node.nameSpace === "tableColumn") {
      children = Array.isArray(node.children) ? node.children : [];
      if (children.length > 0) {
        node.props.render = (arr, record, index) => {
          return <div key={key + "-tableColumnDiv" + index}>
            {
              children.map((v, i) => {
                v.record = record;
                v.index = index;
                return this.handleRender(v, key + "-tableColumn-" + index + "-" + i, node, orginKey + "-" + i)
              })
            }
          </div>
        }
      }
    } else {
      children = (Array.isArray(node.children) ? node.children : []).map((v, i) => {
        return this.handleRender(v, key + "-" + i, node, orginKey + "-" + i)
      }) || [];
      if (children.length > 0) {

        if (children.length === 1) {
          children = children[0];
        }
        node.props && (node.props.children = children)
      }
    }
    node.props["data-key"] = orginKey;
    let self = this;
    node.props.onMouseUp = function onMouseUp(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log(self.props.schema)
      if (self.props.type !== "drag") {
        return
      }
      let editObj = utils.getSchemaTargetByKey(utils.deepCopy(self.props.schema), orginKey.split("-"));
      delete editObj.props.onDragOver;
      delete editObj.props.onDragLeave;
      delete editObj.props.onDrop;
      delete editObj.props.onMouseUp;
      window.parent.changeSchema({
        editObj: { ...editObj, key: orginKey }
      })

    }
    if (this.props.type === "drag" && (!this.props.showPreview)&&node.nameSpace !=="page") {//当是布局模式画布可以进行拖拽

      if (node.nameSpace !== "dataPicker") {
        node.props["data-drag"] = "ace-drag";
        node.props.onDragOver = (e) => {
          this.handleDragOver(e, orginKey);
        }
        node.props.onDragLeave = (e) => {
          this.handleOndragLeave(e, orginKey);
        }
        // node.props.draggable="true"
        node.props.onDrop = (e) => {
          this.handleDrop(e, orginKey);
        };
        if (String(orginKey) === String(this.props.selectKey)) {
          node.props["data-drag"] = "select";
        }
      }
    }
    

    switch (node.nameSpace) {
      case "page":
        return <div key={"div" + key}>{children}</div>;
      case "div":
        return <div key={"div" + key}  {...node.props} />;
      case "table":
        node.props.dataSource = (Array.isArray(node.props.dataSource) ? node.props.dataSource : []).map((v, i) => {
          return { ...v, key: key + "tableKey" + i }
        })
        return <Table key={"table" + key} pagination={false} {...node.props} />
      case "tableColumn":
        return <Table.Column key={"column" + key} {...node.props} />
      case "select":
        return <Select key={"select" + key} {...node.props} />
      case "button":
        return <Button key={"button" + key} {...node.props} />
      case "text":
        return <span key={"span" + key} {...node.props} />;
      case "img":
        return <img key={"img" + key}   {...node.props} alt="" />;
      case "line":
        return <Line container={"column" + key} key={JSON.stringify(target.props)} {...node.props} />
      case "column":
        return <Column container={"column" + key} key={JSON.stringify(target.props)} {...node.props} ></Column>
      case "form":
        return <Form key={"form" + key} ref={(component)=>{
          if (node.props.name) {
             this[node.props.name]= component;
          }
        }}  {...node.props} />
      case "formItem":
        return <Form.Item key={"formItem" + key}   {...node.props} />
      case "input":
        return <Input key={"input" + key}   {...node.props} />
      case "switch":
        return <Switch key={"input" + key}   {...node.props} />
      case "radio":
        return <Radio.Group key={"input" + key}   {...node.props} />
      case "dataPicker":
        return <DatePicker key={"input" + key}   {...node.props} />
      case "pagination":
        return <Pagination key={"input" + key}   {...node.props} />
      case "modal":
        return <Modal key={"input" + key}   {...node.props} />
      default:
        return null;
    }
  }
  render() {
    return (
      <div className="mainCanvas">
        {
          this.handlePageRender(this.props.schema[0], 0)
        }
      </div>
    )
  }
}


