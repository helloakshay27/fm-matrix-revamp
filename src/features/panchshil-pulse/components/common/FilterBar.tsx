import React, { useState, useRef, useEffect } from "react";
import { usePulseDashboard } from "../../contexts/PulseDashboardContext";
import { dateRangeFor } from "../../../posthog-dashboard/api/queries";
import { fmtC } from "../../utils/calculations";

export const FilterBar: React.FC = () => {
  const {
    dev, setDev,
    prev, setPrev,
    project, setProject,
    range, setRange,
    rangeLabel, setRangeLabel,
    rangeFrom, setRangeFrom,
    rangeTo, setRangeTo,
    vm,
    refreshAll,
    isRefreshing
  } = usePulseDashboard();

  const [isOpen, setIsOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(rangeFrom);
  const [customTo, setCustomTo] = useState(rangeTo);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomFrom(rangeFrom);
    setCustomTo(rangeTo);
  }, [rangeFrom, rangeTo]);

  // Close date picker dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleToggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handlePresetSelect = (days: number, label: string) => {
    const dr = dateRangeFor(days);
    setRange(days);
    setRangeLabel(label);
    setRangeFrom(dr.from);
    setRangeTo(dr.to);
    setCustomFrom(dr.from);
    setCustomTo(dr.to);
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    const fromVal = customFrom;
    const toVal = customTo;
    if (!fromVal || !toVal) return;

    const fromDate = new Date(fromVal);
    const toDate = new Date(toVal);
    if (fromDate > toDate) return;
    const diffTime = toDate.getTime() - fromDate.getTime();
    const days = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

    setRangeFrom(fromVal);
    setRangeTo(toVal);

    const fmt = (d: string) => {
      const dt = new Date(d);
      return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    const label = `${fmt(fromVal)} – ${fmt(toVal)}`;

    setRange(days);
    setRangeLabel(label);

    // Add applied feedback classes if matching HTML style
    const btn = document.getElementById("dateApplyBtn");
    if (btn) {
      btn.classList.add("applied");
      btn.textContent = "Range applied ✓";
    }

    setIsOpen(false);
  };

  const liveKv = vm.traffic.liveKv;

  return (
    <div className="filterbar">
      {/* Date Range Selector */}
      <div className={`daterange ${isOpen ? "open" : ""}`} ref={containerRef}>
        <button className="ctrl" id="dateRangeBtn" onClick={handleToggleOpen}>
          <span className="ic">&#128197;</span>
          <span id="dateRangeLabel">{rangeLabel}</span>
          <span className="chev">&#9662;</span>
        </button>
        <div className="daterange-pop" id="dateRangePop">
          <div className="dr-presets">
            <button
              className={`dr-preset ${range === 7 ? "on" : ""}`}
              onClick={() => handlePresetSelect(7, "Last 7 days")}
            >
              Last 7 days
            </button>
            <button
              className={`dr-preset ${range === 30 ? "on" : ""}`}
              onClick={() => handlePresetSelect(30, "Last 30 days")}
            >
              Last 30 days
            </button>
            <button
              className={`dr-preset ${range === 90 ? "on" : ""}`}
              onClick={() => handlePresetSelect(90, "Last 90 days")}
            >
              Last 90 days
            </button>
          </div>
          <div className="dr-custom">
            <div className="dr-custom-label">Custom range</div>
            <div className="dr-custom-row">
              <input
                type="date"
                id="dateFrom"
                value={customFrom}
                onChange={(event) => setCustomFrom(event.target.value)}
              />
              <span className="dr-to">&ndash;</span>
              <input
                type="date"
                id="dateTo"
                value={customTo}
                onChange={(event) => setCustomTo(event.target.value)}
              />
            </div>
            <button className="dr-apply" id="dateApplyBtn" onClick={handleCustomApply}>
              Apply custom range
            </button>
          </div>
        </div>
      </div>

      {/* Project selector — populated from the tenant site list */}
      <label className="ctrl">
        <span className="ic">&#127959;</span>
        <select value={project} onChange={(e) => setProject(e.target.value)} id="projectSel">
          <option value="all">All Sites</option>
          {vm.sites.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <span className="chev">&#9662;</span>
      </label>

      {/* Platform/Device toggle — devices are the API's Desktop / Mobile values */}
      <div className="devtoggle" id="devToggle" title="Platform">
        <button
          className={dev === "all" ? "on" : ""}
          onClick={() => setDev("all")}
        >
          All
        </button>
        <button
          className={dev === "desktop" ? "on" : ""}
          title="Desktop only"
          onClick={() => setDev("desktop")}
        >
          Desktop
        </button>
        <button
          className={dev === "mobile" ? "on" : ""}
          title="Mobile only"
          onClick={() => setDev("mobile")}
        >
          Mobile
        </button>
      </div>

      {/* Previous period toggler */}
      <button
        className={`ctrl ${prev ? "toggle-on" : ""}`}
        id="prevBtn"
        onClick={() => setPrev(!prev)}
      >
        <span className="ic">&#8634;</span> Previous period {prev ? "✓" : ""}
      </button>

      {/* Refresh — invalidates the whole fm-adoption query family */}
      <button
        className="ctrl"
        id="refreshBtn"
        title="Refresh all data"
        onClick={refreshAll}
        disabled={isRefreshing}
      >
        <span className={`ic ${isRefreshing ? "spin" : ""}`}>&#8635;</span> Refresh
      </button>

      <div className="spacer"></div>

      {/* Live count pill */}
      <span className="pill">
        <span className="dot"></span>
        <span id="liveCount">
          {liveKv != null ? fmtC(liveKv) : "—"} recently online
        </span>
      </span>
    </div>
  );
};
