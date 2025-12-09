import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import SubHeader from "../components/SubHeader";
import axios from "axios";
import { baseURL } from "../pages/baseurl/apiDomain";

export default function TierDetails() {
  const { id } = useParams();
  const storedValue = sessionStorage.getItem("selectedId");
  const token = localStorage.getItem("access_token");

  const [tierDetails, setTierDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    return `${day}-${month}-${year}`;
  };

  // https://staging.lockated.com/loyalty/tiers/148.json?access_token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414
  const getMemberDetails = async (id) => {
    try {
      const response = await axios.get(
        `${baseURL}loyalty/tiers/${id}.json?access_token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
      );

      const formattedMember = {
        ...response.data,
        created_at: formatDate(response.data.created_at), // Format the created_at date
      };

      return formattedMember;
    } catch (error) {
      console.error("Error fetching member details:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await getMemberDetails(id);
        setTierDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  return (
    <div className="w-100">
      {/* <SubHeader /> */}
      <div className="module-data-section mt-2 mb-6 p-4">
        {/* Add proper breadcrumb navigation */}
        <p className="pointer mb-3">
          <Link
            to="/setup-member/tiers"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span> Tiers  </span>
          </Link>
          &gt; <span> Tier Details</span>
        </p>

        <div className="card mt-3">
          <div className="card-header">
            <h3 className="card-title">Tier Details</h3>
          </div>
          <div className="card-body p-4">
            {/* personal details */}
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "200px" }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            ) : (
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light rounded-3">
                          <div className="flex-grow-1">
                            <label className="form-label text-muted mb-1">
                              Tier Name
                            </label>
                            <div className="fw-bold text-dark">
                              {tierDetails?.display_name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="flex-grow-1">
                            <label className="form-label text-muted mb-1">
                              Exit Points
                            </label>
                            <div className="fw-bold text-dark">
                              {tierDetails?.exit_points || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="flex-grow-1">
                            <label className="form-label text-muted mb-1">
                              Multipliers
                            </label>
                            <div className="fw-bold text-dark">
                              {tierDetails?.multipliers || "N/A"}x
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="flex-grow-1">
                            <label className="form-label text-muted mb-1">
                              Welcome Bonus
                            </label>
                            <div className="fw-bold text-dark">
                              {tierDetails?.welcome_bonus || "N/A"} Points
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="flex-grow-1">
                            <label className="form-label text-muted mb-1">
                              Point Type
                            </label>
                            <div className="fw-bold text-dark">
                              <span
                                className={`badge ${
                                  tierDetails?.point_type === "lifetime"
                                    ? "bg-success"
                                    : "bg-primary"
                                }`}
                              >
                                {tierDetails?.point_type === "lifetime"
                                  ? "Lifetime"
                                  : "Rolling Year"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
