/** Composes the root application layout from global UI components. */

import { AutomataCanvas } from '@/components/AutomataCanvas'
import { Sidebar } from '@/components/Sidebar'
import '@/styles/app.css'

/**
 * Renders the application composition root.
 *
 * The layout places the collapsible sidebar before the automata canvas. The
 * sidebar uses native HTML disclosure behavior, while the canvas occupies all
 * remaining viewport space.
 *
 * @returns The complete application layout containing the sidebar and canvas.
 *
 * @example
 * ```tsx
 * createRoot(document.getElementById('root')!).render(<App />)
 * ```
 */
export function App() {
  return (
    <main className="app-layout">
      <Sidebar />
      <AutomataCanvas />
    </main>
  )
}
