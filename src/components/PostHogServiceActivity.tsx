import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

type ServiceActivityEvent = "Soft Service List Viewed";

interface PostHogServiceActivityProps {
  event: ServiceActivityEvent;
  properties?: Record<string, unknown>;
}

export function PostHogServiceActivity({ event, properties }: PostHogServiceActivityProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture(event, properties);
    }
  }, [posthog, event, properties]);

  return null;
}
