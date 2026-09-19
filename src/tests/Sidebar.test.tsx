/** Verifies the sidebar uses native disclosure behavior. */

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Sidebar } from '@/components/Sidebar'

/** Renders the sidebar with an empty controlled machine workspace. */
function renderSidebar() {
  return render(
    <Sidebar
      activeMachineId={null}
      machines={[]}
      onCreateMachine={vi.fn()}
      onOpenMachine={vi.fn()}
      onRemoveMachine={vi.fn()}
    />,
  )
}

describe('Sidebar', () => {
  it('renders the referenced machine list and panel toggle', () => {
    renderSidebar()

    expect(screen.getByText('Machines')).toBeInTheDocument()
    expect(screen.getByText('DFA')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add DFA machine' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle sidebar')).toContainElement(
      document.querySelector('.sidebar__toggle-icon'),
    )
  })

  it('starts expanded and toggles through the native panel control', async () => {
    const user = userEvent.setup()
    const { container } = renderSidebar()
    const disclosure = container.querySelector('details')
    const toggle = screen.getByLabelText('Toggle sidebar')

    expect(disclosure).toHaveAttribute('open')

    await user.click(toggle)
    expect(disclosure).not.toHaveAttribute('open')

    await user.click(toggle)
    expect(disclosure).toHaveAttribute('open')
  })

  it('resizes by dragging anywhere along the right-edge separator', () => {
    const { container } = renderSidebar()
    const disclosure = container.querySelector('details')
    const resizeHandle = screen.getByRole('separator', {
      name: 'Resize sidebar',
    })

    vi.spyOn(
      disclosure as HTMLDetailsElement,
      'getBoundingClientRect',
    ).mockReturnValue({
      bottom: 720,
      height: 720,
      left: 0,
      right: 240,
      toJSON: () => ({}),
      top: 0,
      width: 240,
      x: 0,
      y: 0,
    })
    Object.assign(resizeHandle, {
      hasPointerCapture: vi.fn().mockReturnValue(true),
      releasePointerCapture: vi.fn(),
      setPointerCapture: vi.fn(),
    })

    fireEvent.pointerDown(resizeHandle, {
      button: 0,
      clientX: 240,
      pointerId: 1,
    })
    fireEvent.pointerMove(resizeHandle, {
      clientX: 320,
      pointerId: 1,
    })
    fireEvent.pointerUp(resizeHandle, {
      clientX: 320,
      pointerId: 1,
    })

    expect(disclosure).toHaveStyle('--sidebar-width: 320px')
  })
})
