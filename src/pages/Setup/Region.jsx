import { useState } from 'react';
import RegionTable from '../../components/Setup/Region/Table';
import AddRegionModel from '../../components/Setup/Region/Model';
import { fetchRegion } from '../../redux/slices/regionSlice';
import { useDispatch } from 'react-redux';

const Region = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    return (
        <div className="flex flex-col gap-2 p-5 text-[14px] ">
            <div className="flex justify-end ">
                <button className="h-[38px] w-[170px] bg-[#C72030] text-white mr-5" onClick={() => { setOpenModal(true) ; setEditMode(false)}}>+ Add Region</button>
            </div>
            <RegionTable  openModal={openModal} setOpenModal={setOpenModal} editMode={editMode} setEditMode={setEditMode} />
        </div>
    )
}

export default Region;