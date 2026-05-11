/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string;
  readonly VITE_FACE_AUTH_API_URL?: string;
  readonly VITE_FACE_ENROLL_PATH?: string;
  readonly VITE_FACE_COLLECTION_ID?: string;
  readonly VITE_FACE_RECOGNIZE_PATH?: string;
  readonly VITE_FACE_RECOGNIZE_COLLECTION_ID?: string;
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
