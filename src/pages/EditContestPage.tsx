import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Quill from "quill";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
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
  serverId?: number;
  couponServerIds: number[];   // one server ID per coupon code, in order
  existingBannerUrl?: string;
  offerTitle: string;
  couponCode: string;          // comma-separated internal store
  couponCodeInput: string;     // live input text
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

const isoToDateInput = (iso: string): string => {
  if (!iso) return "";
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const isoToTimeInput = (iso: string): string => {
  if (!iso) return "";
  const date = new Date(iso);
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
};

const apiToContestType = (apiType: string): string => {
  const map: Record<string, string> = {
    spin: "Spin",
    random: "Random",
    special_discount: "Special Discount",
    "special discount": "Special Discount",
  };
  return map[apiType?.toLowerCase()] || apiType;
};

export const EditContestPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const termsEditorRef = useRef<HTMLDivElement>(null);
  const redemptionEditorRef = useRef<HTMLDivElement>(null);
  const termsQuillRef = useRef<Quill | null>(null);
  const redemptionQuillRef = useRef<Quill | null>(null);

  const createDefaultOffer = (): OfferData => ({
    id: Date.now().toString() + Math.random(),
    couponServerIds: [],
    offerTitle: "",
    couponCode: "",
    couponCodeInput: "",
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

  // Basic info
  const [contestName, setContestName] = useState("");
  const [contestDescription, setContestDescription] = useState("");
  const [contestType, setContestType] = useState("");
  const [usageType, setUsageType] = useState("");

  // Offers
  const [offers, setOffers] = useState<OfferData[]>([createDefaultOffer()]);
  const [deletedOfferIds, setDeletedOfferIds] = useState<number[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<{ offerId: string; code: string; value: string } | null>(null);

  // Validity
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [usersCap, setUsersCap] = useState("");
  const [attemptsRequired, setAttemptsRequired] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Documents
  const [termsText, setTermsText] = useState("");
  const [redemptionText, setRedemptionText] = useState("");

  // Tech Park
  const [isTechParkModalOpen, setIsTechParkModalOpen] = useState(false);
  const [techParks, setTechParks] = useState<any[]>([]);
  const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
  const [isLoadingTechParks, setIsLoadingTechParks] = useState(false);
  const [shareWith, setShareWith] = useState("all");
  const techParksLoadedRef = useRef(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // Fetch existing contest data and pre-populate
  useEffect(() => {
    if (!id) return;
    const fetchContest = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/contests/${id}.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;

        setContestName(data.name || "");
        setContestDescription(data.description || "");
        const type = apiToContestType(data.content_type || "");
        setContestType(type);
        setUsageType(data.usage_type || "");
        setIsActive(data.active ?? true);
        setStartDate(isoToDateInput(data.start_at));
        setStartTime(isoToTimeInput(data.start_at));
        setEndDate(isoToDateInput(data.end_at));
        setEndTime(isoToTimeInput(data.end_at));
        setUsersCap(data.user_caps != null ? String(data.user_caps) : "");
        setAttemptsRequired(
          data.user_attemp_remaining != null
            ? String(data.user_attemp_remaining)
            : ""
        );
        setTermsText(data.terms_and_conditions || "");
        setRedemptionText(data.redemption_guide || "");

        if (data.access_type === "single_site" && data.contest_sites?.length > 0) {
          setShareWith("individual");
          setSelectedTechParks(data.contest_sites.map((s: any) => s.site_id));
          setTechParks((prev) => {
            const existing = new Set(prev.map((p: any) => p.id));
            const fromSites = data.contest_sites
              .filter((s: any) => !existing.has(s.site_id))
              .map((s: any) => ({ id: s.site_id, site_name: s.site_name }));
            return [...prev, ...fromSites];
          });
        }

        if (data.prizes && data.prizes.length > 0) {
          // Filter out "none" prizes — they're the remainder slot, not real offers
          const realPrizes = data.prizes.filter(
            (p: any) => p.reward_type !== "none"
          );

          // For Spin: derive the total win probability from the sum of real prizes

          // Group coupon prizes by title so multiple coupon records for the
          // same prize appear as one card with capsule tags.
          const couponGroups: Record<string, any[]> = {};
          const nonCouponPrizes: any[] = [];

          realPrizes.forEach((prize: any) => {
            if (prize.reward_type === "coupon") {
              const key = prize.title || "";
              if (!couponGroups[key]) couponGroups[key] = [];
              couponGroups[key].push(prize);
            } else {
              nonCouponPrizes.push(prize);
            }
          });

          const mappedOffers: OfferData[] = [
            ...Object.values(couponGroups).map((prizes: any[]) => {
              const rep = prizes[0];
              return {
                id: String(rep.id),
                serverId: rep.id,
                couponServerIds: prizes.map((p: any) => p.id),
                existingBannerUrl: rep.image?.url || rep.icon_url || "",
                offerTitle: rep.title || "",
                couponCode: prizes.map((p: any) => p.coupon_code).filter(Boolean).join(", "),
                couponCodeInput: "",
                displayName: rep.display_name || "",
                partner: rep.partner_name || "",
                winningProbability: String(prizes.reduce((sum: number, p: any) => sum + (Number(p.probability_value) || 0), 0)),
                probabilityOutOf: String(rep.probability_out_of ?? "100"),
                offerDescription: rep.description || "",
                bannerImage: null,
                bannerImageName: "",
                rewardType: "Coupon Code",
                pointsValue: "",
                validity: rep.validity.split("T")[0] || "",
              };
            }),
            ...nonCouponPrizes.map((prize: any) => ({
              id: String(prize.id),
              serverId: prize.id,
              couponServerIds: [],
              existingBannerUrl: prize.image?.url || prize.icon_url || "",
              offerTitle: prize.title || "",
              couponCode: "",
              couponCodeInput: "",
              displayName: prize.display_name || "",
              partner: prize.partner_name || "",
              winningProbability: String(prize.probability_value ?? ""),
              probabilityOutOf: String(prize.probability_out_of ?? "100"),
              offerDescription: prize.description || "",
              bannerImage: null,
              bannerImageName: "",
              rewardType: prize.reward_type === "points" ? "Points" : "None",
              pointsValue: prize.reward_type === "points" ? String(prize.points_value ?? "") : "",
              validity: prize.validity || "",
            })),
          ];
          setOffers(mappedOffers);
        }
      } catch (err: any) {
        sonnerToast.error("Failed to load contest data");
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [id]);

  const fetchTechParks = async () => {
    if (techParksLoadedRef.current) return;
    setIsLoadingTechParks(true);
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/sites/allowed_sites.json`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTechParks(response.data.sites || []);
      techParksLoadedRef.current = true;
    } catch {
      sonnerToast.error("Failed to load tech parks");
    } finally {
      setIsLoadingTechParks(false);
    }
  };

  // Quill editors
  useEffect(() => {
    if (termsEditorRef.current && !termsQuillRef.current) {
      termsQuillRef.current = new Quill(termsEditorRef.current, {
        theme: "snow",
        placeholder: "Enter terms and conditions",
        modules: { toolbar: [["bold", "italic", "underline"], [{ list: "bullet" }], ["link"]] },
      });
      if (termsText) termsQuillRef.current.root.innerHTML = termsText;
      termsQuillRef.current.on("text-change", () => {
        setTermsText(termsQuillRef.current?.root.innerHTML || "");
      });
    }
    if (redemptionEditorRef.current && !redemptionQuillRef.current) {
      redemptionQuillRef.current = new Quill(redemptionEditorRef.current, {
        theme: "snow",
        placeholder: "Enter redemption guide",
        modules: { toolbar: [["bold", "italic", "underline"], [{ list: "bullet" }], ["link"]] },
      });
      if (redemptionText) redemptionQuillRef.current.root.innerHTML = redemptionText;
      redemptionQuillRef.current.on("text-change", () => {
        setRedemptionText(redemptionQuillRef.current?.root.innerHTML || "");
      });
    }
  }, [currentStep]);

  useEffect(() => {
    if (termsQuillRef.current && termsText && currentStep === 4) {
      const current = termsQuillRef.current.root.innerHTML;
      if (current !== termsText) termsQuillRef.current.root.innerHTML = termsText;
    }
  }, [termsText, currentStep]);

  useEffect(() => {
    if (redemptionQuillRef.current && redemptionText && currentStep === 4) {
      const current = redemptionQuillRef.current.root.innerHTML;
      if (current !== redemptionText) redemptionQuillRef.current.root.innerHTML = redemptionText;
    }
  }, [redemptionText, currentStep]);

  useEffect(() => {
    if (isTechParkModalOpen) fetchTechParks();
  }, [isTechParkModalOpen]);

  const steps: ContestStep[] = [
    { id: 1, title: "Basic Info", completed: completedSteps.includes(1), active: currentStep === 1 },
    { id: 2, title: "Offers & Vouchers", completed: completedSteps.includes(2), active: currentStep === 2 },
    { id: 3, title: "Validity & Status", completed: completedSteps.includes(3), active: currentStep === 3 },
    { id: 4, title: "Terms & Conditions", completed: completedSteps.includes(4), active: currentStep === 4 },
  ];

  const contestTypes = ["Spin", "Random", "Special Discount"];

  const getInitialOffersCount = (type: string): number => (type === "Spin" ? 4 : 1);

  const handleContestTypeChange = (newType: string) => {
    setContestType(newType);

    if (newType !== "Random") setUsageType("");

    if (newType !== "Spin") {
      setUsersCap("");
      setAttemptsRequired("");
    }

    if (newType !== "Scratch") setRedemptionText("");

    const requiredCount = getInitialOffersCount(newType);
    const currentCount = offers.length;
    if (currentCount < requiredCount) {
      const newOffers = Array.from({ length: requiredCount - currentCount }, () => createDefaultOffer());
      setOffers([...offers, ...newOffers]);
    } else if (currentCount > requiredCount) {
      setOffers(offers.slice(0, requiredCount));
    }
  };

  const calculateBaseProbability = (): number => {
    if (offers.length === 0) return 0;
    return 100 / offers.length;
  };

  const countCoupons = (couponCode: string): number => {
    if (!couponCode.trim()) return 1;
    return couponCode.split(",").map((c) => c.trim()).filter((c) => c.length > 0).length;
  };

  const getMaxAvailableProbability = (offerId: string): number => {
    const otherOffersTotal = offers
      .filter((o) => o.id !== offerId)
      .reduce((sum, o) => sum + (Number(o.winningProbability) || 0), 0);
    return Math.max(0, 100 - otherOffersTotal);
  };

  const addOffer = () => setOffers([...offers, createDefaultOffer()]);

  const removeOffer = (offerId: string) => {
    if (offers.length > 1) {
      const offer = offers.find((o) => o.id === offerId);
      if (offer) {
        if (offer.couponServerIds.length > 0) {
          setDeletedOfferIds((prev) => [...prev, ...offer.couponServerIds]);
        } else if (offer.serverId) {
          setDeletedOfferIds((prev) => [...prev, offer.serverId!]);
        }
      }
      setOffers(offers.filter((o) => o.id !== offerId));
    }
  };

  const addCouponCode = (offerId: string, input: string) => {
    const code = input.trim().replace(/,$/, "").trim();
    if (!code) return;
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        const existing = o.couponCode.split(",").map((c) => c.trim()).filter(Boolean);
        if (existing.includes(code)) return { ...o, couponCodeInput: "" };
        return { ...o, couponCode: [...existing, code].join(", "), couponCodeInput: "" };
      })
    );
  };

  const removeCouponCode = (offerId: string, code: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        const remaining = o.couponCode.split(",").map((c) => c.trim()).filter((c) => c && c !== code).join(", ");
        return { ...o, couponCode: remaining };
      })
    );
  };

  const removeLastCouponCode = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        const codes = o.couponCode.split(",").map((c) => c.trim()).filter(Boolean);
        if (codes.length === 0) return o;
        codes.pop();
        return { ...o, couponCode: codes.join(", ") };
      })
    );
  };

  const commitCouponEdit = () => {
    if (!editingCoupon) return;
    const newCode = editingCoupon.value.trim();
    if (!newCode || newCode === editingCoupon.code) {
      setEditingCoupon(null);
      return;
    }
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== editingCoupon.offerId) return o;
        const codes = o.couponCode.split(",").map((c) => c.trim()).filter(Boolean);
        const idx = codes.indexOf(editingCoupon.code);
        if (idx === -1) return o;
        if (codes.includes(newCode)) {
          codes.splice(idx, 1);
        } else {
          codes[idx] = newCode;
        }
        return { ...o, couponCode: codes.join(", ") };
      })
    );
    setEditingCoupon(null);
  };

  const updateOffer = (offerId: string, field: keyof OfferData, value: string | File | null) => {
    setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, [field]: value } : o)));
  };

  const handleOfferBannerUpload = (offerId: string, file: File | null) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, bannerImage: file, bannerImageName: file ? file.name : "" } : o
      )
    );
  };

  const handleRewardTypeChange = (offerId: string, newRewardType: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        const updated = { ...o, rewardType: newRewardType };
        if (newRewardType === "Coupon Code") updated.pointsValue = "";
        else updated.couponCode = "";
        return updated;
      })
    );
  };

  const buildISO = (date: string, time: string, isEnd = false): string => {
    if (!date || !time) return "";
    const [y, m, d] = date.split("-");
    const [h, min] = time.split(":");
    const dt = new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min));
    if (isEnd) dt.setHours(23, 59, 59, 999);
    return dt.toISOString();
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setSubmitting(true);

    const formData = new FormData();

    formData.append("contest[name]", contestName.trim());
    formData.append("contest[description]", contestDescription.trim());
    formData.append("contest[content_type]", contestType.toLowerCase().replace(/\s+/g, "_"));
    if (usageType) formData.append("contest[usage_type]", usageType);
    formData.append("contest[active]", String(isActive));
    formData.append("contest[start_at]", buildISO(startDate, startTime));
    formData.append("contest[end_at]", buildISO(endDate, endTime, true));

    if (contestType === "Spin") {
      if (usersCap) formData.append("contest[user_caps]", usersCap);
      if (attemptsRequired) formData.append("contest[user_attemp_remaining]", attemptsRequired);
    }

    if (shareWith === "individual") {
      formData.append("contest[access_type]", "single_site");
      selectedTechParks.forEach((siteId) =>
        formData.append("contest[site_ids][]", siteId.toString())
      );
    } else {
      formData.append("contest[access_type]", "all");
    }

    let prizeIndex = 0;

    // Mark deleted offers for destroy
    deletedOfferIds.forEach((serverId) => {
      formData.append(`contest[prizes_attributes][${prizeIndex}][id]`, String(serverId));
      formData.append(`contest[prizes_attributes][${prizeIndex}][_destroy]`, "true");
      prizeIndex++;
    });

    // Expand offers — flatten comma-separated coupon codes.
    // Each coupon gets its own server ID (couponServerIds[idx]) so the API
    // can update the correct existing record. Extra old server IDs are destroyed.
    const expandedOffers: any[] = [];
    offers.forEach((offer) => {
      const offerProb = Number(offer.winningProbability) || calculateBaseProbability();
      if (offer.rewardType === "Coupon Code") {
        const coupons = offer.couponCode
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
        const probPerCoupon = coupons.length > 0 ? offerProb / coupons.length : offerProb;
        coupons.forEach((coupon, couponIdx) => {
          expandedOffers.push({
            ...offer,
            couponCode: coupon,
            isFirst: couponIdx === 0,
            couponServerId: offer.couponServerIds[couponIdx] ?? null,
            _computedProb: probPerCoupon,
          });
        });
        // If existing records outnumber new coupons, mark extras for destruction
        for (let i = coupons.length; i < offer.couponServerIds.length; i++) {
          expandedOffers.push({
            ...offer,
            _destroy: true,
            couponServerId: offer.couponServerIds[i],
          });
        }
      } else {
        expandedOffers.push({ ...offer, isFirst: true, couponServerId: null, _computedProb: offerProb });
      }
    });

    let spinRemainder: number | null = null;
    if (contestType === "Spin") {
      const totalWin = offers.reduce(
        (sum, o) => sum + (Number(o.winningProbability) || calculateBaseProbability()),
        0
      );
      spinRemainder = Math.max(0, 100 - totalWin);
    }

    expandedOffers.forEach((offer) => {
      // Handle entries marked for destruction (coupon codes removed by user)
      if (offer._destroy) {
        formData.append(`contest[prizes_attributes][${prizeIndex}][id]`, String(offer.couponServerId));
        formData.append(`contest[prizes_attributes][${prizeIndex}][_destroy]`, "true");
        prizeIndex++;
        return;
      }

      // For coupon offers: use the per-coupon serverId; for others: use serverId on first only
      const recordId = offer.rewardType === "Coupon Code"
        ? offer.couponServerId
        : (offer.isFirst ? offer.serverId : null);
      if (recordId) {
        formData.append(`contest[prizes_attributes][${prizeIndex}][id]`, String(recordId));
      }
      formData.append(`contest[prizes_attributes][${prizeIndex}][title]`, offer.offerTitle.trim());

      const rewardType = offer.rewardType === "Points" ? "points" : "coupon";
      formData.append(`contest[prizes_attributes][${prizeIndex}][reward_type]`, rewardType);

      if (offer.rewardType === "Coupon Code") {
        formData.append(`contest[prizes_attributes][${prizeIndex}][coupon_code]`, offer.couponCode.trim());
      }
      if (offer.rewardType === "Points") {
        formData.append(`contest[prizes_attributes][${prizeIndex}][points_value]`, offer.pointsValue.trim());
      }
      if (offer.partner.trim()) {
        formData.append(`contest[prizes_attributes][${prizeIndex}][partner_name]`, offer.partner.trim());
      }

      if (contestType === "Spin") {
        formData.append(`contest[prizes_attributes][${prizeIndex}][probability_value]`, String(offer._computedProb ?? 0));
        formData.append(`contest[prizes_attributes][${prizeIndex}][probability_out_of]`, "100");
      }

      formData.append(`contest[prizes_attributes][${prizeIndex}][position]`, String(prizeIndex + 1));
      formData.append(`contest[prizes_attributes][${prizeIndex}][active]`, "true");

      if (offer.bannerImage && offer.isFirst) {
        formData.append(
          `contest[prizes_attributes][${prizeIndex}][image_attributes][document]`,
          offer.bannerImage
        );
      }
      if (offer.validity) {
        formData.append(`contest[prizes_attributes][${prizeIndex}][validity]`, offer.validity);
      }

      prizeIndex++;
    });

    // For Spin: append "none" remainder entry
    if (contestType === "Spin" && spinRemainder !== null) {
      formData.append(`contest[prizes_attributes][${prizeIndex}][title]`, "No Reward");
      formData.append(`contest[prizes_attributes][${prizeIndex}][reward_type]`, "none");
      formData.append(`contest[prizes_attributes][${prizeIndex}][probability_value]`, String(spinRemainder));
      formData.append(`contest[prizes_attributes][${prizeIndex}][probability_out_of]`, "100");
      formData.append(`contest[prizes_attributes][${prizeIndex}][position]`, String(prizeIndex + 1));
      formData.append(`contest[prizes_attributes][${prizeIndex}][active]`, "true");
    }

    if (termsText.trim()) formData.append("contest[terms_and_conditions]", termsText.trim());
    if (redemptionText.trim()) formData.append("contest[redemption_guide]", redemptionText.trim());

    try {
      await axios.put(`https://${baseUrl}/contests/${id}.json`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      sonnerToast.success("Contest updated successfully!");
      navigate(`/pulse/contests/${id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to update contest";
      sonnerToast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep))
        setCompletedSteps([...completedSteps, currentStep]);
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId - 1))
      setCurrentStep(stepId);
  };

  const handleShareWithChange = (value: string) => {
    setShareWith(value);
    if (value === "individual") setIsTechParkModalOpen(true);
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!contestName.trim()) { alert("Please enter contest name"); return false; }
        if (!contestDescription.trim()) { alert("Please enter contest description"); return false; }
        if (!contestType) { alert("Please select contest type"); return false; }
        return true;
      case 2:
        for (const offer of offers) {
          if (!offer.offerTitle.trim()) { sonnerToast.error("Please fill all offer titles"); return false; }
          if (offer.rewardType === "Coupon Code") {
            const coupons = offer.couponCode.split(",").map((c) => c.trim()).filter((c) => c.length > 0);
            if (coupons.length === 0) { sonnerToast.error("Please enter at least one coupon code for all offers"); return false; }
          }
          if (offer.rewardType === "Points" && !offer.pointsValue.trim()) {
            sonnerToast.error("Please enter points value for all offers"); return false;
          }
        }
        if (contestType === "Spin") {
          const totalProbability = offers.reduce(
            (sum, o) => sum + (Number(o.winningProbability) || calculateBaseProbability()),
            0
          );
          if (Math.abs(totalProbability - 100) > 0.01) {
            sonnerToast.error(`Total winning probability must equal 100%. Current total: ${totalProbability.toFixed(2)}%`);
            return false;
          }
        }
        return true;
      case 3:
        if (!startDate || !startTime || !endDate || !endTime) {
          sonnerToast.error("Please fill all validity fields"); return false;
        }
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

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
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">Basic Contest Info</h2>
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
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {contestType === "Random" && (
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
                  )}

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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "auto !important",
                        padding: "2px !important",
                        display: "flex",
                      },
                      "& .MuiInputBase-input[aria-hidden='true']": {
                        flex: 0, width: 0, height: 0, padding: "0 !important", margin: 0, display: "none",
                      },
                      "& .MuiInputBase-input": { resize: "none !important" },
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
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">Share with Tech Parks</h2>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6">
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

                {shareWith === "individual" && selectedTechParks.length > 0 && (
                  <div className="mt-4 p-4 bg-[#FFF5F5] rounded-lg border border-[#C72030]">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-gray-900">
                        Selected Tech Parks ({selectedTechParks.length})
                      </p>
                      <button
                        onClick={() => setIsTechParkModalOpen(true)}
                        className="text-[#C72030] hover:text-[#B71C1C] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedTechParks.map((parkId) => {
                        const park = techParks.find((p) => p.id === parkId);
                        const parkName = park?.site_name || park?.name || `Park ${parkId}`;
                        return (
                          <div
                            key={parkId}
                            className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border-l-4 border-[#C72030]"
                          >
                            <span className="w-2 h-2 bg-[#C72030] rounded-full" />
                            <span className="text-sm font-medium text-gray-800">{parkName}</span>
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
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Offers & Vouchers</h2>
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

                  <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">{index + 1}.</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      label="Offer Title"
                      value={offer.offerTitle}
                      onChange={(e) => updateOffer(offer.id, "offerTitle", e.target.value)}
                      sx={textFieldSx}
                      size="small"
                    />

                    <FormControl fullWidth size="small" sx={textFieldSx}>
                      <InputLabel>Reward Type</InputLabel>
                      <MuiSelect
                        value={offer.rewardType}
                        label="Reward Type"
                        onChange={(e) => handleRewardTypeChange(offer.id, e.target.value)}
                      >
                        <MenuItem value="Coupon Code">Coupon Code</MenuItem>
                        <MenuItem value="Points">Points</MenuItem>
                        <MenuItem value="None">None</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    {offer.rewardType === "Coupon Code" && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Coupon Code(s) <span className="text-[#C72030]">*</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5 min-h-[40px] w-full px-3 py-2 border border-[#e5e7eb] rounded bg-white focus-within:border-[#C72030] focus-within:ring-1 focus-within:ring-[#C72030]/20 transition-colors cursor-text">
                          {offer.couponCode.split(",").map((c) => c.trim()).filter(Boolean).map((code) => (
                            <span
                              key={code}
                              className="inline-flex items-center gap-1 bg-[#C72030]/10 text-[#C72030] text-xs font-medium px-2 py-0.5 rounded-full"
                            >
                              {editingCoupon?.offerId === offer.id && editingCoupon?.code === code ? (
                                <input
                                  autoFocus
                                  value={editingCoupon.value}
                                  onChange={(e) => setEditingCoupon({ ...editingCoupon, value: e.target.value })}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") { e.preventDefault(); commitCouponEdit(); }
                                    if (e.key === "Escape") setEditingCoupon(null);
                                  }}
                                  onBlur={commitCouponEdit}
                                  className="outline-none bg-transparent text-[#C72030] text-xs font-medium min-w-[60px] w-auto"
                                  style={{ width: `${Math.max(editingCoupon.value.length, 4)}ch` }}
                                />
                              ) : (
                                <span
                                  onClick={() => setEditingCoupon({ offerId: offer.id, code, value: code })}
                                  className="cursor-text"
                                  title="Click to edit"
                                >
                                  {code}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => removeCouponCode(offer.id, code)}
                                className="text-[#C72030] hover:text-[#a81c28] leading-none"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <input
                            value={offer.couponCodeInput}
                            onChange={(e) => updateOffer(offer.id, "couponCodeInput", e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addCouponCode(offer.id, offer.couponCodeInput);
                              }
                              if (e.key === "Backspace" && !offer.couponCodeInput) {
                                removeLastCouponCode(offer.id);
                              }
                            }}
                            onBlur={() => { if (offer.couponCodeInput.trim()) addCouponCode(offer.id, offer.couponCodeInput); }}
                            placeholder={offer.couponCode ? "" : "Type code and press Enter or comma"}
                            className="flex-1 min-w-[160px] outline-none text-sm bg-transparent py-0.5"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Press Enter or comma to add each code.
                        </p>
                      </div>
                    )}

                    {offer.rewardType === "Points" && (
                      <TextField
                        fullWidth
                        label="Points"
                        value={offer.pointsValue}
                        onChange={(e) => updateOffer(offer.id, "pointsValue", e.target.value)}
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

                    {contestType === "Spin" && (() => {
                      const maxAvailable = getMaxAvailableProbability(offer.id);
                      const currentValue = Number(offer.winningProbability) || 0;
                      const isExceeded = currentValue > maxAvailable;
                      const suggestedValue = calculateBaseProbability().toFixed(2);

                      return (
                        <TextField
                          fullWidth
                          label="Winning Probability (%)"
                          value={offer.winningProbability}
                          placeholder={suggestedValue}
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
                      onChange={(e) => updateOffer(offer.id, "offerDescription", e.target.value)}
                      variant="outlined"
                      multiline
                      rows={3}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "auto !important",
                          padding: "2px !important",
                          display: "flex",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#C72030" },
                          "&.Mui-focused fieldset": { borderColor: "#C72030" },
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

                  <div className="mt-4">
                    <Typography variant="body2" className="text-gray-700 mb-2">
                      Banner Image
                    </Typography>
                    {offer.existingBannerUrl && !offer.bannerImage && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Current image:</p>
                        <img
                          src={offer.existingBannerUrl}
                          alt="Current banner"
                          className="h-24 rounded-md object-cover border border-gray-200"
                        />
                      </div>
                    )}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {offer.bannerImageName ||
                          (offer.existingBannerUrl
                            ? "Upload new image to replace existing"
                            : "Choose a file (jpg/png) 5 MB max.")}
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
        return (
          <Card className="shadow-sm w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6 bg-[#F6F4EE] p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
                    <Trophy className="w-5 h-5 text-[#C72030]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">Validity & Status</h2>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#22c55e" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#22c55e" },
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
                  fullWidth label="Start Date" value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  variant="outlined" size="small" type="date"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: <Calendar className="w-4 h-4 text-gray-400" /> }}
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth label="Start Time" value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  variant="outlined" size="small" type="time"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: <Clock className="w-4 h-4 text-gray-400" /> }}
                  sx={textFieldSx}
                />
                <TextField
                  fullWidth label="End Date" value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  variant="outlined" size="small" type="date"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: <Calendar className="w-4 h-4 text-gray-400" /> }}
                  sx={textFieldSx}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <TextField
                  fullWidth label="End Time" value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  variant="outlined" size="small" type="time"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: <Clock className="w-4 h-4 text-gray-400" /> }}
                  sx={textFieldSx}
                />

                {contestType === "Spin" && (
                  <TextField
                    fullWidth label="Users Cap" value={usersCap}
                    onChange={(e) => setUsersCap(e.target.value)}
                    variant="outlined" size="small" type="number"
                    sx={textFieldSx}
                  />
                )}

                {contestType === "Spin" && (
                  <TextField
                    fullWidth label="Attempts Allowed" value={attemptsRequired}
                    onChange={(e) => setAttemptsRequired(e.target.value)}
                    variant="outlined" size="small" type="number"
                    sx={textFieldSx}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <div className="flex flex-col gap-6 w-full">
            <Card className="shadow-sm w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 bg-[#F6F4EE] p-4 rounded-lg">
                  <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
                    <Trophy className="w-5 h-5 text-[#C72030]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">Terms & Conditions</h2>
                </div>
                <div
                  ref={termsEditorRef}
                  style={{ width: "100%", minHeight: "200px", backgroundColor: "white" }}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 bg-[#F6F4EE] p-4 rounded-lg">
                  <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
                    <Trophy className="w-5 h-5 text-[#C72030]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">Redemption Guide</h2>
                </div>
                <div
                  ref={redemptionEditorRef}
                  style={{ width: "100%", minHeight: "200px", backgroundColor: "white" }}
                />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#C72030] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="mb-4">
        <button
          onClick={() => navigate(`/pulse/contests/${id}`)}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contest
        </button>
      </div>

      <div className="mb-4">
        <div className="relative w-full">
          <div
            className="absolute top-8 left-0 right-0 h-0.5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, #9CA3AF 0, #9CA3AF 6px, transparent 6px, transparent 12px)",
              height: "2px",
            }}
          />
          <div className="relative flex justify-between items-start">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${step.id <= Math.max(...completedSteps, currentStep) ? "cursor-pointer" : "cursor-not-allowed opacity-100"}`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="py-2 px-3 rounded text-white font-semibold bg-white">
                  <div
                    className={`px-6 py-3 rounded text-white font-semibold text-xs relative z-5 transition-colors whitespace-nowrap ${step.active || step.completed || step.id < currentStep ? "bg-[#C72030]" : "bg-gray-400"}`}
                  >
                    {step.id}. {step.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full px-6">
        {renderStepContent()}

        <div className="flex justify-center gap-4 mt-6">
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
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      {/* Tech Park Modal */}
      {isTechParkModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setIsTechParkModalOpen(false);
            if (selectedTechParks.length === 0) setShareWith("all");
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
                  if (selectedTechParks.length === 0) setShareWith("all");
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
                          setSelectedTechParks(selectedTechParks.filter((sid) => sid !== park.id));
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
                onClick={() => setIsTechParkModalOpen(false)}
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

export default EditContestPage;
