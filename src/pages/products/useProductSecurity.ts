import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as faceapi from "face-api.js";
import { toast } from "sonner";
import {
  captureVideoFrameAsBase64,
  enrollFaceWithBase64,
  getCurrentFaceAuthUser,
  getRecognizedFaceUserId,
  hasLocalFaceProfile,
  isFaceAuthServiceUnavailableError,
  isFaceProfileMissingError,
  isFaceRecognitionUnconfiguredResponse,
  loadFaceApiNet,
  markFaceProfileEnrolled,
  recognizeFaceWithBase64,
} from "./faceAuthApi";

let modelsLoaded = false;
const FACE_RECOGNITION_INTERVAL_MS = 3000;
const FACE_AUTH_TOAST_INTERVAL_MS = 6000;

export type FaceAuthStatus =
  | "loading"
  | "presence_only"
  | "api_unavailable"
  | "unconfigured"
  | "ready"
  | "verified"
  | "rejected"
  | "multiple_faces"
  | "error";

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
  faceAuthStatus: FaceAuthStatus;
  faceAuthMessage: string;
  faceAuthLabel: string;
  registeringFace: boolean;
  registerFace: () => Promise<void>;
  refreshFaceProfile: () => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  previewVideoRef: React.RefObject<HTMLVideoElement | null>;
  showBlankScreen: boolean;
  triggerBlackout: (reason: string, subtitle: string) => void;
  dismissBlackout: () => void;
}

