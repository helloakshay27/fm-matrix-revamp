import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

type TaskActivityEvent =
  | "Task List Viewed"
  | "Task View Switched"
  | "Task Filter Applied"
  | "Task Search Performed"
  | "Task List Exported"
  | "Task Detail Opened"
  | "Checklist Execution Started"
  | "Checklist Item Answered"
  | "Task Submitted (UI)"
  | "Task Rescheduled (UI)"
  | "Task Analytics Date Range Changed"
  | "Task Analytics Report Toggled"
  | "Task Columns Customised"
  // Business lifecycle events (Task & PPM catalogue) — curated, not UI-usage
  | "Checklist Started"
  | "Checklist Item Completed"
  | "Maintenance Task Submitted"
  | "Maintenance Task Assigned"
  | "Maintenance Task Rescheduled"
  | "Maintenance Task Reviewed";

interface PostHogTaskActivityProps {
  event: TaskActivityEvent;
  properties?: Record<string, unknown>;
}

export function PostHogTaskActivity({ event, properties }: PostHogTaskActivityProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture(event, properties);
    }
  }, [posthog, event, properties]);

  return null;
}
