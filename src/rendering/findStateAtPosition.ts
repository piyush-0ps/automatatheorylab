/** Provides hit testing for positioned automata states on the canvas. */

import type { AutomataState, StatePosition } from '@/domain/AutomataState'
import { STATE_RADIUS_PX } from '@/rendering/renderMachineStates'

/**
 * Finds the topmost state containing a canvas position.
 *
 * States are searched in reverse rendering order so overlapping states select
 * the one drawn last and therefore perceived as being on top.
 *
 * @param states - States in their normal canvas rendering order.
 * @param position - Pointer position relative to the canvas in CSS pixels.
 * @returns The state under the pointer, or `null` when the position is empty.
 *
 * @example
 * ```ts
 * findStateAtPosition(states, { x: 120, y: 80 })
 * ```
 */
export function findStateAtPosition(
  states: readonly AutomataState[],
  position: StatePosition,
): AutomataState | null {
  const maximumSquaredDistance = STATE_RADIUS_PX ** 2

  for (let stateIndex = states.length - 1; stateIndex >= 0; stateIndex -= 1) {
    const state = states[stateIndex]

    if (!state) {
      continue
    }

    const horizontalDistance = position.x - state.x
    const verticalDistance = position.y - state.y
    const squaredDistance = horizontalDistance ** 2 + verticalDistance ** 2

    if (squaredDistance <= maximumSquaredDistance) {
      return state
    }
  }

  return null
}
