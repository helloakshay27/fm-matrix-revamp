import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
// import "../styles/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import {baseURL} from "../pages/baseurl/apiDomain";
import Pagination from "../components/reusable/Pagination";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft, X } from "lucide-react";

const validationSchema = Yup.object({
  name: Yup.string().required("Tier Name is required"),
  exit_points: Yup.number()
    .required("Exit Points are required")
    .positive("Exit Points must be a positive number"),
  multipliers: Yup.number()
    .required("Multipliers are required")
    .positive("Multipliers must be a positive number"),
  welcome_bonus: Yup.number()
    .required("Welcome Bonus is required")
    .positive("Welcome Bonus must be a positive number"),
  point_type: Yup.string()
    .required("Point type is required")
    .oneOf(["lifetime", "yearly"], "Invalid point type"),
  tiers: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Tier name is required"),
      exit_points: Yup.number()
        .required("Exit points are required")
        .positive("Exit points must be a positive number"),
      multipliers: Yup.number()
        .required("Multipliers are required")
        .positive("Multipliers must be a positive number"),
      welcome_bonus: Yup.number()
        .required("Welcome bonus is required")
        .positive("Welcome bonus must be a positive number"),
    })
  ),
});

const Tiers = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Reduced from 10 to 5 to test pagination better

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]); //filter
  const [suggestions, setSuggestions] = useState([]); // To store the search suggestions

  const navigate = useNavigate();
  const storedValue = sessionStorage.getItem("selectedId");
  const token = localStorage.getItem("access_token");
  const fetchTiers = async () => {
    try {
      const response = await axios.get(
        `${baseURL}loyalty/tiers.json?access_token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
      );
      if (response && response.data) {
        setTiers(response.data);
        setFilteredItems(response.data);
        setLoading(false);
      }
    } catch (err) {
      // @ts-ignore
      setError("Failed to fetch tiers data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleEditClick = (tier) => {
    setSelectedTier(tier);
    setShowModal(true);
  };

  const handleFormSubmit = async (values) => {
    if (selectedTier) {
      try {
        const response = await axios.put(
          // @ts-ignore
          `${baseURL}loyalty/tiers/${selectedTier.id}.json?access_token=${token}`,
          { loyalty_tier: values },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response && response.data) {
          await fetchTiers(); // Refresh data after successful edit
        }

        handleCloseModal();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTier(null);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const handleSearch = () => {
  //   const filtered = tiers.filter((rule) => {
  //     const ruleName = rule.name ? rule.name.toLowerCase() : ""; // Ensure rule.name is not null
  //     return ruleName.includes(searchTerm.toLowerCase());
  //   });

  //   console.log("filtered :----", filtered);

  //   setFilteredItems(filtered);
  //   setCurrentPage(1);
  // };

  // Handle search submission (e.g., when pressing 'Go!')
  const handleSearch = () => {
    const filtered = tiers.filter((member) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      // Special handling for multipliers to match "5x" style search
      const multipliersStr =
        member.multipliers !== undefined && member.multipliers !== null
          ? String(member.multipliers) + "x"
          : "";
      return [
        member.name,
        member.exit_points,
        multipliersStr, // include "5x" style
        member.multipliers, // also allow searching just the number
        member.welcome_bonus,
        member.point_type,
      ]
        .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
        .some((v) => v.includes(q));
    });
    setFilteredItems(filtered);
    setCurrentPage(1);
    setSuggestions([]);
  };

  // Handle search input change with real-time filtering
  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim()) {
      const filtered = tiers.filter((tier) => {
        const q = term.toLowerCase();
        const multipliersStr = tier.multipliers !== undefined && tier.multipliers !== null
          ? String(tier.multipliers) + "x"
          : "";
        
        return [
          tier.name,
          tier.exit_points,
          multipliersStr,
          tier.multipliers,
          tier.welcome_bonus,
          tier.point_type,
        ]
          .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
          .some((v) => v.includes(q));
      });
      
      setFilteredItems(filtered);
      setSuggestions(filtered.slice(0, 10));
      setCurrentPage(1);
    } else {
      setFilteredItems(tiers);
      setSuggestions([]);
      setCurrentPage(1);
    }
  };

  const handleSuggestionClick = (tier) => {
    setSearchTerm(tier.name);
    setSuggestions([]);
    setFilteredItems([tier]);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredItems(tiers);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // @ts-ignore
  let yearlyTier = tiers.filter((item) => item.point_type === "yearly").length;
  let lifeTimeTier = tiers.filter(
    // @ts-ignore
    (item) => item.point_type === "lifetime"
  ).length;

  const baseURL = API_CONFIG.BASE_URL;
  const [step, setStep] = useState(1);
  const [timeframe, setTimeframe] = useState("");
  const [timeframeError, setTimeframeError] = useState("");

  const handleTimeframeChange = (value) => {
    setTimeframe(value);
    setTimeframeError("");
  };

  const nextStep = () => {
    if (step === 1 && timeframe) {
      setStep(2);
    } else if (!timeframe) {
      setTimeframeError("Please select a timeframe.");
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const storedValue = sessionStorage.getItem("selectedId");
      const token = localStorage.getItem("access_token");
      
      const existingTiersResponse = await axios.get(
        `${baseURL}/loyalty/tiers.json?access_token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
      );
      
      const existingTiers = existingTiersResponse.data || [];
      
      const allNewTierNames = [values.name, ...(values.tiers || []).map(tier => tier.name)];
      const lowerCaseNewNames = allNewTierNames.map(name => name?.toLowerCase()).filter(Boolean);
      
      const conflictingTier = existingTiers.find(existingTier => 
        lowerCaseNewNames.some(newName => 
          existingTier.name && existingTier.name.toLowerCase() === newName
        )
      );
      
      if (conflictingTier) {
        toast.error(`Tier name "${conflictingTier.name}" already exists.`);
        setSubmitting(false);
        return;
      }
      
      const hasDuplicates = lowerCaseNewNames.length !== new Set(lowerCaseNewNames).size;
      
      if (hasDuplicates) {
        toast.error("Tier name already exists in your submission.");
        setSubmitting(false);
        return;
      }

      const formattedTiers = values.tiers?.map((tier) => ({
        loyalty_type_id: Number(storedValue),
        name: tier.name,
        exit_points: Number(tier.exit_points),
        multipliers: Number(tier.multipliers),
        welcome_bonus: Number(tier.welcome_bonus),
        point_type: timeframe,
      }));

      const newTier = {
        loyalty_type_id: Number(storedValue),
        name: values.name,
        exit_points: Number(values.exit_points),
        multipliers: Number(values.multipliers),
        welcome_bonus: Number(values.welcome_bonus),
        point_type: timeframe,
      };

      const data = {
        loyalty_tier:
          formattedTiers?.length > 0 ? [...formattedTiers, newTier] : newTier,
      };

      const url =
        formattedTiers?.length > 0
          ? `${baseURL}/loyalty/tiers/bulk_create?token=${token}`
          : `${baseURL}/loyalty/tiers.json?access_token=${token}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Tier saved successfully!");
        setTimeout(() => {
          resetForm();
          navigate("/setup-member/loyalty-tiers-list");
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Unexpected response: ${response.status}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to create tier. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-100">
        {/* <SubHeader /> */}
        <div className="module-data-section container-fluid">
          <div className="card mt-3 mx-3">
            <div className="card-header mb-0">
              <h3 className="card-title">Tiers List</h3>
            </div>
            <div className="card-body">
              {/* Add breadcrumb navigation */}
              {/* <p className="pointer mb-3">
                <span>Home</span> &gt; <span>Tiers</span> &gt; <span>Tier List</span>
              </p> */}
              
              <div className="loyalty-header">
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/setup-member/new-tier">
                    <button
                      className="purple-btn1 rounded-1"
                      style={{ paddingRight: "50px" }}
                    >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    fill="currentColor"
                    className="bi bi-plus mb-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span>New Tier</span>
                </button>
              </Link>
              <div className="d-flex align-items-center">
                <div className="input-group me-3">
                  <input
                    type="text"
                    className="form-control tbl-search table_search"
                    placeholder="Search by Tier name"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                  <div className="input-group-append">
                    <button 
                      type="button" 
                      className="btn btn-md btn-default"
                      onClick={handleSearch}
                    >
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                          fill="#8B0203"
                        />
                        <path
                          d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                          fill="#8B0203"
                        />
                      </svg>
                    </button>
                  </div>
                  {suggestions.length > 0 && (
                    <ul className="search-suggestions position-absolute" style={{
                      top: "100%",
                      left: "0",
                      width: "100%",
                      zIndex: 1000,
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      listStyle: "none",
                      padding: "0",
                      margin: "0"
                    }}>
                      {suggestions.map((member) => (
                        <li
                          key={member.id}
                          className="search-suggestion-item"
                          onClick={() => handleSuggestionClick(member)}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee"
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                          onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                        >
                          {member.name}
                        </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>
            </div>

            <div
              className="d-flex justify-content-start gap-3 mt-2 mt-4"
              style={{ color: "#fff", flexWrap: "nowrap" }}
            >
              <div
                className="flex-grow-1 violet-red p-1 px-2"
                style={{ borderRadius: "8px" }}
              >
                <p>{tiers.length}</p>
                <p>Total Tiers</p>
              </div>
              <div
                className="flex-grow-1 violet-red p-1 px-2"
                style={{ borderRadius: "8px" }}
              >
                <p>{yearlyTier}</p>
                <p>Rolling Year Tiers</p>
              </div>
              <div
                className="flex-grow-1 violet-red p-1 px-2"
                style={{ borderRadius: "8px" }}
              >
                <p>{lifeTimeTier}</p>
                <p>Life Time Tiers</p>
              </div>
            </div>

            {loading && <p>Loading tiers...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <>
                <div className="tbl-container mt-4" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  {currentItems.length > 0 ? (
                    <>
                      <table className="w-100" style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                        <thead>
                          <tr>
                            <th>Tier Name</th>
                            <th>Exit Points</th>
                            <th>Multipliers</th>
                            <th>Welcome Bonus</th>
                            <th>Member Count</th>
                            <th>Edit</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((tier) => (
                            <tr key={tier.id}>
                              <td>{tier.name}</td>
                              <td>{tier.exit_points}</td>
                              <td>{tier.multipliers}x</td>
                              <td>{tier.welcome_bonus} Points</td>
                              <td>{tier.member_count || 0}</td>
                              <td>
                                <button
                                  className="purple-btn1 rounded-1"
                                  onClick={() => handleEditClick(tier)}
                                  title="Edit Tier"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-pencil-square"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                    />
                                  </svg>
                                </button>
                              </td>
                              <td>
                                <button
                                  className="purple-btn2 rounded-1"
                                  onClick={() =>
                                    navigate(`/setup-member/tier-details/${tier.id}`)
                                  }
                                  title="View Tier"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                  >
                                    <path
                                      d="M0.833008 10.0002C0.833008 10.0002 4.16634 3.3335 9.99967 3.3335C15.833 3.3335 19.1663 10.0002 19.1663 10.0002C19.1663 10.0002 15.833 16.6668 9.99967 16.6668C4.16634 16.6668 0.833008 10.0002 0.833008 10.0002Z"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {/* Remove the console.log and ensure pagination always shows when there are items */}
                      
                      
                    </>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "16px",
                        color: "#6c757d",
                        fontWeight: "400",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #dee2e6",
                        textAlign: "center",
                        flexDirection: "column"
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        fill="currentColor"
                        className="bi bi-inbox mb-3"
                        viewBox="0 0 16 16"
                        style={{ opacity: 0.5 }}
                      >
                        <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.046A.5.5 0 0 1 .5 8.5V8a.5.5 0 0 1 .106-.294L4.14 2.894A1.5 1.5 0 0 1 5.338 2h5.324a1.5 1.5 0 0 1 1.198.894L15.394 7.7A.5.5 0 0 1 15.5 8v.5a.5.5 0 0 1-.546.5"/>
                      </svg>
                      <div>
                        {searchTerm ? (
                          <>
                            <div style={{ marginBottom: "8px" }}>No tiers found matching your search.</div>
                            <div style={{ fontSize: "14px", opacity: 0.7 }}>
                              Try adjusting your search criteria or 
                              <button 
                                onClick={() => {
                                  setSearchTerm("");
                                  setFilteredItems(tiers);
                                  setCurrentPage(1);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#007bff",
                                  textDecoration: "underline",
                                  padding: "0 4px",
                                  cursor: "pointer"
                                }}
                              >
                                clear filters
                              </button>
                              to see all tiers.
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ marginBottom: "8px" }}>No tiers found.</div>
                            <div style={{ fontSize: "14px", opacity: 0.7 }}>
                              Create your first tier to get started.
                            </div>
                          </>
                        )}
                      </div>
                      
                    </div>
                  )}
                </div>
                {/* Always show pagination when there are items, regardless of page count */}
                      {filteredItems.length > 0 && (
                        <div className="mt-3" style={{ borderTop: "1px solid #dee2e6", paddingTop: "1rem" }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <ul className="pagination justify-content-center d-flex mb-0">
                              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(1)}
                                  disabled={currentPage === 1}
                                >
                                  First
                                </button>
                              </li>
                              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                >
                                  Prev
                                </button>
                              </li>
                              
                              {/* Show page numbers */}
                              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                <li
                                  key={pageNumber}
                                  className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(pageNumber)}
                                  >
                                    {pageNumber}
                                  </button>
                                </li>
                              ))}
                              
                              <li className={`page-item ${currentPage === totalPages || totalPages <= 1 ? "disabled" : ""}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages || totalPages <= 1}
                                >
                                  Next
                                </button>
                              </li>
                              <li className={`page-item ${currentPage === totalPages || totalPages <= 1 ? "disabled" : ""}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(totalPages)}
                                  disabled={currentPage === totalPages || totalPages <= 1}
                                >
                                  Last
                                </button>
                              </li>
                            </ul>
                            <p className="text-center mb-0" style={{ color: "#555", fontSize: "14px" }}>
                              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
                            </p>
                          </div>
                        </div>
                      )}
              </>
            )}

            {/* Bootstrap Modal */}
            <div 
              className={`modal fade ${showModal ? 'show' : ''}`} 
              style={{ display: showModal ? 'block' : 'none' }}
              tabIndex="-1" 
              role="dialog"
              aria-labelledby="editTierModalLabel"
              aria-hidden={!showModal}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="editTierModalLabel">Edit Tier</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={handleCloseModal}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                {selectedTier && (
                  <Formik
                    initialValues={{
                      // @ts-ignore
                      name: selectedTier.name || "",
                      // @ts-ignore
                      exit_points: selectedTier.exit_points || 0,
                      // @ts-ignore
                      multipliers: selectedTier.multipliers || 0,
                      // @ts-ignore
                      welcome_bonus: selectedTier.welcome_bonus || 0,
                      // @ts-ignore
                      point_type: selectedTier.point_type || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                  >
                    {({ values, handleChange }) => (
                      <Form>
                        <div className="row">
                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Tier Name<span>*</span>
                              </legend>
                              <Field
                                type="text"
                                className="form-control border-0"
                                id="tierName"
                                name="name"
                              />
                            </fieldset>
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Exit Points<span>*</span>
                              </legend>
                              <Field
                                type="number"
                                className="form-control border-0"
                                id="exitPoints"
                                name="exit_points"
                                value={values.exit_points}
                                onChange={handleChange}
                              />
                            </fieldset>

                            <ErrorMessage
                              name="exit_points"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Multipliers
                                <span>*</span>
                              </legend>
                              <Field
                                type="number"
                                className="form-control border-0"
                                id="multipliers"
                                name="multipliers"
                                value={values.multipliers}
                                onChange={handleChange}
                              />
                            </fieldset>

                            <ErrorMessage
                              name="multipliers"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Welcome Bonus<span>*</span>
                              </legend>
                              <Field
                                type="number"
                                className="form-control border-0"
                                id="welcomeBonus"
                                name="welcome_bonus"
                                value={values.welcome_bonus}
                                onChange={handleChange}
                              />
                            </fieldset>

                            <ErrorMessage
                              name="welcome_bonus"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6 mb-3">
                            <fieldset className="border col-md-11 m-2 col-sm-11">
                              <legend
                                className="float-none"
                                style={{ marginLeft: "15px !important" }}
                              >
                                Point Type<span>*</span>
                              </legend>
                              <select
                                // className="form-control border-0"
                                style={{ padding: "8px" }}
                                id="pointType"
                                name="point_type"
                                onChange={handleChange}
                                value={values.point_type}
                              >
                                <option value="lifetime" label="Life Time" />
                                <option value="yearly" label="Yearly" />
                              </select>
                            </fieldset>

                            <ErrorMessage
                              name="point_type"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="row mt-2 justify-content-center align-items-center">
                          <div className="col-4">
                            <button type="submit" className="purple-btn1 w-100">
                              Submit
                            </button>
                          </div>
                          <div className="col-4">
                            <button
                              type="reset"
                              className="purple-btn2 w-100"
                              onClick={handleCloseModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal backdrop */}
            {showModal && (
              <div 
                className="modal-backdrop fade show" 
                onClick={handleCloseModal}
              ></div>
            )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Add PropTypes for type checking
Tiers.propTypes = {
  tiers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      exit_points: PropTypes.number.isRequired,
      multipliers: PropTypes.number.isRequired,
      welcome_bonus: PropTypes.number.isRequired,
      point_type: PropTypes.string.isRequired,
    })
  ),
};

export default Tiers;
