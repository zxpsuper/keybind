import { MAP } from './contant'
type Action = 'keydown' | 'keypress' | 'keyup'
/**
 * 根据组合键选择更好的事件类型（keydown or keypress）
 * 如果从 map 中无法找到值，则选择 keypress
 * 如果有修饰键，则用 keydown
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
    action = _getReverseMap()[key] ? 'keydown' : 'keypress'
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
 * reverses the map lookup so that we can look for specific keys
 * to see what can and can't use keypress
 *
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
        REVERSE_MAP[MAP[key]] = key
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
