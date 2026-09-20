/**
 * Defines the minimal machine identity shared by the current user interface.
 *
 * Automata states and transitions will extend the domain later. For now, the
 * stable identifier keeps sidebar entries, tabs, and canvases associated while
 * the user-facing name remains editable presentation data.
 */

import type { AutomataState } from '@/domain/AutomataState'

export interface Machine {
  readonly id: number
  readonly name: string
  readonly states: readonly AutomataState[]
}
