import { useState } from 'react';
import TypesTable from '../../components/Setup/ProjectTypes/Table.jsx';
import Modal from "../../components/Setup/ProjectTypes/Modal.jsx";

const ProjectTypes = () => {
    const [openModal, setOpenModal] = useState(false);
    return (
        <div className="flex flex-col gap-2 p-5 text-[14px]">
            <div className="flex justify-end ">
                <button className="h-[38px] w-[170px] bg-[#C72030] text-white mr-5" onClick={() => { setOpenModal(true) }}>+ Add Type</button>
            </div>
            <TypesTable />
            {openModal && <Modal setOpenModal={setOpenModal} openModal={openModal} />}
        </div>
    )
}

export default ProjectTypes;