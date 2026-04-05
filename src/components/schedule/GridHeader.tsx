import type { Employee } from '../../types';

interface Props {
  employees: Employee[];
}

export function GridHeader({ employees }: Props) {
  return (
    <>
      {/* Corner cell */}
      <div
        style={{
          backgroundColor: '#f9fafb',
          borderBottom: '2px solid #e5e7eb',
          borderRight: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 3,
        }}
      />

      {/* Employee column headers */}
      {employees.map((emp) => (
        <div
          key={emp.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 4px',
            backgroundColor: '#f9fafb',
            borderBottom: '2px solid #e5e7eb',
            borderRight: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 2,
            gap: 4,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: emp.avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.8rem',
              flexShrink: 0,
            }}
          >
            {emp.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: '0.78rem',
                color: '#111827',
                maxWidth: 100,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {emp.name.split(' ')[0]}
            </div>
            {emp.role && (
              <div style={{ fontSize: '0.68rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                {emp.role}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
