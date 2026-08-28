import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Workflow,
  ListChecks,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import RuleCanvas from "@/components/AdminCompass/RuleCanvas";
import {
  deleteRule as deleteRuleApi,
  fetchRules,
  operatorSymbol,
  updateRule,
  type Rule,
} from "@/services/ruleEngineAPI";

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

const TABS = [{ key: "rules", label: "Rules", icon: ListChecks }] as const;

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

/** One-line summary of a rule's conditions, e.g. `status = open AND priority > 2`. */
const summariseConditions = (rule: Rule) =>
  rule.conditions
    .map(
      (c) =>
        `${c.conditionAttribute || "?"} ${operatorSymbol(c.operator)} ${c.compareValue || "?"}`
    )
    .join(" · ") || "—";

const summariseActions = (rule: Rule) =>
  rule.actions.map((a) => a.actionMethod || "?").join(" · ") || "—";

const RuleEngine = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("rules");
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // null = list view; undefined id = new rule; a number = edit that rule.
  const [editing, setEditing] = useState<{ id: number | null } | null>(null);

  const loadRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRules(await fetchRules());
    } catch (e: any) {
      setError(e?.message || "Failed to load rules");
      setRules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const filteredRules = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rules;
    return rules.filter((r) =>
      [r.name, r.description, summariseConditions(r), summariseActions(r)].some(
        (f) => f.toLowerCase().includes(q)
      )
    );
  }, [rules, searchTerm]);

  // The whole rule goes back on the wire — the nested rows all carry ids, so
  // they update in place rather than being recreated.
  const toggleActive = async (rule: Rule) => {
    setTogglingId(rule.id);
    try {
      const updated = await updateRule(rule.id, {
        name: rule.name,
        description: rule.description,
        active: !rule.active,
        modelId: rule.modelId,
        conditions: rule.conditions,
        actions: rule.actions,
      });
      setRules((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
      toast.success(updated.active ? "Rule activated" : "Rule deactivated");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update rule");
    } finally {
      setTogglingId(null);
    }
  };

  const removeRule = async (rule: Rule) => {
    try {
      await deleteRuleApi(rule.id);
      setRules((prev) => prev.filter((r) => r.id !== rule.id));
      toast.success("Rule deleted");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete rule");
    }
  };

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
              color: T.textMuted,
            }}
          >
            {`${rules.length} ${rules.length === 1 ? "rule" : "rules"}`}
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

        {/* ── Rules tab: canvas editor, or the list ── */}
        {activeTab === "rules" && editing && (
          <div
            className="rounded-[20px] border p-4 shadow-sm sm:p-6"
            style={cardStyle}
          >
            <RuleCanvas
              ruleId={editing.id}
              onBack={() => {
                setEditing(null);
                loadRules();
              }}
              onSaved={(saved) =>
                setRules((prev) => {
                  const exists = prev.some((r) => r.id === saved.id);
                  return exists
                    ? prev.map((r) => (r.id === saved.id ? saved : r))
                    : [saved, ...prev];
                })
              }
            />
          </div>
        )}

        {activeTab === "rules" && !editing && (
          <div
            className="rounded-[20px] border p-4 shadow-sm sm:p-6"
            style={cardStyle}
          >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setEditing({ id: null })}
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
                  onClick={loadRules}
                  disabled={loading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors disabled:opacity-60"
                  style={{ borderColor: T.primary, color: T.primary }}
                  title="Refresh"
                  aria-label="Refresh rules"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
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

            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12">
                <Loader2
                  className="h-6 w-6 animate-spin"
                  style={{ color: T.primary }}
                />
                <p className="text-xs" style={{ color: T.textMuted }}>
                  Loading rules...
                </p>
              </div>
            ) : error ? (
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
                style={{ borderColor: T.primaryBord }}
              >
                <p className="text-sm font-medium text-red-600">{error}</p>
                <button
                  onClick={loadRules}
                  className="mt-1 rounded-xl px-4 py-2 text-sm font-medium text-white"
                  style={{ background: T.primary }}
                >
                  Try again
                </button>
              </div>
            ) : filteredRules.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
                style={{ borderColor: T.primaryBord }}
              >
                <Workflow
                  className="h-8 w-8"
                  style={{ color: T.primaryBord }}
                />
                <p
                  className="text-sm font-medium"
                  style={{ color: T.textMain }}
                >
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
                        "Conditions",
                        "Actions",
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
                          <button
                            onClick={() => setEditing({ id: rule.id })}
                            className="text-left hover:underline"
                          >
                            {rule.name || `Rule #${rule.id}`}
                          </button>
                          {rule.description && (
                            <span
                              className="block truncate text-xs"
                              style={{ color: T.textMuted }}
                            >
                              {rule.description}
                            </span>
                          )}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: T.textMuted }}
                        >
                          {rule.conditions[0]?.modelName ||
                            rule.conditions[0]?.actionType ||
                            "—"}
                        </td>
                        <td
                          className="max-w-[240px] truncate px-4 py-3 text-sm"
                          style={{ color: T.textMuted }}
                          title={summariseConditions(rule)}
                        >
                          {summariseConditions(rule)}
                        </td>
                        <td
                          className="max-w-[200px] truncate px-4 py-3 text-sm"
                          style={{ color: T.textMuted }}
                          title={summariseActions(rule)}
                        >
                          {summariseActions(rule)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleActive(rule)}
                            disabled={togglingId === rule.id}
                            className={`rounded-full px-3 py-1 text-xs font-medium disabled:opacity-60 ${
                              rule.active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {togglingId === rule.id
                              ? "Saving..."
                              : rule.active
                                ? "Active"
                                : "Inactive"}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditing({ id: rule.id })}
                              className="rounded-lg p-1.5 transition-colors hover:bg-[#f6f4ee]"
                              title="Open in canvas"
                              aria-label={`Edit ${rule.name}`}
                            >
                              <Pencil
                                className="h-4 w-4"
                                style={{ color: T.textMuted }}
                              />
                            </button>
                            <button
                              onClick={() => removeRule(rule)}
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
      </div>
    </div>
  );
};

export default RuleEngine;
