/** Verifies the canvas toolbar exposes the requested placeholder actions. */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CanvasToolbar } from '@/components/CanvasToolbar'

describe('CanvasToolbar', () => {
  it('renders the five requested symbol buttons in order', () => {
    render(<CanvasToolbar />)
    const toolbar = screen.getByRole('toolbar', { name: 'Canvas tools' })
    const buttons = within(toolbar).getAllByRole('button')

    expect(buttons).toHaveLength(5)
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Add state',
      'Add transition',
      'Open console',
      'Redo',
      'Undo',
    ])
    expect(buttons.map((button) => button.dataset.tooltip)).toEqual([
      'Add state',
      'Add transition',
      'Open console',
      'Redo',
      'Undo',
    ])
    expect(within(toolbar).queryByText('State')).not.toBeInTheDocument()
    expect(within(buttons[0]!).getByText('q')).toBeInTheDocument()
  })

  it('highlights only the most recently selected button', async () => {
    const user = userEvent.setup()
    render(<CanvasToolbar />)
    const stateButton = screen.getByRole('button', { name: 'Add state' })
    const transitionButton = screen.getByRole('button', {
      name: 'Add transition',
    })

    expect(stateButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(stateButton)
    expect(stateButton).toHaveAttribute('aria-pressed', 'true')

    await user.click(transitionButton)
    expect(stateButton).toHaveAttribute('aria-pressed', 'false')
    expect(transitionButton).toHaveAttribute('aria-pressed', 'true')
  })
})
