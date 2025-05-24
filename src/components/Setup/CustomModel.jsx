/* eslint-disable react/prop-types */
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({ open, onClose, placeholder }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-[280px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">
        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Input Section */}
        <div className="px-6">
          <label className="block text-[16px] text-[#1B1B1B]  mb-1">
            New Role<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder={placeholder}
            className="border border-[#C0C0C0] w-full px-4 py-3 text-[#1B1B1B] text-[13px]"
          />
        </div>

        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[16px] px-8 py-2"
            onClick={onClose}
          >
            Save
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[16px] px-8 py-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
