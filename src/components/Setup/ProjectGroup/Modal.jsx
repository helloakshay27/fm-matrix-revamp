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
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.createProjectGroup);
  const {fetchUsers: users}=useSelector((state) => state.fetchUsers);

  const resetModal = useCallback(() => {
        dispatch(fetchProjectGroup());
    setGroupName('');
    setSelectedUsers([]);
    setWarningOpen(false);
    setOpenModal(false);
    setError('');
  }, [setOpenModal]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSave = useCallback(async() => {
    const trimmedName = groupName.trim();

    if (!trimmedName){ setWarningOpen(true);
      setError('Group name cannot be empty');
      return;}
     if(selectedUsers.length===0){ setWarningOpen(true);
      setError('Please select at least one user');
      return;}
    const payload = {
      name: trimmedName.toLowerCase(),
      created_by_id: 158,
      user_ids: selectedUsers.map((user) => user.value),
      active:true
    };
   let response;
   try{
    if(editMode){
       response=await dispatch(updateProjectGroup({ id: existingData.id, payload })).unwrap();
      }
      else{
       response= await dispatch(createProjectGroup(payload)).unwrap();
      }
        console.log(response);
      if(response.name[0]==="has already been taken"){
        setWarningOpen(true);
        setError("Group name already exists");
      }else{
        resetModal();
      }
   }
   catch(error){
    console.log(error);
   }
       
  }, [groupName, selectedUsers, editMode, existingData, resetModal, dispatch]);

  const handleChange=(values)=>{
     setSelectedUsers(values);
  }

  

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 text-[14px]">
      <div className="w-[560px] h-[320px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">

        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={resetModal} />
        </div>

        {/* Input Section */}
        <div className='flex flex-col gap-4'>
        <div className="px-6">
          <label className="block  text-[#1B1B1B] mb-2">
            {editMode ? 'Edit Project Group' : 'New Project Group'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter project group name here..."
            className={`border w-full px-4 py-3 text-[#1B1B1B] text-[13px] `}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          
        </div>
        <div className="px-6">
          <label className="block text-[#1B1B1B] mb-2">Select Members</label>
          <MultiSelectBox options={users.map((user) => ({ value: user.id, label: `${user.firstname} ${user.lastname}` }))} placeholder={"Select Users"} value={selectedUsers} onChange={(values) => handleChange(values)} />
        </div>
        </div>

        <div className="flex justify-end mr-5 mt-1">
          {warningOpen && (
            <p className="text-red-600 text-[12px] mt-1">{error}</p>
          )}
        </div>
        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[60px] flex justify-center items-center gap-4">
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[16px] px-8 py-1"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Submitting...' : editMode ? 'Update' : 'Save'}
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[16px] px-8 py-1"
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
