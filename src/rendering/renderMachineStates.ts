/**
 * Draws positioned automata states onto a prepared two-dimensional canvas.
 *
 * Positions are expressed in CSS pixels. The caller is responsible for sizing
 * and scaling the rendering context before invoking this module.
 */

import type { AutomataState } from '@/domain/AutomataState'

export const STATE_RADIUS_PX = 22

const STATE_FILL_COLOR = '#f8fafc'
const STATE_STROKE_COLOR = '#111111'
const STATE_LABEL_COLOR = '#111111'
const STATE_STROKE_WIDTH_PX = 1.5
const STATE_LABEL_FONT = '600 13px Arial, Helvetica, sans-serif'
const FULL_CIRCLE_RADIANS = Math.PI * 2

/**
 * Renders every state as a labeled circle at its stored position.
 *
 * Canvas drawing properties are saved and restored so state rendering does not
 * leak styles into the grid or future transition renderers.
 *
 * @param context - Prepared two-dimensional context receiving the state shapes.
 * @param states - Ordered automata states containing names and center positions.
 * @returns Nothing. State circles and labels are painted as side effects.
 *
 * @example
 * ```ts
 * renderMachineStates(context, [{ id: 0, name: 'q0', x: 120, y: 80 }])
 * ```
 */
export function renderMachineStates(
  context: CanvasRenderingContext2D,
  states: readonly AutomataState[],
): void {
  context.save()
  context.lineWidth = STATE_STROKE_WIDTH_PX
  context.strokeStyle = STATE_STROKE_COLOR
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = STATE_LABEL_FONT

  for (const state of states) {
    context.beginPath()
    context.arc(state.x, state.y, STATE_RADIUS_PX, 0, FULL_CIRCLE_RADIANS)
    context.fillStyle = STATE_FILL_COLOR
    context.fill()
    context.stroke()
    context.fillStyle = STATE_LABEL_COLOR
    context.fillText(state.name, state.x, state.y)
  }

  context.restore()
}
