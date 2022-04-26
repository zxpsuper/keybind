declare type Action = 'keydown' | 'keypress' | 'keyup';
/**
 * 根据组合键选择更好的事件类型（keydown or keypress）；
 * 如果从 map 中无法找到值，则选择 keypress；
 * 如果有修饰键，则用 keydown；
 * @param {string} key - character for key
 * @param {Array} modifiers
 * @param {string=} action passed in
 */
export declare function pickBestAction(key: number, modifiers: string[], action?: Action): "keydown" | "keypress" | "keyup";
/**
 * 排除数字键的 map
 * @return {Object}
 */
export declare function getReverseMap(): any;
/**
 * 是否为修饰键
 * @param key
 * @returns
 */
export declare function isModifier(key: string): boolean;
/**
 * 这种要判断单独是符号 “+” 的情况
 * 还有 ctrl + + 这种情况
 * 将字符串按键组合转化为数组
 * @param  {string} combination like "command+shift+l"
 * @return {Array}
 */
export declare function getKeysFromString(combination: string): string[];
/**
 * 获取订阅的组合键信息
 * @param combination
 * @param action
 * @returns
 */
export declare function getKeyInfo(combination: string, action?: Action): {
    key: any;
    modifiers: any[];
    action: Action;
    type: string;
};
/**
 * 获取订阅事件类型
 * @param key
 * @param modifiers
 * @param action
 */
export declare function getEventType(key: string, modifiers: string[], action: string): string;
/**
 * 判断两个 dom 节点是否有归属关系
 * @param element
 * @param ancestor
 * @returns
 */
export declare function belongsTo(element: ParentNode | null, ancestor: ParentNode): boolean;
/**
 * 监听事件
 * @param object 监听对象
 * @param type 监听类型
 * @param callback 监听回调
 * @returns
 */
export declare function addEvent(object: any, type: string, callback: Function): void;
/**
 * 移除监听事件
 * @param object 监听对象
 * @param type 监听类型
 * @param callback 监听回调
 * @returns
 */
export declare function removeEvent(object: any, type: string, callback: Function): void;
/**
 * 阻止默认事件通用写法
 * @param e
 * @returns
 */
export declare function preventDefault(e: Event | KeyboardEvent): void;
/**
 * 阻止事件冒泡
 * @param e
 * @returns
 */
export declare function stopPropagation(e: Event | KeyboardEvent): void;
/**
 * 获取键盘事件所对应的字符
 * @param event
 * @returns
 */
export declare function getCharacterFromEvent(event: KeyboardEvent): string;
/**
 * 获取按键事件修饰符
 * @param e
 * @returns
 */
export declare function getEventModifiers(e: KeyboardEvent): string[];
export {};
