import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import { scratchCardApi, ScratchCardData } from "@/services/scratchCardApi";
import { baseClient } from "@/utils/withoutTokenBase";
import { toast } from "sonner";

interface UserContestReward {
  id: number;
  reward_type: string;
  status: string;
  points_value: number | null;
  coupon_code: string | null;
  claimed_at?: string;
  contest: {
    id: number;
    name: string;
    description: string;
    terms_and_conditions: string | null;
    content_type: string;
    start_at: string;
    end_at: string;
    status: string;
  };
  prize: {
    id: number;
    title: string;
    description?: string;
    display_name: string | null;
    reward_type: string;
    coupon_code: string | null;
    partner_name: string | null;
    points_value: number | null;
    icon_url: string | null;
    image: unknown | null;
    product: unknown | null;
  };
}

export const VoucherDetails: React.FC = () => {
  const navigate = useNavigate();
  const { cardId, rewardId } = useParams<{
    cardId?: string;
    rewardId?: string;
  }>();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [voucherData, setVoucherData] = useState<ScratchCardData | null>(null);
  const [rewardData, setRewardData] = useState<UserContestReward | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "details"
  );
  const [showCode, setShowCode] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const fetchVoucherData = async () => {
      // If rewardId is present, use new API structure
      if (rewardId) {
        setIsLoading(true);
        try {
          const orgId = searchParams.get("org_id");
          const token = searchParams.get("token");

          if (!orgId || !token) {
            console.error("Missing org_id or token");
            return;
          }

          // Pass org_id and token as params for baseClient interceptor
          const params: Record<string, string> = {};
          if (token) params.token = token;
          // if (orgId) params.org_id = orgId;

          const response = await baseClient.get(
            `/user_contest_rewards/${rewardId}`,
            { params }
          );
          setRewardData(response.data);
          console.warn("✅ Reward data loaded:", response.data);
        } catch (error) {
          console.error("Error fetching reward data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      // Otherwise use old API structure
      else if (cardId) {
        setIsLoading(true);
        try {
          const data = await scratchCardApi.getScratchCardById(cardId);
          setVoucherData(data);
        } catch (error) {
          console.error("Error fetching voucher data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchVoucherData();
  }, [cardId, rewardId, searchParams]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleGetCode = () => {
    setShowCode(!showCode);
  };

  const copyCode = () => {
    const code =
      rewardData?.coupon_code ||
      rewardData?.prize?.coupon_code ||
      voucherData?.voucher_code;
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("Voucher code copied to clipboard!");
    }
  };

  const handleRedeemMerchandise = async () => {
    if (!rewardId || isClaiming) return;

    setIsClaiming(true);
    try {
      const token = searchParams.get("token");
      const orgId = searchParams.get("org_id");

      if (!token) {
        toast.error("Missing authentication token");
        return;
      }

      const params: Record<string, string> = { reward_type: "marchandise" };
      if (token) params.token = token;

      await baseClient.put(
        `/user_contest_rewards/${rewardId}`,
        {
          user_contest_reward: {
            status: "claimed",
          },
        },
        { params }
      );

      // Refresh reward data
      const response = await baseClient.get(
        `/user_contest_rewards/${rewardId}`,
        { params: { token } }
      );
      setRewardData(response.data);

      toast.success("Successfully redeemed merchandise!", {
        description: "Your reward status has been updated to claimed.",
      });
    } catch (error) {
      console.error("Error redeeming merchandise:", error);
      toast.error("Failed to redeem merchandise", {
        description: "Please try again later.",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  // Use appropriate data based on which is available
  const displayData = rewardData
    ? {
        title: rewardData.prize?.title || "Voucher",
        description:
          rewardData.contest?.description ||
          rewardData.prize?.display_name ||
          rewardData.prize?.description ||
          "",
        image_url:
          (rewardData.prize?.image as { url?: string })?.url ||
          rewardData.prize?.icon_url ||
          null,
        value: rewardData.prize?.partner_name || "",
        code: rewardData.coupon_code || rewardData.prize?.coupon_code || "",
        points_value: rewardData.points_value || rewardData.prize?.points_value,
        status: rewardData.status,
        contest_title: rewardData.contest?.name || "Contest",
        contest_type: rewardData.contest?.content_type || "",
        valid_till: rewardData.contest?.end_at || "",
        terms: rewardData.contest?.terms_and_conditions || "",
        reward_type: rewardData.prize?.reward_type || rewardData.reward_type,
        product: rewardData.prize?.product || null,
      }
    : voucherData
      ? {
          title: voucherData.reward?.title || "",
          description: voucherData.reward?.description || "",
          image_url: voucherData.reward?.image_url || null,
          value: "",
          code: voucherData.voucher_code || "",
          points_value: null,
          status: "",
          contest_title: "",
          contest_type: "",
          valid_till: voucherData.valid_until || "",
          terms: "",
          reward_type: "",
          product: null,
        }
      : null;

  if (!voucherData && !rewardData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Voucher not found</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[#B88B15] font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#9EAFC9] text-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 hover:bg-white/10 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Contest & promotion</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-8">
        {/* Product Image */}
        <div className="w-full bg-[#F5E6D3] ">
          {displayData?.image_url ? (
            <img
              src={displayData.image_url}
              alt={displayData?.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-white rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🎁</div>
                <p className="text-gray-500 text-sm">No Image Available</p>
              </div>
            </div>
          )}
        </div>

        {/* Voucher Info */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {displayData?.title}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {displayData?.description}
          </p>

          {/* Voucher Code Section - only show if there's a code */}
          {displayData?.code && (
            <div className="bg-[#F5E6D3] rounded-lg p-3 flex items-center justify-between mb-4">
              <span className="text-gray-900 font-mono tracking-wider">
                {showCode ? displayData?.code : "•".repeat(15)}
              </span>
              <button
                onClick={handleGetCode}
                className="text-gray-900 font-semibold text-sm"
              >
                Get Code
              </button>
            </div>
          )}

          {/* Details Section */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between py-4"
            >
              <span className="font-semibold text-gray-900">Details</span>
              {expandedSection === "details" ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {expandedSection === "details" && (
              <div className="pb-4 space-y-2">
                {voucherData?.details ? (
                  voucherData.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-gray-600 text-sm">•</span>
                      <span className="text-gray-600 text-sm flex-1">
                        {detail}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600 text-sm space-y-1">
                    {/* Show merchandise product details */}
                    {displayData?.reward_type === "marchandise" &&
                      displayData?.product && (
                        <div className="space-y-3 mb-4">
                          <div className="bg-[#FFF8E7] border border-[#D4A574] rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Product Information
                            </h3>
                            {(displayData.product as { name?: string })
                              ?.name && (
                              <p className="mb-2">
                                <strong>Name:</strong>{" "}
                                {(displayData.product as { name: string }).name}
                              </p>
                            )}
                            {(displayData.product as { description?: string })
                              ?.description && (
                              <p className="mb-2">
                                <strong>Description:</strong>{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: (
                                      displayData.product as {
                                        description: string;
                                      }
                                    ).description,
                                  }}
                                />
                              </p>
                            )}
                            {(displayData.product as { sku?: string })?.sku && (
                              <p className="mb-2">
                                <strong>SKU:</strong>{" "}
                                {(displayData.product as { sku: string }).sku}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Show points for spin contests with no coupon code */}
                    {displayData?.contest_type === "spin" &&
                      !displayData?.code &&
                      displayData?.points_value && (
                        <div className="bg-[#FFF8E7] border border-[#D4A574] rounded-lg p-4 mb-3">
                          <p className="text-center text-sm text-gray-600 mb-1">
                            Loyalty Points Earned
                          </p>
                          <p className="text-center text-2xl font-bold text-[#B88B15]">
                            {displayData.points_value} Points
                          </p>
                        </div>
                      )}
                    {displayData?.value && (
                      <p>
                        <strong>Partner:</strong> {displayData.value}
                      </p>
                    )}
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="capitalize">{displayData?.status}</span>
                    </p>
                    {rewardData && (
                      <>
                        <p>
                          <strong>Contest:</strong>{" "}
                          {rewardData.contest?.name ||
                            displayData?.contest_title}
                        </p>
                        {rewardData.claimed_at && (
                          <p>
                            <strong>Claimed:</strong>{" "}
                            {new Date(rewardData.claimed_at).toLocaleString()}
                          </p>
                        )}
                        {displayData?.valid_till && (
                          <p>
                            <strong>Valid Till:</strong>{" "}
                            {new Date(
                              displayData.valid_till
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* How to Redeem Section */}
          {(voucherData?.redemption_steps ||
            (displayData?.reward_type === "marchandise" &&
              (displayData?.product as { redemption_instructions?: string })
                ?.redemption_instructions)) && (
            <div className="border-t border-gray-200">
              <button
                onClick={() => toggleSection("redeem")}
                className="w-full flex items-center justify-between py-4"
              >
                <span className="font-semibold text-gray-900">
                  How to redeem
                </span>
                {expandedSection === "redeem" ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {expandedSection === "redeem" && (
                <div className="pb-4">
                  {voucherData?.redemption_steps ? (
                    <ol className="space-y-2">
                      {voucherData.redemption_steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-gray-900 font-medium text-sm">
                            {index + 1}.
                          </span>
                          <span className="text-gray-600 text-sm flex-1">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : displayData?.reward_type === "marchandise" &&
                    (
                      displayData?.product as {
                        redemption_instructions?: string;
                      }
                    )?.redemption_instructions ? (
                    <div
                      className="text-gray-600 text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: (
                          displayData.product as {
                            redemption_instructions: string;
                          }
                        ).redemption_instructions,
                      }}
                    />
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* Terms & Conditions Section */}
          {(voucherData?.terms_conditions ||
            displayData?.terms ||
            (displayData?.reward_type === "marchandise" &&
              (displayData?.product as { terms_and_conditions?: string })
                ?.terms_and_conditions)) && (
            <div className="border-t border-gray-200">
              <button
                onClick={() => toggleSection("terms")}
                className="w-full flex items-center justify-between py-4"
              >
                <span className="font-semibold text-gray-900">
                  Terms & Conditions
                </span>
                {expandedSection === "terms" ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {expandedSection === "terms" && (
                <div className="pb-4 space-y-2">
                  {voucherData?.terms_conditions ? (
                    voucherData.terms_conditions.map((term, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-gray-600 text-sm">•</span>
                        <span className="text-gray-600 text-sm flex-1">
                          {term}
                        </span>
                      </div>
                    ))
                  ) : displayData?.reward_type === "marchandise" &&
                    (displayData?.product as { terms_and_conditions?: string })
                      ?.terms_and_conditions ? (
                    <div
                      className="text-gray-600 text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: (
                          displayData.product as {
                            terms_and_conditions: string;
                          }
                        ).terms_and_conditions,
                      }}
                    />
                  ) : displayData?.terms ? (
                    <div className="text-gray-600 text-sm whitespace-pre-wrap">
                      {displayData.terms}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Copy Code Button (if code is shown) */}
      {showCode && displayData?.code && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={copyCode}
            className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7612] transition-colors"
          >
            Copy Code
          </button>
        </div>
      )}

      {/* Redeem Now Button for merchandise rewards */}
      {displayData?.reward_type === "marchandise" &&
        displayData?.status === "granted" &&
        !showCode && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <button
              onClick={handleRedeemMerchandise}
              disabled={isClaiming}
              className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7612] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClaiming ? "Redeeming..." : "Redeem Now"}
            </button>
          </div>
        )}
    </div>
  );
};

export default VoucherDetails;
