import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getTimeStamp } from '@/utils/auth'
import router from "@/router";

// 创建一个axios的实例
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理 
  // 如果执行 npm run build 值为 /prod-api    运维在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000, //定义5秒超时
});

//请求拦截器
service.interceptors.request.use(config => {
  //config是请求的配置信息
  //注入token
  if (store.getters.token) {
    // 只有再有token的情况下，才有必要去检查时间戳是否超时
    if (isTimeOut()) {
      //如果为true，表示过期
      store.dispatch('user/logout') //登出操作
      router.push('/login')
      return Promise.reject(new Error('登录已超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config   //必须要返回 否则很容易出错

}, error => {
  return Promise.reject(error)
});

//响应拦截器
service.interceptors.response.use(
  (response) => {
    //axios默认添加一层data，所以要从response.data结构
    const { data, success, message } = response.data;

    //根据success的成功与否决定下面的操作
    if (success) {

      return data
    } else {
      //提示错误消息     业务已经错误了，不能进then，应该catch
      console.log(message);
      Message.error(message)
      return Promise.reject(new Error('message'))
    }
  },
  (error) => {
    //error 信息里面会有response的对象
    console.log(error);
    if (error && error.response && error.response.data.code === 10002) {
      store.dispatch('user/logout') //登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message); //提示错误信息
    }
    return Promise.reject(error); //返回执行错误，让当前的执行链跳出成功，直接进入catch
  }
);

//定义超时逻辑
const TimeOut = 3600; //定义超时时间
function isTimeOut() {
  let currentTime = Date.now() //当前时间戳
  let timeStamp = getTimeStamp() //缓存好的时间戳
  // console.log(currentTime);
  // console.log(timeStame);
  // console.log((currentTime - timeStame) / 1000);
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service;
