import { useState } from 'react';
import type { ShiftType } from '../../types';
import { getContrastColor } from '../../utils/colorUtils';
import { ShiftBadge } from '../schedule/ShiftBadge';

interface Props {
  initial?: ShiftType;
  onSubmit: (data: Omit<ShiftType, 'id'>) => void;
  onCancel: () => void;
  existingNames: string[];
}

export function ShiftTypeForm({ initial, onSubmit, onCancel, existingNames }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [shortCode, setShortCode] = useState(initial?.shortCode ?? '');
  const [color, setColor] = useState(initial?.color ?? '#4F46E5');
  const [error, setError] = useState('');

  const textColor = getContrastColor(color);
  const preview: ShiftType = { id: 'preview', name: name || 'Turno', shortCode: shortCode || '?', color, textColor };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCode = shortCode.trim().toUpperCase();
    if (!trimmedName) { setError('El nombre es obligatorio.'); return; }
    if (!trimmedCode) { setError('El código es obligatorio.'); return; }
    if (existingNames.some((n) => n.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Ya existe un tipo de turno con ese nombre.');
      return;
    }
    onSubmit({ name: trimmedName, shortCode: trimmedCode, color, textColor });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', backgroundColor: '#f9fafb', borderRadius: 8 }}>
        <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Vista previa:</span>
        <ShiftBadge shiftType={preview} />
      </div>

      <div>
        <label style={labelStyle}>Nombre *</label>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="Ej: Mañana, Tarde, Guardia…"
          style={inputStyle}
          autoFocus
        />
        {error && <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#dc2626' }}>{error}</p>}
      </div>

      <div>
        <label style={labelStyle}>Código corto *</label>
        <input
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value.toUpperCase().slice(0, 3))}
          placeholder="Ej: M, T, N"
          maxLength={3}
          style={{ ...inputStyle, width: 80 }}
        />
        <span style={{ marginLeft: 8, fontSize: '0.78rem', color: '#9ca3af' }}>máx. 3 caracteres</span>
      </div>

      <div>
        <label style={labelStyle}>Color</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: 44, height: 36, padding: 2, border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer' }}
          />
          <input
            value={color}
            onChange={(e) => {
              if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColor(e.target.value);
            }}
            style={{ ...inputStyle, width: 100, fontFamily: 'monospace' }}
            maxLength={7}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
        <button type="button" onClick={onCancel} style={cancelBtnStyle}>Cancelar</button>
        <button type="submit" style={submitBtnStyle}>{initial ? 'Guardar cambios' : 'Agregar turno'}</button>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const cancelBtnStyle: React.CSSProperties = { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 8, backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' };
const submitBtnStyle: React.CSSProperties = { padding: '8px 16px', border: 'none', borderRadius: 8, backgroundColor: '#4F46E5', color: '#ffffff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 };
