import { useState } from 'react';
import AddEscalationModal from '../../components/Setup/Escalation_Matrix/Modal';
import InternalTable from '../../components/Setup/Internal_Users/Table';
import Modal from '../../components/Setup/Internal_Users/Modal';

const InternalUsers = () => {
    const [openModal, setOpenModal] = useState(false);
    return (
        <div className="flex flex-col gap-2 p-10 text-[14px]">
            <div className="flex justify-end ">
                <button className="h-[38px] w-[170px] bg-[#C72030] text-white mr-5" onClick={() => { setOpenModal(true) }}>+ Add User</button>
            </div>
            <InternalTable />
            {/* {openModal && <Modal setIsModalOpen={setOpenModal} isModalOpen={openModal}/>} */}
        </div>
    )
}

export default InternalUsers;