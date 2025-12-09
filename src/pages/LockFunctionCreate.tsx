import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import SelectBox from "../components/ui/select-box";


const LockFunctionCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [parentFunctions, setParentFunctions] = useState([]);
  const [showActionName, setShowActionName] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    action_name: "",
    parent_function: "All Functions",
    active: 1,
  });

  // Fetch existing lock functions to get possible parent functions
  useEffect(() => {
    const fetchParentFunctions = async () => {
      try {
        const response = await axios.get(`${baseURL}/lock_functions.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const functionsData = Array.isArray(response.data) ? response.data : [];
        const uniqueParentFunctions = [
          ...new Set(functionsData.map((func) => func.parent_function)),
        ].filter(Boolean);

        const parentFunctionOptions = uniqueParentFunctions.map((func) => ({
          id: func,
          name: func,
        }));

        // Add "all_functions" if it's not already in the list
        if (!uniqueParentFunctions.includes("all_functions")) {
          parentFunctionOptions.unshift({
            id: "all_functions",
            name: "all_functions",
          });
        }

        setParentFunctions(parentFunctionOptions);
      } catch (error) {
        console.error("Error fetching parent functions:", error);
        toast.error("Failed to fetch parent functions");
        setParentFunctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParentFunctions();
  }, [baseURL]);

  // Input Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  // Form Validation
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      toast.error("Name is required");
      isValid = false;
    }

    if (!formData.action_name.trim()) {
      newErrors.action_name = "Action name is required";
      toast.error("Action name is required");
      isValid = false;
    }

    if (!formData.parent_function) {
      newErrors.parent_function = "Parent function is required";
      toast.error("Parent function is required");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        lock_function: {
          name: formData.name,
          action_name: formData.action_name,
          parent_function: formData.parent_function,
          active: formData.active,
          module_id: "1",
        },
      };

      await axios.post(`${baseURL}/lock_functions.json`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Lock function created successfully");
      navigate("/setup-member/lock-function-list");
    } catch (error) {
      console.error("Error creating lock function:", error);
      toast.error(`Error creating lock function: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNameChange = (value) => {
    let actionName = "";

    if (value === "Project") actionName = "project";
    else if (value === "Banner") actionName = "banner";
    else if (value === "Testimonial") actionName = "testimonial";
    else if (value === "Referral") actionName = "referral";
    else if (value === "Enquiry") actionName = "enquiry";
    else if (value === "Event") actionName = "event";
    else if (value === "Specification") actionName = "specification";
    else if (value === "Site Visit") actionName = "site_visit";
    else if (value === "Organization") actionName = "organization";
    else if (value === "Company") actionName = "company";
    else if (value === "Department") actionName = "department";
    else if (value === "Site") actionName = "site";
    else if (value === "Support Service") actionName = "support_service";
    else if (value === "Press Releases") actionName = "press_releases";
    else if (value === "FAQ") actionName = "faq";
    else if (value === "Referral Program") actionName = "referral_program";
    else if (value === "User Role") actionName = "user_role";
    else if (value === "Lock Function") actionName = "lock_function";
    else if (value === "User Module") actionName = "user_module";
    else if (value === "Property Type") actionName = "property_type";
    else if (value === "Project Building") actionName = "project_building";
    else if (value === "Construction") actionName = "construction";
    else if (value === "Project Config") actionName = "project_config";
    else if (value === "Amenities") actionName = "amenities";
    else if (value === "Visit Slot") actionName = "visit_slot";
    else if (value === "TDS Tutorials") actionName = "tds_tutorials";
    else if (value === "Plus Services") actionName = "plus_services";
    else if (value === "SMTP Settings") actionName = "smtp_settings";
    else if (value === "FAQ Category") actionName = "faq_category";
    else if (value === "FAQ SubCategory") actionName = "faq_subcategory";
    else if (value === "Construction Update") actionName = "construction_update";
    else if (value === "User Groups") actionName = "user_groups";
    else if (value === "Service Category") actionName = "service_category";
    else if (value === "Image Config") actionName = "image_config";
    else if (value === "Bank Details") actionName = "bank_details";
    else if (value === "Home Loan") actionName = "home_loan";
    else if (value === "Banks") actionName = "banks";
    else if (value === "Loan Manager") actionName = "loan_manager";
    else if (value === "Common Files") actionName = "common_files";
    else if (value === "Demand Notes") actionName = "demand_notes";
    else if (value === "Orders") actionName = "orders";
    else if (value === "Encash") actionName = "encash";
    else if (value === "Lock Payments") actionName = "lock_payments";
    else if (value === "Loyalty Members") actionName = "loyalty_members";
    else if (value === "Loyalty Tiers") actionName = "loyalty_tiers";
    else if (value === "Loyalty Section") actionName = "loyalty_section";
    else if (value === "Referral List") actionName = "referral_list";
    else if (value === "Rule Engine") actionName = "rule_engine";
    else if (value === "Loyalty Manager" || value === "Loyalty Managers") actionName = "loyalty_manager";
    else if (value === "Home Loan Request") actionName = "home_loan_request";

    setFormData({
      ...formData,
      name: value,
      action_name: actionName,
    });

    setShowActionName(false); // Hide Action Name field
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
            <span className="text-gray-400">Lock Function</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE LOCK FUNCTION</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Function Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Name Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Project", value: "Project" },
                      { label: "Banner", value: "Banner" },
                      { label: "Testimonial", value: "Testimonial" },
                      { label: "Referral", value: "Referral" },
                      { label: "Enquiry", value: "Enquiry" },
                      { label: "Event", value: "Event" },
                      { label: "Specification", value: "Specification" },
                      { label: "Site Visit", value: "Site Visit" },
                      { label: "Organization", value: "Organization" },
                      { label: "Company", value: "Company" },
                      { label: "Department", value: "Department" },
                      { label: "Site", value: "Site" },
                      { label: "Support Service", value: "Support Service" },
                      { label: "Press Releases", value: "Press Releases" },
                      { label: "FAQ", value: "FAQ" },
                      { label: "Referral Program", value: "Referral Program" },
                      { label: "User Role", value: "User Role" },
                      { label: "Lock Function", value: "Lock Function" },
                      { label: "User Module", value: "User Module" },
                      { label: "User Groups", value: "User Groups" },
                      { label: "Property Type", value: "Property Type" },
                      { label: "Project Building", value: "Project Building" },
                      { label: "Construction", value: "Construction" },
                      { label: "Construction Update", value: "Construction Update" },
                      { label: "Project Config", value: "Project Config" },
                      { label: "Amenities", value: "Amenities" },
                      { label: "Visit Slot", value: "Visit Slot" },
                      { label: "TDS Tutorials", value: "TDS Tutorials" },
                      { label: "Plus Services", value: "Plus Services" },
                      { label: "SMTP Settings", value: "SMTP Settings" },
                      { label: "FAQ Category", value: "FAQ Category" },
                      { label: "FAQ SubCategory", value: "FAQ SubCategory" },
                      { label: "Service Category", value: "Service Category" },
                      { label: "Image Config", value: "Image Config" },
                      { label: "Bank Details", value: "Bank Details" },
                      { label: "Home Loan", value: "Home Loan" },
                      { label: "Banks", value: "Banks" },
                      { label: "Loan Manager", value: "Loan Manager" },
                      { label: "Common Files", value: "Common Files" },
                      { label: "Demand Notes", value: "Demand Notes" },
                      { label: "Orders", value: "Orders" },
                      { label: "Encash", value: "Encash" },
                      { label: "Lock Payments", value: "Lock Payments" },
                      { label: "Loyalty Members", value: "Loyalty Members" },
                      { label: "Loyalty Tiers", value: "Loyalty Tiers" },
                      { label: "Loyalty Section", value: "Loyalty Section" },
                      { label: "Referral List", value: "Referral List" },
                      { label: "Rule Engine", value: "Rule Engine" },
                      { label: "Loyalty Managers", value: "Loyalty Managers" },
                      { label: "Home Loan Request", value: "Home Loan Request" },
                    ]}
                    value={formData.name}
                    onChange={handleNameChange}
                    disabled={submitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Action Name (auto-filled, read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Action Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="action_name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                    value={formData.action_name}
                    readOnly
                  />
                  {errors.action_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.action_name}</p>
                  )}
                </div>

                {/* Parent Function */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Parent Function
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SelectBox
                    options={[{ label: "All Functions", value: "All Functions" }]}
                    value={formData.parent_function}
                    onChange={(value) => setFormData({ ...formData, parent_function: value })}
                    disabled={submitting}
                  />
                  {errors.parent_function && (
                    <p className="text-red-500 text-xs mt-1">{errors.parent_function}</p>
                  )}
                </div>

                {/* Active Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      name="active"
                      id="isActive"
                      checked={formData.active === 1}
                      onChange={handleChange}
                      disabled={submitting}
                      className="w-4 h-4 text-[#8B0203] bg-gray-100 border-gray-300 rounded focus:ring-[#8B0203] focus:ring-2"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 cursor-pointer">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className={`px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium ${
                    (submitting || loading) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
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
                  disabled={submitting}
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

export default LockFunctionCreate;
