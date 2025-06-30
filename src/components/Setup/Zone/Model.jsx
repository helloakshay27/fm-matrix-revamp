/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import SelectBox from "../../SelectBox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrganizations } from "../../../redux/slices/organizationSlice";
import { fetchCompany } from "../../../redux/slices/companySlice";
import{updateZone, createZone} from "../../../redux/slices/zoneSlice";
// import {fetchregion} from "../../../redux/slices/regionSlice";

import toast from "react-hot-toast";
import { set } from "react-hook-form";
import { fetchRegion } from "../../../redux/slices/regionSlice";

const AddZoneModel = ({
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
  const { fetchCompany: companies } = useSelector(
    (state) => state.fetchCompany
  );

  const {fetchRegion: region} = useSelector((state) => state.fetchRegion);
  const { loading, success } = useSelector((state) => state.createZone);
  const { loading: editLoading, success: editSuccess } = useSelector(
    (state) => state.updateZone
  )
//   const {fetchregion: countries} = useSelector((state) => state.fetchregion);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    organisation: null,
    region:"",
    company: null,
  });

  useEffect(() => {
    dispatch(fetchOrganizations({ token }));
    dispatch(fetchCompany({ token }));
    dispatch(fetchRegion({ token }));
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name,
        organisation: initialData.organization_id,
        region: initialData.region_id,
        company: initialData.company_id
      });
    } else {
      setFormData({
        name: "",
        organisation: null,
        region: "",
        company: "",
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
      zone: {
        name: formData.name,
        organization_id: formData.organisation,
        region_id: formData.region || "",
        company_id: formData.company,
        active: true
      },
    };
    try {
      let response;
      if (isEditMode && initialData?.id) {
        response = await dispatch(
          updateZone({
             token,
             id: initialData.id,
             payload,
          })
        );
      } else {
        response = await dispatch(createZone({ token, payload }));
      }
      console.log(response);
      if (response.payload?.errors) {
        setError(response.payload.errors);
      } else if (response.payload.user_exists) {
        setError(response.payload.message);
      } else {
        toast.success(
          `Zone ${isEditMode ? "updated" : "created"} successfully`,
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
      organisation: null,
      region: "",
      company: null,
    });
    setError("");
    onSuccess();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      organisation: null,
      region: "",
      company: null,
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
              Company<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={
                companies.map((org) => ({
                  value: org.id,
                  label: org.name,
                }))}
              className="w-full"
              value={formData.company}
              onChange={(value) =>
                setFormData({ ...formData, company: value })
              }
            />
          </div>
          <div className="px-6">
            <label className="block text-[11px] text-[#1B1B1B] mb-1">
              Region<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={region.map((region) => ({
                value: region.id,
                label: region.name,
              }))}
              className="w-full"
              value={formData.region}
              onChange={(value) => setFormData({ ...formData, region: value })}
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

export default AddZoneModel;
