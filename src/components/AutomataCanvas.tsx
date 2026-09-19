/**
 * Provides the native canvas element used by the automata workspace.
 *
 * This component owns the canvas lifecycle while delegating pixel sizing and
 * drawing operations to the global rendering layer.
 */

import { useEffect, useRef } from 'react'

import type { Machine } from '@/domain/Machine'
import { renderCanvasGrid } from '@/rendering/renderCanvasGrid'
import '@/styles/automata-canvas.css'

interface AutomataCanvasProps {
  machine?: Machine | null
}

/**
 * Renders a responsive native canvas with no surrounding interface.
 *
 * On mount, the component obtains the two-dimensional rendering context,
 * paints the initial grid, and observes the canvas for layout changes. The
 * observer is disconnected during unmount to avoid retaining DOM references.
 * When supplied, the machine identity is exposed on the native canvas so future
 * drawing operations can resolve the correct automaton.
 *
 * @param props - Optional machine associated with the rendered workspace.
 * @param props.machine - The active machine, or `null` when no tab is active.
 * @returns A single accessible HTML canvas that fills its parent.
 *
 * @example
 * ```tsx
 * export function Workspace() {
 *   return <AutomataCanvas machine={activeMachine} />
 * }
 * ```
 */
export function AutomataCanvas({ machine = null }: AutomataCanvasProps) {
  const canvasReference = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasReference.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    /**
     * Synchronizes and repaints the canvas after its displayed size changes.
     *
     * The function closes over the validated canvas and rendering context, so
     * it requires no parameters and produces no return value. Its only side
     * effect is updating the canvas backing buffer and pixels.
     */
    const renderCanvas = (): void => {
      renderCanvasGrid(canvas, context)
    }

    renderCanvas()

    const resizeObserver = new ResizeObserver(renderCanvas)
    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      aria-label={machine ? `${machine.name} canvas` : 'Automata workspace'}
      className="automata-canvas"
      data-machine-id={machine?.id}
      ref={canvasReference}
    >
      Your browser does not support the automata canvas.
    </canvas>
  )
}
