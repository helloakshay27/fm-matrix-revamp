// @vitest-environment jsdom
// Panchshil Pulse → its own analytics API. The backend fixes Pulse's scope (project code TEP-01, the Pulse
// web portal and app), so Pulse's requests go to /commercial/pulse/adoption/* and carry only filters.
// FM and Club, which share this client, must keep their own requests.
import { beforeEach, describe, expect, it, vi } from "vitest";

const http = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("axios", () => ({
  default: {
    create: () => ({
      get: http.get,
      interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    }),
  },
}));

import {
  FM_ADOPTION_PATH,
  PULSE_ADOPTION_PATH,
  downloadRecentActiveUsers,
  fetchAdoptionTrend,
  fetchGrowth,
  fetchModules,
  fetchRecentActiveUsers,
  fetchTrafficSession,
  fetchWorkflowUsage,
  getDeviceInfo,
} from "../../posthog-dashboard/api/adoptionApi";

beforeEach(() => {
  http.get.mockReset();
  http.get.mockResolvedValue({ data: {} });
});

/** Path and query of the n-th request. */
const req = (n = 0) => {
  const url = new URL(String(http.get.mock.calls[n][0]), "http://api.test");
  return { path: url.pathname, params: Object.fromEntries(url.searchParams.entries()) };
};

const PULSE = { api: PULSE_ADOPTION_PATH, from: "2026-10-15", to: "2026-11-13", siteIds: [], devices: [], dev: "all" };

describe("Pulse requests", () => {
  it("go to Pulse's own API with the date range only", async () => {
    await fetchTrafficSession(PULSE);
    expect(PULSE_ADOPTION_PATH).toBe("/commercial/pulse/adoption");
    expect(req().path).toBe("/commercial/pulse/adoption/traffic_session");
    expect(req().params).toEqual({ from: "2026-10-15", to: "2026-11-13" });
  });

  it("never send a project code, tenant url, site id or device list (the API fixes the scope)", async () => {
    await fetchTrafficSession({ ...PULSE, projectCode: "TEP-01", siteIds: ["2189"], devices: ["Mobile"] });
    const { params } = req();
    expect(params.project_code).toBeUndefined();
    expect(params.url).toBeUndefined();
    expect(params.device_type).toBeUndefined();
    expect(params.site_id).toBe("2189"); // a site list, if a page ever passes one, still narrows
  });

  it("the iOS / Android buttons send the matching os; All sends nothing", async () => {
    expect(getDeviceInfo("ios")).toEqual({ os: "ios" });
    expect(getDeviceInfo("android")).toEqual({ os: "android" });
    expect(getDeviceInfo("all")).toEqual({});
    await fetchTrafficSession({ ...PULSE, dev: "android" });
    expect(req().params).toEqual({ from: "2026-10-15", to: "2026-11-13", os: "android" });
  });

  it("weekly endpoints send to / weeks (growth also from)", async () => {
    await fetchAdoptionTrend({ api: PULSE_ADOPTION_PATH, to: "2026-11-13", weeks: 8, dev: "all" });
    await fetchGrowth({ api: PULSE_ADOPTION_PATH, to: "2026-11-13", weeks: 6, from: "2026-10-15", dev: "all" });
    expect(req(0)).toEqual({ path: "/commercial/pulse/adoption/adoption_trend", params: { to: "2026-11-13", weeks: "8" } });
    expect(req(1)).toEqual({ path: "/commercial/pulse/adoption/growth", params: { to: "2026-11-13", weeks: "6", from: "2026-10-15" } });
  });

  it("modules and workflow usage pass the selected module", async () => {
    await fetchModules({ ...PULSE, module: "carpool" });
    await fetchWorkflowUsage({ ...PULSE, module: "carpool", subModule: "rides" });
    expect(req(0)).toEqual({ path: "/commercial/pulse/adoption/modules", params: { from: "2026-10-15", to: "2026-11-13", module: "carpool" } });
    expect(req(1).path).toBe("/commercial/pulse/adoption/workflow_usage");
    expect(req(1).params).toMatchObject({ module: "carpool", sub_module: "rides" });
  });

  it("recent activity and its download use Pulse's API too", async () => {
    await fetchRecentActiveUsers(PULSE);
    await downloadRecentActiveUsers(PULSE);
    expect(req(0)).toEqual({ path: "/commercial/pulse/adoption/recent_active_users", params: { from: "2026-10-15", to: "2026-11-13", limit: "10" } });
    expect(req(1).path).toBe("/commercial/pulse/adoption/active_users_export");
  });
});

describe("FM and Club keep their own requests", () => {
  it("FM (no api): FM's API with its tenant url, sites and device list", async () => {
    await fetchTrafficSession({ from: "2026-10-15", to: "2026-11-13", siteIds: ["2720", "2721"], devices: ["Desktop"] });
    expect(req().path).toBe(`${FM_ADOPTION_PATH}/traffic_session`);
    expect(req().params).toMatchObject({ site_id: "2720,2721", device_type: "Desktop", from: "2026-10-15" });
    expect(req().params.url).toBeTruthy();
  });

  it("Club (project code CM-01): Club's API", async () => {
    await fetchTrafficSession({ from: "2026-10-15", to: "2026-11-13", projectCode: "CM-01", tenantUrl: "fm-matrix.lockated.com" });
    expect(req().path).toBe("/commercial/club/adoption/traffic_session");
    expect(req().params).toMatchObject({ project_code: "CM-01", url: "fm-matrix.lockated.com" });
  });

  it("a TEP-01 project code no longer reroutes FM to Pulse", async () => {
    await fetchTrafficSession({ from: "2026-10-15", to: "2026-11-13", projectCode: "TEP-01", siteIds: ["1"] });
    expect(req().path).toBe(`${FM_ADOPTION_PATH}/traffic_session`);
  });
});
