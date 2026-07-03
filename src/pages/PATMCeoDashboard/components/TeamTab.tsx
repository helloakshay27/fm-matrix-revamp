import { useState } from "react";
import ChartCanvas from "../ChartCanvas";
import { useCeoDashboardEfficiencyOverview } from "@/hooks/useCeoDashboardEfficiencyOverview";
import { useCeoDashboardPeopleAlerts } from "@/hooks/useCeoDashboardPeopleAlerts";
import { useCeoDashboardEffortAndOverdue } from "@/hooks/useCeoDashboardEffortAndOverdue";
import { useCeoDashboardPersonWiseAgeingMatrix } from "@/hooks/useCeoDashboardPersonWiseAgeingMatrix";
import { useCeoDashboardPerPersonBreakdown } from "@/hooks/useCeoDashboardPerPersonBreakdown";

const ok = "#108C72",
  warn = "#EDC488",
  err = "#E7848E",
  dark = "#2C2C2C",
  lav = "#CECBF6",
  terra = "#DA7756",
  grid = "rgba(197,184,157,0.22)",
  green = "#798C5E";

const baseOpts = (legend = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: legend,
      labels: { font: { size: 9 }, boxWidth: 8, padding: 6, color: dark },
    },
    tooltip: { titleFont: { size: 11 }, bodyFont: { size: 10 } },
  },
  scales: {
    x: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } },
    y: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } },
  },
});

const SCORE_LABEL_STYLE: Record<string, { emoji: string; color: string }> = {
  Healthy: { emoji: "🟢", color: "#89F7E7" },
  "Needs Attention": { emoji: "🟡", color: "#EDC488" },
  Critical: { emoji: "🔴", color: "#E7848E" },
};

function scoreLabelStyle(label: string | undefined) {
  return SCORE_LABEL_STYLE[label ?? ""] ?? SCORE_LABEL_STYLE["Needs Attention"];
}

function kpiTone(value: number, goodAt: number, warnAt: number, higherIsBetter = true) {
  const isGood = higherIsBetter ? value >= goodAt : value <= goodAt;
  const isWarn = higherIsBetter ? value >= warnAt : value <= warnAt;
  if (isGood) return { color: "#108C72", barColor: "#89F7E7" };
  if (isWarn) return { color: "#8B6914", barColor: "#EDC488" };
  return { color: "#C0303D", barColor: "#E7848E" };
}

function overdueRankTone(rank: number) {
  if (rank <= 5) return { color: "#C0303D", barColor: "#E7848E" };
  if (rank <= 7) return { color: "#8B6914", barColor: "#EDC488" };
  return { color: "var(--sub)", barColor: "var(--lav)" };
}

const AVATAR_PALETTE = [
  { bg: "#E7848E", color: "#fff" },
  { bg: "#EDC488", color: "#5A3E00" },
  { bg: "#9EC8BA", color: "#0A4A3D" },
  { bg: "#CECBF6", color: "#3D3470" },
  { bg: "#6B9BCC", color: "#fff" },
];

function avatarStyle(index: number) {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}

const PEOPLE_BADGE_CLASS: Record<string, string> = {
  "No work": "br",
  Blocked: "br",
  Idle: "bw",
  Test: "bw",
};

function peopleBadgeClass(badge: string) {
  return PEOPLE_BADGE_CLASS[badge] ?? "bd";
}

const RISK_BADGE_CLASS: Record<string, string> = {
  "High Risk": "br",
  "Medium Risk": "bw",
  Distributed: "bg",
};

function riskBadgeClass(risk: string) {
  return RISK_BADGE_CLASS[risk] ?? "bd";
}

const OUTLIER_BADGE_CLASS: Record<string, string> = {
  Overloaded: "br",
  Watch: "bw",
  "Under est.": "bg",
};

const OUTLIER_COLOR: Record<string, string> = {
  Overloaded: "#C0303D",
  Watch: "#8B6914",
  "Under est.": "#108C72",
};

const AGE_BUCKET_BAR_COLOR = ["#89F7E7", "#EDC488", "#E7848E", "#C0303D", "#8B0000"];
const AGE_BUCKET_VAL_COLOR = ["#0A7A6A", "#8B6914", "#C0303D", "#C0303D", "#8B0000"];

