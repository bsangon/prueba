import { useAppContext } from '../../store/AppContext';

export function ViewToggle() {
  const { state, dispatch } = useAppContext();
  const { viewMode } = state;

  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 3,
        gap: 2,
      }}
    >
      {(['weekly', 'monthly'] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: mode })}
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.8rem',
            backgroundColor: viewMode === mode ? '#ffffff' : 'transparent',
            color: viewMode === mode ? '#111827' : '#6b7280',
            boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {mode === 'weekly' ? 'Semana' : 'Mes'}
        </button>
      ))}
    </div>
  );
}
