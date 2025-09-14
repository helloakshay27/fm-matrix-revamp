/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import SelectBox from "../../SelectBox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateZone, createZone } from "../../../redux/slices/zoneSlice";
import toast from "react-hot-toast";

const AddZoneModel = ({
  setOpenModal,
  isEditMode = false,
  initialData = null,
  onSuccess,
}) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { fetchRegion: region } = useSelector((state) => state.fetchRegion);
  const { loading } = useSelector((state) => state.createZone);
  const { loading: editLoading } = useSelector((state) => state.updateZone);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    region: "",
    // country: "",
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name,
        region: initialData.region_id,
        // country: initialData.country_id,
      });
    } else {
      setFormData({
        name: "",
        region: "",
        // country: "",
      });
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name === "") {
      setError("Please enter name");
      return;
    } else if (formData.region === "") {
      setError("Please select region");
      return;
    }

    const payload = {
      zone: {
        name: formData.name,
        region_id: formData.region || "",
        // country_id: formData.country || "",
        active: true,
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
          }).unwrap()
        );
      } else {
        response = await dispatch(createZone({ token, payload })).unwrap();
      }
      console.log(response);
      toast.success(`Zone ${isEditMode ? "updated" : "created"} successfully`, {
        iconTheme: {
          primary: "green", // This might directly change the color of the success icon
          secondary: "white", // The circle background
        },
      });
      handleSuccess();
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleSuccess = () => {
    setFormData({
      name: "",
      region: "",
      // country: "",
    });
    setError("");
    onSuccess();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      region: "",
      // country: "",
    });
    setError("");
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-max pb-[7rem] bg-white absolute top-1/2 left-1/2 flex flex-col translate-x-[-50%] translate-y-[-50%] border border-[#C0C0C0] shadow-md">
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
              Region<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              options={
                region
                  ? region.map((region) => ({
                    value: region.id,
                    label: region.name,
                  }))
                  : []
              }
              className="w-full"
              value={formData.region}
              onChange={(value) => setFormData({ ...formData, region: value })}
            />
          </div>
        </div>

        {/* <div className="px-6">
          <label className="block text-[11px] text-[#1B1B1B] mb-1">
            Country<span className="text-red-500 ml-1">*</span>
          </label>
          <SelectBox
            options={country.map((region) => ({
              value: region.id,
              label: region.name,
            }))}
            className="w-full"
            value={formData.country}
            onChange={(value) => setFormData({ ...formData, country: value })}
          />
        </div> */}

        <div>
          {error && (
            <div className="flex justify-end mt-1 mr-5 align-center">
              <p className="text-red-500 text-[12px]">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
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
