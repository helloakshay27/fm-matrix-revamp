import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

interface PostHogTicketActivityProps {
  event: "Ticket Create Form Opened" | "ticket creation successful" | "ticket abandoned";
  properties?: Record<string, unknown>;
}

export function PostHogTicketActivity({ event, properties }: PostHogTicketActivityProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture(event, properties);
    }
  }, [posthog, event, properties]);

  return null;
}
