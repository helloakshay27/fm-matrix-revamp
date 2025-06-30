/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import SelectBox from "../../SelectBox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrganizations } from "../../../redux/slices/organizationSlice";
import { fetchCompany } from "../../../redux/slices/companySlice";
import{updateRegion, createRegion} from "../../../redux/slices/regionSlice";
// import {fetchCountry} from "../../../redux/slices/countrySlice";

import toast from "react-hot-toast";
import { set } from "react-hook-form";

const AddRegionModel = ({
  openModal,
  setOpenModal,
  isEditMode = false,
  initialData = null,
  onSuccess,
}) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { fetchOrganizations: organizations } = useSelector(
    (state) => state.fetchOrganizations
  );
  const { loading, success } = useSelector((state) => state.createRegion);
  const { loading: editLoading, success: editSuccess } = useSelector(
    (state) => state.updateRegion
  );
  const { fetchCompany: companies } = useSelector(
    (state) => state.fetchCompany
  );
//   const {fetchCountry: countries} = useSelector((state) => state.fetchCountry);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    country:"",
  });

  useEffect(() => {
    dispatch(fetchOrganizations({ token }));
    dispatch(fetchCompany({ token }));
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name,
        country: initialData.country_id,
      });
    } else {
      setFormData({
        name: "",
        country: "",
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
      region: {
        name: formData.name,
        country_id: formData.country || "",
      },
    };
    try {
      let response;
      if (isEditMode && initialData?.id) {
        response = await dispatch(
          updateRegion({
             token,
             id: initialData.id,
             payload,
          })
        );
      } else {
        response = await dispatch(createRegion({ token, payload }));
      }
      console.log(response);
      if (response.payload?.errors) {
        setError(response.payload.errors);
      } else if (response.payload.user_exists) {
        setError(response.payload.message);
      } else {
        toast.success(
          `Region ${isEditMode ? "updated" : "created"} successfully`,
          {
            iconTheme: {
              primary: "red", // This might directly change the color of the success icon
              secondary: "white", // The circle background
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
      country: "",
    });
    setError("");
    onSuccess();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      country: "",
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
          {/* <div className="px-6">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Country<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={country.map((country) => ({
                value: country.id,
                label: country.name,
              }))}
              className="w-full"
              value={formData.country}
              onChange={(value) => setFormData({ ...formData, country: value })}
            />
          </div> */}
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

export default AddRegionModel;
