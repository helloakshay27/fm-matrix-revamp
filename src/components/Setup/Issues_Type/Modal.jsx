import { useState, useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIssueType, createIssueType, updateIssueType } from '../../../redux/slices/IssueSlice';
import { set } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const Modal = ({ openModal, setOpenModal, editMode = false, existingData = {} }) => {
  const token = localStorage.getItem('token');
  const [type, setType] = useState(editMode ? existingData?.name || '' : '');
  const [description, setDescription] = useState(editMode ? existingData?.description || '' : '');
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.createdProjectTypes);

  const resetModal = useCallback(() => {
    setType('');
    setWarningOpen(false);
    setOpenModal(false);
  }, [setOpenModal]);

  const handleSave = useCallback(async () => {
    setWarningMessage('');
    setWarningOpen(false);
    const trimmedType = type.trim();
    const trimmedDescription = description.trim();

    if (!trimmedType) {
      setWarningOpen(true);
      setWarningMessage('Type name cannot be empty');
      return;
    }
    if (!trimmedDescription) {
      setWarningOpen(true);
      setWarningMessage('Description cannot be empty');
      return;
    }

    const payload = {
      name: trimmedType,
      description: trimmedDescription,
      created_by_id: JSON.parse(localStorage.getItem('user'))?.id || '',
    };

    try {
      let response;
      if (editMode && existingData?.id) {
        response = await dispatch(updateIssueType({ token, id: existingData.id, payload })).unwrap();
      }
      else
        response = await dispatch(createIssueType({ token, payload })).unwrap();
      if (response?.name[0] != "has already been taken") {
        toast.success(`Type ${editMode ? 'Updated' : 'Created'} successfully`, {
          iconTheme: {
            primary: 'green', // This might directly change the color of the success icon
            secondary: 'white', // The circle background
          },
        })
        resetModal();
        dispatch(fetchIssueType({ token }));
      }
      else {
        setWarningOpen(true);
        setWarningMessage('Issues Type already exists');
      }
    }

    catch (error) {
      console.log(error);
      setWarningOpen(true);
      setWarningMessage(error.message);
    }
  }, [type, warningOpen, dispatch, editMode, existingData, resetModal, description]);



  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-[350px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">

        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={resetModal} />
        </div>

        {/* Input Section */}
        <div className="px-6">
          <label className="block text-[14px] text-[#1B1B1B] mb-1">
            {editMode ? 'Edit Issues Type' : 'New Issues Type'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Issues type name here..."
            className={`border w-full px-4 py-3 text-[#1B1B1B] text-[13px] ${warningOpen ? 'border-red-600' : 'border-[#C0C0C0]'}`}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <label className="block text-[14px] text-[#1B1B1B] mb-1 mt-4">
            Description
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Description here..."
            className={`border w-full px-4 py-3 text-[#1B1B1B] text-[13px] `}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {warningOpen && (
            <p className="text-red-600 flex justify-end text-[12px] mt-2">{warningMessage}</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Submitting...' : editMode ? 'Update' : 'Save'}
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[14px] px-8 py-2"
            onClick={resetModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

  );
};

export default Modal;
