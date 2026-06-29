import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

type ScheduleActivityEvent =
  | "Schedule List Viewed"
  | "Schedule Import Opened"
  | "Schedule Create Started"
  | "Schedule Form Block Completed"
  | "Schedule Saved"
  | "Schedule Create Abandoned"
  | "Schedule Detail Viewed";

interface PostHogScheduleActivityProps {
  event: ScheduleActivityEvent;
  properties?: Record<string, unknown>;
}

export function PostHogScheduleActivity({ event, properties }: PostHogScheduleActivityProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture(event, properties);
    }
  }, [posthog]);

  return null;
}
