/* eslint-disable react/prop-types */
import CloseIcon from '@mui/icons-material/Close';
import SelectBox from '../../SelectBox';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles } from '../../../redux/slices/roleSlice';
import { fetchOrganizations } from '../../../redux/slices/organizationSlice';
import { createExternalUser, fetchUpdateUser } from '../../../redux/slices/userSlice';


const AddExternalUserModal = ({
  open,
  onClose,
  placeholder,
  isEditMode = false,
  initialData = null,
}) => {

  const dispatch = useDispatch();
  const { fetchRoles: roles } = useSelector((state) => state.fetchRoles);
  const { fetchOrganizations: organizations } = useSelector(
    (state) => state.fetchOrganizations
  );
  const { loading, success, error } = useSelector(
    (state) => state.createExternalUser
  );
  const { success: succ } = useSelector(state => state.fetchUpdateUser)


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

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      user: {
        firstname: formData.username.split(' ')[0],
        lastname: formData.username.split(' ')[1] || '',
        organization_id: formData.organisation,
        mobile: formData.mobile,
        email: formData.email,
        role_id: formData.role,
        user_type: 'external',
      },
    };

    if (isEditMode && initialData?.id) {
      dispatch(fetchUpdateUser({ userId: initialData.id, updatedData: payload }));
    } else {
      dispatch(createExternalUser(payload));
    }
  };

  useEffect(() => {
    if (success || succ) {
      window.location.reload();
    }
  }, [success, succ]);

  if (!open) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="w-[560px] h-max bg-white transform border border-[#C0C0C0]">
        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={onClose} />
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
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bottom-0 left-0 right-0 bg-[#D5DBDB] h-[70px] flex justify-center items-center gap-4">
          <button
            type="button"
            className="border border-[#C72030] text-[#1B1B1B] text-[13px] px-8 py-2"
            onClick={handleSubmit}
          >
            {isEditMode ? 'Update' : 'Save'}
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[13px] px-8 py-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExternalUserModal;
