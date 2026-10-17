import type { HostMode } from "../types/visitorAppConfig";

export const VISITOR_APP_CONFIG_QUERY_KEY_PREFIX = "visitor-app-config";

export const HOST_MODE_OPTIONS: { value: HostMode; label: string; description: string }[] = [
  { value: "DROPDOWN", label: "Dropdown", description: "Visitor picks the host from a list" },
  { value: "MANUAL", label: "Manual", description: "Visitor types the host name" },
];

// Display labels for the codes the API returns. Unknown codes fall back to
// a title-cased version of the code, so new backend codes still render.
export const VISITOR_STEP_LABELS: Record<string, string> = {
  BASIC_INFO: "Basic Info",
  ASSET_DECLARATION: "Asset Declaration",
  ADDITIONAL_VISITOR: "Additional Visitor",
  IDENTITY: "Identity",
  DECLARATION: "Declaration",
};

export const MODULE_LABELS: Record<string, string> = {
  VISITOR_ENTRY: "Visitor Entry",
  REGISTER: "Register",
  GUEST: "Guest",
  VEHICLE: "Vehicle",
  GATE_IN: "Gate In",
  GATE_OUT: "Gate Out",
};

export const formatConfigCode = (code: string, labels: Record<string, string>) =>
  labels[code] ??
  code
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
