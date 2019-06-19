function MVVM(options) {
    this.$options = options || {};
    let data = this._data = this.$options.data;
    let _this = this;

    // 数据代理，实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(key => {
        _this._proxyData(key);
    });

    this._initComputed();

    observe(data, this);

    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    $watch(key, cb, options) {
        new Watcher(this, key, cb);
    },

    _proxyData(key, setter, getter) {
        let _this = this;
        setter = setter ||
            Object.defineProperty(_this, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return _this._data[key];
                },
                set: function proxySetter(newVal) {
                    _this._data[key] = newVal;
                }
            });
    },

    _initComputed() {
        let _this = this;
        let computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(key => {
                Object.defineProperty(_this, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get,
                    set: function () {
                    }
                });
            });
        }
    }
};