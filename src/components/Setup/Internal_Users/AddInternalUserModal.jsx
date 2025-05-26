/* eslint-disable react/prop-types */
import CloseIcon from '@mui/icons-material/Close';
import SelectBox from '../../SelectBox';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchRoles } from '../../../redux/slices/roleSlice';
import { createInternalUser } from '../../../redux/slices/userSlice';

const AddInternalUser = ({ open, onClose, placeholder }) => {
    if (!open) return null;

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        role: null,
        reportTo: ""
    })

    const dispatch = useDispatch();
    const { loading, success, error } = useSelector(state => state.createInternalUser)
    const { fetchRoles: roles } = useSelector(state => state.fetchRoles)

    useEffect(() => {
        dispatch(fetchRoles())
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            user: {
                firstname: formData.name.split(" ")[0],
                lastname: formData.name.split(" ")[1],
                mobile: formData.mobile,
                email: formData.email,
                role_id: formData.role,
                user_type: "internal"
            }
        }

        dispatch(createInternalUser(payload))
    }

    useEffect(() => {
        if (success) {
            window.location.reload()
        }
    }, [success])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
            <div className="w-[560px] h-max bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">
                {/* Close Icon */}
                <div className="flex justify-end p-4">
                    <CloseIcon className="cursor-pointer" onClick={onClose} />
                </div>

                {/* Input Section */}
                <div className='space-y-4 h-full overflow-y-auto pb-4'>
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Name<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter name here"
                            className="border border-[#C0C0C0] w-full py-2 px-3 text-[#1B1B1B] text-[13px] focus:outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Mobile Number<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter mobile here"
                            className="border border-[#C0C0C0] w-full py-2 px-3 text-[#1B1B1B] text-[13px] focus:outline-none"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Role<span className="text-red-500 ml-1">*</span>
                        </label>
                        <SelectBox
                            options={
                                roles.map(role => ({
                                    value: role.id,
                                    label: role.display_name
                                }))
                            }
                            className="w-full"
                            value={formData.role}
                            onChange={(value) => setFormData({ ...formData, role: value })}
                        />
                    </div>
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Reports To<span className="text-red-500 ml-1">*</span>
                        </label>
                        <SelectBox
                            options={[
                                { value: 'Product Manager', label: 'Product Manager' },
                                { value: 'Project SPOC', label: 'Project SPOC' },
                                { value: 'Front End Dev', label: 'Front End Dev' },
                                { value: 'QA', label: 'QA' },
                            ]}
                            className="w-full"
                            value={formData.reportTo}
                            onChange={(value) => setFormData({ ...formData, reportTo: value })}
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="bottom-0 left-0 right-0 bg-[#D5DBDB] h-[70px] flex justify-center items-center gap-4">
                    <button
                        type='button'
                        className="border border-[#C72030] text-[#1B1B1B] text-[13px] px-8 py-2"
                        onClick={handleSubmit}
                    >
                        Save
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

export default AddInternalUser;
