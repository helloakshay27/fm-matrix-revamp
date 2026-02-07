import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { scratchCardApi, ScratchCardListItem } from "@/services/scratchCardApi";

export const ScratchCardListing: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [scratchCards, setScratchCards] = useState<ScratchCardListItem[]>([]);

  useEffect(() => {
    const fetchScratchCards = async () => {
      setIsLoading(true);
      try {
        const history = await scratchCardApi.getScratchCardHistory();
        setScratchCards(history);
      } catch (error) {
        console.error("Error fetching scratch cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScratchCards();
  }, []);

  const handleCardClick = (cardId: number) => {
    navigate(`/scratchcard/${cardId}`);
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
        </div>
      </div>

      {/* Grid of Scratch Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {scratchCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="relative cursor-pointer"
            >
              {/* Card Container */}
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                {/* Background with gradient */}
                <div
                  className={`absolute inset-0 ${
                    card.is_scratched
                      ? "bg-gradient-to-br from-amber-200 to-amber-300"
                      : "bg-gradient-to-br from-blue-400 to-blue-500"
                  }`}
                >
                  {/* Confetti pattern */}
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 20 }).map((_, i) => (
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
                      {card.is_scratched ? "🎟️" : "🎁"}
                    </div>
                  </div>
                </div>

                {/* Badge for time left */}
                {!card.is_scratched && (
                  <div className="absolute top-2 right-2 bg-[#B88B15] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    7d Left
                  </div>
                )}

                {/* Expired badge */}
                {card.is_scratched &&
                  new Date(card.valid_until) < new Date() && (
                    <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Expired
                    </div>
                  )}
              </div>

              {/* Card info below (only for promotional offers) */}
              {card.is_scratched && card.id > 5 && (
                <div className="mt-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                    {card.reward_title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">₹1 - ₹30</p>
                  <p className="text-xs text-gray-500 mt-1">
                    cashback on merchant payment
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* New promotional cards with product images */}
          <div
            onClick={() => navigate("/scratchcard/10")}
            className="relative cursor-pointer"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-amber-100 to-orange-200">
              {/* Product image placeholder */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-5xl mb-2">💐</div>
                  <p className="text-xs font-bold text-gray-800">PERFUME</p>
                </div>
              </div>

              {/* New badge */}
              <div className="absolute top-2 right-2 bg-[#B88B15] text-white text-xs font-semibold px-3 py-1 rounded-full">
                New
              </div>
            </div>

            <div className="mt-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900">
                Perfumes @ ₹1
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Worth of ₹455 | Shipping Charges Applied
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate("/scratchcard/11")}
            className="relative cursor-pointer"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-purple-200 to-pink-200">
              {/* Product image placeholder */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-5xl mb-2">🍕</div>
                  <p className="text-xs font-bold text-gray-800">FOOD</p>
                </div>
              </div>

              {/* New badge */}
              <div className="absolute top-2 right-2 bg-[#B88B15] text-white text-xs font-semibold px-3 py-1 rounded-full">
                New
              </div>
            </div>

            <div className="mt-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900">
                Flat ₹100 off
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                on 1st Order + Free Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScratchCardListing;
