import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {baseURL} from "./baseurl/apiDomain"

const ViewRuleEngine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [rule, setRule] = useState({
    name: "",
    conditions: [],
    actions: [],
  });
  console.log(id);

  const formatFieldName = (fieldName) => {
    if (!fieldName) {
      return "";
    }
    return fieldName
      .replace(/_/g, " ")
      .replace(/::/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const [conditions, setConditions] = useState([
    {
      id: 1,
      masterAttribute: "",
      subAttribute: "",
      masterOperator: "",
      subOperator: "",
      condition_type: "",
      value: "",
    },
  ]);

  const [actions, setactions] = useState([
    {
      fetchMasterRewardOutcome: "",
      fetchSubRewardOutcome: "",
      parameters: "",
    },
  ]);

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: conditions.length + 1,
        masterAttribute: "",
        subAttribute: "",
        masterOperator: "",
        subOperator: "",
        condition_type: "",
        value: "",
      },
    ]);
  };

  const renderCondition = (condition, index) => (
    <div key={condition.id} className="SetRuleCard">
      <div>
        <h6 className="mt-3">
          <span>
            Condition {condition.id}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil-square mb-1 ms-3 text-body-secondary"
              viewBox="0 0 16 16"
            >
            </svg>
          </span>
        </h6>
      </div>

      {console.log("condition:", condition)}

      {index > 0 && condition && (
        <ul className="nav nav-tabs border-0 mt-3">
          <div className="d-flex gap-3 And-btn rounded">
            <li className="nav-item d-flex p-2 gap-2" role="presentation">
              <input
                type="radio"
                className="nav-link"
                id={`home-tab-${index}`}
                name={`tab-${index}`}
                data-bs-toggle="tab"
                data-bs-target={`#home-tab-pane-${index}`}
                role="tab"
                aria-controls={`home-tab-pane-${index}`}
                aria-selected="true"
                value="AND"
                checked={condition.condition_type === "AND"}
                readOnly
              />
              <label htmlFor={`home-tab-${index}`} className="and-or-btn">
                AND
              </label>
            </li>
            <li className="nav-item d-flex p-2 gap-2" role="presentation">
              <input
                type="radio"
                className="nav-link"
                id={`profile-tab-${index}`}
                name={`tab-${index}`}
                data-bs-toggle="tab"
                data-bs-target={`#profile-tab-pane-${index}`}
                role="tab"
                aria-controls={`profile-tab-pane-${index}`}
                aria-selected="false"
                value="OR"
                checked={condition.condition_type === "OR"}
                readOnly
              />
              <label htmlFor={`profile-tab-${index}`} className="and-or-btn">
                OR
              </label>
            </li>
          </div>
        </ul>
      )}

      <div className="border-btm pb-2 mt-2">
        <div>
          <h4>
            <span
              className="badge"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#8B7355",
                backgroundColor: "#F5F1EB",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #E6DDD4"
              }}
            >
              IF
            </span>
          </h4>
          <div className="row ms-1 mt-2">
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Master Attribute<span>*</span>
              </legend>
              <select
                required=""
                className="mt-1 mb-1"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  width: "100%",
                  height: "40px",
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: "4px",
                  // backgroundColor: "#f8f9fa",
                  appearance: "none",
                }}
                disabled
              >
                <option value="">{condition.model_name}</option>
              </select>
            </fieldset>
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <h4>&</h4>
            </div>
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Sub Attribute<span>*</span>
              </legend>
              <select
                required=""
                className="mt-1 mb-1"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  width: "100%",
                  height: "40px",
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: "4px",
                  // backgroundColor: "#f8f9fa",
                  appearance: "none",
                }}
                disabled
              >
                <option value="">
                  {formatFieldName(condition.condition_attribute)}
                </option>
              </select>
            </fieldset>
          </div>
        </div>

        <div className="mt-3">
          <h4>
            <span
              className="badge"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#8B7355",
                backgroundColor: "#F5F1EB",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #E6DDD4"
              }}
            >
              Operator
            </span>
          </h4>
          <div className="row ms-1 mt-2">
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Master Operator<span>*</span>
              </legend>
              <select
                required=""
                className="mt-1 mb-1"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  width: "100%",
                  height: "40px",
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: "4px",
                  // backgroundColor: "#f8f9fa",
                  appearance: "none",
                }}
                disabled
              >
                <option value="">{condition.master_operator}</option>
              </select>
            </fieldset>
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <h4>&</h4>
            </div>
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Sub Operator<span>*</span>
              </legend>
              <select
                required=""
                className="mt-1 mb-1"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  width: "100%",
                  height: "40px",
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: "4px",
                  // backgroundColor: "#f8f9fa",
                  appearance: "none",
                }}
                disabled
              >
                <option value="">{formatFieldName(condition.operator)}</option>
              </select>
            </fieldset>
          </div>
        </div>

        <div className="mt-3">
          <h4>
            <span
              className="badge"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#8B7355",
                backgroundColor: "#F5F1EB",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #E6DDD4"
              }}
            >
              Value
            </span>
          </h4>
          <div className="row ms-1 mt-2">
            <fieldset className="border col-md-3 m-2 col-sm-11">
              <legend
                className="float-none"
                style={{ fontSize: "14px", fontWeight: "400" }}
              >
                Value<span>*</span>
              </legend>
              <input
                type="text"
                className="mt-1 mb-1"
                value={condition.compare_value}
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  width: "100%",
                  height: "40px",
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                }}
                disabled
              />
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );

  const getRuleEngine = async (id) => {
    const storedValue = sessionStorage.getItem("selectedId");
    try {
      const response = await axios.get(
        `${baseURL}rule_engine/rules/${id}.json?access_token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
      );
      console.log("data for id", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching Rule Engine:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchRule = async () => {
      try {
        const data = await getRuleEngine(id);
        console.log(data);
        setRule(data);
        if (data.conditions) {
          console.log(data.conditions);
          setConditions(data.conditions);
        }
        if (data.actions) {
          console.log(data.actions);
          setactions(data.actions);
        }
      } catch (err) {
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchRule();
  }, [id]);

  return (
    <>
      <div className="w-100">
          <div className="d-flex align-items-start mb-3">
            <button 
              onClick={() => navigate(-1)} 
              className="purple-btn1 border-0"
              style={{ 
                color: "#5e2750", 
                textDecoration: "none",
                lineHeight: "1"
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-chevron-left"
                viewBox="0 0 16 16"
              >
                <path 
                  fillRule="evenodd" 
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </button>
          </div>
        <div className="module-data-section mx-4">
          
          <p className="pointer mb-2" style={{ marginLeft: "0" }}>
            <Link to="/setup-member/rule-engine">
              <span>Rule Engine </span>
            </Link>
            &gt; View Rule
          </p>
          
          <h5 className="mb-3">
            <span
              className="title"
              style={{ fontSize: "20px", fontWeight: "600" }}
            >
              View Rule
            </span>
          </h5>
          <div className="go-shadow me-3">
            <div className="row ms-1">
              <fieldset className="border col-md-11 m-2 col-sm-11">
                <legend
                  className="float-none"
                  style={{ fontSize: "14px", fontWeight: "400" }}
                >
                  New Rule<span>*</span>
                </legend>
                <input
                  type="text"
                  disabled
                  placeholder="Enter Name"
                  name={rule?.name}
                  value={rule.name}
                  style={{ 
                    fontSize: "14px", 
                    fontWeight: "400",
                    width: "100%",
                    height: "40px",
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: "transparent"
                  }}
                  className="mt-1 mb-1"
                />
              </fieldset>
              <fieldset className="border col-md-11 m-2 col-sm-11">
                <legend
                  className="float-none"
                  style={{ fontSize: "14px", fontWeight: "400" }}
                >
                  Display Rule Name<span>*</span>
                </legend>
                <input
                  type="text"
                  disabled
                  placeholder="Enter Name"
                  name={rule?.display_rule_name}
                  value={rule.display_rule_name}
                  style={{ 
                    fontSize: "14px", 
                    fontWeight: "400",
                    width: "100%",
                    height: "40px",
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: "transparent",
                  }}
                  className="mt-1 mb-1"
                />
              </fieldset>
            </div>
          </div>
          <div className="SetRuleCard">
            <div>
              <h5 className="title mt-3">Set Rule Conditions</h5>
            </div>
          </div>

          <div className="main-rule">
            {conditions.map(renderCondition)}

            {/* <button
              className="setRuleCard2 mt-2"
              onClick={addCondition}
              style={{ color: "black", fontSize: "16px", fontWeight: "500" }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
              </span>
              Add Additional Condition
            </button> */}

            <div className="mt-3">
              <h4>
                <span
                  className="badge"
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#8B7355",
                    backgroundColor: "#F5F1EB",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #E6DDD4"
                  }}
                >
                  THEN
                </span>
              </h4>
              <div className="ms-1 mt-2" style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                <fieldset className="border col-md-3 m-2 col-sm-11">
                  <legend className="float-none" style={{ fontSize: "14px", fontWeight: "400" }}>
                    Master Reward Outcome<span>*</span>
                  </legend>
                  <select
                    required
                    disabled
                    className="mt-1 mb-1 w-100"
                    style={{ 
                      fontSize: "14px", 
                      fontWeight: "400",
                      height: "40px",
                      padding: "10px 12px",
                      border: "none",
                      borderRadius: "4px",
                      // backgroundColor: "#f8f9fa",
                      appearance: "none"
                    }}
                  >
                    {actions.map((master, index) => (
                      <option key={`master-${index}`} value="">
                        {formatFieldName(master.lock_model_name)}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <div className="m-2 d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                  <h4 className="m-0">&</h4>
                </div>

                <fieldset className="border col-md-4">
                  <legend className="float-none" style={{ fontSize: "14px", fontWeight: "400" }}>
                    Sub Reward Outcome<span>*</span>
                  </legend>
                  <select
                    required
                    disabled
                    className="mt-1 mb-1 w-100"
                    style={{ 
                      fontSize: "14px", 
                      fontWeight: "400",
                      height: "40px",
                      padding: "10px 12px",
                      border: "none",
                      borderRadius: "4px",
                      // backgroundColor: "#f8f9fa",
                      appearance: "none"
                    }}
                  >
                    {actions.map((master, index) => (
                      <option key={`sub-${index}`} value="">
                        {formatFieldName(master.action_method)}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <div className="position-relative m-2 col-md-4 col-sm-11" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <fieldset className="border w-100" style={{ position: 'relative' }}>
                    <legend className="float-none" style={{ fontSize: "14px", fontWeight: "400" }}>
                      Parameter
                    </legend>

                    {actions.map((master, index) => (
                      <div key={`param-${index}`} className="d-flex align-items-center mt-1 mb-1">
                        <input
                          type="text"
                          placeholder="Enter Point Value"
                          value={master.parameters}
                          className="w-100"
                          style={{ 
                            fontSize: "14px", 
                            fontWeight: "400",
                            height: "40px",
                            padding: "10px 12px",
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor: "transparent",
                          }}
                          disabled
                        />
                      </div>
                    ))}
                  </fieldset>
                  
                  {actions.map((master, index) => (
                    <span
                      key={`unit-${index}`}
                      style={{
                        marginLeft: '8px',
                        fontSize: "20px",
                        fontWeight: "400",
                        color: "#000",
                        whiteSpace: 'nowrap',
                        paddingBottom: '5px'
                      }}
                    >
                      {master.action_method?.toLowerCase().includes("percentage")
                        || master.action_method?.toLowerCase() === "percent credit"
                        || master.action_method?.toLowerCase() === "percentage credit"
                        ? "%"
                        : "Pts"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRuleEngine;