/**
 * Coordinates machines opened by the sidebar and displayed by the canvas.
 *
 * The hook owns machine identity, open-tab order, and the active machine so UI
 * components can remain focused on rendering and interaction details.
 */

import { useMemo, useReducer, useRef } from 'react'

import type { Machine } from '@/domain/Machine'

interface MachineWorkspaceState {
  machines: Machine[]
  openMachineIds: number[]
  activeMachineId: number | null
}

type MachineWorkspaceAction =
  | { type: 'create'; machine: Machine }
  | { type: 'close'; machineId: number }
  | { type: 'open'; machineId: number }
  | { type: 'remove'; machineId: number }

export interface MachineWorkspace {
  readonly machines: readonly Machine[]
  readonly openMachines: readonly Machine[]
  readonly activeMachine: Machine | null
  closeMachineTab: (machineId: number) => void
  createMachine: (name: string) => void
  openMachine: (machineId: number) => void
  removeMachine: (machineId: number) => void
}

const INITIAL_WORKSPACE_STATE: MachineWorkspaceState = {
  machines: [],
  openMachineIds: [],
  activeMachineId: null,
}

/**
 * Applies one machine workspace action without mutating the previous state.
 *
 * Opening an existing tab activates it without changing tab order. Removing an
 * active machine or closing its active tab selects the last remaining open tab,
 * matching common editor behavior. Closing a tab preserves its sidebar machine.
 * Invalid machine identifiers leave state unchanged.
 *
 * @param state - The current machines, open-tab order, and active identifier.
 * @param action - The create, open, or remove operation to apply.
 * @returns The next workspace state, or the original state for an invalid
 * operation.
 */
function machineWorkspaceReducer(
  state: MachineWorkspaceState,
  action: MachineWorkspaceAction,
): MachineWorkspaceState {
  if (action.type === 'create') {
    return {
      ...state,
      machines: [...state.machines, action.machine],
    }
  }

  if (action.type === 'open') {
    const machineExists = state.machines.some(
      (machine) => machine.id === action.machineId,
    )

    if (!machineExists) {
      return state
    }

    const isAlreadyOpen = state.openMachineIds.includes(action.machineId)

    return {
      ...state,
      openMachineIds: isAlreadyOpen
        ? state.openMachineIds
        : [...state.openMachineIds, action.machineId],
      activeMachineId: action.machineId,
    }
  }

  if (action.type === 'close') {
    if (!state.openMachineIds.includes(action.machineId)) {
      return state
    }

    const remainingOpenMachineIds = state.openMachineIds.filter(
      (machineId) => machineId !== action.machineId,
    )
    const activeMachineId =
      state.activeMachineId === action.machineId
        ? (remainingOpenMachineIds.at(-1) ?? null)
        : state.activeMachineId

    return {
      ...state,
      openMachineIds: remainingOpenMachineIds,
      activeMachineId,
    }
  }

  const remainingMachines = state.machines.filter(
    (machine) => machine.id !== action.machineId,
  )

  if (remainingMachines.length === state.machines.length) {
    return state
  }

  const remainingOpenMachineIds = state.openMachineIds.filter(
    (machineId) => machineId !== action.machineId,
  )
  const activeMachineId =
    state.activeMachineId === action.machineId
      ? (remainingOpenMachineIds.at(-1) ?? null)
      : state.activeMachineId

  return {
    machines: remainingMachines,
    openMachineIds: remainingOpenMachineIds,
    activeMachineId,
  }
}

/**
 * Exposes the coordinated machine state used by the sidebar, tabs, and canvas.
 *
 * Machine identifiers are generated locally and remain stable for the lifetime
 * of the application session. Derived machine objects preserve the explicit
 * order in which their tabs were first opened.
 *
 * @returns Machine collections, the active machine, and operations for creating,
 * opening, closing, and removing machines.
 *
 * @example
 * ```tsx
 * const workspace = useMachineWorkspace()
 * workspace.createMachine('Example DFA')
 * ```
 */
export function useMachineWorkspace(): MachineWorkspace {
  const nextMachineId = useRef(0)
  const [state, dispatch] = useReducer(
    machineWorkspaceReducer,
    INITIAL_WORKSPACE_STATE,
  )

  const openMachines = useMemo(
    () =>
      state.openMachineIds.flatMap((machineId) => {
        const machine = state.machines.find(
          (candidate) => candidate.id === machineId,
        )

        return machine ? [machine] : []
      }),
    [state.machines, state.openMachineIds],
  )
  const activeMachine =
    state.machines.find((machine) => machine.id === state.activeMachineId) ??
    null

  /**
   * Creates a named machine with the next stable session identifier.
   *
   * @param name - The already validated, non-empty display name.
   * @returns Nothing. Workspace state is updated through the reducer.
   */
  const createMachine = (name: string): void => {
    const machine: Machine = { id: nextMachineId.current, name }
    nextMachineId.current += 1
    dispatch({ type: 'create', machine })
  }

  /**
   * Opens a machine tab if needed and makes that machine active.
   *
   * @param machineId - The stable identifier of an existing machine.
   * @returns Nothing. Workspace state is updated through the reducer.
   */
  const openMachine = (machineId: number): void => {
    dispatch({ type: 'open', machineId })
  }

  /**
   * Closes a machine's canvas tab without removing the sidebar machine.
   *
   * @param machineId - The stable identifier of the tab to close.
   * @returns Nothing. Workspace state is updated through the reducer.
   */
  const closeMachineTab = (machineId: number): void => {
    dispatch({ type: 'close', machineId })
  }

  /**
   * Removes a machine, its open tab, and its active association when present.
   *
   * @param machineId - The stable identifier of the machine to remove.
   * @returns Nothing. Workspace state is updated through the reducer.
   */
  const removeMachine = (machineId: number): void => {
    dispatch({ type: 'remove', machineId })
  }

  return {
    machines: state.machines,
    openMachines,
    activeMachine,
    closeMachineTab,
    createMachine,
    openMachine,
    removeMachine,
  }
}
