import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { updateStatus, createStatus,fetchStatus } from '../../../redux/slices/statusSlice';
import { useDispatch } from 'react-redux';

const Modal = ({ setOpenModal, openModal,isEdit, existingData={} }) => {
  console.log(existingData,isEdit);
  const dispatch = useDispatch();
  const [type, setType] = useState('');
  const [color, setColor] = useState('#c72030');
  const [warningOpen, setWarningOpen] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(() => { // Using a function for initial state for safety
  if (isEdit && existingData) {
    return {
      title: existingData.status || '', // Fallback to empty string
      color: existingData.color_code || '#c72030', // Fallback to default color
      active: existingData.active !== undefined ? existingData.active : true // Safely get active, default to true
    };
  } else {
    return {
      title: '',
      color: '#c72030',
      active: true
    };
  }
});  

  const handleSave = async() => {
    setError('');
    if(formData.title.trim() === ''){setError('Status cannot be empty');return;}
    const payload = {
      status: formData.title,
      color_code: formData.color,
      active: formData.active
    };
    try{
      if (isEdit) {
        await dispatch(updateStatus({ id: existingData.id, payload })).unwrap();
      } else {
        await dispatch(createStatus(payload)).unwrap();
      }

      
      handleSuccess();
    }catch(error){
      console.log(error);
    }};
    
    const handleClose=()=>{
      setFormData({
        title: '',
        color: '#c72030',
        active: true
      })
      setError("");
      setOpenModal(false);

    }
    const handleSuccess=()=>{
      setFormData({
        title: '',
        color: '#c72030',
        active: true
      })
      setError("");
      setOpenModal(false);
    }
    
  return (
    <div className="w-[560px] h-[250px] bg-white absolute top-[40%] left-[45%] translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] flex flex-col shadow-md z-50">
      <div className="h-full flex flex-col gap-5 p-4 pb-1">
        <div className="flex justify-end">
          <CloseIcon className="cursor-pointer" onClick={()=>handleClose()} />
        </div>

        <input
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
          }}
          placeholder="Enter Status Name"
          className={`border-[0.5px]  'border-[#C72030]' : 'border-[#C0C0C0]'
            } p-2 text-sm`}
        />


        <div className="border-[0.5px] border-[#C0C0C0] p-2">
          <input
            type="color"
            value={formData.color}
            onChange={(e) => {
            setFormData({ ...formData, color: e.target.value });
          }}
            className="w-1/3 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end  mr-4">
        <span className="text-red-600">{error}</span>
      </div>

      <div className="flex justify-center gap-3 mt-2 bg-[#D5DBDB] items-center h-full">
        <button
          className="bg-[#C72030] h-[28px] w-[100px] cursor-pointer text-white px-4"
          onClick={()=>handleSave()}
        >
          Save
        </button>
        <button
          className="border-2 border-[#C72030] h-[28px] w-[100px] cursor-pointer text-[#C72030] px-4"
          onClick={()=>handleClose()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
