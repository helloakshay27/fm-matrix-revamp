import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";


const LoanManagerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    project_id: "",
    active: true,
  });

  console.log("formData", formData);

  useEffect(() => {
    fetchLoanManager();
    fetchProjects();
  }, []);

  const fetchLoanManager = async () => {
    try {
      const response = await axios.get(`${baseURL}loan_managers/${id}.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (response.data) {
        const loanManagerData = response.data.loan_manager || response.data;
        setFormData({
          name: loanManagerData.name || "",
          email: loanManagerData.email || "",
          mobile: loanManagerData.mobile || "",
          project_id: loanManagerData.project_id || "",
          active: loanManagerData.active !== undefined ? loanManagerData.active : true,
        });
      }
    } catch (error) {
      console.error("Error fetching loan manager:", error);
      toast.error("Failed to fetch loan manager data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseURL}projects.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is mandatory";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is mandatory";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is mandatory";
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    
    if (!formData.project_id) {
      newErrors.project_id = "Project is mandatory";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await axios.put(
        `${baseURL}loan_managers/${id}.json`,
        {
          loan_manager: {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            project_id: formData.project_id,
            active: formData.active,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Loan Manager updated successfully");
        navigate("/setup-member/loan-manager-list");
      }
    } catch (error) {
      console.error("Error updating loan manager:", error);
      if (error.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = error.response.data.errors;
        setErrors(serverErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error("Error updating loan manager. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="main-content">
      {/* <style jsx>{`
        .sticky-footer {
          position: sticky;
          bottom: 0;
          background: white;
          padding-top: 16px;
          z-index: 10;
          box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
        }
        .form-control:focus {
          border-color: #8b0203;
          box-shadow: 0 0 0 0.2rem rgba(139, 2, 3, 0.25);
        }
        .otp-asterisk {
          color: #dc3545;
        }
      `}</style> */}

      <div className="module-data-section container-fluid overflow-hidden">
        <div className="module-data-section">
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Loan Manager Edit</h3>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div
                    className="spinner-border"
                    role="status"
                    style={{ color: "var(--red)" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Name Input */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Name
                          {/* <span className="otp-asterisk"> *</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter full name"
                          maxLength="100"
                        />
                        {errors.name && (
                          <span className="text-danger">{errors.name}</span>
                        )}
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Email
                          {/* <span className="otp-asterisk"> *</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          maxLength="100"
                        />
                        {errors.email && (
                          <span className="text-danger">{errors.email}</span>
                        )}
                      </div>
                    </div>

                    {/* Mobile Input */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Mobile
                          {/* <span className="otp-asterisk"> *</span> */}
                        </label>
                        <input
                          className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="Enter 10-digit mobile number"
                          maxLength="10"
                          pattern="[0-9]{10}"
                        />
                        {errors.mobile && (
                          <span className="text-danger">{errors.mobile}</span>
                        )}
                      </div>
                    </div>

                    {/* Project Select */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Project
                          {/* <span className="otp-asterisk"> *</span> */}
                        </label>
                        <SelectBox
                          options={projects.map((p) => ({
                            label: p.project_name || p.name,
                            value: p.id,
                          }))}
                          defaultValue={formData.project_id}
                          onChange={(value) =>
                            setFormData({ ...formData, project_id: value })
                          }
                          placeholder="Select Project"
                        />
                        {errors.project_id && (
                          <span className="text-danger">{errors.project_id}</span>
                        )}
                      </div>
                    </div>

                 
                  </div>

                
                 
                </form>
              )}
            </div>
          </div>

          {/* Sticky Footer Buttons */}
          <div className="row mt-4 sticky-footer justify-content-center">
            <div className="col-md-2">
              <button
                onClick={handleSubmit}
                className="purple-btn2 w-100"
                disabled={loading || isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="purple-btn2 w-100"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanManagerEdit;