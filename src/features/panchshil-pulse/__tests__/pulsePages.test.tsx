// @vitest-environment jsdom
// The Pulse pages with the API answers fixed: the cards show the API's numbers, the device card shows the
// API's device names (never Desktop as "Android"), the chart axis keeps the day, and the (i) texts say
// what the backend counts.
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_STATE, buildAdopt, buildFlows, buildTraffic } from "../../posthog-dashboard/data/metrics";
import type {
  AdoptionEngagementResponse,
  RolesResponse,
  TrafficSessionResponse,
  UsageDistributionResponse,
  WorkflowUsageResponse,
} from "../../posthog-dashboard/api/adoptionApi";
import { KPI_INFO } from "../data/sampleData";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ctx = vi.hoisted(() => ({ value: {} as Record<string, unknown>, chartLabels: [] as string[][] }));
vi.mock("../contexts/PulseDashboardContext", () => ({ usePulseDashboard: () => ctx.value }));
vi.mock("../components/charts/LineChart", () => ({
  LineChart: ({ opts }: { opts?: { labels?: string[] } }) => {
    ctx.chartLabels.push(opts?.labels ?? []);
    return null;
  },
}));

import { TrafficSession } from "../pages/TrafficSession";

const TRAFFIC = {
  tiles: { active_users: 9, screen_views: 1114, sessions: 140, avg_session_seconds: 622, bounce_rate: 2.9, recently_online: 0 },
  previous: { active_users: 3, screen_views: 289, sessions: 69, avg_session_seconds: 233, bounce_rate: 2.9 },
  delta_pct: { active_users: 200, screen_views: 285.5, sessions: 102.9, avg_session_seconds: 167, bounce_rate: 0 },
} as unknown as TrafficSessionResponse;
const USAGE = {
  usage_over_time: {
    current: [{ day: "2026-11-05", visitors: 3, views: 40, sessions: 6 }, { day: "2026-11-06", visitors: 2, views: 20, sessions: 3 }],
    previous: [],
  },
  device_split: { total_sessions: 140, devices: [
    { device: "Desktop", users: 8, sessions: 132, session_share: 94 },
    { device: "Mobile", users: 1, sessions: 8, session_share: 6 },
  ] },
  views_per_session: 8,
} as unknown as UsageDistributionResponse;

let root: ReturnType<typeof createRoot> | null = null;
afterEach(() => { act(() => root?.unmount()); root = null; document.body.innerHTML = ""; ctx.chartLabels = []; });

async function show(ui: React.ReactElement): Promise<string> {
  const el = document.createElement("div");
  document.body.appendChild(el);
  root = createRoot(el);
  await act(async () => root!.render(ui));
  return el.textContent ?? "";
}

function trafficContext() {
  return {
    sessTab: "sessions", setSessTab: () => {}, prev: true, theme: "light", benchmarks: {}, updateBenchmark: () => {},
    vm: { traffic: buildTraffic(DEFAULT_STATE, "2026-11-05", "2026-11-06", TRAFFIC, USAGE),
          status: { traffic: { loading: false, error: null } } },
  };
}

describe("Pulse Traffic & Session page", () => {
  it("shows the API's numbers on the cards", async () => {
    ctx.value = trafficContext();
    const text = await show(<TrafficSession />);
    // Each card reads label, (i) text, value: check the values that follow each card's (i) text.
    expect(text).toContain("used Pulse in the period.9▲ 200%");
    expect(text).toContain("1.11K▲ 286%");
    expect(text).toContain("not just how many people.140▲ 103%");
    expect(text).toContain("10m 22s");
    expect(text).toContain("2.9%— 0%");
  });

  it("the device card shows the API's device names: Desktop 94%, Mobile 6% (not 'Android' / 'iOS')", async () => {
    ctx.value = trafficContext();
    const text = await show(<TrafficSession />);
    expect(text).toContain("Desktop vs mobile sessions");
    expect(text).toMatch(/Desktop\s*94%/);
    expect(text).toMatch(/Mobile\s*6%/);
    expect(text).not.toMatch(/Android\s*94%/);
  });

  it("the daily chart's axis keeps the day ('5 Nov'), not only the month", async () => {
    ctx.value = trafficContext();
    await show(<TrafficSession />);
    expect(ctx.chartLabels.at(-1)).toEqual(["5 Nov", "6 Nov"]);
  });

  it("no text speaks of residents or a site breakdown", async () => {
    ctx.value = trafficContext();
    const text = await show(<TrafficSession />);
    expect(text).not.toMatch(/resident/i);
    expect(text).not.toMatch(/which sites/i);
  });
});

