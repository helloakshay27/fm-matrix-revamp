import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trophy,
  Calendar,
  Clock,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Box,
  Typography,
  Switch,
} from "@mui/material";

interface ContestStep {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface OfferData {
  id: string;
  offerTitle: string;
  couponCode: string;
  displayName: string;
  partner: string;
  winningProbability: string;
  probabilityOutOf: string;
  offerDescription: string;
  bannerImage: File | null;
  bannerImageName: string;
}

export const CreateContestPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdContestId, setCreatedContestId] = useState<number | null>(null);

  // Helper function to create a default offer object
  const createDefaultOffer = (): OfferData => ({
    id: Date.now().toString() + Math.random(),
    offerTitle: "",
    couponCode: "",
    displayName: "",
    partner: "",
    winningProbability: "",
    probabilityOutOf: "",
    offerDescription: "",
    bannerImage: null,
    bannerImageName: "",
  });

  // Helper function to get initial offers count based on contest type
  const getInitialOffersCount = (type: string): number => {
    return type === "Spin" ? 4 : 1;
  };

  // Form data ────────────────────────────────────────────────────────────────
  const [contestName, setContestName] = useState("");
  const [contestDescription, setContestDescription] = useState("");
  const [contestType, setContestType] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Reset redemption document when contest type changes away from Scratch
  // Also adjust offers count based on contest type
  const handleContestTypeChange = (newType: string) => {
    setContestType(newType);

    // Reset redemption text for non-Scratch types
    if (newType !== "Scratch") {
      setRedemptionText("");
    }

    // Adjust offers count based on contest type
    const requiredCount = getInitialOffersCount(newType);
    const currentCount = offers.length;

    if (currentCount < requiredCount) {
      // Add more offers to reach required count
      const newOffers = Array.from(
        { length: requiredCount - currentCount },
        () => createDefaultOffer()
      );
      setOffers([...offers, ...newOffers]);
    } else if (currentCount > requiredCount) {
      // Keep only the required number of offers
      setOffers(offers.slice(0, requiredCount));
    }
  };

  // Offers
  const [offers, setOffers] = useState<OfferData[]>([createDefaultOffer()]);

  // Validity
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [usersCap, setUsersCap] = useState("");
  const [attemptsRequired, setAttemptsRequired] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Documents - now text inputs instead of file uploads
  const [termsText, setTermsText] = useState("");
  const [redemptionText, setRedemptionText] = useState("");

  const steps: ContestStep[] = [
    { id: 1, title: "Basic Info", completed: completedSteps.includes(1), active: currentStep === 1 },
    { id: 2, title: "Offers & Vouchers", completed: completedSteps.includes(2), active: currentStep === 2 },
    { id: 3, title: "Validity & Status", completed: completedSteps.includes(3), active: currentStep === 3 },
    { id: 4, title: "Terms & Conditions", completed: completedSteps.includes(4), active: currentStep === 4 },
  ];

  const contestTypes = ["Spin", "Scratch", "Flip"];

  const addOffer = () => {
    setOffers([...offers, createDefaultOffer()]);
  };

  const removeOffer = (id: string) => {
    if (offers.length > 1) {
      setOffers(offers.filter((offer) => offer.id !== id));
    }
  };

  const updateOffer = (
    id: string,
    field: keyof OfferData,
    value: string | File | null
  ) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, [field]: value } : offer
      )
    );
  };

  const handleOfferBannerUpload = (id: string, file: File | null) => {
    if (file) {
      updateOffer(id, "bannerImage", file);
      updateOffer(id, "bannerImageName", file.name);
    }
  };

  // ── Date/Time → ISO helper ───────────────────────────────────────────────
  const buildISO = (date: string, time: string, isEnd = false): string => {
    if (!date || !time) return "";
    const [y, m, d] = date.split("-");
    const [h, min] = time.split(":");
    const dt = new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min));
    if (isEnd) {
      dt.setHours(23, 59, 59, 999); // common pattern: end of day
    }
    return dt.toISOString(); // UTC — change to +05:30 string if backend requires it
  };

  // ── Submit to API ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setSubmitting(true);

    const baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';

    // Build FormData instead of JSON
    const formData = new FormData();

    // Basic contest fields
    formData.append('contest[name]', contestName.trim());
    formData.append('contest[description]', contestDescription.trim());
    formData.append('contest[content_type]', contestType.toLowerCase());
    formData.append('contest[active]', String(isActive));
    formData.append('contest[start_at]', buildISO(startDate, startTime));
    formData.append('contest[end_at]', buildISO(endDate, endTime, true));

    if (usersCap) {
      formData.append('contest[user_caps]', usersCap);
    }
    if (attemptsRequired) {
      formData.append('contest[attemp_required]', attemptsRequired);
    }

    // Add prizes_attributes
    offers.forEach((offer, index) => {
      const isCouponReward = offer.couponCode.trim() !== "";

      formData.append(`contest[prizes_attributes][${index}][title]`, offer.offerTitle.trim());
      formData.append(
        `contest[prizes_attributes][${index}][reward_type]`,
        isCouponReward ? "coupon" : "points"
      );

      // Add coupon_code only if it's a coupon reward
      if (isCouponReward) {
        formData.append(`contest[prizes_attributes][${index}][coupon_code]`, offer.couponCode.trim());
      }

      // Add points_value only if it's NOT a coupon reward (optional: could be derived from probability)
      if (!isCouponReward) {
        formData.append(`contest[prizes_attributes][${index}][points_value]`, "100");
      }

      // Add partner_name only if provided
      if (offer.partner.trim()) {
        formData.append(`contest[prizes_attributes][${index}][partner_name]`, offer.partner.trim());
      }

      formData.append(
        `contest[prizes_attributes][${index}][probability_value]`,
        offer.winningProbability || "0"
      );
      formData.append(
        `contest[prizes_attributes][${index}][probability_out_of]`,
        offer.probabilityOutOf || "100"
      );
      formData.append(`contest[prizes_attributes][${index}][position]`, String(index + 1));
      formData.append(`contest[prizes_attributes][${index}][active]`, "true");

      // Add banner image if present
      if (offer.bannerImage) {
        formData.append(
          `contest[prizes_attributes][${index}][image_attributes][document]`,
          offer.bannerImage
        );
      }
    });

    // Add terms and conditions text if present
    if (termsText.trim()) {
      formData.append('contest[terms_and_conditions]', termsText.trim());
    }

    // Add redemption guide text if present (only for Scratch contests)
    if (redemptionText.trim() && contestType === "Scratch") {
      formData.append('contest[redemption_guide]', redemptionText.trim());
    }

    try {
      // Ensure protocol is present
      const url = /^https?:\/\//i.test(baseUrl) ? baseUrl : `https://${baseUrl}`;

      const res = await fetch(
        `${url}/contests.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - browser will set it with boundary for multipart/form-data
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error: ${res.status} - ${errText}`);
      }

      const data = await res.json();
      sonnerToast.success("Contest created successfully!");
      
      // Store the created contest ID for navigation
      if (data.id) {
        setCreatedContestId(data.id);
      }
      
      setShowSuccessModal(true);

    } catch (err: any) {
      console.error(err);
      sonnerToast.error(err.message || "Failed to create contest");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId - 1)) {
      setCurrentStep(stepId);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!contestName.trim()) {
          alert("Please enter contest name");
          return false;
        }
        if (!contestDescription.trim()) {
          alert("Please enter contest description");
          return false;
        }
        if (!contestType) {
          alert("Please select contest type");
          return false;
        }
        return true;

      case 2:
        for (const offer of offers) {
          if (!offer.offerTitle.trim()) {
            alert("Please fill all offer titles");
            return false;
          }
        }
        return true;

      case 3:
        if (!startDate || !startTime || !endDate || !endTime) {
          sonnerToast.error("Please fill all validity fields");
          return false;
        }
        return true;

      case 4:
        // Files are optional for now — change to required if needed
        // if (!termsDocument) {
        //   sonnerToast.error("Please upload terms and conditions document");
        //   return false;
        // }
        return true;

      default:
        return true;
    }
  };

  const handleSaveDraft = () => {
    sonnerToast.success("Draft saved successfully!");
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate("/contests");
  };

  const handleViewDetails = () => {
    setShowSuccessModal(false);
    if (createdContestId) {
      navigate(`/contests/${createdContestId}`);
    } else {
      navigate("/contests");
    }
  };

  // MUI TextField styling (unchanged)
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
      "& fieldset": { borderColor: "#e5e7eb" },
      "&:hover fieldset": { borderColor: "#C72030" },
      "&.Mui-focused fieldset": { borderColor: "#C72030" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#C72030" },
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="shadow-sm w-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 bg-[#F6F4EE] p-4 rounded-lg">
                <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
                  <Trophy className="w-5 h-5 text-[#C72030]" />
                </div>
                <h2 className="text-lg font-semibold text-[#1A1A1A]">
                  Basic Contest Info
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  fullWidth
                  label="Contest Name"
                  placeholder="Enter Title"
                  value={contestName}
                  onChange={(e) => setContestName(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={textFieldSx}
                />

                <FormControl fullWidth size="small" sx={textFieldSx}>
                  <InputLabel>Contest Type</InputLabel>
                  <MuiSelect
                    value={contestType}
                    label="Contest Type"
                    onChange={(e) => handleContestTypeChange(e.target.value)}
                  >
                    {contestTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              <div className="mt-6">
                <TextField
                  fullWidth
                  label="Contest Description"
                  placeholder="Enter Description"
                  value={contestDescription}
                  onChange={(e) => setContestDescription(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={4}
                  // sx={textFieldSx}
                   sx={{
              "& .MuiOutlinedInput-root": {
                height: "auto !important",
                padding: "2px !important",
                display: "flex",
              },
              "& .MuiInputBase-input[aria-hidden='true']": {
                flex: 0,
                width: 0,
                height: 0,
                padding: "0 !important",
                margin: 0,
                display: "none",
              },
              "& .MuiInputBase-input": {
                resize: "none !important",
              },
            }}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="shadow-sm w-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 bg-[#F6F4EE] p-4 rounded-lg">
                <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
                  <Trophy className="w-5 h-5 text-[#C72030]" />
                </div>
                <h2 className="text-lg font-semibold text-[#1A1A1A]">
                  Offers & Vouchers
                </h2>
              </div>

              {offers.map((offer, index) => (
                <div
                  key={offer.id}
                  className="border border-gray-200 rounded-lg p-6 mb-4 relative"
                >
                  {offers.length > 1 && (
                    <button
                      onClick={() => removeOffer(offer.id)}
                      className="absolute top-4 right-4 text-[#C72030] hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  )}

                  <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">
                    {index + 1}.
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      label="Offer Title"
                      value={offer.offerTitle}
                      onChange={(e) => updateOffer(offer.id, "offerTitle", e.target.value)}
                      sx={textFieldSx}
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Coupon Code"
                      value={offer.couponCode}
                      onChange={(e) => updateOffer(offer.id, "couponCode", e.target.value)}
                      sx={textFieldSx}
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Display Name"
                      value={offer.displayName}
                      onChange={(e) => updateOffer(offer.id, "displayName", e.target.value)}
                      sx={textFieldSx}
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Partner (if any)"
                      value={offer.partner}
                      onChange={(e) => updateOffer(offer.id, "partner", e.target.value)}
                      sx={textFieldSx}
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Winning Probability"
                      value={offer.winningProbability}
                      onChange={(e) => updateOffer(offer.id, "winningProbability", e.target.value)}
                      sx={textFieldSx}
                      size="small"
                      type="number"
                      inputProps={{ min: 0 }}
                    />

                    <TextField
                      fullWidth
                      label="Probability (Out of)"
                      value={offer.probabilityOutOf}
                      onChange={(e) => updateOffer(offer.id, "probabilityOutOf", e.target.value)}
                      sx={textFieldSx}
                      size="small"
                      type="number"
                      inputProps={{ min: 0 }}
                    />
                  </div>

                  <div className="mt-4">
                    <TextField
                      fullWidth
                      label="Offer Description"
                      value={offer.offerDescription}
                      onChange={(e) => updateOffer(offer.id, "offerDescription", e.target.value)}
                      variant="outlined"
                      multiline
                      rows={3}
                      sx={textFieldSx}
                    />
                  </div>

                  <div className="mt-4">
                    <Typography variant="body2" className="text-gray-700 mb-2">
                      Upload Banner Image
                      <span className="text-[#C72030]">*</span>
                    </Typography>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {offer.bannerImageName ||
                          "Choose a file (jpg/png) 5 MB max. or drag & drop it here"}
                      </p>
                      <input
                        type="file"
                        id={`banner-${offer.id}`}
                        className="hidden"
                        onChange={(e) =>
                          handleOfferBannerUpload(offer.id, e.target.files?.[0] || null)
                        }
                        accept="image/jpeg,image/png"
                      />
                      <label
                        htmlFor={`banner-${offer.id}`}
                        className="inline-block bg-[#F6F4EE] text-[#C72030] px-4 py-2 rounded-md cursor-pointer hover:bg-[#EDEAE3] transition-colors border border-[#C72030]"
                      >
                        Browse
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={addOffer}
                variant="outline"
                className="w-full border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#C72030] hover:text-[#C72030]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Offer
              </Button>
            </CardContent>
          </Card>
        );

      case 3:
        // ... (your original validity step remains 100% unchanged)
        return (
          <Card className="shadow-sm w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6 bg-[#F6F4EE] p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
                    <Trophy className="w-5 h-5 text-[#C72030]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">
                    Validity & Status
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#22c55e",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#22c55e",
                      },
                    }}
                  />
                  <span
                    className={`px-4 py-2 rounded-md text-sm font-medium ${isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  fullWidth
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  variant="outlined"
                  size="small"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: <Calendar className="w-4 h-4 text-gray-400" /> }}
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  label="Start Time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  variant="outlined"
                  size="small"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: <Clock className="w-4 h-4 text-gray-400" /> }}
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  variant="outlined"
                  size="small"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: <Calendar className="w-4 h-4 text-gray-400" /> }}
                  sx={textFieldSx}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <TextField
                  fullWidth
                  label="End Time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  variant="outlined"
                  size="small"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: <Clock className="w-4 h-4 text-gray-400" /> }}
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  label="Users Cap"
                  value={usersCap}
                  onChange={(e) => setUsersCap(e.target.value)}
                  variant="outlined"
                  size="small"
                  type="number"
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  label="Attempts Required"
                  value={attemptsRequired}
                  onChange={(e) => setAttemptsRequired(e.target.value)}
                  variant="outlined"
                  size="small"
                  type="number"
                  sx={textFieldSx}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        // ... your original terms & redemption step (unchanged)
        return (
          <div className="flex flex-col gap-6 w-full">
            <Card className="shadow-sm w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 bg-[#F6F4EE] p-4 rounded-lg">
                  <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
                    <Trophy className="w-5 h-5 text-[#C72030]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">
                    Terms & Conditions
                  </h2>
                </div>

                <div>
                  <TextField
                    fullWidth
                    label="Terms & Conditions"
                    placeholder="Enter terms and conditions"
                    value={termsText}
                    onChange={(e) => setTermsText(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={8}
                   sx={{
              "& .MuiOutlinedInput-root": {
                height: "auto !important",
                padding: "2px !important",
                display: "flex",
              },
              "& .MuiInputBase-input[aria-hidden='true']": {
                flex: 0,
                width: 0,
                height: 0,
                padding: "0 !important",
                margin: 0,
                display: "none",
              },
              "& .MuiInputBase-input": {
                resize: "none !important",
              },
            }}
                  />
                </div>
              </CardContent>
            </Card>

            {contestType === "Scratch" && (
              <Card className="shadow-sm w-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6 bg-[#F6F4EE] p-4 rounded-lg">
                    <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
                      <Trophy className="w-5 h-5 text-[#C72030]" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">
                      Redemption Guide
                    </h2>
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label="Redemption Guide"
                      placeholder="Enter redemption guide"
                      value={redemptionText}
                      onChange={(e) => setRedemptionText(e.target.value)}
                      variant="outlined"
                      multiline
                      rows={8}
                     sx={{
              "& .MuiOutlinedInput-root": {
                height: "auto !important",
                padding: "2px !important",
                display: "flex",
              },
              "& .MuiInputBase-input[aria-hidden='true']": {
                flex: 0,
                width: 0,
                height: 0,
                padding: "0 !important",
                margin: 0,
                display: "none",
              },
              "& .MuiInputBase-input": {
                resize: "none !important",
              },
            }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/contests")}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contests
        </button>
      </div>

      {/* Step Progress Indicator ── unchanged ── */}
      <div className="mb-4">
        <div className="relative w-full">
          <div
            className="absolute top-8 left-0 right-0 h-0.5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, #9CA3AF 0, #9CA3AF 6px, transparent 6px, transparent 12px)",
              height: "2px",
            }}
          ></div>

          <div className="relative flex justify-between items-start">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${step.id <= Math.max(...completedSteps, currentStep)
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-100"
                  }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="py-2 px-3 rounded text-white font-semibold bg-white">
                  <div
                    className={`
                    px-6 py-3 rounded text-white font-semibold text-xs relative z-5 transition-colors whitespace-nowrap
                    ${step.active || step.completed || step.id < currentStep ? "bg-[#C72030]" : "bg-gray-400"}
                  `}
                  >
                    {step.id}. {step.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full px-6">
        {renderStepContent()}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="bg-[#F6F4EE] text-[#C72030] border-[#C72030] hover:bg-[#EDEAE3]"
          >
            Save to draft
          </Button>
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              className="bg-[#C72030] text-white hover:bg-[#B71C1C]"
              disabled={submitting}
            >
              Proceed to next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#C72030] text-white hover:bg-[#B71C1C]"
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </div>

      {/* Success Modal ── unchanged ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={handleSuccessClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  <path
                    d="M50 5 L61 17 L77 12 L79 28 L95 33 L88 48 L95 63 L79 68 L77 84 L61 79 L50 91 L39 79 L23 84 L21 68 L5 63 L12 48 L5 33 L21 28 L23 12 L39 17 Z"
                    fill="#4FD1C5"
                  />
                  <path
                    d="M35 50 L45 60 L65 40"
                    stroke="white"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contest Created!
              </h2>

              <button
                onClick={handleViewDetails}
                className="text-[#C72030] font-medium hover:underline"
              >
                View details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContestPage;