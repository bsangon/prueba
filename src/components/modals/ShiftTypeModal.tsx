import { Modal } from './Modal';
import { ShiftTypeForm } from '../shifts/ShiftTypeForm';
import { useShiftTypes } from '../../hooks/useShiftTypes';
import type { ShiftType } from '../../types';

interface Props {
  shiftType?: ShiftType;
  onClose: () => void;
}

export function ShiftTypeModal({ shiftType, onClose }: Props) {
  const { shiftTypes, addShiftType, updateShiftType } = useShiftTypes();

  const existingNames = shiftTypes
    .filter((s) => s.id !== shiftType?.id)
    .map((s) => s.name);

  function handleSubmit(data: Omit<ShiftType, 'id'>) {
    if (shiftType) {
      updateShiftType({ ...shiftType, ...data });
    } else {
      addShiftType(data);
    }
    onClose();
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={shiftType ? 'Editar tipo de turno' : 'Nuevo tipo de turno'}
    >
      <ShiftTypeForm
        initial={shiftType}
        onSubmit={handleSubmit}
        onCancel={onClose}
        existingNames={existingNames}
      />
    </Modal>
  );
}
