/** Verifies the sidebar uses native disclosure behavior. */

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Sidebar } from '@/components/Sidebar'

describe('Sidebar', () => {
  it('starts expanded and toggles through the native summary control', async () => {
    const user = userEvent.setup()
    const { container } = render(<Sidebar />)
    const disclosure = container.querySelector('details')
    const toggle = screen.getByLabelText('Toggle sidebar')

    expect(disclosure).toHaveAttribute('open')

    await user.click(toggle)
    expect(disclosure).not.toHaveAttribute('open')

    await user.click(toggle)
    expect(disclosure).toHaveAttribute('open')
  })

  it('resizes by dragging anywhere along the right-edge separator', () => {
    const { container } = render(<Sidebar />)
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
