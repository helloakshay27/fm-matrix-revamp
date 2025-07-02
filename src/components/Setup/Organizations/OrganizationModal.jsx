import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
    createOrganization,
    fetchOrganizations,
    resetCreateSuccess,
    resetEditSuccess,
} from "../../../redux/slices/organizationSlice";

const OrganizationModal = ({ open, setOpenModal, editData, onEditSubmit }) => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const { success } = useSelector((state) => state.createOrganization);
    const { success: editSuccess } = useSelector((state) => state.editOrganization);

    const [orgName, setOrgName] = useState("");
    const [orgDomain, setOrgDomain] = useState("");
    const [orgLogo, setOrgLogo] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (editData) {
            setOrgName(editData.name || "");
            setOrgDomain(editData.domain || "");
            setPreviewUrl(editData.attachfile?.document_url || null);
            setOrgLogo(null);
        } else {
            resetForm();
        }
    }, [editData]);

    const resetForm = () => {
        setOrgName("");
        setOrgDomain("");
        setOrgLogo(null);
        setPreviewUrl(null);
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setOrgLogo(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = async () => {
        if (!orgName || !orgDomain || (!orgLogo && !editData)) {
            toast.dismiss();
            toast.error("All fields are required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("organization[name]", orgName);
            formData.append("organization[domain]", orgDomain);
            if (orgLogo) formData.append("organization[org_image]", orgLogo);
            formData.append("organization[active]", true);
            formData.append(
                "organization[created_by_id]",
                JSON.parse(localStorage.getItem("user")).id
            );

            if (editData) {
                onEditSubmit(formData, editData.id);
            } else {
                await dispatch(createOrganization({ token, payload: formData }));
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    useEffect(() => {
        if (success) {
            toast.success("Organization created successfully", {
                iconTheme: {
                    primary: "green",
                    secondary: "white",
                },
            });
            handleClose();
            dispatch(fetchOrganizations({ token }));
            dispatch(resetCreateSuccess());
        }
    }, [success, dispatch, token]);

    useEffect(() => {
        if (editSuccess) {
            handleClose();
            dispatch(fetchOrganizations({ token }));
            dispatch(resetEditSuccess());
        }
    }, [editSuccess, dispatch, token]);

    const handleClose = () => {
        setOpenModal(false);
        resetForm();
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
                                Organization Name<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Organization Name"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                className="w-full border px-3 py-2 text-sm text-[#1B1B1B] border-[#C0C0C0] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-[#1B1B1B]">
                                Organization Logo<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="w-full border px-3 py-2 text-sm border-[#C0C0C0] focus:outline-none"
                            />
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-20 h-20 mt-2 border rounded object-cover"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-[#1B1B1B]">
                                Organization Domain<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Organization Domain"
                                value={orgDomain}
                                onChange={(e) => setOrgDomain(e.target.value)}
                                className="w-full border px-3 py-2 text-sm text-[#1B1B1B] border-[#C0C0C0] focus:outline-none"
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

export default OrganizationModal;
