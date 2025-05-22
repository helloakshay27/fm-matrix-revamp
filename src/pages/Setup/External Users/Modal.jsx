import {useState} from 'react'
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ setOpenModal, openModal }) => {
  return (
  
        <div className=" w-[560px] h-[380px] bg-white absolute top-[40%] left-[45%]  translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] p-4  shadow-md z-50">
          <span className="bg-[#C72030] text-white px-3 py-1  absolute top-[-12px] left-[20%] text-sm">
            External User
          </span>

          <div className="h-full flex flex-col gap-5 justify-between">
            <div className="flex justify-end">
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpenModal(false)}
              />
            </div>

            <input
              placeholder="Enter user name"
              className="border-[0.5px] border-[#C0C0C0] p-2  text-sm"
            />
            <input
              placeholder="Enter organisation"
              className="border-[0.5px] border-[#C0C0C0] p-2  text-sm"
            /><input
              placeholder="Enter email Id"
              className="border-[0.5px] border-[#C0C0C0] p-2  text-sm"
            /><input
              placeholder="Enter Role"
              className="border-[0.5px] border-[#C0C0C0] p-2  text-sm"
            />
            

            <div className="flex justify-center gap-3 mt-2">
              <button className="bg-[#C72030] h-[28px] cursor-pointer text-white px-4  ">
                Save
              </button>
              <button
                className="border-2 border-[#C72030] h-[28px] cursor-pointer text-[#C72030] px-4  "
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
 
  );
};

export default Modal;