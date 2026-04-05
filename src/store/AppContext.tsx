import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { AppState, Employee, ShiftType, ShiftAssignment } from '../types';
import { INITIAL_STATE } from '../constants/defaults';
import { loadState, saveState } from '../utils/storageUtils';

// ─── Actions ────────────────────────────────────────────────────────────────

type AppAction =
  | { type: 'SET_ASSIGNMENT'; payload: ShiftAssignment }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string } // id
  | { type: 'ADD_SHIFT_TYPE'; payload: ShiftType }
  | { type: 'UPDATE_SHIFT_TYPE'; payload: ShiftType }
  | { type: 'DELETE_SHIFT_TYPE'; payload: string } // id
  | { type: 'SET_VIEW_MODE'; payload: 'weekly' | 'monthly' }
  | { type: 'SET_CURRENT_DATE'; payload: string };

// ─── Reducer ────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ASSIGNMENT': {
      const { employeeId, date, shiftTypeId } = action.payload;
      const filtered = state.assignments.filter(
        (a) => !(a.employeeId === employeeId && a.date === date)
      );
      if (shiftTypeId === null) {
        return { ...state, assignments: filtered };
      }
      return {
        ...state,
        assignments: [...filtered, { employeeId, date, shiftTypeId }],
      };
    }
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter((e) => e.id !== action.payload),
        assignments: state.assignments.filter(
          (a) => a.employeeId !== action.payload
        ),
      };
    case 'ADD_SHIFT_TYPE':
      return { ...state, shiftTypes: [...state.shiftTypes, action.payload] };
    case 'UPDATE_SHIFT_TYPE':
      return {
        ...state,
        shiftTypes: state.shiftTypes.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'DELETE_SHIFT_TYPE':
      return {
        ...state,
        shiftTypes: state.shiftTypes.filter((s) => s.id !== action.payload),
        assignments: state.assignments.map((a) =>
          a.shiftTypeId === action.payload ? { ...a, shiftTypeId: null } : a
        ),
      };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => {
    return loadState() ?? INITIAL_STATE;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
