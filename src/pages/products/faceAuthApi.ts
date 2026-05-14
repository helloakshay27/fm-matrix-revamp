import * as faceapi from "face-api.js";
import axios from "axios";
import { getToken, getUser } from "../../utils/auth";

const DEFAULT_FACE_AUTH_API_URL = "https://fm-uat-api.lockated.com";
const normalizePath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;
const FACE_RECOGNIZE_PATH = normalizePath(
  import.meta.env.VITE_FACE_RECOGNIZE_PATH || "/recognize_face"
);
const FACE_ENROLL_PATH = normalizePath(
  import.meta.env.VITE_FACE_ENROLL_PATH || "/user_faces"
);
const FACE_COLLECTION_ID =
  import.meta.env.VITE_FACE_COLLECTION_ID ||
  import.meta.env.VITE_FACE_RECOGNIZE_COLLECTION_ID ||
  "fm-matrix";
const FACE_PROFILE_STORAGE_PREFIX = "fm_face_auth_profile";

export const FACE_MODEL_URLS = [
  "/models",
  "https://justadudewhohacks.github.io/face-api.js/models",
];

export const getCurrentFaceAuthUser = () => {
  const user = getUser();
  const fallbackUserId = localStorage.getItem("user_id");
  const id = user?.id ?? fallbackUserId;
  const name = [user?.firstname, user?.lastname].filter(Boolean).join(" ");

  return {
    id: id ? String(id) : "",
    label: name || user?.email || "Authorized User",
  };
};

export const getFaceAuthApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_FACE_AUTH_API_URL;

  return (configuredUrl || DEFAULT_FACE_AUTH_API_URL).replace(/\/+$/, "");
};

export const getFaceProfileStorageKey = (userId?: string | number) => {
  const id = userId ? String(userId) : getCurrentFaceAuthUser().id;
  return id ? `${FACE_PROFILE_STORAGE_PREFIX}:${id}` : "";
};

export const hasLocalFaceProfile = (userId?: string | number) => {
  const key = getFaceProfileStorageKey(userId);
  if (!key) return false;

  try {
    return !!localStorage.getItem(key);
  } catch {
    return false;
  }
};

export const markFaceProfileEnrolled = (userId?: string | number) => {
  const key = getFaceProfileStorageKey(userId);
  if (!key) return;

  try {
    localStorage.setItem(key, new Date().toISOString());
  } catch {
    // Local storage is only a UI hint; the API remains the source of truth.
  }
};

export const loadFaceApiNet = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  net: any,
  name: string
) => {
  const alreadyLoaded =
    typeof net.isLoaded === "function" ? net.isLoaded() : net.isLoaded;
  if (alreadyLoaded) return true;

  for (const modelUrl of FACE_MODEL_URLS) {
    try {
      await net.loadFromUri(modelUrl);
      return true;
    } catch (err) {
      console.warn(`Model load failed for ${name} from ${modelUrl}`, err);
    }
  }

  return false;
};

export const loadFaceCaptureStack = async () => {
  const [detectorLoaded, landmarkLoaded] = await Promise.all([
    loadFaceApiNet(faceapi.nets.tinyFaceDetector, "tiny face detector"),
    loadFaceApiNet(faceapi.nets.faceLandmark68TinyNet, "face landmarks"),
  ]);

  return {
    detectorLoaded,
    landmarkLoaded,
    ready: detectorLoaded && landmarkLoaded,
  };
};

export const captureVideoFrameAsBase64 = (video: HTMLVideoElement) => {
  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to read camera frame");

  context.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL("image/png");
};

export const stripDataUrlPrefix = (dataUrl: string) => {
  const commaIndex = dataUrl.indexOf(",");
  return commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
};

const dataUrlToFile = (dataUrl: string, filename: string) => {
  const commaIndex = dataUrl.indexOf(",");
  const metadata =
    commaIndex >= 0 ? dataUrl.slice(0, commaIndex) : "data:image/png;base64";
  const base64Data = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
  const mimeMatch = metadata.match(/data:(.*);base64/);
  const mimeType = mimeMatch?.[1] || "image/png";
  const byteString = atob(base64Data);
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i += 1) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new File([byteArray], filename, { type: mimeType });
};

