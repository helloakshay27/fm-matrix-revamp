import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import { scratchCardApi, ScratchCardData } from "@/services/scratchCardApi";
import { baseClient } from "@/utils/withoutTokenBase";

interface UserContestReward {
  id: number;
  contest: {
    id: number;
    title: string;
    description: string;
    contest_type: string;
    start_date: string;
    end_date: string;
    status: string;
  };
  prize: {
    id: number;
    title: string;
    description: string;
    image_url: string;
    value: string;
  };
  reward_code: string;
  claimed_at: string;
  status: string;
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
          const params: any = {};
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
      alert("Voucher code copied to clipboard!");
    }
  };

  // Use appropriate data based on which is available
  const displayData = rewardData
    ? {
        title: rewardData.prize?.title || "Voucher",
        description:
          rewardData.contest?.description ||
          rewardData.prize?.display_name ||
          "",
        image_url:
          rewardData.prize?.image?.url || rewardData.prize?.icon_url || null,
        value: rewardData.prize?.partner_name || "",
        code: rewardData.coupon_code || rewardData.prize?.coupon_code || "",
        status: rewardData.status,
        contest_title: rewardData.contest?.name || "Contest",
        valid_till: rewardData.contest?.end_at || "",
        terms: rewardData.contest?.terms_and_conditions || "",
      }
    : voucherData
      ? {
          title: voucherData.reward.title,
          description: voucherData.reward.description,
          image_url: voucherData.reward.image_url,
          value: voucherData.value,
          code: voucherData.voucher_code,
          status: voucherData.status,
          contest_title: voucherData.name,
          valid_till: voucherData.valid_until,
          terms: "",
        }
      : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#B88B15] animate-spin" />
      </div>
    );
  }

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

          {/* Voucher Code Section */}
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
          {voucherData?.redemption_steps && (
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
                </div>
              )}
            </div>
          )}

          {/* Terms & Conditions Section */}
          {(voucherData?.terms_conditions || displayData?.terms) && (
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
      {showCode && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={copyCode}
            className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7612] transition-colors"
          >
            Copy Code
          </button>
        </div>
      )}
    </div>
  );
};

export default VoucherDetails;
