import React, { useState, useEffect, useRef } from "react";
import { Camera, ShieldAlert, Lock } from "lucide-react";
import { SecurityState } from "./useProductSecurity";

interface SecurityOverlaysProps {
  security: SecurityState;
}

// ─── STUB EXPORTS (kept so existing imports don't break) ─────────────────────
// State screens are now overlays inside SecurityOverlays — not early returns.
// Pages should just render <SecurityOverlays> and their content; no guards needed.
export const CameraPermissionPending: React.FC = () => null;
export const CameraPermissionDenied: React.FC = () => null;
export const ModelLoadingScreen: React.FC = () => null;
export const AlwaysMountedVideos: React.FC<{ security: SecurityState }> = () =>
  null;

export const SecurityOverlays: React.FC<SecurityOverlaysProps> = ({
  security,
}) => {
  const {
    cameraPermission,
    modelLoading,
    showBlankScreen,
    screenshotBlank,
    isBlurred,
    sessionId,
    showBlackout,
    blackoutReason,
    blackoutSubtitle,
    incidentTime,
    countdown,
    dismissBlackout,
    videoRef,
    previewVideoRef,
  } = security;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: dragRef.current.initialX + (clientX - dragRef.current.startX),
      y: dragRef.current.initialY + (clientY - dragRef.current.startY),
    });
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0)
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onEnd = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onEnd);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const showBadge = cameraPermission === "granted" && !modelLoading;

  return (
    <>
      {/* ── ALWAYS IN DOM: hidden detection feed (videoRef) ─────────────────
          MUST stay unconditional so videoRef.current is never null when
          the stream assignment effect runs. width/height attrs = real size
          so face-api.js can read the video frames correctly.            */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={320}
        height={240}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 320,
          height: 240,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* ── CAMERA PERMISSION PENDING ───────────────────────────────────── */}
      {cameraPermission === "pending" && (
        <div className="fixed inset-0 z-[99990] bg-[#1a1a1a] flex flex-col items-center justify-center text-white text-center px-8">
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-300/30 flex items-center justify-center mb-6 animate-pulse">
            <Camera className="w-10 h-10 text-gray-700" />
          </div>
          <h1 className="text-3xl font-semibold mb-3 tracking-tight">
            Camera Access Required
          </h1>
          <p className="text-white/60 max-w-md text-sm leading-relaxed mb-8">
            This page contains proprietary product intelligence. To view it, you
            must grant camera access so our security system can verify your
            identity.
          </p>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-xs text-white/40">
            <Lock className="w-3.5 h-3.5" /> Waiting for camera permission…
          </div>
        </div>
      )}

      {/* ── CAMERA PERMISSION DENIED ────────────────────────────────────── */}
      {cameraPermission === "denied" && (
        <div className="fixed inset-0 z-[99990] bg-[#1a1a1a] flex flex-col items-center justify-center text-white text-center px-8">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-semibold mb-3 tracking-tight">
            Access Denied
          </h1>
          <p className="text-white/60 max-w-md text-sm leading-relaxed mb-8">
            Camera permission is required to access this proprietary content.
            Please enable camera access in your browser settings and refresh.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-400 text-white font-semibold text-sm px-6 py-3 rounded-full transition-all"
          >
            <Camera className="w-4 h-4" /> Retry Camera Access
          </button>
        </div>
      )}

      {/* ── MODEL LOADING ───────────────────────────────────────────────── */}
      {modelLoading && cameraPermission !== "denied" && (
        <div className="fixed inset-0 z-[99990] bg-[#1a1a1a] flex flex-col items-center justify-center text-white text-center px-8">
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-300/30 flex items-center justify-center mb-6 animate-pulse">
            <Lock className="w-10 h-10 text-gray-700" />
          </div>
          <h1 className="text-2xl font-semibold mb-3">
            Initializing Security...
          </h1>
          <p className="text-white/50 text-sm">
            Loading face detection model. Please wait.
          </p>
        </div>
      )}

      {/* ── NO FACE DETECTED ────────────────────────────────────────────── */}
      {showBlankScreen && (
        <div className="fixed inset-0 z-[9998] bg-[#1a1a1a] flex flex-col items-center justify-center text-white text-center px-8">
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-300/30 flex items-center justify-center mb-6">
            <Camera className="w-10 h-10 text-gray-700" />
          </div>
          <h1 className="text-2xl font-semibold mb-3">User Not Detected</h1>
          <p className="text-white/50 text-sm max-w-md">
            Please position yourself in front of the camera to view this
            content.
          </p>
        </div>
      )}

      {/* ── SCREENSHOT BLANK ────────────────────────────────────────────── */}
      {screenshotBlank && (
        <div
          className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          <Lock className="w-10 h-10 text-gray-700 mb-3 opacity-30" />
          <p className="text-gray-700/30 text-xs font-mono tracking-widest">
            CONFIDENTIAL · FM MATRIX
          </p>
        </div>
      )}

      {/* ── BLACKOUT OVERLAY ────────────────────────────────────────────── */}
      {showBlackout && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white text-center p-10 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,#ff000022 0,#ff000022 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#ff000022 0,#ff000022 1px,transparent 1px,transparent 40px)",
            }}
          />
          <ShieldAlert className="w-20 h-20 text-red-500 mb-6 animate-pulse relative z-10" />
          <div className="relative z-10 space-y-3 mb-8">
            <div className="text-red-400 text-xs font-mono tracking-[0.3em] uppercase mb-2">
              ⚠ Security Alert
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-wider">
              {blackoutReason}
            </h1>
            <p className="text-white/60 max-w-lg text-sm leading-relaxed">
              {blackoutSubtitle}
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="text-white/30 font-mono text-xs">
              Session: {sessionId} · Incident logged at {incidentTime}
            </div>
            {countdown > 0 ? (
              <div className="text-white/40 text-xs">
                Dismiss available in {countdown}s…
              </div>
            ) : (
              <button
                onClick={dismissBlackout}
                className="mt-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-8 py-2.5 rounded-full transition-all"
              >
                I Understand — Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── SESSION WATERMARK ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden select-none"
        style={{
          backgroundImage: `repeating-linear-gradient(-35deg, transparent, transparent 120px, rgba(218,119,86,0.04) 120px, rgba(218,119,86,0.04) 121px)`,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute whitespace-nowrap text-gray-700/[0.06] font-mono text-xs font-bold tracking-widest"
            style={{
              top: `${10 + i * 12}%`,
              left: "-10%",
              transform: "rotate(-20deg)",
              letterSpacing: "0.3em",
              fontSize: "11px",
            }}
          >
            CONFIDENTIAL · FM MATRIX · {sessionId} · CONFIDENTIAL · FM MATRIX ·{" "}
            {sessionId} · CONFIDENTIAL · FM MATRIX ·
          </div>
        ))}
      </div>

      {/* ── LIVE CAMERA BADGE (draggable) — only shown when fully active ── */}
      {showBadge && (
        <div
          className="fixed z-[9992] flex flex-col items-center gap-1.5 select-none cursor-grab active:cursor-grabbing touch-none"
          style={{
            top: 16,
            right: 16,
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches.length > 0)
              handleStart(e.touches[0].clientX, e.touches[0].clientY);
          }}
        >
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: isBlurred
                  ? "rgba(239,68,68,0.35)"
                  : "rgba(74,222,128,0.3)",
                animationDuration: "2s",
              }}
            />
            <div
              className="relative rounded-full p-[2px]"
              style={{
                background: isBlurred
                  ? "linear-gradient(135deg,#ef4444,#b91c1c)"
                  : "linear-gradient(135deg,#4ade80,#16a34a)",
              }}
            >
              <div
                className="rounded-full overflow-hidden bg-black"
                style={{ width: 56, height: 56 }}
              >
                <video
                  ref={previewVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: "cover",
                    transform: "scaleX(-1)",
                    display: "block",
                  }}
                />
              </div>
            </div>
            <div
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow"
              style={{ background: isBlurred ? "#ef4444" : "#4ade80" }}
            />
          </div>
          <div className="bg-black/90 border border-white/10 rounded-full px-2.5 py-0.5 flex flex-col items-center gap-0">
            <span className="text-[9px] font-mono text-white/80 tracking-widest uppercase">
              {isBlurred ? "⚠ NO FACE" : "✓ SECURE"}
            </span>
            <span className="text-[7px] font-mono text-white/30 tracking-wider">
              {sessionId}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
