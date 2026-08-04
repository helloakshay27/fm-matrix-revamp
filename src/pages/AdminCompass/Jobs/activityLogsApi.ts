// @ts-nocheck
/* ═══════════════════════════════════════════════════
   API — Jobs activity logs
   GET {BASE_URL}/kras/activity_logs.json?access_token=…&page=1&per_page=20
   ═══════════════════════════════════════════════════ */
import {
  getApiContext,
  buildApiUrl,
  apiHeaders,
  unwrapRows,
  firstDefined,
} from "./apiClient";

export const LOGS_PER_PAGE = 20;

// Action vocabulary the UI styles/labels. Server verbs are mapped onto these.
const ACTION_ALIASES = {
  create: "create",
  created: "create",
  add: "create",
  added: "create",
  edit: "edit",
  edited: "edit",
  update: "edit",
  updated: "edit",
  assign: "assign",
  assigned: "assign",
  activate: "activate",
  activated: "activate",
  deactivate: "deactivate",
  deactivated: "deactivate",
  inactivate: "deactivate",
  progress: "progress",
  progressed: "progress",
  achievement: "achievement",
  achieved: "achievement",
  delete: "deactivate",
  deleted: "deactivate",
  destroy: "deactivate",
  // KPI value submissions are progress updates.
  entry_submitted: "progress",
  entry_updated: "progress",
  submitted: "progress",
};

const normalizeAction = (raw) => {
  const key = String(raw ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (!key) return "edit";
  if (ACTION_ALIASES[key]) return ACTION_ALIASES[key];
  // "kra_created" / "status_changed" style verbs — match on the tail word.
  const tail = key.split("_").pop();
  return ACTION_ALIASES[tail] || key;
};

// "Kra" / "PmsKra" / "kra" → "KRA"; keeps unknown types readable.
const normalizeEntity = (raw) => {
  const value = String(raw ?? "").trim();
  if (!value) return "—";
  const bare = value.replace(/^Pms/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
  if (/^kra$/i.test(bare)) return "KRA";
  if (/^kpi$/i.test(bare)) return "KPI";
  if (/^(jd|job ?description)$/i.test(bare)) return "JD";
  return bare;
};

// Matches the existing display format: "YYYY-MM-DD HH:mm".
const formatTimestamp = (raw) => {
  if (!raw) return "—";
  const date = new Date(raw);
  if (isNaN(date.getTime())) return String(raw);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const WEEKDAYS = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/;

/**
 * Ruby time/date inspect strings ko chhota karta hai:
 *   "Mon, 03 Aug 2026 12:36:22.600841000 IST +05:30" → "03 Aug 2026 12:36"
 *   "Fri, 31 Jul 2026"                               → "31 Jul 2026"
 */
const shortenRubyTime = (value) => {
  const match =
    /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s*)?(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})(?:\s+(\d{2}:\d{2}))?/.exec(
      value
    );
  if (!match) return null;
  return match[2] ? `${match[1]} ${match[2]}` : match[1];
};

// Ruby renders BigDecimals as "0.5e2" and floats as "0.0" — show 50 and 0.
const formatRubyValue = (raw) => {
  let value = String(raw ?? "").trim();
  if (!value || value === "nil") return "";
  // Strip surrounding quotes from string values.
  value = value.replace(/^"(.*)"$/s, "$1").replace(/^'(.*)'$/s, "$1");
  if (/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(value)) {
    const num = Number(value);
    if (Number.isFinite(num)) return String(num);
  }
  return shortenRubyTime(value) ?? value;
};

/**
 * Ruby array inspect ko elements me todta hai. Comma par seedha split nahi kar
 * sakte kyunki date values me khud comma hota hai ("Fri, 31 Jul 2026"), isliye
 * weekday token ko agle token ke saath jod dete hain.
 */
const splitRubyList = (inner) => {
  const parts = String(inner).split(",").map((part) => part.trim());
  const out = [];
  for (let i = 0; i < parts.length; i += 1) {
    if (WEEKDAYS.test(parts[i]) && i + 1 < parts.length) {
      out.push(`${parts[i]}, ${parts[i + 1]}`);
      i += 1;
    } else if (parts[i]) {
      out.push(parts[i]);
    }
  }
  return out;
};

const humanizeKey = (key) =>
  String(key)
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

// Audit shor — inhe dikhane se log padhna mushkil hota hai, koi value nahi.
const NOISE_KEYS = new Set([
  "id",
  "created_at",
  "updated_at",
  "created_by_id",
  "updated_by_id",
  "archived_at",
  "lock_version",
]);

// `:sym=>value` aur `"string"=>value` dono keys support karta hai. Value me
// comma ho sakta hai, isliye pair agle key boundary par khatam hota hai.
const RUBY_PAIR =
  /(?::([a-zA-Z_][a-zA-Z_0-9]*)|"([^"]+)")\s*=>\s*(.*?)(?=\s*,\s*(?::[a-zA-Z_][a-zA-Z_0-9]*|"[^"]+")\s*=>|\s*\}\s*$)/gs;

/**
 * `detail` Ruby hash inspect string hoti hai — do shapes aate hain:
 *   {:title=>"test"}                        (create — naye record ke fields)
 *   {"archived"=>[false, true], …}          (update — [purana, naya] changes)
 * Dono ko { key, label, value } pairs me todte hain; `{}` par khali array.
 */
