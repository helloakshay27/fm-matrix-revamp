import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as faceapi from "face-api.js";

let modelsLoaded = false;

export interface SecurityState {
  cameraPermission: "pending" | "granted" | "denied";
  isBlurred: boolean;
  showBlackout: boolean;
  blackoutReason: string;
  blackoutSubtitle: string;
  incidentTime: string;
  countdown: number;
  screenshotBlank: boolean;
  faceDetected: boolean;
  modelLoading: boolean;
  sessionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  previewVideoRef: React.RefObject<HTMLVideoElement | null>;
  showBlankScreen: boolean;
  triggerBlackout: (reason: string, subtitle: string) => void;
  dismissBlackout: () => void;
}

export function useProductSecurity(): SecurityState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [model, setModel] = useState<any>(modelsLoaded ? true : null);
  const [modelLoading, setModelLoading] = useState(!modelsLoaded);
  const [faceDetected, setFaceDetected] = useState(true);
  const [cameraPermission, setCameraPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [isBlurred, setIsBlurred] = useState(false);
  const [showBlackout, setShowBlackout] = useState(false);
  const [blackoutReason, setBlackoutReason] = useState("Security Violation");
  const [blackoutSubtitle, setBlackoutSubtitle] = useState(
    "Unauthorized activity detected. Attempt logged."
  );
  const [incidentTime, setIncidentTime] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [screenshotBlank, setScreenshotBlank] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const sessionId = useMemo(() => {
    return `SID-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  }, []);

  const triggerBlackout = useCallback((reason: string, subtitle: string) => {
    setBlackoutReason(reason);
    setBlackoutSubtitle(subtitle);
    setIncidentTime(new Date().toLocaleString());
    setCountdown(5);
    setIsBlurred(true);
    setShowBlackout(true);
  }, []);

  const dismissBlackout = useCallback(() => {
    setShowBlackout(false);
    setIsBlurred(false);
  }, []);

  // 1. Load face-api.js models + setup camera
  useEffect(() => {
    let timeoutId: number | undefined;

    const loadModels = async () => {
      if (modelsLoaded) {
        setModel(true);
        setModelLoading(false);
        return;
      }
      timeoutId = window.setTimeout(() => {
        console.warn("face-api.js model loading timed out");
        setModelLoading(false);
      }, 15000);

      // Try local first, fall back to CDN
      const MODEL_URLS = [
        "/models",
        "https://justadudewhohacks.github.io/face-api.js/models",
      ];

      for (const MODEL_URL of MODEL_URLS) {
        try {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
          ]);
          modelsLoaded = true;
          setModel(true);
          setModelLoading(false);
          window.clearTimeout(timeoutId);
          return;
        } catch (err) {
          console.warn(
            `Model load failed from ${MODEL_URL}, trying next...`,
            err
          );
        }
      }

      console.error("face-api.js model failed to load from all sources");
      setModelLoading(false);
      window.clearTimeout(timeoutId);
    };

    const setupCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraPermission("denied");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 320, height: 240 },
        });
        mediaStreamRef.current = stream;
        setCameraPermission("granted");
      } catch (err) {
        console.error("Camera access denied:", err);
        setCameraPermission("denied");
      }
    };

    loadModels();
    setupCamera();

    // Stop camera tracks when component unmounts
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  // Assign stream to video elements.
  // videoRef is always in DOM (unconditional in SecurityOverlays).
  // previewVideoRef appears only after model+camera are ready — poll for it.
  useEffect(() => {
    if (cameraPermission !== "granted" || !mediaStreamRef.current) return;

    const assign = (video: HTMLVideoElement | null) => {
      if (!video || video.srcObject) return;
      video.srcObject = mediaStreamRef.current;
      video.onloadedmetadata = () => {
        video.play().catch((e) => console.warn("Video play failed:", e));
      };
    };

    // Assign immediately (videoRef is always in DOM)
    assign(videoRef.current);
    assign(previewVideoRef.current);

    // Poll until previewVideoRef is mounted (it appears after model loads)
    if (!previewVideoRef.current) {
      const interval = window.setInterval(() => {
        if (previewVideoRef.current) {
          assign(previewVideoRef.current);
          window.clearInterval(interval);
        }
      }, 100);
      return () => window.clearInterval(interval);
    }
  }, [cameraPermission, model]);

  // Face detection interval using face-api.js TinyFaceDetector
  useEffect(() => {
    let detectionInterval: number | undefined;
    let noFaceCount = 0;

    if (model && cameraPermission === "granted") {
      detectionInterval = window.setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.readyState < 3 || video.videoWidth === 0) return;
        try {
          const options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
            scoreThreshold: 0.5,
          });
          const detection = await faceapi.detectSingleFace(video, options);
          if (!detection) {
            noFaceCount++;
            if (noFaceCount >= 2) {
              setFaceDetected(false);
              setIsBlurred(true);
            }
          } else {
            noFaceCount = 0;
            setFaceDetected(true);
            setIsBlurred(false);
            setShowBlackout(false);
          }
        } catch (err) {
          console.error("Face detection error:", err);
        }
      }, 800);
    }
    return () => {
      if (detectionInterval) window.clearInterval(detectionInterval);
    };
  }, [model, cameraPermission]);

  // Blackout countdown
  useEffect(() => {
    if (!showBlackout) return;
    setCountdown(5);
    const tick = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(tick);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [showBlackout]);

  // Keyboard shortcut blocking
  useEffect(() => {
    const flashBlank = () => {
      setScreenshotBlank(true);
      setTimeout(() => setScreenshotBlank(false), 800);
    };
    const screenshotKeys = [
      (e: KeyboardEvent) => e.key === "PrintScreen",
      (e: KeyboardEvent) =>
        e.metaKey && e.shiftKey && e.key.toLowerCase() === "s",
      (e: KeyboardEvent) =>
        e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key),
    ];
    const blockedCombos = [
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "p",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "s",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "u",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "a",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "c",
      (e: KeyboardEvent) => e.key === "F12",
      (e: KeyboardEvent) =>
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ["i", "j", "c"].includes(e.key.toLowerCase()),
    ];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screenshotKeys.some((check) => check(e))) {
        e.preventDefault();
        e.stopPropagation();
        flashBlank();
        return;
      }
      if (blockedCombos.some((check) => check(e))) {
        e.preventDefault();
        e.stopPropagation();
        triggerBlackout(
          "Prohibited Action",
          "Screenshot, recording, and developer tools are strictly prohibited on this page."
        );
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        flashBlank();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [triggerBlackout]);

  // Right-click disable
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("contextmenu", block);
    return () => window.removeEventListener("contextmenu", block);
  }, []);

  // Visibility change
  useEffect(() => {
    const handler = () => {
      if (document.hidden) setIsBlurred(true);
      else setIsBlurred(false);
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // Window blur
  useEffect(() => {
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // DevTools detection
  useEffect(() => {
    const THRESHOLD = 160;
    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > THRESHOLD || heightDiff > THRESHOLD) {
        triggerBlackout(
          "Developer Tools Detected",
          "Developer tools are not permitted while viewing proprietary product data."
        );
      }
    };
    const interval = window.setInterval(checkDevTools, 1500);
    return () => window.clearInterval(interval);
  }, [triggerBlackout]);

  // Print blackout
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "fm-print-block";
    style.textContent = `@media print { body * { visibility: hidden !important; } body::after { content: '🔒 CONFIDENTIAL — PRINTING PROHIBITED'; visibility: visible !important; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; font-weight: 900; color: #FF0000; text-align: center; } }`;
    document.head.appendChild(style);
    return () => {
      document.getElementById("fm-print-block")?.remove();
    };
  }, []);

  // Drag prevention
  useEffect(() => {
    const block = (e: DragEvent) => e.preventDefault();
    document.addEventListener("dragstart", block);
    return () => document.removeEventListener("dragstart", block);
  }, []);

  // Mobile screenshot detection — sudden minor resize can indicate screenshot toolbar
  useEffect(() => {
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let resizeTime: number | undefined;

    const handleResize = () => {
      const now = Date.now();
      const dw = Math.abs(window.innerWidth - lastWidth);
      const dh = Math.abs(window.innerHeight - lastHeight);
      if (
        resizeTime &&
        now - resizeTime < 150 &&
        dw < 50 &&
        dh < 50 &&
        (dw > 0 || dh > 0)
      ) {
        setScreenshotBlank(true);
        setTimeout(() => setScreenshotBlank(false), 800);
      }
      resizeTime = now;
      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showBlankScreen =
    !faceDetected && model && cameraPermission === "granted";

  return {
    cameraPermission,
    isBlurred,
    showBlackout,
    blackoutReason,
    blackoutSubtitle,
    incidentTime,
    countdown,
    screenshotBlank,
    faceDetected,
    modelLoading,
    sessionId,
    model,
    videoRef,
    previewVideoRef,
    showBlankScreen,
    triggerBlackout,
    dismissBlackout,
  };
}
