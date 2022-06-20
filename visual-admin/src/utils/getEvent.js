export default function (type){
    let obj={
        "form":["onFinish"],
        "pagination":["onChange"],
        "modla":["onOk","onCancel","onClose"]
    }
    return obj[type];
}