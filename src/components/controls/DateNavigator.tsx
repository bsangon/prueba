import { useMemo } from 'react';
import { useAppContext } from '../../store/AppContext';
import { useSchedule } from '../../hooks/useSchedule';
import { navigateDate, formatWindowLabel, toISO } from '../../utils/dateUtils';

export function DateNavigator() {
  const { state, dispatch } = useAppContext();
  const { currentDate, viewMode } = state;
  const { days } = useSchedule();

  const label = useMemo(() => formatWindowLabel(days, viewMode), [days, viewMode]);

  function go(direction: -1 | 1) {
    dispatch({
      type: 'SET_CURRENT_DATE',
      payload: navigateDate(currentDate, direction, viewMode),
    });
  }

  function goToday() {
    dispatch({ type: 'SET_CURRENT_DATE', payload: toISO(new Date()) });
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={() => go(-1)}
        aria-label="Periodo anterior"
        style={arrowBtnStyle}
      >
        ←
      </button>

      <button
        onClick={goToday}
        style={{
          padding: '5px 10px',
          border: '1px solid #d1d5db',
          borderRadius: 8,
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#374151',
        }}
      >
        Hoy
      </button>

      <button
        onClick={() => go(1)}
        aria-label="Periodo siguiente"
        style={arrowBtnStyle}
      >
        →
      </button>

      <span
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#374151',
          minWidth: 180,
          textAlign: 'center',
          textTransform: 'capitalize',
        }}
      >
        {label}
      </span>
    </div>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  fontSize: '1rem',
  color: '#374151',
};
