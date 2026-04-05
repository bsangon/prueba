import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../store/AppContext';
import type { ShiftType } from '../types';

export function useShiftTypes() {
  const { state, dispatch } = useAppContext();

  function addShiftType(data: Omit<ShiftType, 'id'>) {
    dispatch({
      type: 'ADD_SHIFT_TYPE',
      payload: { ...data, id: uuidv4() },
    });
  }

  function updateShiftType(shiftType: ShiftType) {
    dispatch({ type: 'UPDATE_SHIFT_TYPE', payload: shiftType });
  }

  function deleteShiftType(id: string) {
    dispatch({ type: 'DELETE_SHIFT_TYPE', payload: id });
  }

  return {
    shiftTypes: state.shiftTypes,
    addShiftType,
    updateShiftType,
    deleteShiftType,
  };
}
