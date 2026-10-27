import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { baseClient } from "@/utils/withoutTokenBase";
import { cn } from "@/lib/utils";

// Visual language pulled from the Figma "calendar" day-view spec:
// accent #e9704d, free-slot cell #fef5f2, hour-rail #f6f4ee, ink #2c2c2c.
// Adapted for a public booking page: slots are rendered one-per-bookable-
// duration (not one-per-hour like the reference) so a 15-min link doesn't
// collapse 4 bookable slots into a single hour row, and a horizontal date
// strip stands in for the reference's month-grid as the day picker.

interface Slot {
  start_time: string;
  end_time: string;
  available: boolean;
}

interface Day {
  date: string;
  slots: Slot[];
}

/** How a visitor can book. `guest` connects nothing: the host's calendar takes the meeting and the visitor is mailed. */
type BookingProvider = "guest" | "google" | "outlook" | "zimbra" | "nextcloud";

const PROVIDER_LABELS: Record<BookingProvider, string> = {
  guest: "Just book it — no calendar needed",
  google: "Add it to my Google Calendar",
  outlook: "Add it to my Outlook calendar",
  zimbra: "Add it to my Zimbra calendar",
  nextcloud: "Add it to my Nextcloud calendar",
};

interface AvailabilityResponse {
  owner_name: string;
  label: string;
  duration_minutes: number;
  /** The host's time zone, which working hours are in. */
  time_zone?: string;
  /** The ways to book this server offers; older servers send none and offer Google and Outlook. */
  providers?: BookingProvider[];
  guest_disclaimer?: string;
  days: Day[];
}

const FALLBACK_PROVIDERS: BookingProvider[] = ["google", "outlook"];

const formatSlotTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });

const formatDayHeading = (dateStr: string) =>
  new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const dayAbbrev = (dateStr: string) =>
  new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" });

const dayNumber = (dateStr: string) => new Date(`${dateStr}T00:00:00`).getDate();

