/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import SelectBox from "../../SelectBox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveRoles } from "../../../redux/slices/roleSlice";
import { fetchOrganizations } from "../../../redux/slices/organizationSlice";
import {
  createExternalUser,
  fetchUpdateUser,
} from "../../../redux/slices/userSlice";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { fetchCompany } from "../../../redux/slices/companySlice";

const AddExternalUserModal = ({
  open,
  onClose,
  isEditMode = false,
  initialData = null,
  onSuccess,
}) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { fetchActiveRoles: roles = [] } = useSelector(
    (state) => state.fetchActiveRoles || {}
  );
  const { fetchOrganizations: organizations = [] } = useSelector(
    (state) => state.fetchOrganizations || {}
  );
  const { fetchCompany: companies = [] } = useSelector(
    (state) => state.fetchCompany || {}
  );
  const { loading } = useSelector((state) => state.createExternalUser || {});
  const { loading: editLoading } = useSelector(
    (state) => state.fetchUpdateUser || {}
  );

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    organisation: null,
    email: "",
    mobile: "",
    password: "",
    role: null,
    company: null,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (token) {
          await dispatch(fetchActiveRoles({ token })).unwrap();
          await dispatch(fetchOrganizations({ token })).unwrap();
          await dispatch(fetchCompany({ token })).unwrap();
        }
      } catch (error) {
        toast.error("Failed to load dropdown data");
      }
    };

    fetchInitialData();
  }, [dispatch, token]);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        username: `${initialData?.firstname || ""} ${initialData?.lastname || ""
          }`.trim(),
        organisation: initialData?.organization_id || null,
        email: initialData?.email || "",
        mobile: initialData?.mobile || "",
        role: initialData?.role_id || null,
        password: "",
        company: initialData?.company_id || null,
      });
    } else {
      setFormData({
        username: "",
        organisation: null,
        email: "",
        mobile: "",
        password: "",
        role: null,
        company: null,
      });
    }
  }, [isEditMode, initialData, open]);

  const resetForm = () => {
    setFormData({
      username: "",
      organisation: null,
      email: "",
      mobile: "",
      password: "",
      role: null,
      company: null,
    });
    setError("");
  };

  const handleSuccess = () => {
    resetForm();
    onSuccess?.();
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setError("Please enter name");
      return;
    }
    if (!formData.mobile.trim()) {
      setError("Please enter mobile number");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter email");
      return;
    }

    const nameParts = formData.username.trim().split(" ");
    const firstname = nameParts[0] || "";
    const lastname = nameParts.slice(1).join(" ") || "";

    const payload = {
      user: {
        firstname,
        lastname,
        organization_id: formData.organisation,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        role_id: formData.role,
        user_type: "external",
        company_id: formData.company,
      },
    };

    try {
      let response;
      if (isEditMode && initialData?.id) {
        response = await dispatch(
          fetchUpdateUser({
            token,
            userId: initialData.id,
            updatedData: payload,
          })
        );
      } else {
        response = await dispatch(createExternalUser({ token, payload }));
      }

      const res = response?.payload;

      if (res?.errors) {
        setError(res.errors);
      } else if (res?.user_exists) {
        setError(res.message);
      } else {
        toast.success(
          `User ${isEditMode ? "updated" : "created"} successfully`,
          {
            iconTheme: { primary: "green", secondary: "white" },
          }
        );
        handleSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong");
    }
  };

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
              autoComplete="new-username"
              name="internal_user_name"
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
              autoComplete="new-email"
              name="external_user_email"
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
                  setFormData({ ...formData, mobile: input });
                }
              }}
            />
          </div>

          <div className="px-6 relative">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Password<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="border border-[#C0C0C0] w-full py-2 px-3 text-[#1B1B1B] text-[13px] focus:outline-none"
              placeholder="Enter Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              autoComplete="new-password"
              name="external_user_password"
            />
            {showPassword ? (
              <EyeOff
                size={20}
                className="absolute right-10 top-10 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                size={20}
                className="absolute right-10 top-10 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <div className="px-6">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Organisation<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={(organizations || []).map((org) => ({
                value: org?.id,
                label: org?.name,
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
              Company<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={(companies || []).map((comp) => ({
                value: comp?.id,
                label: comp?.name,
              }))}
              className="w-full"
              value={formData.company}
              onChange={(value) => setFormData({ ...formData, company: value })}
            />
          </div>

          <div className="px-6">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Role<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={(roles || []).map((role) => ({
                value: role?.id,
                label: role?.display_name,
              }))}
              className="w-full"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
            />
          </div>
        </div>

        {error && (
          <div className="flex justify-end mt-1 mr-5 align-center">
            <p className="text-red-500 text-[12px]">{error}</p>
          </div>
        )}

        {/* Footer Buttons */}
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

export default AddExternalUserModal;
