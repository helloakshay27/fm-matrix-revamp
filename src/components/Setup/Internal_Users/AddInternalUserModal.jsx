/* eslint-disable react/prop-types */
import CloseIcon from '@mui/icons-material/Close';
import SelectBox from '../../SelectBox';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchRoles } from '../../../redux/slices/roleSlice';
import {
    createInternalUser,
    fetchUpdateUser,
    fetchUsers,
} from '../../../redux/slices/userSlice';
import { toast } from 'react-hot-toast';

const AddInternalUser = ({ open, onClose, placeholder, onSuccess, isEditMode = false, selectedUser = null }) => {
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        role: null,
        reportTo: ""
    })
    const dispatch = useDispatch();
    const { success, loading } = useSelector(state => state.createInternalUser)
    const { fetchRoles: roles } = useSelector(state => state.fetchRoles)
    const { loading: editLoading,
        success: editSuccess, } = useSelector(state => state.fetchUpdateUser)
    const { fetchUsers: users } = useSelector(state => state.fetchUsers)
    const [error, setError] = useState('');

    useEffect(() => {
        dispatch(fetchRoles({ token }));
        dispatch(fetchUsers({ token }));
    }, [dispatch])

    useEffect(() => {
        if (isEditMode && selectedUser) {
            setFormData({
                name: `${selectedUser.firstname || ''} ${selectedUser.lastname || ''}`,
                mobile: selectedUser.mobile || '',
                email: selectedUser.email || '',
                role: selectedUser.lock_role?.id || null,
                reportTo: selectedUser.report_to_id
            });
        }
    }, [isEditMode, selectedUser]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name === "") {
            setError("Please enter name");
            return;
        } else if (formData.mobile == "") {
            setError("Please enter mobile number");
            return;

        } else if (formData.email == "") {
            setError("Please enter email");
            return;

        } else if (formData.role == null) {
            setError("Please select role");
            return;

        } else if (formData.reportTo == null) {
            setError("Please select report to");
            return;

        }

        const nameParts = formData.name.trim().split(" ");
        const firstname = nameParts[0] || "";
        const lastname = nameParts.slice(1).join(" ") || "";

        const payload = {
            user: {
                firstname: firstname,
                lastname: lastname,
                mobile: formData.mobile,
                email: formData.email,
                role_id: formData.role,
                user_type: "internal",
                report_to_id: formData.reportTo
            }
        }
        let response;
        try {
            if (isEditMode) {
                response = await dispatch(fetchUpdateUser({ token, userId: selectedUser.id, updatedData: payload })).unwrap();
            } else {
                response = await dispatch(createInternalUser({ token, payload })).unwrap();
            }
            console.log(response);
            if (!response.user_exists && !response.error) {
                toast.success(`User ${isEditMode ? 'updated' : 'created'} successfully`, {
                    iconTheme: {
                        primary: 'red', // This might directly change the color of the success icon
                        secondary: 'white', // The circle background
                    },
                })
                handleSuccess();
            } else {
                setError(response.message || response.error);
            }
        }
        catch (error) {
            console.log(error);
            setError(error.errors);
        }
    };

    const handleClose = () => {
        setFormData({
            email: "",
            mobile: "",
            name: "",
            reportTo: "",
            role: null
        })
        setError("");
        onClose();
    }

    const handleSuccess = () => {
        setFormData({
            email: "",
            mobile: "",
            name: "",
            reportTo: "",
            role: null
        })
        setError("");
        onSuccess();
    }

    if (!open) return null;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
            <div className="w-[560px] h-max bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">
                {/* Close Icon */}
                <div className="flex justify-end p-4">
                    <CloseIcon className="cursor-pointer" onClick={handleClose} />
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
                            required
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
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,10}$/.test(input)) {
                                    setFormData({ ...formData, mobile: input })
                                }
                            }}
                            required
                        />
                    </div>
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Role<span className="text-red-500 ml-1">*</span>
                        </label>
                        <SelectBox
                            options={
                                roles.map((role) => ({
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
                            Email Id<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter email id here"
                            className="border border-[#C0C0C0] w-full py-2 px-3 text-[#1B1B1B] text-[13px] focus:outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Reports To<span className="text-red-500 ml-1">*</span>
                        </label>
                        <SelectBox
                            options={users.map((user) => ({
                                value: user.id,
                                label: user.firstname + " " + user.lastname
                            }))}
                            className="w-full"
                            value={formData.reportTo}
                            onChange={(value) => setFormData({ ...formData, reportTo: value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end align-center text-[12px] mt-1 mr-4">
                    {error && <p className="text-red-500">{error}</p>}
                </div>

                {/* Footer Buttons */}
                <div className="bottom-0 left-0 right-0 bg-[#D5DBDB] h-[70px] flex justify-center items-center gap-4">
                    <button
                        type='button'
                        className="border border-[#C72030] text-[#1B1B1B] text-[13px] px-8 py-2"
                        onClick={handleSubmit}
                        disabled={loading || editLoading}
                    >
                        {loading || editLoading ? "Submitting..." : isEditMode ? "Update" : "Save"}
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

export default AddInternalUser;