describe("Shared tile builders, as Pulse uses them", () => {
  const ENG = {
    seat_utilisation: { value: null, used_seats: 9, licensed_seats: null, delta_pct: null },
    stickiness: { value: 18.1, avg_dau: 1.6, mau: 9, delta_pct: -43.8 },
    adoption_trend: { value: -52, wau_now: 2, wau_4wk_ago: 4, baseline_avg: 4.17, baseline_weeks: 6 },
    activation: { value: 100, joiners: 6, delta_pct: 0 },
    module_breadth: { in_use: 10, total: 10 },
    dormant_users: { value: 3, band: "14+ days" },
  } as unknown as AdoptionEngagementResponse;
  const ROLES = { total_users: 11, roles: [
    { role: "pms_admin", users: 7, events: 631, active_share: 63.6 },
    { role: "pms_occupant_admin", users: 3, events: 966, active_share: 27.3 },
    { role: "Admin", users: 1, events: 367, active_share: 9.1 },
  ] } as unknown as RolesResponse;

  it("Adoption Trend shows the API's value and the weeks it really averaged", () => {
    const a = buildAdopt(DEFAULT_STATE, "2026-11-13", ENG, undefined, undefined, undefined, ROLES);
    const trend = a.tiles.find((t) => t.id === "A3")!;
    expect(trend.disp).toBe("-52%");
    expect(trend.sub).toBe("WAU 2 vs 4.17 6-wk avg");
  });

  it("two roles that both read 'Admin' are kept apart", () => {
    const a = buildAdopt(DEFAULT_STATE, "2026-11-13", ENG, undefined, undefined, undefined, ROLES);
    expect(a.roleShares.map((r) => r.name)).toEqual(["Admin (pms_admin)", "Occupant Admin", "Admin (Admin)"]);
    expect(a.roleShares[0].share).toBeCloseTo(0.636);
  });

  it("a module with no funnel shows – on all four workflow cards (never another app's numbers)", () => {
    const wf = { kpis: { f_adopt: { value: null, delta_pct: null }, f_comp: { value: null, delta_pct: null },
                         f_step: { value: null, delta_pct: null }, f_vol: { value: null, delta_pct: null } },
                 funnel: [], flows: [], entry_screens: [],
                 meta: { metric: "workflow_usage", prefix: "/notifications", module: "notifications", filters: {} } } as unknown as WorkflowUsageResponse;
    const f = buildFlows(DEFAULT_STATE, wf);
    expect(f.tiles.map((t) => t.disp)).toEqual(["—", "—", "—", "—"]);
  });
});

describe("Pulse (i) texts", () => {
  const CARDS = ["Active Users", "Screen Views", "Sessions", "Session Duration", "Bounce Rate", "Recently Online",
                 "Stickiness", "Adoption Trend", "14-Day Activation", "Module Breadth",
                 "Workflow Adoption", "Completion Rate", "Biggest Step Drop", "Usage Volume"];

  it("every card on the pages has an explanation", () => {
    for (const c of CARDS) expect(KPI_INFO[c], c).toBeDefined();
  });

  it("they describe the backend's definitions", () => {
    expect(KPI_INFO["Active Users"].f).not.toMatch(/7-day|WAU/);
    expect(KPI_INFO["Adoption Trend"].f).toMatch(/average of the 8 weeks before/);
    expect(KPI_INFO["Module Breadth"].f).toMatch(/after \/pulse\//);
    expect(KPI_INFO["Usage Volume"].f).toMatch(/users who reached the final step/i);
    expect(KPI_INFO["Completion Rate"].f).toMatch(/Users who reached the final step/);
    for (const c of CARDS) expect(KPI_INFO[c].f + KPI_INFO[c].m, c).not.toMatch(/resident/i);
  });
});
