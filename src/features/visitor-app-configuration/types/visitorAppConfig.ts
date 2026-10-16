export type HostMode = "DROPDOWN" | "MANUAL";

export interface ConfigToggle {
  code: string;
  active: boolean;
}

export interface VisitorAppConfig {
  siteId: number;
  hostMode: HostMode;
  visitorSteps: ConfigToggle[];
  modules: ConfigToggle[];
  updatedAt: string;
  configVersion: string;
}

export interface UpdateVisitorAppConfigPayload {
  hostMode: HostMode;
  visitorSteps: ConfigToggle[];
  modules: ConfigToggle[];
}
