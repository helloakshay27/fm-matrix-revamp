import { useCallback, useEffect, useState } from "react";
import { calendarAccountsApi, calendarErrorMessage, type CalendarAccount } from "@/api/calendarSync";

/** The person's connected calendars, and a way to ask again. */
export function useCalendarAccounts() {
  const [accounts, setAccounts] = useState<CalendarAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setAccounts(await calendarAccountsApi.list());
      setError(null);
    } catch (e) {
      setError(calendarErrorMessage(e, "Your calendars could not be loaded."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { accounts, loading, error, reload };
}
