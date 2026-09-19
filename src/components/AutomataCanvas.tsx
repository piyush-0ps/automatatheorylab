/**
 * Provides the native canvas element used by the automata workspace.
 *
 * This component owns the canvas lifecycle while delegating pixel sizing and
 * drawing operations to the global rendering layer.
 */

import { useEffect, useRef } from 'react'

import { renderCanvasGrid } from '@/rendering/renderCanvasGrid'
import '@/styles/automata-canvas.css'

/**
 * Renders a responsive native canvas with no surrounding interface.
 *
 * The component accepts no parameters because the current workspace has no
 * configuration. On mount, it obtains the two-dimensional rendering context,
 * paints the initial grid, and observes the canvas for layout changes. The
 * observer is disconnected during unmount to avoid retaining DOM references.
 *
 * @returns A single accessible HTML canvas that fills its parent.
 *
 * @example
 * ```tsx
 * export function Workspace() {
 *   return <AutomataCanvas />
 * }
 * ```
 */
export function AutomataCanvas() {
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
      aria-label="Automata workspace"
      className="automata-canvas"
      ref={canvasReference}
    >
      Your browser does not support the automata canvas.
    </canvas>
  )
}
