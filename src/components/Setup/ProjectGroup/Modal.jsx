import { useState, useCallback, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import {
    createProjectGroup,
    fetchProjectGroup,
    updateProjectGroup
} from '../../../redux/slices/projectSlice';

import { fetchUsers } from '../../../redux/slices/userSlice';
import MultiSelectBox from '../../MultiSelectBox';
import { set } from 'react-hook-form';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

const Modal = ({ openModal, setOpenModal, editMode = false, existingData }) => {
    console.log(existingData);
  const alreadySelectedUsers = existingData?.project_group_members.map((user)=>({value:user.user_id,label:user.user_name})); 
  const [groupName, setGroupName] = useState(editMode ? existingData?.name || '' : '');
  const [selectedUsers, setSelectedUsers] = useState(editMode ? alreadySelectedUsers || [] : []);
  const [warningOpen, setWarningOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.createProjectGroup);
  const {fetchUsers: users}=useSelector((state) => state.fetchUsers);

  const resetModal = useCallback(() => {
    setGroupName('');
    setSelectedUsers([]);
    setWarningOpen(false);
    setOpenModal(false);
  }, [setOpenModal]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSave = useCallback(() => {
    const trimmedName = groupName.trim();

    if (!trimmedName || warningOpen) return;

    const payload = {
      name: trimmedName.toLowerCase(),
      created_by_id: 158,
      user_ids: selectedUsers.map((user) => user.value),
      active:true
    };

    const action = editMode
      ? updateProjectGroup({ id: existingData.id, payload })
      : createProjectGroup(payload);

    dispatch(action).then(() => {
      dispatch(fetchProjectGroup());
      resetModal();
    });
  }, [groupName,selectedUsers, warningOpen, dispatch, editMode, existingData, resetModal]);

  const handleChange=(values)=>{
     setSelectedUsers(values);
  }

  

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-[300px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">

        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={resetModal} />
        </div>

        {/* Input Section */}
        <div className='flex flex-col gap-4'>
        <div className="px-6">
          <label className="block text-[16px] text-[#1B1B1B] mb-1">
            {editMode ? 'Edit Project Group' : 'New Project Group'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter project group name here..."
            className={`border w-full px-4 py-3 text-[#1B1B1B] text-[13px] ${warningOpen ? 'border-red-600' : 'border-[#C0C0C0]'}`}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          {warningOpen && (
            <p className="text-red-600 text-sm mt-1">Project Type already exists</p>
          )}
        </div>
        <div className="px-6">
          <MultiSelectBox options={users.map((user) => ({ value: user.id, label: `${user.firstname} ${user.lastname}` }))} label={"Select Users"} value={selectedUsers} onChange={(values) => handleChange(values)} />
        </div>
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
