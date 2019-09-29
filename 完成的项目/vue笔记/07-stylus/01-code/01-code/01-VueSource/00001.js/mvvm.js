function MVVM(options) {
    // 把传入进来的配置对象保存到this.$options属性中
    this.$options = options || {};
    // 把data中的数据保存到_data属性中,并且保存到局部变量data中
    var data = this._data = this.$options.data;
    // 把实例对象this保存到变量me中
    var me = this;
    // vm实例对象在me中,data在_data和data变量中

    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    // 数据代理的实现,遍历data中所有的属性,并且调用实例对象的_proxyData代理方法,把属性传进去
    Object.keys(data).forEach(function(key) {
        me._proxyData(key);
    });

    // 初始化操作
    this._initComputed();
    // 劫持啊哦做
    observe(data, this);
    // 编译操作
    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    constructor: MVVM,
    $watch: function(key, cb, options) {
        new Watcher(this, key, cb);
    },
    // 传入属性及set操作和get操作
    _proxyData: function(key, setter, getter) {
        // 保存当前的实例对象到me中
        var me = this;
        setter = setter || 
        // 为实例对象添加属性,把每个属性添加到实例对象上
        Object.defineProperty(me, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {// 此时函数有名字
                // 把每个属性值获取并返回给实例对象下当前属性中
                return me._data[key];
            },

            set: function proxySetter(newVal) {
                // 设置实例对象下每个属性的值,以后修改属性值,都会自动的修改到_data下的属性
                me._data[key] = newVal;
            }
        });
    },

    // 计算属性操作,
    _initComputed: function() {
        var me = this;
        var computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function' 
                            ? computed[key] 
                            : computed[key].get,
                    set: function() {}
                });
            });
        }
    }
};