import { useCallback, useEffect, useState } from "react";
import { Copy, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PROVIDER_LABELS, bookingLinksApi, calendarErrorMessage, type BookingLink, type CalendarAccount,
} from "@/api/calendarSync";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: CalendarAccount[];
}

const DEFAULT_DURATIONS = [15, 30, 45, 60];

/**
 * Share your availability: a link anyone can open to book a time on ONE of your connected calendars. A visitor needs no account
 * and may book without connecting anything; they are mailed the details and you host the meeting.
 */
export function BookingLinksDialog({ open, onOpenChange, accounts }: Props) {
  const [links, setLinks] = useState<BookingLink[]>([]);
  const [durations, setDurations] = useState<number[]>(DEFAULT_DURATIONS);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [label, setLabel] = useState("");
  const [duration, setDuration] = useState("30");
  const [account, setAccount] = useState(""); // "<provider>:<email>"

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [all, allowed] = await Promise.all([bookingLinksApi.list(), bookingLinksApi.durations().catch(() => DEFAULT_DURATIONS)]);
      setLinks(all.filter((l) => l.active));
      setDurations(allowed);
    } catch (e) {
      toast.error(calendarErrorMessage(e, "Your booking links could not be loaded."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  useEffect(() => {
    if (!account && accounts.length > 0) setAccount(`${accounts[0].provider}:${accounts[0].email}`);
  }, [accounts, account]);

  const create = async () => {
    const [provider, ...rest] = account.split(":");
    const email = rest.join(":");
    const chosen = accounts.find((a) => a.provider === provider && a.email === email);
    if (!chosen) return toast.error("Choose which calendar this link is for");

    setCreating(true);
    try {
      await bookingLinksApi.create({ label: label.trim() || "Meeting", duration_minutes: Number(duration), provider: chosen.provider, calendar_email: chosen.email });
      setLabel("");
      toast.success("Link created");
      await load();
    } catch (e) {
      toast.error(calendarErrorMessage(e));
    } finally {
      setCreating(false);
    }
  };

  const copy = async (link: BookingLink) => {
    try {
      await navigator.clipboard.writeText(link.share_url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy — select the link and copy it by hand");
    }
  };

  const revoke = async (link: BookingLink) => {
    if (!window.confirm("Revoke this link? Anyone who has it will no longer be able to book.")) return;
    try {
      await bookingLinksApi.revoke(link.id);
      toast.success("Link revoked");
      await load();
    } catch (e) {
      toast.error(calendarErrorMessage(e));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share your availability</DialogTitle>
          <DialogDescription>Anyone with a link can book a free time on the calendar it is for. They don't need an account.</DialogDescription>
        </DialogHeader>

        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Connect a calendar first — a link is always for one of them.</p>
        ) : (
          <div className="space-y-3 rounded-lg border p-3">
            <div className="space-y-2">
              <Label htmlFor="link-label">Name</Label>
              <Input id="link-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Intro call" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{durations.map((d) => <SelectItem key={d} value={String(d)}>{d} minutes</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Calendar</Label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => <SelectItem key={`${a.provider}:${a.id}`} value={`${a.provider}:${a.email}`}>{a.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => void create()} disabled={creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create link
            </Button>
          </div>
        )}

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {loading && <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>}
          {!loading && links.length === 0 && accounts.length > 0 && <p className="text-sm text-muted-foreground">No links yet.</p>}
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-2 rounded-lg border p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{link.label || "Meeting"}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {link.duration_minutes} min · {PROVIDER_LABELS[link.provider]} · {link.calendar_email}
                </p>
                <p className="truncate text-xs text-muted-foreground">{link.share_url}</p>
              </div>
              <Button size="icon" variant="outline" aria-label="Copy link" onClick={() => void copy(link)}><Copy className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" aria-label="Revoke link" className="text-destructive" onClick={() => void revoke(link)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
