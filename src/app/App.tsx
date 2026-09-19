/** Composes the root application layout from global UI components. */

import { AutomataCanvas } from '@/components/AutomataCanvas'
import { CanvasToolbar } from '@/components/CanvasToolbar'
import { Sidebar } from '@/components/Sidebar'
import '@/styles/app.css'

/**
 * Renders the application composition root.
 *
 * The layout places the collapsible sidebar before the canvas workspace. The
 * workspace allows the canvas to occupy all remaining viewport space while its
 * toolbar is positioned independently as a bottom-centered overlay.
 *
 * @returns The complete application layout containing the sidebar, canvas, and
 * canvas toolbar.
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
      <section aria-label="Canvas workspace" className="canvas-workspace">
        <AutomataCanvas />
        <CanvasToolbar />
      </section>
    </main>
  )
}
