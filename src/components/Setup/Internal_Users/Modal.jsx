import {useState} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import SelectBox from '../../SelectBox';


const Warning = ({setOpenModal,openModal,message,setWarningOpen,warningOpen}) => {
    return(
        <div className=" w-[560px] h-[200px] bg-white absolute top-[40%] left-[45%]  translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] p-4  shadow-md z-50">
          <span className="bg-[#C72030] text-white px-3 py-1  absolute top-[-12px] left-[10%] text-sm w-[100px]">
            Warning
          </span>

          <div className="h-full flex flex-col gap-5 justify-between">
            <div className="flex justify-end">
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpenModal(false)}
              />
            </div>

            <p>{message}</p>            
            

            <div className="flex justify-center gap-3 mt-2">
              <button className="bg-[#C72030] h-[28px] cursor-pointer text-white px-4  ">
                Yes
              </button>
              <button
                className="border-2 border-[#C72030] h-[28px] cursor-pointer text-[#C72030] px-4  "
              onClick={()=>setWarningOpen(false)}>
                No
              </button>
            </div>
          </div>
        </div>
 
  );
}


const Assign= ({ setOpenModal, openModal,name ,setWarningOpen}) => {
  return (
  
        <div className=" w-[560px] h-[200px] bg-white absolute top-[40%] left-[45%]  translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] p-4  shadow-md z-50">
          <span className="bg-[#C72030] text-white px-3 py-1  absolute top-[-12px] left-[10%] text-sm">
            {name}
          </span>

          <div className="h-full flex flex-col gap-5 justify-between">
            <div className="flex justify-end">
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpenModal(false)}
              />
            </div>

            <SelectBox label="Select User" placeholder="Select User" options={["Option 1", "Option 2", "Option 3"]}/>
            
            

            <div className="flex justify-center gap-3 mt-2">
              <button className="bg-[#C72030] h-[28px] cursor-pointer text-white px-4  " onClick={()=>setWarningOpen(true)}>
                Save
              </button>
              <button
                className="border-2 border-[#C72030] h-[28px] cursor-pointer text-[#C72030] px-4  "
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
 
  );
};

const Modal=({setOpenModal,openModal,name})=>{
    const [warningOpen, setWarningOpen] = useState(false);
    const message = name === "Clone"
  ? "Are you sure you want to clone and assign all the projects to the selected user?\nYou can view the associated projects by tapping on user details."
  : "Are you sure you want reassign selected projects to this user?";

    return(
        <>
        {
            openModal && (
                <Assign setOpenModal={setOpenModal} openModal={openModal} name={name} setWarningOpen={setWarningOpen}/>
            )
        }
           { warningOpen && (
                <Warning setOpenModal={setOpenModal} openModal={openModal} message={message} setWarningOpen={setWarningOpen} warningOpen={warningOpen}/>
            )
        }
        
        </>
    )
}

export default Modal;