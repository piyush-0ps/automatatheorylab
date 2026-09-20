/** Verifies machine-specific state storage and sequential state naming. */

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useMachineWorkspace } from '@/hooks/useMachineWorkspace'

describe('useMachineWorkspace', () => {
  it('names states sequentially and keeps them associated with their machine', () => {
    const { result } = renderHook(() => useMachineWorkspace())

    act(() => {
      result.current.createMachine('First')
      result.current.createMachine('Second')
    })
    act(() => {
      result.current.addState(0, { x: 100, y: 120 })
      result.current.addState(0, { x: 220, y: 180 })
      result.current.addState(1, { x: 80, y: 90 })
    })
    act(() => {
      result.current.moveState(0, 0, { x: 160, y: 140 })
    })

    expect(result.current.machines[0]?.states).toEqual([
      { id: 0, name: 'q0', x: 160, y: 140 },
      { id: 1, name: 'q1', x: 220, y: 180 },
    ])
    expect(result.current.machines[1]?.states).toEqual([
      { id: 0, name: 'q0', x: 80, y: 90 },
    ])
  })
})
