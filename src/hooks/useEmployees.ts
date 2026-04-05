import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../store/AppContext';
import type { Employee } from '../types';

export function useEmployees() {
  const { state, dispatch } = useAppContext();

  function addEmployee(data: Omit<Employee, 'id' | 'order'>) {
    const order = state.employees.length;
    dispatch({
      type: 'ADD_EMPLOYEE',
      payload: { ...data, id: uuidv4(), order },
    });
  }

  function updateEmployee(employee: Employee) {
    dispatch({ type: 'UPDATE_EMPLOYEE', payload: employee });
  }

  function deleteEmployee(id: string) {
    dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
  }

  return {
    employees: state.employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
