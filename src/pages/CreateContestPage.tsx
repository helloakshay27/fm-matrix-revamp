import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quill from "quill";
import axios from "axios";
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
  Edit,
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
  rewardType: string;
  pointsValue: string;
  validity?: string;
}

export const CreateContestPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdContestId, setCreatedContestId] = useState<number | null>(null);

  // Refs for Quill editors
  const termsEditorRef = useRef<HTMLDivElement>(null);
  const redemptionEditorRef = useRef<HTMLDivElement>(null);
  const termsQuillRef = useRef<Quill | null>(null);
  const redemptionQuillRef = useRef<Quill | null>(null);

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
    rewardType: "Coupon Code",
    pointsValue: "",
    validity: "",
  });

  // Helper function to get initial offers count based on contest type
  const getInitialOffersCount = (type: string): number => {
    return type === "Spin" ? 4 : 1;
  };

  // Form data ────────────────────────────────────────────────────────────────
  const [contestName, setContestName] = useState("");
  const [contestDescription, setContestDescription] = useState("");
  const [contestType, setContestType] = useState("");
  const [usageType, setUsageType] = useState("");
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

  // Tech Park Modal State
  const [isTechParkModalOpen, setIsTechParkModalOpen] = useState(false);
  const [techParks, setTechParks] = useState<any[]>([]);
  const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
  const [isLoadingTechParks, setIsLoadingTechParks] = useState(false);
  const [shareWith, setShareWith] = useState("all");

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const fetchTechParks = async () => {
    if (techParks.length > 0) return;

    setIsLoadingTechParks(true);
    try {
      const response = await axios.get(`https://${baseUrl}/pms/sites/allowed_sites.json`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTechParks(response.data.sites || []);
    } catch (error) {
      console.error("Failed to fetch tech parks", error);
      sonnerToast.error("Failed to load tech parks");
    } finally {
      setIsLoadingTechParks(false);
    }
  };

  // Initialize Quill editors
  useEffect(() => {
    // Initialize Terms & Conditions editor
    if (termsEditorRef.current && !termsQuillRef.current) {
      termsQuillRef.current = new Quill(termsEditorRef.current, {
        theme: "snow",
        placeholder: "Enter terms and conditions",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "bullet" }],
            ["link"],
          ],
        },
      });

      // Set initial content if exists
      if (termsText) {
        termsQuillRef.current.root.innerHTML = termsText;
      }

      // Listen for changes
      termsQuillRef.current.on("text-change", () => {
        const html = termsQuillRef.current?.root.innerHTML || "";
        setTermsText(html);
      });
    }

    // Initialize Redemption Guide editor
    if (redemptionEditorRef.current && !redemptionQuillRef.current) {
      redemptionQuillRef.current = new Quill(redemptionEditorRef.current, {
        theme: "snow",
        placeholder: "Enter redemption guide",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "bullet" }],
            ["link"],
          ],
        },
      });

      // Set initial content if exists
      if (redemptionText) {
        redemptionQuillRef.current.root.innerHTML = redemptionText;
      }

      // Listen for changes
      redemptionQuillRef.current.on("text-change", () => {
        const html = redemptionQuillRef.current?.root.innerHTML || "";
        setRedemptionText(html);
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [currentStep]); // Re-initialize when step changes to ensure editors are visible

  useEffect(() => {
    if (isTechParkModalOpen) {
      fetchTechParks();
    }
  }, [isTechParkModalOpen]);

  const steps: ContestStep[] = [
    {
      id: 1,
      title: "Basic Info",
      completed: completedSteps.includes(1),
      active: currentStep === 1,
    },
    {
      id: 2,
      title: "Offers & Vouchers",
      completed: completedSteps.includes(2),
      active: currentStep === 2,
    },
    {
      id: 3,
      title: "Validity & Status",
      completed: completedSteps.includes(3),
      active: currentStep === 3,
    },
    {
      id: 4,
      title: "Terms & Conditions",
      completed: completedSteps.includes(4),
      active: currentStep === 4,
    },
  ];

  const contestTypes = ["Spin", "Random", "Special Discount"];

  // Helper function to calculate base probability for each offer
  const calculateBaseProbability = (): number => {
    if (offers.length === 0) return 0;
    return 100 / offers.length;
  };

  // Helper function to count coupons in an offer
  const countCoupons = (couponCode: string): number => {
    if (!couponCode.trim()) return 1;
    return couponCode
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code.length > 0).length;
  };

  // Helper function to calculate probability for a specific coupon/offer
  const calculateCouponProbability = (offer: OfferData): number => {
    if (offer.rewardType === "Points") {
      return calculateBaseProbability();
    }

    const baseProbability = calculateBaseProbability();
    const couponCount = countCoupons(offer.couponCode);
    return baseProbability / couponCount;
  };

  // Helper function to calculate max available probability for an offer
  const getMaxAvailableProbability = (offerId: string): number => {
    const otherOffersTotal = offers
      .filter((o) => o.id !== offerId)
      .reduce((sum, o) => sum + (Number(o.winningProbability) || 0), 0);
    return Math.max(0, 100 - otherOffersTotal);
  };

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
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id ? { ...offer, [field]: value } : offer
      )
    );
  };

  const handleOfferBannerUpload = (id: string, file: File | null) => {
    // Update both banner image and its name in a single state update
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id
          ? {
            ...offer,
            bannerImage: file,
            bannerImageName: file ? file.name : "",
          }
          : offer
      )
    );
  };

  const handleRewardTypeChange = (id: string, newRewardType: string) => {
    setOffers((prev) =>
      prev.map((offer) => {
        if (offer.id === id) {
          const updatedOffer = { ...offer, rewardType: newRewardType };
          // Clear the opposite field value
          if (newRewardType === "Coupon Code") {
            updatedOffer.pointsValue = "";
          } else if (newRewardType === "Points") {
            updatedOffer.couponCode = "";
          }
          return updatedOffer;
        }
        return offer;
      })
    );
  };

  const buildISO = (date: string, time: string, isEnd = false): string => {
    if (!date || !time) return "";
    const [y, m, d] = date.split("-");
    const [h, min] = time.split(":");
    const dt = new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(h),
      Number(min)
    );
    if (isEnd) {
      dt.setHours(23, 59, 59, 999); // common pattern: end of day
    }
    return dt.toISOString(); // UTC — change to +05:30 string if backend requires it
  };

  console.log("offers", offers);
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setSubmitting(true);

    const baseUrl = localStorage.getItem("baseUrl") || "";
    const token = localStorage.getItem("token") || "";
    const formData = new FormData();

    // Basic contest fields
    formData.append("contest[name]", contestName.trim());
    formData.append("contest[description]", contestDescription.trim());
    formData.append("contest[content_type]", contestType.toLowerCase().replace(/\s+/g, "_"));
    if (usageType) formData.append("contest[usage_type]", usageType);
    formData.append("contest[active]", String(isActive));
    formData.append("contest[start_at]", buildISO(startDate, startTime));
    formData.append("contest[end_at]", buildISO(endDate, endTime, true));

    if (usersCap) {
      formData.append("contest[user_caps]", usersCap);
    }
    if (attemptsRequired) {
      formData.append("contest[attemp_required]", attemptsRequired);
    }

    // Add tech parks if sharing with individual
    if (shareWith === "individual") {
      formData.append("contest[access_type]", "single_site");
      selectedTechParks.forEach(id => {
        formData.append("contest[site_ids][]", id.toString());
      });
    }

    // Add prizes_attributes
    // First, expand offers with comma-separated coupons
    const expandedOffers: any[] = [];
    offers.forEach((offer) => {
      // Use offer-level probability (what user entered or suggested)
      const userProbability = Number(offer.winningProbability) || calculateBaseProbability();

      if (offer.rewardType === "Coupon Code") {
        // Split comma-separated coupon codes
        const coupons = offer.couponCode
          .split(",")
          .map((code) => code.trim())
          .filter((code) => code.length > 0);

        // Create a separate offer for each coupon with distributed probability
        const probabilityPerCoupon = userProbability / coupons.length;
        coupons.forEach((coupon) => {
          expandedOffers.push({
            ...offer,
            couponCode: coupon,
            calculatedProbability: probabilityPerCoupon,
          });
        });
      } else {
        // For non-coupon offers, add as-is
        expandedOffers.push({
          ...offer,
          calculatedProbability: userProbability,
        });
      }
    });

    // Now add all expanded offers to formData
    expandedOffers.forEach((offer, index) => {
      formData.append(
        `contest[prizes_attributes][${index}][title]`,
        offer.offerTitle.trim()
      );

      // Determine reward type based on offer.rewardType
      const rewardType = offer.rewardType === "Points" ? "points" : "coupon";
      formData.append(
        `contest[prizes_attributes][${index}][reward_type]`,
        rewardType
      );

      // Add coupon_code only if reward type is "Coupon Code"
      if (offer.rewardType === "Coupon Code") {
        formData.append(
          `contest[prizes_attributes][${index}][coupon_code]`,
          offer.couponCode.trim()
        );
      }

      // Add points_value only if reward type is "Points"
      if (offer.rewardType === "Points") {
        formData.append(
          `contest[prizes_attributes][${index}][points_value]`,
          offer.pointsValue.trim()
        );
      }

      // Add partner_name only if provided
      if (offer.partner.trim()) {
        formData.append(
          `contest[prizes_attributes][${index}][partner_name]`,
          offer.partner.trim()
        );
      }

      // Use calculated probability instead of manual input
      formData.append(
        `contest[prizes_attributes][${index}][probability_value]`,
        String(offer.calculatedProbability)
      );
      formData.append(
        `contest[prizes_attributes][${index}][probability_out_of]`,
        "100"
      );
      formData.append(
        `contest[prizes_attributes][${index}][position]`,
        String(index + 1)
      );
      formData.append(`contest[prizes_attributes][${index}][active]`, "true");

      // Add banner image if present
      if (offer.bannerImage) {
        formData.append(
          `contest[prizes_attributes][${index}][image_attributes][document]`,
          offer.bannerImage
        );
      }

      // Add validity if present
      if (offer.validity) {
        formData.append(
          `contest[prizes_attributes][${index}][validity]`,
          offer.validity
        );
      }
    });

    // Add terms and conditions text if present
    if (termsText.trim()) {
      formData.append("contest[terms_and_conditions]", termsText.trim());
    }

    // Add redemption guide text if present (for all contest types)
    if (redemptionText.trim()) {
      formData.append("contest[redemption_guide]", redemptionText.trim());
    }

    try {
      // Ensure protocol is present
      const url = `https://${baseUrl}`;

      const response = await axios.post(
        `${url}/contests.json`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // axios will automatically set Content-Type with multipart/form-data boundary
          },
        }
      );

      const data = response.data;
      sonnerToast.success("Contest created successfully!");

      // Store the created contest ID for navigation
      if (data.id) {
        setCreatedContestId(data.id);
      }

      setShowSuccessModal(true);
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.errors?.join(", ") ||
        "Something went wrong";
      sonnerToast.error(errorMessage);
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

  const handleShareWithChange = (value: string) => {
    setShareWith(value);
    if (value === "individual") {
      setIsTechParkModalOpen(true);
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
        let totalProbability = 0;
        for (const offer of offers) {
          if (!offer.offerTitle.trim()) {
            alert("Please fill all offer titles");
            return false;
          }
          if (offer.rewardType === "Coupon Code") {
            const coupons = offer.couponCode
              .split(",")
              .map((code) => code.trim())
              .filter((code) => code.length > 0);
            if (coupons.length === 0) {
              alert("Please enter at least one coupon code (comma-separated) for all offers");
              return false;
            }
          }
          if (offer.rewardType === "Points" && !offer.pointsValue.trim()) {
            alert("Please enter points value for all offers");
            return false;
          }

          const offerProb = Number(offer.winningProbability) || calculateBaseProbability();
          const maxAvailable = getMaxAvailableProbability(offer.id);

          if (offerProb > maxAvailable) {
            alert(`Offer "${offer.offerTitle}" has probability ${offerProb.toFixed(2)}% but max available is ${maxAvailable.toFixed(2)}%. Please adjust the probabilities so total equals 100%.`);
            return false;
          }

          totalProbability += offerProb;
        }

        if (Math.abs(totalProbability - 100) > 0.01) {
          alert(`Total winning probability must equal 100%. Current total: ${totalProbability.toFixed(2)}%`);
          return false;
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
    navigate("/pulse/contests");
  };

  const handleViewDetails = () => {
    setShowSuccessModal(false);
    if (createdContestId) {
      navigate(`/pulse/contests/${createdContestId}`);
    } else {
      navigate("/pulse/contests");
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
          <>
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

                  <FormControl fullWidth size="small" sx={textFieldSx}>
                    <InputLabel>Usage Type</InputLabel>
                    <MuiSelect
                      value={usageType}
                      label="Usage Type"
                      onChange={(e) => setUsageType(e.target.value)}
                    >
                      <MenuItem value="high_usage">High Usage</MenuItem>
                      <MenuItem value="low_usage">Low Usage</MenuItem>
                      <MenuItem value="na">NA</MenuItem>
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

            <Card className="shadow-sm w-full mt-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 bg-[#F6F4EE] p-4 rounded-lg">
                  <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
                    <Trophy className="w-5 h-5 text-[#C72030]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">
                    Share with Tech Parks
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="shareWith"
                        value="all"
                        checked={shareWith === "all"}
                        onChange={() => handleShareWithChange("all")}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">Share with all</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="shareWith"
                        value="individual"
                        checked={shareWith === "individual"}
                        onChange={() => handleShareWithChange("individual")}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">Share with individual</span>
                    </label>
                  </div>
                </div>

                {shareWith === "individual" && selectedTechParks.length > 0 && (
                  <div className="mt-4 p-4 bg-[#FFF5F5] rounded-lg border border-[#C72030]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">
                          Selected Tech Parks ({selectedTechParks.length})
                        </p>
                      </div>
                      <button
                        onClick={() => setIsTechParkModalOpen(true)}
                        className="text-[#C72030] hover:text-[#B71C1C] transition-colors"
                        title="Edit tech parks selection"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedTechParks.map((parkId) => {
                        const park = techParks.find((p) => p.id === parkId);
                        const parkName = park?.site_name || park?.name || park?.title || `Park ${parkId}`;
                        return (
                          <div
                            key={parkId}
                            className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border-l-4 border-[#C72030]"
                          >
                            <span className="w-2 h-2 bg-[#C72030] rounded-full"></span>
                            <span className="text-sm font-medium text-gray-800">
                              {parkName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
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
                      onChange={(e) =>
                        updateOffer(offer.id, "offerTitle", e.target.value)
                      }
                      sx={textFieldSx}
                      size="small"
                    />

                    <FormControl fullWidth size="small" sx={textFieldSx}>
                      <InputLabel>Reward Type</InputLabel>
                      <MuiSelect
                        value={offer.rewardType}
                        label="Reward Type"
                        onChange={(e) =>
                          handleRewardTypeChange(offer.id, e.target.value)
                        }
                      >
                        <MenuItem value="Coupon Code">Coupon Code</MenuItem>
                        <MenuItem value="Points">Points</MenuItem>
                        <MenuItem value="None">None</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    {offer.rewardType === "Coupon Code" && (
                      <div>
                        <TextField
                          fullWidth
                          label="Coupon Code(s)"
                          placeholder="e.g., CODE1, CODE2, CODE3"
                          value={offer.couponCode}
                          onChange={(e) =>
                            updateOffer(offer.id, "couponCode", e.target.value)
                          }
                          sx={textFieldSx}
                          size="small"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter multiple codes separated by commas. Each code will be a separate offer.
                        </p>
                      </div>
                    )}

                    {offer.rewardType === "Points" && (
                      <TextField
                        fullWidth
                        label="Points"
                        value={offer.pointsValue}
                        onChange={(e) =>
                          updateOffer(offer.id, "pointsValue", e.target.value)
                        }
                        sx={textFieldSx}
                        size="small"
                        type="number"
                        inputProps={{ min: 0 }}
                        required
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Display Name"
                      value={offer.displayName}
                      onChange={(e) =>
                        updateOffer(offer.id, "displayName", e.target.value)
                      }
                      sx={textFieldSx}
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Partner (if any)"
                      value={offer.partner}
                      onChange={(e) =>
                        updateOffer(offer.id, "partner", e.target.value)
                      }
                      sx={textFieldSx}
                      size="small"
                    />

                    {(() => {
                      const maxAvailable = getMaxAvailableProbability(offer.id);
                      const currentValue = Number(offer.winningProbability) || 0;
                      const isExceeded = currentValue > maxAvailable;
                      const suggestedValue = calculateBaseProbability().toFixed(2);

                      // Calculate total at offer level (not per coupon)
                      const totalOfferLevel = offers.reduce((sum, o) => sum + (Number(o.winningProbability) || calculateBaseProbability()), 0);

                      return (
                        <TextField
                          fullWidth
                          label="Winning Probability (%)"
                          value={offer.winningProbability || suggestedValue}
                          onChange={(e) =>
                            updateOffer(offer.id, "winningProbability", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          type="number"
                          inputProps={{ min: 0, max: maxAvailable, step: 0.01 }}
                          error={isExceeded}
                          sx={{
                            ...textFieldSx,
                            ...(isExceeded && {
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#ef4444" },
                                "&:hover fieldset": { borderColor: "#ef4444" },
                                "&.Mui-focused fieldset": { borderColor: "#ef4444" },
                              },
                              "& .MuiInputLabel-root": { color: "#ef4444" },
                              "& .MuiInputLabel-root.Mui-focused": { color: "#ef4444" },
                            }),
                          }}
                          helperText={
                            isExceeded
                              ? `❌ Exceeded! Max available: ${maxAvailable.toFixed(2)}%`
                              : `Suggested: ${suggestedValue}% | Max: ${maxAvailable.toFixed(2)}% | Total: ${totalOfferLevel.toFixed(2)}%${Number(offer.winningProbability) ? ` | Each coupon: ${(Number(offer.winningProbability) / countCoupons(offer.couponCode)).toFixed(2)}%` : ""}`
                          }
                        />
                      );
                    })()}

                    <TextField
                      fullWidth
                      label="Validity"
                      value={offer.validity}
                      onChange={(e) => updateOffer(offer.id, "validity", e.target.value)}
                      sx={textFieldSx}
                      size="small"
                      type="date"
                      inputProps={{ min: 0 }}
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <TextField
                      fullWidth
                      label="Offer Description"
                      value={offer.offerDescription}
                      onChange={(e) =>
                        updateOffer(
                          offer.id,
                          "offerDescription",
                          e.target.value
                        )
                      }
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
                          handleOfferBannerUpload(
                            offer.id,
                            e.target.files?.[0] || null
                          )
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
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                      {
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
                  InputProps={{
                    endAdornment: (
                      <Calendar className="w-4 h-4 text-gray-400" />
                    ),
                  }}
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
                  InputProps={{
                    endAdornment: <Clock className="w-4 h-4 text-gray-400" />,
                  }}
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
                  InputProps={{
                    endAdornment: (
                      <Calendar className="w-4 h-4 text-gray-400" />
                    ),
                  }}
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
                  InputProps={{
                    endAdornment: <Clock className="w-4 h-4 text-gray-400" />,
                  }}
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
                  <div
                    ref={termsEditorRef}
                    style={{
                      width: "100%",
                      minHeight: "200px",
                      backgroundColor: "white",
                    }}
                  />
                </div>
              </CardContent>
            </Card>

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
                  <div
                    ref={redemptionEditorRef}
                    style={{
                      width: "100%",
                      minHeight: "200px",
                      backgroundColor: "white",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
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
          onClick={() => navigate("/pulse/contests")}
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
          {/* <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="bg-[#F6F4EE] text-[#C72030] border-[#C72030] hover:bg-[#EDEAE3]"
          >
            Save to draft
          </Button> */}
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

      {/* Tech Park Selection Modal */}
      {isTechParkModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setIsTechParkModalOpen(false);
            if (selectedTechParks.length === 0) {
              setShareWith("all");
            }
          }}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Select Tech Park</h2>
              <button
                onClick={() => {
                  setIsTechParkModalOpen(false);
                  if (selectedTechParks.length === 0) {
                    setShareWith("all");
                  }
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {isLoadingTechParks ? (
                <div className="text-center py-4 text-gray-500">Loading tech parks...</div>
              ) : techParks.length > 0 ? (
                techParks.map((park) => (
                  <label
                    key={park.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTechParks.includes(park.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTechParks([...selectedTechParks, park.id]);
                        } else {
                          setSelectedTechParks(
                            selectedTechParks.filter((id) => id !== park.id)
                          );
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {park.site_name || park.name}
                    </span>
                  </label>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No tech parks available</div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => {
                  setIsTechParkModalOpen(false);
                }}
                className="flex-1 bg-[#C72030] text-white hover:bg-[#B71C1C]"
              >
                Done
              </Button>
              <Button
                onClick={() => {
                  setIsTechParkModalOpen(false);
                  setSelectedTechParks([]);
                  setShareWith("all");
                }}
                variant="outline"
                className="flex-1 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContestPage;
