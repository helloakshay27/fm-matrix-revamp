import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, RefreshCw, TrendingUp, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DEFAULT_FILTERS, RANGE_LABELS, UsageFilters } from "./usageData";
import { UsageContext } from "./UsageContext";
import { Traffic } from "./Traffic";
import { Adoption } from "./Adoption";
import { Workflow } from "./Workflow";
import { RecentActivity } from "./RecentActivity";
import { InfoPopoverProvider } from "./UsagePrimitives";
import "./ClubUsageDashboard.css";

type PageKey = "traffic" | "adoption" | "workflow";

const SECTION_REFRESH_KEYS: Record<PageKey, readonly string[]> = {
  traffic: ["traffic_session", "usage_and_distribution"],
  adoption: ["adoption_engagement", "adoption_trend", "growth", "retention", "roles", "modules"],
  workflow: ["modules", "sub-modules", "workflow_usage"],
};

/**
 * Club Management — Usage Dashboard.
 *
 * Self-contained page shell ported from the "Club Management · Analytics
 * Dashboard" reference wireframe: internal sidebar ("Layers"), page topbar
 * (title, sample-data badge, theme toggle, nav collapse), page head,
 * filterbar (date range + previous-period toggle + live pill), one of the
 * three usage layers, and the long wireframe disclosure footer.
 *
 * This route is mounted outside the FM Matrix app shell so the dashboard owns
 * its full viewport. Usage metrics are loaded from the FM Adoption Analytics API.
 */
