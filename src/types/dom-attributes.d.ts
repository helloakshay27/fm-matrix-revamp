import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    /**
     * Custom attribute used on Revamp Dashboard grid-item wrapper divs to tag each widget
     * with the same stable identifier persisted server-side by the DashboardLayout model.
     */
    chart_id?: string;
  }
}
