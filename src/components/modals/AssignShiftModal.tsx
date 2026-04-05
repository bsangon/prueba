import { Modal } from './Modal';
import { useEmployees } from '../../hooks/useEmployees';
import { useShiftTypes } from '../../hooks/useShiftTypes';
import { formatFullDate } from '../../utils/dateUtils';

interface Props {
  employeeId: string;
  date: string;
  currentShiftTypeId: string | null;
  onClose: () => void;
  onSelect: (shiftTypeId: string | null) => void;
}

export function AssignShiftModal({ employeeId, date, currentShiftTypeId, onClose, onSelect }: Props) {
  const { employees } = useEmployees();
  const { shiftTypes } = useShiftTypes();

  const employee = employees.find((e) => e.id === employeeId);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={employee ? `${employee.name}` : 'Asignar turno'}
    >
      <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#6b7280', textTransform: 'capitalize' }}>
        {formatFullDate(date)}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
          marginBottom: 12,
        }}
      >
        {shiftTypes.map((st) => {
          const isActive = st.id === currentShiftTypeId;
          return (
            <button
              key={st.id}
              onClick={() => onSelect(st.id)}
              style={{
                backgroundColor: st.color,
                color: st.textColor,
                border: isActive ? `3px solid ${st.textColor === '#000000' ? '#333' : '#fff'}` : '3px solid transparent',
                borderRadius: 8,
                padding: '10px 12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'transform 0.1s, box-shadow 0.1s',
                boxShadow: isActive ? '0 0 0 2px #4F46E5' : '0 1px 3px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              <span
                style={{
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  borderRadius: 4,
                  padding: '1px 5px',
                  fontSize: '0.7rem',
                }}
              >
                {st.shortCode}
              </span>
              {st.name}
            </button>
          );
        })}
      </div>

      {currentShiftTypeId && (
        <button
          onClick={() => onSelect(null)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            backgroundColor: '#f9fafb',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          Sin turno (limpiar)
        </button>
      )}
    </Modal>
  );
}
