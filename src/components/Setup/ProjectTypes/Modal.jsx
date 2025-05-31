import { useState, useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProjectType,
  fetchProjectTypes,
  updateProjectType
} from '../../../redux/slices/projectSlice';

const Modal = ({ openModal, setOpenModal, editMode = false, existingData = {} }) => {
  const [type, setType] = useState(editMode ? existingData?.name || '' : '');
  const [warningOpen, setWarningOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.createdProjectTypes);

  const resetModal = useCallback(() => {
    setType('');
    setWarningOpen(false);
    setOpenModal(false);
  }, [setOpenModal]);

  const handleSave = useCallback(() => {
    const trimmedType = type.trim();

    if (!trimmedType || warningOpen) return;

    const payload = {
      name: trimmedType.toLowerCase(),
      created_by_id: 158,
    };

    const action = editMode
      ? updateProjectType({ id: existingData.id, data: payload })
      : createProjectType(payload);

    dispatch(action).then(() => {
      dispatch(fetchProjectTypes());
      resetModal();
    });
  }, [type, warningOpen, dispatch, editMode, existingData, resetModal]);

  if (!openModal) return null;

  return (
    <div className="fixed top-1/2 left-1/2 w-[560px] h-[200px] bg-white border border-gray-300 shadow-md z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between p-4">
      <div>
        <div className="flex justify-end">
          <CloseIcon className="cursor-pointer" onClick={resetModal} />
        </div>

        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Enter Type"
          className={`w-full border p-2 text-sm ${warningOpen ? 'border-red-600' : 'border-gray-300'}`}
        />

        {warningOpen && (
          <p className="text-red-600 text-sm mt-1">Project Type already exists</p>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 bg-gray-200 py-2">
        <button
          className="bg-red-700 text-white px-4 py-1 w-[100px] h-[28px] disabled:opacity-50"
          onClick={handleSave}
          disabled={loading}
        >
          {editMode ? 'Update' : 'Save'}
        </button>
        <button
          className="border-2 border-red-700 text-red-700 px-4 py-1 w-[100px] h-[28px]"
          onClick={resetModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
