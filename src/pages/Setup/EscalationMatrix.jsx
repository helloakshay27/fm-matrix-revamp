import EscalationTable from '../../components/Setup/Escalation_Matrix/Table';
import { useState } from 'react';
import AddEscalationModal from '../../components/Setup/Escalation_Matrix/Modal';

const EscalationMatrix = () => {
      const [openModal, setOpenModal] = useState(false);
  return(
   <div className="flex flex-col gap-2 p-10 text-[14px]">
            <div className="flex justify-end ">
               <button className="h-[38px] w-[170px] bg-[#C72030] text-white mr-5" onClick={()=>{setOpenModal(true)}}>+ Add Escalation</button>
            </div>
            <EscalationTable />
            {openModal && <AddEscalationModal setIsModalOpen={setOpenModal} isModalOpen={openModal}/>}
        </div>
    )
}

export default EscalationMatrix