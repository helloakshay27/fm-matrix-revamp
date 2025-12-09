import React, { useState, useEffect } from "react";
// import "../styles/style.css";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  fetchMasterAttributes,
  fetchSubAttributes,
} from "./Confi/ruleEngineApi"
import "bootstrap/dist/css/bootstrap.min.css";
import {baseURL} from "./baseurl/apiDomain"

const RuleEngine = () => {
  const [RuleEngine, setRuleEngine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [showModal, setShowModal] = useState(false);
  const [conditions, setConditions] = useState([]);

  const [masterAttributes, setMasterAttributes] = useState([]);
  const [subAttributes, setSubAttributes] = useState([]);
  const [selectedMasterAttribute, setSelectedMasterAttribute] = useState("");
  const [selectedSubAttribute, setSelectedSubAttribute] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    masterAttribute: "",
    subAttribute: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const storedValue = sessionStorage.getItem("selectedId");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchRuleEngine = async () => {
      try {
        const response = await axios.get(
          `${baseURL}rule_engine/rules.json?access_token=${token}`
        );
        setRuleEngine(response.data);
        setFilteredItems(response.data);
        console.log("RuleEngine", response.data);
      } catch (err) {
        setError("Failed to fetch rule engine.");
      } finally {
        setLoading(false);
      }
    };

    fetchRuleEngine();
  }, []);

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/_/g, " ")
      .replace(/::/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const companyId = 44;
        const activeStatus = true;
        const masterAttrs = await fetchMasterAttributes(
          companyId,
          activeStatus
        );

        console.log("masterAttrs", masterAttrs);
        setMasterAttributes(masterAttrs.master_attributes || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    getData();
  }, []);

  const handleMasterAttributeChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedMasterAttribute(selectedId);

    const selectedIndex = masterAttributes.findIndex(
      (attr) => attr.id === parseInt(selectedId)
    );

    if (selectedIndex !== -1) {
      try {
        const subAttrs = await fetchSubAttributes(selectedId);
        const selectedSubAttributes =
          subAttrs.master_attributes[selectedIndex].sub_attributes;
        setSubAttributes(selectedSubAttributes);

        if (!conditions) {
          setConditions([]);
        }

        setFormValues({
          masterAttribute: selectedId,
          subAttribute: "",
        });
      } catch (error) {
        console.error("Error fetching sub attributes:", error);
      }
    } else {
      console.error("Selected ID not found in master attributes");
    }
  };

  const handleSubAttributeChange = (e) => {
    setSelectedSubAttribute(e.target.value);

    const updatedConditions = conditions.map((cond) => ({
      ...cond,
      subAttribute: e.target.value,
    }));

    setConditions(updatedConditions);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const filtered = RuleEngine.filter((rule) => {
        const searchLower = searchTerm.toLowerCase();
        
        // Search in rule name, description, and ID
        const ruleMatch = [
          rule.name,
          rule.description,
          rule.id?.toString(),
          rule.active ? 'active' : 'inactive'
        ].some(field => 
          field && field.toString().toLowerCase().includes(searchLower)
        );

        // Search in conditions
        const conditionsMatch = rule.conditions?.some(condition => 
          [
            condition.condition_attribute,
            condition.condition_attribute_display_name,
            condition.operator,
            condition.compare_value,
            condition.model_name,
            condition.master_operator
          ].some(field => 
            field && field.toString().toLowerCase().includes(searchLower)
          )
        );

        // Search in actions
        const actionsMatch = rule.actions?.some(action => 
          [
            action.action_method,
            action.parameters?.toString(),
            action.lock_model_name
          ].some(field => 
            field && field.toString().toLowerCase().includes(searchLower)
          )
        );

        return ruleMatch || conditionsMatch || actionsMatch;
      });
      setFilteredItems(filtered);
    } else {
      setFilteredItems(RuleEngine);
    }
    setCurrentPage(1);
    setSuggestions([]);
  };

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim()) {
      // Real-time search as user types
      const filtered = RuleEngine.filter((rule) => {
        const searchLower = term.toLowerCase();
        
        // Search in rule name, description, and ID
        const ruleMatch = [
          rule.name,
          rule.description,
          rule.id?.toString(),
          rule.active ? 'active' : 'inactive'
        ].some(field => 
          field && field.toString().toLowerCase().includes(searchLower)
        );

        // Search in conditions
        const conditionsMatch = rule.conditions?.some(condition => 
          [
            condition.condition_attribute,
            condition.condition_attribute_display_name,
            condition.operator,
            condition.compare_value,
            condition.model_name,
            condition.master_operator
          ].some(field => 
            field && field.toString().toLowerCase().includes(searchLower)
          )
        );

        // Search in actions
        const actionsMatch = rule.actions?.some(action => 
          [
            action.action_method,
            action.parameters?.toString(),
            action.lock_model_name
          ].some(field => 
            field && field.toString().toLowerCase().includes(searchLower)
          )
        );

        return ruleMatch || conditionsMatch || actionsMatch;
      });

      setFilteredItems(filtered);
      
      // Generate suggestions based on rule names
      const filteredSuggestions = filtered.slice(0, 10);
      setSuggestions(filteredSuggestions);
      setSelectedIndex(-1);
    } else {
      // If search term is empty, show all data
      setFilteredItems(RuleEngine);
      setSuggestions([]);
    }
    setCurrentPage(1);
  };

  const handleFilter = async (e) => {
    e.preventDefault();

    if (!selectedMasterAttribute && !selectedSubAttribute) {
      // If no filters selected, show all data
      setFilteredItems(RuleEngine);
      handleCloseModal();
      return;
    }

    try {
      // First try API filtering
      let query = [];
      if (selectedMasterAttribute) {
        // Find the master attribute name for API query
        const masterAttr = masterAttributes.find(attr => attr.id === parseInt(selectedMasterAttribute));
        if (masterAttr) {
          query.push(`q[rule_engine_conditions_model_name_cont]=${masterAttr.display_name}`);
        }
      }
      if (selectedSubAttribute) {
        query.push(`q[rule_engine_conditions_condition_attribute_display_name_cont]=${selectedSubAttribute}`);
      }
      
      const queryString = query.length > 0 ? `?${query.join("&")}` : "";

      const response = await axios.get(
        `${baseURL}rule_engine/rules.json${queryString}&access_token=${token}`
      );
      
      if (response.data) {
        setFilteredItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching filtered data from API, using client-side filtering:", error);
      
      // Fallback to client-side filtering
      const filtered = RuleEngine.filter((rule) => {
        let matchesMaster = !selectedMasterAttribute;
        let matchesSub = !selectedSubAttribute;

        if (selectedMasterAttribute) {
          const masterAttr = masterAttributes.find(attr => attr.id === parseInt(selectedMasterAttribute));
          if (masterAttr && rule.conditions?.length > 0) {
            matchesMaster = rule.conditions.some(condition => 
              condition.model_name?.toLowerCase().includes(masterAttr.display_name.toLowerCase())
            );
          }
        }

        if (selectedSubAttribute && rule.conditions?.length > 0) {
          matchesSub = rule.conditions.some(condition => 
            condition.condition_attribute_display_name?.toLowerCase().includes(selectedSubAttribute.toLowerCase())
          );
        }

        return matchesMaster && matchesSub;
      });

      setFilteredItems(filtered);
    }

    setSelectedMasterAttribute("");
    setSelectedSubAttribute("");
    setSubAttributes([]);
    setFormValues({ name: "", masterAttribute: "", subAttribute: "" });
    handleCloseModal();
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReset = () => {
    setSearchTerm("");
    setFilteredItems(RuleEngine);
    setSuggestions([]);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  function snakeToCapitalized(str) {
    if (!str) return "";
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const Pagination = ({
    currentPage,
    totalPages,
    totalEntries,
    onPageChange,
  }) => {
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

    return (
      <div className="d-flex justify-content-between align-items-center px-3 mt-2">
        <ul className="pagination justify-content-center d-flex">
          <li
            className={`page-item ${
              currentPage === 1 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
          </li>
          <li
            className={`page-item ${
              currentPage === 1 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
          </li>
          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${
                currentPage === pageNumber ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </li>
        </ul>
        <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </p>
      </div>
    );
  };

  const handleToggle = async (id, isActive) => {
    try {
      const response = await axios.patch(
        `${baseURL}rule_engine/rules/${id}.json?access_token=${token}`,
        { rule_engine_rule: { active: isActive } }
      );

      setRuleEngine((prevRules) =>
        prevRules.map((rule) =>
          rule.id === id ? { ...rule, active: isActive } : rule
        )
      );

      setFilteredItems((prevFilteredItems) =>
        prevFilteredItems.map((rule) =>
          rule.id === id ? { ...rule, active: isActive } : rule
        )
      );
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const selectedItem = suggestions[selectedIndex];
        setSearchTerm(selectedItem.name);
        setFilteredItems([selectedItem]);
        setSuggestions([]);
        setCurrentPage(1);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (rule) => {
    setSearchTerm(rule.name);
    setSuggestions([]);
    setFilteredItems([rule]);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="w-100">
        <div className="module-data-section mx-3">
          {/* Add breadcrumb navigation */}
          <p className="pointer mb-3">
            <span>Home</span> &gt; <span>Rule Engine</span> &gt; <span>Rule List</span>
          </p>
          <h5>Rule List</h5>

          <div className="d-flex justify-content-between align-items-center">
            <Link to="/setup-member/create-rule-engine">
              <button
                className="purple-btn1"
                style={{ borderRadius: "5px", paddingRight: "50px" }}
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
                <span>New Rule</span>
              </button>
            </Link>
            <div className="d-flex align-items-center">
              <button
                className="purple-btn2 rounded-3 mt-2 me-3"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  fill="currentColor"
                  className="bi bi-plus mb-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                Filter
              </button>
              
              <div className="d-flex align-items-center position-relative">
                <div className="input-group me-3" style={{ width: "300px" }}>
                  <input
                    type="text"
                    className="form-control tbl-search table_search"
                    placeholder="Search rules, conditions, actions..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
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
                    <ul
                      className="suggestions-list position-absolute"
                      style={{
                        listStyle: "none",
                        padding: "0",
                        marginTop: "5px",
                        border: "1px solid #ddd",
                        maxHeight: "200px",
                        overflowY: "auto",
                        width: "100%",
                        zIndex: 1050,
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        top: "100%",
                        left: "0"
                      }}
                    >
                      {suggestions.map((rule, index) => (
                        <li
                          key={rule.id}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: "14px",
                            borderBottom: index < suggestions.length - 1 ? "1px solid #f8f9fa" : "none",
                            backgroundColor: selectedIndex === index ? "#f8f9fa" : "transparent",
                            transition: "background-color 0.15s ease-in-out"
                          }}
                          className={selectedIndex === index ? "highlight" : ""}
                          onMouseEnter={() => setSelectedIndex(index)}
                          onClick={() => handleSuggestionClick(rule)}
                        >
                          <div style={{ fontWeight: "500", color: "#495057" }}>
                            {rule.name}
                          </div>
                          {/* {rule.description && (
                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                              {rule.description}
                            </div>
                          )} */}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="tbl-container mt-4"
            style={{
              height: "100%",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : currentItems.length > 0 ? (
              <>
                <table className="w-100" style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Rule Name</th>
                      <th style={{ width: '15%' }}>Attribute</th>
                      <th style={{ width: '12%' }}>Condition</th>
                      <th style={{ width: '12%' }}>Action</th>
                      <th style={{ width: '12%' }}>Outcome</th>
                      <th style={{ width: '12%' }}>Reward</th>
                      <th style={{ width: '8%' }}>Toggle</th>
                      <th style={{ width: '9%' }}>View</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: '#000', fontWeight: '400', fontSize: '13px' }}>
                    {currentItems.map((rule) => {
                      const { id, name, conditions, active, actions } = rule;
                      
                      if (!conditions || conditions.length === 0) {
                        return (
                          <tr key={rule.id || name}>
                            <td style={{ width: '20%' }}>{rule.name}</td>
                            <td style={{ width: '15%' }}></td>
                            <td style={{ width: '12%' }}></td>
                            <td style={{ width: '12%' }}></td>
                            {actions.length > 0 ? (
                              actions.map((act, actIndex) => (
                                <React.Fragment key={act.id || actIndex}>
                                  <td style={{ width: '12%' }}>
                                    {formatFieldName(
                                      act.action_method ? act.action_method : ""
                                    )}
                                  </td>
                                  <td style={{ width: '12%' }}>
                                    {act.parameters ? act.parameters : ""}
                                    {act.parameters && act.action_method === "credit_points" && " pts"}
                                    {act.parameters && act.action_method === "percentage_credit" && " %"}
                                  </td>
                                </React.Fragment>
                              ))
                            ) : (
                              <>
                                <td style={{ width: '12%' }}></td>
                                <td style={{ width: '12%' }}></td>
                              </>
                            )}
                            <td style={{ width: '8%' }}>
                              <div className="form-check form-switch mt-1">
                                <input
                                  className="form-check-input custom-checkbox"
                                  type="checkbox"
                                  role="switch"
                                  checked={active}
                                  onChange={(e) =>
                                    handleToggle(id, e.target.checked)
                                  }
                                />
                              </div>
                            </td>
                            <td style={{ width: '9%' }}>
                              <Link to={`/view-rule-engine/${id}`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="#000000"
                                  className="bi bi-eye"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        );
                      }
                      
                      return conditions.map((condition, index) => (
                        <tr key={`${rule.id || name}-${index}`}>
                          {index === 0 && (
                            <td
                              rowSpan={conditions.length}
                              style={{ width: '20%' }}
                            >
                              {rule.name}
                            </td>
                          )}
                          <td style={{ width: '15%' }}>
                            {condition.condition_attribute_display_name}
                          </td>
                          <td style={{ width: '12%', textTransform: 'none' }}>
                            {snakeToCapitalized(condition.operator)}
                          </td>
                          <td style={{ width: '12%' }}>{snakeToCapitalized(condition.compare_value)}</td>
                          {actions.length > 0 ? (
                            actions.map((act, actIndex) => (
                              <React.Fragment key={act.id || actIndex}>
                                <td style={{ width: '12%' }}>
                                  {formatFieldName(
                                    act.action_method ? act.action_method : ""
                                  )}
                                </td>
                                <td style={{ width: '12%' }}>
                                  {act.parameters ? act.parameters : ""}
                                  {act.parameters && act.action_method === "credit_points" && " Pts"}
                                  {act.parameters && act.action_method === "percentage_credit" && " %"}
                                </td>
                              </React.Fragment>
                            ))
                          ) : (
                            <>
                              <td style={{ width: '12%' }}></td>
                              <td style={{ width: '12%' }}></td>
                            </>
                          )}
                          <td style={{ width: '8%' }}>
                            <div className="form-check form-switch mt-1">
                              <input
                                className="form-check-input custom-checkbox"
                                type="checkbox"
                                role="switch"
                                checked={active}
                                onChange={(e) =>
                                  handleToggle(id, e.target.checked)
                                }
                              />
                            </div>
                          </td>
                          <td style={{ width: '9%' }}>
                            <Link to={`/setup-member/view-rule-engine/${id}`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#000000"
                                className="bi bi-eye"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                  color: "#555",
                  fontWeight: "500",
                  backgroundColor: "#f9f9f9",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                }}
              >
                No matching rules found. Adjust your filters to see results.
              </div>
            )}
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <ul className="pagination justify-content-center d-flex">
              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
              </li>
              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
              </li>
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </li>
            </ul>
            <p className="text-center" style={{ marginTop: "10px", color: "#555" }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
            </p>
          </div>

          {/* Filter Modal */}
          <div 
            className={`modal fade ${showModal ? 'show' : ''}`} 
            style={{ display: showModal ? 'block' : 'none' }}
            tabIndex="-1" 
            role="dialog"
            aria-labelledby="filterModalLabel"
            aria-hidden={!showModal}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="filterModalLabel">Filter By</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <p
                      className="title"
                      style={{ fontSize: "14px", fontWeight: "400" }}
                    >
                      Attributes
                    </p>
                    <div className="row ms-2">
                      <fieldset className="border col-md-5 m-2 col-sm-11">
                        <legend
                          className="float-none"
                          style={{ fontSize: "14px", fontWeight: "400" }}
                        >
                          Master Attribute<span>*</span>
                        </legend>
                        <select
                          required=""
                          className="mt-1 mb-1"
                          style={{ fontSize: "12px", fontWeight: "400" }}
                          onChange={handleMasterAttributeChange}
                          value={selectedMasterAttribute}
                        >
                          <option value="" disabled selected hidden>
                            Select Master Attribute
                          </option>
                          {masterAttributes.map((attr) => (
                            <option key={attr.id} value={attr.id}>
                              {attr.display_name}
                            </option>
                          ))}
                        </select>
                      </fieldset>
                      <fieldset className="border col-md-5 m-2 col-sm-11">
                        <legend
                          className="float-none"
                          style={{ fontSize: "14px", fontWeight: "400" }}
                        >
                          Sub Attribute<span>*</span>
                        </legend>
                        <select
                          required=""
                          className="mt-1 mb-1"
                          style={{ fontSize: "12px", fontWeight: "400" }}
                          onChange={handleSubAttributeChange}
                          value={selectedSubAttribute}
                          disabled={!selectedMasterAttribute}
                        >
                          <option value="" disabled selected hidden>
                            Select Sub Attribute
                          </option>

                          {subAttributes.map((subAttr) => (
                            <option key={subAttr.id} value={subAttr.attribute_name}>
                              {subAttr.display_name}
                            </option>
                          ))}
                        </select>
                      </fieldset>
                    </div>
                  </div>

                  <div className="row mt-2 justify-content-center p-0 m-0">
                    <div className="col-md-4">
                      <button className="purple-btn1 w-100" onClick={handleFilter}>
                        Submit
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        className="purple-btn2 w-100"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
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
    </>
  );
};

export default RuleEngine;