import { useState } from 'react';
import ExternalTable from '../../components/Setup/External_Users/Table';
import Modal from '../../components/Setup/External_Users/AddExternalUserModal';

const ExternalUsers = () => {
    const [openModal, setOpenModal] = useState(false);
    return (
        <div className="flex flex-col gap-2 p-10 text-[14px]">
            <div className="flex justify-end ">
                <button className="h-[38px] w-[170px] bg-[#C72030] text-white mr-5" onClick={() => { setOpenModal(true) }}>+ Add User</button>
            </div>
            < ExternalTable />
            {openModal && <Modal setOpenModal={setOpenModal} openModal={openModal} />}
        </div>
    )
}

export default ExternalUsers;