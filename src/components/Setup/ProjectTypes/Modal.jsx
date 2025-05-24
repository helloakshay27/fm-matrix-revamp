import React,{useState} from 'react'
import CloseIcon from '@mui/icons-material/Close';


const Modal = ({setOpenModal,openModal}) => {
    const [type,setType]=useState('')
    const [warningOpen, setWarningOpen] = useState(false);

    const handleSave=()=>{
        //check type already exists
    }
  return (
       
        <div className=" w-[560px] h-[200px] bg-white absolute top-[40%] left-[45%]  translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] flex flex-col shadow-md z-50">
       

          <div className="h-full flex flex-col gap-5 p-4">
            <div className="flex justify-end">
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpenModal(false)}
              />
            </div>

            <input value={type} onChange ={(e)=>setType(e.target.value)} placeholder="Enter Type" className={`border-[0.5px]${warningOpen? ' border-[#C72030]' : ' border-[#C0C0C0]'} p-2  text-sm`}/>            
            <div className="flex justify-end">
                {warningOpen && (<span className="text-[#C72030]">Project Type already exists</span>) }
            </div>

              </div>
            <div className="flex justify-center items-center gap-3 mt-2 bg-[#D5DBDB] h-full">
              <button className="bg-[#C72030] h-[28px] w-[100px] cursor-pointer text-white px-4  " onClick={handleSave}>
                Save
              </button>
              <button
                className="border-2 border-[#C72030] h-[28px] w-[100px]   cursor-pointer text-[#C72030] px-4  "
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
          </div>
        </div>
 
  )
}

export default Modal