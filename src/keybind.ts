import MiniEmitter from '@suporka/mini-emitter'
const KEYCODE_MAP: Record<number, string> = {
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
}
const MAP: Record<number, string> = {
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
}

const SHIFT_MAP = {
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
}

function addEvent(object: any, type: string, callback: Function) {
  if (object.addEventListener) {
    object.addEventListener(type, callback, false)
    return
  }
  object.attachEvent('on' + type, callback)
}

/**
 * 是否为修饰键
 * @param key
 * @returns
 */
function isModifier(key: string): boolean {
  return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta'
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
