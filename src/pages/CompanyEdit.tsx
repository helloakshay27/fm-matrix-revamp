import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";


const CompanyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState([]);
  const [formData, setFormData] = useState({
    companyName: "",
    companyLogo: null,
    organizationId: "",
  });
  const [previeImage, setPrevieImage] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(formData);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(
        `${baseURL}company_setups/${id}.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log(response.data);
      setFormData({
        companyName: response.data.name,
        companyLogo: response.data?.attachfile?.document_url,
        organizationId: response.data.organization_id,
      });
      setPrevieImage(response.data?.attachfile?.document_url);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        `${baseURL}organizations.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setOrganization(response.data.organizations);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchOrganizations();
  }, []);

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      companyLogo: e.target.files[0],
    });
    const previeImage = URL.createObjectURL(e.target.files[0]);
    setPrevieImage(previeImage);
  };

  console.log(previeImage);

  const handleSubmit = async (e) => {
    toast.dismiss();
    e.preventDefault();
    setLoading(true);

    // Create FormData to handle file upload
    const formDataToSend = new FormData();
    formDataToSend.append("company_setup[name]", formData.companyName);
    formDataToSend.append(
      "company_setup[organization_id]",
      formData.organizationId
    );

    // Only append the file if it's changed
    if (formData.companyLogo instanceof File) {
      formDataToSend.append("company_logo", formData.companyLogo);
    }

    try {
      const response = await axios.put(
        `${baseURL}company_setups/${id}.json`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      console.log(response);
      // Show success message and navigate
      toast.success("Company updated successfully!");
      navigate("/company-list");
    } catch (error) {
      console.log("Error submitting form:", error);
      
      // Handle specific error cases
      if (error.response && error.response.status === 422) {
        // Check if the error is related to duplicate company name
        const errorData = error.response.data;
        if (errorData.message && errorData.message.toLowerCase().includes('name')) {
          toast.error("Company name already exists. Please choose a different name.");
        } else {
          toast.error("Company name already exists. Please choose a different name.");
        }
      } else {
        // Handle other errors
        const errorMessage = error.response?.data?.message || "Failed to update company.";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header">
                <h3 className="card-title">Edit Company</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Company Name
                        <span className="otp-asterisk">{" "}*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                        placeholder="Enter name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Company Logo
                        <span className="otp-asterisk">{" "}*</span>
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        onChange={handleFileChange}
                        accept=".png,.jpg,.jpeg,.svg"
                      />
                    </div>
                    {previeImage ? (
                      <img
                        src={previeImage}
                        className="img-fluid rounded mt-2"
                        alt="Company Logo"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No Image Selected"
                    )}
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Organization
                      </label>
                      <SelectBox
                        options={[
                          { value: "", label: "Select Organization" },
                          ...organization.map((org) => ({
                            label: org.name,
                            value: org.id,
                          }))
                        ]}
                        value={formData.organizationId}
                        onChange={(value) => {
                          setFormData({
                            ...formData,
                            organizationId: value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-2">
                <button
                  type="submit"
                  className="purple-btn2 purple-btn2-shadow w-100"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="purple-btn2 purple-btn2-shadow w-100"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyEdit;
