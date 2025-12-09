import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";


const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID from URL params
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [errors, setErrors] = useState({});

  // State for dropdown options
  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]); // Added departments state
  const [sites, setSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [organizationsLoading, setOrganizationsLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false); // Added departments loading state

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    password: "",
    role_id: "",
    company_id: "",
    department_id: "",
    country_code: "91",
    alternate_email1: "",
    alternate_email2: "",
    alternate_address: "",
    is_admin: false,
    employee_type: "",
    organization_id: "",
    user_title: "",
    gender: "",
    birth_date: "",
    blood_group: "",
    site_id: "",
  });

  console.log("Form Data:", formData);
  console.log("Departments:", departments); // Added debugging line for departments

  // Fetch dropdown data and user data when component mounts
  useEffect(() => {
    fetchRoles();
    fetchOrganizations();
    fetchCompanies();
    fetchDepartments(); // Added department fetching
    fetchUserData();
    fetchSites();
  }, [id]);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setFetchingUser(true);
      const response = await axios.get(`${baseURL}/user_details/${id}.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);

      const userData =
        response.data.users ||
        response.data.data ||
        (Array.isArray(response.data) ? response.data[0] : response.data);

      if (!userData) {
        throw new Error("Invalid user data structure in API response");
      }

      //  if (userData?.birth_date) {
      //   try {
      //     const [day, month, year] = userData.birth_date.split("-");
      //     userData.birth_date = `${year}-${month.padStart(
      //       2,
      //       "0"
      //     )}-${day.padStart(2, "0")}`;
      //   } catch (error) {
      //     console.warn("Could not parse birth_date:", error);
      //     userData.birth_date = "";
      //   }
      // }

      if (response.data.birth_date) {
        const [day, month, year] = response.data.birth_date.split("-");
        if (day && month && year) {
          response.data.birth_date = `${year}-${month.padStart(
            2,
            "0"
          )}-${day.padStart(2, "0")}`;
        }
      }

      console.log(response.data);
      setFormData({
        organization_id: response.data.organization_id,
        company_id: response.data.company_id,
        role_id: response.data.role_id,
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        mobile: response.data.mobile,
        email: response.data.email,
        password: response.data.password || "********", // Display masked password
        alternate_email1: response.data.alternate_email1,
        alternate_email2: response.data.alternate_email2,
        alternate_address: response.data.alternate_address,
        is_admin: response.data.is_admin,
        employee_type: response.data.employee_type,
        user_title: response.data.user,
        gender: response.data.gender,
        birth_date: response.data.birth_date,
        blood_group: response.data.blood_group,
        site_id: response.data.site_id,
        department_id: response.data.department_id,
        country_code: response.data.country_code,
      });

      setFormData(userData);

      setFetchingUser(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error(
        `Failed to fetch user details: ${
          error.response?.data?.message || error.message
        }`
      );
      setFetchingUser(false);
    }
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await axios.get(`${baseURL}lock_roles.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setRoles(response.data);
      } else {
        console.error("Invalid roles data format:", response.data);
        toast.error("Failed to load roles: Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles. Please try again later.");
    } finally {
      setRolesLoading(false);
    }
  };

  // Fetch organizations from API
  const fetchOrganizations = async () => {
    setOrganizationsLoading(true);
    try {
      const response = await axios.get(`${baseURL}organizations.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (
        response.data &&
        response.data.organizations &&
        Array.isArray(response.data.organizations)
      ) {
        setOrganizations(response.data.organizations);
      } else {
        console.error("Invalid organizations data format:", response.data);
        toast.error("Failed to load organizations: Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to load organizations. Please try again later.");
    } finally {
      setOrganizationsLoading(false);
    }
  };

  // Fetch companies from API
  const fetchCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const response = await axios.get(`${baseURL}company_setups.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.data && Array.isArray(response.data.company_setups)) {
        setCompanies(response.data.company_setups);
      } else {
        console.error("Invalid companies data format:", response.data);
        toast.error("Failed to load companies: Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies. Please try again later.");
    } finally {
      setCompaniesLoading(false);
    }
  };

  // Fetch departments from API
  const fetchDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const response = await axios.get(`${baseURL}departments.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("Department API response:", response.data); // Debug the API response

      // Check if response.data is directly an array
      if (response.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else if (response.data && Array.isArray(response.data.departments)) {
        // Fallback to original expected structure
        setDepartments(response.data.departments);
      } else {
        console.error("Invalid department data format:", response.data);
        toast.error("Failed to load departments: Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments. Please try again later.");
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const fetchSites = async () => {
    setSitesLoading(true);
    try {
      const response = await axios.get(`${baseURL}sites.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("Sites API response:", response.data); // Debug the API response

      // Check if response.data is directly an array
      if (response.data && Array.isArray(response.data)) {
        setSites(response.data);
      } else if (response.data && Array.isArray(response.data.sites)) {
        // Fallback to original expected structure
        setSites(response.data.sites);
      } else {
        console.error("Invalid sites data format:", response.data);
        toast.error("Failed to load sites: Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to load sites. Please try again later.");
    } finally {
      setSitesLoading(false);
    }
  };

  const handleChange = (e) => {
    if (!e || !e.target) return; // Prevents the crash

    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const getMaxBirthDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
    );
    return maxDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Update your validateForm function to include birth date validation
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const requiredFields = [
      { field: "firstname", label: "First Name" },
      { field: "lastname", label: "Last Name" },
      { field: "mobile", label: "Mobile Number" },
      { field: "email", label: "Email" },
      { field: "role_id", label: "Role" },
      { field: "company_id", label: "Company" },
      { field: "department_id", label: "Department" },
    ];

    let emptyFields = requiredFields.filter(
      ({ field }) => !formData[field] || String(formData[field]).trim() === ""
    );
    if (emptyFields.length === requiredFields.length) {
      toast.dismiss();
      toast.error("Please fill in all the required fields.");
      return false;
    }

    for (const { field, label } of requiredFields) {
      if (!formData[field] || String(formData[field]).trim() === "") {
        newErrors[field] = `${label} is mandatory`;
        setErrors(newErrors);
        toast.dismiss();
        toast.error(`${label} is mandatory`);
        return false;
      }
    }

    // Birth date validation - must be at least 16 years old
    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
      );

      if (birthDate > minDate) {
        newErrors.birth_date = "User must be at least 16 years old";
        isValid = false;
        toast.error("User must be at least 16 years old");
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
      toast.error("Please enter a valid email address");
    }

    if (
      formData.alternate_email1 &&
      !emailRegex.test(formData.alternate_email1)
    ) {
      newErrors.alternate_email1 =
        "Please enter a valid alternate email address";
      isValid = false;
      toast.error("Please enter a valid alternate email address 1");
    }

    if (
      formData.alternate_email2 &&
      !emailRegex.test(formData.alternate_email2)
    ) {
      newErrors.alternate_email2 =
        "Please enter a valid alternate email address";
      isValid = false;
      toast.error("Please enter a valid alternate email address 2");
    }

    // Mobile validation - should be 10 digits
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number should be 10 digits";
      isValid = false;
      toast.error("Mobile number should be 10 digits");
    }

    setErrors(newErrors);
    return isValid && Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    //  let formattedData = { ...formData };
    // if (formData?.birth_date) {
    //   const [year, month, day] = formData.birth_date.split("-");
    //   formattedData.birth_date = `${day}-${month}-${year}`;
    // }

    // Create user object from form data
    const data = new FormData();
    data.append("user[organization_id]", formData.organization_id);
    data.append("user[company_id]", formData.company_id);
    data.append("user[role_id]", formData.role_id);
    data.append("user[firstname]", formData.firstname);
    data.append("user[lastname]", formData.lastname);
    data.append("user[mobile]", formData.mobile);
    data.append("user[email]", formData.email);
    data.append("user[alternate_email1]", formData.alternate_email1);
    data.append("user[alternate_address]", formData.alternate_address);
    data.append("user[employee_type]", formData.employee_type);
    data.append("user[user_title]", formData.user_title);
    data.append("user[gender]", formData.gender);

    //  data.append("user[birth_date]", formData.birth_date);

    // Format birth date properly for API (DD-MM-YYYY)
    if (formData.birth_date) {
      const [year, month, day] = formData.birth_date.split("-");
      data.append("user[birth_date]", `${day}-${month}-${year}`);
    }

    data.append("user[site_id]", formData.site_id);
    data.append("user[department_id]", formData.department_id);

    try {
      const response = await axios.put(`${baseURL}users/${id}.json`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Changed to multipart/form-data for FormData
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("User updated successfully");
      console.log("Response from API:", response.data);
      navigate("/setup-member/user-list");
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error updating user: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (formData?.birth_date) {
    const [day, month, year] = formData.birth_date.split("-");

    if (day && month && year) {
      formData.birth_date = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
    }
  } else {
    //FallBack
    console.warn("birth_date is null or undefined");
  }

  const formatDateToDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  if (formData.birth_date) {
    const [day, month, year] = formData.birth_date.split("-");
    if (day && month && year) {
      formData.birth_date = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
    }
  }

  // Prepare dropdown options
  const roleOptions = [
    { label: "Select Role", value: "" },
    ...roles.map((role) => ({
      label: role.name || `Role ${role.id}`,
      value: role.id.toString(),
    })),
  ];

  const organizationOptions = [
    { label: "Select Organization", value: "" },
    ...organizations.map((org) => ({
      label: org.name || `Organization ${org.id}`,
      value: org.id.toString(),
    })),
  ];

  const companyOptions = [
    { label: "Select Company", value: "" },
    ...companies.map((company) => ({
      label: company.name || `Company ${company.id}`,
      value: company.id.toString(),
    })),
  ];

  // Added department options
  const departmentOptions = [
    { label: "Select Department", value: "" },
    ...departments.map((dept) => ({
      label: dept.name || `Department ${dept.id}`,
      value: dept.id.toString(),
    })),
  ];

  const siteoptions = [
    ...sites.map((site) => ({
      label: site.name || `Department ${site.id}`,
      value: site.id.toString(),
    })),
  ];

  if (fetchingUser) {
    return (
      <div className="main-content">
        <div className="module-data-section p-3">
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="">
        <div className="">
          <div className="module-data-section p-3">
            <form onSubmit={handleSubmit} noValidate>
              <div className="card mt-4 pb-4 mx-4">
                <div className="card-header3">
                  <h3 className="card-title">Edit User</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="row">
                      {/* First Name */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            First Name <span className="otp-asterisk">*</span>
                          </label>
                          <input
                            className={`form-control ${
                              errors.firstname ? "is-invalid" : ""
                            }`}
                            type="text"
                            name="firstname"
                            placeholder="Enter firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                          />
                          {errors.firstname && (
                            <div className="invalid-feedback">
                              {errors.firstname}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            Last Name <span className="otp-asterisk">*</span>
                          </label>
                          <input
                            className={`form-control ${
                              errors.lastname ? "is-invalid" : ""
                            }`}
                            type="text"
                            name="lastname"
                            placeholder="Enter lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                          />
                          {errors.lastname && (
                            <div className="invalid-feedback">
                              {errors.lastname}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            Mobile Number{" "}
                            <span className="otp-asterisk">*</span>
                          </label>
                          <input
                            className={`form-control ${
                              errors.mobile ? "is-invalid" : ""
                            }`}
                            type="text"
                            name="mobile"
                            placeholder="Enter mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            maxLength={10}
                          />
                          {errors.mobile && (
                            <div className="invalid-feedback">
                              {errors.mobile}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            Email <span className="otp-asterisk">*</span>
                          </label>
                          <input
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          {errors.email && (
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Password - Read Only */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Password</label>
                          <input
                            className="form-control"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            disabled
                            readOnly
                            style={{ 
                              backgroundColor: "#f8f9fa", 
                              cursor: "not-allowed" 
                            }}
                          />
                        </div>
                      </div>

                      {/* Alternate Email 1 */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Alternate Email </label>
                          <input
                            className={`form-control ${
                              errors.alternate_email1 ? "is-invalid" : ""
                            }`}
                            type="email"
                            name="alternate_email1"
                            placeholder="Enter alternate email"
                            value={formData.alternate_email1 || ""}
                            onChange={handleChange}
                          />
                          {errors.alternate_email1 && (
                            <div className="invalid-feedback">
                              {errors.alternate_email1}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Alternate Address */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Address</label>
                          <input
                            className="form-control"
                            type="text"
                            name="alternate_address"
                            placeholder="Enter address"
                            value={formData.alternate_address || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* User Title */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>User Title</label>
                          <input
                            className="form-control"
                            type="text"
                            name="user_title"
                            placeholder="Enter user title"
                            value={formData.user_title || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Gender</label>
                          <SelectBox
                            options={[
                              { label: "Male", value: "Male" },
                              { label: "Female", value: "Female" },
                              { label: "Other", value: "Other" },
                            ]}
                            defaultValue={formData.gender}
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                gender: value,
                              }))
                            }
                          />
                        </div>
                      </div>

                         {/* <div className="col-md-3">
                        <div className="form-group">
                          <label>Birth Date</label>
                          <input
                            className="form-control"
                            type="date"
                            name="birth_date"
                            value={formatDateToDisplay(formData.birth_date)}
                            onChange={handleChange}
                          />
                        </div>
                      </div> */}

                      {/* Birth Date */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Birth Date</label>
                          <input
                            className={`form-control ${
                              errors.birth_date ? "is-invalid" : ""
                            }`}
                            type="date"
                            name="birth_date"
                            value={formData.birth_date || ""}
                            max={getMaxBirthDate()} // This restricts the date picker
                            onChange={handleChange}
                          />
                          {errors.birth_date && (
                            <div className="invalid-feedback">
                              {errors.birth_date}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Employee Type */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Employee Type</label>
                          <input
                            className="form-control"
                            type="text"
                            name="employee_type"
                            placeholder="Enter employee type"
                            value={formData.employee_type || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Company Dropdown */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            Company
                            <span className="otp-asterisk"> *</span>
                          </label>
                          <SelectBox
                            options={companies.map((comp) => ({
                              label: comp.name,
                              value: comp.id,
                            }))}
                            defaultValue={formData.company_id}
                            onChange={(value) => {
                              setFormData({
                                ...formData,
                                company_id: value,
                              });
                            }}
                            className={errors.company_id ? "is-invalid" : ""}
                          />
                          {errors.company_id && (
                            <div className="invalid-feedback">
                              {errors.company_id}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Organization Dropdown */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            Organization
                            {/* <span className="otp-asterisk"> *</span> */}
                          </label>
                          <SelectBox
                            options={organizations.map((org) => ({
                              label: org.name,
                              value: org.id,
                            }))}
                            defaultValue={formData.organization_id}
                            onChange={(value) => {
                              setFormData({
                                ...formData,
                                organization_id: value,
                              });
                            }}
                            className={
                              errors.organization_id ? "is-invalid" : ""
                            }
                          />
                          {errors.organization_id && (
                            <div className="invalid-feedback">
                              {errors.organization_id}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Role Dropdown */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            User Role
                            <span className="otp-asterisk"> *</span>
                          </label>
                          <SelectBox
                            options={roles.map((role) => ({
                              label: role.name,
                              value: role.id,
                            }))}
                            defaultValue={formData.role_id}
                            onChange={(value) => {
                              setFormData({
                                ...formData,
                                role_id: value,
                              });
                            }}
                            className={errors.role_id ? "is-invalid" : ""}
                          />
                          {errors.role_id && (
                            <div className="invalid-feedback">
                              {errors.role_id}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Department Dropdown - Added from UserCreate */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            Department <span className="otp-asterisk">*</span>
                          </label>
                          <SelectBox
                            options={
                              departmentsLoading
                                ? [{ value: "", label: "Loading..." }]
                                : departments.length > 0
                                ? departments.map((dept) => ({
                                    value: dept.id,
                                    label: dept.name,
                                  }))
                                : [{ value: "", label: "No departments found" }]
                            }
                            defaultValue={formData.department_id}
                            onChange={(value) =>
                              setFormData({ ...formData, department_id: value })
                            }
                            className={errors.department_id ? "is-invalid" : ""}
                          />
                          {errors.department_id && (
                            <div className="invalid-feedback">
                              {errors.department_id}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            Site 
                            {/* <span className="otp-asterisk">*</span> */}
                          </label>
                          <SelectBox
                            options={
                              sitesLoading
                                ? [{ value: "", label: "Loading..." }]
                                : sites.length > 0
                                ? sites.map((site) => ({
                                    value: site.id,
                                    label: site.name,
                                  }))
                                : [{ value: "", label: "No site found" }]
                            }
                            defaultValue={formData.site_id}
                            onChange={(value) =>
                              setFormData({ ...formData, site_id: value })
                            }
                            className={errors.site_id ? "is-invalid" : ""}
                          />
                          {errors.site_id && (
                            <div className="invalid-feedback">
                              {errors.site_id}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Site ID */}
                      {/* <div className="col-md-3 mt-1">
                        <div className="form-group">
                          <label>Site ID</label>
                          <input
                            className="form-control"
                            type="text"
                            name="site_id"
                            placeholder="Enter Site ID"
                            value={formData.site_id || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit and Cancel Buttons */}
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
                    type="button"
                    className="purple-btn2 w-100"
                    onClick={handleCancel}
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

export default UserEdit;
