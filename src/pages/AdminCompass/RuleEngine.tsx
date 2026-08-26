import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Workflow,
  Settings2,
  ListChecks,
} from "lucide-react";

// Admin Compass design tokens — kept identical to TeamDashboard/Jobs so this
// page reads as part of the module rather than a bolt-on.
const T = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryBord: "#e8e3de",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  raised: "#f6f4ee",
  font: "'Poppins', sans-serif",
};

export interface Rule {
  id: number;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  active: boolean;
}

export interface RuleEngineConfig {
  enabled: boolean;
  evaluationMode: "all" | "first";
  runOn: "create_and_update" | "create" | "schedule";
  notifyChannel: "in_app" | "email" | "both" | "none";
  maxRunsPerDay: number;
  logRetentionDays: number;
}

// No Admin Compass rule-engine endpoint exists yet, so the list and the config
// start from local defaults. Swap these for the API once it is available.
const INITIAL_RULES: Rule[] = [];

const DEFAULT_CONFIG: RuleEngineConfig = {
  enabled: true,
  evaluationMode: "all",
  runOn: "create_and_update",
  notifyChannel: "in_app",
  maxRunsPerDay: 500,
  logRetentionDays: 30,
};

const TABS = [
  { key: "rules", label: "Rules", icon: ListChecks },
  { key: "configuration", label: "Configuration", icon: Settings2 },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const cardStyle = {
  background: T.cardBg,
  borderColor: T.primaryBord,
  boxShadow: "0 10px 24px rgba(26,26,26,0.05)",
};

const inputStyle = {
  borderColor: T.primaryBord,
  color: T.textMain,
  background: T.cardBg,
};

/** One labelled row in the Configuration tab. */
const ConfigRow = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) => (
  <div
    className="flex flex-col gap-2 border-t py-4 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    style={{ borderColor: T.borderLgt }}
  >
    <div className="min-w-0">
      <p className="text-sm font-medium" style={{ color: T.textMain }}>
        {label}
      </p>
      <p className="mt-0.5 text-xs" style={{ color: T.textMuted }}>
        {hint}
      </p>
    </div>
    <div className="w-full shrink-0 sm:w-56">{children}</div>
  </div>
);

