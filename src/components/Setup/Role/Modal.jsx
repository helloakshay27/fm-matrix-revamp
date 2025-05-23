import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { set } from 'date-fns';

// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // Kept as per user's code (though not used in this snippet)



const Modal = ({setOpenModal,openModal}) => {

  return (
    <>
    (
    <div className='flex flex-col gap-5 w-[560px] h-[280px] bg-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] z-20 '>
        <div className='flex justify-end p-2'>
            <CloseIcon  className="cursor-pointer" onClick={()=>{
                setOpenModal(false);
            }}/>
        </div>
        <div className="p-5">
            <label>New Role<span>*</span></label>
            <input type="text" placeholder="Enter New Role Here" className="border-[0.5px] border-[#C0C0C0] p-2 w-full mt-2" />
        </div>
        <div className="flex justify-center gap-3 bg-[#D5DBDB] h-[130px] items-center">
            <button className="border-2 border-[#C72030] h-[30px] cursor-pointer px-3">Save</button>
            <button className="border-2 border-[#C72030] h-[30px] cursor-pointer  px-3" onClick={()=>setOpenModal(false)}>Cancel</button>
        </div>
    </div>
  )

</>
  )
}

export default Modal