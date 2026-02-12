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

  // Fetch scratch card data
  useEffect(() => {
    const fetchContestData = async () => {
      setIsLoading(true);
      try {
        let data: ScratchContest;

        // If contest_id is provided, fetch specific contest
        if (urlContestId) {
          data = await newScratchCardApi.getContestById(urlContestId);
        } else {
          // Otherwise, fetch all scratch contests and use the first one
          console.warn(
            "⚠️ No contest ID provided, fetching all scratch contests"
          );
          const contests = await newScratchCardApi.getContests();

          if (contests.length === 0) {
            console.error("❌ No scratch contests available");
            setIsLoading(false);
            return;
          }

          data = contests[0];
          console.warn("✅ Using first available scratch contest:", data);
        }

        setContestData(data);
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
    if (!canvasRef.current || isRevealed) return;

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
    if (hasScratched || !contestData) return;

    setHasScratched(true);
    setIsRevealed(true);

    try {
      // Call API to play/scratch
      const result = await newScratchCardApi.playContest(contestData.id);

      if (!result.success || !result.prize || !result.user_contest_reward) {
        throw new Error(result.message || "Failed to scratch card");
      }

      // Update with actual won prize
      setWonPrize(result.prize);

      // Store user_contest_reward.id in localStorage for details page
      localStorage.setItem(
        "last_reward_id",
        result.user_contest_reward.id.toString()
      );

      // Show result modal
      setShowResultModal(true);

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
    <div className="min-h-screen bg-gray-50">
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
      <div className="px-4 py-8 flex flex-col items-center">
        {/* Scratch Card Container */}
        <div className="w-full max-w-sm mb-6">
          <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden">
            {/* Background reward content */}
            <div className="relative aspect-square p-8 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              {/* Background illustration - only show when not revealed */}
              {!isRevealed && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  {/* White curved stripes */}
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 300 300"
                    className="absolute"
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
                          style={{ stopColor: "white", stopOpacity: 0.2 }}
                        />
                        <stop
                          offset="50%"
                          style={{ stopColor: "white", stopOpacity: 0.3 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "white", stopOpacity: 0.2 }}
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
                <div className="w-32 h-32 mb-4 relative">
                  <div className="text-8xl flex items-center justify-center animate-pulse">
                    🎁
                  </div>
                </div>

                {/* Show prize info only after API response */}
                {wonPrize && (
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {wonPrize.title}
                    </h3>

                    {/* Show coupon code if available */}
                    {wonPrize.reward_type === "coupon" &&
                      wonPrize.coupon_code && (
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-dashed border-gray-300">
                          <p className="text-xs text-gray-600 mb-1">
                            Coupon Code
                          </p>
                          <p className="text-xl font-bold text-[#B88B15] tracking-wider">
                            {wonPrize.coupon_code}
                          </p>
                        </div>
                      )}

                    {/* Show points if available */}
                    {wonPrize.reward_type === "points" &&
                      wonPrize.points_value && (
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-dashed border-gray-300">
                          <p className="text-2xl font-bold text-[#B88B15]">
                            {wonPrize.points_value} Points
                          </p>
                        </div>
                      )}
                  </div>
                )}

                {/* Hand pointer - only show when not revealed */}
                {!isRevealed && (
                  <div className="absolute bottom-8 right-8 text-6xl animate-bounce">
                    <span className="inline-block transform rotate-12">👆</span>
                  </div>
                )}
              </div>

              {/* Scratch canvas overlay */}
              {!isRevealed && (
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

            {/* Voucher info */}
            <div className="p-6 text-center bg-white">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {contestData.name}
              </h2>
              {wonPrize ? (
                <>
                  <p className="text-gray-600 mb-1">{wonPrize.title}</p>
                  {wonPrize.reward_type === "coupon" &&
                    wonPrize.partner_name && (
                      <p className="text-sm text-gray-500 mb-1">
                        {wonPrize.partner_name}
                      </p>
                    )}
                </>
              ) : (
                <p className="text-gray-600 mb-1">
                  Scratch to reveal your prize!
                </p>
              )}
              <p className="text-sm text-gray-500">
                Valid Till{" "}
                {new Date(contestData.end_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Scratch instruction */}
          {!isRevealed && (
            <p className="text-center text-gray-600 mt-4 text-sm">
              Scratch to reveal your reward
            </p>
          )}
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && wonPrize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
            {/* Close button */}
            <button
              onClick={() => setShowResultModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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

            {/* Copy button */}
            <button
              onClick={copyPrizeInfo}
              className="w-full bg-[#B88B15] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7612] transition-colors mb-3"
            >
              Copy To Clipboard
            </button>

            {/* View Details button */}
            <button
              onClick={() => {
                setShowResultModal(false);
                handleViewVoucher();
              }}
              className="w-full bg-gray-100 text-gray-900 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View Voucher Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchCard;
