import { useState } from "react";
import { CalendarCheck, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountsSheet } from "./AccountsSheet";
import { BookingLinksDialog } from "./BookingLinksDialog";
import { EventFormDialog } from "./EventFormDialog";
import { useCalendarAccounts } from "./useCalendarAccounts";

/**
 * The calendar's connections, in the toolbar: which calendars are connected (and which need connecting again), a link to share
 * availability, and a new meeting. Replaces the single "Sync Google Calendar" button, which asked the server about the person
 * by email alone, with no sign-in.
 */
export function CalendarConnections({ onChanged }: { onChanged?: () => void }) {
  const { accounts, loading, error, reload } = useCalendarAccounts();
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const attention = accounts.filter((a) => !a.connected).length;

  return (
    <>
      <Button onClick={() => setAccountsOpen(true)} variant="outline" className="flex h-10 items-center gap-2 px-4 py-2">
        <CalendarCheck className="h-4 w-4" />
        Calendars
        {attention > 0 && (
          <span className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white" title="Needs connecting again">{attention}</span>
        )}
      </Button>
      <Button onClick={() => setLinksOpen(true)} variant="outline" className="flex h-10 items-center gap-2 px-4 py-2">
        <Share2 className="h-4 w-4" />Share
      </Button>
      <Button onClick={() => setEventOpen(true)} className="flex h-10 items-center gap-2 px-4 py-2">
        <Plus className="h-4 w-4" />New meeting
      </Button>

      <AccountsSheet
        open={accountsOpen} onOpenChange={setAccountsOpen} accounts={accounts} loading={loading} error={error} reload={reload} onChanged={onChanged}
      />
      <BookingLinksDialog open={linksOpen} onOpenChange={setLinksOpen} accounts={accounts} />
      <EventFormDialog open={eventOpen} onOpenChange={setEventOpen} accounts={accounts} onSaved={() => { void reload(); onChanged?.(); }} />
    </>
  );
}
