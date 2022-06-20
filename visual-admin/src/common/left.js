import React from 'react';
import './left.css';
import utils from '../utils'

const img = new Image()
img.src = 'https://gw.alicdn.com/tfs/TB1u9lvGFY7gK0jSZKzXXaikpXa-32-32.png'
img.height="10px"

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state={...props.state}
    this.handleOndragLeave = this.handleOndragLeave.bind(this);
    this.handleOndragStart = this.handleOndragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleRender = this.handleRender.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDelNode = this.handleDelNode.bind(this);
  }

  //当前节点树发生改变，镜像数据给当前state  目的，在编辑完毕数据后，创建新的schema给 分发组件，用以分发刷新数据
  static getDerivedStateFromProps(props,state){
    let editObj=utils.deepCopy(props.state.editObj);
    editObj.state=JSON.stringify(editObj.state||{},null,2);
    return {...props.state,editObj:editObj};
  }
  handleSelect=(e,key,item)=>{
    let selectArr=document.getElementsByClassName("nowSelect");
    for(let i=0;i<selectArr.length;i++){
      selectArr[i].className="leftWrap"
    }
    e.currentTarget.className= "leftWrap nowSelect"
    this.props.changeSchema({
      editObj:{...item,key:key},
    })
  }

  handleDelNode=(e,startKey)=>{
    e.stopPropagation();
    let schema=utils.deepCopy(this.state.schema);
    utils.getSchemaTargetByKey(schema,startKey.split("-"));
    this.props.changeSchema({
      schema:[...schema],
      editObj:{...schema[0],key:"0"}
    })
    let selectArr=document.getElementsByClassName("nowSelect");
    for(let i=0;i<selectArr.length;i++){
      selectArr[i].className="leftWrap"
    }
  }
  handleOndragStart =(e,key)=>{
    e.dataTransfer.setData("key",key);
    e.dataTransfer.setDragImage(img, 0, 0)
    let parentNode=e.target.parentNode;
    setTimeout(() => {
      parentNode.className=parentNode.className.replace("open","close")
    }, 0);
  }
  handleOndragLeave=(e,key)=>{
    e.currentTarget.className="leftWrap"
  }
  handleDragOver=(e)=>{//判断当前的节点拖拽情况，是内侧还是，上侧 or下侧  根据position 位置判断
      let enterPageY= window._pageY||0;
      let allNum=utils.getOffsetTop(e.currentTarget);
      let diffNum=e.pageY-allNum;
      let startKey=e.dataTransfer.getData("key");
      let key=e.target.getAttribute("data-key");
      let nameSpace=e.target.getAttribute("data-name");
      if(key===startKey)return;
      let position="";
      if(nameSpace!=="page"&&utils.iconArr[nameSpace]){//只有层标签才可以放到组件里面
        if(diffNum<e.target.offsetHeight/2){
          position=e.pageY-enterPageY>0?"beforeSelect":"afterSelect";
        }else{
          position=e.pageY-enterPageY>0?"afterSelect":"beforeSelect";
        }
      }else{
        if(diffNum<e.target.offsetHeight/3){
          position=e.pageY-enterPageY>0?"beforeSelect":"afterSelect";
        }else if(diffNum>e.target.offsetHeight/3*2){
          position=e.pageY-enterPageY>0?"afterSelect":"beforeSelect";
        }else{
         // eslint-disable-next-line no-useless-concat
         position="select"
        }
      }
      e.currentTarget.className="leftWrap "+position
      window._position=position;
  }
  handleDragEnd=(e,start)=>{
    e.target.className=e.target.className.includes("open")?e.target.className.replace("open","close"):e.target.className;
  }

  handleDrop=(e,endKey)=>{ //鼠标拖放事件，结束后，把选中节点指向page，同时，根据startKey是否等于insert判断是否是新加的节点
    e.currentTarget.className="leftWrap"
    let startKey=e.dataTransfer.getData("key");
    if(startKey===endKey)return;
    let endKeyArr=endKey.split("-");
    let startKeyArr=startKey.split("-");
    if(endKey.indexOf(startKey.replace(/-\d$/,""))>=0&&parseInt(endKeyArr[startKeyArr.length-1])>parseInt(startKeyArr[startKeyArr.length-1])){
      endKeyArr[startKeyArr.length-1]=endKeyArr[startKeyArr.length-1]-1;
    }
    let schema=utils.deepCopy(this.state.schema);
    let nowObj={}
    if(startKey==="insert"){
      // eslint-disable-next-line no-new-func
      nowObj=new Function("return "+e.dataTransfer.getData("item"))();
    }else{
      nowObj=utils.getSchemaTargetByKey(schema,startKey.split("-"));
    }
    utils.inserObj(schema,endKeyArr,nowObj,window._position);
    this.props.changeSchema({
      schema:[...schema],
      editObj:{
        ...schema[0],
        key:"0"
      }
    });

  }
  handleClick=(e,key,item)=>{
    if(item.children.length===0)return ;
    e.target.className= e.target.className.indexOf("close")>=0?"open":"close";
  }
 
  handleRender=(node,key)=>{
    return <li  key={key} data-key={key}  className={ Array.isArray(node.children)&&node.children.length>0?"open":""} onClick={(e)=>{
      e.stopPropagation();
      this.handleClick(e,key,node)
    }}>
    
   <div className={(String(key)===String(this.props.state.editObj.key))?"leftWrap nowSelect":"leftWrap"} data-name={node.nameSpace} data-key={key} onClick={(e)=>{
      e.stopPropagation();
      this.handleSelect(e,key,node)
    }} onDragEnd={(e)=>{
      e.stopPropagation();
      this.handleDragEnd(e,key);
    }}  onDragStart={(e)=>{
      e.stopPropagation();
      this.handleOndragStart(e,key)
    }} 
    onDragOver={(e)=>{
      e.preventDefault();
      e.stopPropagation()
      this.handleDragOver(e,key)
    }}
    onDrop={(e)=>{
      e.stopPropagation()
      this.handleDrop(e,key)
    }}
    onDragLeave={(e)=>{
      e.stopPropagation();
      this.handleOndragLeave(e,key)
    }}  draggable="true" >
          <span className={"iconfont "+(utils.iconArr[node.nameSpace]||"icon-ceng") } />
          {node.nameSpace}
          <span onClick={(e)=>{
            this.handleDelNode(e,key)
          }} className={"iconfont icon-delete"}></span >
          <span className={"iconfont icon-close"}></span >
        </div>
        {
          Array.isArray(node.children)&&node.children.length>0&&<ul>
            {
              node.children.map((v,i)=>{
                    return this.handleRender(v,key+"-"+i)
              })
            }
          </ul>
        }
    </li>
}
 
 
  render() {
    return (
        <div className="myLeft">
          <div className="myTitle">节点树</div>
          <ul>
            {
              this.handleRender(this.state.schema[0],"0")
            }
          </ul>
        </div>
       
    )
  }
}


