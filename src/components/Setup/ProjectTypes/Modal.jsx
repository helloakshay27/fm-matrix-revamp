import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { createProjectType, fetchProjectTypes, updateProjectType } from '../../../redux/slices/projectSlice';

const Modal = ({ openModal, setOpenModal, editMode = false, existingData = {} }) => {
  const [type, setType] = useState(editMode ? existingData?.name || '' : '');
  const [warningOpen, setWarningOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading, projectTypes, success } = useSelector((state) => state.createdProjectTypes);
  const { succ } = useSelector((state) => state.updateProjectType);

  useEffect(() => {
    if (projectTypes?.length > 0 && type) {
      const alreadyExists = projectTypes.some(
        (pt) => pt.name.toLowerCase() === type.toLowerCase() && pt.id !== existingData?.id
      );
      setWarningOpen(alreadyExists);
    } else {
      setWarningOpen(false);
    }
  }, [type, projectTypes, existingData]);

  const handleSave = () => {
    if (!type || warningOpen) return;

    const payload = {
      name: type.toLowerCase().trim(),
      active: true,
      created_by_id: 158,
    };

    if (editMode && existingData?.id) {
      dispatch(updateProjectType({ id: existingData.id, data: payload })).then(() => {
        dispatch(fetchProjectTypes()); // Fetch updated data after successful update
        setOpenModal(false); // Close modal after update
        setType(''); // Reset input field
      });
    } else {
      dispatch(createProjectType(payload)).then(() => {
        dispatch(fetchProjectTypes()); // Fetch updated data after successful create
        setOpenModal(false); // Close modal after create
        setType(''); // Reset input field
      });
    }
  };

  // Remove the success/succ useEffect since we're handling it in handleSave
  // This avoids duplicate fetching and ensures proper timing

  if (!openModal) return null;

  return (
    <div className="w-[560px] h-[200px] bg-white absolute top-[40%] left-[45%] translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] flex flex-col shadow-md z-50">
      <div className="h-full flex flex-col gap-5 p-4">
        <div className="flex justify-end">
          <CloseIcon className="cursor-pointer" onClick={() => setOpenModal(false)} />
        </div>

        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Enter Type"
          className={`border-[0.5px] ${warningOpen ? 'border-[#C72030]' : 'border-[#C0C0C0]'} p-2 text-sm`}
        />

        {warningOpen && (
          <span className="text-[#C72030] text-sm ml-1">Project Type already exists</span>
        )}
      </div>

      <div className="flex justify-center items-center gap-3 mt-2 bg-[#D5DBDB] h-full">
        <button
          className="bg-[#C72030] h-[28px] w-[100px] cursor-pointer text-white px-4"
          onClick={handleSave}
          disabled={loading}
        >
          {editMode ? 'Update' : 'Save'}
        </button>
        <button
          className="border-2 border-[#C72030] h-[28px] w-[100px] cursor-pointer text-[#C72030] px-4"
          onClick={() => setOpenModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;