import {
  createContext,
  type FocusEvent,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART, fmtC, kpiInfo } from "./usageData";
import { useUsage } from "./UsageContext";

/* ============================================================
   Small shared presentation primitives for the Usage Dashboard.
   Kept here so Traffic / Adoption / Workflow stay focused on their
   own content and the card/tile anatomy is defined exactly once.
   ============================================================ */

type ActiveInfoPopover = { id: string; reason: "pointer" | "focus" | "click" } | null;
const InfoPopoverContext = createContext<{
  active: ActiveInfoPopover;
  setActive: React.Dispatch<React.SetStateAction<ActiveInfoPopover>>;
} | null>(null);

export function InfoPopoverProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveInfoPopover>(null);
  return (
    <InfoPopoverContext.Provider value={{ active, setActive }}>
      {children}
    </InfoPopoverContext.Provider>
  );
}

function InfoPopover({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  const context = useContext(InfoPopoverContext);
  if (!context) throw new Error("InfoPopover must be rendered inside InfoPopoverProvider");
  const { active, setActive } = context;
  const open = active?.id === id;
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pointerInside = useRef(false);
  const keyboardFocusInside = useRef(false);

  useEffect(() => {
    setPortalContainer(triggerRef.current?.closest(".cud") ?? null);
  }, []);
  useEffect(() => () => cancelClose(), []);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (!pointerInside.current && !keyboardFocusInside.current) {
        setActive((current) => current?.id === id && current.reason !== "focus" ? null : current);
      }
    }, 120);
  };
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null;
    const remainsInside = Boolean(next && (triggerRef.current?.contains(next) || contentRef.current?.contains(next)));
    if (!remainsInside) {
      keyboardFocusInside.current = false;
      if (active?.id === id && active.reason === "focus") {
        setActive((current) => current?.id === id ? null : current);
      } else {
        scheduleClose();
      }
    }
  };
  const openFor = (reason: NonNullable<ActiveInfoPopover>["reason"]) => {
    setActive({ id, reason });
  };
  const handlePointerEnter = () => {
    pointerInside.current = true;
    keyboardFocusInside.current = false;
    cancelClose();
    openFor("pointer");
  };
  const handlePointerLeave = () => {
    pointerInside.current = false;
    setActive((current) => current?.id === id && current.reason === "click"
      ? { id, reason: "pointer" }
      : current);
    scheduleClose();
  };

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setActive((current) => current?.id === id ? null : current);
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className="info-btn"
          aria-label={`About ${label}`}
          aria-haspopup="dialog"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onFocus={() => {
            const keyboardFocus = triggerRef.current?.matches(":focus-visible") ?? false;
            if (keyboardFocus) {
              keyboardFocusInside.current = true;
              cancelClose();
              openFor("focus");
            }
          }}
          onBlur={handleBlur}
          onClick={(event) => {
            event.preventDefault();
            cancelClose();
            if (active?.id === id && active.reason === "click") {
              setActive(null);
            } else {
              openFor("click");
            }
          }}
        >
          i
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal container={portalContainer ?? undefined}>
        <PopoverPrimitive.Content
          ref={contentRef}
          className="info-pop"
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={12}
          avoidCollisions
          role="dialog"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onFocus={() => {
            const keyboardFocus = contentRef.current?.matches(":focus-visible") ?? false;
            if (keyboardFocus && !pointerInside.current) {
              keyboardFocusInside.current = true;
              openFor("focus");
            }
            cancelClose();
          }}
          onBlur={handleBlur}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/** Hover/focus/click explainer used on every tile and chart card. */
export function InfoPop({ label }: { label: string }) {
  const info = kpiInfo(label);
  return (
    <span className="info-wrap static">
      <InfoPopover label={label}>
          <b>{label}</b>
          <div>{info.f}</div>
          <div>{info.m}</div>
      </InfoPopover>
    </span>
  );
}

export function PurposePop({ title, purpose }: { title: string; purpose: string }) {
  return (
    <span className="info-wrap static">
      <InfoPopover label={title}>
        <b>{title}</b>
        {purpose}
      </InfoPopover>
    </span>
  );
}

export interface TileProps {
  label: string;
  val: string;
  delta?: string | null;
  dir?: "up" | "dn" | "flat";
  sub?: string;
  /** The tile's data is still loading (first load / date-range change). */
  loading?: boolean;
}

export function Tile({
  label,
  val,
  delta,
  dir = "flat",
  sub,
  loading = false,
}: TileProps) {
  const { refreshing } = useUsage();
  const arrow = dir === "up" ? "▲" : dir === "dn" ? "▼" : "—";
  const busy = loading || refreshing;

  return (
    <div className="tile" aria-busy={busy}>
      <div className="tophead">
        <div className="lbl">{label}</div>
        <InfoPop label={label} />
      </div>
      {busy ? (
        <div className="tile-skeleton-content" aria-hidden="true">
          <span className="tile-skeleton tile-skeleton-value" />
          {/* While loading, delta / sub aren't known yet — reserve both lines so the tile doesn't jump. */}
          {(loading || delta != null) && <span className="tile-skeleton tile-skeleton-delta" />}
          {(loading || sub) && <span className="tile-skeleton tile-skeleton-sub" />}
        </div>
      ) : (
        <>
          <div className="val">{val}</div>
          {delta != null && (
            <div className={`delta ${dir}`}>
              {arrow} {delta}
            </div>
          )}
          {sub && <div className="sub2">{sub}</div>}
        </>
      )}
    </div>
  );
}

