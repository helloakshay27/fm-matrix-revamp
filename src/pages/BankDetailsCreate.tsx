import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import SelectBox from "@/components/ui/select-box";


const BankDetailsCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    address: "",
    country_id: "",
    state_id: "",
    city_id: "",
    pincode: "",
    account_type: "Savings",
    account_number: "",
    confirm_account_number: "",
    branch_name: "",
    micr_number: "",
    ifsc_code: "",
    resource_type: "Project",
    resource_id: "",
    benficary_name: "",
    city_name: "",
    remark: "",
    active: true,
    company_codes: "",
    is_vertual: false,
    status: "active",
    virtual_account_code: "",
  });

  // Fetch Countries
  useEffect(() => {
    setLoading(true);
    fetch(`${API_CONFIG.BASE_URL}countries.json`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.countries)) {
          setCountries(data.countries);
        } else {
          setCountries([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        toast.error("Failed to fetch countries.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch Projects/Resources
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${baseURL}projects.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects.");
      }
    };

    fetchProjects();
  }, []);

  // Fetch States based on selected country
  useEffect(() => {
    if (bankDetails.country_id) {
      fetch(`${baseURL}states.json?country_id=${bankDetails.country_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.states)) {
            setStates(data.states);
          } else {
            setStates([]);
          }
          // Reset state and city when country changes
          setBankDetails((prev) => ({
            ...prev,
            state_id: "",
            city_id: "",
            city_name: "",
          }));
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
          toast.error("Failed to fetch states.");
        });
    } else {
      setStates([]);
      setCities([]);
    }
  }, [bankDetails.country_id]);

  // Fetch Cities based on selected state
  useEffect(() => {
    if (bankDetails.state_id) {
      fetch(`${baseURL}cities.json?state_id=${bankDetails.state_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.cities)) {
            setCities(data.cities);
          } else {
            setCities([]);
          }
          // Reset city when state changes
          setBankDetails((prev) => ({ ...prev, city_id: "", city_name: "" }));
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
          toast.error("Failed to fetch cities.");
        });
    } else {
      setCities([]);
    }
  }, [bankDetails.state_id]);

  // Auto-populate city name when city is selected
  useEffect(() => {
    if (bankDetails.city_id) {
      const selectedCity = cities.find(
        (city) => city.id.toString() === bankDetails.city_id.toString()
      );
      if (selectedCity) {
        setBankDetails((prev) => ({ ...prev, city_name: selectedCity.name }));
      }
    }
  }, [bankDetails.city_id, cities]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle SelectBox Changes
  const handleSelectChange = (name, value) => {
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Validate IFSC Code format
  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  // Validate Form Before Submission
  const validateForm = () => {
    if (!bankDetails.bank_name.trim()) {
      toast.error("Bank Name is required.");
      return false;
    }

    if (!bankDetails.account_number.trim()) {
      toast.error("Account Number is required.");
      return false;
    }

    if (!bankDetails.confirm_account_number.trim()) {
      toast.error("Confirm Account Number is required.");
      return false;
    }

    if (bankDetails.account_number !== bankDetails.confirm_account_number) {
      toast.error("Account numbers do not match.");
      return false;
    }

    if (!bankDetails.ifsc_code.trim()) {
      toast.error("IFSC Code is required.");
      return false;
    }

    if (!validateIFSC(bankDetails.ifsc_code)) {
      toast.error("Please enter a valid IFSC Code format (e.g., SBIN0001234).");
      return false;
    }

    if (!bankDetails.benficary_name.trim()) {
      toast.error("Beneficiary Name is required.");
      return false;
    }

    if (!bankDetails.branch_name.trim()) {
      toast.error("Branch Name is required.");
      return false;
    }

    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dismiss existing toasts before showing a new one
    toast.dismiss();

    if (!validateForm()) return;

    setSubmitting(true);

    const bankDetailsPayload = {
      bank_detail: {
        ...bankDetails,
        // Convert string values to appropriate types
        country_id: parseInt(bankDetails.country_id) || null,
        state_id: parseInt(bankDetails.state_id) || null,
        city_id: parseInt(bankDetails.city_id) || null,
        resource_id: parseInt(bankDetails.resource_id) || null,
        resource_type: "Project", // Always set to "Project"
        active: bankDetails.active,
        is_vertual: bankDetails.is_vertual,
      },
    };

    try {
      const response = await fetch(`${baseURL}bank_details.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(bankDetailsPayload),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success("Bank Details created successfully!");

        // Reset form
        setBankDetails({
          bank_name: "",
          address: "",
          country_id: "",
          state_id: "",
          city_id: "",
          pincode: "",
          account_type: "Savings",
          account_number: "",
          confirm_account_number: "",
          branch_name: "",
          micr_number: "",
          ifsc_code: "",
          resource_type: "Project",
          resource_id: "",
          benficary_name: "",
          city_name: "",
          remark: "",
          active: true,
          company_codes: "",
          is_vertual: false,
          status: "active",
          virtual_account_code: "",
        });

        // Navigate to bank details list or desired page
        navigate("/setup-member/bank-details-list");
      } else {
        const errorData = await response.json();
        console.error("Bank Details API Error:", errorData);
        toast.error(errorData.message || "Failed to create bank details.");
      }
    } catch (error) {
      console.error("Error submitting bank details:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setBankDetails({
      bank_name: "",
      address: "",
      country_id: "",
      state_id: "",
      city_id: "",
      pincode: "",
      account_type: "Savings",
      account_number: "",
      confirm_account_number: "",
      branch_name: "",
      micr_number: "",
      ifsc_code: "",
      resource_type: "Project",
      resource_id: "",
      benficary_name: "",
      city_name: "",
      remark: "",
      active: true,
      company_codes: "",
      is_vertual: false,
      status: "active",
      virtual_account_code: "",
    });
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
            <span className="text-gray-400">Banking</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create Bank Details</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE BANK DETAILS</h1>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="bank_name"
                      value={bankDetails.bank_name}
                      onChange={handleChange}
                      placeholder="Enter bank name"
                    />
                  </div>
                </div>

                {/* Branch Name */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Branch Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="branch_name"
                      value={bankDetails.branch_name}
                      onChange={handleChange}
                      placeholder="Enter branch name"
                    />
                  </div>
                </div>

                {/* IFSC Code */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      IFSC Code <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent uppercase"
                      type="text"
                      name="ifsc_code"
                      value={bankDetails.ifsc_code}
                      onChange={handleChange}
                      placeholder="e.g., SBIN0001234"
                    />
                  </div>
                </div>

                {/* MICR Number */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">MICR Number</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="micr_number"
                      value={bankDetails.micr_number}
                      onChange={handleChange}
                      placeholder="Enter MICR number"
                    />
                  </div>
                </div>

                {/* Bank Address */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">Bank Address</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="address"
                      value={bankDetails.address}
                      onChange={handleChange}
                      placeholder="Enter bank address"
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Account Type <span className="text-red-500 ml-1">*</span>
                    </label>
                    <SelectBox
                      options={[
                        { label: "Savings", value: "Savings" },
                        { label: "Current", value: "Current" },
                        { label: "Fixed Deposit", value: "Fixed Deposit" },
                        { label: "Recurring Deposit", value: "Recurring Deposit" },
                      ]}
                      value={bankDetails.account_type}
                      onChange={(value) => handleSelectChange("account_type", value)}
                    />
                  </div>
                </div>

                {/* Account Number */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Account Number <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="account_number"
                      value={bankDetails.account_number}
                      onChange={handleChange}
                      placeholder="Enter account number"
                    />
                  </div>
                </div>

                {/* Confirm Account Number */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Confirm Account Number <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="confirm_account_number"
                      value={bankDetails.confirm_account_number}
                      onChange={handleChange}
                      placeholder="Confirm account number"
                    />
                  </div>
                </div>

                {/* Beneficiary Name */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Beneficiary Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="benficary_name"
                      value={bankDetails.benficary_name}
                      onChange={handleChange}
                      placeholder="Enter beneficiary name"
                    />
                  </div>
                </div>

                {/* Company Codes */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">Company Codes</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="company_codes"
                      value={bankDetails.company_codes}
                      onChange={handleChange}
                      placeholder="Enter company codes"
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">Pincode</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="pincode"
                      value={bankDetails.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      maxLength={6}
                    />
                  </div>
                </div>

                {/* Resource Type */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">Resource Type</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                      name="resource_type"
                      value="Project"
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                {/* Project */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">
                      Project <span className="text-red-500 ml-1">*</span>
                    </label>
                    <SelectBox
                      options={projects.map((project) => ({
                        label: project.project_name,
                        value: project.id,
                      }))}
                      value={bankDetails.resource_id}
                      onChange={(value) => handleSelectChange("resource_id", value)}
                    />
                  </div>
                </div>

                {/* Virtual Account Code */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">Virtual Account Code</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="virtual_account_code"
                      value={bankDetails.virtual_account_code}
                      onChange={handleChange}
                      placeholder="Enter virtual account code"
                    />
                  </div>
                </div>

                {/* City Name */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">City Name</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      type="text"
                      name="city_name"
                      value={bankDetails.city_name}
                      onChange={handleChange}
                      placeholder="Enter city name"
                    />
                  </div>
                </div>

                {/* Remark */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-0">Remark</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent resize-y"
                      name="remark"
                      value={bankDetails.remark}
                      onChange={handleChange}
                      placeholder="Enter any remarks or notes"
                      rows="1"
                    />
                  </div>
                </div>

                {/* Is Virtual Account */}
                <div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Is Virtual Account</label>
                    <button
                      type="button"
                      onClick={() =>
                        setBankDetails((prev) => ({
                          ...prev,
                          is_vertual: !prev.is_vertual,
                        }))
                      }
                      className="toggle-button"
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        padding: 0,
                        width: "70px",
                      }}
                    >
                      {bankDetails.is_vertual ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="25"
                          fill="#de7008"
                          className="bi bi-toggle-on"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="25"
                          fill="#667085"
                          className="bi bi-toggle-off"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-[#f6f4ee] text-[#C72030] rounded hover:bg-[#f0ebe0] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#C72030] text-white rounded hover:bg-[#B8252F] transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetailsCreate;
