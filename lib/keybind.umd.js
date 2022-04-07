(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * MiniEmitter 事件订阅发布容器
     */
    var MiniEmitter = /** @class */ (function () {
        function MiniEmitter() {
            /**事件集合 */
            this.eventMap = {};
        }
        /**
         * 事件订阅
         * @param name 事件名称
         * @param callback 事件回调
         * @param ctx this 上下文
         */
        MiniEmitter.prototype.on = function (name, callback, ctx) {
            if (ctx === void 0) { ctx = null; }
            if (this.eventMap[name] === undefined) {
                this.eventMap[name] = [];
            }
            this.eventMap[name].push({
                fn: callback,
                ctx: ctx
            });
        };
        /**
         * 事件发布
         * @param name 事件名称
         * @param args 剩余参数
         */
        MiniEmitter.prototype.emit = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.eventMap[name] && this.eventMap[name].length) {
                this.eventMap[name].forEach(function (obj) {
                    obj.fn.apply(obj.ctx, args);
                });
            }
            else {
                throw Error("".concat(name, " event is not exist!"));
            }
        };
        /**
         * 删除对应的事件，有callback则删除指定事件，没有则删除整个事件名事件
         * @param name 事件名称
         * @param callback 事件回调
         */
        MiniEmitter.prototype.off = function (name, callback) {
            if (!callback && this.eventMap[name])
                delete this.eventMap[name];
            else {
                if (this.eventMap[name]) {
                    this.eventMap[name] = this.eventMap[name].filter(function (obj) { return obj.fn !== callback; });
                }
                else {
                    throw Error("".concat(name, " event is not exist!"));
                }
            }
        };
        /**
         * 执行一次的事件订阅
         * @param name 事件名称
         * @param callback 事件回调
         * @param ctx this 上下文
         * @returns
         */
        MiniEmitter.prototype.once = function (name, callback, ctx) {
            if (ctx === void 0) { ctx = null; }
            var that = this;
            function listener() {
                that.off(name, listener);
                callback && callback.apply(ctx, arguments);
            }
            return this.on(name, listener, ctx);
        };
        return MiniEmitter;
    }());

    function addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }
        object.attachEvent('on' + type, callback);
    }
    var KeyBind = /** @class */ (function (_super) {
        __extends(KeyBind, _super);
        function KeyBind(element) {
            if (element === void 0) { element = window; }
            var _this = _super.call(this) || this;
            addEvent(element, 'keydown', _this.keyDownBinding);
            return _this;
        }
        KeyBind.prototype.bind = function (keyComboStr, handler, ctx) {
            var _this = this;
            if (typeof keyComboStr === 'string')
                keyComboStr = [keyComboStr];
            keyComboStr.forEach(function (item) { return _this._bind(item, handler, ctx); });
        };
        KeyBind.prototype.unbind = function (keyComboStr, handler, ctx) {
            var _this = this;
            if (typeof keyComboStr === 'string')
                keyComboStr = [keyComboStr];
            keyComboStr.forEach(function (item) { return _this._unbind(item, handler, ctx); });
        };
        KeyBind.prototype._bind = function (keyComboStr, handler, ctx) {
            this.on(keyComboStr.replace(/\s+/g, '').toLocaleLowerCase(), handler, ctx);
        };
        KeyBind.prototype._unbind = function (keyComboStr, handler, ctx) {
            this.off(keyComboStr.replace(/\s+/g, '').toLocaleLowerCase(), handler);
        };
        KeyBind.prototype.keyDownBinding = function (event) {
            event.preventDefault();
            console.log(event);
            // event.stopPropagation()
            if (event.ctrlKey) {
                if (event.altKey) {
                    if (event.shiftKey) ;
                }
            }
            return false;
        };
        return KeyBind;
    }(MiniEmitter));
    new KeyBind();

}));
//# sourceMappingURL=keybind.umd.js.map
