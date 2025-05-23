import Modal from "../../components/Setup/Role/Modal"
import RoleTable from "../../components/Setup/Role/Table"
import { useState } from "react"

const Role = () => {
    const [openModal, setOpenModal] = useState(false);
    return (
        <div className="flex flex-col gap-2 p-10 text-[14px]">
            <div className="flex justify-end ">
               <button className="h-[38px] w-[170px] bg-[#C72030] text-white mr-5" onClick={()=>{setOpenModal(true)}}>+ Add Role</button>
            </div>
            <RoleTable />
            {openModal && <Modal setOpenModal={setOpenModal} openModal={openModal}/>}
        </div>
    )
}

export default Role