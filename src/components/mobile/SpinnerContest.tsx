import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { X, ChevronLeft } from "lucide-react";
import {
  newSpinnerContestApi,
  Contest,
  Prize,
} from "@/services/newSpinnerContestApi";
import { spinSound } from "@/utils/spinSound";
import { toast } from "sonner";

interface WheelSegment {
  id: number;
  label: string;
  color: string;
  prize: Prize;
}

interface WinResult {
  prize: Prize;
}

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

export const SpinnerContest: React.FC = () => {
  const navigate = useNavigate();
  const { contestId } = useParams<{ contestId: string }>();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get URL parameters
  const orgId = searchParams.get("org_id");
  const token = searchParams.get("token");
  const urlContestId = searchParams.get("contest_id") || contestId;

  console.warn("🎯 Component Params:", {
    orgId,
    token: token ? "exists" : "missing",
    contest_id_from_query: searchParams.get("contest_id"),
    contestId_from_route: contestId,
    final_urlContestId: urlContestId,
  });

  // Loading and data states
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [contestData, setContestData] = useState<Contest | null>(null);
  const [segments, setSegments] = useState<WheelSegment[]>([]);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [winResult, setWinResult] = useState<WinResult | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [rewardId, setRewardId] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(0);

  // Fetch spinner contest data
  useEffect(() => {
    const fetchContestData = async () => {
      setIsLoading(true);
      try {
        // Contest ID is required
        if (!urlContestId) {
          console.error("❌ No contest ID provided");
          setIsLoading(false);
          setCanSpin(false);
          return;
        }

        // Fetch specific contest by ID
        const data = await newSpinnerContestApi.getContestById(urlContestId);
        setContestData(data);
        setRemainingAttempts(data.user_attemp_remaining || 0);

        // Convert prizes to wheel segments
        const wheelSegments = newSpinnerContestApi.convertPrizesToSegments(
          data.prizes
        );
        setSegments(wheelSegments);
      } catch (error) {
        console.error("❌ Error fetching contest data:", error);
        if (error instanceof Error) {
          console.error("❌ Error message:", error.message);
        }
        setCanSpin(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestData();
  }, [urlContestId, orgId, token]);

  // Draw wheel on canvas
  useEffect(() => {
    if (segments.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const segmentAngle = (2 * Math.PI) / segments.length;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Draw segments
    segments.forEach((segment, index) => {
      const startAngle = index * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#000";
      ctx.font = "bold 11px Arial";

      // Truncate long text
      const maxLength = 20;
      const text =
        segment.label.length > maxLength
          ? segment.label.substring(0, maxLength) + "..."
          : segment.label;

      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    });

    ctx.restore();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw "Spin" text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Spin", centerX, centerY);
  }, [segments, rotation]);

  // Handle spin
  const handleSpin = async () => {
    if (isSpinning || segments.length === 0 || !contestData || !canSpin) return;

    setIsSpinning(true);

    try {
      // Play casino sound
      spinSound.play();

      // Call API to get the winning prize
      const result = (await newSpinnerContestApi.playContest(
        contestData.id
      )) as PlayContestResult;

      if (!result.success || !result.prize) {
        throw new Error(result.message || "Failed to play contest");
      }

      // Store reward ID if user won (don't update won_reward state yet)
      if (result.won_reward === true && result.user_contest_reward) {
        localStorage.setItem(
          "last_reward_id",
          result.user_contest_reward.id.toString()
        );
      }

      console.log("🎲 Won prize:", result.prize);
      console.log(
        "🎯 Available segments:",
        segments.map((s) => ({ id: s.prize.id, title: s.prize.title }))
      );

      // Find the index of the winning segment
      const winningIndex = segments.findIndex(
        (s) => s.prize.id === result.prize!.id
      );

      console.log(
        "✅ Winning index:",
        winningIndex,
        "Prize ID:",
        result.prize.id
      );

      if (winningIndex === -1) {
        console.error("❌ Prize not found! Looking for ID:", result.prize.id);
        console.error(
          "❌ Available prize IDs:",
          segments.map((s) => s.prize.id)
        );
        throw new Error("Winning prize not found in segments");
      }

      const segmentAngle = 360 / segments.length;

      // Calculate final rotation (multiple spins + winning segment)
      // Pointer is at top, so we need to align the segment center with top
      const spins = 5; // Number of full rotations
      const targetAngle = winningIndex * segmentAngle + segmentAngle / 2;
      const finalRotation = spins * 360 + (360 - targetAngle);

      // Animate rotation
      const startRotation = rotation;
      const duration = 4000; // 4 seconds
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentRotation = startRotation + finalRotation * easeOut;
        setRotation(currentRotation);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Set final rotation precisely
          const finalRot = (startRotation + finalRotation) % 360;
          setRotation(finalRot);

          // Spin complete - show modal immediately
          setTimeout(() => {
            spinSound.playWinSound();

            // Store result data
            if (result.user_contest_reward?.id) {
              setRewardId(result.user_contest_reward.id);
            }

            setWinResult({ prize: result.prize! });
            setIsSpinning(false);

            // Decrement remaining attempts
            setRemainingAttempts((prev) => Math.max(0, prev - 1));

            // Show result modal immediately
            setShowResult(true);
          }, 500);
        }
      };

      requestAnimationFrame(animate);
    } catch (error) {
      console.error("❌ Error during spin:", error);

      // Stop the spinning sound
      spinSound.stop();

      // Show error message
      const message =
        error instanceof Error
          ? error.message
          : "Failed to spin. Please try again.";
      toast.error(message);

      // Re-enable spinning button
      setIsSpinning(false);
    }
  };

  // Copy prize code or information
  const copyPrizeInfo = () => {
    if (winResult) {
      const textToCopy =
        winResult.prize.reward_type === "coupon"
          ? winResult.prize.coupon_code || winResult.prize.title
          : `${winResult.prize.title} - ${winResult.prize.points_value} points`;

      navigator.clipboard.writeText(textToCopy);
      toast.success("Prize information copied to clipboard!");
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#B88B15] animate-spin" />
      </div>
    );
  }

  if (!contestData || segments.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Contest not found or has no active prizes
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
          {/* Main Content */}
          <div className="px-4 py-6 flex flex-col items-center">
            {/* Title & Description Card */}
            <div className="w-full max-w-md mb-9 bg-gradient-to-br from-[#FFF8E7] to-[#F5E6D3] rounded-2xl p-6 shadow-lg">
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

            {/* Instruction Text */}
            {/* <p className="text-center text-gray-600 text-sm mb-6 max-w-md">
          🎁 Tap the wheel or button below to spin and win exciting prizes!
        </p> */}

            {/* Spinner Wheel with Enhanced Styling */}
            <div className="relative mb-8">
              {/* Outer Ring Decoration */}
              <div className="absolute inset-0 rounded-full border-8 border-[#FFF8E7] -m-4 shadow-xl" />

              {/* Pointer/Arrow at top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10 drop-shadow-lg">
                <div className="relative">
                  <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[24px] border-t-[#B88B15]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#B88B15] rounded-full -mt-2 shadow-md" />
                </div>
              </div>

              <canvas
                ref={canvasRef}
                width={360}
                height={360}
                className="max-w-full h-auto cursor-pointer drop-shadow-2xl rounded-full"
                onClick={handleSpin}
              />
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

            {/* Tap to Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || !canSpin || remainingAttempts <= 0}
              className="w-full max-w-md bg-gradient-to-r from-[#B88B15] to-[#D4A574] text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              {isSpinning ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">🎰</span>
                  Spinning...
                </span>
              ) : remainingAttempts <= 0 ? (
                "No Attempts Left"
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🎯</span>
                  Tap To Spin
                </span>
              )}
            </button>

            {/* Prize Preview Section */}
            <div className="w-full max-w-md mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                🏆 Available Prizes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {contestData.prizes.slice(0, 4).map((prize) => (
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
          {showResult && winResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
                {/* Close button */}
                <button
                  onClick={() => {
                    setShowResult(false);

                    // If user won a real reward (not 'none'), navigate to details
                    if (winResult && winResult.prize.reward_type !== "none") {
                      const rewardId = localStorage.getItem("last_reward_id");
                      if (rewardId && orgId && token) {
                        navigate(
                          `/scratchcard/details/${rewardId}?org_id=${orgId}&token=${token}`
                        );
                        return;
                      }
                    }

                    // For 'none' type, just close modal and reset
                    if (winResult && winResult.prize.reward_type === "none") {
                      setWinResult(null);
                    }
                  }}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Gift icon - different for none type */}
                <div className="w-20 h-20 mx-auto mb-6 bg-[#F5E6D3] rounded-full flex items-center justify-center">
                  <div className="text-4xl">
                    {winResult.prize.reward_type === "none" ? "😔" : "🎁"}
                  </div>
                </div>

                {/* Title text - different for none type */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  {winResult.prize.reward_type === "none"
                    ? "Better Luck Next Time!"
                    : "Congratulations!"}
                </h2>

                {/* Description text - different for none type */}
                {winResult.prize.reward_type !== "none" && (
                  <p className="text-center text-gray-600 mb-2">You've won</p>
                )}

                {/* Prize title - only show for non-none rewards */}
                {winResult.prize.reward_type !== "none" && (
                  <p className="text-center text-2xl font-bold text-gray-900 mb-6">
                    {winResult.prize.title}
                  </p>
                )}

                {/* Display prize details based on type */}
                {winResult.prize.reward_type === "coupon" &&
                  winResult.prize.coupon_code && (
                    <>
                      {/* Coupon Code label */}
                      <p className="text-center text-gray-600 mb-3">
                        Coupon Code
                      </p>

                      {/* Coupon code */}
                      <p className="text-center text-xl font-bold text-gray-900 mb-3 tracking-wider">
                        {winResult.prize.coupon_code}
                      </p>

                      {/* Partner name if available */}
                      {winResult.prize.partner_name && (
                        <p className="text-center text-sm text-gray-500 mb-6">
                          Partner: {winResult.prize.partner_name}
                        </p>
                      )}
                    </>
                  )}

                {(winResult.prize.reward_type === "points" ||
                  !winResult.prize.coupon_code) &&
                  winResult.prize.points_value && (
                    <>
                      <p className="text-center text-gray-600 mb-3">
                        Loyalty Points
                      </p>
                      <p className="text-center text-3xl font-bold text-[#B88B15] mb-6">
                        {winResult.prize.points_value} Points
                      </p>
                    </>
                  )}

                {winResult.prize.reward_type === "merchandise" && (
                  <>
                    <p className="text-center text-gray-600 mb-2">
                      Merchandise Prize
                    </p>
                    {winResult.prize.coupon_code && (
                      <p className="text-center text-sm text-gray-500 mb-6">
                        Code: {winResult.prize.coupon_code}
                      </p>
                    )}
                  </>
                )}

                {winResult.prize.reward_type === "none" && (
                  <>
                    <p className="text-center text-gray-600 mb-6">
                      Don't give up! Try again for a chance to win exciting
                      prizes.
                    </p>
                  </>
                )}

                {/* Copy button - only show if coupon_code exists and not 'none' type */}
                {winResult.prize.coupon_code &&
                  winResult.prize.reward_type !== "none" && (
                    <button
                      onClick={copyPrizeInfo}
                      className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7612] transition-colors mb-3"
                    >
                      Copy To Clipboard
                    </button>
                  )}

                {/* View Voucher Details button - hide for 'none' type */}
                {winResult.prize.reward_type !== "none" && (
                  <button
                    onClick={() => {
                      const storedRewardId =
                        localStorage.getItem("last_reward_id");
                      if (storedRewardId && orgId && token) {
                        navigate(
                          `/scratchcard/details/${storedRewardId}?org_id=${orgId}&token=${token}`
                        );
                      }
                    }}
                    className={`w-full border-2 border-[#B88B15] text-[#B88B15] py-4 rounded-lg font-semibold hover:bg-[#FFF8E7] transition-colors ${winResult.prize.coupon_code ? "" : "mt-3"
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

export default SpinnerContest;
