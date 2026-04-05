import { ViewToggle } from '../controls/ViewToggle';
import { DateNavigator } from '../controls/DateNavigator';

interface Props {
  activePanel: 'employees' | 'shifts' | null;
  onTogglePanel: (panel: 'employees' | 'shifts') => void;
}

export function Header({ activePanel, onTogglePanel }: Props) {
  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          height: 56,
          flexWrap: 'wrap',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.02em',
            flex: '0 0 auto',
          }}
        >
          📅 Cuadrante de Turnos
        </h1>

        <div style={{ flex: 1 }} />

        <ViewToggle />
        <DateNavigator />

        <div style={{ display: 'flex', gap: 8 }}>
          <PanelButton
            label="👤 Empleados"
            active={activePanel === 'employees'}
            onClick={() => onTogglePanel('employees')}
          />
          <PanelButton
            label="🕐 Turnos"
            active={activePanel === 'shifts'}
            onClick={() => onTogglePanel('shifts')}
          />
        </div>
      </div>
    </header>
  );
}

function PanelButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        border: '1px solid',
        borderColor: active ? '#4F46E5' : '#d1d5db',
        borderRadius: 8,
        backgroundColor: active ? '#EEF2FF' : '#ffffff',
        color: active ? '#4F46E5' : '#374151',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: active ? 700 : 500,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}
