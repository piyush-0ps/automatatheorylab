/** Defines a positioned state belonging to an automata machine. */

export interface StatePosition {
  readonly x: number
  readonly y: number
}

export interface AutomataState extends StatePosition {
  readonly id: number
  readonly name: string
}
