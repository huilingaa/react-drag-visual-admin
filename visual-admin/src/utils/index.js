/*
 *防抖函数，用以用户输入减少渲染次数
 */
const deounce = (func, time) => {
  let timmer = null;
  return function (...args) {
    if (timmer) {
      clearTimeout(timmer);
    }
    timmer = setTimeout(() => {
      func.apply(this, args);
    }, time)
  }
}
/*
 *获取树形结构的某一个节点项  根据传入的key  并且在当前树中，删除该对象
 *param  arr当前节点树 keyArr[0,1] ，
 */
const getSchemaTargetByKey = (arr, keyArr) => {
  if (keyArr.length === 1) {
    return arr.splice(keyArr[0], 1)[0];
  }
  return getSchemaTargetByKey(arr[keyArr[0]].children, keyArr.slice(1))
}
/*
 *插入树形位置
 *param  arr当前节点树 keyArr[0,1] 需要插入的对象，需要插入的位置，是前面还是里面，还是中间  参数select，beforeSelect，afterSelect
 */
const inserObj = (arr, keyArr, obj, position) => {
  if (keyArr.length === 1 && position === "select") {
    return arr[keyArr[0]].children.push(obj);
  }
  if (keyArr.length === 2 && position !== "select") {
    if (position === "beforeSelect") {
      let arrDelete = arr[keyArr[0]].children.splice(parseInt(keyArr[1]), 1);
      console.log(arrDelete, "arrDelete")
      return arr[keyArr[0]].children.splice(parseInt(keyArr[1]), 0, obj, arrDelete[0]);
    } else {
      return arr[keyArr[0]].children.splice(parseInt(keyArr[1]) + 1, 0, obj);

    }
  }
  return inserObj(arr[keyArr[0]].children, keyArr.slice(1), obj, position)
}
/*
 *获取当前dom距离左侧的距离，树形结构计算位置
 */
const getOffsetTop = (node) => {
  if ((!node) || node === window.document) {
    return 0
  }
  return node.offsetTop + getOffsetTop(node.offsetParent)
}
/*
 *获取当前dom距离左侧的距离，用以画布计算  位置
 */
const getOffsetLeft = (node) => {
  if ((!node) || node === window.document) {
    return 0
  }
  return node.offsetLeft + getOffsetLeft(node.offsetParent)
}
/*
*判断是否是一个对象
*/
const isObject=(obj)=>{
  return  (typeof obj==="object")&&obj!==null;
}
/*
 *深copy函数，用以树形结构的当前子节点的copy 
 */
const deepCopy = (obj, hash = new WeakMap()) => {
  if(!isObject(obj)){
    throw Error("不是一个对象")
  }
  if (hash.has(obj)) return hash.get(obj);
  let newObj=Array.isArray(obj)?[]:{};
  hash.set(obj,newObj);
  Object.keys(obj).forEach(v=>{
    if(isObject(obj[v])){
      newObj[v]=deepCopy(obj[v],hash)
    }else{
      newObj[v]=obj[v];
    }
  })
  return newObj
}
/*
 *替换树形结构某一项
 */
const replaceObj = (arr, keyArr, obj) => {
  if (keyArr.length === 1) {
    return arr[keyArr[0]] = obj;
  }
  return replaceObj(arr[keyArr[0]].children, keyArr.slice(1), obj)
}
/*
 *获取页面参数
 */
const getQueryParam = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}
const iconArr = {
  "page": "icon-page",
  "text": "icon-font",
  "img": "icon-pic",
  "column": "icon-pic",
  "line": "icon-pic",
  "select": "icon-font",
  "input": "icon-font",
  "button": "icon-font",
  "pagination": "icon-font"
}

export default {
  deounce: deounce,//防抖函数
  getSchemaTargetByKey: getSchemaTargetByKey,//找到schema里面的key的组件
  inserObj,//往schema组件的固定key位置里面，插入一个组件
  getOffsetTop,//根据当前节点，找到距离顶部的位置
  getOffsetLeft,//根据当前节点，找到左侧位置
  deepCopy,
  replaceObj, iconArr,
  getQueryParam,
  isObject
}