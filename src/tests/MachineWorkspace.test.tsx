/** Verifies sidebar machines, workspace tabs, and canvas association together. */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { App } from '@/app/App'

describe('machine workspace', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens machine names as ordered tabs and associates the active canvas', async () => {
    const user = userEvent.setup()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    render(<App />)

    const addMachineButton = screen.getByRole('button', {
      name: 'Add DFA machine',
    })

    await user.click(addMachineButton)
    await user.type(
      screen.getByRole('textbox', { name: 'DFA machine name' }),
      'First machine{Enter}',
    )
    await user.click(addMachineButton)
    await user.type(
      screen.getByRole('textbox', { name: 'DFA machine name' }),
      'Second machine{Enter}',
    )

    await user.click(
      screen.getByRole('button', { name: 'First machine', pressed: false }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Second machine', pressed: false }),
    )

    const openTabs = screen.getAllByRole('tab')
    expect(openTabs.map((tab) => tab.textContent)).toEqual([
      'First machine',
      'Second machine',
    ])
    expect(screen.getByRole('tab', { name: 'Second machine' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByLabelText('Second machine canvas')).toHaveAttribute(
      'data-machine-id',
      '1',
    )

    await user.click(screen.getByRole('tab', { name: 'First machine' }))

    expect(screen.getByRole('tab', { name: 'First machine' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByLabelText('First machine canvas')).toHaveAttribute(
      'data-machine-id',
      '0',
    )

    await user.click(
      screen.getByRole('button', { name: 'Close First machine' }),
    )

    expect(
      screen.queryByRole('tab', { name: 'First machine' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'First machine', pressed: false }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Second machine' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByLabelText('Second machine canvas')).toHaveAttribute(
      'data-machine-id',
      '1',
    )
  })
})
