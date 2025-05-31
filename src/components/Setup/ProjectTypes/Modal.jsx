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
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-[250px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">

        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={resetModal} />
        </div>

        {/* Input Section */}
        <div className="px-6">
          <label className="block text-[16px] text-[#1B1B1B] mb-1">
            {editMode ? 'Edit Project Type' : 'New Project Type'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter project type name here..."
            className={`border w-full px-4 py-3 text-[#1B1B1B] text-[13px] ${warningOpen ? 'border-red-600' : 'border-[#C0C0C0]'}`}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          {warningOpen && (
            <p className="text-red-600 text-sm mt-1">Project Type already exists</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[16px] px-8 py-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Submitting...' : editMode ? 'Update' : 'Save'}
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[16px] px-8 py-2"
            onClick={resetModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

  );
};

export default Modal;
