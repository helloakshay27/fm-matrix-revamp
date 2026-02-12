import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import {
  newFlipCardApi,
  FlipContest,
  FlipCard as FlipCardType,
  Prize,
} from "@/services/newFlipCardApi";
import { toast } from "sonner";

export const FlipCard: React.FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();

  // Get URL parameters
  const orgId = searchParams.get("org_id");
  const token = searchParams.get("token");
  const urlContestId = searchParams.get("contest_id") || gameId;

  console.warn("🎯 FlipCard Component Params:", {
    orgId,
    token: token ? "exists" : "missing",
    contest_id_from_query: searchParams.get("contest_id"),
    gameId_from_route: gameId,
    final_urlContestId: urlContestId,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [contestData, setContestData] = useState<FlipContest | null>(null);
  const [cards, setCards] = useState<FlipCardType[]>([]);
  const [flippingCard, setFlippingCard] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  useEffect(() => {
    const fetchContestData = async () => {
      setIsLoading(true);
      try {
        let data: FlipContest;

        // If contest_id is provided, fetch specific contest
        if (urlContestId) {
          data = await newFlipCardApi.getContestById(urlContestId);
        } else {
          // Otherwise, fetch all flip contests and use the first one
          console.warn("⚠️ No contest ID provided, fetching all flip contests");
          const contests = await newFlipCardApi.getContests();

          if (contests.length === 0) {
            console.error("❌ No flip contests available");
            setIsLoading(false);
            return;
          }

          data = contests[0];
          console.warn("✅ Using first flip contest:", data);
        }

        setContestData(data);

        // Convert prizes to cards based on attempt_required
        const attemptsRequired = data.attemp_required || 3;
        const flipCards = newFlipCardApi.convertPrizesToCards(
          data.prizes,
          attemptsRequired
        );
        setCards(flipCards);
        setRemainingAttempts(attemptsRequired);
      } catch (error) {
        console.error("❌ Error fetching contest data:", error);
        if (error instanceof Error) {
          console.error("❌ Error message:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestData();
  }, [urlContestId, orgId, token]);

  const handleCardClick = async (card: FlipCardType) => {
    if (
      card.is_flipped ||
      flippingCard !== null ||
      remainingAttempts <= 0 ||
      !contestData
    )
      return;

    setFlippingCard(card.id);

    try {
      // Call API to play/flip
      const result = await newFlipCardApi.playContest(contestData.id);

      if (!result.success || !result.prize || !result.user_contest_reward) {
        throw new Error(result.message || "Failed to flip card");
      }

      // Update card to flipped state with won prize
      setCards((prev) =>
        prev.map((c) =>
          c.id === card.id
            ? { ...c, is_flipped: true, prize: result.prize! }
            : c
        )
      );

      // Update remaining attempts
      setRemainingAttempts((prev) => prev - 1);

      // Show result modal after animation
      setTimeout(() => {
        setWonPrize(result.prize!);
        setShowResult(true);
        setFlippingCard(null);

        // Store user_contest_reward.id in localStorage for details page
        localStorage.setItem(
          "last_reward_id",
          result.user_contest_reward!.id.toString()
        );
      }, 600);
    } catch (error) {
      console.error("❌ Error flipping card:", error);
      const message =
        error instanceof Error ? error.message : "Failed to flip card";
      toast.error(message);
      setFlippingCard(null);
    }
  };

  // Copy prize information
  const copyPrizeInfo = () => {
    if (wonPrize) {
      const textToCopy =
        wonPrize.reward_type === "coupon"
          ? wonPrize.coupon_code || wonPrize.title
          : `${wonPrize.title} - ${wonPrize.points_value} points`;

      navigator.clipboard.writeText(textToCopy);
      toast.success("Prize information copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#B88B15] animate-spin" />
      </div>
    );
  }

  if (!contestData || cards.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Contest not found or has no prizes
          </p>
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
        {/* Title */}
        <p className="text-center text-gray-700 text-sm mb-6">
          Tap on the card to reveal the rewards
        </p>

        {/* Remaining Attempts */}
        <div className="text-center mb-8">
          <span className="inline-block bg-[#FFF8E7] border border-[#D4A574] rounded-full px-4 py-2 text-sm font-semibold text-gray-900">
            Attempts Remaining: {remainingAttempts}
          </span>
        </div>

        {/* Cards Grid */}
        <div className="space-y-4 max-w-md mx-auto">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={
                card.is_flipped ||
                flippingCard !== null ||
                remainingAttempts <= 0
              }
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
                        {card.prize.title}
                      </h3>

                      {/* Value */}
                      <p className="text-3xl font-bold text-gray-900 mb-2">
                        {card.prize.reward_type === "coupon"
                          ? card.prize.partner_name || "Coupon"
                          : `${card.prize.points_value} Points`}
                      </p>

                      {/* Code or Details */}
                      {card.prize.reward_type === "coupon" &&
                        card.prize.coupon_code && (
                          <p className="text-sm text-gray-600">
                            Code{" "}
                            <span className="font-semibold">
                              {card.prize.coupon_code}
                            </span>
                          </p>
                        )}
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

      {/* Result Modal */}
      {showResult && wonPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowResult(false);
                setWonPrize(null);
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Gift icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-[#F5E6D3] rounded-full flex items-center justify-center">
              <div className="text-4xl">🎁</div>
            </div>

            {/* Congratulations text */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Congratulations!
            </h2>

            {/* Won prize text */}
            <p className="text-center text-gray-600 mb-2">You've won</p>

            <p className="text-center text-2xl font-bold text-gray-900 mb-6">
              {wonPrize.title}
            </p>

            {/* Display prize details based on type */}
            {wonPrize.reward_type === "coupon" && wonPrize.coupon_code && (
              <>
                {/* Coupon Code label */}
                <p className="text-center text-gray-600 mb-3">Coupon Code</p>

                {/* Coupon code */}
                <p className="text-center text-xl font-bold text-gray-900 mb-3 tracking-wider">
                  {wonPrize.coupon_code}
                </p>

                {/* Partner name if available */}
                {wonPrize.partner_name && (
                  <p className="text-center text-sm text-gray-500 mb-6">
                    Partner: {wonPrize.partner_name}
                  </p>
                )}
              </>
            )}

            {wonPrize.reward_type === "points" && wonPrize.points_value && (
              <p className="text-center text-lg text-gray-600 mb-6">
                {wonPrize.points_value} Loyalty Points
              </p>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={copyPrizeInfo}
                className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7612] transition-colors"
              >
                Copy To Clipboard
              </button>
              <button
                onClick={() => {
                  const rewardId = localStorage.getItem("last_reward_id");
                  if (rewardId && orgId && token) {
                    navigate(
                      `/scratchcard/details/${rewardId}?org_id=${orgId}&token=${token}`
                    );
                  }
                }}
                className="w-full border-2 border-[#B88B15] text-[#B88B15] py-4 rounded-lg font-semibold hover:bg-[#FFF8E7] transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

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
