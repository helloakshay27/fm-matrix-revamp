import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { X, ChevronLeft } from "lucide-react";
import {
  newSpinnerContestApi,
  Contest,
  Prize,
} from "@/services/newSpinnerContestApi";
import { spinSound } from "@/utils/spinSound";

interface WheelSegment {
  id: number;
  label: string;
  color: string;
  prize: Prize;
}

interface WinResult {
  prize: Prize;
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
    final_urlContestId: urlContestId
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

  // Fetch spinner contest data
  useEffect(() => {
    const fetchContestData = async () => {
      if (!urlContestId) {
        console.error("❌ No contest ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await newSpinnerContestApi.getContestById(urlContestId);

        setContestData(data);

        // Convert prizes to wheel segments
        const wheelSegments =
          newSpinnerContestApi.convertPrizesToSegments(data.prizes);
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
      const text = segment.label.length > maxLength
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
      const result = await newSpinnerContestApi.playContest(contestData.id);

      if (!result.success || !result.prize) {
        throw new Error(result.message || "Failed to play contest");
      }

      // Find the index of the winning segment
      const winningIndex = segments.findIndex(
        (s) => s.prize.id === result.prize!.id
      );

      if (winningIndex === -1) {
        throw new Error("Winning prize not found in segments");
      }

      const segmentAngle = 360 / segments.length;

      // Calculate final rotation (multiple spins + winning segment)
      // Pointer is at top, so we need to align the segment center with top
      const spins = 5; // Number of full rotations
      const targetAngle = winningIndex * segmentAngle + segmentAngle / 2;
      const finalRotation = spins * 360 + (360 - targetAngle);

      // Animate rotation
      let currentRotation = rotation;
      const duration = 4000; // 4 seconds
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        currentRotation = rotation + finalRotation * easeOut;
        setRotation(currentRotation % 360);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Spin complete - show result
          setTimeout(() => {
            spinSound.playWinSound();
            setWinResult({ prize: result.prize! });
            setShowResult(true);
            setIsSpinning(false);
          }, 500);
        }
      };

      requestAnimationFrame(animate);
    } catch (error) {
      console.error("❌ Error during spin:", error);
      const message = error instanceof Error ? error.message : "Failed to spin. Please try again.";
      alert(message);
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
      alert("Prize information copied to clipboard!");
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
            {!urlContestId
              ? "No contest ID provided"
              : "Contest not found or has no active prizes"}
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
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {contestData.name}
        </h1>

        {/* Description */}
        {contestData.description && (
          <p className="text-center text-gray-600 mb-8 max-w-md">
            {contestData.description}
          </p>
        )}

        {/* Contest Period */}
        <div className="text-xs text-gray-500 mb-6">
          Valid: {new Date(contestData.start_at).toLocaleDateString()} -{" "}
          {new Date(contestData.end_at).toLocaleDateString()}
        </div>

        {/* Spinner Wheel */}
        <div className="relative mb-8">
          {/* Pointer/Arrow at top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#B88B15]" />
          </div>

          <canvas
            ref={canvasRef}
            width={360}
            height={360}
            className="max-w-full h-auto"
          />
        </div>

        {/* Tap to Spin Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || !canSpin}
          className="w-full max-w-md bg-[#B88B15] text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#9a7612] transition-colors"
        >
          {isSpinning ? "Spinning..." : "Tap To Spin"}
        </button>

        {/* Terms and Conditions */}
        {contestData.terms_and_conditions && (
          <p className="text-center text-xs text-gray-500 mt-6 max-w-md whitespace-pre-line">
            {contestData.terms_and_conditions}
          </p>
        )}
      </div>

      {/* Result Modal */}
      {showResult && winResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowResult(false);
                setWinResult(null);
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
            <p className="text-center text-gray-600 mb-2">
              You've won
            </p>

            <p className="text-center text-2xl font-bold text-gray-900 mb-6">
              {winResult.prize.title}
            </p>

            {/* Display prize details based on type */}
            {winResult.prize.reward_type === "coupon" &&
              winResult.prize.coupon_code && (
                <>
                  {/* Coupon Code label */}
                  <p className="text-center text-gray-600 mb-3">Coupon Code</p>

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

            {winResult.prize.reward_type === "points" &&
              winResult.prize.points_value && (
                <p className="text-center text-lg text-gray-600 mb-6">
                  {winResult.prize.points_value} Loyalty Points
                </p>
              )}

            {/* Copy button */}
            <button
              onClick={copyPrizeInfo}
              className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7612] transition-colors"
            >
              Copy To Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinnerContest;
