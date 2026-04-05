import { useMemo, useState } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import { useEmployees } from '../../hooks/useEmployees';
import { useShiftTypes } from '../../hooks/useShiftTypes';
import { GridHeader } from './GridHeader';
import { GridRow } from './GridRow';
import { AssignShiftModal } from '../modals/AssignShiftModal';
import type { ShiftType } from '../../types';

export function ScheduleGrid() {
  const { days, assignmentMap, setAssignment } = useSchedule();
  const { employees } = useEmployees();
  const { shiftTypes } = useShiftTypes();

  const [clickedCell, setClickedCell] = useState<{ employeeId: string; date: string } | null>(null);

  const shiftTypeMap = useMemo(() => {
    const map = new Map<string, ShiftType>();
    for (const s of shiftTypes) map.set(s.id, s);
    return map;
  }, [shiftTypes]);

  const colCount = employees.length + 1; // +1 for the day label column
  const gridTemplateColumns = `120px repeat(${employees.length}, minmax(100px, 1fr))`;

  if (employees.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          gap: 12,
          color: '#6b7280',
        }}
      >
        <span style={{ fontSize: '2rem' }}>👤</span>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem', color: '#374151' }}>
          Sin empleados
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Agrega tu primer empleado usando el botón "Empleados".
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns,
            minWidth: `${120 + employees.length * 100}px`,
          }}
        >
          <GridHeader employees={employees} />
          {days.map((date) => (
            <GridRow
              key={date}
              date={date}
              employees={employees}
              assignmentMap={assignmentMap}
              shiftTypeMap={shiftTypeMap}
              onCellClick={(employeeId, d) => setClickedCell({ employeeId, date: d })}
            />
          ))}
        </div>
      </div>

      {clickedCell && (
        <AssignShiftModal
          employeeId={clickedCell.employeeId}
          date={clickedCell.date}
          currentShiftTypeId={
            (assignmentMap.get(`${clickedCell.employeeId}::${clickedCell.date}` as `${string}::${string}`) ?? null)
          }
          onClose={() => setClickedCell(null)}
          onSelect={(shiftTypeId) => {
            setAssignment(clickedCell.employeeId, clickedCell.date, shiftTypeId);
            setClickedCell(null);
          }}
        />
      )}
      {/* suppress unused variable warning */}
      <span style={{ display: 'none' }}>{colCount}</span>
    </>
  );
}
