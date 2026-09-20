/** Verifies the canvas component exposes one accessible native drawing surface. */

import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AutomataCanvas } from '@/components/AutomataCanvas'

describe('AutomataCanvas', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders one native canvas without surrounding interface controls', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    const { container } = render(<AutomataCanvas />)

    expect(screen.getByLabelText('Automata workspace')).toBeInstanceOf(
      HTMLCanvasElement,
    )
    expect(container.querySelectorAll('canvas')).toHaveLength(1)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('delegates a relative position when the state tool is active', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const handleAddState = vi.fn()
    render(
      <AutomataCanvas
        activeTool="state"
        machine={{ id: 4, name: 'Positioned machine', states: [] }}
        onAddState={handleAddState}
      />,
    )
    const canvas = screen.getByLabelText('Positioned machine canvas')

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      bottom: 450,
      height: 400,
      left: 30,
      right: 630,
      toJSON: () => ({}),
      top: 50,
      width: 600,
      x: 30,
      y: 50,
    })

    fireEvent.pointerDown(canvas, {
      button: 0,
      clientX: 180,
      clientY: 250,
      pointerId: 1,
    })

    expect(handleAddState).toHaveBeenCalledWith(4, { x: 150, y: 200 })
  })

  it('grabs and moves an existing state without creating another state', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const handleAddState = vi.fn()
    const handleMoveState = vi.fn()
    render(
      <AutomataCanvas
        activeTool="state"
        machine={{
          id: 4,
          name: 'Movable machine',
          states: [{ id: 0, name: 'q0', x: 100, y: 120 }],
        }}
        onAddState={handleAddState}
        onMoveState={handleMoveState}
      />,
    )
    const canvas = screen.getByLabelText('Movable machine canvas')

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      bottom: 450,
      height: 400,
      left: 30,
      right: 630,
      toJSON: () => ({}),
      top: 50,
      width: 600,
      x: 30,
      y: 50,
    })
    Object.assign(canvas, {
      hasPointerCapture: vi.fn().mockReturnValue(true),
      releasePointerCapture: vi.fn(),
      setPointerCapture: vi.fn(),
    })

    fireEvent.pointerMove(canvas, {
      clientX: 130,
      clientY: 170,
      pointerId: 2,
    })
    expect(canvas).toHaveAttribute('data-state-interaction', 'hovering')

    fireEvent.pointerDown(canvas, {
      button: 0,
      clientX: 130,
      clientY: 170,
      pointerId: 2,
    })
    fireEvent.pointerMove(canvas, {
      clientX: 300,
      clientY: 250,
      pointerId: 2,
    })

    expect(handleMoveState).toHaveBeenCalledWith(4, 0, { x: 270, y: 200 })
    expect(handleAddState).not.toHaveBeenCalled()
    expect(canvas).toHaveAttribute('data-state-interaction', 'dragging')
  })
})
