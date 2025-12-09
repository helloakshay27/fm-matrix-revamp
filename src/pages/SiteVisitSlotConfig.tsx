import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import SelectBox from "../components/ui/select-box";

const SiteVisitSlotConfig = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (startHour === "" || startHour === null)
      newErrors.startHour = "Start hour is required";
    if (startMinute === "" || startMinute === null)
      newErrors.startMinute = "Start minute is required";
    if (endHour === "" || endHour === null) newErrors.endHour = "End hour is required";
    if (endMinute === "" || endMinute === null)
      newErrors.endMinute = "End minute is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all the required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    toast.dismiss();

    const formData = new FormData();
    formData.append("site_schedule[start_hour]", startHour);
    formData.append("site_schedule[start_minute]", startMinute);
    formData.append("site_schedule[end_hour]", endHour);
    formData.append("site_schedule[end_minute]", endMinute);

    try {
      const response = await axios.post(
        `${baseURL}/site_schedules`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Slot created successfully!");
      navigate("/setup-member/site-visit-slot-config-list");
    } catch (error) {
      console.error("Error submitting data:", error.response?.data || error.message);
      toast.error("Failed to create slot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {/* Header with Back Button and Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Visit Slot</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE VISIT SLOT</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Visit Slot Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Start Hours */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Hours
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={hours.map((hour) => ({
                      label: hour.toString().padStart(2, "0"),
                      value: hour,
                    }))}
                    value={startHour}
                    onChange={(value) => setStartHour(value)}
                    disabled={loading}
                  />
                  {errors.startHour && (
                    <p className="text-red-500 text-xs mt-1">{errors.startHour}</p>
                  )}
                </div>

                {/* Start Minutes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Minutes
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={minutes.map((minute) => ({
                      label: minute.toString().padStart(2, "0"),
                      value: minute,
                    }))}
                    value={startMinute}
                    onChange={(value) => setStartMinute(value)}
                    disabled={loading}
                  />
                  {errors.startMinute && (
                    <p className="text-red-500 text-xs mt-1">{errors.startMinute}</p>
                  )}
                </div>

                {/* End Hours */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Hours
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={hours.map((hour) => ({
                      label: hour.toString().padStart(2, "0"),
                      value: hour,
                    }))}
                    value={endHour}
                    onChange={(value) => setEndHour(value)}
                    disabled={loading}
                  />
                  {errors.endHour && (
                    <p className="text-red-500 text-xs mt-1">{errors.endHour}</p>
                  )}
                </div>

                {/* End Minutes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Minutes
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={minutes.map((minute) => ({
                      label: minute.toString().padStart(2, "0"),
                      value: minute,
                    }))}
                    value={endMinute}
                    onChange={(value) => setEndMinute(value)}
                    disabled={loading}
                  />
                  {errors.endMinute && (
                    <p className="text-red-500 text-xs mt-1">{errors.endMinute}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteVisitSlotConfig;
