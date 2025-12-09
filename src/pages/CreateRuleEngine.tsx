import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchMasterAttributes,
  fetchSubAttributes,
  fetchMasterRewardOutcomes,
  fetchSubRewardOutcomes,
} from '../config/ruleEngineApi';
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft, X, Plus } from "lucide-react";
import { masterOperators } from "./OperatorsData";

const CreateRuleEngine = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
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

  const token = localStorage.getItem("access_token");

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
  const [selectedSubRewardOutcome, setSelectedSubRewardOutcome] =
    useState(null);

  const [selectedMasterOperator, setSelectedMasterOperator] = useState("");
  const [subOperators, setSubOperators] = useState([]);
  const [selectedSubOperator, setSelectedSubOperator] = useState("");

  const [error, setError] = useState("");
  const [parameter, setParameter] = useState("");
  const [previousValue, setPreviousValue] = useState("");

  const handleMasterOperatorChange = (e) => {
    const selectedName = e.target.value;
    setSelectedMasterOperator(selectedName);

    const selectedMaster = masterOperators.find(
      (op) => op.name === selectedName
    );

    setSubOperators(selectedMaster ? selectedMaster.subOptions : []);

    setSelectedSubOperator("");
  };

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === "uat-loyalty.lockated.com") {
      const staticMasterAttributes = [
        {
          id: 1,
          display_name: "User Actions",
          sub_attributes: [
            { id: 101, attribute_name: "Referral", display_name: "Referral" },
            {
              id: 102,
              attribute_name: "App Download",
              display_name: "App Download",
            },
            {
              id: 103,
              attribute_name: "Social Media Interactions",
              display_name: "Social Media Interactions",
            },
            {
              id: 104,
              attribute_name: "Purchases made",
              display_name: "Purchases made",
            },
            {
              id: 105,
              attribute_name: "Reviews or feedback submission",
              display_name: "Reviews or feedback submission",
            },
            {
              id: 106,
              attribute_name: "Adding members",
              display_name: "Adding members",
            },
          ],
        },
        {
          id: 2,
          display_name: "Transaction events",
          sub_attributes: [
            {
              id: 201,
              attribute_name: "Total purchase value",
              display_name: "Total purchase value",
            },
            {
              id: 202,
              attribute_name: "Transaction frequency",
              display_name: "Transaction frequency",
            },
            {
              id: 203,
              attribute_name: "First-time purchase",
              display_name: "First-time purchase",
            },
            {
              id: 204,
              attribute_name: "Predefined product/category purchase",
              display_name: "Predefined product/category purchase",
            },
          ],
        },
        {
          id: 3,
          display_name: "Time based events",
          sub_attributes: [
            {
              id: 301,
              attribute_name: "Event completion before/after a date",
              display_name: "Event completion before/after a date",
            },
            {
              id: 302,
              attribute_name: "Inactivity for a specified period",
              display_name: "Inactivity for a specified period",
            },
            {
              id: 303,
              attribute_name: "Anniversary/birthday triggers",
              display_name: "Anniversary/birthday triggers",
            },
            {
              id: 304,
              attribute_name: "Time-limited offers",
              display_name: "Time-limited offers",
            },
          ],
        },
        {
          id: 4,
          display_name: "User demographics/segments",
          sub_attributes: [
            {
              id: 401,
              attribute_name: "Membership tier (Bronze, Silver, Gold)",
              display_name: "Membership tier (Bronze, Silver, Gold)",
            },
            {
              id: 402,
              attribute_name: "Customer location/region",
              display_name: "Customer location/region",
            },
            {
              id: 403,
              attribute_name: "Targeted offers for specific user segments",
              display_name: "Targeted offers for specific user segments",
            },
            {
              id: 404,
              attribute_name: "Customer age/gender",
              display_name: "Customer age/gender",
            },
          ],
        },
        {
          id: 5,
          display_name: "Engagement/Behaviour",
          sub_attributes: [
            {
              id: 501,
              attribute_name: "Login frequency",
              display_name: "Login frequency",
            },
            {
              id: 502,
              attribute_name: "App usage frequency",
              display_name: "App usage frequency",
            },
            {
              id: 503,
              attribute_name: "Cart abandonment",
              display_name: "Cart abandonment",
            },
          ],
        },
        {
          id: 6,
          display_name: "Milestones",
          sub_attributes: [
            {
              id: 601,
              attribute_name: "X transactions in a month",
              display_name: "X transactions in a month",
            },
            {
              id: 602,
              attribute_name: "Y referrals completed",
              display_name: "Y referrals completed",
            },
            {
              id: 603,
              attribute_name: "Z amount spent in a specific category",
              display_name: "Z amount spent in a specific category",
            },
          ],
        },
        {
          id: 7,
          display_name: "Tier-based",
          sub_attributes: [
            {
              id: 701,
              attribute_name: "Points required for upgrading tier",
              display_name: "Points required for upgrading tier",
            },
            {
              id: 702,
              attribute_name: "Minimum conditions for downgrading tier",
              display_name: "Minimum conditions for downgrading tier",
            },
          ],
        },
      ];
      setMasterAttributes(staticMasterAttributes);

      const staticRewardOutcomes = [
        {
          id: 1,
          display_name: "Points-Based Rewards",
          lock_model_name: "Points-Based Rewards",
          sub_reward_outcome: [
            { id: 101, display_name: "Fixed points" },
            { id: 102, display_name: "Variable points" },
            { id: 103, display_name: "Multiplier" },
          ],
        },
        {
          id: 2,
          display_name: "Discounts/Coupon",
          lock_model_name: "Discounts/Coupon",
          sub_reward_outcome: [
            { id: 201, display_name: "Fixed Discount" },
            { id: 202, display_name: "Percentage Discount" },
            { id: 203, display_name: "Coupon Code" },
          ],
        },
        {
          id: 3,
          display_name: "Tier Promotion",
          lock_model_name: "Tier Promotion",
          sub_reward_outcome: [
            { id: 301, display_name: "Tier Upgrade" },
            { id: 302, display_name: "Tier Downgrade" },
          ],
        },
        {
          id: 4,
          display_name: "Product/Service Offers",
          lock_model_name: "Product/Service Offers",
          sub_reward_outcome: [
            { id: 401, display_name: "Exclusive Access" },
            { id: 402, display_name: "Free Shipping" },
          ],
        },
        {
          id: 5,
          display_name: "Milestone-Based Rewards",
          lock_model_name: "Milestone-Based Rewards",
          sub_reward_outcome: [
            { id: 501, display_name: "Achievement Badge" },
            { id: 502, display_name: "Bonus Reward" },
          ],
        },
        {
          id: 6,
          display_name: "Cashback",
          lock_model_name: "Cashback",
          sub_reward_outcome: [
            { id: 601, display_name: "Fixed Cashback" },
            { id: 602, display_name: "Percentage Cashback" },
          ],
        },
      ];
      setMasterRewardOutcomes(staticRewardOutcomes);
    } else {
      const getData = async () => {
        try {
          const companyId = 44;
          const activeStatus = true;
          const masterAttrs = await fetchMasterAttributes(
            companyId,
            activeStatus
          );
          setMasterAttributes(masterAttrs.master_attributes || []);

          const rewardOutcomes = await fetchMasterRewardOutcomes(
            companyId,
            activeStatus
          );
          console.log("Reward Outcomes:", rewardOutcomes);
          setMasterRewardOutcomes(rewardOutcomes.master_reward_outcome || []);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };

      getData();
    }
  }, []);

  const handleMasterAttributeChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedMasterAttribute(selectedId);

    const hostname = window.location.hostname;
    if (hostname === "uat-loyalty.lockated.com") {
      const selectedMaster = masterAttributes.find(
        (attr) => attr.id === parseInt(selectedId)
      );
      if (selectedMaster) {
        setSubAttributes(selectedMaster.sub_attributes || []);
      } else {
        setSubAttributes([]);
      }
      return;
    }

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

    const hostname = window.location.hostname;
    if (hostname === "uat-loyalty.lockated.com") {
      const selectedMaster = masterRewardOutcomes.find(
        (reward) => reward.id === parseInt(selectedId)
      );
      if (selectedMaster) {
        setSubRewardOutcomes(selectedMaster.sub_reward_outcome || []);
      } else {
        setSubRewardOutcomes([]);
      }
      return;
    }

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

  const handleSubmit = async () => {
    if (!ruleName) {
      toast.error("Rule Name is required.");
      return;
    }
    
    if (!displayRuleName) {
      toast.error("Display Rule Name is required.");
      return;
    }

    for (let i = 0; i < conditions.length; i++) {
      const cond = conditions[i];
      if (!cond.masterAttribute) {
        toast.error(`Condition ${i + 1}: Master Attribute is required.`, {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      if (!cond.subAttribute) {
        toast.error(`Condition ${i + 1}: Sub Attribute is required.`, {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      if (!cond.master_operator) {
        toast.error(`Condition ${i + 1}: Master Operator is required.`, {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      if (!cond.subOperator) {
        toast.error(`Condition ${i + 1}: Sub Operator is required.`, {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      if (!cond.value) {
        toast.error(`Condition ${i + 1}: Value is required.`, {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    }

    if (!selectedMasterRewardOutcomes.name) {
      toast.error("Master Reward Outcome is required.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (isNaN(parameter) || parameter.trim() === "") {
      setError("Parameter value must be a valid number.");
      return;
    }

    const conditionKeys = conditions.map(
      (cond) =>
        `${cond.subAttribute || ""}|${cond.subOperator || ""}|${
          cond.value || ""
        }|${cond.masterAttribute || ""}|${cond.master_operator || ""}`
    );

    const uniqueConditionKeys = new Set(conditionKeys);

    if (uniqueConditionKeys.size !== conditions.length) {
      const duplicates = conditionKeys.filter(
        (key, index) => conditionKeys.indexOf(key) !== index
      );
      setError("Duplicate condition(s) found based on 5-field combination.");
      console.warn("❌ Duplicate condition keys:", [...new Set(duplicates)]);
      console.log("All condition keys:", conditionKeys);
      return;
    } else {
      console.log("✅ All condition combinations are unique.");
    }

    const data = {
      rule_engine_rule: {
        name: ruleName,
        display_rule_name: displayRuleName,
        description: "This is a description of the sample rule.",
        loyalty_type_id: sessionStorage.getItem("selectedId"),
        rule_engine_conditions_attributes: conditions.map((condition) => ({
          condition_attribute: condition.subAttribute || "",
          operator: condition.subOperator || "",
          compare_value: condition.value || "",
          condition_selected_model: Number(condition.masterAttribute) || 1,
          condition_type: condition.condition_type || "",
          master_operator: condition.master_operator || "",
        })),
        rule_engine_actions_attributes: [
          {
            lock_model_name: selectedMasterRewardOutcomes.name || "",
            parameters: [Number(parameter) || ""],
            rule_engine_available_function_id: subRewardOutcomesnew || "",
            action_selected_model:
              Number(selectedMasterRewardOutcomes.id) || "",
          },
        ],
      },
    };

    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/rule_engine/rules/loyalty_re`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success("Rule created successfully!");
        setTimeout(() => {
          navigate("/setup-member/rule-engine-list");
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to create Rule Engine: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("Failed to create Rule Engine. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeCondition = (id) => {
    const updatedConditions = conditions.filter(
      (condition) => condition.id !== id
    );
    setConditions(updatedConditions);
  };

  const renderCondition = (condition, index) => (
    <div key={condition.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50 relative">
      {/* Condition Header */}
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-sm font-semibold text-gray-900">
          Condition {condition.id}
        </h5>
        {index > 0 && (
          <button
            type="button"
            onClick={() => removeCondition(condition.id)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* AND/OR Toggle */}
      {index > 0 && (
        <div className="flex gap-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`condition-type-${index}`}
              checked={condition.condition_type === "AND"}
              onChange={() => {
                const updatedConditions = conditions.map((cond, idx) =>
                  idx === index ? { ...cond, condition_type: "AND" } : cond
                );
                setConditions(updatedConditions);
              }}
              className="w-4 h-4 text-[#8B0203] focus:ring-[#8B0203]"
            />
            <span className="text-sm font-medium text-gray-700">AND</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`condition-type-${index}`}
              checked={condition.condition_type === "OR"}
              onChange={() => {
                const updatedConditions = conditions.map((cond, idx) =>
                  idx === index ? { ...cond, condition_type: "OR" } : cond
                );
                setConditions(updatedConditions);
              }}
              className="w-4 h-4 text-[#8B0203] focus:ring-[#8B0203]"
            />
            <span className="text-sm font-medium text-gray-700">OR</span>
          </label>
        </div>
      )}

      {/* IF Section */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded-full mb-3">
          IF
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Master Attribute<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={condition.masterAttribute}
              onChange={(e) => {
                const updatedConditions = conditions.map((cond, idx) =>
                  idx === index ? { ...cond, masterAttribute: e.target.value } : cond
                );
                setConditions(updatedConditions);
                handleMasterAttributeChange(e);
              }}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
            >
              <option value="">Select Master Attribute</option>
              {masterAttributes.map((attr) => (
                <option key={attr.id} value={attr.id}>
                  {attr.display_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Attribute<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={condition.subAttribute}
              onChange={(e) => {
                const updatedConditions = conditions.map((cond, idx) =>
                  idx === index ? { ...cond, subAttribute: e.target.value } : cond
                );
                setConditions(updatedConditions);
              }}
              disabled={!condition.masterAttribute || loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all disabled:bg-gray-100"
            >
              <option value="">Select Sub Attribute</option>
              {subAttributes.map((subAttr) => (
                <option key={subAttr.id} value={subAttr.attribute_name}>
                  {subAttr.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Operator Section */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded-full mb-3">
          OPERATOR
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Master Operator<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={condition.master_operator}
              onChange={(e) => {
                const updatedConditions = conditions.map((cond, idx) =>
                  idx === index ? { ...cond, master_operator: e.target.value } : cond
                );
                setConditions(updatedConditions);
                handleMasterOperatorChange(e);
              }}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
            >
              <option value="">Select Master Operator</option>
              {masterOperators.map((op) => (
                <option key={op.id} value={op.name}>
                  {op.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Operator<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={condition.subOperator}
              onChange={(e) => {
                const updatedConditions = conditions.map((cond, idx) =>
                  idx === index ? { ...cond, subOperator: e.target.value } : cond
                );
                setConditions(updatedConditions);
              }}
              disabled={!condition.master_operator || loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all disabled:bg-gray-100"
            >
              <option value="">Select Sub Operator</option>
              {subOperators.map((subOp) => (
                <option key={subOp.id} value={subOp.value}>
                  {subOp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Value Section */}
      <div>
        <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded-full mb-3">
          VALUE
        </span>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Value<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Point Value"
            value={condition.value}
            onChange={(e) => {
              const updatedConditions = conditions.map((cond, idx) =>
                idx === index ? { ...cond, value: e.target.value } : cond
              );
              setConditions(updatedConditions);
            }}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {/* Header with Back Button and Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Loyalty</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Rule Engine</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE NEW RULE</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Rule Details</h3>
          </div>
          <div className="p-6">
            {/* Rule Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rule Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Rule Name"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Display Rule Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Display Rule Name"
                  value={displayRuleName}
                  onChange={(e) => setDisplayRuleName(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-6">
              <h4 className="text-md font-semibold text-gray-900">Set Rule Conditions</h4>
              
              {conditions.map((condition, index) => renderCondition(condition, index))}

              {/* Add Condition Button */}
              <button
                type="button"
                onClick={addCondition}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-[#8B0203] border border-[#8B0203] rounded-lg hover:bg-[#8B020308] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Additional Condition
              </button>
            </div>

            {/* THEN Section */}
            <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded-full mb-4">
                THEN
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Master Reward Outcome<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={selectedMasterRewardOutcomes.id || ""}
                    onChange={handleMasterSubRewardOutcomeChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Master Reward Outcome</option>
                    {masterRewardOutcomes.map((reward) => (
                      <option key={reward.id} value={reward.id} data-name={reward.lock_model_name}>
                        {reward.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub Reward Outcome<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={subRewardOutcomesnew}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setsubRewardOutcomesnew(selectedId);
                      const selectedSubReward = subRewardOutcomes.find(
                        (reward) => reward.id === parseInt(selectedId)
                      );
                      setSelectedSubRewardOutcome(selectedSubReward);
                    }}
                    disabled={!selectedMasterRewardOutcomes.id || loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all disabled:bg-gray-100"
                  >
                    <option value="">Select Sub Reward Outcome</option>
                    {subRewardOutcomes.map((reward) => (
                      <option key={reward.id} value={reward.id}>
                        {reward.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Parameter<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Parameter Value"
                      value={parameter}
                      onChange={(e) => setParameter(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all pr-12"
                    />
                    {selectedSubRewardOutcome?.display_name && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                        {selectedSubRewardOutcome.display_name.toLowerCase().includes("percentage")
                          ? "%"
                          : selectedSubRewardOutcome.display_name.toLowerCase().includes("credit")
                          ? "Pts"
                          : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRuleName("");
                  setDisplayRuleName("");
                  setConditions([{
                    id: 1,
                    masterAttribute: "",
                    subAttribute: "",
                    masterOperator: "",
                    subOperator: "",
                    condition_type: "",
                    value: "",
                    master_operator: "",
                  }]);
                  setSelectedMasterRewardOutcomes({ id: "", name: "" });
                  setSubRewardOutcomes([]);
                  setParameter("");
                  setSelectedSubRewardOutcome(null);
                }}
                disabled={loading}
                className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRuleEngine;