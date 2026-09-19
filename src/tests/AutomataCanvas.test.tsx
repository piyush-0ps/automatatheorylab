/** Verifies the canvas component exposes one accessible native drawing surface. */

import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AutomataCanvas } from '@/components/AutomataCanvas'

describe('AutomataCanvas', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders one native canvas without surrounding interface controls', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    const { container } = render(<AutomataCanvas />)

    expect(screen.getByLabelText('Automata workspace')).toBeInstanceOf(
      HTMLCanvasElement,
    )
    expect(container.querySelectorAll('canvas')).toHaveLength(1)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
