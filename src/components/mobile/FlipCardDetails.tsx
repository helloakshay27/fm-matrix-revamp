import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import { flipCardApi, FlipCard } from "@/services/flipCardApi";

export const FlipCardDetails: React.FC = () => {
  const navigate = useNavigate();
  const { gameId, cardId } = useParams<{ gameId: string; cardId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState<FlipCard | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "details"
  );

  useEffect(() => {
    const fetchCardData = async () => {
      if (!gameId || !cardId) return;

      setIsLoading(true);
      try {
        const data = await flipCardApi.getCardDetails(
          Number(gameId),
          Number(cardId)
        );
        setCardData(data);
      } catch (error) {
        console.error("Error fetching card details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardData();
  }, [gameId, cardId]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const copyCode = () => {
    if (cardData) {
      navigator.clipboard.writeText(cardData.reward.voucher_code);
      alert("Voucher code copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#B88B15] animate-spin" />
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Card not found</p>
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
            Move In Celebration
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Voucher Card */}
        <div className="bg-[#FFF8E7] border-2 border-[#D4A574] rounded-2xl p-6 mb-6">
          {/* Gift icon */}
          <div className="text-center mb-4">
            <div className="text-6xl inline-block">🎁</div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            {cardData.reward.title}
          </h2>

          {/* Value */}
          <p className="text-3xl font-bold text-gray-900 text-center mb-3">
            {cardData.reward.value}
          </p>

          {/* Code */}
          <p className="text-center text-sm text-gray-600">
            Code{" "}
            <span className="font-semibold tracking-wider">
              {cardData.reward.voucher_code}
            </span>
          </p>
        </div>

        {/* Details Section */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => toggleSection("details")}
            className="w-full flex items-center justify-between py-4"
          >
            <span className="font-semibold text-gray-900 text-lg">Details</span>
            {expandedSection === "details" ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {expandedSection === "details" && (
            <div className="pb-4 space-y-2">
              {cardData.details.map((detail, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-gray-600 text-sm">•</span>
                  <span className="text-gray-600 text-sm flex-1">{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terms & Conditions Section */}
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
            <div className="pb-4 space-y-2">
              {cardData.terms_conditions.map((term, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-gray-600 text-sm">•</span>
                  <span className="text-gray-600 text-sm flex-1">{term}</span>
                </div>
              ))}
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
