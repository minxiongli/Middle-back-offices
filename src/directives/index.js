//管理所有自定义指令

export const imagerror = {
    inserted(dom,options){
        //dom是表示指令作用的对象
        //options是指令中变量的解释
        //其中有一个属性叫value
        dom.onerror=function(){
            //当图片出现异常的时候，会将指令配置的默认图片设置为该图片的内容。
            dom.src = options.value //此处不能写死
        }
    }
}