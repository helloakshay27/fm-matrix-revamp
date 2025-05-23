import { useState } from 'react';
import TagsTable from '../../components/Setup/ProjectTags/Table.jsx';
import Modal from "../../components/Setup/ProjectTags/Modal.jsx";

const ProjectTags = () => {
      const [openModal, setOpenModal] = useState(false);
  return(
   <div className="flex flex-col gap-2 p-10 text-[14px]">
            <div className="flex justify-end ">
               <button className="h-[38px] w-[170px] bg-[#C72030] text-white mr-5" onClick={()=>{setOpenModal(true)}}>+ Add Type</button>
            </div>
            <TagsTable />
            {openModal && <Modal setOpenModal={setOpenModal} openModal={openModal}/>}
        </div>
    )
}

export default ProjectTags;