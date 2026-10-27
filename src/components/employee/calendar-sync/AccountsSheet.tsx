import { useState } from "react";
import { AlertTriangle, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  PROVIDER_LABELS, calendarAccountsApi, calendarErrorMessage, isConsentProvider, type CalendarAccount, type CalendarProvider,
} from "@/api/calendarSync";
import { ConnectAccountDialog } from "./ConnectAccountDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: CalendarAccount[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  /** Events may have changed (a sync finished, an account was removed). */
  onChanged?: () => void;
}

const ago = (iso: string | null) => {
  if (!iso) return "not synced yet";
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "synced just now";
  if (minutes < 60) return `synced ${minutes} min ago`;
  if (minutes < 60 * 24) return `synced ${Math.round(minutes / 60)} h ago`;
  return `synced ${Math.round(minutes / (60 * 24))} d ago`;
};

/** The person's connected calendars: whether each still works, sync, reconnect, colour, disconnect, and connect another. */
export function AccountsSheet({ open, onOpenChange, accounts, loading, error, reload, onChanged }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [connect, setConnect] = useState<{ provider: CalendarProvider; email: string } | null | undefined>(undefined);
  const key = (a: CalendarAccount) => `${a.provider}:${a.id}`;

  const act = async (a: CalendarAccount, what: string, run: () => Promise<unknown>, done: string, changed = true) => {
    setBusy(`${key(a)}:${what}`);
    try {
      await run();
      toast.success(done);
      await reload();
      if (changed) onChanged?.();
    } catch (e) {
      toast.error(calendarErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const reconnect = async (a: CalendarAccount) => {
    if (!isConsentProvider(a.provider)) return setConnect({ provider: a.provider, email: a.email });
    try {
      window.open(await calendarAccountsApi.connectUrl(a.provider, a.email), "_blank", "noopener");
      window.addEventListener("focus", () => void reload(), { once: true });
    } catch (e) {
      toast.error(calendarErrorMessage(e));
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Connected calendars</SheetTitle>
            <SheetDescription>Events from these calendars show here, and meetings you create go on them.</SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            {loading && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div>}
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            {!loading && !error && accounts.length === 0 && (
              <p className="text-sm text-muted-foreground">No calendar is connected yet.</p>
            )}

            {accounts.map((a) => (
              <div key={key(a)} className="rounded-lg border p-3">
                <div className="flex items-start gap-3">
                  <input
                    type="color"
                    aria-label={`Colour of ${a.email}`}
                    value={a.color}
                    onChange={(e) => void act(a, "color", () => calendarAccountsApi.setColor(a, e.target.value), "Colour saved", false)}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.email}</p>
                    <p className="text-xs text-muted-foreground">{PROVIDER_LABELS[a.provider]} · {ago(a.last_synced_at)}</p>
                    {!a.connected && (
                      <p className="mt-1 flex items-start gap-1 text-xs text-destructive" title={a.last_error ?? undefined}>
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                        {a.status === "needs_reconnect" ? "The calendar no longer accepts this sign-in. Connect it again." : "Could not reach this calendar just now."}
                      </p>
                    )}
                  </div>
                  <Badge variant={a.connected ? "secondary" : "destructive"}>{a.connected ? "Connected" : "Needs attention"}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => void act(a, "sync", () => calendarAccountsApi.sync(a), "Sync started")}>
                    {busy === `${key(a)}:sync` ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-1 h-3 w-3" />}
                    Sync
                  </Button>
                  {!a.connected && <Button size="sm" onClick={() => void reconnect(a)}>Connect again</Button>}
                  <Button
                    size="sm" variant="ghost" className="text-destructive" disabled={busy !== null}
                    onClick={() => {
                      if (window.confirm(`Disconnect ${a.email}? Its events stop showing here.`)) {
                        void act(a, "remove", () => calendarAccountsApi.disconnect(a), "Calendar disconnected");
                      }
                    }}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />Disconnect
                  </Button>
                </div>
              </div>
            ))}

            <Button className="w-full" variant="outline" onClick={() => setConnect(null)}>
              <Plus className="mr-2 h-4 w-4" />Connect a calendar
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <ConnectAccountDialog
        open={connect !== undefined}
        onOpenChange={(o) => !o && setConnect(undefined)}
        initial={connect ?? null}
        onConnected={() => { void reload(); onChanged?.(); }}
      />
    </>
  );
}
