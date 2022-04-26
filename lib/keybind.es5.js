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

/**
 * 按键码
 */
var KEYCODE_MAP = Object.freeze({
    106: '*',
    107: '+',
    109: '-',
    110: '.',
    111: '/',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'"
});
/**
 * shift 按键
 */
var SHIFT_MAP = Object.freeze({
    '~': '`',
    '!': '1',
    '@': '2',
    '#': '3',
    $: '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    _: '-',
    '+': '=',
    ':': ';',
    '"': "'",
    '<': ',',
    '>': '.',
    '?': '/',
    '|': '\\'
});
/**
 * 通用按键 map
 */
var MAP = Object.freeze({
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    20: 'capslock',
    27: 'esc',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'ins',
    46: 'del',
    91: 'meta',
    93: 'meta',
    96: '0',
    97: '1',
    98: '2',
    99: '3',
    100: '4',
    101: '5',
    102: '6',
    103: '7',
    104: '8',
    105: '9',
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12',
    124: 'f13',
    125: 'f14',
    126: 'f15',
    127: 'f16',
    128: 'f17',
    129: 'f18',
    130: 'f19',
    224: 'meta'
});
/**
 * 特殊别名
 * TODD: 不知道有什么用，除了 plus
 */
var SPECIAL_ALIASES = Object.freeze({
    option: 'alt',
    command: 'meta',
    return: 'enter',
    escape: 'esc',
    plus: '+',
    mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
});

/**
 * 根据组合键选择更好的事件类型（keydown or keypress）；
 * 如果从 map 中无法找到值，则选择 keypress；
 * 如果有修饰键，则用 keydown；
 * @param {string} key - character for key
 * @param {Array} modifiers
 * @param {string=} action passed in
 */
function pickBestAction(key, modifiers, action) {
    // 如果从 map 中无法找到值，则选择 keypress
    if (!action) {
        action = getReverseMap()[key] ? 'keydown' : 'keypress';
    }
    // 如果有修饰键，则用 keydown
    if (action == 'keypress' && modifiers.length) {
        action = 'keydown';
    }
    return action;
}
var REVERSE_MAP = null;
/**
 * 排除数字键的 map
 * @return {Object}
 */
function getReverseMap() {
    if (!REVERSE_MAP) {
        REVERSE_MAP = {};
        for (var key in MAP) {
            // 跳过数字键
            if (Number(key) > 95 && Number(key) < 112) {
                continue;
            }
            if (MAP.hasOwnProperty(key)) {
                REVERSE_MAP[MAP[key]] = key;
            }
        }
    }
    return REVERSE_MAP;
}
/**
 * 是否为修饰键
 * @param key
 * @returns
 */
function isModifier(key) {
    return key === 'shift' || key === 'ctrl' || key === 'alt' || key === 'meta';
}
/**
 * 这种要判断单独是符号 “+” 的情况
 * 还有 ctrl + + 这种情况
 * 将字符串按键组合转化为数组
 * @param  {string} combination like "command+shift+l"
 * @return {Array}
 */
function getKeysFromString(combination) {
    if (combination === '+') {
        return ['+'];
    }
    combination = combination.replace(/\+{2}/g, '+plus');
    return combination.split('+');
}
/**
 * 获取订阅的组合键信息
 * @param combination
 * @param action
 * @returns
 */
function getKeyInfo(combination, action) {
    var key;
    var modifiers = [];
    combination = combination.replace(/\s+/g, '');
    var keys = getKeysFromString(combination);
    for (var i = 0; i < keys.length; ++i) {
        key = keys[i];
        // 判断是否为特殊别名
        if (SPECIAL_ALIASES.hasOwnProperty(key)) {
            key = SPECIAL_ALIASES[key];
        }
        // 针对只传 shift 后的值，如符号 “&”
        // 将其转化为 shift+7
        if (action !== 'keypress' && SHIFT_MAP.hasOwnProperty(key)) {
            key = SHIFT_MAP[key];
            modifiers.push('shift');
        }
        // 存入修饰键
        if (isModifier(key)) {
            modifiers.push(key);
        }
    }
    action = pickBestAction(key, modifiers, action);
    return {
        key: key,
        modifiers: modifiers,
        action: action,
        type: getEventType(key, modifiers, action)
    };
}
/**
 * 获取订阅事件类型
 * @param key
 * @param modifiers
 * @param action
 */
