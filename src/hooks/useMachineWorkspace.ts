/**
 * Coordinates machines opened by the sidebar and displayed by the canvas.
 *
 * The hook owns machine identity, open-tab order, and the active machine so UI
 * components can remain focused on rendering and interaction details.
 */

import { useMemo, useReducer, useRef } from 'react'

import type { StatePosition } from '@/domain/AutomataState'
import type { Machine } from '@/domain/Machine'

interface MachineWorkspaceState {
  machines: Machine[]
  openMachineIds: number[]
  activeMachineId: number | null
}

type MachineWorkspaceAction =
  | { type: 'add-state'; machineId: number; position: StatePosition }
  | { type: 'create'; machine: Machine }
  | { type: 'close'; machineId: number }
  | {
      type: 'move-state'
      machineId: number
      stateId: number
      position: StatePosition
    }
  | { type: 'open'; machineId: number }
  | { type: 'remove'; machineId: number }

export interface MachineWorkspace {
  readonly machines: readonly Machine[]
  readonly openMachines: readonly Machine[]
  readonly activeMachine: Machine | null
  addState: (machineId: number, position: StatePosition) => void
  closeMachineTab: (machineId: number) => void
  createMachine: (name: string) => void
  moveState: (
    machineId: number,
    stateId: number,
    position: StatePosition,
  ) => void
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
  if (action.type === 'add-state') {
    const targetMachine = state.machines.find(
      (machine) => machine.id === action.machineId,
    )

    if (!targetMachine) {
      return state
    }

    const stateId = targetMachine.states.length
    const nextAutomataState = {
      id: stateId,
      name: `q${stateId}`,
      ...action.position,
    }

    return {
      ...state,
      machines: state.machines.map((machine) =>
        machine.id === action.machineId
          ? { ...machine, states: [...machine.states, nextAutomataState] }
          : machine,
      ),
    }
  }

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

  if (action.type === 'move-state') {
    const targetMachine = state.machines.find(
      (machine) => machine.id === action.machineId,
    )
    const stateExists = targetMachine?.states.some(
      (automataState) => automataState.id === action.stateId,
    )

    if (!stateExists) {
      return state
    }

    return {
      ...state,
      machines: state.machines.map((machine) =>
        machine.id === action.machineId
          ? {
              ...machine,
              states: machine.states.map((automataState) =>
                automataState.id === action.stateId
                  ? { ...automataState, ...action.position }
                  : automataState,
              ),
            }
          : machine,
      ),
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
    const machine: Machine = { id: nextMachineId.current, name, states: [] }
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
   * Adds the next sequentially named state to a specific machine.
   *
   * State positions use canvas CSS pixels, allowing rendering to remain stable
   * across different device pixel ratios.
   *
   * @param machineId - Identifier of the machine receiving the new state.
   * @param position - State center relative to the canvas display bounds.
   * @returns Nothing. Workspace state is updated through the reducer.
   */
  const addState = (machineId: number, position: StatePosition): void => {
    dispatch({ type: 'add-state', machineId, position })
  }

  /**
   * Moves an existing state to a new position within its machine canvas.
   *
   * @param machineId - Identifier of the machine that owns the state.
   * @param stateId - Stable identifier of the state being dragged.
   * @param position - New state center in canvas CSS pixels.
   * @returns Nothing. Workspace state is updated through the reducer.
   */
  const moveState = (
    machineId: number,
    stateId: number,
    position: StatePosition,
  ): void => {
    dispatch({ type: 'move-state', machineId, stateId, position })
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
    addState,
    closeMachineTab,
    createMachine,
    moveState,
    openMachine,
    removeMachine,
  }
}
