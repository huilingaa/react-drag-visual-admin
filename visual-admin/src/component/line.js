import React from 'react';
import { Chart } from '@antv/g2';
export default class App extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount(){
    this.handleRender()
  }
  //渲染引擎，渲染整个节点树
  handleRender = () => {
      if(this.component){
        let data=Array.isArray(this.props.data)?this.props.data:[];
        let obj={
          container: this.component,
          autoFit: true,
        };
        ["height","width"].forEach(v=>{
          if(this.props[v]){
            obj[v]=parseInt(this.props[v]);
          }
        })
        const chart = new Chart(obj);
        chart.data(data);
       
        // if(this.props.showTooltip){
        //   chart.tooltip({
        //     showMarkers: false,
        //     shared: true,
        //   });
        // }else{
        //   chart.tooltip(false);
        // }
        if(this.props.scale){
          chart.scale(this.props.scale, {
            nice: true,
          });
        }
        if(this.props.coord){
          chart.coord().transpose();
        }
        chart.line()
        .position(String(this.props.filedX)+"*"+String(this.props.filedY))
        .color(String(this.props.color))
        .adjust([
          {
            type: this.props.adjust?'dodge':"stack",
            marginRatio: 0,
          },
        ]);
        
        //   { name: 'London', 月份: 'Jan.', 月均降雨量: 18.9 },
        chart.interaction('element-highlight-by-x');
        chart.render();
      }
  }
  render() {
    return (
      <div ref={(component)=>{
        this.component=component
      }} onDragLeave={this.props.onDragLeave} data-drag={this.props["data-drag"]}  onDrop={this.props.onDrop} onDragOver={this.props.onDragOver} onMouseUp={this.props.onMouseUp} style={{width:this.props.width+"px"}}>
        
      </div>
    )
  }
}


