import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import baseClient from "@/utils/withoutTokenBase";

interface Prize {
  id: number;
  title: string;
  display_name: string | null;
  reward_type: "points" | "coupon";
  coupon_code: string | null;
  partner_name: string | null;
  points_value: number | null;
  position: number;
  active: boolean;
}

interface Contest {
  id: number;
  name: string;
  description: string | null;
  terms_and_conditions: string | null;
  content_type: string;
  active: boolean;
  start_at: string;
  end_at: string;
}

interface UserContestReward {
  id: number;
  reward_type: "points" | "coupon";
  status: string;
  points_value: number | null;
  coupon_code: string | null;
  created_at: string;
  contest: Contest;
  prize: Prize;
}

export const FlipCardDetails: React.FC = () => {
  const navigate = useNavigate();
  const { rewardId } = useParams<{ rewardId: string }>();
  const [searchParams] = useSearchParams();

  // Get token from URL or localStorage
  const token = searchParams.get("token") || localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState(true);
  const [rewardData, setRewardData] = useState<UserContestReward | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("details");

  useEffect(() => {
    const fetchRewardData = async () => {
      if (!rewardId) {
        console.error("❌ No reward ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const url = `https://runwal-api.lockated.com/user_contest_rewards/${rewardId}`;
        const params = token ? { token } : {};

        console.warn("🌐 Fetching reward details:", url);

        const response = await baseClient.get<UserContestReward>(url, { params });

        console.warn("✅ Reward data received:", response.data);
        setRewardData(response.data);
      } catch (error) {
        console.error("❌ Error fetching reward data:", error);
        if (error instanceof Error) {
          console.error("❌ Error message:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewardData();
  }, [rewardId, token]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const copyCode = () => {
    if (rewardData) {
      const textToCopy = rewardData.reward_type === "coupon"
        ? rewardData.coupon_code || rewardData.prize.title
        : `${rewardData.prize.title} - ${rewardData.points_value} points`;

      navigator.clipboard.writeText(textToCopy);
      alert("Code copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#B88B15] animate-spin" />
      </div>
    );
  }

  if (!rewardData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Reward not found</p>
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
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center text-sm font-medium tracking-wider text-gray-900 uppercase pr-10">
            {rewardData.contest.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Reward Card */}
        <div className="bg-[#FFF8E7] border-2 border-[#D4A574] rounded-2xl p-6 mb-6">
          {/* Gift icon */}
          <div className="text-center mb-4">
            <div className="text-6xl inline-block">🎁</div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            {rewardData.prize.title}
          </h2>

          {/* Value */}
          <p className="text-3xl font-bold text-gray-900 text-center mb-3">
            {rewardData.reward_type === "coupon"
              ? rewardData.prize.partner_name || "Coupon"
              : `${rewardData.points_value} Points`}
          </p>

          {/* Code */}
          {rewardData.reward_type === "coupon" && rewardData.coupon_code && (
            <p className="text-center text-sm text-gray-600">
              Code{" "}
              <span className="font-semibold tracking-wider">
                {rewardData.coupon_code}
              </span>
            </p>
          )}

          {/* Status */}
          <div className="mt-4 pt-4 border-t border-[#D4A574]">
            <p className="text-center text-xs text-gray-600">
              Status:{" "}
              <span className="font-semibold capitalize">
                {rewardData.status}
              </span>
            </p>
            <p className="text-center text-xs text-gray-500 mt-1">
              Won on {new Date(rewardData.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Terms & Conditions Section */}
        {rewardData.contest.terms_and_conditions && (
          <div className="border-t border-gray-200">
            <button
              onClick={() => toggleSection("terms")}
              className="w-full flex items-center justify-between py-4"
            >
              <span className="font-semibold text-gray-900 text-lg">
                Terms & Conditions
              </span>
              {expandedSection === "terms" ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {expandedSection === "terms" && (
              <div className="pb-4">
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {rewardData.contest.terms_and_conditions}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contest Period */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => toggleSection("details")}
            className="w-full flex items-center justify-between py-4"
          >
            <span className="font-semibold text-gray-900 text-lg">Contest Details</span>
            {expandedSection === "details" ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {expandedSection === "details" && (
            <div className="pb-4 space-y-2">
              {rewardData.contest.description && (
                <p className="text-gray-600 text-sm">{rewardData.contest.description}</p>
              )}
              <div className="text-sm text-gray-600">
                <p>Start: {new Date(rewardData.contest.start_at).toLocaleDateString()}</p>
                <p>End: {new Date(rewardData.contest.end_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Copy Code Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={copyCode}
          className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#9a7612] transition-colors"
        >
          Copy Code
        </button>
      </div>
    </div>
  );
};

export default FlipCardDetails;
