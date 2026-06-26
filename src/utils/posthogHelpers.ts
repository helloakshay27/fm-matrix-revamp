import posthog from "posthog-js";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

/**
 * Fire a Helpdesk product-analytics event with standard platform/release context.
 * Use this for all custom events defined in the Helpdesk Product Analytics Catalogue.
 */
export const captureHelpdeskEvent = (
  event: string,
  props: Record<string, unknown> = {}
) => {
  posthog.capture(event, {
    platform: "web",
    release_version: RELEASE_VERSION,
    ...props,
  });
};
