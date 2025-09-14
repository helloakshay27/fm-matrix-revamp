import CloseIcon from "@mui/icons-material/Close";
import SelectBox from "../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchActiveRoles } from "../../../redux/slices/roleSlice";
import {
    createInternalUser,
    fetchUpdateUser,
    fetchUsers,
} from "../../../redux/slices/userSlice";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { fetchCompany } from "../../../redux/slices/companySlice";

const AddInternalUser = ({
    open,
    onClose,
    onSuccess,
    isEditMode = false,
    selectedUser = null,
}) => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        password: "",
        role: null,
        reportTo: "",
        company: "",
    });

    const { success, loading } = useSelector((state) => state.createInternalUser);
    const { fetchActiveRoles: roles = [] } = useSelector((state) => state.fetchActiveRoles);
    const { loading: editLoading, success: editSuccess } = useSelector(
        (state) => state.fetchUpdateUser
    );
    const { fetchUsers: users = [] } = useSelector((state) => state.fetchUsers);
    const { fetchCompany: companies = [] } = useSelector(
        (state) => state.fetchCompany
    );

    // Fetch dropdown data
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchActiveRoles({ token })).unwrap();
                await dispatch(fetchUsers({ token })).unwrap();
                await dispatch(fetchCompany({ token })).unwrap();
            } catch (err) {
                console.error("Dropdown data fetch failed:", err);
                toast.error("Failed to load dropdown data");
            }
        };

        if (token) {
            fetchData();
        }
    }, [dispatch, token]);

    // Prefill for edit mode
    useEffect(() => {
        if (isEditMode && selectedUser) {
            setFormData({
                name: `${selectedUser.firstname || ""} ${selectedUser.lastname || ""
                    }`.trim(),
                mobile: selectedUser.mobile || "",
                email: selectedUser.email || "",
                role: selectedUser.lock_role?.id || null,
                reportTo: selectedUser.report_to_id || "",
                company: selectedUser.company_id || "",
            });
        }
    }, [isEditMode, selectedUser]);

    // Form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name.trim()) return setError("Please enter name");
        if (!formData.mobile) return setError("Please enter mobile number");
        if (!formData.email.trim()) return setError("Please enter email");
        if (!isEditMode && !formData.password) return setError("Please enter password");
        if (!formData.company) return setError("Please select company");
        if (!formData.role) return setError("Please select role");
        if (!formData.reportTo) return setError("Please select report to");


        const nameParts = formData.name.trim().split(" ");
        const firstname = nameParts[0] || "";
        const lastname = nameParts.slice(1).join(" ") || "";

        const payload = {
            user: {
                firstname,
                lastname,
                mobile: formData.mobile,
                email: formData.email,
                password: formData.password,
                role_id: formData.role,
                user_type: "internal",
                report_to_id: formData.reportTo,
                company_id: formData.company,
            },
        };

        try {
            const response = isEditMode
                ? await dispatch(
                    fetchUpdateUser({
                        token,
                        userId: selectedUser.id,
                        updatedData: payload,
                    })
                ).unwrap()
                : await dispatch(createInternalUser({ token, payload })).unwrap();

            if (!response.user_exists && !response.error) {
                toast.success(
                    `User ${isEditMode ? "updated" : "created"} successfully`,
                    {
                        iconTheme: {
                            primary: 'green', // This might directly change the color of the success icon
                            secondary: 'white', // The circle background
                        },
                    }
                );
                handleSuccess();
            } else {
                setError(
                    response.message || response.error || "Unknown error occurred"
                );
            }
        } catch (err) {
            console.error("Submission error:", err);
            const message = err?.message || err?.errors || "Something went wrong";
            setError(typeof message === "string" ? message : JSON.stringify(message));
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            mobile: "",
            email: "",
            password: "",
            role: null,
            reportTo: "",
            company: "",
        });
        setError("");
        onClose();
    };

    const handleSuccess = () => {
        setFormData({
            name: "",
            mobile: "",
            email: "",
            password: "",
            role: null,
            reportTo: "",
            company: "",
        });
        setError("");
        onSuccess();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
            <div className="w-[560px] h-max bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">
                <div className="flex justify-end p-4">
                    <CloseIcon className="cursor-pointer" onClick={handleClose} />
                </div>

                <div className="space-y-4 h-full overflow-y-auto pb-4">
                    {/* Name */}
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Name<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter name here"
                            className="border border-[#C0C0C0] w-full py-2 px-3 text-[13px] text-[#1B1B1B] focus:outline-none"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    {/* Mobile */}
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Mobile Number<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter mobile number here"
                            className="border border-[#C0C0C0] w-full py-2 px-3 text-[13px] text-[#1B1B1B] focus:outline-none"
                            value={formData.mobile}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (/^\d{0,10}$/.test(input)) {
                                    setFormData({ ...formData, mobile: input });
                                }
                            }}
                        />
                    </div>

                    {/* Email */}
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Email Id<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email id here"
                            className="border border-[#C0C0C0] w-full py-2 px-3 text-[13px] text-[#1B1B1B] focus:outline-none"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            autoComplete="new-email"
                            name="internal_user_email"
                        />
                    </div>

                    {/* Password */}
                    <div className="px-6 relative">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Password<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="border border-[#C0C0C0] w-full py-2 px-3 text-[13px] text-[#1B1B1B] focus:outline-none"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            autoComplete="new-password"
                            name="internal_user_password"
                        />
                        {showPassword ? (
                            <EyeOff
                                className="absolute right-10 top-10 -translate-y-1/2 cursor-pointer"
                                size={20}
                                onClick={() => setShowPassword(false)}
                            />
                        ) : (
                            <Eye
                                className="absolute right-10 top-10 -translate-y-1/2 cursor-pointer"
                                size={20}
                                onClick={() => setShowPassword(true)}
                            />
                        )}
                    </div>

                    {/* Company */}
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Company<span className="text-red-500 ml-1">*</span>
                        </label>
                        <SelectBox
                            options={
                                companies ? companies.map((company) => ({
                                    value: company.id,
                                    label: company.name,
                                })) : []
                            }
                            value={formData.company}
                            onChange={(val) => setFormData({ ...formData, company: val })}
                            className="w-full"
                        />
                    </div>

                    {/* Role */}
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Role<span className="text-red-500 ml-1">*</span>
                        </label>
                        <SelectBox
                            options={
                                roles ? roles.map((role) => ({
                                    value: role.id,
                                    label: role.display_name
                                        .replace(/_/g, ' ')                      // Replace underscores with spaces
                                        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
                                })) : []
                            }
                            value={formData.role}
                            onChange={(val) => setFormData({ ...formData, role: val })}
                            className="w-full"
                        />
                    </div>

                    {/* Reports To */}
                    <div className="px-6">
                        <label className="block text-[11px] text-[#1B1B1B] mb-1">
                            Reports To<span className="text-red-500 ml-1">*</span>
                        </label>
                        <SelectBox
                            options={
                                users ? users.map((user) => ({
                                    value: user.id,
                                    label: `${user.firstname || ""} ${user.lastname || ""}`,
                                })) : []
                            }
                            value={formData.reportTo}
                            onChange={(val) => setFormData({ ...formData, reportTo: val })}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex justify-end text-[12px] mt-1 mr-4">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="bottom-0 left-0 right-0 bg-[#D5DBDB] h-[70px] flex justify-center items-center gap-4">
                    <button
                        type="button"
                        className="border border-[#C72030] text-[#1B1B1B] text-[13px] px-8 py-2"
                        onClick={handleSubmit}
                        disabled={loading || editLoading}
                    >
                        {loading || editLoading
                            ? "Submitting..."
                            : isEditMode
                                ? "Update"
                                : "Save"}
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
