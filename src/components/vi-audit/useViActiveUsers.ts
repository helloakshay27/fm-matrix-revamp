import { useEffect, useState } from "react";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

const VI_ACTIVE_USERS_ENDPOINT = "/pms/users/vi_fte_non_fte_active_users.json";
export const VI_USER_SEARCH_MIN_CHARS = 3;
const SEARCH_DEBOUNCE_MS = 400;

export interface ViActiveUserOption {
  id: string;
  name: string;
  email?: string;
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
  return { id: String(id), name, email: str(user.email) || undefined };
};

/**
 * Server-side search of FTE / Non-FTE active users for the Vi Audit pickers
 * (GET /pms/users/vi_fte_non_fte_active_users.json?q[email_or_mobile_cont]=<term>).
 * Searches once the term has VI_USER_SEARCH_MIN_CHARS characters, debounced. Pass
 * `employeeType` (e.g. "internal" for SPOC / Functional Head) to add q[employee_type_cont].
 */
export const useViUserSearch = (term: string, employeeType?: string) => {
  const [options, setOptions] = useState<ViActiveUserOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = term.trim();
    if (q.length < VI_USER_SEARCH_MIN_CHARS) {
      setOptions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ "q[email_or_mobile_cont]": q });
        if (employeeType) params.set("q[employee_type_cont]", employeeType);
        const response = await fetch(getFullUrl(`${VI_ACTIVE_USERS_ENDPOINT}?${params.toString()}`), {
          headers: { Authorization: getAuthHeader() },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        setOptions(
          extractUsers(await response.json())
            .map(toOption)
            .filter((option): option is ViActiveUserOption => option !== null),
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("User search failed:", error);
        setOptions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term, employeeType]);

  return { options, loading };
};
