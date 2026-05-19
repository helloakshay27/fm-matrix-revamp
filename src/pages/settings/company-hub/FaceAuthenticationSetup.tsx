import React, { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImageOff,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  captureVideoFrameAsBase64,
  enrollFaceWithBase64,
  getAllFaceAddedUsers,
  getCurrentFaceAuthUser,
  hasLocalFaceProfile,
  loadFaceCaptureStack,
  markFaceProfileEnrolled,
  UserFaceMember,
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
  const [faceMembers, setFaceMembers] = useState<UserFaceMember[]>([]);
  const [facesLoading, setFacesLoading] = useState(false);
  const [facesError, setFacesError] = useState("");
  const [faceImageErrors, setFaceImageErrors] = useState<
    Record<string, boolean>
  >({});
  const [faceSummary, setFaceSummary] = useState({
    totalCount: 0,
    faceAddedCount: 0,
    faceNotAdded: 0,
    collectionId: "",
  });
  const currentUser = getCurrentFaceAuthUser();

  const loadFaceMembers = useCallback(async (signal?: AbortSignal) => {
    setFacesLoading(true);
    setFacesError("");

    try {
      const response = await getAllFaceAddedUsers({ perPage: 100, signal });
      if (signal?.aborted) return;

      const users = response.users || [];
      setFaceMembers(users);
      setFaceImageErrors({});
      setFaceSummary({
        totalCount: Number(response.total_count) || users.length,
        faceAddedCount: Number(response.face_added_count) || users.length,
        faceNotAdded: Number(response.face_not_added) || 0,
        collectionId: response.collection_id || "",
      });
    } catch (err) {
      if (signal?.aborted) return;

      console.warn("User faces list failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load user faces.";
      setFacesError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (!signal?.aborted) {
        setFacesLoading(false);
      }
    }
  }, []);

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

  useEffect(() => {
    const controller = new AbortController();
    loadFaceMembers(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadFaceMembers]);

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
      void loadFaceMembers();
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
                  {cameraPermission === "denied"
                    ? "Camera access denied"
                    : "Starting camera..."}
                </p>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
              style={{
                transform: "scaleX(-1)",
                display: cameraPermission === "granted" ? "block" : "none",
              }}
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

        <div className="mt-6 rounded-lg border border-[#C4B89D]/60 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#C4B89D]/50 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DA7756]/20 bg-[#DA7756]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#DA7756]">
                <Users className="h-3.5 w-3.5" />
                Added Faces
              </div>
              <h2 className="text-lg font-semibold tracking-tight">
                Members with Face Authentication
              </h2>
              <p className="mt-1 text-xs text-[#2C2C2C]/55">
                Showing members whose face profile has been added through the
                user faces API.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#2C2C2C]/65">
              <div>
                <p className="font-semibold text-[#2C2C2C]">
                  {faceSummary.faceAddedCount}
                </p>
                <p>Faces added</p>
              </div>
              <div>
                <p className="font-semibold text-[#2C2C2C]">
                  {faceSummary.faceNotAdded}
                </p>
                <p>Not added</p>
              </div>
              <div>
                <p className="font-semibold text-[#2C2C2C]">
                  {faceSummary.totalCount}
                </p>
                <p>Total members</p>
              </div>
              <button
                type="button"
                onClick={() => loadFaceMembers()}
                disabled={facesLoading}
                className="inline-flex items-center gap-2 rounded-full border border-[#C4B89D]/70 px-4 py-2 font-semibold transition hover:border-[#DA7756]/40 hover:bg-[#DA7756]/10 hover:text-[#DA7756] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${facesLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20">Face</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facesLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-sm text-[#2C2C2C]/55"
                  >
                    Loading added face members...
                  </TableCell>
                </TableRow>
              ) : facesError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-sm text-[#2C2C2C]/55"
                  >
                    {facesError}
                  </TableCell>
                </TableRow>
              ) : faceMembers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-sm text-[#2C2C2C]/55"
                  >
                    No members have added faces yet.
                  </TableCell>
                </TableRow>
              ) : (
                faceMembers.map((member) => {
                  const memberKey = String(member.id);
                  const memberName = member.name || "Unnamed member";
                  const showFaceImage =
                    !!member.face_url && !faceImageErrors[memberKey];

                  return (
                    <TableRow key={memberKey}>
                      <TableCell>
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-[#C4B89D]/50 bg-[#F6F4EE]">
                          {showFaceImage ? (
                            <img
                              src={member.face_url}
                              alt={`${memberName} face`}
                              className="h-full w-full object-cover"
                              onError={() =>
                                setFaceImageErrors((previous) => ({
                                  ...previous,
                                  [memberKey]: true,
                                }))
                              }
                            />
                          ) : (
                            <ImageOff className="h-5 w-5 text-[#C4B89D]" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-[#2C2C2C]">
                          {memberName}
                        </p>
                      </TableCell>
                      <TableCell className="text-[#2C2C2C]/65">
                        {member.email || "-"}
                      </TableCell>
                      <TableCell className="text-[#2C2C2C]/65">
                        {member.id || "-"}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Added
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {faceSummary.collectionId && (
            <div className="border-t border-[#C4B89D]/40 px-5 py-3 text-xs text-[#2C2C2C]/50">
              Collection: {faceSummary.collectionId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceAuthenticationSetup;
