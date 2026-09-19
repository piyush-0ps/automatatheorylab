/**
 * Displays the machines currently opened in the canvas workspace.
 *
 * Tabs preserve their initial opening order and expose the active machine using
 * standard tab semantics.
 */

import type { Machine } from '@/domain/Machine'
import type { MouseEvent } from 'react'
import '@/styles/canvas-tab-bar.css'

interface CanvasTabBarProps {
  activeMachineId: number | null
  machines: readonly Machine[]
  onCloseMachine: (machineId: number) => void
  onSelectMachine: (machineId: number) => void
}

/**
 * Renders IDE-style tabs for machines opened from the sidebar.
 *
 * No bar is rendered until at least one machine has been opened. Selecting a
 * tab delegates activation to the workspace owner so the associated canvas can
 * update through the same source of truth.
 *
 * @param props - The current open machines and selection behavior.
 * @param props.activeMachineId - Identifier of the machine associated with the
 * visible canvas, or `null` when none is active.
 * @param props.machines - Machines displayed in their original opening order.
 * @param props.onCloseMachine - Closes a tab while preserving its machine.
 * @param props.onSelectMachine - Called with a machine identifier when its tab
 * is selected.
 * @returns The tab bar, or `null` when no machines have been opened.
 *
 * @example
 * ```tsx
 * <CanvasTabBar
 *   activeMachineId={activeMachine?.id ?? null}
 *   machines={openMachines}
 *   onCloseMachine={closeMachineTab}
 *   onSelectMachine={openMachine}
 * />
 * ```
 */
export function CanvasTabBar({
  activeMachineId,
  machines,
  onCloseMachine,
  onSelectMachine,
}: CanvasTabBarProps) {
  if (machines.length === 0) {
    return null
  }

  /**
   * Activates the machine represented by a clicked tab.
   *
   * @param event - The React mouse event emitted by a machine tab.
   * @returns Nothing. Selection is delegated to the workspace owner.
   */
  const handleSelectMachine = (event: MouseEvent<HTMLButtonElement>): void => {
    onSelectMachine(Number(event.currentTarget.value))
  }

  /**
   * Closes the selected tab while leaving its sidebar machine available.
   *
   * @param event - The React mouse event emitted by a tab's close button.
   * @returns Nothing. Closing is delegated to the workspace owner.
   */
  const handleCloseMachine = (event: MouseEvent<HTMLButtonElement>): void => {
    onCloseMachine(Number(event.currentTarget.value))
  }

  return (
    <div aria-label="Open machines" className="canvas-tab-bar" role="tablist">
      {machines.map((machine) => {
        const isActive = machine.id === activeMachineId

        return (
          <div
            className="canvas-tab-bar__item"
            data-active={isActive}
            key={machine.id}
            role="presentation"
          >
            <button
              aria-selected={isActive}
              className="canvas-tab-bar__tab"
              onClick={handleSelectMachine}
              role="tab"
              type="button"
              value={machine.id}
            >
              {machine.name}
            </button>
            <button
              aria-label={`Close ${machine.name}`}
              className="canvas-tab-bar__close"
              onClick={handleCloseMachine}
              type="button"
              value={machine.id}
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
