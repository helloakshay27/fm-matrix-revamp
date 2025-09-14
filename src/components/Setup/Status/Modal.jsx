import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { updateStatus, createStatus, fetchStatus } from '../../../redux/slices/statusSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const Modal = ({ setOpenModal, openModal, isEdit, existingData = {} }) => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(() => { // Using a function for initial state for safety
    if (isEdit && existingData) {
      return {
        title: existingData.status || '', // Fallback to empty string
        color: existingData.color_code || '#c72030', // Fallback to default color
        active: existingData.active !== undefined ? existingData.active : true // Safely get active, default to true
      };
    } else {
      return {
        title: '',
        color: '#c72030',
        active: true
      };
    }
  });

  const handleSave = async () => {
    setError('');
    if (formData.title.trim() === '') { setError('Status cannot be empty'); return; }
    const payload = {
      status: formData.title,
      color_code: formData.color,
      active: formData.active
    };
    try {
      if (isEdit) {
        await dispatch(updateStatus({ token, id: existingData.id, payload })).unwrap();
      } else {
        await dispatch(createStatus({ token, payload })).unwrap();
      }

      toast.success(`Status ${isEdit ? 'updated' : 'created'} successfully`, {
        iconTheme: {
          primary: 'green', // This might directly change the color of the success icon
          secondary: 'white',
        },
      })
      handleSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      color: '#c72030',
      active: true
    })
    setError("");
    setOpenModal(false);

  }
  const handleSuccess = async () => {
    setFormData({
      title: '',
      color: '#c72030',
      active: true
    })
    setError("");
    setOpenModal(false);
    await dispatch(fetchStatus({ token })).unwrap();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-[300px] bg-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] flex flex-col shadow-md z-50">
        <div className="h-full flex flex-col gap-3 p-4 pb-1">
          <div className="flex justify-end">
            <CloseIcon className="cursor-pointer" onClick={() => handleClose()} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Status Name <span className="text-red-600">*</span></label>
            <input
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
              placeholder="Enter Status Name"
              className={`border-[1px] border-[#C0C0C0] p-2 text-sm`}
            />
          </div>


          <div className='flex flex-col gap-2'>
            <label className="text-sm">Pick Color</label>
            <div className="border-[1px] border-[#C0C0C0] p-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => {
                  setFormData({ ...formData, color: e.target.value });
                }}
                className="w-1/3 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-1 mr-4">
          <span className="text-red-600">{error}</span>
        </div>

        <div className="flex justify-center gap-3  bg-[#D5DBDB] items-center h-full">
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
            onClick={() => handleSave()}
          >
            Save
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
            onClick={() => handleClose()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
