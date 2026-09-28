/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string;
  readonly VITE_FACE_AUTH_API_URL?: string;
  readonly VITE_FACE_ENROLL_PATH?: string;
  readonly VITE_FACE_COLLECTION_ID?: string;
  readonly VITE_FACE_RECOGNIZE_PATH?: string;
  readonly VITE_FACE_RECOGNIZE_COLLECTION_ID?: string;
  // PostHog adoption analytics tenant/domain config shared by the Pulse and
  // FM Matrix dashboards. The API host is fixed in the shared client.
  readonly VITE_FM_ADOPTION_TENANT_URL?: string;
  // Panchshil Pulse analytics project code. Single source of truth for both the
  // project_code stamped on Pulse events and the project_code sent as the scoping
  // query param to /fm/adoption/*. Must not differ between the two, or every
  // TEP-01-scoped metric comes back empty. Defaults to TEP-01.
  readonly VITE_FM_ADOPTION_PROJECT_CODE?: string;
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