export function useProductSecurity(): SecurityState {
  const currentFaceAuthUser = useMemo(() => getCurrentFaceAuthUser(), []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [model, setModel] = useState<any>(modelsLoaded ? true : null);
  const [modelLoading, setModelLoading] = useState(!modelsLoaded);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceAuthStatus, setFaceAuthStatus] = useState<FaceAuthStatus>(
    modelsLoaded ? "ready" : "loading"
  );
  const [faceAuthMessage, setFaceAuthMessage] = useState(
    "Initializing camera security."
  );
  const [faceAuthLabel, setFaceAuthLabel] = useState(currentFaceAuthUser.label);
  const [registeringFace, setRegisteringFace] = useState(false);
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
  const screenshotBlankTimeoutRef = useRef<number | undefined>(undefined);
  const recognitionInFlightRef = useRef(false);
  const lastRecognitionAttemptRef = useRef(0);
  const lastFaceAuthToastRef = useRef(0);

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

  const flashScreenshotBlank = useCallback((duration = 1800) => {
    setScreenshotBlank(true);
    if (screenshotBlankTimeoutRef.current) {
      window.clearTimeout(screenshotBlankTimeoutRef.current);
    }
    screenshotBlankTimeoutRef.current = window.setTimeout(() => {
      setScreenshotBlank(false);
      screenshotBlankTimeoutRef.current = undefined;
    }, duration);
  }, []);

  const showFaceAuthToast = useCallback((message: string) => {
    const now = Date.now();
    if (now - lastFaceAuthToastRef.current < FACE_AUTH_TOAST_INTERVAL_MS) {
      return;
    }

    lastFaceAuthToastRef.current = now;
    toast.error(message);
  }, []);

  useEffect(() => {
    return () => {
      if (screenshotBlankTimeoutRef.current) {
        window.clearTimeout(screenshotBlankTimeoutRef.current);
      }
    };
  }, []);

  const refreshFaceProfile = useCallback(async () => {
    const hasStoredProfile = hasLocalFaceProfile(currentFaceAuthUser.id);

    setFaceDetected(false);
    setIsBlurred(true);
    setFaceAuthStatus(currentFaceAuthUser.id ? "ready" : "unconfigured");
    setFaceAuthLabel(currentFaceAuthUser.label);
    setFaceAuthMessage(
      !currentFaceAuthUser.id
        ? "Logged-in user id was not found."
        : hasStoredProfile
          ? "Ready to verify your enrolled face."
          : "Looking for an enrolled face profile."
    );
  }, [currentFaceAuthUser.id, currentFaceAuthUser.label]);

  const registerFace = useCallback(async () => {
    const video = videoRef.current;

    if (!currentFaceAuthUser.id) {
      setFaceAuthStatus("unconfigured");
      setFaceAuthMessage("Logged-in user id was not found.");
      return;
    }

    if (cameraPermission !== "granted" || !video || video.readyState < 3) {
      setFaceAuthStatus("error");
      setFaceAuthMessage("Camera must be ready first.");
      return;
    }

    if (!model) {
      setFaceAuthStatus("error");
      setFaceAuthMessage("Face detection model is not ready.");
      return;
    }

    setRegisteringFace(true);
    setFaceAuthMessage("Checking face in camera.");

    try {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 160,
        scoreThreshold: 0.5,
      });
      const detections = await faceapi
        .detectAllFaces(video, options)
        .withFaceLandmarks(true);

      if (detections.length !== 1) {
        setFaceAuthStatus(detections.length > 1 ? "multiple_faces" : "error");
        setFaceAuthMessage(
          detections.length > 1
            ? "Registration needs exactly one face in view."
            : "No face detected for registration."
        );
        return;
      }

      const base64Face = captureVideoFrameAsBase64(video);
      setFaceAuthMessage("Saving face profile.");
      const result = await enrollFaceWithBase64(base64Face);

      markFaceProfileEnrolled(currentFaceAuthUser.id);
      setFaceDetected(true);
      setIsBlurred(false);
      setFaceAuthStatus("verified");
      setFaceAuthMessage(result.message || "Face profile saved and verified.");
      toast.success(result.message || "Face profile saved and verified.");
    } catch (err) {
      console.warn("Face registration failed:", err);
      setFaceAuthStatus("error");
      setFaceDetected(false);
      setIsBlurred(true);
      const message =
        err instanceof Error ? err.message : "Face registration failed.";
      setFaceAuthMessage(message);
      showFaceAuthToast(message);
    } finally {
      setRegisteringFace(false);
    }
  }, [cameraPermission, currentFaceAuthUser.id, model, showFaceAuthToast]);

  // 1. Load face-api.js models + setup camera
  useEffect(() => {
    let mounted = true;
    let timeoutId: number | undefined;

    const loadModels = async () => {
      if (modelsLoaded) {
        if (!mounted) return;
        setModel({ faceDetection: true });
        setModelLoading(false);
        setFaceAuthStatus(currentFaceAuthUser.id ? "ready" : "unconfigured");
        return;
      }
      timeoutId = window.setTimeout(() => {
        if (!mounted) return;
        console.warn("face-api.js model loading timed out");
        setModelLoading(false);
        setFaceDetected(false);
        setIsBlurred(true);
        setFaceAuthStatus("error");
        setFaceAuthMessage("Face model loading timed out. Refresh the page.");
      }, 15000);

      const [detectorLoaded, landmarkLoaded] = await Promise.all([
        loadFaceApiNet(faceapi.nets.tinyFaceDetector, "tiny face detector"),
        loadFaceApiNet(faceapi.nets.faceLandmark68TinyNet, "face landmarks"),
      ]);

      if (!mounted) return;

      if (detectorLoaded && landmarkLoaded) {
        modelsLoaded = true;
        setModel({ faceDetection: true });
        setModelLoading(false);
        setFaceAuthStatus(currentFaceAuthUser.id ? "ready" : "unconfigured");
        setFaceAuthMessage("Face detection is active. Verifying identity.");
        window.clearTimeout(timeoutId);
        return;
      }

      console.error("face-api.js model failed to load from all sources");
      setModelLoading(false);
      setFaceDetected(false);
      setIsBlurred(true);
      setFaceAuthStatus("error");
      setFaceAuthMessage("Face-api.js models failed to load.");
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
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        mediaStreamRef.current = stream;
        setCameraPermission("granted");
      } catch (err) {
        if (!mounted) return;
        console.error("Camera access denied:", err);
        setCameraPermission("denied");
      }
    };

    loadModels();
    setupCamera();

    // Stop camera tracks when component unmounts
    return () => {
      mounted = false;
      if (timeoutId) window.clearTimeout(timeoutId);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [currentFaceAuthUser.id]);

  // Assign stream to video elements.
  // videoRef is always in DOM (unconditional in SecurityOverlays).
  // previewVideoRef appears only after model+camera are ready, so poll for it.
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

  useEffect(() => {
    if (!model || modelLoading) return;
    refreshFaceProfile();
  }, [model, modelLoading, refreshFaceProfile]);

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

          const detections = await faceapi.detectAllFaces(video, options);

          if (detections.length === 0) {
            noFaceCount++;
            if (noFaceCount >= 2) {
              setFaceDetected(false);
              setIsBlurred(true);
              setFaceAuthStatus((status) =>
                status === "unconfigured" ? status : "ready"
              );
              setFaceAuthMessage("No face detected. Please face the camera.");
            }
            return;
          }

          noFaceCount = 0;

          if (detections.length > 1) {
            setFaceDetected(false);
            setIsBlurred(true);
            setFaceAuthStatus("multiple_faces");
            setFaceAuthMessage("Keep only one face in the frame.");
            showFaceAuthToast("Multiple faces detected. Access blocked.");
            return;
          }

          if (!currentFaceAuthUser.id) {
            setFaceDetected(false);
            setIsBlurred(true);
            setFaceAuthStatus("unconfigured");
            setFaceAuthMessage("Logged-in user id was not found.");
            return;
          }

          const now = Date.now();
          if (
            recognitionInFlightRef.current ||
            now - lastRecognitionAttemptRef.current <
              FACE_RECOGNITION_INTERVAL_MS
          ) {
            return;
          }

          recognitionInFlightRef.current = true;
          lastRecognitionAttemptRef.current = now;
          setFaceAuthStatus((status) =>
            status === "verified" ? status : "ready"
          );

          try {
            const base64Face = captureVideoFrameAsBase64(video);
            const result = await recognizeFaceWithBase64(base64Face);
            const recognizedId = getRecognizedFaceUserId(result);
            const matchedCurrentUser = recognizedId
              ? recognizedId === currentFaceAuthUser.id
              : result.matched === true ||
                result.match === true ||
                result.verified === true;

            if (matchedCurrentUser) {
              setFaceDetected(true);
              setIsBlurred(false);
              setFaceAuthStatus("verified");
              setFaceAuthMessage(result.message || "Face verified.");
            } else if (isFaceRecognitionUnconfiguredResponse(result)) {
              setFaceDetected(false);
              setIsBlurred(true);
              setFaceAuthStatus("unconfigured");
              setFaceAuthMessage(
                result.message ||
                  "No enrolled face profile found. Add your face profile first."
              );
            } else {
              setFaceDetected(false);
              setIsBlurred(true);
              setFaceAuthStatus("rejected");
              setFaceAuthMessage("Face does not match the logged-in user.");
              showFaceAuthToast("Face does not match the logged-in user.");
            }
          } catch (err) {
            console.error("Face recognition API error:", err);
            if (isFaceProfileMissingError(err)) {
              setFaceDetected(false);
              setIsBlurred(true);
              setFaceAuthStatus("unconfigured");
              setFaceAuthMessage(
                "No enrolled face profile found. Add your face profile first."
              );
            } else if (isFaceAuthServiceUnavailableError(err)) {
              setFaceDetected(true);
              setIsBlurred(false);
              setFaceAuthStatus("api_unavailable");
              setFaceAuthMessage(
                "Face verification service is unavailable. Camera presence check is active."
              );
            } else {
              setFaceDetected(false);
              setIsBlurred(true);
              setFaceAuthStatus("error");
              setFaceAuthMessage("Face verification failed. Try again.");
              showFaceAuthToast("Face verification failed. Try again.");
            }
          } finally {
            recognitionInFlightRef.current = false;
          }
        } catch (err) {
          console.error("Face detection error:", err);
          setFaceDetected(false);
          setIsBlurred(true);
          setFaceAuthStatus("error");
          setFaceAuthMessage("Face detection failed. Try again.");
        }
      }, 800);
    }
    return () => {
      if (detectionInterval) window.clearInterval(detectionInterval);
    };
  }, [model, cameraPermission, currentFaceAuthUser.id, showFaceAuthToast]);

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

  // Enhanced keyboard shortcut blocking
  useEffect(() => {
    const screenshotKeys = [
      (e: KeyboardEvent) => e.key === "PrintScreen",
      (e: KeyboardEvent) => e.key === "Snapshot",
      (e: KeyboardEvent) => e.key === "PrtSc",
      (e: KeyboardEvent) => e.key === "PrtScn",
      (e: KeyboardEvent) => e.code === "PrintScreen",
      (e: KeyboardEvent) =>
        e.metaKey && e.shiftKey && e.key.toLowerCase() === "s",
      (e: KeyboardEvent) =>
        e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key),
      (e: KeyboardEvent) =>
        e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s",
      (e: KeyboardEvent) => e.altKey && e.key.toLowerCase() === "printscreen",
      (e: KeyboardEvent) => e.altKey && e.code === "PrintScreen",
      (e: KeyboardEvent) =>
        e.ctrlKey && e.altKey && e.key.toLowerCase() === "s",
      (e: KeyboardEvent) =>
        e.metaKey && e.altKey && e.key.toLowerCase() === "s",
    ];
    const blockedCombos = [
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "p",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "s",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "u",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "a",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "c",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "x",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "v",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "f",
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "g",
      (e: KeyboardEvent) => e.key === "F12",
      (e: KeyboardEvent) => e.key === "F10",
      (e: KeyboardEvent) => e.key === "F9",
      (e: KeyboardEvent) => e.key === "F8",
      (e: KeyboardEvent) =>
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ["i", "j", "c"].includes(e.key.toLowerCase()),
      (e: KeyboardEvent) =>
        (e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "i",
    ];
    const keywordSearchCombos = [
      (e: KeyboardEvent) =>
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f",
      (e: KeyboardEvent) =>
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g",
      (e: KeyboardEvent) => e.key === "F3",
    ];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screenshotKeys.some((check) => check(e))) {
        e.preventDefault();
        e.stopPropagation();
        flashScreenshotBlank(2500);
        // Clear clipboard to prevent screenshot paste
        navigator.clipboard?.writeText("");
        return;
      }
      if (keywordSearchCombos.some((check) => check(e))) {
        e.preventDefault();
        e.stopPropagation();
        triggerBlackout(
          "Keyword Search Blocked",
          "Keyword searching, screenshots, recording, and developer tools are prohibited on this page."
        );
        return;
      }
      if (blockedCombos.some((check) => check(e))) {
        e.preventDefault();
        e.stopPropagation();
        triggerBlackout(
          "Prohibited Action",
          "Screenshots, keyword search, recording, clipboard actions, and developer tools are prohibited on this page."
        );
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        e.key === "Snapshot" ||
        e.key === "PrtSc" ||
        e.key === "PrtScn" ||
        e.code === "PrintScreen"
      ) {
        e.preventDefault();
        flashScreenshotBlank(2500);
        navigator.clipboard?.writeText("");
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [flashScreenshotBlank, triggerBlackout]);

  // Right-click disable
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("contextmenu", block);
    return () => window.removeEventListener("contextmenu", block);
  }, []);

  // Visibility change
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        setIsBlurred(true);
        flashScreenshotBlank(2500);
      } else if (faceDetected) {
        setIsBlurred(false);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [faceDetected, flashScreenshotBlank]);

  // Window blur
  useEffect(() => {
    const handleBlur = () => {
      setIsBlurred(true);
      flashScreenshotBlank(2500);
    };
    const handleFocus = () => {
      if (faceDetected) setIsBlurred(false);
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [faceDetected, flashScreenshotBlank]);

  // Enhanced DevTools detection with multiple methods
  useEffect(() => {
    const THRESHOLD = 160;
    let devToolsDetected = false;

    // Method 1: Window size difference detection
    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > THRESHOLD || heightDiff > THRESHOLD) {
        devToolsDetected = true;
        triggerBlackout(
          "Developer Tools Detected",
          "Developer tools are not permitted while viewing proprietary product data."
        );
      }
    };

    // Method 2: Console timing attack detection
    const detectConsole = () => {
      const start = performance.now();
      // eslint-disable-next-line no-console
      console.clear();
      const end = performance.now();
      if (end - start > 100 && !devToolsDetected) {
        devToolsDetected = true;
        triggerBlackout(
          "Developer Tools Detected",
          "Developer tools are not permitted while viewing proprietary product data."
        );
      }
    };

    // Method 3: Debugger statement detection
    const detectDebugger = () => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = performance.now();
      if (end - start > 100 && !devToolsDetected) {
        devToolsDetected = true;
        triggerBlackout(
          "Developer Tools Detected",
          "Developer tools are not permitted while viewing proprietary product data."
        );
      }
    };

    // Method 4: Element inspection prevention
    const preventInspect = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Run detection checks
    const interval = window.setInterval(() => {
      if (!devToolsDetected) {
        checkDevTools();
        detectConsole();
        detectDebugger();
      }
    }, 1500);

    // Add event listeners for element inspection
    document.addEventListener("contextmenu", preventInspect, true);
    document.addEventListener("selectstart", preventInspect, true);
    document.addEventListener("copy", preventInspect, true);
    document.addEventListener("cut", preventInspect, true);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("contextmenu", preventInspect, true);
      document.removeEventListener("selectstart", preventInspect, true);
      document.removeEventListener("copy", preventInspect, true);
      document.removeEventListener("cut", preventInspect, true);
    };
  }, [triggerBlackout]);

  // Print blackout
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "fm-print-block";
    style.textContent = `@media print { body * { visibility: hidden !important; } body::after { content: 'CONFIDENTIAL - PRINTING PROHIBITED'; visibility: visible !important; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; font-weight: 900; color: #FF0000; text-align: center; } }`;
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

  // Screen recording detection and prevention
  useEffect(() => {
    let recordingDetected = false;

    // Method 1: Detect getDisplayMedia API usage (screen sharing)
    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia;
    if (navigator.mediaDevices?.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia = async (...args) => {
        recordingDetected = true;
        triggerBlackout(
          "Screen Recording Detected",
          "Screen recording and screen sharing are strictly prohibited on this page."
        );
        return Promise.reject(new Error("Screen recording is not allowed"));
      };
    }

    // Method 2: Detect MediaRecorder usage
    const originalMediaRecorder = window.MediaRecorder;
    if (window.MediaRecorder) {
      window.MediaRecorder = function (...args) {
        recordingDetected = true;
        triggerBlackout(
          "Screen Recording Detected",
          "Screen recording is strictly prohibited on this page."
        );
        throw new Error("MediaRecorder is not allowed");
      } as unknown as typeof MediaRecorder;
      window.MediaRecorder.prototype = originalMediaRecorder.prototype;
    }

    // Method 3: Detect video capture stream
    const originalCaptureStream = HTMLCanvasElement.prototype.captureStream;
    if (HTMLCanvasElement.prototype.captureStream) {
      HTMLCanvasElement.prototype.captureStream = function (...args) {
        recordingDetected = true;
        triggerBlackout(
          "Screen Recording Detected",
          "Screen recording is strictly prohibited on this page."
        );
        throw new Error("Canvas capture is not allowed");
      };
    }

    return () => {
      if (originalGetDisplayMedia && navigator.mediaDevices?.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
      if (originalMediaRecorder) {
        window.MediaRecorder = originalMediaRecorder;
      }
      if (originalCaptureStream) {
        HTMLCanvasElement.prototype.captureStream = originalCaptureStream;
      }
    };
  }, [triggerBlackout]);

  // Clipboard monitoring and protection
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      triggerBlackout(
        "Clipboard Access Blocked",
        "Copying content from this page is not permitted."
      );
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      triggerBlackout(
        "Clipboard Access Blocked",
        "Cutting content from this page is not permitted."
      );
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Periodically clear clipboard
    const clearClipboardInterval = window.setInterval(() => {
      navigator.clipboard?.writeText("").catch(() => {
        // Ignore errors if clipboard access is denied
      });
    }, 5000);

    document.addEventListener("copy", handleCopy, true);
    document.addEventListener("cut", handleCut, true);
    document.addEventListener("paste", handlePaste, true);

    return () => {
      window.clearInterval(clearClipboardInterval);
      document.removeEventListener("copy", handleCopy, true);
      document.removeEventListener("cut", handleCut, true);
      document.removeEventListener("paste", handlePaste, true);
    };
  }, [triggerBlackout]);

  // Aggressive content protection with CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "fm-content-protection";
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      body {
        -webkit-user-drag: none !important;
        user-drag: none !important;
      }
      img, video, canvas {
        -webkit-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById("fm-content-protection")?.remove();
  }, []);

  // Enhanced window focus/blur detection with immediate blur effect
  useEffect(() => {
    let blurTimeout: number | undefined;

    const handleBlur = () => {
      setIsBlurred(true);
      // Immediately flash blank screen when window loses focus (common during screenshots)
      flashScreenshotBlank(2500);
    };

    const handleFocus = () => {
      if (blurTimeout) window.clearTimeout(blurTimeout);
      blurTimeout = window.setTimeout(() => {
        if (faceDetected) setIsBlurred(false);
      }, 200);
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      if (blurTimeout) window.clearTimeout(blurTimeout);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [faceDetected, flashScreenshotBlank]);

  // Aggressive screenshot protection - blank screen on any key press
  useEffect(() => {
    const handleAnyKeyDown = (e: KeyboardEvent) => {
      // Flash blank screen on any key press to prevent screenshot timing
      if (e.key === "PrintScreen" || e.code === "PrintScreen" || e.metaKey) {
        flashScreenshotBlank(2500);
      }
    };

    window.addEventListener("keydown", handleAnyKeyDown, true);
    return () => window.removeEventListener("keydown", handleAnyKeyDown, true);
  }, [flashScreenshotBlank]);

  // Continuous protection overlay - makes screenshots unreadable
  useEffect(() => {
    const protectionDiv = document.createElement("div");
    protectionDiv.id = "fm-protection-overlay";
    protectionDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99999;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.05),
        rgba(0, 0, 0, 0.05) 1px,
        transparent 1px,
        transparent 2px
      );
      mix-blend-mode: multiply;
    `;
    document.body.appendChild(protectionDiv);

    // Add random color flickering to interfere with screenshots
    const flickerInterval = window.setInterval(() => {
      const randomOpacity = Math.random() * 0.1;
      protectionDiv.style.background = `repeating-linear-gradient(
        0deg,
        rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 50}, ${randomOpacity}),
        rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 50}, ${randomOpacity}) 1px,
        transparent 1px,
        transparent 2px
      )`;
    }, 100);

    return () => {
      window.clearInterval(flickerInterval);
      document.getElementById("fm-protection-overlay")?.remove();
    };
  }, []);

  // Hard DOM-level screenshot blanker. This sits outside React page structure,
  // so custom product wrappers cannot accidentally cover it.
  useEffect(() => {
    let overlay = document.getElementById("fm-screenshot-hard-blank");
    if (screenshotBlank) {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "fm-screenshot-hard-blank";
        overlay.setAttribute("aria-hidden", "true");
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          background: #ffffff;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(44, 44, 44, 0.24);
          font: 700 12px monospace;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        `;
        overlay.textContent = "CONFIDENTIAL - SCREEN CAPTURE BLOCKED";
        document.body.appendChild(overlay);
      }
      document.documentElement.classList.add("fm-screenshot-blank-active");
      document.body.classList.add("fm-screenshot-blank-active");
    } else {
      overlay?.remove();
      document.documentElement.classList.remove("fm-screenshot-blank-active");
      document.body.classList.remove("fm-screenshot-blank-active");
    }

    return () => {
      if (!screenshotBlank) return;
      document.getElementById("fm-screenshot-hard-blank")?.remove();
      document.documentElement.classList.remove("fm-screenshot-blank-active");
      document.body.classList.remove("fm-screenshot-blank-active");
    };
  }, [screenshotBlank]);

  // Mobile screenshot detection: sudden minor resize can indicate screenshot toolbar.
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
        flashScreenshotBlank(2500);
      }
      resizeTime = now;
      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [flashScreenshotBlank]);

  const showBlankScreen =
    cameraPermission === "granted" && !faceDetected && !modelLoading;

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
    faceAuthStatus,
    faceAuthMessage,
    faceAuthLabel,
    registeringFace,
    registerFace,
    refreshFaceProfile,
    videoRef,
    previewVideoRef,
    showBlankScreen,
    triggerBlackout,
    dismissBlackout,
  };
}
