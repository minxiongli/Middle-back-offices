//权限拦截在路由跳转   导航守卫

// 不需要导出，因为只需要让代码执行即可，不需要使用其中的变量
import router from '@/router'
import store from '@/store'   //引入stroe实例，和组件中的this.$store是一回事
import nprogress from 'nprogress' // 引入进度条插件
import 'nprogress/nprogress.css' // 引入css

//定义白名单
const whiteList = ['/login', '/404']
//前置守卫
//next是前置守卫必须执行的钩子，如果不执行，页面就死了
// next()  放过
// next(false) 跳转中止
// next(address) 跳转到某个地址
router.beforeEach(async (to, from, next) => {
    nprogress.start() //开启进度条
    if (store.getters.token) {
        //如果有token
        if (to.path === '/login') {
            //如果访问的是登录页 则跳到主页
            next('/')
        } else {
            //在这里做一个判断，如果vuex中有用户资料的id表示已经有资料了 如果没有才需要获取
            if (!store.getters.userId) {
                //如果没有id表示当前用户没有获取过
                await store.dispatch('user/getUserInfo')
                //如果用后续 需要根据用户资料获取数据，这里必须改成同步,
            }
            next()
        }
    } else {
        //没有token的情况下 //判断是否有白名单
        if (whiteList.indexOf(to.path) > -1) {
            next();
        } else {
            next('/login')
        }
    }
    nprogress.done() //关闭进度条
})


// 后置守卫
router.afterEach(() => {
    nprogress.done() //关闭进度条
})



