http://learn.fuming.site/front-end/CSS%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8/

# Less

## 1 less编译器
### 1.1 less.js
```
当页面运行的时候，现场把less编译成 css

运行时编译
```

### 1.2 考拉编译
```
提前把 less 编译成 css
html直接引入 css

写 less 的时候编译
```


### 1.3 node 编译


## 2 less 的变量
### 2.1 变量的定义
```
@变量名：值;
```

### 2.2 变量的使用
```
作为属性值去使用（最常见）
@变量名

作为选择器或者属性名取用
@{变量名}

```


### 2.3 变量的作用域
```
.box {
    li {
        @var:1;
        width: @var;  // 2
        @var:2;
    }
}

先从本作用域找，没有去上层作用域找
统一作用域下，变量定了两次，后面会覆盖前面（提升）
```

### 2.4 哪些东西需要定义成变量
```
1. 网站配色 的 颜色
2. 常见的字体大小
3. 媒体查询的阈值
```


## 3 less 的注释
```less
/* css注释 less也可以用  编译成css后依然存在*/

// less 注释  编译成css后不显示了
```


## 4 混合
### 4.1 普通混合
```less
//跟类选择器是一样的 会在css输出
.my-mixin {

}
```

### 4.2 不会输出的混合
```
// 不会输出在 css 中
.my-mixin() {

}

.my-mixin();
.my-mixin;  //混合没有参数，省略 ()

```

### 4.3 带参数的混合
```less
.my-mixin(@width, @height) {

}
```

### 4.4 参数有默认值  有默认值的参数在后面
```less
.my-mixin(@width, @height:100px, @color:gray) {

}

.my-mixin(100px);  //按照顺序给参数赋值，没有赋值的参数使用默认值，赋值就用赋的值

```


### 4.5 参数有默认值  有默认值的参数在任意位置
```less
.my-mixin(@width:100px, @height,  @color:gray) {

}

// 调用的时候 指定参数名
.my-mixin(@height:10000px);

```


### @arguments  获取所有参数
```css
.my-mixin(@a, @b, @c, @d, @e) {
    property: @arguments;
}
```
```
特殊情况： 调用混合的时候，参数之间可以用逗号隔开，也可用分号隔开
一般用逗号，某个参数的值里面包含了逗号，请使用分号去分隔参数

```


### 使用混合的场景
```
1. 页面中常见的小组件 （按钮，边框，背景）
2. 某些带私有前缀的CSS属性 （后面自动化工具）
```


## 4 less的条件判断
写多个混合 配合关键字 when
```less
    .arrow(@a, @b, #c) when (@a=vlaue1) {
    
    }
    .arrow(@a, @b, #c) when (@a=vlaue2) {
        
    }
    .arrow(@a, @b, #c) when (@a=vlaue3) {
        
    }
        

```


## 5 less 导入
```
页面样式拆分成很多个 less
通常 会把混合 单独写 less 文件
把定义变量的部分单独写 less 文件

@import 'base'  
导入less文件，可以省略 后缀


```


## 6 less 嵌套
```
#box {
    li {
        a {
        
        }
        
        &:nth-child(1) {
        
        }
    }
    
    >span {
        
    }
    
    &:hover {
    
    }
}

```


**@media 嵌套**
```
@media screen {
    @media (min-width: 768px) {
    
    }
}

```

```less
.box {
  background:red;
  
  @media (max-width: 1000px) {
    background: green;
  }

}
```

## 7 less 操作符
```
less 中可以进行 + - * /
两个操作数，都有单位，按照前面操作数的单位，后面操作数的单位忽略
前面的操作数没有单位，才能按照后面操作的单位

```


## 8 less 函数
```
类似于javaScript的内置函数
```


## 9 map
```less
#map {
    p1:value1;
    p2:value2;
}

.box {
    color: #map[p1]
}

```



## 10 node 编译 less
```
1. 安装node
双击安装
在安装node的时候回同时安装 npm (包管理工具)

2. 验证是否安装成功
在命令行 运行 node -v /  npm -v

3. 安装 less 编译工具
在命令行  npm install less -g

4. 判断 less 编译工具是否安装成功
在命令行  lessc -v


5. webstorme 设置自动编译 less
File->Setting->Tolls->FileWatchers 

选择 + ， 选择less  选择 lessc位置（自动选择的）


```
