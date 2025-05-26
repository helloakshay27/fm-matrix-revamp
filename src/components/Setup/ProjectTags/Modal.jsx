import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { createTag } from '../../../redux/slices/tagsSlice';

const Modal = ({ setOpenModal, openModal }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [warningOpen, setWarningOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.createTag)

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      company_tag: {
        company_id: 1,
        name: name,
        tag_type: type,
        mom: true,
        active: true
      }
    }

    dispatch(createTag(payload))
  }

  useEffect(() => {
    if (success) {
      window.location.reload();
    }
  }, [success])

  return (

    <div className=" w-[560px] h-[250px] bg-white absolute top-[40%] left-[45%] flex flex-col translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0]   shadow-md z-50">


      <div className=" flex flex-col gap-4 p-4">
        <div className="flex justify-end">
          <CloseIcon
            className="cursor-pointer"
            onClick={() => setOpenModal(false)}
          />
        </div>

        <input
          placeholder="Enter Tag Name"
          className={`border-[0.5px]${warningOpen ? ' border-[#C72030]' : ' border-[#C0C0C0]'} p-2  text-sm`}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Enter Tag Type"
          className={`border-[0.5px]${warningOpen ? ' border-[#C72030]' : ' border-[#C0C0C0]'} p-2  text-sm`}
          value={type}
          onChange={e => setType(e.target.value)}
        />

      </div>

      <div className="flex justify-center gap-3 mt-2 bg-[#D5DBDB] h-full items-center">
        <button className="bg-[#C72030] h-[28px] w-[100px] cursor-pointer text-white px-4  " onClick={handleSave}>
          Save
        </button>
        <button
          className="border-2 border-[#C72030] h-[28px] w-[100px] cursor-pointer text-[#C72030] px-4  "
          onClick={() => setOpenModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>

  )
}

export default Modal