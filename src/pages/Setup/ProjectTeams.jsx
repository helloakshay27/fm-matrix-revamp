import { useState } from 'react';
import TeamsTable from '../../components/Setup/ProjectTeams/Table.jsx';
import Modal from '../../components/Setup/ProjectTeams/Modal.jsx';

const ProjectTeams = () => {
      const [openModal, setOpenModal] = useState(false);
  return(
   <div className="flex flex-col gap-2 p-10 text-[14px]">
            <div className="flex justify-end ">
               <button className="h-[38px] w-[170px] bg-[#C72030] text-white mr-5" onClick={()=>{setOpenModal(true)}}>+ Add Team</button>
            </div>
            <TeamsTable />
            {openModal && <Modal setIsModalOpen={setOpenModal} isModalOpen={openModal}/>}
        </div>
    )
}

export default ProjectTeams;