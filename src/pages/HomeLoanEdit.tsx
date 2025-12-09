import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import MultiSelectBox from "../components/ui/multi-selector";
import { API_CONFIG } from "@/config/apiConfig";


const HomeLoanEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from URL parameters

  const [projects, setProjects] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

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

        // Fetch Home Loan Data by ID
        const homeLoanResponse = await axios.get(`${baseURL}home_loans/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Home Loan Response:", homeLoanResponse.data);
        
        const homeLoanData = homeLoanResponse.data.home_loan || homeLoanResponse.data;
        
        console.log("Home Loan Data:", homeLoanData);
        
        // Populate form with existing data
        setFormData({
          professional_detail: homeLoanData?.professional_detail || "",
          monthly_income: homeLoanData?.monthly_income || "",
          dob: homeLoanData?.dob || "",
          existing_emis: homeLoanData?.existing_emis || "",
          preffered_time: homeLoanData?.preffered_time || "",
          tenure: homeLoanData?.tenure || "",
          required_loan_amt: homeLoanData?.required_loan_amt ? homeLoanData.required_loan_amt.toLocaleString() : "",
          project_id: homeLoanData?.project_id || "",
          bank_ids: homeLoanData?.bank_ids || (homeLoanData?.preffered_banks ? homeLoanData.preffered_banks.map(bank => bank.bank_id) : []),
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
        // If home loan not found, redirect back
        if (error.response?.status === 404) {
          toast.error("Home loan not found");
          navigate("/home-loan-list");
        }
      } finally {
        setLoading(false);
        setFetchingData(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      toast.error("No ID provided");
      navigate("/home-loan-list");
    }
  }, [id, navigate]);

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
    
    if (!formData.project_id) {
      newErrors.project_id = "Project is mandatory";
    }
    if (!formData.bank_ids || formData.bank_ids.length === 0) {
      newErrors.bank_ids = "At least one bank must be selected";
    }

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

      await axios.put(`${baseURL}home_loans/${id}.json`, submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Home loan application updated successfully");
      navigate("/setup-member/home-loan-list");
    } catch (error) {
      console.error("Error updating home loan:", error);
      toast.error(`Error updating home loan: ${error.response?.data?.message || error.message}`);
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

  const handleBankChange = (selectedOptions) => {
    console.log("Selected options:", selectedOptions);
    
    // Extract just the IDs from selected options
    const selectedBankIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    
    console.log("Selected bank IDs:", selectedBankIds);

    setFormData((prev) => ({
      ...prev,
      bank_ids: selectedBankIds,
    }));

    // Clear error when banks are selected
    if (errors.bank_ids && selectedBankIds.length > 0) {
      setErrors({ ...errors, bank_ids: "" });
    }
  };

  // Helper function to get selected bank options for MultiSelectBox
  const getSelectedBankOptions = () => {
    if (!formData.bank_ids || !banks.length) return [];
    
    return formData.bank_ids
      .map((bankId) => {
        const bank = banks.find((b) => b.id === parseInt(bankId));
        return bank ? { value: bank.id, label: bank.bank_name } : null;
      })
      .filter(Boolean); // Remove null values
  };

  return (
    <div className="main-content">
      <div className="module-data-section container-fluid overflow-hidden">
        <div className="module-data-section">
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Edit Home Loan Application</h3>
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
                        value={getSelectedBankOptions()}
                        onChange={handleBankChange}
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
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoanEdit;