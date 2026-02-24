import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import {
  newScratchCardApi,
  ScratchContest,
  Prize,
  UserContestReward,
} from "@/services/newScratchCardApi";
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

export const ScratchCard: React.FC = () => {
  const navigate = useNavigate();
  const { cardId } = useParams<{ cardId: string }>();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get URL parameters
  const orgId = searchParams.get("org_id");
  const token = searchParams.get("token");
  const urlContestId = searchParams.get("contest_id") || cardId;

  console.warn("🎯 ScratchCard Component Params:", {
    orgId,
    token: token ? "exists" : "missing",
    contest_id_from_query: searchParams.get("contest_id"),
    cardId_from_route: cardId,
    final_urlContestId: urlContestId,
  });

  const [isScratching, setIsScratching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contestData, setContestData] = useState<ScratchContest | null>(null);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [hasScratched, setHasScratched] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(0);

  // Fetch scratch card data
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
        const data = await newScratchCardApi.getContestById(urlContestId);
        setContestData(data);
        setRemainingAttempts(data.user_attemp_remaining || 0);
        // Don't set wonPrize here - only after play API response
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

  // Initialize canvas
  useEffect(() => {
    if (!contestData || !canvasRef.current || isRevealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw scratch surface with gradient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#5470B8");
    gradient.addColorStop(0.5, "#6785C5");
    gradient.addColorStop(1, "#5470B8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative confetti pattern
    ctx.font = "14px Arial";
    const emojis = ["🎁", "🎉", "⭐", "🎊", "✨"];
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      ctx.fillText(emoji, x, y);
    }

    // Add white curved stripes for visual interest
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 60;
    ctx.lineCap = "round";

    // Draw curved lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const offsetY = (i * canvas.height) / 3;
      ctx.moveTo(-50, offsetY);
      ctx.bezierCurveTo(
        canvas.width * 0.25,
        offsetY - 30,
        canvas.width * 0.75,
        offsetY + 30,
        canvas.width + 50,
        offsetY
      );
      ctx.stroke();
    }

    // Add "YOU WON" text in center
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("YOU WON", canvas.width / 2, canvas.height / 2);
  }, [contestData, isRevealed]);

  // Calculate scratched percentage
  const calculateScratchPercentage = (canvas: HTMLCanvasElement): number => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) {
        transparentPixels++;
      }
    }

    return (transparentPixels / (pixels.length / 4)) * 100;
  };

  // Handle scratch
  const scratch = (x: number, y: number) => {
    if (!canvasRef.current || isRevealed || remainingAttempts <= 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    // Use larger brush for better scratching experience on mobile
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 40, 0, 2 * Math.PI);
    ctx.fill();

    // Check scratch percentage periodically (not every pixel for performance)
    if (Math.random() > 0.85) {
      const percentage = calculateScratchPercentage(canvas);
      setScratchPercentage(percentage);

      if (percentage > 30 && !isRevealed) {
        revealCard();
      }
    }
  };

  // Handle mouse/touch events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsScratching(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isScratching) {
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  // Reveal card
  const revealCard = async () => {
    if (hasScratched || !contestData || remainingAttempts <= 0) return;

    setHasScratched(true);
    setIsRevealed(true);

    try {
      // Call API to play/scratch
      const result = (await newScratchCardApi.playContest(
        contestData.id
      )) as PlayContestResult;

      if (!result.success || !result.prize) {
        throw new Error(result.message || "Failed to scratch card");
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

      // Update with actual won prize
      setWonPrize(result.prize);

      // Store user_contest_reward.id in localStorage for details page (only if not null)
      if (result.user_contest_reward) {
        localStorage.setItem(
          "last_reward_id",
          result.user_contest_reward.id.toString()
        );
      }

      // Decrement remaining attempts
      setRemainingAttempts((prev) => Math.max(0, prev - 1));

      // Show result modal after a delay to let reward section appear first
      setTimeout(() => {
        setShowResultModal(true);
      }, 800);

      console.warn("🎁 Won prize:", result.prize);
    } catch (error) {
      console.error("❌ Error scratching card:", error);
      const message =
        error instanceof Error ? error.message : "Failed to scratch card";
      toast.error(message);
    }
  };

  // Navigate to voucher details
  const handleViewVoucher = () => {
    const rewardId = localStorage.getItem("last_reward_id");
    if (rewardId && orgId && token) {
      navigate(
        `/scratchcard/details/${rewardId}?org_id=${orgId}&token=${token}`
      );
    }
  };

  // Reset scratch card for next attempt
  const resetScratchCard = () => {
    setShowResultModal(false);

    // Check if user won a reward and update contestData accordingly
    if (wonPrize && wonPrize.reward_type !== "none") {
      // User won a reward - show "Already Won" screen
      const rewardId = localStorage.getItem("last_reward_id");
      if (rewardId) {
        setContestData((prev) =>
          prev
            ? {
              ...prev,
              won_reward: true,
              user_contest_reward: {
                id: parseInt(rewardId),
                contest_id: prev.id,
                prize_id: wonPrize.id,
                reward_type: wonPrize.reward_type,
                points_value: wonPrize.points_value,
                coupon_code: wonPrize.coupon_code,
                user_id: 0,
                status: "granted",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            }
            : prev
        );
      }
    } else {
      // User didn't win or got "none" - reset to play again
      setWonPrize(null);
      setIsRevealed(false);
      setHasScratched(false);
      setScratchPercentage(0);
      setIsScratching(false);
    }
  };

  // Copy prize code or information
  const copyPrizeInfo = () => {
    if (wonPrize) {
      const textToCopy =
        wonPrize.reward_type === "coupon" && wonPrize.coupon_code
          ? wonPrize.coupon_code
          : wonPrize.title;

      navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to clipboard!");
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#B88B15] animate-spin" />
      </div>
    );
  }

  if (!contestData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {!urlContestId ? "No contest ID provided" : "Contest not found"}
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
          {/* Celebration Animation */
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
          {/* Main Content */}
          <div className="px-4 py-6 flex flex-col items-center">
            {/* Title & Description Card */}
            <div className="w-full mb-6 bg-gradient-to-br from-[#FFF8E7] to-[#F5E6D3] rounded-2xl p-6 shadow-lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {contestData.name}
              </h1>

              {/* Contest Period */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <span className="bg-white/70 px-3 py-1.5 rounded-full">
                  📅 Valid:{" "}
                  {new Date(contestData.start_at).toLocaleDateString()} -{" "}
                  {new Date(contestData.end_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Scratch Card Container with Enhanced Styling */}
            <div className="relative mb-6 w-full">
              {/* Outer Ring Decoration */}
              <div className="absolute inset-0 rounded-3xl border-8 border-[#FFF8E7] -m-4 shadow-xl" />

              <div
                className="w-full relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#D4A574]"
                style={{ touchAction: "none" }}
              >
                {/* Background reward content */}
                <div className="relative aspect-square p-8 flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
                  {/* Background illustration - only show when not revealed */}
                  {!isRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-pink-200/30 to-orange-200/30 animate-pulse" />

                      {/* White curved stripes */}
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 300 300"
                        className="absolute opacity-40"
                      >
                        <defs>
                          <linearGradient
                            id="stripeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "white", stopOpacity: 0.3 }}
                            />
                            <stop
                              offset="50%"
                              style={{ stopColor: "white", stopOpacity: 0.5 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: "white", stopOpacity: 0.3 }}
                            />
                          </linearGradient>
                        </defs>
                        <ellipse
                          cx="60"
                          cy="150"
                          rx="100"
                          ry="140"
                          fill="url(#stripeGradient)"
                          transform="rotate(-30 60 150)"
                        />
                        <ellipse
                          cx="240"
                          cy="150"
                          rx="100"
                          ry="140"
                          fill="url(#stripeGradient)"
                          transform="rotate(30 240 150)"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Revealed content - Gift box and text */}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    {/* Gift box illustration */}
                    <div className="w-40 h-40 mb-4 relative">
                      <div className="text-9xl flex items-center justify-center animate-pulse">
                        🎁
                      </div>
                      {/* Sparkle effects */}
                      {isRevealed && (
                        <>
                          <span className="absolute top-0 left-0 text-2xl animate-ping">
                            ✨
                          </span>
                          <span className="absolute top-0 right-0 text-2xl animate-ping delay-100">
                            ✨
                          </span>
                          <span className="absolute bottom-0 left-0 text-2xl animate-ping delay-200">
                            ✨
                          </span>
                          <span className="absolute bottom-0 right-0 text-2xl animate-ping delay-300">
                            ✨
                          </span>
                        </>
                      )}
                    </div>

                    {/* Show prize info only after API response */}
                    {wonPrize && (
                      <div className="text-center space-y-3 max-w-xs">
                        <h3 className="text-3xl font-bold text-gray-900 drop-shadow-md">
                          {wonPrize.title}
                        </h3>

                        {/* Show coupon code if available */}
                        {wonPrize.reward_type === "coupon" &&
                          wonPrize.coupon_code && (
                            <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-dashed border-[#B88B15] shadow-lg">
                              <p className="text-xs text-gray-600 mb-1 font-medium">
                                Coupon Code
                              </p>
                              <p className="text-2xl font-bold text-[#B88B15] tracking-wider">
                                {wonPrize.coupon_code}
                              </p>
                            </div>
                          )}

                        {/* Show points if available */}
                        {wonPrize.reward_type === "points" &&
                          wonPrize.points_value && (
                            <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-dashed border-[#B88B15] shadow-lg">
                              <p className="text-3xl font-bold text-[#B88B15]">
                                {wonPrize.points_value} Points
                              </p>
                            </div>
                          )}
                      </div>
                    )}

                    {/* Hand pointer with instruction - only show when not revealed */}
                    {!isRevealed && remainingAttempts > 0 && (
                      <div className="absolute bottom-12 right-8">
                        <div className="relative">
                          <div className="text-7xl animate-bounce">
                            <span className="inline-block transform rotate-12">
                              👆
                            </span>
                          </div>
                          <div className="absolute -top-10 right-0 bg-[#B88B15] text-white text-xs font-bold px-3 py-1 rounded-lg whitespace-nowrap shadow-lg">
                            Scratch here!
                          </div>
                        </div>
                      </div>
                    )}

                    {/* No attempts message overlay */}
                    {!isRevealed && remainingAttempts <= 0 && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                        <div className="text-center text-white p-6">
                          <div className="text-5xl mb-4">😔</div>
                          <p className="text-xl font-bold mb-2">
                            No Attempts Left
                          </p>
                          <p className="text-sm opacity-90">
                            Come back later for more chances to win!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scratch canvas overlay */}
                  {!isRevealed && remainingAttempts > 0 && (
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full cursor-pointer touch-none"
                      style={{ touchAction: "none" }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Attempts Remaining Badge */}
            <div className="mb-4 bg-gradient-to-r from-[#B88B15] to-[#D4A574] text-white px-6 py-2 rounded-full shadow-md">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🎯</span>
                <p className="text-sm font-semibold">
                  Attempts Remaining{" "}
                  <span className="text-xl font-bold">{remainingAttempts}</span>
                </p>
              </div>
            </div>

            {/* Scratch instruction */}
            {!isRevealed && remainingAttempts > 0 && (
              <div className="text-center mb-6">
                <p className="text-gray-600 text-sm">
                  👆 Scratch the card to reveal your prize
                </p>
              </div>
            )}

            {/* Prize Preview Section */}
            <div className="w-full mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                🏆 Available Prizes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {contestData.prizes
                  .filter((p) => p.reward_type !== "none")
                  .slice(0, 4)
                  .map((prize) => (
                    <div
                      key={prize.id}
                      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 text-center shadow-sm"
                    >
                      <div className="text-3xl mb-2">🎁</div>
                      <p className="font-semibold text-sm text-gray-900 mb-1">
                        {prize.title}
                      </p>
                      {prize.points_value && (
                        <p className="text-xs text-[#B88B15] font-medium">
                          {prize.points_value} Points
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Result Modal */}
          {showResultModal && wonPrize && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6  w-full relative">
                {/* Close button */}
                <button
                  onClick={() => {
                    resetScratchCard();
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

                {/* Copy button - only show if coupon_code exists and not 'none' type */}
                {wonPrize.coupon_code && wonPrize.reward_type !== "none" && (
                  <button
                    onClick={copyPrizeInfo}
                    className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7612] transition-colors mb-3"
                  >
                    Copy To Clipboard
                  </button>
                )}

                {/* View Details button - hide for 'none' type */}
                {wonPrize.reward_type !== "none" && (
                  <button
                    onClick={() => {
                      setShowResultModal(false);
                      handleViewVoucher();
                    }}
                    className={`w-full border-2 border-[#B88B15] text-[#B88B15] py-4 rounded-lg font-semibold hover:bg-[#FFF8E7] transition-colors ${wonPrize.coupon_code ? "" : "mt-3"
                      }`}
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScratchCard;