export interface ChartCardProps {
  eyebrow: string;
  title: string;
  purpose: string;
  children: ReactNode;
  className?: string;
  /** The card's data is still loading (first load / date-range change). */
  loading?: boolean;
  /** Placeholder shape shown while loading or refreshing; without it the content stays visible. */
  skeleton?: SkeletonVariant;
  /** Rows / columns for the "bars" and "table" skeletons. */
  skeletonRows?: number;
  skeletonCols?: number;
}

export function ChartCard({
  eyebrow,
  title,
  purpose,
  children,
  className,
  loading = false,
  skeleton,
  skeletonRows,
  skeletonCols,
}: ChartCardProps) {
  const { refreshing } = useUsage();
  const busy = Boolean(skeleton) && (loading || refreshing);
  return (
    <div className={`card${className ? " " + className : ""}`} aria-busy={busy}>
      <div className="card-head">
        <div className="charthead">
          <div>
            <div className="cr">{eyebrow}</div>
            <div className="ct">{title}</div>
          </div>
          <PurposePop title={title} purpose={purpose} />
        </div>
      </div>
      <div className="card-body">
        {busy && skeleton ? <ChartSkeleton variant={skeleton} rows={skeletonRows} cols={skeletonCols} /> : children}
      </div>
    </div>
  );
}

export type SkeletonVariant = "line" | "stacked" | "bars" | "table" | "kv" | "funnel";

