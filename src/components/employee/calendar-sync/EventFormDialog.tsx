import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { calendarErrorMessage, calendarEventsApi, type CalendarAccount } from "@/api/calendarSync";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: CalendarAccount[];
  onSaved: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const nextHour = (extra = 0) => { const d = new Date(); return `${pad((d.getHours() + 1 + extra) % 24)}:00`; };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A meeting on one of the connected calendars, with guests invited by email. */
export function EventFormDialog({ open, onOpenChange, accounts, onSaved }: Props) {
  const [account, setAccount] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today());
  const [start, setStart] = useState(nextHour());
  const [end, setEnd] = useState(nextHour(1));
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [guests, setGuests] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAccount(accounts[0]?.email ?? "");
    setTitle(""); setDate(today()); setStart(nextHour()); setEnd(nextHour(1));
    setAllDay(false); setLocation(""); setDescription(""); setGuests("");
  }, [open, accounts]);

  const save = async () => {
    if (!account) return toast.error("Choose a calendar");
    if (!title.trim()) return toast.error("Give the meeting a title");

    const attendees = guests.split(/[,;\s]+/).map((g) => g.trim()).filter(Boolean);
    const bad = attendees.find((g) => !EMAIL.test(g));
    if (bad) return toast.error(`"${bad}" is not an email address`);

    const from = allDay ? new Date(`${date}T00:00:00`) : new Date(`${date}T${start}`);
    const to = allDay ? new Date(`${date}T23:59:59`) : new Date(`${date}T${end}`);
    if (!(to > from)) return toast.error("The meeting has to end after it starts");

    setSaving(true);
    try {
      await calendarEventsApi.create({
        calendar_email: account, title: title.trim(), description: description.trim() || undefined, location: location.trim() || undefined,
        start_time: from.toISOString(), end_time: to.toISOString(), all_day: allDay, attendees,
      });
      toast.success("Meeting added");
      onSaved();
      onOpenChange(false);
    } catch (e) {
      toast.error(calendarErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New meeting</DialogTitle>
          <DialogDescription>It goes on the calendar you choose, and your guests are invited by email.</DialogDescription>
        </DialogHeader>

        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Connect a calendar first — a meeting is always put on one of them.</p>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="ev-title">Title</Label>
              <Input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </div>
            <div className="space-y-2">
              <Label>Calendar</Label>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{accounts.map((a) => <SelectItem key={`${a.provider}:${a.id}`} value={a.email}>{a.email}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="ev-allday" checked={allDay} onCheckedChange={setAllDay} />
              <Label htmlFor="ev-allday">All day</Label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ev-date">Date</Label>
                <Input id="ev-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              {!allDay && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ev-start">From</Label>
                    <Input id="ev-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ev-end">To</Label>
                    <Input id="ev-end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
                  </div>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-guests">Guests <span className="text-muted-foreground">(emails, separated by commas)</span></Label>
              <Input id="ev-guests" value={guests} onChange={(e) => setGuests(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-location">Location</Label>
              <Input id="ev-location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-desc">Description</Label>
              <Textarea id="ev-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          {accounts.length > 0 && (
            <Button onClick={() => void save()} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add meeting
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
