import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft, X } from "lucide-react";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Tier name is required")
    .test('unique-name', 'Tier name already exists.', async function(value) {
      if (!value) return true;
      
      try {
        const storedValue = sessionStorage.getItem("selectedId");
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/loyalty/tiers.json?q[loyalty_type_id_eq]=${storedValue}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response.data) {
          const existingTier = response.data.find(tier => 
            tier.name && tier.name.toLowerCase() === value.toLowerCase()
          );
          
          if (existingTier) return false;
        }
        
        const { tiers } = this.parent;
        if (tiers && tiers.length > 0) {
          const duplicateCount = tiers.filter(tier => 
            tier.name && tier.name.toLowerCase() === value.toLowerCase()
          ).length;
          
          return duplicateCount === 0;
        }
        
        return true;
      } catch (error) {
        console.error("Error checking tier name:", error);
        return true;
      }
    }),
  exit_points: Yup.number()
    .required("Exit points are required")
    .positive("Exit points must be a positive number"),
  multipliers: Yup.number()
    .required("Multipliers are required")
    .positive("Multipliers must be a positive number"),
  welcome_bonus: Yup.number()
    .required("Welcome bonus is required")
    .positive("Welcome bonus must be a positive number"),
  point_type: Yup.string().required("Point type is required"),
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

const NewTier = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [step, setStep] = useState(1);
  const [timeframe, setTimeframe] = useState("");
  const [timeframeError, setTimeframeError] = useState("");
  const navigate = useNavigate();

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
      
      const existingTiersResponse = await axios.get(
        `${baseURL}/loyalty/tiers.json?q[loyalty_type_id_eq]=${storedValue}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
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

      const token = localStorage.getItem("access_token");
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
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {step === 1 ? (
          <>
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
                <span className="text-gray-400">Tiers</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#C72030] font-medium">Create</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TIER SETTING</h1>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Point Accumulation Timeframe</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Establish how members enter into higher tiers on points earning and time frame.
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => handleTimeframeChange("lifetime")}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      timeframe === "lifetime"
                        ? "border-[#8B0203] bg-[#8B020308]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        timeframe === "lifetime" ? "border-[#8B0203]" : "border-gray-300"
                      }`}>
                        {timeframe === "lifetime" && (
                          <div className="w-3 h-3 rounded-full bg-[#8B0203]" />
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 mb-1">Lifetime</h4>
                        <p className="text-sm text-gray-600">
                          Members accumulate points throughout their lifetime and tier progression is permanent.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTimeframeChange("yearly")}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      timeframe === "yearly"
                        ? "border-[#8B0203] bg-[#8B020308]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        timeframe === "yearly" ? "border-[#8B0203]" : "border-gray-300"
                      }`}>
                        {timeframe === "yearly" && (
                          <div className="w-3 h-3 rounded-full bg-[#8B0203]" />
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 mb-1">Rolling Year</h4>
                        <p className="text-sm text-gray-600">
                          Points reset annually and tier status is re-evaluated each year based on current points.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {timeframeError && (
                  <p className="text-red-500 text-sm mb-4">{timeframeError}</p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium"
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/setup-member/loyalty-tiers-list")}
                    className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Header with Back Button and Breadcrumbs */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <button
                  onClick={() => setStep(1)}
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
                <span className="text-[#C72030] font-medium">New Tier</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CREATE NEW TIER</h1>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Tier Details</h3>
              </div>
              <div className="p-6">
                <Formik
                  initialValues={{
                    name: "",
                    exit_points: "",
                    multipliers: "",
                    welcome_bonus: "",
                    point_type: timeframe,
                    tiers: [],
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, isSubmitting }) => (
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Tier Name */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Tier Name
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            name="name"
                            placeholder="Enter tier name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                          />
                          <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Exit Points */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Exit Points
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            name="exit_points"
                            type="number"
                            placeholder="Enter exit points"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                          />
                          <ErrorMessage name="exit_points" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Multipliers */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Multipliers
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            name="multipliers"
                            type="number"
                            placeholder="Enter multipliers"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                          />
                          <ErrorMessage name="multipliers" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Welcome Bonus */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Welcome Bonus
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            name="welcome_bonus"
                            type="number"
                            placeholder="Enter welcome bonus"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                          />
                          <ErrorMessage name="welcome_bonus" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                      </div>

                      {/* Additional Tiers */}
                      <FieldArray name="tiers">
                        {({ remove, push }) => (
                          <div className="space-y-4 mb-6">
                            {values.tiers.length > 0 && (
                              <h4 className="text-md font-semibold text-gray-900 mb-4">Additional Tiers</h4>
                            )}
                            {values.tiers.map((tier, index) => (
                              <div key={index} className="relative p-6 border border-gray-200 rounded-lg bg-gray-50">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                  title="Remove tier"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Tier Name<span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <Field
                                      name={`tiers[${index}].name`}
                                      placeholder="Enter tier name"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                                    />
                                    <ErrorMessage name={`tiers[${index}].name`} component="div" className="text-red-500 text-xs mt-1" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Exit Points<span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <Field
                                      name={`tiers[${index}].exit_points`}
                                      type="number"
                                      placeholder="Enter exit points"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                                    />
                                    <ErrorMessage name={`tiers[${index}].exit_points`} component="div" className="text-red-500 text-xs mt-1" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Multipliers<span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <Field
                                      name={`tiers[${index}].multipliers`}
                                      type="number"
                                      placeholder="Enter multipliers"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                                    />
                                    <ErrorMessage name={`tiers[${index}].multipliers`} component="div" className="text-red-500 text-xs mt-1" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Welcome Bonus<span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <Field
                                      name={`tiers[${index}].welcome_bonus`}
                                      type="number"
                                      placeholder="Enter welcome bonus"
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                                    />
                                    <ErrorMessage name={`tiers[${index}].welcome_bonus`} component="div" className="text-red-500 text-xs mt-1" />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => push({ name: "", exit_points: "", multipliers: "", welcome_bonus: "" })}
                              className="flex items-center gap-2 px-4 py-2 text-[#8B0203] border border-[#8B0203] rounded-lg hover:bg-[#8B020308] transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                              </svg>
                              Add New Tier
                            </button>
                          </div>
                        )}
                      </FieldArray>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </span>
                          ) : (
                            "Submit"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/setup-member/loyalty-tiers-list")}
                          disabled={isSubmitting}
                          className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewTier;