const parseRubyHash = (raw) => {
  const text = String(raw ?? "").trim();
  if (!text || !/^\{.*\}$/s.test(text)) return null;
  // "{}" — update hua par koi tracked field nahi badla.
  if (!text.includes("=>")) return [];
  return [...text.matchAll(RUBY_PAIR)].map(([, symKey, strKey, value]) => {
    const key = symKey || strKey;
    const trimmed = String(value).trim();
    const list = /^\[.*\]$/s.test(trimmed)
      ? splitRubyList(trimmed.slice(1, -1))
      : null;
    return {
      key,
      label: humanizeKey(key),
      // [purana, naya] → "purana → naya"; nil ko "—" dikhate hain.
      value: list
        ? list.map((item) => formatRubyValue(item) || "—").join(" → ")
        : formatRubyValue(trimmed),
    };
  });
};

/** "Archived: false → true · Weight: 100 → 49" — noise keys chhod kar. */
const formatDetail = (raw) => {
  const text = String(raw ?? "").trim();
  if (!text) return "";
  const pairs = parseRubyHash(text);
  // Ruby hash nahi hai to jaisa hai waisa dikhao; "{}" / khali hash → kuch nahi.
  if (pairs === null) return text;
  return pairs
    .filter((pair) => !NOISE_KEYS.has(pair.key) && pair.value !== "")
    .map((pair) => {
      // "Archived: false → true" ke bajaye seedha "Archived" / "Restored".
      if (pair.key === "archived") {
        const [from, to] = pair.value.split(" → ");
        if (to === "true") return "Archived";
        if (to === "false") return from === "true" ? "Restored" : "";
      }
      return `${pair.label}: ${pair.value}`;
    })
    .filter(Boolean)
    .join(" · ");
};

/**
 * Create logs ke detail me record ka naam hota hai (`:title` / `:name`) —
 * endpoint alag se naam nahi bhejta, isliye wahi Name column me use karte hain.
 */
const nameFromDetail = (raw) => {
  const pairs = parseRubyHash(raw);
  if (!pairs) return undefined;
  const named = pairs.find((pair) => pair.key === "title" || pair.key === "name");
  const value = named?.value?.split(" → ").pop()?.trim();
  return value || undefined;
};

const userName = (row) => {
  const user = firstDefined(
    row?.user_name,
    row?.created_by_name,
    row?.performed_by,
    row?.actor_name,
    typeof row?.user === "string" ? row.user : undefined,
    row?.user?.name,
    row?.user?.full_name,
    row?.created_by?.name,
    typeof row?.created_by === "string" ? row.created_by : undefined
  );
  return user ? String(user).trim() : "—";
};

const normalizeLog = (row, index) => ({
  id: firstDefined(row?.id, row?.log_id, `log-${index}`),
  type: normalizeAction(
    firstDefined(row?.action, row?.event, row?.log_type, row?.activity_type, row?.type)
  ),
  entity: normalizeEntity(
    firstDefined(
      row?.entity,
      row?.entity_type,
      row?.loggable_type,
      row?.resource_type,
      row?.record_type
    )
  ),
  // The endpoint sends no human name — only entity + entity_id — so fall back
  // to the record reference (e.g. "#58") when no name field is present.
  name: String(
    firstDefined(
      row?.name,
      row?.title,
      row?.entity_name,
      row?.loggable_name,
      row?.record_name,
      row?.kra_name,
      row?.kpi_name,
      nameFromDetail(firstDefined(row?.detail, row?.details)),
      row?.entity_id !== undefined && row?.entity_id !== null
        ? `#${row.entity_id}`
        : undefined
    ) ?? "—"
  ).trim(),
  entityId: firstDefined(row?.entity_id, row?.loggable_id, row?.record_id),
  detail: formatDetail(
    firstDefined(
      row?.detail,
      row?.details,
      row?.description,
      row?.message,
      row?.comment,
      row?.remarks,
      row?.notes
    )
  ),
  user: userName(row),
  timestamp: formatTimestamp(
    firstDefined(row?.created_at, row?.timestamp, row?.logged_at, row?.updated_at)
  ),
});

const readMeta = (json, rowCount, page, perPage) => {
  // `pagination` sits at the top level, alongside `data` — not inside it.
  const meta =
    json?.pagination ?? json?.meta ?? json?.data?.pagination ?? json ?? {};
  const toNum = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  };
  const total = toNum(
    firstDefined(meta.total_count, meta.total, meta.total_entries, meta.count)
  );
  const totalPages = toNum(
    firstDefined(meta.total_pages, meta.pages, meta.last_page)
  );
  const currentPage = toNum(firstDefined(meta.current_page, meta.page)) ?? page;
  const nextPage = toNum(meta.next_page);
  return {
    page: currentPage,
    perPage,
    total,
    totalPages,
    // next_page is authoritative when present; then total_pages/total; and as a
    // last resort "a full page came back" implies there may be more.
    hasMore:
      "next_page" in meta
        ? meta.next_page !== null && nextPage !== undefined && nextPage > currentPage
        : totalPages !== undefined
          ? currentPage < totalPages
          : total !== undefined
            ? currentPage * perPage < total
            : rowCount === perPage,
  };
};

/**
 * Returns { logs, page, perPage, total, totalPages, hasMore }, or null when
 * there is no auth/base-url context yet. Throws on a failed request.
 */
export const fetchActivityLogs = async ({
  page = 1,
  perPage = LOGS_PER_PAGE,
} = {}) => {
  const { baseUrl, token } = getApiContext();
  if (!baseUrl || !token) return null;
  const url = buildApiUrl("/kras/activity_logs.json", {
    page,
    per_page: perPage,
  });
  const res = await fetch(url, { headers: apiHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const rows = unwrapRows(json, "activity_logs", "logs", "activities");
  return {
    logs: rows.map(normalizeLog),
    ...readMeta(json, rows.length, page, perPage),
  };
};
