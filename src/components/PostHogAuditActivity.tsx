import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

interface PostHogAuditActivityProps {
  event:
    | "Audit Schedule List Viewed"
    | "Audit Conducted List Viewed"
    | "Audit Wizard Step Viewed"
    | "Add Question clicked"
    | "Add Section clicked"
    | "Save to Draft clicked"
    | "Master Checklist Import clicked"
    | "Download Sample Format clicked"
    | "Report opened"
    | "Audit Filter Applied"
    | "Audit Schedule Defined"
    | "Audit Started"
    | "Audit Completed"
    | "Master Checklist Created";
  properties?: Record<string, unknown>;
}

export function PostHogAuditActivity({ event, properties }: PostHogAuditActivityProps) {
  const posthog = usePostHog();
  useEffect(() => {
    if (posthog) {
      posthog.capture(event, properties);
    }
  }, [posthog, event, properties]);
  return null;
}
