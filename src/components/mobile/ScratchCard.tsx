import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { scratchCardApi, ScratchCardData } from "@/services/scratchCardApi";

export const ScratchCard: React.FC = () => {
  const navigate = useNavigate();
  const { cardId } = useParams<{ cardId: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scratchCardData, setScratchCardData] =
    useState<ScratchCardData | null>(null);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Fetch scratch card data
  useEffect(() => {
    const fetchScratchCardData = async () => {
      setIsLoading(true);
      try {
        let data: ScratchCardData;

        if (cardId) {
          data = await scratchCardApi.getScratchCardById(cardId);
        } else {
          const cards = await scratchCardApi.getActiveScratchCards();
          if (cards.length === 0) {
            throw new Error("No active scratch cards found");
          }
          data = cards[0];
        }

        setScratchCardData(data);
        setIsRevealed(data.is_scratched || false);
      } catch (error) {
        console.error("Error fetching scratch card data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScratchCardData();
  }, [cardId]);

  // Initialize canvas
  useEffect(() => {
    if (!scratchCardData || !canvasRef.current || isRevealed) return;

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
  }, [scratchCardData, isRevealed]);

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

    // Use larger brush for better scratching experience
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 25, 0, 2 * Math.PI);
    ctx.fill();

    // Check scratch percentage periodically (not every pixel for performance)
    if (Math.random() > 0.9) {
      const percentage = calculateScratchPercentage(canvas);
      setScratchPercentage(percentage);

      if (percentage > 40 && !isRevealed) {
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
    setIsScratching(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
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
    setIsRevealed(true);

    if (scratchCardData && !scratchCardData.is_scratched) {
      try {
        await scratchCardApi.scratchCard(scratchCardData.id);
      } catch (error) {
        console.error("Error updating scratch status:", error);
      }
    }
  };

  // Navigate to voucher details
  const handleViewVoucher = () => {
    if (scratchCardData) {
      navigate(`/scratchcard/${scratchCardData.id}/voucher`);
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

  if (!scratchCardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Scratch card not found</p>
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">Voucher</h2>
              <p className="text-gray-600 mb-1">
                {scratchCardData.reward.title}
              </p>
              <p className="text-sm text-gray-500">
                Valid Till{" "}
                {new Date(scratchCardData.valid_until).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>

          {/* View Voucher Button */}
          {isRevealed && (
            <button
              onClick={handleViewVoucher}
              className="w-full mt-6 bg-[#B88B15] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#9a7612] transition-colors"
            >
              View Voucher Details
            </button>
          )}

          {/* Scratch instruction */}
          {!isRevealed && (
            <p className="text-center text-gray-600 mt-4 text-sm">
              Scratch to reveal your reward
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScratchCard;
