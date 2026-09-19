/**
 * Provides the sidebar list used to create, display, and remove DFA machines.
 *
 * Machine-name entry state is kept separate from the sidebar's disclosure and
 * resizing responsibilities. The component currently stores names in memory;
 * domain-backed machine creation can replace that local state later.
 */

import { useId, useState } from 'react'
import type { ChangeEvent, FormEvent, MouseEvent } from 'react'

import type { Machine } from '@/domain/Machine'
import '@/styles/machine-list.css'

interface MachineListProps {
  activeMachineId: number | null
  machines: readonly Machine[]
  onCreateMachine: (name: string) => void
  onOpenMachine: (machineId: number) => void
  onRemoveMachine: (machineId: number) => void
}

/**
 * Renders the DFA section and its inline machine-name entry workflow.
 *
 * Selecting the plus button reveals a focused text field beneath the DFA row.
 * Submitting the form with Enter trims the input, ignores an empty name,
 * delegates creation to the workspace owner, and hides the field. Selecting a
 * machine name opens or activates its associated canvas tab.
 *
 * @param props - Machine data and operations supplied by the workspace owner.
 * @param props.activeMachineId - Identifier of the machine associated with the
 * visible canvas, or `null` when no machine is active.
 * @param props.machines - Created machines displayed below the DFA heading.
 * @param props.onCreateMachine - Creates a machine from a validated name.
 * @param props.onOpenMachine - Opens or activates the selected machine.
 * @param props.onRemoveMachine - Removes the selected machine and its tab.
 * @returns The Machines heading, DFA row, optional name field, and created
 * machine names.
 *
 * @example
 * ```tsx
 * <aside aria-label="Sidebar">
 *   <MachineList
 *     activeMachineId={null}
 *     machines={[]}
 *     onCreateMachine={createMachine}
 *     onOpenMachine={openMachine}
 *     onRemoveMachine={removeMachine}
 *   />
 * </aside>
 * ```
 */
export function MachineList({
  activeMachineId,
  machines,
  onCreateMachine,
  onOpenMachine,
  onRemoveMachine,
}: MachineListProps) {
  const headingId = useId()
  const [isNameFieldVisible, setIsNameFieldVisible] = useState(false)
  const [machineNameDraft, setMachineNameDraft] = useState('')

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
   * Dismisses an unfinished machine name when the field loses focus.
   *
   * Native input blur occurs when the user clicks elsewhere or moves keyboard
   * focus away. The unfinished draft is cleared so reopening the field starts
   * with a clean value.
   *
   * @returns Nothing. Draft and visibility states are reset as side effects.
   */
  const handleMachineNameBlur = (): void => {
    setMachineNameDraft('')
    setIsNameFieldVisible(false)
  }

  /**
   * Creates a sidebar machine entry from the current name draft.
   *
   * Browser form submission is prevented so pressing Enter does not reload the
   * page. Surrounding whitespace is removed, and blank names leave the field
   * open for correction. A valid name is sent to the workspace owner before the
   * draft is cleared and the input is hidden.
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

    onCreateMachine(machineName)
    setMachineNameDraft('')
    setIsNameFieldVisible(false)
  }

  /**
   * Opens or activates the machine represented by a clicked name button.
   *
   * @param event - The React mouse event emitted by the machine-name button.
   * @returns Nothing. Selection is delegated to the workspace owner.
   */
  const handleOpenMachine = (event: MouseEvent<HTMLButtonElement>): void => {
    onOpenMachine(Number(event.currentTarget.value))
  }

  /**
   * Removes the machine associated with a row's minus button.
   *
   * Each remove button carries the stable numeric identifier assigned when the
   * machine was created. The identifier is read from the native button value
   * and forwarded to the workspace owner, which also removes any matching tab.
   *
   * @param event - The React mouse event emitted by a machine's remove button.
   * @returns Nothing. Removal is delegated to the workspace owner.
   */
  const handleRemoveMachine = (event: MouseEvent<HTMLButtonElement>): void => {
    onRemoveMachine(Number(event.currentTarget.value))
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
            onBlur={handleMachineNameBlur}
            onChange={handleMachineNameChange}
            type="text"
            value={machineNameDraft}
          />
        </form>
      )}
      {machines.length > 0 && (
        <ul aria-label="DFA machines" className="machine-list__names">
          {machines.map((machine) => (
            <li
              className="machine-list__item"
              data-active={machine.id === activeMachineId}
              key={machine.id}
            >
              <button
                aria-pressed={machine.id === activeMachineId}
                className="machine-list__name-button"
                onClick={handleOpenMachine}
                type="button"
                value={machine.id}
              >
                {machine.name}
              </button>
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
