import { useState } from 'react';
import { AppProvider } from './store/AppContext';
import { Header } from './components/layout/Header';
import { ScheduleGrid } from './components/schedule/ScheduleGrid';
import { EmployeePanel } from './components/employees/EmployeePanel';
import { ShiftTypePanel } from './components/shifts/ShiftTypePanel';

type PanelType = 'employees' | 'shifts' | null;

function AppContent() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  function togglePanel(panel: 'employees' | 'shifts') {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      <Header activePanel={activePanel} onTogglePanel={togglePanel} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Main grid area */}
        <main style={{ flex: 1, padding: 24, overflowX: 'auto', minWidth: 0 }}>
          <ScheduleGrid />
        </main>

        {/* Side panel */}
        {activePanel && (
          <aside
            style={{
              width: 280,
              borderLeft: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              padding: '0 16px',
              overflowY: 'auto',
              flexShrink: 0,
            }}
          >
            {activePanel === 'employees' && <EmployeePanel />}
            {activePanel === 'shifts' && <ShiftTypePanel />}
          </aside>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
