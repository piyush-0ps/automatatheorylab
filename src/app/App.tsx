/** Composes the root application layout from global UI components. */

import { useState } from 'react'

import { AutomataCanvas } from '@/components/AutomataCanvas'
import { CanvasTabBar } from '@/components/CanvasTabBar'
import { CanvasToolbar } from '@/components/CanvasToolbar'
import { Sidebar } from '@/components/Sidebar'
import { useMachineWorkspace } from '@/hooks/useMachineWorkspace'
import type { CanvasTool } from '@/types/CanvasTool'
import '@/styles/app.css'

/**
 * Renders the application composition root.
 *
 * The layout places the collapsible sidebar before the canvas workspace. Shared
 * machine state connects sidebar names to ordered workspace tabs and associates
 * the active tab with the canvas. The toolbar remains independently positioned
 * as a bottom-centered overlay.
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
  const machineWorkspace = useMachineWorkspace()
  const [selectedCanvasTool, setSelectedCanvasTool] =
    useState<CanvasTool | null>(null)

  return (
    <main className="app-layout">
      <Sidebar
        activeMachineId={machineWorkspace.activeMachine?.id ?? null}
        machines={machineWorkspace.machines}
        onCreateMachine={machineWorkspace.createMachine}
        onOpenMachine={machineWorkspace.openMachine}
        onRemoveMachine={machineWorkspace.removeMachine}
      />
      <section aria-label="Canvas workspace" className="canvas-workspace">
        <CanvasTabBar
          activeMachineId={machineWorkspace.activeMachine?.id ?? null}
          machines={machineWorkspace.openMachines}
          onCloseMachine={machineWorkspace.closeMachineTab}
          onSelectMachine={machineWorkspace.openMachine}
        />
        <AutomataCanvas
          activeTool={selectedCanvasTool}
          machine={machineWorkspace.activeMachine}
          onAddState={machineWorkspace.addState}
          onMoveState={machineWorkspace.moveState}
        />
        <CanvasToolbar
          onSelectAction={setSelectedCanvasTool}
          selectedAction={selectedCanvasTool}
        />
      </section>
    </main>
  )
}
