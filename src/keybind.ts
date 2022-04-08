import MiniEmitter from '@suporka/mini-emitter'

function addEvent(object: any, type: string, callback: Function) {
  if (object.addEventListener) {
    object.addEventListener(type, callback, false)
    return
  }
  object.attachEvent('on' + type, callback)
}


/**
 * 获取按键事件修饰符
 * @param e
 * @returns
 */
function getEventModifiers(e: KeyboardEvent): string[] {
  var modifiers = []

  if (e.shiftKey) {
    modifiers.push('shift')
  }

  if (e.altKey) {
    modifiers.push('alt')
  }

  if (e.ctrlKey) {
    modifiers.push('ctrl')
  }

  if (e.metaKey) {
    modifiers.push('meta')
  }

  return modifiers
}

function removeEvent(object: any, type: string, callback: Function) {
  if (object.removeEventListener) {
    object.removeEventListener(type, callback, false)
    return
  }
  object.detachEvent('on' + type, callback)
}

/**
 * 阻止默认事件通用写法
 * @param e
 * @returns
 */
function preventDefault(e: Event | KeyboardEvent) {
  if (e.preventDefault) {
    e.preventDefault()
    return
  }
  e.returnValue = false
}
/**
 * 阻止事件冒泡
 * @param e
 * @returns
 */
function stopPropagation(e: Event | KeyboardEvent) {
  if (e.stopPropagation) {
    e.stopPropagation()
    return
  }

  e.cancelBubble = true
}
function getCharacterFromEvent(event: KeyboardEvent) {
  if (event.type == 'keypress') {
    let character = String.fromCharCode(event.which)

    if (!event.shiftKey) {
      character = character.toLowerCase()
    }

    return character
  }

  // for non keypress events the special maps are needed
  if (MAP[event.which]) {
    return MAP[event.which]
  }

  if (KEYCODE_MAP[event.which]) {
    return KEYCODE_MAP[event.which]
  }

  // if it is not in the special map

  // with keydown and keyup events the character seems to always
  // come in as an uppercase character whether you are pressing shift
  // or not.  we should make sure it is always lowercase for comparisons
  return String.fromCharCode(event.which).toLowerCase()
}

class KeyBind extends MiniEmitter {
  constructor(element: any = window) {
    super()
    addEvent(element, 'keydown', this.keyDownBinding)
  }
  public bind(keyComboStr: string | string[], handler: Function, ctx: any) {
    if (typeof keyComboStr === 'string') keyComboStr = [keyComboStr]
    keyComboStr.forEach((item) => this._bind(item, handler, ctx))
  }
  public unbind(keyComboStr: string | string[], handler: Function, ctx: any) {
    if (typeof keyComboStr === 'string') keyComboStr = [keyComboStr]
    keyComboStr.forEach((item) => this._unbind(item, handler, ctx))
  }
  protected _bind(keyComboStr: string, handler: Function, ctx: any) {
    this.on(keyComboStr.replace(/\s+/g, '').toLocaleLowerCase(), handler, ctx)
  }
  protected _unbind(keyComboStr: string, handler: Function, ctx: any) {
    this.off(keyComboStr.replace(/\s+/g, '').toLocaleLowerCase(), handler)
  }
  protected keyDownBinding(event: KeyboardEvent) {
    preventDefault(event)
    stopPropagation(event)

    console.log(event)
    const character = getCharacterFromEvent(event)
    if (!character) return
    return false
  }
}

const app = new KeyBind()
