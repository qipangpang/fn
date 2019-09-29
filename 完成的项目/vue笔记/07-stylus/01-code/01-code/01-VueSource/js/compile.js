function Compile(el, vm) {
    // 保存了vm实例对象到$vm中
    this.$vm = vm;
    // 根据el的选择器获取对应的容器
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    // 判断当前的容器是否存在
    if (this.$el) {
        // 创建文档碎片对象
        this.$fragment = this.node2Fragment(this.$el);
        // 初始化碎片文档中的节点,插值替换,指令的替换,事件的绑定...
        this.init();
        // 把初始化后的文档碎片对象加入到容器中
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    constructor: Compile,
    node2Fragment: function(el) {// 把容器中的所有的子节点全部加到文档碎对象中
        // 创建文档碎片对象 
        var fragment = document.createDocumentFragment(),
            child;

        // 把所有的子节点全部加入到文档碎片对象中
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        // 返回文档碎片对象
        return fragment;
    },
    // 初始化操作
    init: function() {
        // 真正的操作
        this.compileElement(this.$fragment);
    },
    // 编译元素---初始化操作
    compileElement: function(el) {
        // el---文档碎片对象
        var childNodes = el.childNodes,
            me = this;// 把编译对象进行缓存
        // 遍历文档碎片对象中所有的子节点
        [].slice.call(childNodes).forEach(function(node) {
            // 获取当前节点中间的文本内容
            var text = node.textContent;
            // 插值的正则表达式
            var reg = /\{\{(.*)\}\}/;
            // 判断当前的节点是不是一个标签
            if (me.isElementNode(node)) {
                me.compile(node);
                // 判断的是当前的节点是不是文本节点,并且这个节点和插值正则是否匹配
            } else if (me.isTextNode(node) && reg.test(text)) {
                // 进行替换----传入的是文本节点及提取出来的插值正则的第一组msg
                // node---{{msg}},$1---msg
                me.compileText(node, RegExp.$1.trim());
            }
            // 判断当前的节点有没有子节点
            if (node.childNodes && node.childNodes.length) {
                // 递归操作,如果这个节点中还有子节点,就递归
                // <p>{{msg}}</p>
                me.compileElement(node);
            }
        });
    },

    compile: function(node) {
        // node---button
        // 获取标签中所有的属性
        var nodeAttrs = node.attributes,
            me = this;// 保存当前编译对象

            // 遍历当前节点中所有的属性
        [].slice.call(nodeAttrs).forEach(function(attr) {
            // 获取属性的名字-------    v-on:click="showName"
            var attrName = attr.name; //attrName="v-on:click"
            // 判读当前的属性是不是一个指令属性
            if (me.isDirective(attrName)) {
                // 获取属性的值----showName
                var exp = attr.value;
                //  dir="on:click"----截取的操作
                var dir = attrName.substring(2);
                // 是不是一个事件指令
                if (me.isEventDirective(dir)) {
                    // 对节点的事件进行绑定:node---button,exp====showName,dir---on:click
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                    // 普通指令
                } else {
                    //  当前的指令是一个普通指令
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }

                // 干掉当前的节点上的属性和值,
                // <button v-on:click="showName" >按钮</button>

                node.removeAttribute(attrName);
                // <button>按钮</button> 此时button是已经绑定了事件
            }
        });
    },
    // 编译文本-----暂时:{{msg}}---msg
    compileText: function(node, exp) {
        // 传入的是插值的文本节点,和vm实例对象和exp---msg
        compileUtil.text(node, this.$vm, exp);
    },
    // 判断当前的属性是不是一个指令
    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },
    // 判读当前的指令是不是一个事件指令
    isEventDirective: function(dir) {
        return dir.indexOf('on') === 0;
    },
    // 判断当前的节点是不是标签
    isElementNode: function(node) {
        return node.nodeType == 1;
    },
    // 判断当前的节点是不是文本节点
    isTextNode: function(node) {
        return node.nodeType == 3;
    }
};

// 指令处理集合
var compileUtil = {
    // v-text的指令处理----{{msg}}也可以使用
    // v-text和innerText是一样,innerText就可以获取到{{msg}}
    text: function(node, vm, exp) {
        // 绑定,把文本节点({{msg}})--vm---实例对象,exp---msg---'text'
        this.bind(node, vm, exp, 'text');
    },
    // v-html的指令操作
    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },
    // v-model指令的操作
    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var me = this,
            val = this._getVMVal(vm, exp);
            // 为当前的表单绑定对应的input事件,该事件对应了下面的这个匿名回调函数,如果数据改变,就会调用该函数
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            // 设置数据的值------------找到对应的dep,通知对应watcher对象,就会开始更新updater对象中相关的方法
            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },
    // v-class指令的操作
    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },
    bind: function(node, vm, exp, dir) {
        // node---{{msg}},vm---实例对象,exp---msg,---dir---'tet'
        // updaterFn是一个函数---updater['textUpdater']--->updater.textUpdater
        var updaterFn = updater[dir + 'Updater'];
        // 判断当前的函数是否存在,如果存在则调用,vm.msg---->msg的值
        // 调用函数updaterFn,并传入{{msg}}和msg的值:abc
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        // 监视---最后再说
        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },
    // 事件处理
    eventHandler: function(node, vm, exp, dir) {
        // click
        var eventType = dir.split(':')[1],
        // 通过vm实例对象找到methods对象中showName的这个方法
        // fn---showName方法
            fn = vm.$options.methods && vm.$options.methods[exp];
        // 判断click和showName回调是否存在
        if (eventType && fn) {
            // 为button按钮绑定click的事件,回调函数就是showName
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },
    // 获取vm下的某个属性的值
    _getVMVal: function(vm, exp) {
        var val = vm;
        // exp---msg
        // <p>{{car.name}}</p>
        // exp--car.name
        exp = exp.split('.');
        // exp====>[car,name]
        exp.forEach(function(k) {
            // val---vm实例对象//vm[car]:{name:'哈哈'}------vm[name]
            //vm.car---get操作
            // val====={name:'哈哈'}
            val = val[k];
            
        });
        return val;
    },

    _setVMVal: function(vm, exp, value) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }
};


var updater = {
    textUpdater: function(node, value) {
        //node---{{msg}},value====='abc'
        // 把插值{{msg}}---直接替换成了abc
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    // v-html这个指令替换的操作
    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },
    // v-class的替换
    classUpdater: function(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },
    // v-model的替换
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
};
