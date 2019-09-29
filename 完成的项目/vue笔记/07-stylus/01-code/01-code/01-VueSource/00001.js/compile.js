function Compile(el, vm) {
    // 保存当前的vm实例对象
    this.$vm = vm;
    // 获取容器
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    // 判断当前的容器是否存在
    if (this.$el) {
        // 创建文档碎片对象
        this.$fragment = this.node2Fragment(this.$el);
        // 进行初始化
        this.init();
        // 把文档碎片添加到容器中
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    constructor: Compile,
    node2Fragment: function(el) {
        // 创建文档碎片
        var fragment = document.createDocumentFragment(),
            child;

        // 将原生节点拷贝到fragment
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        // 返回文档碎片对象
        return fragment;
    },

    init: function() {
        // 初始化文档碎片中的节点
        this.compileElement(this.$fragment);
    },

    compileElement: function(el) {
        // 获取文档碎片中的所有子节点
        var childNodes = el.childNodes,
            me = this;// 保存当前的编译对象

            // 遍历每个节点
        [].slice.call(childNodes).forEach(function(node) {
            // 获取当前节点中的文本内容
            var text = node.textContent;
            // 插值的正则
            var reg = /\{\{(.*)\}\}/;

            // 判断当前的节点是不是标签
            if (me.isElementNode(node)) {
                // 如果是标签
                me.compile(node);
                // 判断当前的节点是不是文本节点,并且这个节点中的文本是不是插值
            } else if (me.isTextNode(node) && reg.test(text)) {
                // 传入当前节点及插值的第一组
                me.compileText(node, RegExp.$1.trim());
            }
            // 判断当前的节点是不是有子节点,并且如果有子节点,就递归调用
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    },

    compile: function(node) {
        // 此时node是标签节点,
        // 获取当前标签下的所有的属性
        var nodeAttrs = node.attributes,
            me = this;// 保存当前的编译对象
        // 遍历标签里所有的属性
        [].slice.call(nodeAttrs).forEach(function(attr) {
            // 获取属性的名字
            var attrName = attr.name;
            // 判断当前的属性是不是指令,v-开头就是指令属性
            if (me.isDirective(attrName)) {
                // 获取属性值
                var exp = attr.value;
                // 干掉v-开头,得到v-后面的属性名字
                var dir = attrName.substring(2);
                // 事件指令--判断当前的指令是不是事件指令
                if (me.isEventDirective(dir)) {
                    // 事件指令,传入当前的节点,传入vm实例对象,正则,属性名字
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                    // 普通指令
                } else {
                    // 普通属性,传入属性名字
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }
                // 操作后要移除当前节点上的所有的指令的属性
                node.removeAttribute(attrName);
            }
        });
    },

    compileText: function(node, exp) {
        // 把文本节点及vm实例对象和正则传入进去
        compileUtil.text(node, this.$vm, exp);
    },
    // 判断当前的属性是不是Vue的指令属性
    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },
    // 判断当前的指令是不是事件指令
    isEventDirective: function(dir) {
        return dir.indexOf('on') === 0;
    },
    // 判断当前的节点是不是标签节点
    isElementNode: function(node) {
        return node.nodeType == 1;
    },
    // 判断该当前的节点是不是文本节点
    isTextNode: function(node) {
        return node.nodeType == 3;
    }
};

// 指令处理集合
var compileUtil = {
    // 获取当前的文本节点及vm实例对象和正则
    // v-text指令,更新数据
    text: function(node, vm, exp) {
        // 并且传入text
        this.bind(node, vm, exp, 'text');
    },
    // v-html指令,更新数据
    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },
    // v-model指令,更新数据
    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model');
        // 保存当前的编译对象
        var me = this,
            // 获取当前属性的值
            val = this._getVMVal(vm, exp);
            // 为当前节点绑定input事件
        node.addEventListener('input', function(e) {
            // 获取触发该事件的事件源对象的value值
            var newValue = e.target.value;
            // 判断vm中属性的值和当前表单标签的value属性值是否一致,一致则返回,没必要更新
            if (val === newValue) {
                return;
            }  
             // 如果值不同则更新数据操作,设置
            me._setVMVal(vm, exp, newValue);
            // 把新的value值赋值给vm的属性
            val = newValue;
        });
    },
    // v-class指令,更新样式
    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },

    bind: function(node, vm, exp, dir) {
        // 更新节点操作
        var updaterFn = updater[dir + 'Updater'];
        // 当前的方法存在,并调用,传入节点,当前的vm实例对象和正则表达式
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));
        // 只要进入到bing中就会添加一个监视器
        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },

    // 事件处理---绑定事件
    eventHandler: function(node, vm, exp, dir) {
        // 干掉:并且获取事件的类型click,找到vm中methods中的方法及对应的回调函数,保存到fn中
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];
        // 事件存在并且回调函数也存在
        if (eventType && fn) {
            // 为当前的节点绑定事件,并且fn的回调函数的this是vm实例对象,冒泡阶段
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    // 根据vm实例对象及正则表达式获取vm下当前这个属性值
    _getVMVal: function(vm, exp) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    },

    _setVMVal: function(vm, exp, value) {
        var val = vm;
        // 获取正则中的表达式
        exp = exp.split('.');
        // 更新操作
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
    // innerText和v-text的操作,把节点及vm下属性值传入进来
    textUpdater: function(node, value) {
        // 对象当前的节点中间文本内容进行替换
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    // innerHTML或者v-html更新
    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },
    // 更新样式
    classUpdater: function(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },
    // v-model的更新
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
};