import type { ShiftType } from '../../types';

interface Props {
  shiftType: ShiftType;
  size?: 'sm' | 'md';
}

export function ShiftBadge({ shiftType, size = 'md' }: Props) {
  const padding = size === 'sm' ? '2px 6px' : '3px 10px';
  const fontSize = size === 'sm' ? '0.7rem' : '0.75rem';
  return (
    <span
      style={{
        backgroundColor: shiftType.color,
        color: shiftType.textColor,
        padding,
        fontSize,
        borderRadius: 6,
        fontWeight: 700,
        letterSpacing: '0.02em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>{shiftType.shortCode}</span>
      {shiftType.name}
    </span>
  );
}
