import { MAP, SPECIAL_ALIASES, SHIFT_MAP, KEYCODE_MAP } from './contant'

type Action = 'keydown' | 'keypress' | 'keyup'

/**
 * 根据组合键选择更好的事件类型（keydown or keypress）；
 * 如果从 map 中无法找到值，则选择 keypress；
 * 如果有修饰键，则用 keydown；
 * @param {string} key - character for key
 * @param {Array} modifiers
 * @param {string=} action passed in
 */
export function pickBestAction(
  key: number,
  modifiers: string[],
  action?: Action
) {
  // 如果从 map 中无法找到值，则选择 keypress
  if (!action) {
    action = getReverseMap()[key] ? 'keydown' : 'keypress'
  }
  // 如果有修饰键，则用 keydown
  if (action == 'keypress' && modifiers.length) {
    action = 'keydown'
  }

  return action
}

let REVERSE_MAP: any = null

/**
 * 排除数字键的 map
 * @return {Object}
 */
export function getReverseMap() {
  if (!REVERSE_MAP) {
    REVERSE_MAP = {}
    for (let key in MAP) {
      // 跳过数字键
      if (Number(key) > 95 && Number(key) < 112) {
        continue
      }

      if (MAP.hasOwnProperty(key)) {
        REVERSE_MAP[MAP[key as unknown as keyof typeof MAP]] = key
      }
    }
  }
  return REVERSE_MAP
}

/**
 * 是否为修饰键
 * @param key
 * @returns
 */
export function isModifier(key: string): boolean {
  return key === 'shift' || key === 'ctrl' || key === 'alt' || key === 'meta'
}

/**
 * 这种要判断单独是符号 “+” 的情况
 * 还有 ctrl + + 这种情况
 * 将字符串按键组合转化为数组
 * @param  {string} combination like "command+shift+l"
 * @return {Array}
 */
export function getKeysFromString(combination: string): string[] {
  if (combination === '+') {
    return ['+']
  }
  combination = combination.replace(/\+{2}/g, '+plus')
  return combination.split('+')
}

/**
 * 获取订阅的组合键信息
 * @param combination
 * @param action
 * @returns
 */
export function getKeyInfo(combination: string, action?: Action) {
  let key: any
  var modifiers = []
  combination = combination.replace(/\s+/g, '')
  const keys = getKeysFromString(combination)
  for (let i = 0; i < keys.length; ++i) {
    key = keys[i]

    // 判断是否为特殊别名
    if (SPECIAL_ALIASES.hasOwnProperty(key)) {
      key = SPECIAL_ALIASES[key as keyof typeof SPECIAL_ALIASES]
    }

    // 针对只传 shift 后的值，如符号 “&”
    // 将其转化为 shift+7
    if (action !== 'keypress' && SHIFT_MAP.hasOwnProperty(key)) {
      key = SHIFT_MAP[key as keyof typeof SHIFT_MAP]
      modifiers.push('shift')
    }

    // 存入修饰键
    if (isModifier(key)) {
      modifiers.push(key)
    }
  }

  action = pickBestAction(key, modifiers, action)

  return {
    key: key,
    modifiers: modifiers,
    action: action,
    type: getEventType(key, modifiers, action)
  }
}

/**
 * 获取订阅事件类型
 * @param key 
 * @param modifiers 
 * @param action 
 */
export function getEventType(key:string, modifiers: string[], action: string) {
  const modifiersString = modifiers.length ? modifiers.sort().join('+') + '+' : ''
  return modifiersString + key + ':' + action
}
/**
 * 判断两个 dom 节点是否有归属关系
 * @param element
 * @param ancestor
 * @returns
 */
export function belongsTo(
  element: ParentNode | null,
  ancestor: ParentNode
): boolean {
  if (element === null || element === document) {
    return false
  }

  if (element === ancestor) {
    return true
  }

  return belongsTo(element.parentNode, ancestor)
}
/**
 * 监听事件
 * @param object 监听对象
 * @param type 监听类型
 * @param callback 监听回调
 * @returns
 */
export function addEvent(object: any, type: string, callback: Function) {
  if (object.addEventListener) {
    object.addEventListener(type, callback, false)
    return
  }
  object.attachEvent('on' + type, callback)
}
/**
 * 移除监听事件
 * @param object 监听对象
 * @param type 监听类型
 * @param callback 监听回调
 * @returns
 */
export function removeEvent(object: any, type: string, callback: Function) {
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
export function preventDefault(e: Event | KeyboardEvent) {
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
export function stopPropagation(e: Event | KeyboardEvent) {
  if (e.stopPropagation) {
    e.stopPropagation()
    return
  }

  e.cancelBubble = true
}

/**
 * 获取键盘事件所对应的字符
 * @param event
 * @returns
 */
export function getCharacterFromEvent(event: KeyboardEvent) {
  if (event.type == 'keypress') {
    let character = String.fromCharCode(event.which)

    if (!event.shiftKey) {
      character = character.toLowerCase()
    }

    return character
  }

  if (event.which in MAP) {
    return MAP[event.which as keyof typeof MAP]
  }

  if (event.which in KEYCODE_MAP) {
    return KEYCODE_MAP[event.which as keyof typeof KEYCODE_MAP]
  }
  return String.fromCharCode(event.which).toLowerCase()
}

/**
 * 获取按键事件修饰符
 * @param e
 * @returns
 */
export function getEventModifiers(e: KeyboardEvent): string[] {
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