function ageingRowTone(total: number, maxTotal: number) {
  const ratio = maxTotal > 0 ? total / maxTotal : 0;
  if (ratio >= 0.7) return { bg: "#FFF0F0", nameColor: "#C0303D", nameBold: true, totalColor: "#C0303D" };
  if (ratio >= 0.35) return { bg: undefined, nameColor: "#C0303D", nameBold: false, totalColor: "#C0303D" };
  if (ratio >= 0.15) return { bg: undefined, nameColor: "#8B6914", nameBold: false, totalColor: "#8B6914" };
  return { bg: "#FAFAF8", nameColor: "var(--dark)", nameBold: false, totalColor: "#C0303D" };
}

const STATUS_EMOJI: Record<string, string> = {
  critical: "🔴",
  overloaded: "🟡",
  performing: "🟢",
  high_performer: "🟢",
  low_work: "⬜",
};

const STATUS_ROW_CLASS: Record<string, string> = {
  critical: "row-critical",
  overloaded: "row-overloaded",
  high_performer: "row-star",
};

function truncate(str: string, max: number) {
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

interface TeamTabProps {
  fromDate?: string;
  toDate?: string;
}

export default function TeamTab({ fromDate, toDate }: TeamTabProps) {
  const [deptFilter, setDeptFilter] = useState("");

  const {
    data: efficiencyOverview,
    isLoading: isEfficiencyLoading,
    isError: isEfficiencyError,
  } = useCeoDashboardEfficiencyOverview(fromDate, toDate);

  const {
    data: peopleAlerts,
    isLoading: isPeopleAlertsLoading,
    isError: isPeopleAlertsError,
  } = useCeoDashboardPeopleAlerts(fromDate, toDate);

  const topOverdueOwners = peopleAlerts?.top_overdue_owners;
  const zeroWork = peopleAlerts?.zero_work;
  const zeroVelocity = peopleAlerts?.zero_velocity;
  const workConcentrationRisk = peopleAlerts?.work_concentration_risk;

  const {
    data: effortAndOverdue,
    isLoading: isEffortLoading,
    isError: isEffortError,
  } = useCeoDashboardEffortAndOverdue(fromDate, toDate);

  const effortAccuracy = effortAndOverdue?.effort_accuracy;
  const overdueAgeTrend = effortAndOverdue?.overdue_age_trend;

  const {
    data: ageingMatrix,
    isLoading: isAgeingMatrixLoading,
    isError: isAgeingMatrixError,
  } = useCeoDashboardPersonWiseAgeingMatrix(fromDate, toDate);

  const ageingMaxTotal = ageingMatrix
    ? Math.max(...ageingMatrix.rows.map((r) => r.total_overdue), 1)
    : 1;

  const scoreStyle = scoreLabelStyle(efficiencyOverview?.execution_score.label);

  const efficiencyKpis = efficiencyOverview
    ? [
        {
          label: "Task Completion",
          val: `${efficiencyOverview.task_completion.percentage}%`,
          sub: `${efficiencyOverview.task_completion.completed.toLocaleString("en-IN")} of ${efficiencyOverview.task_completion.total.toLocaleString("en-IN")} · Live DB`,
          barW: `${Math.min(efficiencyOverview.task_completion.percentage, 100)}%`,
          note: efficiencyOverview.task_completion.percentage >= 60 ? "✓ Meets target" : "↓ Target: 60%+",
          noteColor: efficiencyOverview.task_completion.percentage >= 60 ? "#108C72" : "#C0303D",
          ...kpiTone(efficiencyOverview.task_completion.percentage, 60, 40, true),
        },
        {
          label: "Avg Cycle Time",
          val: `${efficiencyOverview.avg_cycle_time_days}d`,
          sub: "Live DB",
          barW: `${Math.min((efficiencyOverview.avg_cycle_time_days / 20) * 100, 100)}%`,
          note: efficiencyOverview.avg_cycle_time_days <= 5 ? "✓ Meets target" : "↓ Target: under 5d",
          noteColor: efficiencyOverview.avg_cycle_time_days <= 5 ? "#108C72" : "#C0303D",
          ...kpiTone(efficiencyOverview.avg_cycle_time_days, 5, 10, false),
        },
        {
          label: "Overdue Rate",
          val: `${efficiencyOverview.overdue_rate.percentage}%`,
          sub: `${efficiencyOverview.overdue_rate.overdue.toLocaleString("en-IN")} of ${efficiencyOverview.overdue_rate.total.toLocaleString("en-IN")} · Live DB`,
          barW: `${Math.min(efficiencyOverview.overdue_rate.percentage, 100)}%`,
          note: efficiencyOverview.overdue_rate.percentage <= 5 ? "✓ Meets target" : "↓ Target: under 5%",
          noteColor: efficiencyOverview.overdue_rate.percentage <= 5 ? "#108C72" : "#C0303D",
          ...kpiTone(efficiencyOverview.overdue_rate.percentage, 5, 10, false),
        },
        {
          label: "Estimation Coverage",
          val: `${efficiencyOverview.estimation_coverage.percentage}%`,
          sub: `${efficiencyOverview.estimation_coverage.with_hours.toLocaleString("en-IN")} of ${efficiencyOverview.estimation_coverage.total.toLocaleString("en-IN")} · Live DB`,
          barW: `${Math.min(efficiencyOverview.estimation_coverage.percentage, 100)}%`,
          note: `Only ${efficiencyOverview.estimation_coverage.percentage}% tasks have hours set`,
          noteColor: kpiTone(efficiencyOverview.estimation_coverage.percentage, 70, 40, true).color,
          ...kpiTone(efficiencyOverview.estimation_coverage.percentage, 70, 40, true),
        },
        {
          label: "MoM Follow-through",
          val: `${efficiencyOverview.mom_follow_through.percentage}%`,
          sub: `${efficiencyOverview.mom_follow_through.followed.toLocaleString("en-IN")} of ${efficiencyOverview.mom_follow_through.total.toLocaleString("en-IN")} · Live DB`,
          barW: `${Math.min(efficiencyOverview.mom_follow_through.percentage, 100)}%`,
          note: efficiencyOverview.mom_follow_through.percentage >= 80 ? "✓ Meets target" : "↓ Target: 80%+",
          noteColor: efficiencyOverview.mom_follow_through.percentage >= 80 ? "#108C72" : "#C0303D",
          ...kpiTone(efficiencyOverview.mom_follow_through.percentage, 80, 40, true),
        },
      ]
    : [];

  const {
    data: perPersonBreakdown,
    isLoading: isBreakdownLoading,
    isError: isBreakdownError,
  } = useCeoDashboardPerPersonBreakdown(fromDate, toDate);

  const departments = perPersonBreakdown?.departments ?? [];
  const deptOptions = [
    { value: "", label: "All Departments" },
    ...departments.map((d) => ({
      value: d.department_name,
      label: `${d.department_name} (${d.member_count})`,
    })),
  ];
  const visibleDepartments = deptFilter
    ? departments.filter((d) => d.department_name === deptFilter)
    : departments;

  return (
    <div>
      {/* EFFICIENCY OVERVIEW */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Efficiency Overview</div>
          <div className="sec-line" />
          {efficiencyOverview && (
            <span style={{ fontSize: 10, color: "var(--sub)", paddingLeft: 8 }}>
              Based on {efficiencyOverview.task_completion.total.toLocaleString("en-IN")} tasks · Live data
            </span>
          )}
        </div>
        {isEfficiencyLoading && (
          <div className="card" style={{ fontSize: 12, color: "var(--sub)" }}>Loading efficiency overview…</div>
        )}
        {isEfficiencyError && (
          <div className="card" style={{ fontSize: 12, color: "#C0303D" }}>Failed to load efficiency overview data</div>
        )}
        {!isEfficiencyLoading && !isEfficiencyError && efficiencyOverview && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          {/* Execution score */}
          <div
            className="card"
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#2C2C2C,#3D2E20)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "rgba(255,255,255,.5)",
                marginBottom: 8,
              }}
            >
              Execution Score
            </div>
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: scoreStyle.color,
                lineHeight: 1,
              }}
            >
              {efficiencyOverview.execution_score.score}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.6)",
                marginTop: 4,
              }}
            >
              out of {efficiencyOverview.execution_score.out_of}
            </div>
            <div
              style={{
                background: `${scoreStyle.color}25`,
                border: `1px solid ${scoreStyle.color}50`,
                borderRadius: "var(--r100)",
                padding: "4px 14px",
                marginTop: 10,
                fontSize: 11,
                fontWeight: 700,
                color: scoreStyle.color,
              }}
            >
              {scoreStyle.emoji} {efficiencyOverview.execution_score.label}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,.3)",
                marginTop: 8,
                lineHeight: 1.4,
              }}
            >
              {efficiencyOverview.execution_score.factors}
            </div>
          </div>
          {/* 5 KPIs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 10,
            }}
          >
            {efficiencyKpis.map((k) => (
              <div
                key={k.label}
                className="card"
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    color: "var(--sub)",
                    marginBottom: 6,
                  }}
                >
                  {k.label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>
                  {k.val}
                </div>
                <div
                  style={{ fontSize: 10, color: "var(--sub)", marginTop: 2 }}
                >
                  {k.sub}
                </div>
                <div
                  style={{
                    height: 4,
                    background: "var(--divider)",
                    borderRadius: 2,
                    overflow: "hidden",
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      width: k.barW,
                      height: 4,
                      background: k.barColor,
                      borderRadius: 2,
                    }}
                  />
                </div>
                <div style={{ fontSize: 9, color: k.noteColor, marginTop: 4 }}>
                  {k.note}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* RECURRING TASK INSIGHT */}
      {efficiencyOverview?.process_gap && (
        <div
          className="insight"
          style={{
            background: "#6B9BCC12",
            borderColor: "#6B9BCC",
            marginBottom: 20,
          }}
        >
          <div className="i-lbl" style={{ color: "#2D5F8A" }}>
            ⚠ Process gap — Only {efficiencyOverview.process_gap.recurring_count} of {efficiencyOverview.process_gap.total.toLocaleString("en-IN")} tasks use recurring ({efficiencyOverview.process_gap.percentage}%)
          </div>
          <div className="i-txt">
            {efficiencyOverview.process_gap.message}
          </div>
        </div>
      )}

      {/* PEOPLE ALERTS */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">People Alerts</div>
          <div className="sec-line" />
        </div>
        {isPeopleAlertsLoading && (
          <div className="card" style={{ fontSize: 12, color: "var(--sub)" }}>Loading people alerts…</div>
        )}
        {isPeopleAlertsError && (
          <div className="card" style={{ fontSize: 12, color: "#C0303D" }}>Failed to load people alerts data</div>
        )}
        {!isPeopleAlertsLoading && !isPeopleAlertsError && (
        <div className="g g3">
          {/* Top 10 Overdue */}
          <div className="card">
            <div className="ct">🔴 {topOverdueOwners?.title}</div>
            {topOverdueOwners?.owners.map((r, i, arr) => {
              const tone = overdueRankTone(r.rank);
              const maxCount = Math.max(...arr.map((o) => o.overdue_count), 1);
              return (
                <div
                  key={r.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none",
                    fontSize: 11,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      color: tone.color,
                      flexShrink: 0,
                    }}
                  >
                    {r.rank}
                  </div>
                  <div style={{ flex: 1, fontWeight: r.rank <= 3 ? 600 : 400 }}>
                    {r.name}
                  </div>
                  <div
                    style={{
                      width: 80,
                      background: "var(--divider)",
                      borderRadius: 3,
                      height: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(r.overdue_count / maxCount) * 100}%`,
                        height: 6,
                        borderRadius: 3,
                        background: tone.barColor,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: tone.color,
                      width: 38,
                      textAlign: "right",
                    }}
                  >
                    {r.overdue_count}
                  </div>
                </div>
              );
            })}
            {topOverdueOwners?.warning_box && (
              <div
                className="insight"
                style={{
                  background: "#E7848E12",
                  borderColor: "#E7848E",
                  marginTop: 10,
                }}
              >
                <div className="i-lbl" style={{ color: "#C0303D" }}>
                  {topOverdueOwners.warning_box.title}
                </div>
                <div className="i-txt">
                  {topOverdueOwners.warning_box.description}
                </div>
              </div>
            )}
          </div>

          {/* Zero Work + Zero Velocity */}
          <div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div className="ct">⚪ {zeroWork?.title}</div>
              <div
                style={{ fontSize: 11, color: "var(--sub)", marginBottom: 10 }}
              >
                {zeroWork?.description}
              </div>
              <div className="zero-card">
                {zeroWork?.people.map((p, i) => {
                  const avatar = avatarStyle(i);
                  return (
                    <div key={p.name} className="zero-row">
                      <div
                        className="av"
                        style={{ background: avatar.bg, color: avatar.color }}
                      >
                        {p.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: "var(--sub)" }}>
                          {p.department}
                        </div>
                      </div>
                      <span className={`badge ${peopleBadgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card">
              <div className="ct">
                🔴 {zeroVelocity?.title}
              </div>
              <div
                style={{ fontSize: 11, color: "var(--sub)", marginBottom: 10 }}
              >
                {zeroVelocity?.description}
              </div>
              <div className="zero-card">
                {zeroVelocity?.people.map((p, i) => {
                  const avatar = avatarStyle(i);
                  return (
                    <div key={p.name} className="zero-row">
                      <div
                        className="av"
                        style={{ background: avatar.bg, color: avatar.color }}
                      >
                        {p.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: "var(--sub)" }}>
                          {p.subtitle}
                        </div>
                      </div>
                      <span className={`badge ${peopleBadgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  );
                })}
              </div>
              {zeroVelocity?.warning_box && (
                <div
                  className="insight"
                  style={{
                    background: "#E7848E12",
                    borderColor: "#E7848E",
                    marginTop: 10,
                  }}
                >
                  <div className="i-lbl" style={{ color: "#C0303D" }}>
                    {zeroVelocity.warning_box.title}
                  </div>
                  <div className="i-txt">
                    {zeroVelocity.warning_box.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Work Concentration Risk */}
          <div className="card">
            <div className="ct">⚠️ {workConcentrationRisk?.title}</div>
            <div
              style={{ fontSize: 11, color: "var(--sub)", marginBottom: 12 }}
            >
              {workConcentrationRisk?.description}
            </div>
            <div style={{ height: 160 }}>
              <ChartCanvas
                key={`concentrationChart-${workConcentrationRisk?.chart_data.map((d) => `${d.name}:${d.percentage}`).join(",")}`}
                id="concentrationChart"
                config={
                  {
                    type: "doughnut",
                    data: {
                      labels: workConcentrationRisk?.chart_data.map((d) => d.name) ?? [],
                      datasets: [
                        {
                          data: workConcentrationRisk?.chart_data.map((d) => d.percentage) ?? [],
                          backgroundColor: workConcentrationRisk?.chart_data.map((_d, i, arr) =>
                            i === arr.length - 1 ? ok + "44" : err + ["", "cc", "88", "55"][i % 4]
                          ) ?? [],
                          borderWidth: 0,
                          hoverOffset: 4,
                        },
                      ],
                    },
                    options: {
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "60%",
                      plugins: {
                        legend: {
                          display: true,
                          position: "right",
                          labels: {
                            font: { size: 9 },
                            boxWidth: 8,
                            padding: 6,
                            color: dark,
                          },
                        },
                      },
                    },
                  } as any
                }
              />
            </div>
            <div style={{ marginTop: 12 }}>
              {workConcentrationRisk?.top_holders.map((r) => (
                <div
                  key={r.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    padding: "6px 0",
                    borderBottom: "1px solid var(--divider)",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{r.name}</span>
                  <span style={{ color: "#C0303D", fontWeight: 700 }}>
                    {r.open_tasks.toLocaleString("en-IN")} open tasks
                  </span>
                  <span className={`badge ${riskBadgeClass(r.risk)}`}>{r.risk}</span>
                </div>
              ))}
              {workConcentrationRisk?.rest_of_team && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    padding: "6px 0",
                  }}
                >
                  <span style={{ color: "var(--sub)" }}>
                    {workConcentrationRisk.rest_of_team.label}
                  </span>
                  <span style={{ color: "var(--sub)" }}>remaining {workConcentrationRisk.rest_of_team.percentage}%</span>
                  <span className={`badge ${riskBadgeClass(workConcentrationRisk.rest_of_team.risk)}`}>
                    {workConcentrationRisk.rest_of_team.risk}
                  </span>
                </div>
              )}
            </div>
            {workConcentrationRisk?.warning_box && (
              <div
                className="insight"
                style={{
                  background: "#E7848E12",
                  borderColor: "#E7848E",
                  marginTop: 10,
                }}
              >
                <div className="i-lbl" style={{ color: "#C0303D" }}>
                  {workConcentrationRisk.warning_box.title}
                </div>
                <div className="i-txt">
                  {workConcentrationRisk.warning_box.description}
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* EFFORT & OVERDUE */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Effort &amp; Overdue</div>
          <div className="sec-line" />
        </div>
        {isEffortLoading && (
          <div className="card" style={{ fontSize: 12, color: "var(--sub)" }}>Loading effort &amp; overdue…</div>
        )}
        {isEffortError && (
          <div className="card" style={{ fontSize: 12, color: "#C0303D" }}>Failed to load effort &amp; overdue data</div>
        )}
        {!isEffortLoading && !isEffortError && (
        <div className="g g2">
          <div className="card">
            <div className="ct">
              {effortAccuracy?.title}
            </div>
            <div style={{ height: 180 }}>
              <ChartCanvas
                key={`effortChart-${effortAccuracy?.chart_data.map((d) => `${d.name}:${d.estimated_hrs}:${d.actual_hrs}`).join(",")}`}
                id="effortChart"
                config={
                  {
                    type: "bar",
                    data: {
                      labels: effortAccuracy?.chart_data.map((d) => d.name) ?? [],
                      datasets: [
                        {
                          label: "Estimated hrs",
                          data: effortAccuracy?.chart_data.map((d) => d.estimated_hrs) ?? [],
                          backgroundColor: lav,
                          borderRadius: 3,
                        },
                        {
                          label: "Actual hrs",
                          data: effortAccuracy?.chart_data.map((d) => d.actual_hrs) ?? [],
                          backgroundColor: terra + "cc",
                          borderRadius: 3,
                        },
                      ],
                    },
                    options: baseOpts(true),
                  } as any
                }
              />
            </div>
            <div style={{ marginTop: 10 }}>
              {effortAccuracy?.outliers.map((r) => (
                <div key={r.user_id} className="row">
                  <span className="rn">{r.name}</span>
                  <span
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <span
                      className="rv"
                      style={{ color: OUTLIER_COLOR[r.badge] || "#C0303D" }}
                    >
                      {r.diff_label}
                    </span>
                    <span className={`badge ${OUTLIER_BADGE_CLASS[r.badge] ?? "bd"}`}>{r.badge}</span>
                  </span>
                </div>
              ))}
            </div>
            {effortAccuracy?.warning_box && (
              <div
                className="insight"
                style={{
                  background: "#EDC48815",
                  borderColor: "#EDC488",
                  marginTop: 10,
                }}
              >
                <div className="i-lbl" style={{ color: "#8B6914" }}>
                  {effortAccuracy.warning_box.title}
                </div>
                <div className="i-txt">
                  {effortAccuracy.warning_box.description}
                </div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="ct">{overdueAgeTrend?.title}</div>
            {overdueAgeTrend?.age_buckets.map((r, i, arr) => (
              <div
                key={r.bucket}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none",
                  fontSize: 11,
                }}
              >
                <div
                  style={{
                    width: 80,
                    fontSize: 10,
                    color: "var(--sub)",
                    flexShrink: 0,
                  }}
                >
                  {r.bucket}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "var(--divider)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${r.percentage}%`,
                      height: 8,
                      borderRadius: 4,
                      background: AGE_BUCKET_BAR_COLOR[i % AGE_BUCKET_BAR_COLOR.length],
                    }}
                  />
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: AGE_BUCKET_VAL_COLOR[i % AGE_BUCKET_VAL_COLOR.length],
                    width: 38,
                    textAlign: "right",
                  }}
                >
                  {r.count}
                </div>
                <div
                  style={{
                    width: 28,
                    fontSize: 9,
                    color: "var(--sub)",
                    textAlign: "right",
                  }}
                >
                  {r.percentage}%
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10 }}>
              <div className="ct-sm">{overdueAgeTrend?.trend_panel.title}</div>
              <div style={{ height: 90 }}>
                <ChartCanvas
                  key={`overduetrend-${overdueAgeTrend?.trend_panel.chart_data.map((d) => `${d.label}:${d.count}`).join(",")}`}
                  id="overduetrend"
                  config={
                    {
                      type: "line",
                      data: {
                        labels: overdueAgeTrend?.trend_panel.chart_data.map((d) => d.label) ?? [],
                        datasets: [
                          {
                            label: "Overdue Tasks",
                            data: overdueAgeTrend?.trend_panel.chart_data.map((d) => d.count) ?? [],
                            borderColor: err,
                            backgroundColor: err + "22",
                            fill: true,
                            tension: 0.3,
                            pointRadius: 4,
                            pointBackgroundColor: err,
                            borderWidth: 2,
                          },
                        ],
                      },
                      options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: {
                            grid: { color: grid },
                            ticks: { font: { size: 9 }, color: green },
                          },
                          y: {
                            grid: { color: grid },
                            ticks: { font: { size: 9 }, color: green },
                          },
                        },
                      },
                    } as any
                  }
                />
              </div>
            </div>
            {overdueAgeTrend?.trend_panel.warning_box && (
              <div
                className="insight"
                style={{
                  background: "#E7848E12",
                  borderColor: "#E7848E",
                  marginTop: 10,
                }}
              >
                <div className="i-lbl" style={{ color: "#C0303D" }}>
                  {overdueAgeTrend.trend_panel.warning_box.title}
                </div>
                <div className="i-txt">
                  {overdueAgeTrend.trend_panel.warning_box.description}
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* PERSON-WISE AGEING MATRIX */}
      <div className="sec" style={{ marginTop: 0, paddingTop: 0 }}>
        <div className="sec-hd">
          <div className="sec-lbl">{ageingMatrix?.title ?? "Person-wise Ageing Matrix"}</div>
          <div className="sec-line" />
          {ageingMatrix?.description && (
            <span style={{ fontSize: 10, color: "var(--sub)", paddingLeft: 8 }}>
              {ageingMatrix.description}
            </span>
          )}
        </div>
        {isAgeingMatrixLoading && (
          <div className="card" style={{ fontSize: 12, color: "var(--sub)" }}>Loading ageing matrix…</div>
        )}
        {isAgeingMatrixError && (
          <div className="card" style={{ fontSize: 12, color: "#C0303D" }}>Failed to load ageing matrix data</div>
        )}
        {!isAgeingMatrixLoading && !isAgeingMatrixError && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl" style={{ minWidth: 650 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", minWidth: 150 }}>Person</th>
                  <th style={{ textAlign: "center", color: "#0A7A6A" }}>
                    1 Day
                  </th>
                  <th style={{ textAlign: "center", color: "#8B6914" }}>
                    2–7 Days
                  </th>
                  <th style={{ textAlign: "center", color: "#C0303D" }}>
                    8–15 Days
                  </th>
                  <th style={{ textAlign: "center", color: "#C0303D" }}>
                    16–30 Days
                  </th>
                  <th style={{ textAlign: "center", color: "#8B0000" }}>
                    30+ Days
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      color: "var(--dark)",
                      borderLeft: "2px solid var(--divider)",
                    }}
                  >
                    Total Overdue
                  </th>
                </tr>
              </thead>
              <tbody>
                {ageingMatrix?.rows.map((r) => {
                  const tone = ageingRowTone(r.total_overdue, ageingMaxTotal);
                  return (
                    <tr key={r.user_id} style={{ background: tone.bg }}>
                      <td
                        style={{
                          fontWeight: tone.nameBold ? 700 : 600,
                          color: tone.nameColor,
                        }}
                      >
                        {r.name}
                      </td>
                      <td style={{ textAlign: "center", color: "#0A7A6A" }}>
                        {r.bucket_1_day}
                      </td>
                      <td style={{ textAlign: "center", color: "#8B6914" }}>
                        {r.bucket_2_7_days}
                      </td>
                      <td style={{ textAlign: "center", color: "#C0303D" }}>
                        {r.bucket_8_15_days}
                      </td>
                      <td style={{ textAlign: "center", color: "#C0303D" }}>
                        {r.bucket_16_30_days}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          color: "#8B0000",
                          fontWeight: 700,
                        }}
                      >
                        {r.bucket_30_plus_days}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: tone.nameBold ? 800 : 700,
                          color: tone.totalColor,
                          borderLeft: "2px solid var(--divider)",
                        }}
                      >
                        {r.total_overdue}
                      </td>
                    </tr>
                  );
                })}
                {ageingMatrix?.others && (
                  <tr style={{ background: "#F0EDE8", fontStyle: "italic" }}>
                    <td style={{ color: "var(--sub)", fontSize: 10 }}>
                      {ageingMatrix.others.label}
                    </td>
                    {[
                      ageingMatrix.others.bucket_1_day,
                      ageingMatrix.others.bucket_2_7_days,
                      ageingMatrix.others.bucket_8_15_days,
                      ageingMatrix.others.bucket_16_30_days,
                      ageingMatrix.others.bucket_30_plus_days,
                      ageingMatrix.others.total_overdue,
                    ].map((v, i) => (
                      <td
                        key={i}
                        style={{
                          textAlign: "center",
                          color: "var(--sub)",
                          fontSize: 10,
                          borderLeft:
                            i === 5 ? "2px solid var(--divider)" : undefined,
                        }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>

      {/* PER PERSON BREAKDOWN TABLE */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Per-Person Breakdown</div>
          <div className="sec-line" />
          <span
            style={{
              fontSize: 10,
              color: "var(--sub)",
              whiteSpace: "nowrap",
              paddingLeft: 10,
            }}
          >
            🔴 Critical &nbsp;🟡 Overloaded &nbsp;🟢 Performing &nbsp;⬜ Low
            work
          </span>
        </div>
        {/* Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 0",
            marginBottom: 12,
            borderBottom: "1px solid var(--divider)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 600, color: "var(--sub)" }}>
            Filter:
          </span>
          <select
            className="fsel-sm"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {deptOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {isBreakdownLoading && (
          <div className="card" style={{ fontSize: 12, color: "var(--sub)" }}>Loading per-person breakdown…</div>
        )}
        {isBreakdownError && (
          <div className="card" style={{ fontSize: 12, color: "#C0303D" }}>Failed to load per-person breakdown data</div>
        )}
        {!isBreakdownLoading && !isBreakdownError && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="team-tbl">
              <thead>
                <tr>
                  <th style={{ textAlign: "left", minWidth: 140 }}>Name</th>
                  <th
                    colSpan={4}
                    style={{
                      background: "#DA775610",
                      borderRight: "1px solid var(--divider)",
                      textAlign: "center",
                    }}
                  >
                    Tasks
                  </th>
                  <th
                    colSpan={3}
                    style={{
                      background: "#CECBF625",
                      borderRight: "1px solid var(--divider)",
                      textAlign: "center",
                    }}
                  >
                    To-Dos
                  </th>
                  <th>Issues</th>
                  <th>Done Recently</th>
                  <th style={{ minWidth: 220, textAlign: "left" }}>
                    Top Overdue
                  </th>
                </tr>
                <tr>
                  <th>—</th>
                  <th style={{ background: "#DA775608" }}>Open</th>
                  <th style={{ background: "#DA775608" }}>In Prog</th>
                  <th style={{ background: "#DA775608" }}>Done</th>
                  <th
                    style={{
                      background: "#DA775608",
                      borderRight: "1px solid var(--divider)",
                    }}
                  >
                    Overdue
                  </th>
                  <th style={{ background: "#CECBF615" }}>Open</th>
                  <th style={{ background: "#CECBF615" }}>Done</th>
                  <th
                    style={{
                      background: "#CECBF615",
                      borderRight: "1px solid var(--divider)",
                    }}
                  >
                    Overdue
                  </th>
                  <th>Open</th>
                  <th>—</th>
                  <th style={{ textAlign: "left" }}>—</th>
                </tr>
              </thead>
              <tbody>
                {visibleDepartments.map((dept) => {
                  if (!dept.members.length) return null;
                  const isNoDept = !dept.department_name || /no\s*dept/i.test(dept.department_name);
                  return (
                    <>
                      <tr
                        key={`dept-${dept.department_name}`}
                        className="dept-hd"
                        style={
                          isNoDept ? { background: "#E7848E15" } : undefined
                        }
                      >
                        <td colSpan={11}>{dept.department_name || "No Department Set"} ({dept.member_count})</td>
                      </tr>
                      {dept.members.map((p) => (
                        <tr key={p.user_id} className={STATUS_ROW_CLASS[p.status_indicator] ?? ""}>
                          <td>{STATUS_EMOJI[p.status_indicator] ?? ""} {p.name}</td>
                          <td
                            className={`num-open ${p.tasks.open >= 100 ? "num-red" : p.tasks.open > 0 ? "num-warn" : "num-muted"}`}
                          >
                            {p.tasks.open}
                          </td>
                          <td
                            className={
                              p.tasks.in_progress > 0
                                ? "num-warn"
                                : "num-muted"
                            }
                          >
                            {p.tasks.in_progress}
                          </td>
                          <td
                            className={
                              p.tasks.done > 0 ? "num-ok" : "num-muted"
                            }
                            style={
                              p.tasks.done > 300
                                ? { fontWeight: 800, fontSize: 13 }
                                : undefined
                            }
                          >
                            {p.tasks.done}
                          </td>
                          <td
                            className={p.tasks.overdue > 0 ? "num-red" : "num-muted"}
                            style={{ borderRight: "1px solid var(--divider)" }}
                          >
                            {p.tasks.overdue}
                          </td>
                          <td
                            className={
                              p.todos.open > 0 ? "num-warn" : "num-muted"
                            }
                          >
                            {p.todos.open}
                          </td>
                          <td
                            className={
                              p.todos.done > 0 ? "num-ok" : "num-muted"
                            }
                          >
                            {p.todos.done}
                          </td>
                          <td
                            className={p.todos.overdue > 0 ? "num-warn" : "num-muted"}
                            style={{ borderRight: "1px solid var(--divider)" }}
                          >
                            {p.todos.overdue}
                          </td>
                          <td>{p.issues.open}</td>
                          <td title={p.done_recently?.title ?? ""}>
                            {p.done_recently
                              ? `${p.done_recently.count} ${p.done_recently.type}${p.done_recently.count === 1 ? "" : "s"}`
                              : "—"}
                          </td>
                          <td className="top-overdue">
                            {p.top_overdue.length ? (
                              p.top_overdue.map((item, i) => (
                                <span key={i}>
                                  {item.type === "todo" ? "◆ todo: " : "• "}
                                  {truncate(item.title, 60)} ({item.due_date})
                                  {i < p.top_overdue.length - 1 && <br />}
                                </span>
                              ))
                            ) : (
                              <span style={{ color: "#108C72" }}>✓ None</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
