import React, { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  captureVideoFrameAsBase64,
  enrollFaceWithBase64,
  getCurrentFaceAuthUser,
  hasLocalFaceProfile,
  loadFaceCaptureStack,
  markFaceProfileEnrolled,
} from "../../products/faceAuthApi";

const FaceAuthenticationSetup: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const savingRef = useRef(false);
  const [cameraPermission, setCameraPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [modelsReady, setModelsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(() => hasLocalFaceProfile());
  const [message, setMessage] = useState("Initializing face authentication.");
  const [capturedImage, setCapturedImage] = useState("");
  const [apiResult, setApiResult] = useState("");
  const currentUser = getCurrentFaceAuthUser();

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraPermission("denied");
        setMessage("Camera is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });

      streamRef.current = stream;
      setCameraPermission("granted");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera access failed:", err);
      setCameraPermission("denied");
      setMessage("Camera permission is required to add a face profile.");
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const modelPromise = loadFaceCaptureStack();
      await startCamera();
      const modelState = await modelPromise;
      if (!mounted) return;

      setModelsReady(modelState.detectorLoaded && modelState.landmarkLoaded);
      setMessage(
        modelState.detectorLoaded && modelState.landmarkLoaded
          ? "Camera check ready. Position one face clearly in the frame."
          : "Camera can still capture, but face pre-check could not be loaded."
      );
    };

    init();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [startCamera]);

  const handleSaveFace = async () => {
    if (savingRef.current) return;

    const video = videoRef.current;

    if (!currentUser.id) {
      toast.error("Logged-in user id was not found.");
      return;
    }

    if (cameraPermission !== "granted" || !video) {
      toast.error("Camera must be ready first.");
      return;
    }

    if (video.readyState < 3) {
      toast.error("Camera feed is still starting. Try again in a moment.");
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setMessage("Capturing face image.");

    try {
      if (modelsReady) {
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 160,
              scoreThreshold: 0.5,
            })
          )
          .withFaceLandmarks(true);

        if (detections.length !== 1) {
          toast.error(
            detections.length > 1
              ? "Keep only one face in the frame."
              : "No face detected. Look at the camera and try again."
          );
          setMessage("Capture needs exactly one clear face.");
          return;
        }
      }

      const base64Face = captureVideoFrameAsBase64(video);
      setMessage("Sending face image to enrollment API.");
      const result = await enrollFaceWithBase64(base64Face);
      markFaceProfileEnrolled(currentUser.id);
      setCapturedImage(base64Face);
      setHasProfile(true);
      setMessage(result.message || "Face enrolled successfully.");
      setApiResult(JSON.stringify(result));
      toast.success(result.message || "Face enrolled successfully.");
    } catch (err) {
      console.warn("Face enrollment failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to enroll face.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] px-6 py-6 font-poppins text-[#2C2C2C]">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-full border border-[#C4B89D]/60 px-3 py-1.5 text-xs font-semibold transition hover:border-[#DA7756]/40 hover:bg-[#DA7756]/10 hover:text-[#DA7756]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-6 border-b border-[#C4B89D]/50 pb-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DA7756]/20 bg-[#DA7756]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#DA7756]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Company Hub Security
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Face Authentication
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#2C2C2C]/65">
            Add the logged-in user&apos;s face profile for product details page
            authentication.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] h-full">
          <div className="relative flex flex-col overflow-hidden rounded-lg border border-[#C4B89D]/60 bg-[#F6F4EE] h-full">
            {cameraPermission !== "granted" && (
              <div className="flex flex-col items-center justify-center gap-3 bg-[#F6F4EE] text-[#2C2C2C]/50 h-full">
                <Camera className="h-10 w-10 text-[#C4B89D]" />
                <p className="text-xs font-medium">
                  {cameraPermission === "denied" ? "Camera access denied" : "Starting camera…"}
                </p>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
              style={{ transform: "scaleX(-1)", display: cameraPermission === "granted" ? "block" : "none" }}
            />
          </div>

          <div className="rounded-lg border border-[#C4B89D]/60 bg-white p-5 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#DA7756]/10 text-[#DA7756]">
              {hasProfile ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <UserCheck className="h-6 w-6" />
              )}
            </div>


            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2C2C2C]/45">
                  User
                </p>
                <p className="font-semibold">{currentUser.label}</p>
                <p className="text-xs text-[#2C2C2C]/50">
                  ID: {currentUser.id || "Not found"}
                </p>
              </div>

              <div className="rounded-md border border-[#C4B89D]/50 bg-[#F6F4EE] p-3 text-xs leading-relaxed text-[#2C2C2C]/70">
                {message}
              </div>

              {capturedImage && (
                <div className="overflow-hidden rounded-md border border-[#C4B89D]/50 bg-black">
                  <img
                    src={capturedImage}
                    alt="Captured face preview"
                    className="h-36 w-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                </div>
              )}

              {apiResult && (
                <div className="rounded-md border border-[#C4B89D]/50 bg-[#F6F4EE] p-3 text-[10px] leading-relaxed text-[#2C2C2C]/70 break-all">
                  {apiResult}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-[#C4B89D]/50 p-3">
                  <p className="font-semibold">Camera</p>
                  <p className="text-[#2C2C2C]/55">{cameraPermission}</p>
                </div>
                <div className="rounded-md border border-[#C4B89D]/50 p-3">
                  <p className="font-semibold">Profile</p>
                  <p className="text-[#2C2C2C]/55">
                    {hasProfile ? "enrolled" : "ready to enroll"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveFace}
                disabled={
                  saving || cameraPermission !== "granted" || !currentUser.id
                }
                className="inline-flex items-center gap-2 rounded-full bg-[#DA7756] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#c66545] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {hasProfile ? "Update Face" : "Add Face"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceAuthenticationSetup;
