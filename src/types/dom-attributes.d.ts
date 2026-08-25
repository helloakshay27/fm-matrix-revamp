import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    /**
     * Custom attribute used on Revamp Dashboard grid-item wrapper divs to tag each widget
     * with the same "fm-" prefixed chart_code persisted server-side via /dashboard_layouts.
     */
    chart_code?: string;
  }
}
