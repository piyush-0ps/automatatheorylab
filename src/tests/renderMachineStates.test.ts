/** Verifies positioned automata state shapes and labels are drawn. */

import { describe, expect, it, vi } from 'vitest'

import { renderMachineStates } from '@/rendering/renderMachineStates'

describe('renderMachineStates', () => {
  it('draws a labeled circle for every stored state', () => {
    const context = {
      arc: vi.fn(),
      beginPath: vi.fn(),
      fill: vi.fn(),
      fillStyle: '',
      fillText: vi.fn(),
      font: '',
      lineWidth: 0,
      restore: vi.fn(),
      save: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      textAlign: '',
      textBaseline: '',
    } as unknown as CanvasRenderingContext2D

    renderMachineStates(context, [
      { id: 0, name: 'q0', x: 100, y: 120 },
      { id: 1, name: 'q1', x: 240, y: 180 },
    ])

    expect(context.arc).toHaveBeenCalledTimes(2)
    expect(context.fillText).toHaveBeenNthCalledWith(1, 'q0', 100, 120)
    expect(context.fillText).toHaveBeenNthCalledWith(2, 'q1', 240, 180)
    expect(context.save).toHaveBeenCalledOnce()
    expect(context.restore).toHaveBeenCalledOnce()
  })
})
