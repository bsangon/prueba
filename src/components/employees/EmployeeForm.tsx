import { useState } from 'react';
import type { Employee } from '../../types';

const AVATAR_COLORS = [
  '#4F46E5', '#DB2777', '#D97706', '#059669',
  '#DC2626', '#7C3AED', '#0891B2', '#65A30D',
];

interface Props {
  initial?: Employee;
  onSubmit: (data: Omit<Employee, 'id' | 'order'>) => void;
  onCancel: () => void;
  existingNames: string[];
}

export function EmployeeForm({ initial, onSubmit, onCancel, existingNames }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [role, setRole] = useState(initial?.role ?? '');
  const [avatarColor, setAvatarColor] = useState(initial?.avatarColor ?? AVATAR_COLORS[0]);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      setError('Ya existe un empleado con ese nombre.');
      return;
    }
    onSubmit({ name: trimmed, role: role.trim() || undefined, avatarColor });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>Nombre *</label>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="Ej: Ana García"
          style={inputStyle}
          autoFocus
        />
        {error && <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#dc2626' }}>{error}</p>}
      </div>

      <div>
        <label style={labelStyle}>Puesto / Rol (opcional)</label>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Ej: Enfermera, Médico…"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Color de avatar</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setAvatarColor(c)}
              aria-label={`Color ${c}`}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: c,
                border: avatarColor === c ? '3px solid #111827' : '3px solid transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
        <button type="button" onClick={onCancel} style={cancelBtnStyle}>
          Cancelar
        </button>
        <button type="submit" style={submitBtnStyle}>
          {initial ? 'Guardar cambios' : 'Agregar empleado'}
        </button>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: '#374151',
};

const submitBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: 8,
  backgroundColor: '#4F46E5',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600,
};
