import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";


const BankForm = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [formData, setFormData] = useState({
    bank_name: "",
    interest_rate: "",
    bank_logo: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();
  const { bankId } = useParams();
  const isEditMode = bankId !== 'create';  

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });

  const getMultipartHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  useEffect(() => {
    if (isEditMode && !hasFetched) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${baseURL}banks/${bankId}.json`, 
            getAuthHeaders()
          );
          
          const bankData = res.data?.bank || res.data;
          
          if (bankData) {
            setFormData({
              bank_name: bankData.bank_name || "",
              interest_rate: bankData.interest_rate || "",
              bank_logo: bankData.bank_logo || "",
            });
            
            if (bankData.bank_logo) {
              if (typeof bankData.bank_logo === 'object' && bankData.bank_logo.document_url) {
                setImagePreview(bankData.bank_logo.document_url);
              } else if (typeof bankData.bank_logo === 'string') {
                setImagePreview(bankData.bank_logo);
              }
            }
            
            setHasFetched(true);
          }
        } catch (err) {
          console.error("Failed to fetch bank:", err);
          toast.error("Failed to load bank");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [bankId, isEditMode, hasFetched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setFormData((prev) => ({
        ...prev,
        bank_logo: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bank_name.trim()) {
      toast.error("Bank name is required");
      return;
    }

    if (!formData.interest_rate || formData.interest_rate === "") {
      toast.error("Interest rate is required");
      return;
    }

    if (!isEditMode && !imageFile) {
      toast.error("Bank logo is required");
      return;
    }

    setLoading(true);

    try {
      let payload;
      let requestConfig;
      
      if (imageFile) {
        const formDataPayload = new FormData();
        formDataPayload.append('bank_name', formData.bank_name);
        formDataPayload.append('interest_rate', formData.interest_rate);
        formDataPayload.append('bank_logo', imageFile);
        
        payload = formDataPayload;
        requestConfig = getMultipartHeaders();
      } else {
        payload = {
          bank_name: formData.bank_name,
          interest_rate: formData.interest_rate,
        };
        requestConfig = getAuthHeaders();
      }
      
      if (isEditMode) {
        await axios.put(
          `${baseURL}banks/${bankId}.json`,
          payload,
          requestConfig
        );
        toast.success("Bank updated successfully!");
      } else {
        await axios.post(
          `${baseURL}banks.json`,
          payload,
          requestConfig
        );
        toast.success("Bank created successfully!");
      }

      navigate("/setup-member/banks-list"); // Update this path according to your routing
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit form";
      toast.error(errorMessage);
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
              onClick={() => navigate("/setup-member/banks-list")}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Banks</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">
              {isEditMode ? "Edit Bank" : "Create Bank"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "EDIT BANK" : "CREATE BANK"}
          </h1>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Bank Information</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bank Name */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Bank Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      placeholder="Enter bank name"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Interest Rate (%) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="interest_rate"
                      value={formData.interest_rate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      placeholder="Enter interest rate"
                      step="0.1"
                      min="0"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Bank Logo */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Bank Logo {!isEditMode && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="file"
                      name="bank_logo"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#C72030] file:text-white hover:file:bg-[#B8252F] file:cursor-pointer"
                      accept="image/*"
                      disabled={loading}
                    />
                    {imagePreview && (
                      <div className="mt-3">
                        <img
                          src={imagePreview}
                          alt="Bank logo preview"
                          className="max-w-[100px] max-h-[100px] object-cover border border-gray-200 rounded-md shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/setup-member/banks-list")}
                disabled={loading}
                className="px-6 py-2 bg-[#f6f4ee] text-[#C72030] rounded hover:bg-[#f0ebe0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#C72030] text-white rounded hover:bg-[#B8252F] transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update"
                  : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankForm;