export interface Employee {
  id: string;
  name: string;
  role?: string;
  avatarColor: string;
  order: number;
}

export interface ShiftType {
  id: string;
  name: string;
  color: string;
  textColor: string;
  shortCode: string;
}

export interface ShiftAssignment {
  employeeId: string;
  date: string; // "YYYY-MM-DD"
  shiftTypeId: string | null;
}

export interface AppState {
  employees: Employee[];
  shiftTypes: ShiftType[];
  assignments: ShiftAssignment[];
  viewMode: 'weekly' | 'monthly';
  currentDate: string; // "YYYY-MM-DD"
}

export type AssignmentKey = `${string}::${string}`;
