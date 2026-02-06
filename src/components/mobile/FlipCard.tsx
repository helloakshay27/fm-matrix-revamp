import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  flipCardApi,
  FlipCardData,
  FlipCard as FlipCardType,
} from "@/services/flipCardApi";

export const FlipCard: React.FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<FlipCardData | null>(null);
  const [flippingCard, setFlippingCard] = useState<number | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      setIsLoading(true);
      try {
        const data = await flipCardApi.getFlipCardGame(gameId);
        setGameData(data);
      } catch (error) {
        console.error("Error fetching flip card game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]);

  const handleCardClick = async (card: FlipCardType) => {
    if (card.is_flipped || flippingCard !== null) return;

    setFlippingCard(card.id);

    try {
      if (gameData) {
        await flipCardApi.flipCard(gameData.id, card.id);

        // Update local state
        setGameData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            cards: prev.cards.map((c) =>
              c.id === card.id ? { ...c, is_flipped: true } : c
            ),
          };
        });

        // Navigate to details after a delay
        setTimeout(() => {
          navigate(`/flipcard/${gameData.id}/card/${card.id}`);
        }, 600);
      }
    } catch (error) {
      console.error("Error flipping card:", error);
    } finally {
      setFlippingCard(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#B88B15] animate-spin" />
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Game not found</p>
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
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Instructions */}
        <p className="text-center text-gray-700 mb-8">{gameData.description}</p>

        {/* Cards Grid */}
        <div className="space-y-4 max-w-md mx-auto">
          {gameData.cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={card.is_flipped || flippingCard !== null}
              className="w-full perspective-1000"
            >
              <div
                className={`relative transition-all duration-600 transform-style-3d ${
                  flippingCard === card.id ? "rotate-y-180" : ""
                }`}
              >
                {/* Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  {card.is_flipped ? (
                    // Revealed Card
                    <div className="bg-[#FFF8E7] border-2 border-[#D4A574] p-6 min-h-[180px] flex flex-col items-center justify-center">
                      {/* Gift icon */}
                      <div className="text-5xl mb-3">🎁</div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {card.reward.title}
                      </h3>

                      {/* Value */}
                      <p className="text-3xl font-bold text-gray-900 mb-2">
                        {card.reward.value}
                      </p>

                      {/* Code */}
                      <p className="text-sm text-gray-600">
                        Code{" "}
                        <span className="font-semibold">
                          {card.reward.voucher_code}
                        </span>
                      </p>
                    </div>
                  ) : (
                    // Unflipped Card - Golden gradient
                    <div className="relative min-h-[180px] flex flex-col items-center justify-center bg-gradient-to-br from-[#8B6914] via-[#D4A574] to-[#8B6914] p-6">
                      {/* Radial glow effect */}
                      <div
                        className="absolute inset-0 bg-gradient-radial from-[#F5E6D3] via-transparent to-transparent opacity-50"
                        style={{
                          background:
                            "radial-gradient(circle at center, rgba(245, 230, 211, 0.6) 0%, rgba(245, 230, 211, 0.3) 30%, transparent 60%)",
                        }}
                      />

                      {/* Gift icon */}
                      <div className="relative z-10 text-6xl mb-4 drop-shadow-lg">
                        🎁
                      </div>

                      {/* Text */}
                      <p className="relative z-10 text-white text-lg font-semibold drop-shadow-md">
                        Tap to reveal
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, rgba(245, 230, 211, 0.6) 0%, rgba(245, 230, 211, 0.3) 30%, transparent 60%);
        }
      `}</style>
    </div>
  );
};

export default FlipCard;
