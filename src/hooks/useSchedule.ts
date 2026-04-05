import { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import type { AssignmentKey } from '../types';
import { getWeekDays, getMonthDays } from '../utils/dateUtils';

export function useSchedule() {
  const { state, dispatch } = useAppContext();
  const { currentDate, viewMode, assignments } = state;

  const days = useMemo(() => {
    return viewMode === 'weekly'
      ? getWeekDays(currentDate)
      : getMonthDays(currentDate);
  }, [currentDate, viewMode]);

  const assignmentMap = useMemo(() => {
    const map = new Map<AssignmentKey, string | null>();
    for (const a of assignments) {
      if (a.shiftTypeId !== null) {
        map.set(`${a.employeeId}::${a.date}` as AssignmentKey, a.shiftTypeId);
      }
    }
    return map;
  }, [assignments]);

  function setAssignment(employeeId: string, date: string, shiftTypeId: string | null) {
    dispatch({ type: 'SET_ASSIGNMENT', payload: { employeeId, date, shiftTypeId } });
  }

  return { days, assignmentMap, setAssignment };
}
