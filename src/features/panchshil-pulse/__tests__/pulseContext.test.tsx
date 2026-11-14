// @vitest-environment jsdom
// How the Pulse dashboard wires its data: every query is aimed at Pulse's own API, nothing waits for the
// FM site list (Pulse sends no site), and Workflow Usage waits for a module instead of loading the whole app.
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type Call = { hook: string; filters: Record<string, unknown>; opts?: Record<string, unknown> };
const seen = vi.hoisted(() => ({ calls: [] as Call[], sites: 0 }));

vi.mock("../../posthog-dashboard/api/queries", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  const idle = { data: undefined, isLoading: false, isFetching: false, error: null };
  const hook = (name: string) => (filters: Record<string, unknown>, opts?: Record<string, unknown>) => {
    seen.calls.push({ hook: name, filters, opts });
    return idle;
  };
  return {
    ...actual,
    useAllSites: () => { seen.sites++; return idle; },
    useCompanyNames: () => { seen.sites++; return idle; },
    useTrafficSession: hook("traffic_session"),
    useUsageAndDistribution: hook("usage_and_distribution"),
    useAdoptionEngagement: hook("adoption_engagement"),
    useAdoptionTrend: hook("adoption_trend"),
    useGrowth: hook("growth"),
    useRetention: hook("retention"),
    useRoles: hook("roles"),
    useModuleTree: hook("modules"),
    useSubModuleTree: hook("sub_modules"),
    useWorkflowUsage: hook("workflow_usage"),
  };
});

import { PulseDashboardProvider } from "../contexts/PulseDashboardContext";
import { PULSE_ADOPTION_PATH } from "../../posthog-dashboard/api/adoptionApi";

let root: ReturnType<typeof createRoot> | null = null;
afterEach(() => { act(() => root?.unmount()); root = null; seen.calls = []; seen.sites = 0; });

async function openAt(path: string) {
  const el = document.createElement("div");
  document.body.appendChild(el);
  root = createRoot(el);
  await act(async () =>
    root!.render(
      <MemoryRouter initialEntries={[path]}>
        <QueryClientProvider client={new QueryClient()}>
          <PulseDashboardProvider><div /></PulseDashboardProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    ),
  );
}

const last = (hook: string) => [...seen.calls].reverse().find((c) => c.hook === hook)!;

describe("Pulse dashboard data wiring", () => {
  it("aims every query at Pulse's own API with no site and the platform button", async () => {
    await openAt("/pulse/traffic-session");
    for (const hook of ["traffic_session", "usage_and_distribution", "adoption_engagement", "modules", "workflow_usage"]) {
      const f = last(hook).filters;
      expect(f.api, hook).toBe(PULSE_ADOPTION_PATH);
      expect(f.siteIds, hook).toEqual([]);
      expect(f.dev, hook).toBe("all");
    }
  });

  it("the page it opens on loads at once; the others wait until visited", async () => {
    await openAt("/pulse/traffic-session");
    expect(last("traffic_session").filters.enabled).toBe(true);
    expect(last("adoption_engagement").filters.enabled).toBe(false);
    expect(last("workflow_usage").filters.enabled).toBe(false);
  });

  it("does not ask for the FM site list (nothing waits on it)", async () => {
    await openAt("/pulse/adoption-engagement");
    expect(seen.sites).toBe(0);
    expect(last("adoption_engagement").filters.enabled).toBe(true);
  });

  it("Workflow Usage waits for a module instead of loading the whole app first", async () => {
    await openAt("/pulse/workflow-usage");
    expect(last("workflow_usage").opts).toEqual({ requireModule: true });
  });
});
