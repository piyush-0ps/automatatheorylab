/**
 * Provides the application's empty, collapsible sidebar.
 *
 * Expansion is delegated to the native HTML details disclosure element, so
 * the component does not require custom toggle behavior. A dedicated separator
 * on the right edge provides pointer and keyboard resizing.
 */

import { useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'

import '@/styles/sidebar.css'

const DEFAULT_SIDEBAR_WIDTH_PX = 240
const MINIMUM_SIDEBAR_WIDTH_PX = 160
const MAXIMUM_VIEWPORT_WIDTH_RATIO = 0.5
const KEYBOARD_RESIZE_STEP_PX = 16

interface SidebarStyle extends CSSProperties {
  '--sidebar-width': string
}

/**
 * Keeps a requested sidebar width inside the supported viewport bounds.
 *
 * @param requestedWidth - The desired width in CSS pixels, usually calculated
 * from a pointer position or keyboard resize step.
 * @param viewportWidth - The current browser viewport width in CSS pixels.
 * @returns The requested width constrained between the minimum sidebar width
 * and half of the current viewport.
 *
 * @example
 * ```ts
 * constrainSidebarWidth(320, 1280) // 320
 * constrainSidebarWidth(80, 1280) // 160
 * constrainSidebarWidth(900, 1280) // 640
 * ```
 */
function constrainSidebarWidth(
  requestedWidth: number,
  viewportWidth: number,
): number {
  const maximumWidth = Math.max(
    MINIMUM_SIDEBAR_WIDTH_PX,
    viewportWidth * MAXIMUM_VIEWPORT_WIDTH_RATIO,
  )

  return Math.min(
    maximumWidth,
    Math.max(MINIMUM_SIDEBAR_WIDTH_PX, requestedWidth),
  )
}

/**
 * Renders an empty sidebar that supports disclosure and edge resizing.
 *
 * The component accepts no parameters because its initial state and dimensions
 * are currently fixed. Activating the summary element toggles the parent
 * details element's native `open` attribute. When expanded, the separator can
 * be grabbed anywhere along the sidebar's right edge and dragged horizontally.
 * Pointer capture keeps resizing active when the pointer leaves the handle.
 * The empty aside and resize handle are automatically hidden while collapsed.
 *
 * @returns A native disclosure containing an accessible empty sidebar and
 * resize separator.
 *
 * @example
 * ```tsx
 * <main>
 *   <Sidebar />
 *   <Workspace />
 * </main>
 * ```
 */
export function Sidebar() {
  const sidebarReference = useRef<HTMLDetailsElement>(null)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH_PX)
  const sidebarStyle: SidebarStyle = {
    '--sidebar-width': `${sidebarWidth}px`,
  }

  /**
   * Starts a resize gesture and assigns subsequent pointer events to the edge.
   *
   * Only the primary pointer button starts resizing. Pointer capture allows the
   * user to continue dragging after moving beyond the separator's narrow hit
   * area.
   *
   * @param event - The React pointer event raised on the resize separator.
   * @returns Nothing. Pointer capture is set as a side effect.
   */
  const handleResizeStart = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.button !== 0) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  /**
   * Updates the sidebar width while the separator owns the active pointer.
   *
   * The pointer's horizontal position is measured relative to the sidebar's
   * left edge, then constrained to the supported minimum and viewport maximum.
   * Movements without pointer capture are ignored.
   *
   * @param event - The latest pointer movement from the resize separator.
   * @returns Nothing. React sidebar width state is updated as a side effect.
   */
  const handleResizeMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return
    }

    const sidebar = sidebarReference.current

    if (!sidebar) {
      return
    }

    const requestedWidth = event.clientX - sidebar.getBoundingClientRect().left

    setSidebarWidth(constrainSidebarWidth(requestedWidth, window.innerWidth))
  }

  /**
   * Completes a resize gesture by releasing the captured pointer.
   *
   * The guard handles cancellation cases where the browser has already removed
   * capture before React receives the final event.
   *
   * @param event - The pointer event ending or cancelling the resize gesture.
   * @returns Nothing. Existing pointer capture may be released as a side effect.
   */
  const handleResizeEnd = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  /**
   * Resizes the sidebar with the left and right arrow keys.
   *
   * Each supported key changes the width by one fixed step and prevents page
   * scrolling. Other keys retain their default browser behavior.
   *
   * @param event - The keyboard event received by the focused separator.
   * @returns Nothing. Supported keys update React state as a side effect.
   */
  const handleResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return
    }

    event.preventDefault()
    const direction = event.key === 'ArrowLeft' ? -1 : 1

    setSidebarWidth((currentWidth) =>
      constrainSidebarWidth(
        currentWidth + direction * KEYBOARD_RESIZE_STEP_PX,
        window.innerWidth,
      ),
    )
  }

  return (
    <details
      className="sidebar"
      open
      ref={sidebarReference}
      style={sidebarStyle}
    >
      <summary
        aria-label="Toggle sidebar"
        className="sidebar__toggle"
        title="Toggle sidebar"
      />
      <aside aria-label="Sidebar" className="sidebar__content" />
      <div
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        aria-valuemax={Math.round(
          window.innerWidth * MAXIMUM_VIEWPORT_WIDTH_RATIO,
        )}
        aria-valuemin={MINIMUM_SIDEBAR_WIDTH_PX}
        aria-valuenow={Math.round(sidebarWidth)}
        className="sidebar__resize-handle"
        onKeyDown={handleResizeKeyDown}
        onPointerCancel={handleResizeEnd}
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        role="separator"
        tabIndex={0}
        title="Drag to resize sidebar"
      />
    </details>
  )
}
