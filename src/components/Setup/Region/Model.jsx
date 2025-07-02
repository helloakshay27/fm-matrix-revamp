/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import SelectBox from "../../SelectBox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRegion, createRegion } from "../../../redux/slices/regionSlice";
import toast from "react-hot-toast";

const AddRegionModel = ({
  setOpenModal,
  isEditMode = false,
  initialData = null,
  onSuccess,
}) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.createRegion);
  const { loading: editLoading } = useSelector((state) => state.updateRegion);
  const { fetchCountry: countries } = useSelector(
    (state) => state.fetchCountry
  );

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    country: "",
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name || "",
        country: Number(initialData.country_id) || "",
      });
    } else {
      setFormData({
        name: "",
        country: "",
      });
    }
    setError("");
  }, [isEditMode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter a region name.");
      return;
    }

    if (!formData.country) {
      setError("Please select a country.");
      return;
    }

    const payload = {
      region: {
        name: formData.name.trim(),
        country_id: formData.country,
        active: true,
      },
    };

    try {
      let result;
      if (isEditMode && initialData?.id) {
        result = await dispatch(
          updateRegion({ token, id: initialData.id, payload })
        ).unwrap();
      } else {
        result = await dispatch(createRegion({ token, payload })).unwrap();
      }

      if (result?.errors) {
        setError(
          typeof result.errors === "string"
            ? result.errors
            : "Validation error occurred."
        );
      } else if (result?.user_exists) {
        setError(result.message || "Region already exists.");
      } else {
        toast.success(
          `Region ${isEditMode ? "updated" : "created"} successfully`,
          {
            iconTheme: {
              primary: "green",
              secondary: "white",
            },
          }
        );
        handleSuccess();
      }
    } catch (err) {
      console.error("Region submit error:", err);
      setError(err?.message || "Something went wrong.");
    }
  };

  const handleSuccess = () => {
    setFormData({ name: "", country: "" });
    setError("");
    onSuccess();
  };

  const handleClose = () => {
    setFormData({ name: "", country: "" });
    setError("");
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="w-[560px] h-max bg-white border border-[#C0C0C0]">
        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={handleClose} />
        </div>

        {/* Form Fields */}
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pb-4 px-6">
          {/* Name */}
          <div>
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter region name"
              className="border border-[#C0C0C0] w-full py-2 px-3 text-[13px] text-[#1B1B1B] focus:outline-none"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Country<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={
                countries
                  ? countries.map((c) => ({ value: c.id, label: c.name }))
                  : []
              }
              className="w-full"
              value={formData.country}
              onChange={(value) => setFormData({ ...formData, country: value })}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-right text-red-500 text-[12px] mt-1 mr-5">
            {error}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="bg-[#D5DBDB] h-[70px] flex justify-center items-center gap-4 mt-4">
          <button
            type="button"
            className="border border-[#C72030] text-[13px] text-[#1B1B1B] px-8 py-2"
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
            type="button"
            className="border border-[#C72030] text-[13px] text-[#1B1B1B] px-8 py-2"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRegionModel;
