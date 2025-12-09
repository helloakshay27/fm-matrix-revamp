import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const UserDetails = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/user_details/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const user = response.data.users; // <- FIXED HERE
        setFormData((prev) => ({
          ...prev,
          ...user,
        }));
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [id]);

  if (!formData.firstname && !formData.lastname) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <div className="module-data-section p-3">
            <div className="card mt-4 pb-4 mx-4">
              <div className="card-header3">
                <h3 className="card-title">User Details</h3>
              </div>
              <div className="card-body">
                <div className="row px-3">
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>First Name</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.firstname || ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Last Name</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.lastname || ""}
                      </span>
                    </div>
                  </div>

                  {/* Add more fields as needed */}
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Email</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.email || ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Mobile</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.mobile || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Alternate Email</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.alternate_email1 || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Address</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.alternate_address || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>User Title</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.user_title || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Gender</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.gender || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Birth Date</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.birth_date || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Employee Type</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.employee_type || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Company ID</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.user_company_name || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Organization ID</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.user_org_name || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Role ID</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.lock_role_name || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Department ID</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.department_name || ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                    <div className="col-6">
                      <label>Site ID</label>
                    </div>
                    <div className="col-6">
                      <span className="text-dark">
                        : {formData.site_name || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
