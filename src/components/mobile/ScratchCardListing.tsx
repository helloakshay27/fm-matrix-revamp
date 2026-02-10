import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { newScratchCardApi, ScratchContest } from "@/services/newScratchCardApi";

export const ScratchCardListing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [scratchCards, setScratchCards] = useState<ScratchContest[]>([]);

  const orgId = searchParams.get("org_id") || "runwal";
  const token = searchParams.get("token") || "QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ";

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
    navigate(`/scratchcard?org_id=${orgId}&token=${token}&contest_id=${contestId}`);
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
            {scratchCards.map((card) => {
              const isActive = card.active && new Date(card.start_at) <= new Date() && new Date(card.end_at) >= new Date();
              const isExpired = new Date(card.end_at) < new Date();

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className="relative cursor-pointer"
                >
                  {/* Card Container */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                    {/* Background with gradient */}
                    <div
                      className={`absolute inset-0 ${isExpired
                        ? "bg-gradient-to-br from-gray-300 to-gray-400"
                        : isActive
                          ? "bg-gradient-to-br from-blue-400 to-blue-500"
                          : "bg-gradient-to-br from-amber-200 to-amber-300"
                        }`}
                    >
                      {/* Confetti pattern */}
                      <div className="absolute inset-0 opacity-30">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute text-xs"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                          >
                            {
                              ["🎁", "🎉", "⭐", "🎊"][
                              Math.floor(Math.random() * 4)
                              ]
                            }
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Center Icon/Symbol */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-4xl">
                          {isExpired ? "🎟️" : "🎁"}
                        </div>
                      </div>
                    </div>

                    {/* Badge for status */}
                    {isActive && !isExpired && (
                      <div className="absolute top-2 right-2 bg-[#B88B15] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Active
                      </div>
                    )}

                    {/* Expired badge */}
                    {isExpired && (
                      <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Expired
                      </div>
                    )}

                    {/* Attempts badge */}
                    {card.attemp_required && (
                      <div className="absolute bottom-2 left-2 bg-white/90 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
                        {card.attemp_required} {card.attemp_required === 1 ? 'Attempt' : 'Attempts'}
                      </div>
                    )}
                  </div>

                  {/* Card info below */}
                  <div className="mt-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {card.name}
                    </h3>
                    {card.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {card.description}
                      </p>
                    )}
                    {card.prizes && card.prizes.length > 0 && (
                      <p className="text-xs text-[#B88B15] font-semibold mt-1">
                        {card.prizes.length} {card.prizes.length === 1 ? 'Prize' : 'Prizes'} Available
                      </p>
                    )}
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
