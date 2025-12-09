import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const LockFunctionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from URL parameters
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [parentFunctions, setParentFunctions] = useState([]);
  const [showActionName, setShowActionName] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    action_name: "",
    parent_function: "",
    active: 1,
  });

  // Fetch lock function data by ID
  useEffect(() => {
    const fetchLockFunction = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/lock_functions/${id}.json`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const functionData = response.data;

        // Set form data with the fetched values
        setFormData({
          name: functionData.name || "",
          action_name: functionData.action_name || "",
          parent_function: functionData.parent_function || "",
          active:
            functionData.active === true || functionData.active === 1 ? 1 : 0,
        });
      } catch (error) {
        console.error("Error fetching lock function:", error);
        toast.error("Failed to fetch lock function details");
        navigate("/setup-member/lock-function-list"); // Redirect on error
      }
    };

    // Fetch existing lock functions to get possible parent functions
    const fetchParentFunctions = async () => {
      try {
        const response = await axios.get(`${baseURL}/lock_functions.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        // Extract unique parent_function values from the response
        const uniqueParentFunctions = [
          ...new Set(response.data.map((func) => func.parent_function)),
        ].filter(Boolean);

        // Create options for the dropdown
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
      }
    };

    // Execute both fetch operations and set loading to false when complete
    Promise.all([fetchLockFunction(), fetchParentFunctions()]).finally(() =>
      setLoading(false)
    );
  }, [id, navigate]);

  // Input Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  // Handle name selection and auto-fill action_name
  const handleNameChange = (value) => {
    let actionName = "";

    if (value === "Project") {
      actionName = "project";
    } else if (value === "Banner") {
      actionName = "banner";
    } else if (value === "Testimonial") {
      actionName = "testimonial";
    } else if (value === "Referral") {
      actionName = "referral";
    } else if (value === "Enquiry") {
      actionName = "enquiry";
    } else if (value === "Event") {
      actionName = "event";
    } else if (value === "Specification") {
      actionName = "specification";
    } else if (value === "Site Visit") {
      actionName = "site_visit";
    } else if (value === "Organization") {
      actionName = "organization";
    } else if (value === "Company") {
      actionName = "company";
    } else if (value === "Support Service") {
      actionName = "support_service";
    } else if (value === "Press Releases") {
      actionName = "press_releases";
    } else if (value === "FAQ") {
      actionName = "faq";
    } else if (value === "Referral Program") {
      actionName = "referral_program";
    } else if (value === "User Role") {
      actionName = "user_role";
    } else if (value === "Lock Function") {
      actionName = "lock_function";
    } else if (value === "Property Type") {
      actionName = "property_type";
    } else if (value === "Project Building") {
      actionName = "project_building";
    } else if (value === "Construction") {
      actionName = "construction";
    } else if (value === "Project Config") {
      actionName = "project_config";
    } else if (value === "Amenities") {
      actionName = "amenities";
    } else if (value === "Visit Slot") {
      actionName = "visit_slot";
    } else if (value === "TDS Tutorials") {
      actionName = "tds_tutorials";
    } else if (value === "Plus Services") {
      actionName = "plus_services";
    } else if (value === "SMTP Settings") {
      actionName = "smtp_settings";
    } else if (value === "FAQ Category") {
      actionName = "faq_category";
    } else if (value === "FAQ SubCategory") {
      actionName = "faq_subcategory";
    } else if (value === "Construction Update") {
      actionName = "construction_update";
    } else if (value === "User Groups") {
      actionName = "user_groups";
    } else if (value === "Service Category") {
      actionName = "service_category";
    } else if (value === "Image Config") {
      actionName = "image_config";
    } else if (value === "Bank Details") {
      actionName = "bank_details";
    } else if (value === "Home Loan") {
      actionName = "home_loan";
    } else if (value === "Banks") {
      actionName = "banks";
    } else if (value === "Loan Manager") {
      actionName = "loan_manager";
    } else if (value === "Common Files") {
      actionName = "common_files";
    } else if (value === "Demand Notes") {
      actionName = "demand_notes";
    } else if (value === "Orders") {
      actionName = "orders";
    } else if (value === "Encash") {
      actionName = "encash";
    } else if (value === "Lock Payments") {
      actionName = "lock_payments";
    } else if (value === "Loyalty Members") {
      actionName = "loyalty_members";
    } else if (value === "Loyalty Tiers") {
      actionName = "loyalty_tiers";
    } else if (value === "Loyalty Section") {
      actionName = "loyalty_section";
    } else if (value === "Referral List") {
      actionName = "referral_list";
    } else if (value === "Rule Engine") {
      actionName = "rule_engine";
    } 
     else if (value === "Loyalty Manager") {
      actionName = "loyalty_manager";
    } else if (value === "home_loan_request") {
      actionName = "home_loan_request";
    }

    setFormData({
      ...formData,
      name: value,
      action_name: actionName, // auto-fill
    });

    setShowActionName(false); // Hide Action Name field
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
    setSubmitLoading(true);

    if (!validateForm()) {
      setSubmitLoading(false);
      return;
    }

    try {
      const payload = {
        lock_function: {
          name: formData.name,
          action_name: formData.action_name,
          parent_function: formData.parent_function,
          active: formData.active,
          module_id: "1", // Default value as per the example
        },
      };

      await axios.put(`${baseURL}/lock_functions/${id}.json`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Lock function updated successfully");
      navigate("/setup-member/lock-function-list");
    } catch (error) {
      console.error("Error updating lock function:", error);
      toast.error(
        `Error updating lock function: ${error.response?.data?.message || error.message
        }`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="website-content d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Prepare the name options for the dropdown
  const nameOptions = [
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
    { label: "Support Service", value: "Support Service" },
    { label: "Press Releases", value: "Press Releases" },
    { label: "FAQ", value: "FAQ" },
    { label: "Referral Program", value: "Referral Program" },
    { label: "User Role", value: "User Role" },
    { label: "User Groups", value: "User Groups" },
    { label: "Lock Function", value: "Lock Function" },
    { label: "Property Type", value: "Property Type" },
    { label: "Project Building", value: "Project Building" },
    { label: "Construction Status", value: "Construction Status" },
    { label: "Construction Update", value: "Construction Update" },
    { label: "Project Config", value: "Project Config" },
    { label: "Amenities", value: "Amenities" },
    { label: "Visit Slot", value: "Visit Slot" },
    { label: "TDS Tutorials", value: "TDS Tutorials" },
    { label: "Plus Services", value: "Plus Services" },
    { label: "SMTP Settings", value: "SMTP Settings" },
    { label: "FAQ Category", value: "FAQ Category" },
    { label: "FAQ SubCategory", value: "FAQ SubCategory" },
    {
      label: "Service Category",
      value: "Service Category",
    },
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
     { label: "Loyalty Managers", value: "Loyalty Managers"},
    { label: "Home Loan Request", value: "home_loan_request" },
                          // Add more if needed
  ];

  return (
    <>
      <div className="main-content">
        <div className="website-content overflow-hidden">
          <div className="module-data-section">
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header">
                <h3 className="card-title">Edit Lock Function</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* Name Input - Changed to SelectBox */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Name
                        <span className="otp-asterisk"> *</span>
                      </label>
                      <SelectBox
                        options={nameOptions}
                        defaultValue={formData.name}
                        onChange={(value) => handleNameChange(value)}
                      />
                      {errors.name && (
                        <span className="error text-danger">{errors.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Name Input - Now conditionally shown */}
                  {showActionName && (
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>
                          Action Name
                          <span className="otp-asterisk"> *</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="action_name"
                          value={formData.action_name}
                          onChange={handleChange}
                          placeholder="Enter action name"
                          readOnly // Make it readonly since it fills automatically
                        />
                        {errors.action_name && (
                          <span className="error text-danger">
                            {errors.action_name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Parent Function Selection */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Parent Function
                        <span className="otp-asterisk"> *</span>
                      </label>
                      <SelectBox
                        options={[
                          { label: "All Functions", value: "All Functions" },
                        ]}
                        defaultValue={formData.parent_function}
                        onChange={(value) =>
                          setFormData({ ...formData, parent_function: value })
                        }
                      />
                      {errors.parent_function && (
                        <span className="error text-danger">
                          {errors.parent_function}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  {/* Active Status */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="active"
                          id="isActive"
                          checked={formData.active === 1}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="isActive">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="row mt-4 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={handleSubmit}
                className="purple-btn2 w-100"
                disabled={submitLoading}
              >
                {submitLoading ? "Updating..." : "Update"}
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="purple-btn2 w-100"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LockFunctionEdit;
