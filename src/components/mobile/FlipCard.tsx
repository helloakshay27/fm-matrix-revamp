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

interface PlayContestResult {
  success: boolean;
  contest_type: string;
  user_contest_reward: {
    id: number;
    contest_id: number;
    prize_id: number;
    reward_type: string;
    points_value: number | null;
    coupon_code: string | null;
    user_id: number;
    status: string;
    created_at: string;
    updated_at: string;
  } | null;
  prize: Prize;
  message?: string;
  won_reward?: boolean;
  user_attempt_count?: number;
  user_attemp_remaining?: number;
}

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
        // Contest ID is required
        if (!urlContestId) {
          console.error("❌ No contest ID provided");
          setIsLoading(false);
          return;
        }

        // Fetch specific contest by ID
        const data = await newFlipCardApi.getContestById(urlContestId);
        setContestData(data);

        // Convert prizes to cards based on attempt_required
        const attemptsRequired = data.user_attemp_remaining || 3;
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
      const result = (await newFlipCardApi.playContest(
        contestData.id
      )) as PlayContestResult;

      if (!result.success || !result.prize) {
        throw new Error(result.message || "Failed to flip card");
      }

      // Update contest data won_reward if user actually won a reward
      if (result.won_reward === true && result.user_contest_reward) {
        setContestData((prev) =>
          prev
            ? {
                ...prev,
                won_reward: true,
                user_contest_reward: result.user_contest_reward,
              }
            : prev
        );
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

      // Show reward section first, then modal after animation
      setTimeout(() => {
        setWonPrize(result.prize!);
        setFlippingCard(null);

        // Store user_contest_reward.id in localStorage for details page (only if exists)
        if (result.user_contest_reward) {
          localStorage.setItem(
            "last_reward_id",
            result.user_contest_reward.id.toString()
          );
        }

        // Show result modal after reward section appears
        setTimeout(() => {
          setShowResult(true);
        }, 800);
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
      {/* Already Won Reward Screen */}
      {contestData.won_reward && contestData.user_contest_reward && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#FFF8E7] via-white to-[#F5E6D3]">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 text-gray-700 hover:bg-white/50 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Celebration Animation */}
          <div className="mb-6 relative">
            <div className="w-32 h-32 bg-gradient-to-br from-[#B88B15] to-[#D4A574] rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-6xl">🎉</span>
            </div>
            {/* Sparkles */}
            <span className="absolute -top-2 -left-2 text-3xl animate-bounce">
              ✨
            </span>
            <span className="absolute -top-2 -right-2 text-3xl animate-bounce delay-100">
              ✨
            </span>
            <span className="absolute -bottom-2 -left-2 text-3xl animate-bounce delay-200">
              ✨
            </span>
            <span className="absolute -bottom-2 -right-2 text-3xl animate-bounce delay-300">
              ✨
            </span>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
            You've Already Won!
          </h1>
          <p className="text-gray-600 text-center mb-8 max-w-sm">
            Congratulations! You have already won a reward in this contest. View
            your prize details below.
          </p>

          {/* Reward Info Card */}
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-[#D4A574]">
            <div className="text-center">
              <div className="text-5xl mb-3">🎁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {contestData.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Reward Status:{" "}
                <span className="font-semibold text-[#B88B15] capitalize">
                  {contestData.user_contest_reward.status}
                </span>
              </p>
            </div>
          </div>

          {/* View Details Button */}
          <button
            onClick={() => {
              if (contestData.user_contest_reward && orgId && token) {
                navigate(
                  `/scratchcard/details/${contestData.user_contest_reward.id}?org_id=${orgId}&token=${token}`
                );
              }
            }}
            className="w-full max-w-sm bg-gradient-to-r from-[#B88B15] to-[#D4A574] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            <span className="flex items-center justify-center gap-2">
              <span>🎯</span>
              View Reward Details
            </span>
          </button>

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 text-4xl opacity-20 animate-pulse">
            🎊
          </div>
          <div className="absolute top-20 right-10 text-4xl opacity-20 animate-pulse delay-100">
            🎈
          </div>
          <div className="absolute bottom-20 left-16 text-4xl opacity-20 animate-pulse delay-200">
            🎁
          </div>
          <div className="absolute bottom-10 right-16 text-4xl opacity-20 animate-pulse delay-300">
            ⭐
          </div>
        </div>
      )}

      {/* Normal Game Screen - only show if not won */}
      {!contestData.won_reward && (
        <>
          {/* Content */}
          <div className="px-4 py-6">
            {/* Title & Description Card */}
            <div className="w-full mb-6 bg-gradient-to-br from-[#FFF8E7] to-[#F5E6D3] rounded-2xl p-6 shadow-lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {contestData.name}
              </h1>
              {/* {contestData.description && (
            <p className="text-center text-gray-700 text-sm mb-4">
              {contestData.description}
            </p>
          )} */}
              {/* Contest Period */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <span className="bg-white/70 px-3 py-1.5 rounded-full">
                  📅 Valid:{" "}
                  {new Date(contestData.start_at).toLocaleDateString()} -{" "}
                  {new Date(contestData.end_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Title */}
            {/* <p className="text-center text-gray-600 text-sm mb-6">
          👆 Tap on the card to reveal the rewards
        </p> */}

            {/* Remaining Attempts */}
            <div className="mb-6 flex justify-center">
              <div className="bg-gradient-to-r from-[#B88B15] to-[#D4A574] text-white px-6 py-2 rounded-full shadow-md inline-block">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🎯</span>
                  <p className="text-sm font-semibold">
                    Attempts Remaining{" "}
                    <span className="text-xl font-bold">
                      {remainingAttempts}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="space-y-4 w-full">
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
                          {/* Gift icon - different for none type */}
                          <div className="text-5xl mb-3">
                            {card.prize.reward_type === "none" ? "😔" : "🎁"}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {card.prize.title}
                          </h3>

                          {/* Value - only show for non-none rewards */}
                          {card.prize.reward_type !== "none" && (
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                              {card.prize.reward_type === "coupon"
                                ? card.prize.partner_name || "Coupon"
                                : card.prize.reward_type === "points" &&
                                    card.prize.points_value
                                  ? `${card.prize.points_value} Points`
                                  : card.prize.reward_type === "marchandise"
                                    ? "Merchandise Prize"
                                    : "Prize"}
                            </p>
                          )}

                          {/* Better luck message for none type */}
                          {card.prize.reward_type === "none" && (
                            <p className="text-sm text-gray-600 text-center mt-2">
                              Try again for a chance to win!
                            </p>
                          )}

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

                {/* Gift icon - different for none type */}
                <div className="w-20 h-20 mx-auto mb-6 bg-[#F5E6D3] rounded-full flex items-center justify-center">
                  <div className="text-4xl">
                    {wonPrize.reward_type === "none" ? "😔" : "🎁"}
                  </div>
                </div>

                {/* Title text - different for none type */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  {wonPrize.reward_type === "none"
                    ? "Better Luck Next Time!"
                    : "Congratulations!"}
                </h2>

                {/* Description text - different for none type */}
                {wonPrize.reward_type !== "none" && (
                  <p className="text-center text-gray-600 mb-2">You've won</p>
                )}

                {/* Prize title - only show for non-none rewards */}
                {wonPrize.reward_type !== "none" && (
                  <p className="text-center text-2xl font-bold text-gray-900 mb-6">
                    {wonPrize.title}
                  </p>
                )}

                {/* Display prize details based on type */}
                {wonPrize.reward_type === "coupon" && wonPrize.coupon_code && (
                  <>
                    {/* Coupon Code label */}
                    <p className="text-center text-gray-600 mb-3">
                      Coupon Code
                    </p>

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

                {wonPrize.reward_type === "marchandise" && (
                  <>
                    <p className="text-center text-gray-600 mb-2">
                      Merchandise Prize
                    </p>
                    {wonPrize.coupon_code && (
                      <p className="text-center text-sm text-gray-500 mb-6">
                        Code: {wonPrize.coupon_code}
                      </p>
                    )}
                  </>
                )}

                {wonPrize.reward_type === "none" && (
                  <>
                    <p className="text-center text-gray-600 mb-6">
                      Don't give up! Try again for a chance to win exciting
                      prizes.
                    </p>
                  </>
                )}

                {/* Action buttons */}
                {wonPrize.reward_type !== "none" && (
                  <div className="space-y-3">
                    {wonPrize.coupon_code && (
                      <button
                        onClick={copyPrizeInfo}
                        className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7612] transition-colors"
                      >
                        Copy To Clipboard
                      </button>
                    )}
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
                )}
              </div>
            </div>
          )}
        </>
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
