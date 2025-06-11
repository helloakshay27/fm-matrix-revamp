/* eslint-disable react/prop-types */
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRole, editRole } from '../../../redux/slices/roleSlice';
import {toast} from  'react-hot-toast';

const RoleModal = ({ open, onClose, onSuccess, role, mode }) => {

    const [roleInput, setRoleInput] = useState();

    useEffect(() => {
    if (role?.display_name) {
        const formattedValue = role.display_name.replace(/_/g, ' ');
        const capitalized =
            formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
        setRoleInput(capitalized);
    }
}, [role]);
  const [error,setError]=useState('');

  const dispatch = useDispatch();
  const { loading, success } = useSelector((state) => state.createRole);
  const {
    loading: editLoading,
    success: editSuccess,
   
  } = useSelector((state) => state.editRole);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
    if(roleInput===""){setError("Please enter role name");return;}

    const payload = {
      lock_role: {
        name: roleInput.toLowerCase().replace(' ', '_').trim(),
        display_name: roleInput,
        active: 1,
      },
    };
    let response;
      try{
    if (mode === 'edit' && role?.id) {
     response=await dispatch(editRole({ id: role.id, payload })).unwrap();
    } else {
     response=await  dispatch(createRole(payload)).unwrap();
    }
    console.log(response);
     if(response.name[0]!="has already been taken"){
      toast.success(`Role ${mode === 'edit' ? 'updated' : 'created'} successfully`,{
        iconTheme: {
          primary: 'red', // This might directly change the color of the success icon
          secondary: 'white', // The circle background
        },
      });
      handleSuccess();
     }
    else{
      setError("Role name already exists");
    }
  }
  catch(error){
    console.log(error);
  }
  };


  const handleSuccess = () => {
      setError("");
      onSuccess();
  }

  const handleClose=()=>{
    setError("");
    onClose();
  }
  // }
  // useEffect(() => {
  //   if (role && mode === 'edit') {
  //     setRoleInput(role.display_name);
  //   } else {
  //     setRoleInput('');
  //   }
  // }, [role, mode]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-[280px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">
        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Input Section */}
        <div className="px-6">
          <label className="block text-[14px] text-[#1B1B1B] mb-1">
            {mode === 'edit' ? 'Edit Role' : 'New Role'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter role name here..."
            className="border border-[#C0C0C0] w-full px-4 py-3 text-[#1B1B1B] text-[13px]"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
          />
        </div>

        <div className="flex justify-end items-center text-[12px] mt-2 mr-5">
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
            onClick={handleSubmit}
          >
            {loading || editLoading ? 'Submitting...' : mode === 'edit' ? 'Update' : 'Save'}
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
