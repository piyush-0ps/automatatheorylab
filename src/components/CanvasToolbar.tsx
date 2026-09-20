/**
 * Provides the canvas action toolbar displayed above the workspace edge.
 *
 * The toolbar reports selections to its workspace owner and reflects the
 * controlled active tool for visual and accessible feedback.
 */

import type { MouseEvent } from 'react'

import type { CanvasTool } from '@/types/CanvasTool'
import '@/styles/canvas-toolbar.css'

interface CanvasToolbarProps {
  onSelectAction: (action: CanvasTool) => void
  selectedAction: CanvasTool | null
}

/**
 * Renders the currently available canvas action placeholders as symbols.
 *
 * Clicking a button delegates selection to the workspace owner. Visible labels
 * are replaced by icons while accessible labels and hover tooltips describe
 * every action.
 *
 * @param props - Controlled selection state and the selection callback.
 * @param props.onSelectAction - Called with the tool represented by a click.
 * @param props.selectedAction - The tool currently highlighted by the workspace.
 * @returns A labeled toolbar containing State, Transition, Console, Redo, and
 * Undo buttons.
 *
 * @example
 * ```tsx
 * <section className="canvas-workspace">
 *   <AutomataCanvas />
 *   <CanvasToolbar
 *     onSelectAction={setSelectedTool}
 *     selectedAction={selectedTool}
 *   />
 * </section>
 * ```
 */
export function CanvasToolbar({
  onSelectAction,
  selectedAction,
}: CanvasToolbarProps) {
  /**
   * Marks the clicked toolbar button as the current selection.
   *
   * Button names are defined by this component and provide stable identifiers
   * without coupling selection state to the visible SVG markup. The authored
   * button names are constrained to the shared `CanvasTool` union.
   *
   * @param event - The React mouse event emitted by a canvas toolbar button.
   * @returns Nothing. Selection is delegated to the workspace owner.
   */
  const handleActionSelection = (
    event: MouseEvent<HTMLButtonElement>,
  ): void => {
    onSelectAction(event.currentTarget.name as CanvasTool)
  }

  return (
    <div aria-label="Canvas tools" className="canvas-toolbar" role="toolbar">
      <button
        aria-label="Add state"
        aria-pressed={selectedAction === 'state'}
        className="canvas-toolbar__button"
        data-tooltip="Add state"
        name="state"
        onClick={handleActionSelection}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="canvas-toolbar__icon"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="8" />
          <text
            className="canvas-toolbar__state-label"
            textAnchor="middle"
            x="12"
            y="15.5"
          >
            q
          </text>
        </svg>
      </button>
      <button
        aria-label="Add transition"
        aria-pressed={selectedAction === 'transition'}
        className="canvas-toolbar__button"
        data-tooltip="Add transition"
        name="transition"
        onClick={handleActionSelection}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="canvas-toolbar__icon"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M15 8l4 4-4 4" />
        </svg>
      </button>
      <button
        aria-label="Open console"
        aria-pressed={selectedAction === 'console'}
        className="canvas-toolbar__button"
        data-tooltip="Open console"
        name="console"
        onClick={handleActionSelection}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="canvas-toolbar__icon"
          fill="none"
          viewBox="0 0 24 24"
        >
          <rect height="16" rx="2" width="18" x="3" y="4" />
          <path d="m7 9 3 3-3 3M13 15h4" />
        </svg>
      </button>
      <button
        aria-label="Redo"
        aria-pressed={selectedAction === 'redo'}
        className="canvas-toolbar__button"
        data-tooltip="Redo"
        name="redo"
        onClick={handleActionSelection}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="canvas-toolbar__icon"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="m15 4 5 5-5 5" />
          <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
        </svg>
      </button>
      <button
        aria-label="Undo"
        aria-pressed={selectedAction === 'undo'}
        className="canvas-toolbar__button"
        data-tooltip="Undo"
        name="undo"
        onClick={handleActionSelection}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="canvas-toolbar__icon"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="m9 4-5 5 5 5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
        </svg>
      </button>
    </div>
  )
}
