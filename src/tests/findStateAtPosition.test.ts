/** Verifies circular state hit testing and topmost-state selection. */

import { describe, expect, it } from 'vitest'

import { findStateAtPosition } from '@/rendering/findStateAtPosition'

describe('findStateAtPosition', () => {
  it('returns the last rendered state under the pointer', () => {
    const states = [
      { id: 0, name: 'q0', x: 100, y: 100 },
      { id: 1, name: 'q1', x: 110, y: 100 },
    ]

    expect(findStateAtPosition(states, { x: 105, y: 100 })?.name).toBe('q1')
    expect(findStateAtPosition(states, { x: 200, y: 200 })).toBeNull()
  })
})
