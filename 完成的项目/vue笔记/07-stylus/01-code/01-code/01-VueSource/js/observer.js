function Observer(data) {
    // 保存vm.data对象,保存到了劫持对象的data属性中
    this.data = data;
    // 开始走
    this.walk(data);
}

Observer.prototype = {
    constructor: Observer,
    walk: function(data) {//vm下的data
        // 劫持对象
        var me = this;
        // 获取vm下的data对象中所有的属性,遍历所有的属性
        Object.keys(data).forEach(function(key) {
            // data中的属性和值一起传入到
            me.convert(key, data[key]);
        });
    },
    convert: function(key, val) {
        // vm中的data对象, 属性,值
        this.defineReactive(this.data, key, val);
    },

    defineReactive: function(data, key, val) {
        // 产生了Dep实例对象
        var dep = new Dep();
        // key--msg属性,val-----msg属性中的字符串值
        // key---car,val---{name:'宝马'}
        var childObj = observe(val);
        // 遍历劫持对象中的data对象中所有的属性,为当前的的data重新的添加尚需经,重写get和set方法(如果mvvm中的set和get一旦调用,就会进入到对应的get和set方法)---劫持对象中data和vm中的data是有关系的
        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function() {
                // 如果一旦获取了data中的属性的时候,就会进入到这里,判断,是否有watcher对象
                if (Dep.target) {
                    // 把watcher对象添加到对应dep的subs数组中
                    dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                // 界面中如果一旦修改了相关的数据(data中的属性)
                if (newVal === val) {
                    return;
                }
                // 新值和原来的值不一样
                val = newVal;
                // 新的值是object的话，进行监听
                // 判断新的值是不是对象(如果是对象,就是为对象中每个属性添加dep对象,也会产生对应watcher)
                childObj = observe(newVal);
                // 通知订阅者-
                // 通知watcher开始更新数据
                dep.notify();
            }
        });
    }
};

function observe(value, vm) {
    // 如果value是空或者value不是个对象,就return
    //value=="<a></a>"
    if (!value || typeof value !== 'object') {
        return;
    }
    // value是对象
    // 产生了一个劫持的实例对象,并且传入data对象(vm.data)
    return new Observer(value);
};


var uid = 0;

function Dep() {
    // dep的id唯一的标识
    this.id = uid++;
    // 存放对应的watcher对象的
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },

    depend: function() {
        // 先把dep对象添加到wathcer对象中(depIds={dep的id:当前的dep})
        Dep.target.addDep(this);
    },

    removeSub: function(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },
    // 通知watcher开始更新数据
    notify: function() {
        // 遍历当前的这个dep中的subs数组(该数组中存储的就是watcher对象)
        this.subs.forEach(function(sub) {
            // watcher对象开始更新数据
            sub.update();
        });
    }
};

Dep.target = null;