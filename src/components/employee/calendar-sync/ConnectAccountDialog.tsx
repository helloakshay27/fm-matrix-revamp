import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PROVIDERS, PROVIDER_LABELS, calendarAccountsApi, calendarErrorMessage, isConsentProvider, type CalendarProvider,
} from "@/api/calendarSync";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Connecting again: the provider and address are already known. */
  initial?: { provider: CalendarProvider; email: string } | null;
  onConnected: () => void;
}

/**
 * Connect a calendar. Google and Outlook go through the provider's own consent screen, which brings the person back to Lockated
 * as themselves; Nextcloud and Zimbra are connected with a username and password, checked live before anything is saved.
 */
export function ConnectAccountDialog({ open, onOpenChange, initial, onConnected }: Props) {
  const [provider, setProvider] = useState<CalendarProvider>("google");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setProvider(initial?.provider ?? "google");
    setEmail(initial?.email ?? "");
    setUsername("");
    setSecret("");
    setServerUrl("");
    setWaiting(false);
  }, [open, initial]);

  const consent = isConsentProvider(provider);

  const submit = async () => {
    if (!email.trim()) return toast.error("Enter the calendar's email address");
    setBusy(true);
    try {
      if (isConsentProvider(provider)) {
        const url = await calendarAccountsApi.connectUrl(provider, email.trim());
        window.open(url, "_blank", "noopener");
        setWaiting(true);
        // The consent screen finishes in its own tab: this list is refreshed when the person comes back.
        window.addEventListener("focus", onConnected, { once: true });
      } else {
        if (!secret) return toast.error(provider === "nextcloud" ? "Enter an app password" : "Enter your password");
        const common = { email: email.trim(), username: username.trim() || email.trim(), server_url: serverUrl.trim() || undefined };
        if (provider === "nextcloud") await calendarAccountsApi.connectNextcloud({ ...common, app_password: secret });
        else await calendarAccountsApi.connectZimbra({ ...common, password: secret });
        toast.success(`${PROVIDER_LABELS[provider]} connected`);
        onConnected();
        onOpenChange(false);
      }
    } catch (e) {
      toast.error(calendarErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Connect again" : "Connect a calendar"}</DialogTitle>
          <DialogDescription>
            {consent
              ? `You'll sign in to ${PROVIDER_LABELS[provider]} in a new tab, then come back here.`
              : `Your ${PROVIDER_LABELS[provider]} credentials are checked now and kept encrypted.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Calendar</Label>
            <Select value={provider} onValueChange={(v) => setProvider(v as CalendarProvider)} disabled={!!initial}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => <SelectItem key={p} value={p}>{PROVIDER_LABELS[p]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cal-email">Email address</Label>
            <Input id="cal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" disabled={!!initial} />
          </div>

          {!consent && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cal-username">Username <span className="text-muted-foreground">(if not your email)</span></Label>
                <Input id="cal-username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cal-secret">{provider === "nextcloud" ? "App password" : "Password"}</Label>
                <Input id="cal-secret" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} autoComplete="new-password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cal-server">Server <span className="text-muted-foreground">(optional)</span></Label>
                <Input id="cal-server" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} placeholder="https://…" />
              </div>
            </>
          )}

          {waiting && (
            <p className="text-sm text-muted-foreground" role="status">
              Finish signing in in the new tab. When you come back, your calendars refresh by themselves.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>{waiting ? "Done" : "Cancel"}</Button>
          <Button onClick={() => void submit()} disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {consent ? "Continue" : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
