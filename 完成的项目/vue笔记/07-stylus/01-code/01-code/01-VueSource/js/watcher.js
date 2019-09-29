function Watcher(vm, expOrFn, cb) {
    // 保存传入进来的回调函数-----涉及到当前的数据是否更新
    this.cb = cb;
    // vm的实例对象
    this.vm = vm;
    // 表达式(页面中的模版中的表达式,html标签中用到的表达式)
    this.expOrFn = expOrFn;
    // 存储dep对象(以键值对的方式,dep的id及对应的dep对象)
    this.depIds = {};
    // 判读表达式是不是函数
    if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
    } else {
        // this.getter中最终存储的是一个回调函数(该回调函数是获取表达式的值的)
        this.getter = this.parseGetter(expOrFn.trim());
    }
    // 调用表达式的get方法
    this.value = this.get();
}

Watcher.prototype = {
    constructor: Watcher,
    update: function() {
        this.run();
    },
    // 更新数据的
    run: function() {
        var value = this.get();
        var oldVal = this.value;
        // 判断表达式的新值和旧值是否一致
        if (value !== oldVal) {
            this.value = value;
            // 如果不一致,才开始更新数据,调用的就是上面存储的回调函数(该回调函数就是compile中的updater对象中相关指令的方法)
            this.cb.call(this.vm, value, oldVal);
        }
    },
    // ===============================重点=======dep和watcher建立关系的
    addDep: function(dep) {
        // watcher要判断,depIds对象中是否已经有了对应的dep,如果没有才添加
        if (!this.depIds.hasOwnProperty(dep.id)) {
            // 真正的,watcher对象添加到当前dep中
            dep.addSub(this);
            // 真正的dep添加到watcher对象中
            this.depIds[dep.id] = dep;
            // 关系建立
        }
    },
    get: function() {
        // 把watcher对象存储到了dep的target属性中
        Dep.target = this;
        // 调用的是表达式的get方法----可以获取该表达式的值
        var value = this.getter.call(this.vm, this.vm);
        Dep.target = null;
        return value;
    },
    // 表达式的get的方法对应的操作
    parseGetter: function(exp) {
        if (/[^\w.$]/.test(exp)) return; 

        var exps = exp.split('.');

        return function(obj) {
            for (var i = 0, len = exps.length; i < len; i++) {
                if (!obj) return;
                // 是获取属性的值(表达式的值),如果执行到这里,就意味着,要进入到mvvm的get方法,也会进入到observer中的get---开始建立关系了
                obj = obj[exps[i]];
            }
            return obj;
        }
    }
};