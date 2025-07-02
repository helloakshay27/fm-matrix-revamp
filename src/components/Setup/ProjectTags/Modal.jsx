import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { createTag, fetchActiveTags, fetchTags, resetSuccess, updateTag } from '../../../redux/slices/tagsSlice';
import { toast } from 'react-hot-toast';
import SelectBox from '../../SelectBox';

const Modal = ({ open, setOpenModal, editData }) => {
  const token = localStorage.getItem('token')
  const [name, setName] = useState(editData?.name || '');
  const [type, setType] = useState(editData?.tag_type || '');
  const [active, setActive] = useState(editData?.active || true);
  const [warningOpen, setWarningOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading: createLoading, success: createSuccess, error: createError } = useSelector(state => state.createTag);
  const { loading: updateLoading, success: updateSuccess, error: updateError } = useSelector(state => state.updateTag);


  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setType(editData.tag_type || '');
      setActive(editData.active || true);

    } else {
      setName('');
      setType('');

    }

    setWarningOpen(false);
  }, [editData, open]);
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();
    if (!name || !type) {
      setWarningOpen(true);
      return;
    }

    const payload = {
      company_tag: {
        name: name,
        tag_type: type,
        active: active
      }
    };

    try {
      let response;
      if (editData?.id) {
        response = await dispatch(updateTag({ token, id: editData.id, data: payload })).unwrap();
      } else
        response = await dispatch(createTag({ token, payload })).unwrap();

      if (response.name[0] != "has already been taken") {
        toast.success(`Tag ${editData?.id ? 'updated' : 'created'} successfully`, {
          iconTheme: {
            primary: 'green', // This might directly change the color of the success icon
            secondary: 'white', // The circle background
          },
        })
        await dispatch(fetchTags({ token })).unwrap();
        handleSuccess();
      }
      else {
        setError("Tag name already exists");
      }

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(fetchActiveTags({ token }));
      setName('');
      setType('');
      setWarningOpen(false);
      setOpenModal(false);
      dispatch(resetSuccess())
    }
  }, [createSuccess, updateSuccess, dispatch, setOpenModal]);

  if (!open) return null; // Prevent rendering if modal is not open


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-[330px] bg-white absolute top-[40%] left-[45%] flex flex-col translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] shadow-md z-50">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-end">
            <CloseIcon
              className="cursor-pointer"
              onClick={() => setOpenModal(false)}
            />
          </div>
          <div className="space-y-4">
            <div className="px-6">
              <label className="block text-[14px] text-[#1B1B1B] mb-1">
                Tag Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Tag Name"
                className="border border-[#C0C0C0] w-full px-3 py-2 text-[#1B1B1B] text-[13px]"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="px-6">
              <label className="block text-[14px] text-[#1B1B1B] mb-1">
                Tag Type
                <span className="text-red-500 ml-1 mb-2">*</span>
              </label>
              <SelectBox
                options={
                  [
                    { value: "Client Tag", label: "Client Tag" },
                    { value: "Product Tag", label: "Product Tag" },
                  ]
                }
                value={type}
                onChange={(e) => setType(e)}
                placeholder={"Tag Type"}
              />
            </div>
          </div>
        </div>
        {
          warningOpen && (
            <div className="flex justify-end text-red-500 pr-7">
              Please fill all the required fields.
            </div>
          )
        }
        <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
            onClick={handleSaveOrUpdate}
          >
            {editData ? "Update" :
              "Create"
            }
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;