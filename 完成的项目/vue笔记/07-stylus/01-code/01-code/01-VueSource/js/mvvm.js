// 实例化MVVM对象的时候进来
function MVVM(options) {
    // 把实例化vm的时候的配置对象进行保存,options中是:{el:'#app',data:{}}
    this.$options = options || {};
    // 把vm对象中的data对象保存到_data属性中和data变量中
    var data = this._data = this.$options.data;
    // 保存的是当前的vm实例对象
    var me = this;

    // 获取data对象中所有的属性,并进行遍历
    Object.keys(data).forEach(function(key) {
        // 实现数据代理
        me._proxyData(key);
    });
    // 初始化计算属性
    this._initComputed();
    // 最后分析-====================================劫持
    // 初始化之前先劫持,把data对象和vm实例对象传入
    observe(data, this);
    // vm实例对象下的一个属性$compile存储了一个编译对象
    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    constructor: MVVM,
    $watch: function(key, cb, options) {
        new Watcher(this, key, cb);
    },
    // 实现数据代理的代码
    _proxyData: function(key, setter, getter) {
        // key---就是data中的每个属性
        // 缓存vm实例对象
        var me = this;
        setter = setter || 
        Object.defineProperty(me, key, {
            // 为vm实例对象添加msg这个属性
            configurable: false,// 
            enumerable: true,
            // 如果外部调用了vm.msg了,那么直接把data中msg这个属性的值返回
            get: function proxyGetter() {
                // vm.car---{name:'哈哈'}
                return me._data[key];
            },
            // 如果外部调用了vm.msg='123',直接把data中msg属性的值修改为:123
            set: function proxySetter(newVal) {
                me._data[key] = newVal;
            }
        });
    },

   // 计算属性
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