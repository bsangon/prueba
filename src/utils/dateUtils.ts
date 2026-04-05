export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISO(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getWeekDays(anchorDate: string): string[] {
  const date = parseISO(anchorDate);
  const day = date.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toISO(d);
  });
}

export function getMonthDays(anchorDate: string): string[] {
  const date = parseISO(anchorDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return toISO(d);
  });
}

export function formatDayLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric' }).format(date);
}

export function formatDayLabelShort(dateStr: string): string {
  const date = parseISO(dateStr);
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric' }).format(date);
}

export function formatWeekdayShort(dateStr: string): string {
  const date = parseISO(dateStr);
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date);
}

export function navigateDate(
  currentDate: string,
  direction: -1 | 1,
  viewMode: 'weekly' | 'monthly'
): string {
  const date = parseISO(currentDate);
  if (viewMode === 'weekly') {
    date.setDate(date.getDate() + direction * 7);
  } else {
    date.setMonth(date.getMonth() + direction);
  }
  return toISO(date);
}

export function formatWindowLabel(
  days: string[],
  viewMode: 'weekly' | 'monthly'
): string {
  if (days.length === 0) return '';
  if (viewMode === 'monthly') {
    const date = parseISO(days[0]);
    return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date);
  }
  const first = parseISO(days[0]);
  const last = parseISO(days[days.length - 1]);
  const fLabel = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(first);
  const lLabel = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(last);
  return `${fLabel} – ${lLabel}`;
}

export function isWeekend(dateStr: string): boolean {
  const day = parseISO(dateStr).getDay();
  return day === 0 || day === 6;
}

export function isToday(dateStr: string): boolean {
  return dateStr === toISO(new Date());
}

export function formatFullDate(dateStr: string): string {
  const date = parseISO(dateStr);
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
