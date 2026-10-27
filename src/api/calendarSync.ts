/**
 * The calendar's connected accounts, events and booking links — Lockated's own calendar API (lockated_new_updated), as the
 * Sales CRM's calendar screen uses its own: connect a Google / Outlook / Nextcloud / Zimbra calendar, see whether each still
 * works, share a booking link, put an event on one.
 *
 * Every call carries the person's access token in the Authorization header. The person is the one the token names: a user_id is
 * never sent (the server ignores it), and no access token is ever put in a link.
 */
import { getBaseUrl, getToken } from "@/utils/auth";

export type CalendarProvider = "google" | "outlook" | "nextcloud" | "zimbra";

export const PROVIDERS: CalendarProvider[] = ["google", "outlook", "nextcloud", "zimbra"];

export const PROVIDER_LABELS: Record<CalendarProvider, string> = {
  google: "Google Calendar",
  outlook: "Outlook",
  nextcloud: "Nextcloud",
  zimbra: "Zimbra",
};

export const PROVIDER_COLORS: Record<CalendarProvider, string> = {
  google: "#4285F4",
  outlook: "#0078D4",
  nextcloud: "#0082C9",
  zimbra: "#00A9B5",
};

/** Google and Outlook connect through the provider's own consent screen; Nextcloud and Zimbra with a username and password. */
export const isConsentProvider = (provider: CalendarProvider): provider is "google" | "outlook" =>
  provider === "google" || provider === "outlook";

export interface CalendarAccount {
  id: number;
  provider: CalendarProvider;
  email: string;
  color: string;
  /** Whether it works right now: a sync that learned the provider refused the stored credentials says no, without a live call. */
  connected: boolean;
  status: "connected" | "needs_reconnect";
  last_error: string | null;
  last_synced_at: string | null;
  connected_at: string;
  updated_at: string;
}

export interface BookingLink {
  id: number;
  label: string | null;
  duration_minutes: number;
  provider: CalendarProvider;
  calendar_email: string;
  token: string;
  /** Revoked links stay in the list with active: false. */
  active: boolean;
  share_url: string;
  created_at: string;
}

export interface EventPayload {
  calendar_email: string;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  all_day?: boolean;
  attendees?: string[];
}

export class CalendarApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CalendarApiError";
    this.status = status;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const base = getBaseUrl();
  const token = getToken();
  if (!base || !token) throw new CalendarApiError("Sign in again to use your calendar.", 401);

  const response = await fetch(`${base}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = data as { error?: string; errors?: string[] } | null;
    throw new CalendarApiError(error?.error || error?.errors?.join(", ") || "Something went wrong. Please try again.", response.status);
  }
  return data as T;
}

const enc = encodeURIComponent;

const SYNC_PATHS: Record<CalendarProvider, string> = {
  google: "/google_calander/sync",
  outlook: "/outlook_calendar/sync",
  nextcloud: "/nextcloud_calendar/sync",
  zimbra: "/zimbra_calendar/sync",
};

export const calendarAccountsApi = {
  list: () => request<{ accounts: CalendarAccount[] }>("GET", "/api/calendar_accounts").then((r) => r.accounts ?? []),

  /** The Google / Outlook consent screen to send the person's browser to; it brings them back as themselves. */
  connectUrl: (provider: "google" | "outlook", email: string) =>
    request<{ url: string }>("GET", `/api/calendar_accounts/${provider}/connect_url?email=${enc(email)}`).then((r) => r.url),

  connectNextcloud: (body: { email: string; username: string; app_password: string; server_url?: string }) =>
    request<{ connected: boolean }>("POST", "/nextcloud_calendar/connect", body),

  connectZimbra: (body: { email: string; username: string; password: string; server_url?: string }) =>
    request<{ connected: boolean }>("POST", "/zimbra_calendar/connect", body),

  sync: (account: Pick<CalendarAccount, "provider" | "email">) =>
    request<{ message?: string }>("GET", `${SYNC_PATHS[account.provider]}?email=${enc(account.email)}`),

  setColor: (account: Pick<CalendarAccount, "provider" | "id">, color: string) =>
    request<unknown>("PATCH", `/api/calendar_accounts/${account.provider}/${account.id}/color`, { color }),

  disconnect: (account: Pick<CalendarAccount, "provider" | "id">) =>
    request<unknown>("DELETE", `/api/calendar_accounts/${account.provider}/${account.id}`),
};

export const bookingLinksApi = {
  list: () => request<BookingLink[]>("GET", "/api/booking_links"),
  durations: () => request<{ durations: number[] }>("GET", "/api/booking_links/durations").then((r) => r.durations),
  create: (booking_link: { label: string; duration_minutes: number; provider: CalendarProvider; calendar_email: string }) =>
    request<BookingLink>("POST", "/api/booking_links", { booking_link }),
  revoke: (id: number) => request<unknown>("DELETE", `/api/booking_links/${id}`),
};

export const calendarEventsApi = {
  create: (google_calendar_event: EventPayload) => request<unknown>("POST", "/api/google_calendar_events", { google_calendar_event }),
};

/** Parses an error from any of the calls above into something to show. */
export function calendarErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
