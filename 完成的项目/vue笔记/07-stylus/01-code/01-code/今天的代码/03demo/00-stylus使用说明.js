/**
 * 三者之间的区别(详情看01-三者之间的区别.html)
 * less： 标准的css语法 ，有花括号和冒号
 * h1 {
 * color: red;
 *}
 * sass： 当然也可以写成上面那样 同时也可以不写花括号
 * h1
 * color: red
 * 
 * stylus： 花括号和冒号都可以不写 比较自由
 * h1
 * color red
 * ================================================
 * stylus 的使用
 * ====================================
 * 全局安装stylus 
 * npm install -g stylus
 * stylus -h 获取相关的所有的命令
 * 在相应的目录中创建一个文件夹
 * 我在当前的01-code 文件中创建一个demo目录
 * demo 目录
 *   创建一个demo.html文件
 *   创建一个demo.styl文件
 *   创建一个css目录
 *   执行下面的命令
 *   -w 监视
 *   -o 把编译后的css文件输出到指令的目录中
 *   
 * 编写styl 文件,自动监视该文件,并且在指令目录下生成对应的css文件
 * stylus -w demo.styl -o dist
 * 
 *  直接在styl文件中书写代码即可
 * 
 *  在vue的脚手架中如何安装stylus 
 *  npm install stylus stylus-loader --save-dev
 * 
 *  npm get prefix  该命令 可以获取全局安装的目录
 * 
 * ====================================================================================
 * 首选项：直接修改tab键缩进
 * Editor: Tab Size
 * 一个制表符等于的空格数。在 Editor: Detect Indentation 启用时，根据文件内容，该设置可能会被覆盖。
 * ========================================================================================
 * stylus 中可以定义变量
 * styl文件中
 * font-size=14px
 * $font=font-size "宋体"
 * .app
 *   font $font
 * ===========================================
 * 导入:其他的css
 * @import "reset.css"
 * 
 * ==================================
 * 常用混合(见:相关资料目录中的stylus目录中的mixins.styl文件)
 * =========================================================================
 * Mixins：Mixins是预处器中的函数。平时你在写样式时某段CSS样式要经常重复性的用到多个元素中，这样你就需要重复的写多次。在CSS预处器中，你可以为*这些公用的CSS样式定义一个Mixin，然后在你CSS需要使用这些样式的地方直接调用你定义好的Mixin。这是一个非常有用的特性。Mixins是一个公认的选择器，还可以在Mixins中定义变量或者是默认参数
 * DPR：
 *　设备像素比DPR(devicePixelRatio)是默认缩放为100%的情况下，设备像素和CSS像素的比值
 * DPR = 设备像素 / CSS像素(某一方向上)
 * 
 * 
 * 
 * 
 */

  

