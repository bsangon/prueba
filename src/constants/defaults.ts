import type { Employee, ShiftType, AppState } from '../types';
import { getContrastColor } from '../utils/colorUtils';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

export const DEFAULT_SHIFT_TYPES: ShiftType[] = [
  { id: 'manana', name: 'Mañana',     color: '#FCD34D', textColor: getContrastColor('#FCD34D'), shortCode: 'M'  },
  { id: 'tarde',  name: 'Tarde',      color: '#FB923C', textColor: getContrastColor('#FB923C'), shortCode: 'T'  },
  { id: 'noche',  name: 'Noche',      color: '#818CF8', textColor: getContrastColor('#818CF8'), shortCode: 'N'  },
  { id: 'libre',  name: 'Libre',      color: '#6EE7B7', textColor: getContrastColor('#6EE7B7'), shortCode: 'L'  },
  { id: 'guardia',name: 'Guardia',    color: '#F87171', textColor: getContrastColor('#F87171'), shortCode: 'G'  },
  { id: 'vacac',  name: 'Vacaciones', color: '#67E8F9', textColor: getContrastColor('#67E8F9'), shortCode: 'V'  },
];

export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: 'emp1', name: 'Ana García',   role: 'Enfermera',  avatarColor: '#4F46E5', order: 0 },
  { id: 'emp2', name: 'Luis Pérez',   role: 'Médico',     avatarColor: '#DB2777', order: 1 },
  { id: 'emp3', name: 'Sara Ruiz',    role: 'Auxiliar',   avatarColor: '#D97706', order: 2 },
  { id: 'emp4', name: 'Carlos Díaz',  role: 'Celador',    avatarColor: '#059669', order: 3 },
];

export const INITIAL_STATE: AppState = {
  employees: DEFAULT_EMPLOYEES,
  shiftTypes: DEFAULT_SHIFT_TYPES,
  assignments: [],
  viewMode: 'weekly',
  currentDate: today(),
};
