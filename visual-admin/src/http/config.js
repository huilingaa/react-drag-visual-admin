import axios from 'axios'
import Qs from 'qs'
let httpCount = 0;

// 超时时间
axios.defaults.timeout = 30000
axios.defaults.baseURL = 'http://localhost:7001/?userId=1';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-hoc-urlencoded'

// 请求时的拦截
axios.interceptors.request.use(function (config) {
    config.noHttpLoading = config.data ? config.data.noHttpLoading : config.noHttpLoading;
    config.cancelToken = config.data ? config.data.cancelToken : config.cancelToken;
    if (!config.noHttpLoading) {
        httpadd();
    }
    if (config.method === 'post') {
        if (config.data.type === 'upload') {
            config.timeout = 30000;
            config.data = config.data.params;
        } else {
            codeMsg(config.data.params);
            config.data = Qs.stringify(config.data.params)
        }
    } else if (config.method === 'get') {
        codeMsg(config.params);
    }
    return config
}, function (error) {
    if(!navigator.onLine){
       alert("没有网络")
    } else {
        alert("请求失败")
    }
    return Promise.reject(error)
})

// 响应时拦截
axios.interceptors.response.use(function (response) {
    if (!response.config.noHttpLoading) {
        httpsub()
    }
    if (response.data.errCode === 1002) {
        window.global.$toast({
            message: '响应超时',
            position: 'center',
            duration: 1500
        });
        return Promise.reject(response.data.Message);
    }

    if (response.data.errCode === 1001) {  //状态是1001
        window.global.$toast({
            message: response.data.info,
            position: 'center',
            duration: 1500
        });
        return Promise.reject(response.data);
    }
    if (response.data.errCode === 1004) {   //授权验证失败。需要清除cookie，跳转到登录页
        window.global.$toast({
            message: response.data.info,
            position: 'center',
            duration: 1500
        });
        window.window.global.$store.commit('updateLastRouter', {to:{path:'/UserAccount',fullPath:'/UserAccount'},from:{path:'/UserAccount',fullPath:'/UserAccount'}});  //存下路由信息
        window.window.global.$router.replace("/UserAccount/login");
        return Promise.reject("未登录");
    }
    

    if(response.data.errCode === 2009){
        window.window.global.$messagebox.alert("账号异常，请尝试刷新").then(() => {
            // this.$messagebox.alert("功能未开放");
            window.window.global.$store.commit('updateLastRouter', {to:{path:'/UserAccount',fullPath:'/UserAccount'},from:{path:'/UserAccount',fullPath:'/UserAccount'}});  //存下路由信息
            window.window.global.$store.commit('TOKEN_CLEAR');//清除个人token
            window.window.global.$store.commit('USER_CLEAR');//清除个人信息
            window.window.global.$store.commit('USER_SET_NEW_USER', 'true'); // 设置默认为true，  true代表游客的字段
            window.window.global.$router.replace("/error/ini");
        });
    }


    if (response.data.Result === 1000) {
        return response.data
    }
    else {
        return response.data
    }
}, function (error) {
    httpsub();
    if(!navigator.onLine){
        alert("请求失败")
    } else {
        alert("请求失败")
    }
    return Promise.reject(error)
})

function httpadd() {
    httpCount++;
}

function httpsub() {
    httpCount--;
    if (httpCount <= 0) {
        httpCount = 0;
    }
}

/******加密注销*******/
function codeMsg(params){
//     if(window.cookie.getCookie().key){
//         params.token=window.cookie.getCookie().key?window.cookie.getCookie().key:'';
//     }
}


export default axios
