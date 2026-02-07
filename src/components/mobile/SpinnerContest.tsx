import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ChevronLeft } from "lucide-react";
import {
  spinnerContestApi,
  SpinnerContest as SpinnerContestType,
  SpinnerSegment,
} from "@/services/spinnerContestApi";

interface VoucherResult {
  voucher_code: string;
  discount_text: string;
  segment_label: string;
}

export const SpinnerContest: React.FC = () => {
  const navigate = useNavigate();
  const { contestId } = useParams<{ contestId: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loading and data states
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinnerData, setSpinnerData] = useState<SpinnerContestType | null>(
    null
  );
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [voucherResult, setVoucherResult] = useState<VoucherResult | null>(
    null
  );

  // Fetch spinner contest data
  useEffect(() => {
    const fetchSpinnerData = async () => {
      setIsLoading(true);
      try {
        let data: SpinnerContestType;

        if (contestId) {
          // Fetch specific contest
          data = await spinnerContestApi.getContestById(contestId);
        } else {
          // Fetch first active contest
          const contests = await spinnerContestApi.getActiveContests();
          if (contests.length === 0) {
            throw new Error("No active contests found");
          }
          data = contests[0];
        }

        setSpinnerData(data);
      } catch (error) {
        console.error("Error fetching spinner data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpinnerData();
  }, [contestId]);

  // Draw wheel on canvas
  useEffect(() => {
    if (!spinnerData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const activeSegments = spinnerData.segments.filter((s) => s.active);
    const segmentAngle = (2 * Math.PI) / activeSegments.length;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Draw segments
    activeSegments.forEach((segment, index) => {
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
      ctx.fillText(segment.label, radius - 20, 5);
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
  }, [spinnerData, rotation]);

  // Handle spin
  const handleSpin = async () => {
    if (isSpinning || !spinnerData) return;

    setIsSpinning(true);

    const activeSegments = spinnerData.segments.filter((s) => s.active);
    const randomIndex = Math.floor(Math.random() * activeSegments.length);
    const segmentAngle = 360 / activeSegments.length;

    // Calculate final rotation (multiple spins + random segment)
    const spins = 5; // Number of full rotations
    const finalRotation =
      spins * 360 + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    // Animate rotation
    let currentRotation = rotation;
    const duration = 4000; // 4 seconds
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      currentRotation = rotation + finalRotation * easeOut;
      setRotation(currentRotation % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Spin complete - show result
        setTimeout(() => {
          handleSpinComplete(activeSegments[randomIndex]);
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  };

  // Handle spin complete
  const handleSpinComplete = async (selectedSegment: SpinnerSegment) => {
    try {
      if (!spinnerData) return;

      // Call API to record spin and get voucher
      const result = await spinnerContestApi.spinWheel(
        spinnerData.id,
        selectedSegment.id
      );

      if (result.success) {
        const voucherData: VoucherResult = {
          voucher_code: result.voucher.voucher_code,
          discount_text: result.voucher.discount_text,
          segment_label: selectedSegment.label,
        };

        setVoucherResult(voucherData);
        setShowResult(true);
      }
    } catch (error) {
      console.error("Error recording spin:", error);
      // Show error message to user
      alert("Failed to process spin. Please try again.");
    } finally {
      setIsSpinning(false);
    }
  };

  // Copy voucher code
  const copyVoucherCode = () => {
    if (voucherResult) {
      navigator.clipboard.writeText(voucherResult.voucher_code);
      // Show success toast or feedback
      alert("Voucher code copied to clipboard!");
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

  if (!spinnerData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Contest not found</p>
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
          {spinnerData.title}
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mb-8 max-w-md">
          {spinnerData.description}
        </p>

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
          disabled={isSpinning}
          className="w-full max-w-md bg-[#B88B15] text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#9a7612] transition-colors"
        >
          {isSpinning ? "Spinning..." : "Tap To Spin"}
        </button>

        {/* Terms and Conditions */}
        <p className="text-center text-xs text-gray-500 mt-6 max-w-md whitespace-pre-line">
          {spinnerData.terms_conditions}
        </p>
      </div>

      {/* Result Modal */}
      {showResult && voucherResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowResult(false);
                setVoucherResult(null);
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

            {/* Won voucher text */}
            <p className="text-center text-gray-600 mb-2">
              You've won a voucher for
            </p>

            <p className="text-center text-2xl font-bold text-gray-900 mb-6">
              {voucherResult.discount_text}
            </p>

            {/* Voucher Code label */}
            <p className="text-center text-gray-600 mb-3">Voucher Code</p>

            {/* Voucher code */}
            <p className="text-center text-xl font-bold text-gray-900 mb-6 tracking-wider">
              {voucherResult.voucher_code}
            </p>

            {/* Copy button */}
            <button
              onClick={copyVoucherCode}
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
