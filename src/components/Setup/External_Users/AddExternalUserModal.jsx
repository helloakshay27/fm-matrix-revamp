/* eslint-disable react/prop-types */
import CloseIcon from '@mui/icons-material/Close';
import SelectBox from '../../SelectBox';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles } from '../../../redux/slices/roleSlice';
import { fetchOrganizations } from '../../../redux/slices/organizationSlice';
import { createExternalUser, fetchUpdateUser } from '../../../redux/slices/userSlice';
import toast from 'react-hot-toast';


const AddExternalUserModal = ({
  open,
  onClose,
  placeholder,
  isEditMode = false,
  initialData = null,
  onSuccess
}) => {

  const dispatch = useDispatch();
  const { fetchRoles: roles } = useSelector((state) => state.fetchRoles);
  const { fetchOrganizations: organizations } = useSelector(
    (state) => state.fetchOrganizations
  );
  const { loading, success } = useSelector(
    (state) => state.createExternalUser
  );
  const { loading: editLoading,
    success: editSuccess, } = useSelector(state => state.fetchUpdateUser)
  const [error, setError] = useState('');


  const [formData, setFormData] = useState({
    username: '',
    organisation: null,
    email: '',
    mobile: '',
    role: null,
  });

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchOrganizations());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        username: `${initialData.firstname} ${initialData.lastname || ''}`.trim(),
        organisation: initialData.organization_id,
        email: initialData.email,
        mobile: initialData.mobile,
        role: initialData.role_id,
      });
    } else {
      setFormData({
        username: '',
        organisation: null,
        email: '',
        mobile: '',
        role: null,
      });
    }
  }, [isEditMode, initialData, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username === "") {
      setError("Please enter name");
      return;
    } else if (formData.mobile == "") {
      setError("Please enter mobile number");
      return;

    } else if (formData.email == "") {
      setError("Please enter email");
      return;

    }

    const nameParts = formData.username.trim().split(" ");
    const firstname = nameParts[0] || "";
    const lastname = nameParts.slice(1).join(" ") || "";

    const payload = {
      user: {
        firstname: firstname,
        lastname: lastname,
        organization_id: formData.organisation,
        mobile: formData.mobile,
        email: formData.email,
        role_id: formData.role,
        user_type: 'external',
      },
    };
    try {
      let response;
      if (isEditMode && initialData?.id) {
        response = await dispatch(fetchUpdateUser({ userId: initialData.id, updatedData: payload }));
      } else {
        response = await dispatch(createExternalUser(payload));
      }
      console.log(response);
      if (response.payload?.errors) {
        setError(response.payload.errors);
      } else if (response.payload.user_exists) {
        setError(response.payload.message)
      } else {
        toast.success(`User ${isEditMode ? 'updated' : 'created'} successfully`, {
          iconTheme: {
            primary: 'red', // This might directly change the color of the success icon
            secondary: 'white', // The circle background
          },
        })
        handleSuccess();
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    };
  };


  const handleSuccess = () => {
    setFormData({
      username: '',
      organisation: null,
      email: '',
      mobile: '',
      role: null,
    })
    setError('');
    onSuccess();
  }

  const handleClose = () => {
    setFormData({
      username: '',
      organisation: null,
      email: '',
      mobile: '',
      role: null,
    })
    setError('');
    onClose();

  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="w-[560px] h-max bg-white transform border border-[#C0C0C0]">
        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={handleClose} />
        </div>

        {/* Input Section */}
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pb-4">
          <div className="px-6">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Username<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter username here"
              className="border border-[#C0C0C0] w-full py-2 px-3 text-[#1B1B1B] text-[13px] focus:outline-none"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="px-6">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Organisation<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={organizations.map((org) => ({
                value: org.id,
                label: org.name,
              }))}
              className="w-full"
              value={formData.organisation}
              onChange={(value) =>
                setFormData({ ...formData, organisation: value })
              }
            />
          </div>
          <div className="px-6">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Role<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={roles.map((role) => ({
                value: role.id,
                label: role.display_name,
              }))}
              className="w-full"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
            />
          </div>
          <div className="px-6">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Email Id<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter email id here"
              className="border border-[#C0C0C0] w-full py-2 px-3 text-[#1B1B1B] text-[13px] focus:outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="px-6">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Mobile<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter Mobile here"
              className="border border-[#C0C0C0] w-full py-2 px-3 text-[#1B1B1B] text-[13px] focus:outline-none"
              value={formData.mobile}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d{0,10}$/.test(input)) {
                  setFormData({ ...formData, mobile: input })
                }
              }}
            />
          </div>
        </div>

        <div>
          {error && (
            <div className="flex justify-end mt-1 mr-5 align-center">
              <p className="text-red-500 text-[12px]">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="bottom-0 left-0 right-0 bg-[#D5DBDB] h-[70px] flex justify-center items-center gap-4">
          <button
            type="button"
            className="border border-[#C72030] text-[#1B1B1B] text-[13px] px-8 py-2"
            onClick={handleSubmit}
            disabled={loading || editLoading}
          >
            {loading || editLoading ? 'Submitting...' : isEditMode ? 'Update' : 'Save'}
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[13px] px-8 py-2"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExternalUserModal;
