import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import { scratchCardApi, ScratchCardData } from "@/services/scratchCardApi";

export const VoucherDetails: React.FC = () => {
  const navigate = useNavigate();
  const { cardId } = useParams<{ cardId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [voucherData, setVoucherData] = useState<ScratchCardData | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const fetchVoucherData = async () => {
      if (!cardId) return;

      setIsLoading(true);
      try {
        const data = await scratchCardApi.getScratchCardById(cardId);
        setVoucherData(data);
      } catch (error) {
        console.error("Error fetching voucher data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoucherData();
  }, [cardId]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleGetCode = () => {
    setShowCode(!showCode);
  };

  const copyCode = () => {
    if (voucherData) {
      navigator.clipboard.writeText(voucherData.voucher_code);
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

  if (!voucherData) {
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
        <div className="w-full bg-[#F5E6D3] px-4 py-8">
          <img
            src={
              voucherData.reward.image_url ||
              "https://via.placeholder.com/400x300"
            }
            alt={voucherData.reward.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {/* Voucher Info */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {voucherData.reward.title}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {voucherData.reward.description}
          </p>

          {/* Voucher Code Section */}
          <div className="bg-[#F5E6D3] rounded-lg p-3 flex items-center justify-between mb-4">
            <span className="text-gray-900 font-mono tracking-wider">
              {showCode ? voucherData.voucher_code : "•".repeat(15)}
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
                {voucherData.details.map((detail, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-gray-600 text-sm">•</span>
                    <span className="text-gray-600 text-sm flex-1">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How to Redeem Section */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => toggleSection("redeem")}
              className="w-full flex items-center justify-between py-4"
            >
              <span className="font-semibold text-gray-900">How to redeem</span>
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

          {/* Terms & Conditions Section */}
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
                {voucherData.terms_conditions.map((term, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-gray-600 text-sm">•</span>
                    <span className="text-gray-600 text-sm flex-1">{term}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Illustration */}
          <div className="mt-8 flex justify-center px-4 pb-8">
            {/* Boxing Day Illustration */}
            <div className="relative w-full max-w-xs">
              <svg viewBox="0 0 250 150" className="w-full h-auto">
                {/* Background stars/sparkles */}
                <g opacity="0.4">
                  <text x="30" y="30" fontSize="16" fill="#FFD700">
                    ✨
                  </text>
                  <text x="200" y="40" fontSize="12" fill="#FFD700">
                    ✨
                  </text>
                  <text x="180" y="120" fontSize="14" fill="#FFD700">
                    ✨
                  </text>
                  <text x="220" y="80" fontSize="10" fill="#FFD700">
                    ⭐
                  </text>
                </g>

                {/* "BOXING DAY" Gift Box on left */}
                <g transform="translate(20, 60)">
                  {/* Gift box base */}
                  <rect
                    x="0"
                    y="30"
                    width="60"
                    height="50"
                    fill="#D4AF37"
                    stroke="#000"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="0"
                    y="30"
                    width="60"
                    height="50"
                    fill="url(#goldPattern)"
                    opacity="0.3"
                  />

                  {/* Ribbon vertical */}
                  <rect x="25" y="30" width="10" height="50" fill="#8B0000" />

                  {/* Gift box lid */}
                  <rect
                    x="-5"
                    y="20"
                    width="70"
                    height="15"
                    fill="#F4C430"
                    stroke="#000"
                    strokeWidth="1.5"
                  />

                  {/* Ribbon horizontal on lid */}
                  <rect x="-5" y="25" width="70" height="5" fill="#8B0000" />

                  {/* Bow */}
                  <circle cx="30" cy="22" r="6" fill="#8B0000" />
                  <circle cx="22" cy="20" r="5" fill="#8B0000" />
                  <circle cx="38" cy="20" r="5" fill="#8B0000" />

                  {/* "BOXING DAY" text */}
                  <text
                    x="30"
                    y="-10"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#000"
                    textAnchor="middle"
                  >
                    BOXING
                  </text>
                  <text
                    x="30"
                    y="2"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#000"
                    textAnchor="middle"
                  >
                    DAY
                  </text>
                  <text
                    x="30"
                    y="12"
                    fontSize="6"
                    fill="#666"
                    textAnchor="middle"
                  >
                    SPECIAL SALE
                  </text>
                </g>

                {/* Small pink gift boxes on bottom left */}
                <g transform="translate(10, 95)">
                  <rect
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    fill="#FFB6C1"
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <rect x="8" y="0" width="4" height="20" fill="#FF69B4" />
                  <rect x="0" y="8" width="20" height="4" fill="#FF69B4" />

                  <rect
                    x="25"
                    y="5"
                    width="15"
                    height="15"
                    fill="#FFB6C1"
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <rect x="30" y="5" width="5" height="15" fill="#FF69B4" />
                  <rect x="25" y="10" width="15" height="5" fill="#FF69B4" />
                </g>

                {/* Yellow gift box bottom left */}
                <g transform="translate(45, 100)">
                  <rect
                    x="0"
                    y="0"
                    width="18"
                    height="18"
                    fill="#FFD700"
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <rect x="7" y="0" width="4" height="18" fill="#FFA500" />
                  <rect x="0" y="7" width="18" height="4" fill="#FFA500" />
                </g>

                {/* Person carrying gift boxes on right */}
                <g transform="translate(140, 45)">
                  {/* Person body */}
                  <ellipse cx="25" cy="25" rx="12" ry="18" fill="#C8A870" />

                  {/* Person head */}
                  <circle cx="25" cy="10" r="8" fill="#D4A574" />

                  {/* Hair */}
                  <path
                    d="M 17 8 Q 17 2, 25 2 Q 33 2, 33 8 L 33 12 L 17 12 Z"
                    fill="#2C1810"
                  />

                  {/* Face features */}
                  <circle cx="22" cy="10" r="1" fill="#000" />
                  <circle cx="28" cy="10" r="1" fill="#000" />
                  <path
                    d="M 23 13 Q 25 14, 27 13"
                    stroke="#000"
                    strokeWidth="0.5"
                    fill="none"
                  />

                  {/* Arms holding boxes */}
                  <rect
                    x="8"
                    y="20"
                    width="4"
                    height="15"
                    fill="#C8A870"
                    rx="2"
                  />
                  <rect
                    x="33"
                    y="20"
                    width="4"
                    height="15"
                    fill="#C8A870"
                    rx="2"
                  />

                  {/* Legs */}
                  <rect
                    x="18"
                    y="40"
                    width="5"
                    height="20"
                    fill="#2C3E50"
                    rx="2"
                  />
                  <rect
                    x="27"
                    y="40"
                    width="5"
                    height="20"
                    fill="#2C3E50"
                    rx="2"
                  />

                  {/* Shoes */}
                  <ellipse cx="20" cy="62" rx="4" ry="2" fill="#000" />
                  <ellipse cx="29" cy="62" rx="4" ry="2" fill="#000" />

                  {/* Gift boxes being carried */}
                  <g transform="translate(-8, 12)">
                    {/* Blue/yellow box */}
                    <rect
                      x="0"
                      y="0"
                      width="25"
                      height="18"
                      fill="#4169E1"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    <rect x="10" y="0" width="5" height="18" fill="#FFD700" />
                    <rect x="0" y="7" width="25" height="4" fill="#FFD700" />

                    {/* Yellow box on top */}
                    <rect
                      x="5"
                      y="-12"
                      width="20"
                      height="15"
                      fill="#FFD700"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    <rect x="12" y="-12" width="6" height="15" fill="#FF69B4" />
                    <rect x="5" y="-6" width="20" height="4" fill="#FF69B4" />

                    {/* Ribbon bow */}
                    <circle cx="15" cy="-14" r="3" fill="#FF1493" />
                  </g>
                </g>

                {/* Scattered gift emojis */}
                <text x="200" y="135" fontSize="14" opacity="0.6">
                  🎁
                </text>
                <text x="70" y="25" fontSize="12" opacity="0.5">
                  🎁
                </text>

                {/* Pattern definition */}
                <defs>
                  <pattern
                    id="goldPattern"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="10" height="10" fill="none" />
                    <path
                      d="M 0 5 L 5 0 L 10 5 L 5 10 Z"
                      fill="#FFD700"
                      opacity="0.3"
                    />
                  </pattern>
                </defs>
              </svg>
            </div>
          </div>
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
