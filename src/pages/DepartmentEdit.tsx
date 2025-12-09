import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


const DepartmentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    organizationId: "",
    companyId: "",
    siteId: null,
    active: true,
    deleted: false,
  });

  // Fetch Department Data by ID
  const fetchDepartment = async () => {
    try {
      const response = await axios.get(
        `${baseURL}departments/${id}.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      
      console.log("Department data:", response.data);
      
      if (response.data) {
        setFormData({
          name: response.data.name,
          organizationId: response.data.organization_id,
          companyId: response.data.company_id,
          siteId: response.data.site_id,
          active: response.data.active || true,
          deleted: response.data.deleted || false,
        });
      }
    } catch (error) {
      console.error("Error fetching department:", error);
      toast.error("Failed to fetch department data");
      navigate("/setup-member/department-list");
    }
  };

  // Fetch Organizations
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
      
      if (Array.isArray(response.data.organizations)) {
        setOrganizations(response.data.organizations);
      } else {
        setOrganizations([]);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations");
    }
  };

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${baseURL}company_setups.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      
      if (Array.isArray(response.data.company_setups)) {
        setCompany(response.data.company_setups);
      } else {
        setCompany([]);
      }
    } catch (error) {
      console.error("Error fetching company setups:", error);
      toast.error("Failed to fetch company setups");
    }
  };

  // Load all data on component mount
  useEffect(() => {
    fetchDepartment();
    fetchOrganizations();
    fetchCompanies();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setLoading(true);

    try {
      const departmentData = {
        department: {
          name: formData.name,
          organization_id: formData.organizationId,
          company_id: formData.companyId,
          site_id: formData.siteId || null,
          active: formData.active,
          deleted: formData.deleted
        }
      };

      const response = await axios.put(
        `${baseURL}departments/${id}.json`,
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response);
      toast.success("Department updated successfully!");
      navigate("/setup-member/department-list");
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error(error.response?.data?.message || "Failed to update department.");
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
                <h3 className="card-title">Edit Department</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* Department Name */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Department Name <span className="otp-asterisk">{" "}*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Department Name"
                        required
                      />
                    </div>
                  </div>

                  {/* Company ID */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Company <span className="otp-asterisk">{" "}*</span>
                      </label>
                      <SelectBox
                        options={company.map((comp) => ({
                          value: comp.id,
                          label: comp.name,
                        }))}
                        defaultValue={formData.companyId}
                        onChange={(value) => {
                          setFormData({
                            ...formData,
                            companyId: value,
                          });
                        }}
                      />
                    </div>
                  </div>

                  {/* Organization ID */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Organization <span className="otp-asterisk">{" "}*</span>
                      </label>
                      <SelectBox
                        options={organizations.map((org) => ({
                          value: org.id,
                          label: org.name,
                        }))}
                        defaultValue={formData.organizationId}
                        onChange={(value) => {
                          setFormData({
                            ...formData,
                            organizationId: value,
                          });
                        }}
                      />
                    </div>
                  </div>

                  {/* Active Status */}
                  {/* <div className="col-md-3">
                    <div className="form-group">
                      <label>Status</label>
                      <SelectBox
                        options={[
                          { value: true, label: "Active" },
                          { value: false, label: "Inactive" },
                        ]}
                        defaultValue={formData.active}
                        onChange={(value) => {
                          setFormData({
                            ...formData,
                            active: value,
                          });
                        }}
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="row mt-2 justify-content-center">
                <div className="col-md-2">
                <button
                  type="submit"
                    className="purple-btn2 w-100"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Submit"}
                </button>
              </div>
              <div className="col-md-2">
                <button
                  type="submit"
                    className="purple-btn2 w-100"
                  onClick={() => navigate("/setup-member/department-list")}
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

export default DepartmentEdit;