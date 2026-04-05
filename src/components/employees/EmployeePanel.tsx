import { useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { EmployeeModal } from '../modals/EmployeeModal';
import type { Employee } from '../../types';

export function EmployeePanel() {
  const { employees, deleteEmployee } = useEmployees();
  const [modalEmployee, setModalEmployee] = useState<Employee | undefined | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
          Empleados ({employees.length})
        </h3>
        <button
          onClick={() => setModalEmployee(undefined)}
          style={addBtnStyle}
        >
          + Agregar
        </button>
      </div>

      {employees.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
          Sin empleados. Agrega el primero.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {employees.map((emp) => (
            <div key={emp.id}>
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
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: emp.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}
                >
                  {emp.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {emp.name}
                  </div>
                  {emp.role && (
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{emp.role}</div>
                  )}
                </div>
                <button
                  onClick={() => setModalEmployee(emp)}
                  aria-label={`Editar ${emp.name}`}
                  style={iconBtnStyle}
                >
                  ✏️
                </button>
                <button
                  onClick={() => setConfirmDeleteId(emp.id)}
                  aria-label={`Eliminar ${emp.name}`}
                  style={iconBtnStyle}
                >
                  🗑️
                </button>
              </div>

              {confirmDeleteId === emp.id && (
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
                    ¿Eliminar a <strong>{emp.name}</strong>? Se borrarán todos sus turnos.
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        deleteEmployee(emp.id);
                        setConfirmDeleteId(null);
                      }}
                      style={{ ...iconBtnStyle, backgroundColor: '#dc2626', color: '#fff', padding: '4px 10px', borderRadius: 6, border: 'none', fontWeight: 600 }}
                    >
                      Sí, eliminar
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      style={{ ...iconBtnStyle, backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 6, border: 'none' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalEmployee !== null && (
        <EmployeeModal
          employee={modalEmployee}
          onClose={() => setModalEmployee(null)}
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
