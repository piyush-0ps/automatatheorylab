/**
 * Provides the sidebar list used to create, display, and remove DFA machines.
 *
 * Machine-name entry state is kept separate from the sidebar's disclosure and
 * resizing responsibilities. The component currently stores names in memory;
 * domain-backed machine creation can replace that local state later.
 */

import { useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, MouseEvent } from 'react'

import '@/styles/machine-list.css'

interface NamedMachine {
  id: number
  name: string
}

/**
 * Renders the DFA section and its inline machine-name entry workflow.
 *
 * The component accepts no parameters. Selecting the plus button reveals a
 * focused text field beneath the DFA row. Submitting the form with Enter trims
 * the input, ignores an empty name, appends a named machine, and hides the
 * field. Created machines remain local to this component for now.
 *
 * @returns The Machines heading, DFA row, optional name field, and created
 * machine names.
 *
 * @example
 * ```tsx
 * <aside aria-label="Sidebar">
 *   <MachineList />
 * </aside>
 * ```
 */
export function MachineList() {
  const headingId = useId()
  const nextMachineId = useRef(0)
  const [isNameFieldVisible, setIsNameFieldVisible] = useState(false)
  const [machineNameDraft, setMachineNameDraft] = useState('')
  const [machines, setMachines] = useState<NamedMachine[]>([])

  /**
   * Reveals the machine-name field below the DFA row.
   *
   * The newly mounted input uses native autofocus, so no manual DOM focus
   * management is required.
   *
   * @returns Nothing. Input visibility state is updated as a side effect.
   */
  const handleStartAddingMachine = (): void => {
    setIsNameFieldVisible(true)
  }

  /**
   * Synchronizes the controlled machine-name field with the user's input.
   *
   * @param event - The React change event emitted by the text input.
   * @returns Nothing. The current draft name is updated as a side effect.
   */
  const handleMachineNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setMachineNameDraft(event.currentTarget.value)
  }

  /**
   * Creates a sidebar machine entry from the current name draft.
   *
   * Browser form submission is prevented so pressing Enter does not reload the
   * page. Surrounding whitespace is removed, and blank names leave the field
   * open for correction. A valid name receives a stable local identifier before
   * the draft is cleared and the input is hidden.
   *
   * @param event - The React form event raised by pressing Enter in the field.
   * @returns Nothing. Machine-list and input states are updated as side effects.
   */
  const handleMachineNameSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const machineName = machineNameDraft.trim()

    if (!machineName) {
      return
    }

    const machineId = nextMachineId.current
    nextMachineId.current += 1

    setMachines((currentMachines) => [
      ...currentMachines,
      { id: machineId, name: machineName },
    ])
    setMachineNameDraft('')
    setIsNameFieldVisible(false)
  }

  /**
   * Removes the machine associated with a row's minus button.
   *
   * Each remove button carries the stable numeric identifier assigned when the
   * machine was created. The identifier is read from the native button value
   * and used to produce a new list without mutating existing state.
   *
   * @param event - The React mouse event emitted by a machine's remove button.
   * @returns Nothing. The machine list is filtered as a side effect.
   */
  const handleRemoveMachine = (event: MouseEvent<HTMLButtonElement>): void => {
    const machineId = Number(event.currentTarget.value)

    setMachines((currentMachines) =>
      currentMachines.filter((machine) => machine.id !== machineId),
    )
  }

  return (
    <section aria-labelledby={headingId}>
      <h2 className="machine-list__heading" id={headingId}>
        Machines
      </h2>
      <div className="machine-list__type-row">
        <span>DFA</span>
        <button
          aria-label="Add DFA machine"
          className="machine-list__add-button"
          onClick={handleStartAddingMachine}
          type="button"
        >
          +
        </button>
      </div>
      {isNameFieldVisible && (
        <form
          className="machine-list__name-form"
          onSubmit={handleMachineNameSubmit}
        >
          <input
            aria-label="DFA machine name"
            autoFocus
            className="machine-list__name-input"
            onChange={handleMachineNameChange}
            type="text"
            value={machineNameDraft}
          />
        </form>
      )}
      {machines.length > 0 && (
        <ul aria-label="DFA machines" className="machine-list__names">
          {machines.map((machine) => (
            <li className="machine-list__item" key={machine.id}>
              <span>{machine.name}</span>
              <button
                aria-label={`Remove ${machine.name}`}
                className="machine-list__remove-button"
                onClick={handleRemoveMachine}
                type="button"
                value={machine.id}
              >
                −
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
