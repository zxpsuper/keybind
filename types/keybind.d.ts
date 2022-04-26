import MiniEmitter from '@suporka/mini-emitter';
declare class KeyBind extends MiniEmitter {
    private eventSet;
    constructor(element?: any);
    /**
     * 绑定组合键事件
     * @param keyComboStr 组合键，如：ctrl + r
     * @param handler 回调函数
     * @param ctx this 上下文
     */
    bind(keyComboStr: string | string[], handler: Function, ctx?: any): void;
    /**
     * 解绑组合键事件
     * @param keyComboStr 组合键，如：ctrl + r
     * @param handler 回调函数
     * @param ctx this 上下文
     */
    unbind(keyComboStr: string | string[], handler: Function, ctx?: any): void;
    protected _bind(keyComboStr: string, handler: Function, ctx: any): void;
    protected _unbind(keyComboStr: string, handler: Function, ctx: any): void;
    protected keyDownBinding(event: KeyboardEvent): void;
    protected handleKey(character: string, modifiers: string[], e: KeyboardEvent): void;
}
declare const _default: KeyBind;
export default _default;