/** Shimmer placeholders sized like the real card content, so the layout doesn't jump when data lands. */
export function ChartSkeleton({ variant, rows, cols }: { variant: SkeletonVariant; rows?: number; cols?: number }) {
  if (variant === "line" || variant === "stacked") {
    return (
      <div aria-hidden="true">
        <div className={`sk sk-chart${variant === "stacked" ? " sk-chart-tall" : ""}`} />
        <div className="sk-legend">
          <span className="sk" />
          <span className="sk" />
        </div>
      </div>
    );
  }
  if (variant === "bars") {
    return (
      <div className="hbars" aria-hidden="true">
        {Array.from({ length: rows ?? 4 }, (_, i) => (
          <div className="role" key={i}>
            <span className="sk sk-line" style={{ width: `${70 - i * 8}%` }} />
            <span className="sk sk-bar" style={{ width: `${85 - i * 15}%` }} />
            <span className="sk sk-line sk-num" />
          </div>
        ))}
      </div>
    );
  }
  if (variant === "table") {
    const columns = cols ?? 4;
    return (
      <div className="sk-table" aria-hidden="true">
        {Array.from({ length: (rows ?? 5) + 1 }, (_, r) => (
          <div className={`sk-row${r === 0 ? " sk-row-head" : ""}`} key={r} style={{ gridTemplateColumns: `2fr repeat(${columns - 1}, 1fr)` }}>
            {Array.from({ length: columns }, (_, c) => (
              <span className="sk sk-line" key={c} style={{ width: c === 0 ? `${75 - (r % 3) * 12}%` : "55%" }} />
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (variant === "kv") {
    return (
      <div className="kv" aria-hidden="true">
        <div className="sk-kv">
          <span className="sk sk-line" />
          <span className="sk sk-kv-value" />
          <span className="sk sk-line sk-kv-unit" />
        </div>
      </div>
    );
  }
  // funnel
  return (
    <div className="funnel" aria-hidden="true">
      {[100, 78, 56, 38].map((width) => (
        <span className="sk sk-funnel" key={width} style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}

export interface HBarRow {
  label: string;
  /** 0..1 fraction. */
  value: number;
  color: string;
}

export function HBarList({ rows }: { rows: HBarRow[] }) {
  return (
    <div className="hbars">
      {rows.map((r) => (
        <div className="role" key={r.label}>
          <div className="rn">{r.label}</div>
          <div className="rbar">
            <i style={{ width: `${Math.round(r.value * 100)}%`, background: r.color }} />
          </div>
          <div className="rv">{Math.round(r.value * 100)}%</div>
        </div>
      ))}
    </div>
  );
}

export function KV({ k, v, u, small }: { k: string; v: string; u?: string; small?: boolean }) {
  return (
    <div>
      <div className="k">{k}</div>
      <div className="v" style={small ? { fontSize: 18 } : undefined}>
        {v}
      </div>
      {u ? <div className="u">{u}</div> : null}
    </div>
  );
}

/* ============================================================
   Charts — recharts (the library already installed in FM Matrix).
   Styled to mirror the reference's minimal house style: faint vertical
   dashed gridlines only, three plain grey y-labels, one saturated data
   colour plus a pale area fill, and a dashed previous-period overlay.
   ============================================================ */

interface TooltipEntry {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string;
}

function CudTooltip({
  active,
  payload,
  label,
  pctScale,
  labels,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  pctScale?: boolean;
  labels?: Record<string, string>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 11px",
        fontSize: 12,
        boxShadow: "var(--shadow-pop)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ color: "var(--faint)", marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink)" }}
        >
          <span
            style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }}
          />
          <span style={{ color: "var(--muted)" }}>{labels?.[p.dataKey!] ?? p.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 500 }}>
            {pctScale ? `${Number(p.value).toFixed(1)}%` : fmtC(Number(p.value))}
          </span>
        </div>
      ))}
    </div>
  );
}

export interface TrendLineChartProps {
  labels: string[];
  cur: number[];
  prev?: number[];
  showPrev?: boolean;
  color?: string;
  fill?: string;
  pctScale?: boolean;
}

export function TrendLineChart({
  labels,
  cur,
  prev,
  showPrev,
  color = CHART.blue,
  fill = CHART.fill,
  pctScale,
}: TrendLineChartProps) {
  if (labels.length === 0 || cur.length === 0) {
    return (
      <div
        role="status"
        style={{
          minHeight: 250,
          display: "grid",
          placeItems: "center",
          color: "var(--muted)",
          fontSize: 13,
        }}
      >
        No trend data available for this date range.
      </div>
    );
  }

  const data = labels.map((label, i) => ({
    label,
    cur: cur[i],
    prev: prev ? prev[i] : undefined,
  }));

  const all = showPrev && prev ? cur.concat(prev) : cur;
  const mn = pctScale ? Math.max(0, Math.min(...all) - 0.6) : 0;
  const mx = pctScale
    ? Math.min(100, Math.max(...all) + 0.6)
    : Math.max(...all) * 1.14 || 1;
  const span = mx - mn || 1;
  const ticks = [mn, mn + span / 2, mx];
  const step = Math.max(1, Math.ceil(labels.length / 6));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart data={data} margin={{ top: 16, right: 14, bottom: 6, left: 0 }}>
        <CartesianGrid
          vertical
          horizontal={false}
          stroke={CHART.grid}
          strokeDasharray="2 4"
        />
        <XAxis
          dataKey="label"
          interval={step - 1}
          tickLine={false}
          axisLine={{ stroke: CHART.grid }}
          tick={{ fill: CHART.faint, fontSize: 11 }}
          tickMargin={8}
        />
        <YAxis
          domain={[mn, mx]}
          ticks={ticks}
          tickLine={false}
          axisLine={false}
          width={48}
          tick={{ fill: CHART.faint, fontSize: 11 }}
          tickFormatter={(v: number) => (pctScale ? `${v.toFixed(1)}%` : fmtC(v))}
        />
        <Tooltip
          content={<CudTooltip pctScale={pctScale} labels={{ cur: "Current period", prev: "Previous period" }} />}
          cursor={{ stroke: CHART.line, strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey="cur"
          stroke={color}
          strokeWidth={2.2}
          fill={fill}
          dot={false}
          activeDot={{ r: 3, fill: color }}
        />
        {showPrev && prev && (
          <Line
            type="monotone"
            dataKey="prev"
            stroke={CHART.line}
            strokeWidth={1.8}
            strokeDasharray="4 4"
            dot={false}
            activeDot={false}
          />
        )}
        {cur.length > 0 && (
          <ReferenceDot
            x={labels[labels.length - 1]}
            y={cur[cur.length - 1]}
            r={3}
            fill={color}
            stroke="none"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export interface StackedSeries {
  label: string;
  data: number[];
  color: string;
}

export function GrowthStackedBar({
  labels,
  series,
  negSeries,
}: {
  labels: string[];
  series: StackedSeries[];
  negSeries?: StackedSeries;
}) {
  const data = labels.map((label, i) => {
    const row: Record<string, number | string> = { label };
    series.forEach((s) => {
      row[s.label] = s.data[i];
    });
    if (negSeries) row[negSeries.label] = -negSeries.data[i];
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 14, right: 12, bottom: 6, left: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={{ stroke: CHART.grid }}
          tick={{ fill: CHART.faint, fontSize: 11 }}
          tickMargin={6}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tick={{ fill: CHART.faint, fontSize: 11 }}
          tickFormatter={(v: number) => fmtC(Math.abs(v))}
        />
        <Tooltip
          cursor={{ fill: "var(--surface-2)" }}
          content={<CudTooltip />}
        />
        {series.map((s) => (
          <Bar key={s.label} dataKey={s.label} stackId="a" fill={s.color} radius={[2, 2, 0, 0]} />
        ))}
        {negSeries && (
          <Bar
            key={negSeries.label}
            dataKey={negSeries.label}
            stackId="a"
            fill={negSeries.color}
            radius={[0, 0, 2, 2]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ============================================================
   Chart-tab helper
   ============================================================ */

export function ChartTabs({
  options,
  value,
  onChange,
}: {
  options: Array<{ key: string; label: string }>;
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="charttabs" style={{ marginBottom: 10 }}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          className={value === o.key ? "on" : ""}
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
