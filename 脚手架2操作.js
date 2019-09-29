

/**
 * 
 * 首先,去github上搜索:vue-cli
 * 然后:安装的是2版本
 *  npm install -g vue-cli
 * 
 * 下一步:下载webpack 模版
 *  vue init webpack my-project
 * 
 * npm run dev(或者nmp start)
 * 打包:
 * npm run build 后生成了一个dist目录
 * 打包后运行项目: serve dist 
 * 
 * config目录中,index.js中的可以直接修改项目运行后自动在浏览器中运行
 *  autoOpenBrowser: true,
 * 
 * 在build目录中,的wepack.base.conf.js中
 *  app: './src/main.js'  可以设置当前项目运行的入口的路径
 * static目录:一般放置的都是全局使用的资源文件,
 * 
 * dist目录,是打包后的目录
 * 
 * 
 * 
 * src是项目的入口目录
 * main.js是项目的入口文件
 * App.vue是该项目的父级组件文件
 * assets目录:放置的是图片
 * components:组件目录,普通的vue组件就会在这个文件中出现
 * 
 * 组件:就是一个.vue文件,里面有三种代码组成:html+cs+js
 * 组件有父级组件和子级组件的关系,兄弟组件关系
 * 
 * scoped:如果父级组件和子级组件的style标签中都没有这个属性,那么子级的样式会影响父级组件的样式
 * 
 * 
 * 1.自定义事件---需要使用$emit()进行分发---addItem事件
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * npm run dev-----相当于 npm start----这个比较多
 * npm run build 打包  产生了一个dist目录
 * serve dist---运行打包的文件
 * 
 * src
 * src1---找build目录中webpack.base.conf.js
 * src2
 * 
 * 
 * src目录:代码都在这个目录中书写,main.js文件
 * static目录:一般都是存放一些公共的文件---reset.css---
 * config目录:index.js文件中可以配置 运行后的项目(是否是自动的自动浏览器并运行)
 * build目录中,webpack.base.conf.js中有一个配置,可以改变运行的目录
 * 
 * src目录中有一个components目录,里面都是放组件
 * .vue文件就是一个组件文件,组件的名字一般都是大写的
 * 每个组件中都有三部分组件:1.html模版,2.js代码,3.css样式
 * 组件:多个功能组合的一个集合,
 * 模版中:只能有一个根标签(后面有多个根标签,但是是有条件的,v-if这么使用的)
 * js中:
 * name是描述当前这个组件的名字
 * 数据都在data这个函数中的return后面的对象中书写
 * 
 * style中:
 * scoped:范围,如果父级组件和子级组件中都没有这个属性,那么子级组件的样式有可能会影响父级组件
 * 
 * 父级组件和子级组件
 * 
 * App.vue是一个组件,相对于其他的组件而言,是一个父级组件
 * HelloWorld.vue是一个组件,相对于App.vue组件而言是子级组件
 * 
 * 引入组件import HelloWorld from './components/HelloWorld'
 * components 注册组件
 * <HelloWorld/> 使用这个组件,组件中都是html和css和js,无非就是封装起来了
 * 
 * 组件,组件化,模块,模块化---------
 * 
 */

 