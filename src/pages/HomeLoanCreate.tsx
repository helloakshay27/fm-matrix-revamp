import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import MultiSelectBox from "../components/ui/multi-selector";
import { API_CONFIG } from "@/config/apiConfig";


const HomeLoanAdd = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    professional_detail: "",
    monthly_income: "",
    dob: "",
    existing_emis: "",
    preffered_time: "",
    tenure: "",
    required_loan_amt: "",
    project_id: "",
    bank_ids: [],
  });

  const professionalOptions = [
    { label: "Engineer", value: "Engineer" },
    { label: "Doctor", value: "Doctor" },
    { label: "Teacher", value: "Teacher" },
    { label: "Business Owner", value: "Business Owner" },
    { label: "Government Employee", value: "Government Employee" },
    { label: "Private Employee", value: "Private Employee" },
    { label: "Other", value: "Other" },
  ];

  const preferredTimeOptions = [
    { label: "Morning", value: "Morning" },
    { label: "Afternoon", value: "Afternoon" },
    { label: "Evening", value: "Evening" },
  ];

  const tenureOptions = [
    { label: "5 Years", value: "5" },
    { label: "10 Years", value: "10" },
    { label: "15 Years", value: "15" },
    { label: "20 Years", value: "20" },
    { label: "25 Years", value: "25" },
    { label: "30 Years", value: "30" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Projects
        const projectsResponse = await axios.get(`${baseURL}projects.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        setProjects(projectsResponse.data.projects || []);

        // Fetch Banks
        const banksResponse = await axios.get(`${baseURL}banks.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        setBanks(banksResponse.data.banks || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    
    // if (!formData.professional_detail.trim()) {
    //   newErrors.professional_detail = "Professional detail is mandatory";
    // }
    // if (!formData.monthly_income.trim()) {
    //   newErrors.monthly_income = "Monthly income is mandatory";
    // }
    // if (!formData.dob.trim()) {
    //   newErrors.dob = "Date of birth is mandatory";
    // }
    // if (!formData.existing_emis.trim()) {
    //   newErrors.existing_emis = "Existing EMIs is mandatory";
    // }
    // if (!formData.preffered_time.trim()) {
    //   newErrors.preffered_time = "Preferred time is mandatory";
    // }
    // if (!formData.tenure.trim()) {
    //   newErrors.tenure = "Tenure is mandatory";
    // }
    // if (!formData.required_loan_amt.trim()) {
    //   newErrors.required_loan_amt = "Required loan amount is mandatory";
    // }
    if (!formData.project_id) {
      newErrors.project_id = "Project is mandatory";
    }
    if (!formData.bank_ids || formData.bank_ids.length === 0) {
      newErrors.bank_ids = "At least one bank must be selected";
    }

 
    // if (formData.monthly_income && isNaN(formData.monthly_income)) {
    //   newErrors.monthly_income = "Monthly income must be a valid number";
    // }

  
    // if (formData.existing_emis && isNaN(formData.existing_emis)) {
    //   newErrors.existing_emis = "Existing EMIs must be a valid number";
    // }

    // Validate required loan amount is a number
    if (formData.required_loan_amt && isNaN(formData.required_loan_amt.replace(/,/g, ''))) {
      newErrors.required_loan_amt = "Required loan amount must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const submitData = {
        home_loan: {
          professional_detail: formData.professional_detail,
          monthly_income: formData.monthly_income,
          dob: formData.dob,
          existing_emis: formData.existing_emis,
          preffered_time: formData.preffered_time,
          tenure: formData.tenure,
          required_loan_amt: formData.required_loan_amt.replace(/,/g, ''), // Remove commas for backend
          project_id: parseInt(formData.project_id),
          bank_ids: formData.bank_ids.map(id => parseInt(id)),
        },
      };

      console.log("Data to be sent:", submitData);

      await axios.post(`${baseURL}home_loans.json`, submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Home loan application created successfully");
      navigate("/setup-member/home-loan-list");
    } catch (error) {
      console.error("Error creating home loan:", error);
      toast.error(`Error creating home loan: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const formatCurrency = (value) => {
    // Remove non-numeric characters except commas
    const numericValue = value.replace(/[^\d,]/g, '');
    // Add commas for thousands separator
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatCurrency(value);
    setFormData({ ...formData, [name]: formattedValue });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="main-content">
      {/* <style jsx>{`
        .btn-primary {
          background: #f1f5f9;
          color: #1f2937;
          padding: 8px 16px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          margin-left: 10px;
          height: 38px;
          display: inline-flex;
          align-items: center;
        }
        .btn-primary:hover {
          background: #e2e8f0;
        }
        .sticky-footer {
          position: sticky;
          bottom: 0;
          background: white;
          padding-top: 16px;
          z-index: 10;
        }
        .form-control:focus {
          border-color: #80bdff;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
      `}</style> */}

      <div className="module-data-section container-fluid overflow-hidden">
        <div className="module-data-section">
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Create Home Loan Application</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="row">
                  {/* Professional Detail */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Professional Detail
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="professional_detail"
                        value={formData.professional_detail}
                        onChange={(e) =>
                          setFormData({ ...formData, professional_detail: e.target.value })
                        }
                        placeholder="Select Professional Detail"
                      />
                      {errors.professional_detail && (
                        <span className="text-danger">{errors.professional_detail}</span>
                      )}
                    </div>
                  </div>

                  {/* Monthly Income */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Monthly Income
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="monthly_income"
                        value={formData.monthly_income}
                        onChange={handleChange}
                        placeholder="Enter monthly income"
                      />
                      {errors.monthly_income && (
                        <span className="text-danger">{errors.monthly_income}</span>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Date of Birth
                      </label>
                      <input
                        className="form-control"
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                      {errors.dob && (
                        <span className="text-danger">{errors.dob}</span>
                      )}
                    </div>
                  </div>

                  {/* Existing EMIs */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Existing EMIs
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="existing_emis"
                        value={formData.existing_emis}
                        onChange={handleChange}
                        placeholder="Enter existing EMIs amount"
                      />
                      {errors.existing_emis && (
                        <span className="text-danger">{errors.existing_emis}</span>
                      )}
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Preferred Time
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="preffered_time"
                        value={formData.preffered_time}
                        onChange={(e) =>
                          setFormData({ ...formData, preffered_time: e.target.value })
                        }
                        placeholder="Select Preferred Time"
                      />
                      {errors.preffered_time && (
                        <span className="text-danger">{errors.preffered_time}</span>
                      )}
                    </div>
                  </div>

                  {/* Tenure */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Tenure
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="tenure"
                        value={formData.tenure}
                        onChange={(e) =>
                          setFormData({ ...formData, tenure: e.target.value })
                        }
                        placeholder="Select Tenure"
                      />
                      {errors.tenure && (
                        <span className="text-danger">{errors.tenure}</span>
                      )}
                    </div>
                  </div>

                  {/* Required Loan Amount */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Required Loan Amount<span className="otp-asterisk"> *</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="required_loan_amt"
                        value={formData.required_loan_amt}
                        onChange={handleCurrencyChange}
                        placeholder="Enter required loan amount"
                      />
                      {errors.required_loan_amt && (
                        <span className="text-danger">{errors.required_loan_amt}</span>
                      )}
                    </div>
                  </div>

                  {/* Project */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Project<span className="otp-asterisk"> *</span>
                      </label>
                      <SelectBox
                        options={projects.map((project) => ({
                          label: project.project_name,
                          value: project.id,
                        }))}
                        value={formData.project_id}
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

                  {/* Banks (Multiple Select) */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Banks<span className="otp-asterisk"> *</span>
                      </label>
                      <MultiSelectBox
                        options={banks.map((bank) => ({
                          value: bank.id,
                          label: bank.bank_name,
                        }))}
                        value={formData.bank_ids.map((id) => ({
                          value: id,
                          label: banks.find(bank => bank.id === parseInt(id))?.bank_name || '',
                        }))}
                        onChange={(selectedOptions) =>
                          setFormData((prev) => ({
                            ...prev,
                            bank_ids: selectedOptions.map((option) => option.value),
                          }))
                        }
                        placeholder="Select Banks"
                      />
                      {errors.bank_ids && (
                        <span className="text-danger">{errors.bank_ids}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-4 sticky-footer justify-content-center">
                <div className="col-md-2">
                  <button
                    type="submit"
                    className="purple-btn2 w-100"
                    disabled={loading || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
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
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoanAdd;