import { Modal } from './Modal';
import { EmployeeForm } from '../employees/EmployeeForm';
import { useEmployees } from '../../hooks/useEmployees';
import type { Employee } from '../../types';

interface Props {
  employee?: Employee;
  onClose: () => void;
}

export function EmployeeModal({ employee, onClose }: Props) {
  const { employees, addEmployee, updateEmployee } = useEmployees();

  const existingNames = employees
    .filter((e) => e.id !== employee?.id)
    .map((e) => e.name);

  function handleSubmit(data: Omit<Employee, 'id' | 'order'>) {
    if (employee) {
      updateEmployee({ ...employee, ...data });
    } else {
      addEmployee(data);
    }
    onClose();
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={employee ? 'Editar empleado' : 'Nuevo empleado'}
    >
      <EmployeeForm
        initial={employee}
        onSubmit={handleSubmit}
        onCancel={onClose}
        existingNames={existingNames}
      />
    </Modal>
  );
}
