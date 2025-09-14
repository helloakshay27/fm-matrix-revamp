import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import SelectBox from "../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchOrganizations } from "../../../redux/slices/organizationSlice";
import {
    createCompany,
    fetchCompany,
    resetCreateSuccess,
    resetEditSuccess,
} from "../../../redux/slices/companySlice";

const CompanyModal = ({ open, setOpenModal, editData, onEditSubmit }) => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    const { fetchOrganizations: organizations } = useSelector(
        (state) => state.fetchOrganizations
    );
    const { success } = useSelector((state) => state.createCompany);
    const { success: editSuccess } = useSelector((state) => state.editCompany);

    const [formData, setFormData] = useState({
        companyName: "",
        organizationId: "",
    });

    // ✅ Try/catch added here for fetching organizations
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchOrganizations({ token })).unwrap();
            } catch (error) {
                console.error("Error fetching organizations:", error);
                toast.dismiss();
                toast.error("Failed to fetch organizations");
            }
        };
        fetchData();
    }, [dispatch, token]);

    useEffect(() => {
        if (editData) {
            setFormData({
                companyName: editData.name || "",
                organizationId: editData.organization_id || "",
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        if (!formData.companyName || !formData.organizationId) {
            toast.dismiss();
            toast.error("Please fill in all required fields.");
            return;
        }

        const payload = {
            name: formData.companyName,
            organization_id: formData.organizationId,
            created_by: JSON.parse(localStorage.getItem("user")).id,
            user_id: JSON.parse(localStorage.getItem("user")).id,
            active: true,
            approve: true,
        };

        if (editData) {
            onEditSubmit(payload, editData.id);
        } else {
            dispatch(createCompany({ token, payload }));
        }
    };

    useEffect(() => {
        if (success) {
            toast.dismiss();
            toast.success("Company created successfully", {
                iconTheme: {
                    primary: "green",
                    secondary: "white",
                },
            });
            handleClose();
            dispatch(fetchCompany({ token }));
            dispatch(resetCreateSuccess());
        }
    }, [success, dispatch, token]);

    useEffect(() => {
        if (editSuccess) {
            handleClose();
            dispatch(fetchCompany({ token }));
            dispatch(resetEditSuccess());
        }
    }, [editSuccess, dispatch, token]);

    const handleClose = () => {
        setOpenModal(false);
        setFormData({
            companyName: "",
            organizationId: "",
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
            <div className="w-[560px] h-max pb-[6rem] bg-white absolute top-1/2 left-1/2 flex flex-col translate-x-[-50%] translate-y-[-50%] border border-[#C0C0C0] shadow-md">
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex justify-end">
                        <CloseIcon className="cursor-pointer" onClick={handleClose} />
                    </div>
                    <div className="space-y-4 px-6">
                        <div>
                            <label className="block text-sm mb-2 text-[#1B1B1B]">
                                Company Name<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Company Name"
                                className="w-full border px-3 py-2 text-sm text-[#1B1B1B] border-[#C0C0C0] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 text-[#1B1B1B]">
                                Organization <span className="text-red-500 ml-1">*</span>
                            </label>
                            <SelectBox
                                value={formData.organizationId}
                                options={
                                    organizations ? organizations.map((organization) => ({
                                        value: organization.id,
                                        label: organization.name,
                                    })) : []
                                }
                                onChange={(value) =>
                                    setFormData({ ...formData, organizationId: value })
                                }
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
                    <button
                        className="border border-[#C72030] text-sm px-8 py-2"
                        onClick={handleSubmit}
                    >
                        {editData ? "Update" : "Create"}
                    </button>
                    <button
                        className="border border-[#C72030] text-sm px-8 py-2"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyModal;