export const BookingWebviewPage = () => {
  const { token } = useParams<{ token: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [provider, setProvider] = useState<BookingProvider>("google");
  const [guestConsent, setGuestConsent] = useState(false);
  const [calendarSecret, setCalendarSecret] = useState(""); // a Zimbra password / Nextcloud app password: used once, never kept
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await baseClient.get(`/public/booking_links/${token}`);
        setData(response.data);
        const offered: BookingProvider[] = response.data.providers?.length ? response.data.providers : FALLBACK_PROVIDERS;
        setProvider(offered.includes("guest") ? "guest" : offered[0]);
        const firstBookable = response.data.days.find((d: Day) => d.slots.some((s) => s.available));
        setActiveDate(firstBookable?.date ?? response.data.days[0]?.date ?? null);
      } catch (err) {
        console.error("Error fetching availability:", err);
        setError("This booking link is invalid or no longer active.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAvailability();
  }, [token]);

  const offeredProviders: BookingProvider[] = data?.providers?.length ? data.providers : FALLBACK_PROVIDERS;

  const activeDay = useMemo(
    () => data?.days.find((d) => d.date === activeDate) ?? null,
    [data, activeDate]
  );

  const handleBook = async () => {
    if (!selectedSlot) return;
    if (!bookerName.trim() || !bookerEmail.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    if (provider === "guest" && !guestConsent) {
      toast.error("Please accept the note about booking as a guest");
      return;
    }
    const needsSecret = provider === "zimbra" || provider === "nextcloud";
    if (needsSecret && !calendarSecret) {
      toast.error(provider === "zimbra" ? "Enter your Zimbra password" : "Enter your Nextcloud app password");
      return;
    }

    setSubmitting(true);
    try {
      const response = await baseClient.post(`/public/booking_links/${token}/bookings`, {
        booker_name: bookerName,
        booker_email: bookerEmail,
        provider,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        ...(provider === "guest" ? { guest_consent: true } : {}),
        ...(provider === "zimbra" ? { zimbra_password: calendarSecret } : {}),
        ...(provider === "nextcloud" ? { nextcloud_app_password: calendarSecret } : {}),
      });

      // Google / Outlook: leaving the SPA is expected — connect_url is a real OAuth consent redirect. Every other way of booking is
      // finished by now, so the visitor goes straight to the confirmation.
      window.location.href = response.data.connect_url ?? response.data.confirmation_url;
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.errors?.join(", ") ||
        "Could not book that slot. It may have just been taken — please pick another.";
      toast.error(message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#e9704d]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-gray-700">{error || "Something went wrong."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] py-8 px-4">
      <div className="max-w-xl mx-auto space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-[#2c2c2c]">{data.label}</h1>
          <p className="text-[#2c2c2c]/60">
            {data.duration_minutes} min with {data.owner_name}
          </p>
          {data.time_zone && (
            <p className="text-xs text-[#2c2c2c]/40">
              Times are shown in your time zone. {data.owner_name}'s calendar is in {data.time_zone.replace(/_/g, " ")}.
            </p>
          )}
        </div>

        {/* Date strip — stands in for the reference design's month-grid day picker */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {data.days
            .filter((d) => d.slots.some((s) => s.available))
            .map((day) => {
              const isActive = day.date === activeDate;
              return (
                <button
                  key={day.date}
                  onClick={() => {
                    setActiveDate(day.date);
                    setSelectedSlot(null);
                  }}
                  className={cn(
                    "shrink-0 flex flex-col items-center justify-center rounded-lg w-[52px] h-[52px] font-medium transition-colors",
                    isActive ? "bg-[#e9704d] text-[#f6f4ee]" : "bg-[#f6f4ee] text-[#2c2c2c]/70"
                  )}
                >
                  <span className="text-[11px] leading-none">{dayAbbrev(day.date)}</span>
                  <span className="text-base leading-none mt-1">{dayNumber(day.date)}</span>
                </button>
              );
            })}
        </div>

        {/* Hour-row list for the selected day */}
        {activeDay && (
          <Card className="rounded-2xl shadow-[0px_1px_6px_0px_rgba(0,0,0,0.07)] border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-[#2c2c2c] mb-3">
                {formatDayHeading(activeDay.date)}
              </p>
              <div className="space-y-2">
                {activeDay.slots.map((slot) => {
                  const isSelected = selectedSlot?.start_time === slot.start_time;
                  return (
                    <div key={slot.start_time} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-xs font-medium text-[#2c2c2c] bg-[#f6f4ee] rounded-md py-2 text-center">
                        {formatSlotTime(slot.start_time)}
                      </span>
                      <button
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "flex-1 h-[42px] rounded-lg text-sm text-left px-3 flex items-center transition-colors",
                          !slot.available &&
                            "bg-[#cdcbfa] blur-[2px] opacity-70 cursor-not-allowed select-none",
                          slot.available && isSelected && "bg-[#e9704d] text-white font-medium",
                          slot.available &&
                            !isSelected &&
                            "bg-[#fef5f2] text-[#2c2c2c]/50 hover:bg-[#fde3db] cursor-pointer"
                        )}
                      >
                        {!slot.available ? "Busy" : isSelected ? "Selected" : "Available"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedSlot && (
          <Card className="rounded-2xl shadow-[0px_1px_6px_0px_rgba(0,0,0,0.07)] border border-[#e9704d]">
            <CardContent className="p-4 space-y-4">
              <p className="text-sm font-medium text-[#2c2c2c]">
                Confirm {activeDay && formatDayHeading(activeDay.date)} at{" "}
                {formatSlotTime(selectedSlot.start_time)}
              </p>
              <div className="space-y-2">
                <Label htmlFor="booker_name">Your name</Label>
                <Input
                  id="booker_name"
                  value={bookerName}
                  onChange={(e) => setBookerName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booker_email">Your email</Label>
                <Input
                  id="booker_email"
                  type="email"
                  value={bookerEmail}
                  onChange={(e) => setBookerEmail(e.target.value)}
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>How would you like to book?</Label>
                <RadioGroup
                  value={provider}
                  onValueChange={(v) => setProvider(v as BookingProvider)}
                  className="flex flex-col gap-2"
                >
                  {offeredProviders.map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <RadioGroupItem value={p} id={`provider_${p}`} />
                      <Label htmlFor={`provider_${p}`} className="font-normal">{PROVIDER_LABELS[p]}</Label>
                    </div>
                  ))}
                </RadioGroup>

                {provider === "guest" ? (
                  <div className="flex items-start gap-2 pt-1">
                    <Checkbox id="guest_consent" checked={guestConsent} onCheckedChange={(v) => setGuestConsent(v === true)} />
                    <Label htmlFor="guest_consent" className="text-xs font-normal leading-snug text-[#2c2c2c]/60">
                      {data.guest_disclaimer ??
                        `You're booking as a guest. ${data.owner_name} will host the meeting and send you the invite by email. We use your name and email only to arrange it.`}
                    </Label>
                  </div>
                ) : provider === "zimbra" || provider === "nextcloud" ? (
                  <div className="space-y-2 pt-1">
                    <Input
                      type="password"
                      value={calendarSecret}
                      onChange={(e) => setCalendarSecret(e.target.value)}
                      placeholder={provider === "zimbra" ? "Your Zimbra password" : "Your Nextcloud app password"}
                      autoComplete="new-password"
                    />
                    <p className="text-xs text-[#2c2c2c]/50">
                      Used once to put the meeting on your calendar, with {data.owner_name} as a guest. It is not kept.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#2c2c2c]/50">
                    You'll be asked to briefly sign in so the invite can be created on your own calendar,
                    with {data.owner_name} added as a guest. Nothing of your calendar is kept.
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setSelectedSlot(null)} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleBook}
                  disabled={submitting}
                  className="bg-[#e9704d] hover:bg-[#d35f3d] text-white"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  {provider === "google" || provider === "outlook" ? "Confirm & connect calendar" : "Confirm booking"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
