import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchMasterAttributes,
  fetchSubAttributes,
  fetchMasterRewardOutcomes,
  fetchSubRewardOutcomes,
} from "./Confi/ruleEngineApi";

import { masterOperators } from "./OperatorsData";
import {baseURL} from "./baseurl/apiDomain"

const EditRuleEngine = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conditions, setConditions] = useState([
    {
      id: 1,
      masterAttribute: "",
      subAttribute: "",
      masterOperator: "",
      subOperator: "",
      condition_type: "",
      value: "",
      master_operator: "",
    },
  ]);

  const [ruleName, setRuleName] = useState("");
  const [displayRuleName, setDisplayRuleName] = useState("");
  const [masterAttributes, setMasterAttributes] = useState([]);
  const [selectedMasterAttribute, setSelectedMasterAttribute] = useState("");
  const [subAttributes, setSubAttributes] = useState([]);

  const [masterRewardOutcomes, setMasterRewardOutcomes] = useState([]);
  const [selectedMasterRewardOutcomes, setSelectedMasterRewardOutcomes] =
    useState({ id: "", name: "" });
  const [subRewardOutcomes, setSubRewardOutcomes] = useState([]);
  const [subRewardOutcomesnew, setsubRewardOutcomesnew] = useState([]);

  const [selectedMasterOperator, setSelectedMasterOperator] = useState("");
  const [subOperators, setSubOperators] = useState([]);
  const [selectedSubOperator, setSelectedSubOperator] = useState("");

  const [error, setError] = useState("");
  const [parameter, setParameter] = useState("");
  const [previousValue, setPreviousValue] = useState("");
  const [actions, setActions] = useState([]);
  const [idAdd, setIdAdd] = useState(null);
  const [subRewardOutcomesName, setsubRewardOutcomesName] = useState({
    id: "",
    name: "",
  });
  const [funId, setFunId] = useState(null);
  const [masterRewardOutcomesLockModal, setMasterRewardOutcomesLockModal] =
    useState({ id: "", name: "" });
  const [lockModel, setLockModel] = useState("");

  const formatFieldName = (fieldName) => {
    if (!fieldName) {
      return "";
    }
    return fieldName
      .replace(/_/g, " ")
      .replace(/::/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleMasterOperatorChange = (e) => {
    const selectedName = e.target.value;
    setSelectedMasterOperator(selectedName);

    const selectedMaster = masterOperators.find(
      (op) => op.name === selectedName
    );

    setSubOperators(selectedMaster ? selectedMaster.subOptions : []);

    setSelectedSubOperator("");
  };

  const token = localStorage.getItem("access_token");

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
        setIdAdd(data.id);
        setRuleName(data.name);
        setDisplayRuleName(data.display_rule_name);
        if (data.conditions) {
          console.log(data.conditions);
          setConditions(
            data.conditions.map((condition) => ({
              id: condition.id,
              masterAttribute: condition.model_name,
              subAttribute: condition.condition_attribute,
              subOperator: condition.operator,
              condition_type: condition.condition_type,
              value: condition.compare_value,
              master_operator: condition.master_operator,
            }))
          );
          console.log("set con:", conditions);
        }
        if (data.actions) {
          const parameters = data.actions
            .map((action) => action.parameters)
            .flat();
          setParameter(parameters);
          const lock_model_name = data.actions.map((action) => ({
            id: action.action_selected_model,
            name: action.lock_model_name,
          }));
          console.log("....master reward", lock_model_name);

          setMasterRewardOutcomesLockModal(
            lock_model_name[0] || {
              id: lock_model_name.id,
              name: lock_model_name.name,
            }
          );

          const action_method = data.actions.map((action) => ({
            id: action.rule_engine_available_function_id,
            name: action.action_method,
          }));

          console.log("Action Methods:", action_method);

          setsubRewardOutcomesName(
            action_method[0] || {
              id: action_method.id,
              name: action_method.name,
            }
          );
          console.log("sub action function id", subRewardOutcomesName);

          const action_ids = data.actions.map((action) => action.id).flat();
          console.log("Action IDs:", action_ids);

          setActions(action_ids);

          const functionId = data.actions[0]?.rule_engine_available_function_id;
          console.log("function id :", functionId);
          setFunId(functionId);

          const lock_model = data.actions[0]?.rule_engine_available_function_id;
          setLockModel(lock_model);
        }
      } catch (err) {
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchRule();
  }, [id]);

  const handleCancle = async () => {
    try {
      const data = await getRuleEngine(id);
      setIdAdd(data.id);
      setRuleName(data.name);
      setDisplayRuleName(data.display_rule_name);
      if (data.conditions) {
        console.log(data.conditions);
        setConditions(
          data.conditions.map((condition) => ({
            id: condition.id,
            masterAttribute: condition.model_name,
            subAttribute: condition.condition_attribute,
            subOperator: condition.operator,
            condition_type: condition.condition_type,
            value: condition.compare_value,
            master_operator: condition.master_operator,
          }))
        );
        console.log("set con:", conditions);
      }
      if (data.actions) {
        const parameters = data.actions
          .map((action) => action.parameters)
          .flat();
        setParameter(parameters);
        const lock_model_name = data.actions.map((action) => ({
          id: action.action_selected_model,
          name: action.lock_model_name,
        }));
        console.log("....master reward", lock_model_name);

        setMasterRewardOutcomesLockModal(
          lock_model_name[0] || { id: "", name: "" }
        );

        const action_method = data.actions.map((action) => ({
          id: action.rule_engine_available_function_id,
          name: action.action_method,
        }));

        console.log("Action Methods:", action_method);

        setSelectedMasterRewardOutcomes(
          action_method[0] || { id: "", name: "" }
        );
        setsubRewardOutcomesName(action_method[0] || { name: "" });
        console.log("sub action function id", subRewardOutcomesName);
        const action_ids = data.actions.map((action) => action.id).flat();
        console.log("Action IDs:", action_ids);

        setActions(action_ids);

        const functionId = data.actions[0]?.rule_engine_available_function_id;
        console.log("function id :", functionId);
        setFunId(functionId);

        const lock_model = data.actions[0]?.lock_model_name;
        console.log("lock model :", lock_model);
        setLockModel(lock_model);
      }
    } catch (err) {
      // setError(err.message);
    } finally {
      // setLoading(false);
    }
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
        setMasterAttributes(masterAttrs.master_attributes);

        const rewardOutcomes = await fetchMasterRewardOutcomes(
          companyId,
          activeStatus
        );
        setMasterRewardOutcomes(rewardOutcomes.master_reward_outcome);
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
    console.log(selectedIndex);

    if (selectedIndex !== -1) {
      try {
        const subAttrs = await fetchSubAttributes(selectedId);
        console.log(subAttrs.master_attributes[selectedIndex].sub_attributes);
        const selectedSubAttributes =
          subAttrs.master_attributes[selectedIndex].sub_attributes;
        setSubAttributes(selectedSubAttributes);
      } catch (error) {
        console.error("Error fetching sub attributes:", error);
      }
    } else {
      console.error("Selected ID not found in master attributes");
    }
  };

  const handleMasterSubRewardOutcomeChange = async (e) => {
    const selectedId = e.target.value;

    const selectedOption = e.target.selectedOptions[0];
    const selectedName = selectedOption.getAttribute("data-name");
    setSelectedMasterRewardOutcomes({
      id: selectedId,
      name: selectedName,
    });

    const selectedIndex = masterRewardOutcomes.findIndex(
      (attr) => attr.id === parseInt(selectedId)
    );
    console.log(selectedIndex);

    if (selectedIndex !== -1) {
      try {
        const subRewardOutcomes = await fetchSubRewardOutcomes(selectedId);
        console.log(
          subRewardOutcomes.master_reward_outcome[selectedIndex]
            .sub_reward_outcome
        );
        const selectedSubRewardOutcomes =
          subRewardOutcomes.master_reward_outcome[selectedIndex]
            .sub_reward_outcome;
        setSubRewardOutcomes(selectedSubRewardOutcomes);
      } catch (error) {
        console.error("Error fetching sub attributes:", error);
      }
    } else {
      console.error("Selected ID not found in master attributes");
    }
  };

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
        master_operator: "",
      },
    ]);
  };

  const handleEdit = async (id) => {
    if (!ruleName) {
      toast.error("Rule Name is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!displayRuleName) {
      toast.error("Display Rule Name is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    conditions.forEach((cond, index) => {
      setTimeout(() => {
        if (!cond.masterAttribute) {
          toast.error(`Condition ${index + 1}: Master Attribute is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (!cond.subAttribute) {
          toast.error(`Condition ${index + 1}: Sub Attribute is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (!cond.master_operator) {
          toast.error(`Condition ${index + 1}: Master Operator is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (!cond.subOperator) {
          toast.error(`Condition ${index + 1}: Sub Operator is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (!cond.value) {
          toast.error(`Condition ${index + 1}: Value is required.`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }, index * 3500);
    });

    setTimeout(() => {
      if (!selectedMasterRewardOutcomes.name) {
        toast.error("Master Reward Outcome is required.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }, conditions.length * 3500);

    const isInvalid = conditions.some(
      (cond) =>
        !cond.masterAttribute ||
        !cond.subAttribute ||
        !cond.master_operator ||
        !cond.subOperator ||
        !cond.value ||
        cond.value === previousValue
    );

    if (isInvalid) {
      return;
    }

    const values = conditions.map((cond) => cond.value);
    const uniqueValues = new Set();
    for (const value of values) {
      if (value.trim() === "") {
        return;
      }
      uniqueValues.add(value);
    }

    if (isNaN(parameter)) {
      setError("Parameter value must be a valid number.");
      return;
    }

    if (uniqueValues.size !== values.length) {
      setError("Each condition value must be unique.");
      return;
    }

    const newValue = conditions.map((cond) => cond.value);
    setPreviousValue(newValue);

    const data = {
      rule_engine_rule: {
        id: idAdd,
        name: ruleName,
        display_rule_name: displayRuleName,
        description: "This is a description of the sample rule.",
        loyalty_type_id: sessionStorage.getItem("selectedId"),
        rule_engine_conditions_attributes: conditions.map((condition) => ({
          id: condition.id,
          condition_attribute: condition.subAttribute || "",
          operator: condition.subOperator || "",
          compare_value: condition.value || "",
          condition_selected_model: Number(condition.masterAttribute) || 1,
          condition_type: condition.condition_type || "",
          master_operator: condition.master_operator || "",
        })),

        rule_engine_actions_attributes: [
          {
            id: actions[0],
            lock_model_name:
              selectedMasterRewardOutcomes.name || lockModel || "",
            parameters: [Number(parameter) || ""],
            rule_engine_available_function_id:
              Number(subRewardOutcomesnew) || funId || "",
            action_selected_model:
              Number(
                selectedMasterRewardOutcomes.id ||
                  masterRewardOutcomesLockModal.id
              ) || "",
          },
        ],
      },
    };

    console.log("Request Payload:", JSON.stringify(data, null, 2));
    console.log("id...", id);
    try {
      if (
        ruleName !== "" &&
        parameter !== "" &&
        selectedMasterRewardOutcomes !== "" &&
        conditions !== null
      ) {
        const response = await fetch(
          `${baseURL}rule_engine/rules/loyalty_re_update.json?access_token=${token}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          navigate("/setup-member/rule-engine");
          console.log("Data created successfully:", responseData);
        } else {
          const errorData = await response.json();
          setError(`Please select master and sub reward outcome.`);
          console.error("Submission error:", errorData);
        }
      }
    } catch (error) {
      setError("Failed to create Rule Engine. Please try again.");
      console.error("Submission error:", error);
    }
  };

  const removeCondition = (id) => {
    const updatedConditions = conditions.filter(
      (condition) => condition.id !== id
    );
    setConditions(updatedConditions);
  };

  const renderCondition = (condition, index) => (
    <div key={condition.id} className="SetRuleCard">
      <div>
        <h6 className="mt-3">
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Condition {condition.id}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil-square mb-1 ms-3 text-body-secondary"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fillRule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
            {index > 0 && (
              <button
                onClick={() => removeCondition(condition.id)}
                className="ms-3"
                style={{ border: "none", backgroundColor: "white" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 1 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 1 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>
            )}
          </span>
        </h6>
      </div>
      {index > 0 && (
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
                defaultChecked
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index ? { ...cond, condition_type: "AND" } : cond
                  );
                  setConditions(updatedConditions);
                }}
                checked={condition.condition_type === "AND"}
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
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index ? { ...cond, condition_type: "OR" } : cond
                  );
                  setConditions(updatedConditions);
                }}
                checked={condition.condition_type === "OR"}
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
              className="badge setRuleCard"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#E95420",
                backgroundColor: "#E954202E",
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
                className="p-1 mt-1 mb-1"
                style={{ fontSize: "12px", fontWeight: "400" }}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, masterAttribute: e.target.value }
                      : cond
                  );
                  setConditions(updatedConditions);
                  handleMasterAttributeChange(e);
                }}
                value={condition.masterAttribute}
              >
                <option value="">{condition.masterAttribute}</option>
                <option value="" disabled>
                  Select Master Attribute{" "}
                </option>
                {masterAttributes.map((attr) => (
                  <option key={attr.id} value={attr.id}>
                    {attr.display_name}
                  </option>
                ))}
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
                className="p-1 mt-1 mb-1"
                style={{ fontSize: "12px", fontWeight: "400" }}
                disabled={!condition.masterAttribute}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, subAttribute: e.target.value }
                      : cond
                  );
                  setConditions(updatedConditions);
                }}
                value={condition.subAttribute}
              >
                <option value="">
                  {formatFieldName(condition.subAttribute)}
                </option>
                <option value="" disabled>
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

        <div className="mt-3">
          <h4>
            <span
              className="badge setRuleCard"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#E95420",
                backgroundColor: "#E954202E",
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
                className="p-1 mt-1 mb-1"
                style={{ fontSize: "12px", fontWeight: "400" }}
                value={condition.master_operator}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, master_operator: e.target.value }
                      : cond
                  );
                  setConditions(updatedConditions);
                  handleMasterOperatorChange(e);
                }}
              >
                <option value="">{condition.master_operator}</option>
                <option value="" disabled>
                  Select Master Operator{" "}
                </option>
                {masterOperators.map((op) => (
                  <option key={op.id} value={op.name}>
                    {op.name}
                  </option>
                ))}
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
                className="p-1 mt-1 mb-1"
                style={{ fontSize: "12px", fontWeight: "400" }}
                disabled={!condition.master_operator}
                value={condition.subOperator}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index
                      ? { ...cond, subOperator: e.target.value }
                      : cond
                  );
                  setConditions(updatedConditions);
                }}
              >
                <option value="">
                  {formatFieldName(condition.subOperator)}
                </option>
                <option value="" disabled>
                  Select Sub Operator{" "}
                </option>
                {subOperators.map((subOp) => (
                  <option key={subOp.id} value={subOp.value}>
                    {subOp.name}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>
        </div>

        <div className="mt-3">
          <h4>
            <span
              className="badge setRuleCard"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#E95420",
                backgroundColor: "#E954202E",
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
                className="p-1 mt-1 mb-1"
                style={{ fontSize: "12px", fontWeight: "400" }}
                placeholder="Enter Point Value"
                value={condition.value}
                onChange={(e) => {
                  const updatedConditions = conditions.map((cond, idx) =>
                    idx === index ? { ...cond, value: e.target.value } : cond
                  );
                  setConditions(updatedConditions);
                }}
              />
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-100">
        <div className="module-data-section mt-2">
          <p className="pointer">
            <Link to='/rule-engine' >
              <span>Rule Engine</span>
            </Link>{" "}
            &gt; Edit Rule
          </p>
          <h5 className="mb-3">
            <span className="title" style={{ fontSize: '20px', fontWeight: '600' }}>Edit Rule</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              fill="currentColor"
              className="bi bi-pencil-square mb-2 ms-3 text-body-secondary"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fillRule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
          </h5>
          <div className="go-shadow me-3">
            <div className="row ms-1">
              <fieldset className="border col-md-11 m-2 col-sm-11">
                <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                  Rule Name<span>*</span>
                </legend>
                <input
                  type="text"
                  placeholder="Enter Rule Name"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="mt-1 mb-1"
                  style={{ fontSize: '12px', fontWeight: '400' }}
                />
              </fieldset>
              <fieldset className="border col-md-11 m-2 col-sm-11">
                <legend className="float-none" style={{ fontSize: '14px', fontWeight: '400' }}>
                  Display Rule Name<span>*</span>
                </legend>
                <input
                  type="text"
                  placeholder="Enter Display Rule Name"
                  value={displayRuleName}
                  onChange={(e) => setDisplayRuleName(e.target.value)}
                  className="mt-1 mb-1"
                  style={{ fontSize: '12px', fontWeight: '400' }}
                />
              </fieldset>
            </div>
          </div>

          <div className="main-rule">
            {conditions.map(renderCondition)}

            <button
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
            </button>

            <div className="mt-3">
              <h4>
                <span
                  className="badge setRuleCard"
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#E95420",
                    backgroundColor: "#E954202E",
                  }}
                >
                  THEN
                </span>
              </h4>
              <div className="row ms-1 mt-2">
                <fieldset className="border  col-md-3 m-2 col-sm-11">
                  <legend
                    className="float-none"
                    style={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Master Reward Outcome<span>*</span>
                  </legend>
                  <select
                    required=""
                    className="p-1 mt-1 mb-1"
                    style={{ fontSize: "12px", fontWeight: "400" }}
                    onChange={handleMasterSubRewardOutcomeChange}
                    value={
                      selectedMasterRewardOutcomes.id ||
                      masterRewardOutcomesLockModal.id ||
                      ""
                    }
                  >
                    <option value="">
                      {formatFieldName(masterRewardOutcomesLockModal.name)}
                    </option>
                    <option value="" disabled>
                      Select Master Reward Outcome
                    </option>
                    {masterRewardOutcomes.map((reward) => (
                      <option
                        key={reward.id}
                        value={reward.id}
                        data-name={reward.lock_model_name}
                      >
                        {reward.display_name}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <div className="col-md-1 d-flex justify-content-center align-items-center">
                  <h4>&</h4>
                </div>
                <fieldset className="border  col-md-3 m-2 col-sm-11">
                  <legend
                    className="float-none"
                    style={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Sub Reward Outcome<span>*</span>
                  </legend>
                  <select
                    required=""
                    className="p-1 mt-1 mb-1"
                    style={{ fontSize: "12px", fontWeight: "400" }}
                    disabled={!selectedMasterRewardOutcomes}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      console.log(selectedId);
                      setsubRewardOutcomesnew(selectedId);
                    }}
                    value={subRewardOutcomesnew || ""}
                  >
                    <option value="">
                      {formatFieldName(subRewardOutcomesName.name)}
                    </option>

                    <option value="" disabled>
                      Select Sub Reward Outcome
                    </option>

                    {subRewardOutcomes.map((reward) => (
                      <option
                        key={reward.id}
                        value={reward.id}
                      >
                        {reward.display_name}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <fieldset className="border col-md-3 m-2 col-sm-11 ">
                  <legend
                    className="float-none"
                    style={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Parameter
                  </legend>
                  <input
                    type="text"
                    placeholder="Enter Parameter Value"
                    value={parameter}
                    onChange={(e) => setParameter(e.target.value)}
                    className="mt-1 mb-1"
                    style={{ fontSize: "12px", fontWeight: "400" }}
                  />
                </fieldset>
              </div>
            </div>
          </div>

          {error && (
            <div className="error" style={{ color: "red" }}>
              {error}
            </div>
          )}

          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                className="purple-btn1 w-100"
                onClick={() => handleEdit(id)}
              >
                Submit
              </button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn2 w-100" onClick={handleCancle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditRuleEngine;