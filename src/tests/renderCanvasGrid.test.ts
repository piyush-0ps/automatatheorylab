/** Verifies canvas backing-buffer sizing and dot-grid rendering behavior. */

import { afterEach, describe, expect, it, vi } from 'vitest'

import { renderCanvasGrid } from '@/rendering/renderCanvasGrid'

describe('renderCanvasGrid', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('scales the backing buffer and paints the grid', () => {
    const canvas = document.createElement('canvas')
    const context = {
      arc: vi.fn(),
      beginPath: vi.fn(),
      clearRect: vi.fn(),
      fill: vi.fn(),
      fillStyle: '',
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      bottom: 360,
      height: 360,
      left: 0,
      right: 640,
      toJSON: () => ({}),
      top: 0,
      width: 640,
      x: 0,
      y: 0,
    })
    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(2)

    renderCanvasGrid(canvas, context)

    expect(canvas.width).toBe(1280)
    expect(canvas.height).toBe(720)
    expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0)
    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 640, 360)
    expect(context.arc).toHaveBeenCalled()
    expect(context.fill).toHaveBeenCalled()
  })
})
