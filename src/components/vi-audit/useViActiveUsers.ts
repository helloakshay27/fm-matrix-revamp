import { useEffect, useMemo, useState } from "react";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

const VI_ACTIVE_USERS_ENDPOINT = "/pms/users/vi_fte_non_fte_active_users.json";
export const VI_USER_SEARCH_MIN_CHARS = 3;
const SEARCH_DEBOUNCE_MS = 400;

export interface ViActiveUserOption {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
}

type RawUser = Record<string, unknown>;

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

// Accepts the users array at the root or under data / users / data.users.
const extractUsers = (json: unknown): RawUser[] => {
  if (Array.isArray(json)) return json as RawUser[];
  const obj = (json ?? {}) as Record<string, unknown>;
  const data = obj.data as Record<string, unknown> | unknown[] | undefined;
  if (Array.isArray(obj.users)) return obj.users as RawUser[];
  if (Array.isArray(data)) return data as RawUser[];
  if (data && Array.isArray((data as Record<string, unknown>).users)) {
    return (data as Record<string, unknown>).users as RawUser[];
  }
  return [];
};

const toOption = (user: RawUser): ViActiveUserOption | null => {
  const id = user.id ?? user.user_id;
  if (id === undefined || id === null) return null;
  const name =
    str(user.full_name) ||
    str(user.name) ||
    [str(user.firstname), str(user.lastname)].filter(Boolean).join(" ") ||
    str(user.email);
  if (!name) return null;
  const mobile = str(user.mobile) || (typeof user.mobile === "number" ? String(user.mobile) : "");
  return { id: String(id), name, email: str(user.email) || undefined, mobile: mobile || undefined };
};

const fetchUsers = async (params: URLSearchParams, signal: AbortSignal) => {
  const response = await fetch(getFullUrl(`${VI_ACTIVE_USERS_ENDPOINT}?${params.toString()}`), {
    headers: { Authorization: getAuthHeader() },
    signal,
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return extractUsers(await response.json())
    .map(toOption)
    .filter((option): option is ViActiveUserOption => option !== null);
};

// The preloaded list is shared: every picker on a page (e.g. one per action plan) reuses one
// request per login + employee type, refreshed after BASE_LIST_TTL_MS. A failed request is
// dropped so the next picker retries.
const BASE_LIST_TTL_MS = 5 * 60 * 1000;

// Cache keys are per login; a missing token must not throw during render (the request reports it).
const authKey = () => {
  try {
    return getAuthHeader();
  } catch {
    return "";
  }
};
const baseListCache = new Map<string, { at: number; promise: Promise<ViActiveUserOption[]> }>();

const loadBaseList = (employeeType?: string) => {
  const key = `${authKey()}|${employeeType ?? ""}`;
  const cached = baseListCache.get(key);
  if (cached && Date.now() - cached.at < BASE_LIST_TTL_MS) return cached.promise;
  const params = new URLSearchParams();
  if (employeeType) params.set("q[employee_type_cont]", employeeType);
  // Not tied to one picker's lifetime, so no abort signal — unmounted pickers just ignore it.
  const promise = fetchUsers(params, new AbortController().signal);
  promise.catch(() => baseListCache.delete(key));
  baseListCache.set(key, { at: Date.now(), promise });
  return promise;
};

// Every user a picker has seen this session (preloaded list, search results, users already
// picked), per login + employee type. The preloaded list is limited and the server search only
// matches email / mobile, so without this a user found in one picker (e.g. the corrective plan's)
// can't be found by name in the next one (the preventive plan's).
const seenUsers = new Map<string, Map<string, ViActiveUserOption>>();
const seenKey = (employeeType?: string) => `${authKey()}|${employeeType ?? ""}`;

/** Remember users so preload pickers with the same employee type can offer them. */
export const rememberViUsers = (users: ViActiveUserOption[], employeeType?: string) => {
  const key = seenKey(employeeType);
  const known = seenUsers.get(key) ?? new Map<string, ViActiveUserOption>();
  users.forEach((user) => known.set(user.id, { ...known.get(user.id), ...user }));
  seenUsers.set(key, known);
};

const matchesTerm = (user: ViActiveUserOption, q: string) =>
  [user.name, user.email, user.mobile].some((field) => field?.toLowerCase().includes(q));

/**
 * FTE / Non-FTE active users for the Vi Audit pickers
 * (GET /pms/users/vi_fte_non_fte_active_users.json). Pass `employeeType` (e.g. "internal" for
 * SPOC / Functional Head / Responsible Person) to add q[employee_type_cont].
 * - Server search (q[email_or_mobile_cont]) once the term has VI_USER_SEARCH_MIN_CHARS
 *   characters, debounced.
 * - With `preload`, the base list loads up front and is filtered locally on every keystroke
 *   (name / email / mobile), merged with the server-search results.
 */
export const useViUserSearch = (
  term: string,
  employeeType?: string,
  { preload = false }: { preload?: boolean } = {},
) => {
  const [baseList, setBaseList] = useState<ViActiveUserOption[]>([]);
  const [baseLoading, setBaseLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ViActiveUserOption[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const q = term.trim();
  const searching = q.length >= VI_USER_SEARCH_MIN_CHARS;

  // Base list (employee-type filter only) for preload pickers — shared across pickers (loadBaseList).
  useEffect(() => {
    if (!preload) {
      setBaseList([]);
      return;
    }
    let active = true;
    setBaseLoading(true);
    loadBaseList(employeeType)
      .then((users) => {
        rememberViUsers(users, employeeType);
        if (active) setBaseList(users);
      })
      .catch((error) => {
        if (!active) return;
        console.error("User list failed:", error);
        setBaseList([]);
      })
      .finally(() => active && setBaseLoading(false));
    return () => {
      active = false;
    };
  }, [employeeType, preload]);

  // Server-side search by email / mobile.
  useEffect(() => {
    if (!searching) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    const controller = new AbortController();
    setSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (employeeType) params.set("q[employee_type_cont]", employeeType);
        params.set("q[email_or_mobile_cont]", q);
        const found = await fetchUsers(params, controller.signal);
        rememberViUsers(found, employeeType);
        setSearchResults(found);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("User search failed:", error);
        setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, searching, employeeType]);

  const options = useMemo(() => {
    const needle = q.toLowerCase();
    // Preload pickers search the base list plus every user already seen this session.
    const pool = preload
      ? [
          ...baseList,
          ...[...(seenUsers.get(seenKey(employeeType))?.values() ?? [])].filter(
            (user) => !baseList.some((b) => b.id === user.id),
          ),
        ]
      : baseList;
    // Without a term, keep the list as the API returned it.
    const local = needle ? pool.filter((user) => matchesTerm(user, needle)) : baseList;
    if (!searching) return local;
    const seen = new Set(local.map((user) => user.id));
    return [...local, ...searchResults.filter((user) => !seen.has(user.id))];
  }, [q, searching, baseList, searchResults, preload, employeeType]);

  return { options, loading: baseLoading || searchLoading };
};
