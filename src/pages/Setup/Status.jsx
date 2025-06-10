import { useEffect, useState } from 'react';
import StatusTable from '../../components/Setup/Status/Table.jsx';
import Modal from '../../components/Setup/Status/Modal.jsx';
import { use } from 'react';
import { useDispatch } from 'react-redux';
import {fetchStatus } from '../../redux/slices/statusSlice';

const Status = () => {
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false); 
    const [existingData, setExistingData] = useState(null);
    const dispatch=useDispatch();
    useEffect(() => {
        if(!openModal){
         dispatch(fetchStatus());
        }
    },[openModal]);
    return (
        <div className="flex flex-col gap-2 p-10 text-[14px]">
            <div className="flex justify-end ">
                <button className="h-[38px] w-[170px] bg-[#C72030] text-white mr-5" onClick={() => { setExistingData(null); setIsEdit(false);setOpenModal(true) }}>+ Add Status</button>
            </div>
            <StatusTable setOpenModal={setOpenModal} setIsEdit={setIsEdit} setExistingData={setExistingData} />
            {openModal && <Modal setOpenModal={setOpenModal} openModal={openModal} isEdit={isEdit} existingData={existingData}/>}
        </div>
    )
}

export default Status;