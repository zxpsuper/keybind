// 源码参考 [mousetrap] https://github.com/ccampbell/mousetrap
import MiniEmitter from '@suporka/mini-emitter'
import { addEvent, getCharacterFromEvent, getEventModifiers, getKeyInfo, getEventType } from './utils'
class KeyBind extends MiniEmitter {
  // 存放事件的 set
  private eventSet = new Set()
  constructor(element: any = window) {
    super()
    addEvent(element, 'keypress', this.keyDownBinding.bind(this))
    addEvent(element, 'keyup', this.keyDownBinding.bind(this))
    addEvent(element, 'keydown', this.keyDownBinding.bind(this))
  }

  /**
   * 绑定组合键事件
   * @param keyComboStr 组合键，如：ctrl + r
   * @param handler 回调函数
   * @param ctx this 上下文
   */
  public bind(keyComboStr: string | string[], handler: Function, ctx: any = null) {
    if (typeof keyComboStr === 'string') keyComboStr = [keyComboStr]
    keyComboStr.forEach((item) => this._bind(item, handler, ctx))
  }

  /**
   * 解绑组合键事件
   * @param keyComboStr 组合键，如：ctrl + r
   * @param handler 回调函数
   * @param ctx this 上下文
   */
  public unbind(keyComboStr: string | string[], handler: Function, ctx: any = null) {
    if (typeof keyComboStr === 'string') keyComboStr = [keyComboStr]
    keyComboStr.forEach((item) => this._unbind(item, handler, ctx))
  }

  protected _bind(keyComboStr: string, handler: Function, ctx: any) {
    const info = getKeyInfo(keyComboStr.toLocaleLowerCase())
    if (this.eventSet.has(info.type) === false) this.eventSet.add(info.type)

    this.on(info.type, handler, ctx)
  }

  protected _unbind(keyComboStr: string, handler: Function, ctx: any) {
    const info = getKeyInfo(keyComboStr)

    if (!handler && this.eventSet.has(info.type)) {
      this.eventSet.delete(info.type)
    }
    this.off(info.type, handler)
  }
  protected keyDownBinding(event: KeyboardEvent) {
    const character = getCharacterFromEvent(event)
    if (!character) return
    this.handleKey(character, getEventModifiers(event), event)
  }

  protected handleKey(character: string, modifiers: string[], e: KeyboardEvent) {
    const eventType = getEventType(character, modifiers, e.type)
    if (this.eventSet.has(eventType)) {
      this.emit(eventType, e)
    }
  }
}

export default new KeyBind()