export default function ClubUsageDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ---------- chrome state (theme + nav rail) ---------- */
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("cm-theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch {
      /* ignore */
    }
    return typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light";
  });
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("cm-nav") === "collapsed";
    } catch {
      return false;
    }
  });

  const toggleTheme = () =>
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("cm-theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });

  const toggleNav = () =>
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("cm-nav", next ? "collapsed" : "open");
      } catch {
        /* ignore */
      }
      return next;
    });

  /* ---------- section routing (internal sidebar) ---------- */
  const PAGE_TITLES: Record<PageKey, string> = {
    traffic: "Traffic & Session",
    adoption: "Adoption & Engagement",
    workflow: "Workflow Usage",
  };
  const [page, setPage] = useState<PageKey>("traffic");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshingPage, setRefreshingPage] = useState<PageKey | null>(null);
  const refreshInProgress = useRef(false);

  /* ---------- shared filters ---------- */
  const [filters, setFilters] = useState<UsageFilters>(DEFAULT_FILTERS);
  const [recentlyActive, setRecentlyActive] = useState<number | null>(null);

  /* ---------- date-range dropdown ---------- */
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [fromInput, setFromInput] = useState(DEFAULT_FILTERS.rangeFrom);
  const [toInput, setToInput] = useState(DEFAULT_FILTERS.rangeTo);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const applyPreset = (days: number) => {
    const label = RANGE_LABELS[days];
    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - days + 1);
    const ymd = (date: Date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
    setFilters((f) => ({ ...f, range: days, rangeLabel: label, rangeSub: "in the " + label.toLowerCase(), rangeFrom: ymd(from), rangeTo: ymd(to) }));
    setApplied(false);
  };

  const fmtShortDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const applyCustom = () => {
    if (!fromInput || !toInput) return;
    const days = Math.max(1, Math.round((new Date(toInput).getTime() - new Date(fromInput).getTime()) / 86400000) + 1);
    const label = `${fmtShortDate(fromInput)} – ${fmtShortDate(toInput)}`;
    setFilters((f) => ({
      ...f,
      range: days,
      rangeLabel: label,
      rangeSub: "in the selected range",
      rangeFrom: fromInput,
      rangeTo: toInput,
    }));
    setApplied(true);
  };

  const refreshCurrentSection = async () => {
    if (refreshInProgress.current) return;
    refreshInProgress.current = true;
    setIsRefreshing(true);
    setRefreshingPage(page);
    try {
      const results = await Promise.allSettled(
        SECTION_REFRESH_KEYS[page].map((key) =>
          queryClient.refetchQueries(
            { queryKey: ["club-usage", key], type: "active" },
            { cancelRefetch: false, throwOnError: true },
          ),
        ),
      );
      if (results.some((result) => result.status === "rejected")) {
        toast.error(`Could not refresh all ${PAGE_TITLES[page]} data.`);
      }
    } catch {
      toast.error(`Could not refresh all ${PAGE_TITLES[page]} data.`);
    } finally {
      refreshInProgress.current = false;
      setIsRefreshing(false);
      setRefreshingPage(null);
    }
  };

  return (
    <UsageContext.Provider value={{ filters, recentlyActive, setRecentlyActive, refreshing: isRefreshing && refreshingPage === page }}>
      <InfoPopoverProvider>
      <div className={`cud${collapsed ? " nav-collapsed" : ""}`} data-theme={theme}>
        {/* ============ PAGE TOP BAR ============ */}
        <header className="cud-topbar">
          <button
            type="button"
            className="iconbtn nav-toggle"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={toggleNav}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" />
              <line x1="8" y1="3.5" x2="8" y2="16.5" />
            </svg>
          </button>
          <button className="back" aria-label="Back" onClick={() => navigate(-1)}>
            &#8592;
          </button>
          <span className="topbar-title">Club Management Analytics</span>
          <div className="spacer" />
          <span className="rule" />
          <button
            type="button"
            className="iconbtn theme-btn"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
          >
            <svg
              className="i-moon"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16.5 11.8A7 7 0 0 1 8.2 3.5a7 7 0 1 0 8.3 8.3Z" />
            </svg>
            <svg
              className="i-sun"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="3.6" />
              <path d="M10 1.8v1.7M10 16.5v1.7M18.2 10h-1.7M3.5 10H1.8M15.8 4.2l-1.2 1.2M5.4 14.6l-1.2 1.2M15.8 15.8l-1.2-1.2M5.4 5.4 4.2 4.2" />
            </svg>
          </button>
          <span className="badge-sample">Club usage &middot; analytics</span>
          <div className="avatar">CM</div>
        </header>

        <div className="shell">
          {/* ============ INTERNAL SIDEBAR (Layers) ============ */}
          <aside className="sidebar">
            <h1 className="brandmark">
              <span className="bm-full">Club Management</span>
              <span className="bm-mini">CM</span>
            </h1>
            <p className="brandmark-sub">Club Management &middot;</p>
            <nav aria-label="Sections">
              <div className="nav-group">
                <div className="nav-label">Layers</div>
                <button
                  type="button"
                  className={`nav-item${page === "traffic" ? " on" : ""}`}
                  data-tip="Traffic &amp; Session"
                  onClick={() => {
                    setPage("traffic");
                    window.scrollTo({ top: 0 });
                  }}
                >
                  <span className="ni-ic">
                    <TrendingUp />
                  </span>
                  <span className="ni-t">Traffic &amp; Session</span>
                </button>
                <button
                  type="button"
                  className={`nav-item${page === "adoption" ? " on" : ""}`}
                  data-tip="Adoption &amp; Engagement"
                  onClick={() => {
                    setPage("adoption");
                    window.scrollTo({ top: 0 });
                  }}
                >
                  <span className="ni-ic">
                    <Users />
                  </span>
                  <span className="ni-t">Adoption &amp; Engagement</span>
                </button>
                <button
                  type="button"
                  className={`nav-item${page === "workflow" ? " on" : ""}`}
                  data-tip="Workflow Usage"
                  onClick={() => {
                    setPage("workflow");
                    window.scrollTo({ top: 0 });
                  }}
                >
                  <span className="ni-ic">
                    <Layers />
                  </span>
                  <span className="ni-t">Workflow Usage</span>
                </button>
              </div>
            </nav>
            <RecentActivity filters={filters} />
          </aside>

          <main className="main">
            {/* ============ PAGE HEAD ============ */}
            <div className="page-head">
              <h2 id="pageTitle">{PAGE_TITLES[page]}</h2>
              <p className="page-sub">
                Club Management  &middot; &amp; admins only
              </p>
            </div>

            {/* ============ FILTER BAR ============ */}
            <div className="filterbar">
              <div className="daterange" id="dateRange" ref={popRef}>
                <button
                  type="button"
                  className="ctrl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((o) => !o);
                  }}
                >
                  <span className="ic">&#128197;</span>
                  <span id="dateRangeLabel">{filters.rangeLabel}</span>
                  <span className="chev">&#9662;</span>
                </button>
                {open && (
                  <div className="daterange-pop" id="dateRangePop">
                    <div className="dr-presets">
                      {[7, 30, 90].map((d) => (
                        <button
                          key={d}
                          type="button"
                          data-range={d}
                          className={`dr-preset${filters.range === d ? " on" : ""}`}
                          onClick={() => applyPreset(d)}
                        >
                          {RANGE_LABELS[d]}
                        </button>
                      ))}
                    </div>
                    <div className="dr-custom">
                      <div className="dr-custom-label">Custom range</div>
                      <div className="dr-custom-row">
                        <input type="date" id="dateFrom" value={fromInput} onChange={(e) => setFromInput(e.target.value)} />
                        <span className="dr-to">&ndash;</span>
                        <input type="date" id="dateTo" value={toInput} onChange={(e) => setToInput(e.target.value)} />
                      </div>
                      <button type="button" className={`dr-apply${applied ? " applied" : ""}`} onClick={applyCustom}>
                        {applied ? "Range applied ✓" : "Apply custom range"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* No Society/Client selector: the catalogue's Global Properties sheet
                  carries only project_code ("CM-01") and project_id ("P-238") — a fixed
                  single-tenant pair, consistent with the reference wireframe. */}
              <button
                type="button"
                className={`ctrl${filters.prev ? " toggle-on" : ""}`}
                onClick={() => setFilters((f) => ({ ...f, prev: !f.prev }))}
              >
                <span className="ic">&#8634;</span> Previous period {filters.prev ? "✓" : ""}
              </button>
              <button
                type="button"
                className="ctrl cud-refresh-ctrl"
                onClick={() => void refreshCurrentSection()}
                disabled={isRefreshing}
                aria-label={isRefreshing ? `Refreshing ${PAGE_TITLES[page]}` : `Refresh ${PAGE_TITLES[page]}`}
                title={`Refresh ${PAGE_TITLES[page]}`}
              >
                <RefreshCw
                  className={isRefreshing ? "cud-refresh-icon is-spinning" : "cud-refresh-icon"}
                  size={14}
                  aria-hidden="true"
                />
                {isRefreshing ? "Refreshing…" : "Refresh"}
              </button>
              <div className="spacer" />
              <span className="pill">
                <span className="dot" />
                <b>{recentlyActive == null ? "—" : recentlyActive.toLocaleString()}</b> recently active
              </span>
            </div>

            {/* ============ ACTIVE SECTION ============ */}
            {page === "traffic" && <Traffic />}
            {page === "adoption" && <Adoption />}
            {page === "workflow" && <Workflow />}
          </main>
        </div>
      </div>
      </InfoPopoverProvider>
    </UsageContext.Provider>
  );
}
