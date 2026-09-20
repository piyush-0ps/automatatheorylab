/**
 * Provides the native canvas element used by the automata workspace.
 *
 * This component owns the canvas lifecycle while delegating pixel sizing and
 * drawing operations to the global rendering layer.
 */

import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

import type { StatePosition } from '@/domain/AutomataState'
import type { Machine } from '@/domain/Machine'
import { findStateAtPosition } from '@/rendering/findStateAtPosition'
import { renderCanvasGrid } from '@/rendering/renderCanvasGrid'
import { renderMachineStates } from '@/rendering/renderMachineStates'
import type { CanvasTool } from '@/types/CanvasTool'
import '@/styles/automata-canvas.css'

interface AutomataCanvasProps {
  activeTool?: CanvasTool | null
  machine?: Machine | null
  onAddState?: (machineId: number, position: StatePosition) => void
  onMoveState?: (
    machineId: number,
    stateId: number,
    position: StatePosition,
  ) => void
}

/**
 * Converts a pointer coordinate into a state center contained by one axis.
 *
 * @param coordinate - Raw pointer coordinate relative to the canvas axis.
 * @param canvasLength - Visible width or height of the canvas in CSS pixels.
 * @returns The coordinate constrained to the visible canvas extent.
 */
function constrainCanvasCoordinate(
  coordinate: number,
  canvasLength: number,
): number {
  return Math.min(Math.max(coordinate, 0), canvasLength)
}

/**
 * Converts viewport pointer coordinates into canvas-relative CSS pixels.
 *
 * @param clientX - Pointer position along the browser viewport's horizontal axis.
 * @param clientY - Pointer position along the browser viewport's vertical axis.
 * @param canvasBounds - Current displayed bounds of the native canvas.
 * @returns A canvas-relative position constrained to the visible drawing area.
 */
function getCanvasPointerPosition(
  clientX: number,
  clientY: number,
  canvasBounds: DOMRect,
): StatePosition {
  return {
    x: constrainCanvasCoordinate(
      clientX - canvasBounds.left,
      canvasBounds.width,
    ),
    y: constrainCanvasCoordinate(
      clientY - canvasBounds.top,
      canvasBounds.height,
    ),
  }
}

/**
 * Renders a responsive native canvas with no surrounding interface.
 *
 * On mount, the component obtains the two-dimensional rendering context,
 * paints the initial grid, and observes the canvas for layout changes. The
 * observer is disconnected during unmount to avoid retaining DOM references.
 * When the state tool and a machine are active, clicking the canvas delegates a
 * CSS-pixel position to the workspace owner. Stored states are redrawn after
 * machine changes and canvas resizes.
 *
 * @param props - Optional machine associated with the rendered workspace.
 * @param props.activeTool - Toolbar tool currently controlling canvas clicks.
 * @param props.machine - The active machine, or `null` when no tab is active.
 * @param props.onAddState - Called with the active machine ID and clicked canvas
 * position while the state tool is selected.
 * @param props.onMoveState - Called continuously while an existing state is
 * dragged across its machine canvas.
 * @returns A single accessible HTML canvas that fills its parent.
 *
 * @example
 * ```tsx
 * export function Workspace() {
 *   return (
 *     <AutomataCanvas
 *       activeTool="state"
 *       machine={activeMachine}
 *       onAddState={addState}
 *       onMoveState={moveState}
 *     />
 *   )
 * }
 * ```
 */
export function AutomataCanvas({
  activeTool = null,
  machine = null,
  onAddState,
  onMoveState,
}: AutomataCanvasProps) {
  const canvasReference = useRef<HTMLCanvasElement>(null)
  const draggedStateIdReference = useRef<number | null>(null)
  const [draggedStateId, setDraggedStateId] = useState<number | null>(null)
  const [hoveredStateId, setHoveredStateId] = useState<number | null>(null)

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
      renderMachineStates(context, machine?.states ?? [])
    }

    renderCanvas()

    const resizeObserver = new ResizeObserver(renderCanvas)
    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()
    }
  }, [machine])

  /**
   * Begins dragging a state or adds one on empty canvas space.
   *
   * Existing states take precedence over state creation. The primary pointer is
   * captured when dragging so movement continues outside the state's circle.
   * Empty-space presses create a state only while the state tool is selected.
   *
   * @param event - The React pointer event beginning on the native canvas.
   * @returns Nothing. Drag state or machine state may be updated as side effects.
   */
  const handleCanvasPointerDown = (
    event: PointerEvent<HTMLCanvasElement>,
  ): void => {
    if (event.button !== 0 || !machine) {
      return
    }

    const canvasBounds = event.currentTarget.getBoundingClientRect()
    const position = getCanvasPointerPosition(
      event.clientX,
      event.clientY,
      canvasBounds,
    )
    const selectedState = findStateAtPosition(machine.states, position)

    if (selectedState && onMoveState) {
      event.preventDefault()
      draggedStateIdReference.current = selectedState.id
      setDraggedStateId(selectedState.id)
      setHoveredStateId(selectedState.id)
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }

    if (activeTool === 'state' && onAddState) {
      onAddState(machine.id, position)
    }
  }

  /**
   * Moves a captured state or updates hover hit testing over the canvas.
   *
   * @param event - The latest React pointer movement over the native canvas.
   * @returns Nothing. State coordinates or local hover state may be updated.
   */
  const handleCanvasPointerMove = (
    event: PointerEvent<HTMLCanvasElement>,
  ): void => {
    if (!machine) {
      return
    }

    const position = getCanvasPointerPosition(
      event.clientX,
      event.clientY,
      event.currentTarget.getBoundingClientRect(),
    )
    const draggedId = draggedStateIdReference.current

    if (draggedId !== null && onMoveState) {
      onMoveState(machine.id, draggedId, position)
      return
    }

    const hoveredState = findStateAtPosition(machine.states, position)
    setHoveredStateId(hoveredState?.id ?? null)
  }

  /**
   * Finishes the current drag and releases native pointer capture.
   *
   * @param event - The pointer-up or cancellation event ending the drag.
   * @returns Nothing. Drag interaction state and pointer capture are cleared.
   */
  const handleCanvasPointerEnd = (
    event: PointerEvent<HTMLCanvasElement>,
  ): void => {
    draggedStateIdReference.current = null
    setDraggedStateId(null)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  /**
   * Clears hover feedback when the pointer leaves outside an active drag.
   *
   * @returns Nothing. Local hover state may be cleared as a side effect.
   */
  const handleCanvasPointerLeave = (): void => {
    if (draggedStateIdReference.current === null) {
      setHoveredStateId(null)
    }
  }

  const stateInteraction =
    draggedStateId !== null
      ? 'dragging'
      : hoveredStateId !== null
        ? 'hovering'
        : undefined

  return (
    <canvas
      aria-label={machine ? `${machine.name} canvas` : 'Automata workspace'}
      className="automata-canvas"
      data-machine-id={machine?.id}
      data-state-interaction={stateInteraction}
      data-state-count={machine?.states.length ?? 0}
      data-tool={activeTool ?? undefined}
      onPointerCancel={handleCanvasPointerEnd}
      onPointerDown={handleCanvasPointerDown}
      onPointerLeave={handleCanvasPointerLeave}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerEnd}
      ref={canvasReference}
    >
      Your browser does not support the automata canvas.
    </canvas>
  )
}
