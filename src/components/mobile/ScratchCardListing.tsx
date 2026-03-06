import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  newScratchCardApi,
  ScratchContest,
} from "@/services/newScratchCardApi";

export const ScratchCardListing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [scratchCards, setScratchCards] = useState<ScratchContest[]>([]);

  const orgId = searchParams.get("org_id") || "runwal";
  const token =
    searchParams.get("token") || "QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ";

  useEffect(() => {
    const fetchScratchCards = async () => {
      setIsLoading(true);
      try {
        // Initialize API with dynamic base URL and token
        newScratchCardApi.initialize(orgId, token);

        // Fetch all contests (API will filter scratch type)
        const contests = await newScratchCardApi.getContests();
        setScratchCards(contests);

        console.warn("✅ Loaded scratch contests:", contests);
      } catch (error) {
        console.error("Error fetching scratch cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScratchCards();
  }, [orgId, token]);

  const handleCardClick = (contestId: number) => {
    navigate(
      `/scratchcard?org_id=${orgId}&token=${token}&contest_id=${contestId}`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#B88B15] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Scratch Cards</h1>
        </div>
      </div>

      {/* No contests message */}
      {!isLoading && scratchCards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Scratch Cards Available
          </h3>
          <p className="text-sm text-gray-600 text-center">
            Check back later for exciting scratch card contests!
          </p>
        </div>
      )}

      {/* Grid of Scratch Cards */}
      {scratchCards.length > 0 && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {scratchCards.map((card, index) => {
              const isActive =
                card.active &&
                new Date(card.start_at) <= new Date() &&
                new Date(card.end_at) >= new Date();
              const isExpired = new Date(card.end_at) < new Date();
              const isNew =
                new Date(card.created_at) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Created within last 7 days

              // Calculate days left
              const daysLeft = isExpired
                ? 0
                : Math.ceil(
                    (new Date(card.end_at).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  );

              // Alternate colors for visual variety
              const colorIndex = index % 4;
              const cardColors = [
                "bg-gradient-to-br from-[#4A90E2] to-[#357ABD]", // Blue
                "bg-gradient-to-br from-[#F5A623] to-[#E89B1D]", // Golden
                "bg-gradient-to-br from-[#5B9DD9] to-[#4A8BC2]", // Light Blue
                "bg-gradient-to-br from-gray-300 to-gray-400", // Gray for expired
              ];

              const bgColor = isExpired
                ? cardColors[3]
                : cardColors[colorIndex % 3];

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className="relative cursor-pointer"
                >
                  {/* Card Container */}
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    {/* Main card with aspect ratio */}
                    <div className="relative aspect-[4/3]">
                      {/* Background with gradient */}
                      <div className={`absolute inset-0 ${bgColor}`}>
                        {/* Confetti/dots pattern */}
                        <div className="absolute inset-0 opacity-20">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 bg-black/30 rounded-full"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Horizontal stripes for depth */}
                      <div className="absolute inset-0 flex flex-col">
                        <div className="flex-1 bg-black/5"></div>
                        <div className="flex-1 bg-transparent"></div>
                        <div className="flex-1 bg-black/5"></div>
                      </div>

                      {/* Center Icon Circle */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {/* Outer circle */}
                          <div className="w-24 h-24 rounded-full bg-black/20 flex items-center justify-center">
                            {/* Inner icon */}
                            <div className="text-white/90">
                              {colorIndex % 3 === 0 ? (
                                // Gift box icon
                                <svg
                                  className="w-12 h-12"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <rect
                                    x="3"
                                    y="10"
                                    width="18"
                                    height="10"
                                    rx="1"
                                  />
                                  <path d="M3 10V8c0-.6.4-1 1-1h16c.6 0 1 .4 1 1v2" />
                                  <path
                                    d="M12 7V20"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <path d="M12 7c0-1.7-1.3-3-3-3S6 5.3 6 7h6z" />
                                  <path d="M12 7c0-1.7 1.3-3 3-3s3 1.3 3 3h-6z" />
                                </svg>
                              ) : (
                                // Percentage/coupon icon
                                <svg
                                  className="w-12 h-12"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <rect
                                    x="2"
                                    y="6"
                                    width="20"
                                    height="12"
                                    rx="2"
                                  />
                                  <path d="M8 10h2v4H8z" />
                                  <path d="M14 10h2v4h-2z" />
                                  <circle
                                    cx="22"
                                    cy="12"
                                    r="1.5"
                                    fill="white"
                                  />
                                  <circle cx="2" cy="12" r="1.5" fill="white" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status badge - top right */}
                      {isExpired ? (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                          Expired
                        </div>
                      ) : isNew ? (
                        <div className="absolute top-2 right-2 bg-[#4CAF50] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                          New
                        </div>
                      ) : daysLeft <= 7 ? (
                        <div className="absolute top-2 right-2 bg-[#FF9800] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                          {daysLeft}d Left
                        </div>
                      ) : null}
                    </div>

                    {/* Info section below card */}
                    <div className="bg-white p-3 border-t-2 border-gray-100">
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">
                        {card.name}
                      </h3>
                      <p className="text-[11px] text-gray-600 line-clamp-2 leading-tight">
                        {card.description || "Scratch to win exciting prizes!"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchCardListing;