const RuleEngine = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("rules");
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [searchTerm, setSearchTerm] = useState("");
  const [config, setConfig] = useState<RuleEngineConfig>(DEFAULT_CONFIG);

  const filteredRules = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rules;
    return rules.filter((r) =>
      [r.name, r.trigger, r.condition, r.action].some((f) =>
        f.toLowerCase().includes(q)
      )
    );
  }, [rules, searchTerm]);

  const toggleActive = (id: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const deleteRule = (id: number) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const setField = <K extends keyof RuleEngineConfig>(
    key: K,
    value: RuleEngineConfig[K]
  ) => setConfig((prev) => ({ ...prev, [key]: value }));

  return (
    <div
      className="min-h-[calc(100vh-5rem)] w-full px-3 py-4 sm:px-6 sm:py-6"
      style={{ background: T.pageBg, fontFamily: T.font }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'); .rule-engine-wrap, .rule-engine-wrap * { font-family: 'Poppins', sans-serif !important; }`}</style>

      <div className="rule-engine-wrap mx-auto max-w-7xl space-y-4">
        {/* Header card */}
        <div
          className="flex flex-col gap-3 rounded-[20px] border p-4 shadow-sm sm:gap-4 sm:p-6 md:flex-row md:items-center md:justify-between"
          style={cardStyle}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm sm:h-12 sm:w-12"
              style={{ borderColor: T.primaryBord, background: T.primaryBg }}
            >
              <Workflow
                className="h-5 w-5 sm:h-6 sm:w-6"
                style={{ color: T.primary }}
              />
            </div>
            <div>
              <h1
                className="text-xl font-semibold tracking-tight sm:text-2xl"
                style={{ color: T.textMain }}
              >
                Rule Engine
              </h1>
              <p
                className="mt-1 text-xs font-normal sm:text-sm"
                style={{ color: T.textMuted }}
              >
                Automate Admin Compass actions with trigger-based rules
              </p>
            </div>
          </div>

          <div
            className="w-full rounded-xl border px-3 py-2 text-center text-xs font-medium sm:w-fit sm:px-4 sm:py-2.5 sm:text-sm"
            style={{
              borderColor: T.primaryBord,
              background: T.primaryBg,
              color: config.enabled ? T.textMuted : "#b91c1c",
            }}
          >
            {config.enabled
              ? `${rules.length} ${rules.length === 1 ? "rule" : "rules"}`
              : "Engine disabled"}
          </div>
        </div>

        {/* Tabs — same pill pattern as the Jobs page */}
        <div
          className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border p-1 sm:w-fit"
          style={{ background: T.raised, borderColor: T.primaryBord }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:flex-none sm:text-[13px]"
                style={{
                  background: active ? T.primary : "transparent",
                  color: active ? "#ffffff" : T.textMuted,
                }}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Rules tab ── */}
        {activeTab === "rules" && (
          <div
            className="rounded-[20px] border p-4 shadow-sm sm:p-6"
            style={cardStyle}
          >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors sm:w-fit"
                style={{ background: T.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.primaryHov;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.primary;
                }}
              >
                <Plus className="h-4 w-4" />
                New Rule
              </button>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="relative flex-1 sm:w-64 sm:flex-none">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: T.textMuted }}
                  />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search rules..."
                    className="w-full rounded-xl border py-2 pl-10 pr-3 text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <button
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors"
                  style={{ borderColor: T.primary, color: T.primary }}
                  title="Filter"
                  aria-label="Filter rules"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>

            {filteredRules.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
                style={{ borderColor: T.primaryBord }}
              >
                <Workflow
                  className="h-8 w-8"
                  style={{ color: T.primaryBord }}
                />
                <p className="text-sm font-medium" style={{ color: T.textMain }}>
                  {rules.length === 0 ? "No rules yet" : "No matching rules"}
                </p>
                <p className="text-xs" style={{ color: T.textMuted }}>
                  {rules.length === 0
                    ? 'Create your first rule with "New Rule".'
                    : "Try a different search term."}
                </p>
              </div>
            ) : (
              /* Wide table scrolls inside its own container so the page never
                 scrolls horizontally on mobile. */
              <div className="-mx-4 overflow-x-auto sm:mx-0">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr style={{ background: T.primaryBg }}>
                      {[
                        "Rule",
                        "Trigger",
                        "Condition",
                        "Action",
                        "Status",
                        "",
                      ].map((h, i) => (
                        <th
                          key={i}
                          className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                          style={{ color: T.textMuted }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRules.map((rule) => (
                      <tr
                        key={rule.id}
                        className="border-t"
                        style={{ borderColor: T.borderLgt }}
                      >
                        <td
                          className="px-4 py-3 text-sm font-medium"
                          style={{ color: T.textMain }}
                        >
                          {rule.name}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: T.textMuted }}
                        >
                          {rule.trigger}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: T.textMuted }}
                        >
                          {rule.condition}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: T.textMuted }}
                        >
                          {rule.action}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleActive(rule.id)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              rule.active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {rule.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              className="rounded-lg p-1.5 transition-colors hover:bg-[#f6f4ee]"
                              title="Edit rule"
                              aria-label={`Edit ${rule.name}`}
                            >
                              <Pencil
                                className="h-4 w-4"
                                style={{ color: T.textMuted }}
                              />
                            </button>
                            <button
                              onClick={() => deleteRule(rule.id)}
                              className="rounded-lg p-1.5 transition-colors hover:bg-[#f6f4ee]"
                              title="Delete rule"
                              aria-label={`Delete ${rule.name}`}
                            >
                              <Trash2
                                className="h-4 w-4"
                                style={{ color: T.primary }}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Configuration tab ── */}
        {activeTab === "configuration" && (
          <div
            className="rounded-[20px] border p-4 shadow-sm sm:p-6"
            style={cardStyle}
          >
            <div className="mb-2">
              <h2
                className="text-base font-semibold sm:text-lg"
                style={{ color: T.textMain }}
              >
                Engine Configuration
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm" style={{ color: T.textMuted }}>
                Controls how every rule in this module is evaluated and logged
              </p>
            </div>

            <div className="mt-4">
              <ConfigRow
                label="Enable rule engine"
                hint="Turn off to stop all rules from running without deleting them"
              >
                <button
                  onClick={() => setField("enabled", !config.enabled)}
                  role="switch"
                  aria-checked={config.enabled}
                  aria-label="Enable rule engine"
                  className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                  style={{
                    background: config.enabled ? T.primary : "#d1d5db",
                  }}
                >
                  <span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                    style={{ left: config.enabled ? 22 : 2 }}
                  />
                </button>
              </ConfigRow>

              <ConfigRow
                label="Evaluation mode"
                hint="Run every rule that matches, or stop at the first match"
              >
                <select
                  value={config.evaluationMode}
                  onChange={(e) =>
                    setField(
                      "evaluationMode",
                      e.target.value as RuleEngineConfig["evaluationMode"]
                    )
                  }
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="all">All matching rules</option>
                  <option value="first">First match only</option>
                </select>
              </ConfigRow>

              <ConfigRow
                label="Run rules on"
                hint="Which events trigger an evaluation pass"
              >
                <select
                  value={config.runOn}
                  onChange={(e) =>
                    setField("runOn", e.target.value as RuleEngineConfig["runOn"])
                  }
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="create_and_update">Create and update</option>
                  <option value="create">Create only</option>
                  <option value="schedule">Scheduled run only</option>
                </select>
              </ConfigRow>

              <ConfigRow
                label="Notify on rule action"
                hint="Where to send a notice when a rule fires"
              >
                <select
                  value={config.notifyChannel}
                  onChange={(e) =>
                    setField(
                      "notifyChannel",
                      e.target.value as RuleEngineConfig["notifyChannel"]
                    )
                  }
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="in_app">In-app only</option>
                  <option value="email">Email only</option>
                  <option value="both">In-app and email</option>
                  <option value="none">No notification</option>
                </select>
              </ConfigRow>

              <ConfigRow
                label="Max runs per day"
                hint="Safety cap on total rule executions in a 24-hour window"
              >
                <input
                  type="number"
                  min={1}
                  value={config.maxRunsPerDay}
                  onChange={(e) =>
                    setField("maxRunsPerDay", Number(e.target.value))
                  }
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                  style={inputStyle}
                />
              </ConfigRow>

              <ConfigRow
                label="Log retention (days)"
                hint="How long rule execution history is kept before pruning"
              >
                <input
                  type="number"
                  min={1}
                  value={config.logRetentionDays}
                  onChange={(e) =>
                    setField("logRetentionDays", Number(e.target.value))
                  }
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                  style={inputStyle}
                />
              </ConfigRow>
            </div>

            <div
              className="mt-6 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end"
              style={{ borderColor: T.borderLgt }}
            >
              <button
                onClick={() => setConfig(DEFAULT_CONFIG)}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
                style={{ borderColor: T.primaryBord, color: T.textMuted }}
              >
                Reset to defaults
              </button>
              <button
                className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors"
                style={{ background: T.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.primaryHov;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.primary;
                }}
              >
                Save configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleEngine;
