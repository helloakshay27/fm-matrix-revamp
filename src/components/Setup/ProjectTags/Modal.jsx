import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { createTag, fetchTags, updateTag } from '../../../redux/slices/tagsSlice';

const Modal = ({ open, setOpenModal, editData = {} }) => {

  const isEditMode = !!editData;
  const [name, setName] = useState(editData?.name || '');
  const [type, setType] = useState(editData?.tag_type || '');
  const [warningOpen, setWarningOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading: createLoading, success: createSuccess, error: createError } = useSelector(state => state.createTag);
  const { loading: updateLoading, success: updateSuccess, error: updateError } = useSelector(state => state.updateTag);

  const handleSaveOrUpdate = (e) => {
    e.preventDefault();
    if (!name || !type) {
      setWarningOpen(true);
      return;
    }

    const payload = {
      company_tag: {
        name: name.trim().toLowerCase(),
        tag_type: type,
      }
    };

    if (isEditMode) {
      dispatch(updateTag({ id: editData.id, data: payload }));
    } else {
      dispatch(createTag(payload));
    }
  };

  useEffect(() => {
    setName(editData?.name || '');
    setType(editData?.tag_type || '');
    setWarningOpen(false);
  }, [editData]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(fetchTags());
      setName('');
      setType('');
      setWarningOpen(false);
      setOpenModal(false);
    }
  }, [createSuccess, updateSuccess, dispatch, setOpenModal]);

  if (!open) return null; // Prevent rendering if modal is not open


  return (
    <div className="w-[560px] h-[250px] bg-white absolute top-[40%] left-[45%] flex flex-col translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] shadow-md z-50">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-end">
          <CloseIcon
            className="cursor-pointer"
            onClick={() => setOpenModal(false)}
          />
        </div>
        <input
          placeholder="Enter Tag Name"
          className={`border-[0.5px]${warningOpen ? ' border-[#C72030]' : ' border-[#C0C0C0]'} p-2 text-sm`}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Enter Tag Type"
          className={`border-[0.5px]${warningOpen ? ' border-[#C72030]' : ' border-[#C0C0C0]'} p-2 text-sm`}
          value={type}
          onChange={e => setType(e.target.value)}
        />
      </div>
      <div className="flex justify-center gap-3 mt-2 bg-[#D5DBDB] h-full items-center">
        <button
          className="bg-[#C72030] h-[28px] w-[100px] cursor-pointer text-white px-4"
          onClick={handleSaveOrUpdate}
        >
          {isEditMode ? 'Update' : 'Save'}
        </button>
        <button
          className="border-2 border-[#C72030] h-[28px] w-[100px] cursor-pointer text-[#C72030] px-4"
          onClick={() => setOpenModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;