/** Verifies inline DFA machine-name creation in the sidebar list. */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { MachineList } from '@/components/MachineList'

describe('MachineList', () => {
  it('reveals the name field and adds the submitted machine below DFA', async () => {
    const user = userEvent.setup()
    render(<MachineList />)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add DFA machine' }))
    const nameField = screen.getByRole('textbox', {
      name: 'DFA machine name',
    })

    expect(nameField).toHaveFocus()

    await user.type(nameField, '  Firstdfamachine{Enter}')

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(
      screen.getByRole('list', { name: 'DFA machines' }),
    ).toHaveTextContent('Firstdfamachine')
  })

  it('keeps the field open when an empty name is submitted', async () => {
    const user = userEvent.setup()
    render(<MachineList />)

    await user.click(screen.getByRole('button', { name: 'Add DFA machine' }))
    const nameField = screen.getByRole('textbox', {
      name: 'DFA machine name',
    })
    await user.type(nameField, '   {Enter}')

    expect(nameField).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('removes a named machine through its row action', async () => {
    const user = userEvent.setup()
    render(<MachineList />)

    await user.click(screen.getByRole('button', { name: 'Add DFA machine' }))
    await user.type(
      screen.getByRole('textbox', { name: 'DFA machine name' }),
      'Machine to remove{Enter}',
    )

    expect(screen.getByText('Machine to remove')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Remove Machine to remove' }),
    )

    expect(screen.queryByText('Machine to remove')).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