export class FaceAuthApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(
    message: string,
    options: { status?: number; data?: unknown } = {}
  ) {
    super(message);
    this.name = "FaceAuthApiError";
    this.status = options.status;
    this.data = options.data;
  }
}

const readApiMessage = (data: unknown) => {
  if (!data || typeof data !== "object") return "";

  const record = data as Record<string, unknown>;
  const message =
    typeof record.message === "string"
      ? record.message
      : typeof record.error === "string"
        ? record.error
        : typeof record.detail === "string"
          ? record.detail
          : "";

  return message;
};

const isAwsRekognitionConfigurationMessage = (message: string) =>
  /uninitialized constant\s+Aws::Rekognition/i.test(message);

const FACE_REKOGNITION_CONFIGURATION_MESSAGE =
  "Face authentication service is not configured on the backend. Please ask the backend team to enable AWS Rekognition.";

const getFaceApiError = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    const apiMessage = readApiMessage(data);
    const backendConfigMessage = isAwsRekognitionConfigurationMessage(
      apiMessage
    )
      ? FACE_REKOGNITION_CONFIGURATION_MESSAGE
      : "";
    const message =
      backendConfigMessage ||
      apiMessage ||
      (err.response?.status
        ? `${fallback} (${err.response.status})`
        : fallback);

    return new FaceAuthApiError(message, {
      status: err.response?.status,
      data,
    });
  }

  return new FaceAuthApiError(err instanceof Error ? err.message : fallback);
};

export type FaceRecognitionResponse = {
  id?: string | number;
  user_id?: string | number;
  userId?: string | number;
  external_image_id?: string | number;
  externalImageId?: string | number;
  ExternalImageId?: string | number;
  matched?: boolean;
  match?: boolean;
  verified?: boolean;
  success?: boolean;
  code?: number;
  confidence?: number;
  message?: string;
  error?: string;
  [key: string]: unknown;
};

export type FaceEnrollmentResponse = {
  code?: number;
  message?: string;
};

export type UserFaceMember = {
  id: string | number;
  name?: string | null;
  face_added: boolean;
  email?: string | null;
  face_url?: string | null;
};

export type UserFacesResponse = {
  code?: number;
  collection_id?: string;
  total_count?: number;
  face_added_count?: number;
  face_not_added?: number;
  page?: number;
  per_page?: number;
  users?: UserFaceMember[];
  [key: string]: unknown;
};

