import type { ShiftType } from '../../types';
import { ShiftBadge } from './ShiftBadge';

interface Props {
  employeeId: string;
  date: string;
  shiftType?: ShiftType;
  onClick: () => void;
  isWeekend: boolean;
}

export function GridCell({ shiftType, onClick, isWeekend }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
        cursor: 'pointer',
        backgroundColor: isWeekend ? '#f3f4f6' : '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        borderRight: '1px solid #e5e7eb',
        transition: 'background-color 0.1s',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#eff6ff';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = isWeekend ? '#f3f4f6' : '#ffffff';
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 2px #4F46E5 inset';
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {shiftType ? (
        <ShiftBadge shiftType={shiftType} />
      ) : (
        <span
          style={{
            color: '#d1d5db',
            fontSize: '1.25rem',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          +
        </span>
      )}
    </div>
  );
}
