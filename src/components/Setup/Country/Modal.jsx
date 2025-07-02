/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCountry, createCountry } from "../../../redux/slices/countrySlice";

import toast from "react-hot-toast";

const AddCountryModel = ({
  openModal,
  setOpenModal,
  isEditMode = false,
  initialData = null,
  onSuccess,
}) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.createCountry);
  const { loading: editLoading } = useSelector(
    (state) => state.updateCountry
  );

  //   const {fetchCountry: countries} = useSelector((state) => state.fetchCountry);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name,
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name === "") {
      setError("Please enter name");
      return;
    }

    const payload = {
      country: {
        name: formData.name,
        active: true
      },
    };
    try {
      let response;
      if (isEditMode && initialData?.id) {
        response = await dispatch(
          updateCountry({
            token,
            id: initialData.id,
            payload,
          })
        );
      } else {
        response = await dispatch(createCountry({ token, payload }));
      }
      console.log(response);
      if (response.payload?.errors) {
        setError(response.payload.errors);
      } else if (response.payload.user_exists) {
        setError(response.payload.message);
      } else {
        toast.success(
          `Country ${isEditMode ? "updated" : "created"} successfully`,
          {
            iconTheme: {
              primary: "green",
              secondary: "white",
            },
          }
        );
        handleSuccess();
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleSuccess = () => {
    setFormData({
      name: "",
    });
    setError("");
    onSuccess();
  };

  const handleClose = () => {
    setFormData({
      name: "",
    });
    setError("");
    setOpenModal(false);
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
              Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter name here"
              className="border border-[#C0C0C0] w-full py-2 px-3 text-[#1B1B1B] text-[13px] focus:outline-none"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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

export default AddCountryModel;