type GetUserFacesParams = {
  page?: number;
  perPage?: number;
  signal?: AbortSignal;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;

const normalizeId = (value: unknown) => {
  if (value === null || value === undefined) return "";
  const normalized = String(value).trim();
  return normalized;
};

const readIdFromRecord = (record: Record<string, unknown> | null) => {
  if (!record) return "";

  const idKeys = [
    "external_image_id",
    "externalImageId",
    "ExternalImageId",
    "user_id",
    "userId",
    "id",
  ];

  for (const key of idKeys) {
    const value = normalizeId(record[key]);
    if (value) return value;
  }

  return "";
};

export const getRecognizedFaceUserId = (
  response: FaceRecognitionResponse | null | undefined
) => {
  const root = asRecord(response);
  const directId = readIdFromRecord(root);
  if (directId) return directId;

  const nestedKeys = [
    "user",
    "face",
    "match",
    "matched_face",
    "face_match",
    "result",
    "data",
  ];

  for (const key of nestedKeys) {
    const id = readIdFromRecord(asRecord(root?.[key]));
    if (id) return id;
  }

  const arrayKeys = ["matches", "face_matches", "FaceMatches", "results"];

  for (const key of arrayKeys) {
    const value = root?.[key];
    if (!Array.isArray(value) || value.length === 0) continue;

    const firstMatch = asRecord(value[0]);
    const matchId = readIdFromRecord(firstMatch);
    if (matchId) return matchId;

    const awsFaceId = readIdFromRecord(asRecord(firstMatch?.Face));
    if (awsFaceId) return awsFaceId;
  }

  return "";
};

const faceProfileMissingMessages = [
  "not enrolled",
  "not registered",
  "profile not found",
  "face profile not found",
  "user face not found",
  "no face profile",
  "no enrolled face",
  "face not found",
];

const hasFaceProfileMissingMessage = (message: string) => {
  const lowerMessage = message.toLowerCase();
  return faceProfileMissingMessages.some((part) => lowerMessage.includes(part));
};

export const isFaceProfileMissingError = (err: unknown) => {
  if (!(err instanceof FaceAuthApiError)) return false;

  return (
    err.status === 404 ||
    hasFaceProfileMissingMessage(err.message) ||
    hasFaceProfileMissingMessage(readApiMessage(err.data))
  );
};

export const isFaceAuthServiceUnavailableError = (err: unknown) => {
  if (!(err instanceof FaceAuthApiError)) return false;
  if (
    isAwsRekognitionConfigurationMessage(err.message) ||
    isAwsRekognitionConfigurationMessage(readApiMessage(err.data))
  ) {
    return true;
  }

  return (
    !err.status || err.status === 408 || err.status === 429 || err.status >= 500
  );
};

export const isFaceRecognitionUnconfiguredResponse = (
  response: FaceRecognitionResponse
) => {
  const message =
    typeof response.message === "string"
      ? response.message
      : typeof response.error === "string"
        ? response.error
        : "";

  return response.code === 404 || hasFaceProfileMissingMessage(message);
};

export const enrollFaceWithBase64 = async (base64Face: string) => {
  const token = getToken();
  const user = getCurrentFaceAuthUser();

  if (!user.id) {
    throw new Error("Logged-in user id was not found.");
  }

  try {
    const formData = new FormData();
    const faceFile = dataUrlToFile(base64Face, `user-face-${user.id}.png`);
    formData.append("user_id", user.id);
    formData.append("face", faceFile);

    const response = await axios.post<FaceEnrollmentResponse>(
      `${getFaceAuthApiBaseUrl()}${FACE_ENROLL_PATH}`,
      formData,
      {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    return response.data;
  } catch (err) {
    throw getFaceApiError(err, "Failed to enroll face");
  }
};

export const getUserFaces = async ({
  page = 1,
  perPage = 10,
  signal,
}: GetUserFacesParams = {}) => {
  const token = getToken();

  try {
    const response = await axios.get<UserFacesResponse>(
      `${getFaceAuthApiBaseUrl()}${FACE_ENROLL_PATH}`,
      {
        params: {
          page,
          per_page: perPage,
        },
        signal,
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    return response.data;
  } catch (err) {
    throw getFaceApiError(err, "Failed to load user faces");
  }
};

export const getAllFaceAddedUsers = async ({
  perPage = 100,
  signal,
}: Omit<GetUserFacesParams, "page"> = {}) => {
  const firstPage = await getUserFaces({ page: 1, perPage, signal });
  const users = [...(firstPage.users || [])];
  const responsePerPage = Number(firstPage.per_page) || perPage;
  const totalCount = Number(firstPage.total_count) || users.length;
  const totalPages =
    responsePerPage > 0 ? Math.ceil(totalCount / responsePerPage) : 1;

  for (let page = 2; page <= totalPages; page += 1) {
    if (signal?.aborted) break;

    const response = await getUserFaces({ page, perPage, signal });
    users.push(...(response.users || []));
  }

  const addedUsers = users.filter((user) => user.face_added);

  return {
    ...firstPage,
    users: addedUsers,
    page: 1,
    per_page: addedUsers.length,
    face_added_count: Number(firstPage.face_added_count) || addedUsers.length,
    face_not_added:
      Number(firstPage.face_not_added) ||
      Math.max(totalCount - addedUsers.length, 0),
    total_count: totalCount,
  };
};

export const recognizeFaceWithBase64 = async (base64Face: string) => {
  const token = getToken();
  const endpoint = `${getFaceAuthApiBaseUrl()}${FACE_RECOGNIZE_PATH}`;

  try {
    const formData = new FormData();
    formData.append("face", dataUrlToFile(base64Face, "face-check.png"));
    formData.append("collection_id", FACE_COLLECTION_ID);

    const response = await axios.post<FaceRecognitionResponse>(
      endpoint,
      formData,
      {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    return response.data;
  } catch (err) {
    throw getFaceApiError(err, "Failed to recognize face");
  }
};
