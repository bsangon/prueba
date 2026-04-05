import { useState } from 'react';
import { useShiftTypes } from '../../hooks/useShiftTypes';
import { ShiftTypeModal } from '../modals/ShiftTypeModal';
import { ShiftBadge } from '../schedule/ShiftBadge';
import type { ShiftType } from '../../types';

export function ShiftTypePanel() {
  const { shiftTypes, deleteShiftType } = useShiftTypes();
  const [modalShift, setModalShift] = useState<ShiftType | undefined | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
          Tipos de turno ({shiftTypes.length})
        </h3>
        <button onClick={() => setModalShift(undefined)} style={addBtnStyle}>
          + Agregar
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {shiftTypes.map((st) => (
          <div key={st.id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                backgroundColor: '#f9fafb',
              }}
            >
              <ShiftBadge shiftType={st} size="sm" />
              <div style={{ flex: 1 }} />
              <button
                onClick={() => setModalShift(st)}
                aria-label={`Editar ${st.name}`}
                style={iconBtnStyle}
              >
                ✏️
              </button>
              <button
                onClick={() => setConfirmDeleteId(st.id)}
                aria-label={`Eliminar ${st.name}`}
                style={iconBtnStyle}
              >
                🗑️
              </button>
            </div>

            {confirmDeleteId === st.id && (
              <div
                style={{
                  backgroundColor: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: 8,
                  padding: '10px 12px',
                  marginTop: 4,
                  fontSize: '0.82rem',
                  color: '#92400e',
                }}
              >
                <p style={{ margin: '0 0 8px' }}>
                  ¿Eliminar el turno <strong>{st.name}</strong>? Las celdas asignadas quedarán vacías.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => { deleteShiftType(st.id); setConfirmDeleteId(null); }}
                    style={{ backgroundColor: '#dc2626', color: '#fff', padding: '4px 10px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    Sí, eliminar
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {modalShift !== null && (
        <ShiftTypeModal
          shiftType={modalShift}
          onClose={() => setModalShift(null)}
        />
      )}
    </div>
  );
}

const addBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#4F46E5',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: '0.82rem',
  fontWeight: 600,
};

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 4,
  borderRadius: 4,
  fontSize: '0.9rem',
  lineHeight: 1,
};
