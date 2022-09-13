//员工的路由规则
import layout from '@/layout'

export default {
    //路由规则
    path:'/permission', //路由地址
    name:'',   //给模块一级路由加一个name属性， 这个属性我们后面会在做权限的时候用到
    component:layout,
    children:[{
        // 二级路由的path什么都不写的时候，表示二级路由的默认路由
        path:'', //这里不写   什么都不写表示 /permission 不但有布局layout 还有员工主页
        component:()=> import('@/views/permission'),
        // 路由元信息，其实就是一个存储数据的地方，可以存放任意内容
        meta:{
            title:'权限管理',  //为什么要用title 因为左侧导航读取了这里的title属性
            icon: 'lock',
        }
    }]
}