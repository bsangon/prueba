import type { Employee, ShiftType, AssignmentKey } from '../../types';
import { GridCell } from './GridCell';
import { formatDayLabel, isWeekend, isToday } from '../../utils/dateUtils';

interface Props {
  date: string;
  employees: Employee[];
  assignmentMap: Map<AssignmentKey, string | null>;
  shiftTypeMap: Map<string, ShiftType>;
  onCellClick: (employeeId: string, date: string) => void;
}

export function GridRow({ date, employees, assignmentMap, shiftTypeMap, onCellClick }: Props) {
  const weekend = isWeekend(date);
  const today = isToday(date);
  const label = formatDayLabel(date);

  return (
    <>
      {/* Day label cell */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          minHeight: 44,
          backgroundColor: weekend ? '#f3f4f6' : '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          borderRight: '1px solid #e5e7eb',
          position: 'sticky',
          left: 0,
          zIndex: 1,
          fontWeight: today ? 700 : 500,
          fontSize: '0.8rem',
          color: today ? '#4F46E5' : weekend ? '#6b7280' : '#374151',
          whiteSpace: 'nowrap',
          textTransform: 'capitalize',
          gap: 6,
        }}
      >
        {today && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#4F46E5',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
        )}
        {label}
      </div>

      {/* Employee cells */}
      {employees.map((emp) => {
        const key = `${emp.id}::${date}` as AssignmentKey;
        const shiftTypeId = assignmentMap.get(key) ?? null;
        const shiftType = shiftTypeId ? shiftTypeMap.get(shiftTypeId) : undefined;
        return (
          <GridCell
            key={emp.id}
            employeeId={emp.id}
            date={date}
            shiftType={shiftType}
            onClick={() => onCellClick(emp.id, date)}
            isWeekend={weekend}
          />
        );
      })}
    </>
  );
}