function getEventType(key, modifiers, action) {
    var modifiersString = modifiers.length ? modifiers.sort().join('+') + '+' : '';
    return modifiersString + key + ':' + action;
}
/**
 * 监听事件
 * @param object 监听对象
 * @param type 监听类型
 * @param callback 监听回调
 * @returns
 */
function addEvent(object, type, callback) {
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
        return;
    }
    object.attachEvent('on' + type, callback);
}
/**
 * 获取键盘事件所对应的字符
 * @param event
 * @returns
 */
function getCharacterFromEvent(event) {
    if (event.type == 'keypress') {
        var character = String.fromCharCode(event.which);
        if (!event.shiftKey) {
            character = character.toLowerCase();
        }
        return character;
    }
    if (event.which in MAP) {
        return MAP[event.which];
    }
    if (event.which in KEYCODE_MAP) {
        return KEYCODE_MAP[event.which];
    }
    return String.fromCharCode(event.which).toLowerCase();
}
/**
 * 获取按键事件修饰符
 * @param e
 * @returns
 */
function getEventModifiers(e) {
    var modifiers = [];
    if (e.shiftKey) {
        modifiers.push('shift');
    }
    if (e.altKey) {
        modifiers.push('alt');
    }
    if (e.ctrlKey) {
        modifiers.push('ctrl');
    }
    if (e.metaKey) {
        modifiers.push('meta');
    }
    return modifiers;
}

var KeyBind = /** @class */ (function (_super) {
    __extends(KeyBind, _super);
    function KeyBind(element) {
        if (element === void 0) { element = window; }
        var _this = _super.call(this) || this;
        // 存放事件的 set
        _this.eventSet = new Set();
        addEvent(element, 'keypress', _this.keyDownBinding.bind(_this));
        addEvent(element, 'keyup', _this.keyDownBinding.bind(_this));
        addEvent(element, 'keydown', _this.keyDownBinding.bind(_this));
        return _this;
    }
    /**
     * 绑定组合键事件
     * @param keyComboStr 组合键，如：ctrl + r
     * @param handler 回调函数
     * @param ctx this 上下文
     */
    KeyBind.prototype.bind = function (keyComboStr, handler, ctx) {
        var _this = this;
        if (ctx === void 0) { ctx = null; }
        if (typeof keyComboStr === 'string')
            keyComboStr = [keyComboStr];
        keyComboStr.forEach(function (item) { return _this._bind(item, handler, ctx); });
    };
    /**
     * 解绑组合键事件
     * @param keyComboStr 组合键，如：ctrl + r
     * @param handler 回调函数
     * @param ctx this 上下文
     */
    KeyBind.prototype.unbind = function (keyComboStr, handler, ctx) {
        var _this = this;
        if (ctx === void 0) { ctx = null; }
        if (typeof keyComboStr === 'string')
            keyComboStr = [keyComboStr];
        keyComboStr.forEach(function (item) { return _this._unbind(item, handler, ctx); });
    };
    KeyBind.prototype._bind = function (keyComboStr, handler, ctx) {
        var info = getKeyInfo(keyComboStr.toLocaleLowerCase());
        if (this.eventSet.has(info.type) === false)
            this.eventSet.add(info.type);
        this.on(info.type, handler, ctx);
    };
    KeyBind.prototype._unbind = function (keyComboStr, handler, ctx) {
        var info = getKeyInfo(keyComboStr);
        if (!handler && this.eventSet.has(info.type)) {
            this.eventSet.delete(info.type);
        }
        this.off(info.type, handler);
    };
    KeyBind.prototype.keyDownBinding = function (event) {
        var character = getCharacterFromEvent(event);
        if (!character)
            return;
        this.handleKey(character, getEventModifiers(event), event);
    };
    KeyBind.prototype.handleKey = function (character, modifiers, e) {
        var eventType = getEventType(character, modifiers, e.type);
        if (this.eventSet.has(eventType)) {
            this.emit(eventType, e);
        }
    };
    return KeyBind;
}(MiniEmitter));
var keybind = new KeyBind();

export { keybind as default };
//# sourceMappingURL=keybind.es5.js.map
