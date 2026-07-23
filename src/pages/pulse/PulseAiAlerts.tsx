import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Info, RefreshCw, ShieldAlert } from "lucide-react";
import {
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
} from "@/components/ui/carousel";
import { fetchPulseAiAlerts, type PulseAiAlert, type AlertSeverity } from "@/services/pulseAiAlertsApi";
import type { PulseFilters } from "@/services/pulseDashboardApi";

const SEVERITY_META: Record<AlertSeverity, { label: string; icon: typeof ShieldAlert; color: string }> = {
  critical: { label: "Critical", icon: ShieldAlert, color: "var(--color-error)" },
  warning: { label: "Warning", icon: AlertTriangle, color: "#B8860B" },
  info: { label: "Info", icon: Info, color: "var(--color-info)" },
};

interface Props { filters: PulseFilters }

export function PulseAiAlerts({ filters }: Props) {
  const [alerts, setAlerts] = useState<PulseAiAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    return fetchPulseAiAlerts(filters)
      .then((res) => setAlerts(res.alerts ?? []))
      .catch((e) => { console.error(e); setAlerts([]); })
      .finally(() => { if (isRefresh) setRefreshing(false); else setLoading(false); });
  }, [filters]);

  useEffect(() => {
    load(false);
  }, [load]);

  if (loading || alerts.length === 0) return null;

  return (
    <div className="ps-alerts">
      <div className="ps-alerts-header">
        <div>
          <div className="ps-alerts-title">Alerts</div>
          <div className="ps-alerts-subtitle">
            {alerts.length} finding{alerts.length === 1 ? "" : "s"} for the current filters
          </div>
        </div>
        <button
          type="button"
          className="ps-alerts-refresh"
          disabled={refreshing}
          onClick={() => load(true)}
        >
          <RefreshCw size={12} className={refreshing ? "ps-alerts-refresh-spin" : undefined} />
          Refresh
        </button>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="ps-alerts-carousel">
        <CarouselContent className="ps-alerts-content">
          {alerts.map((alert, i) => {
            const meta = SEVERITY_META[alert.severity] ?? SEVERITY_META.info;
            const Icon = meta.icon;
            return (
              <CarouselItem key={i} className="ps-alerts-item">
                <div className="ps-alert-card" style={{ borderLeftColor: meta.color }}>
                  <div className="ps-alert-severity" style={{ color: meta.color }}>
                    <Icon size={13} />
                    {meta.label}
                  </div>
                  <div className="ps-alert-title">{alert.title}</div>
                  <div className="ps-alert-message">{alert.message}</div>
                  {alert.action && (
                    <div className="ps-alert-action">
                      <span className="ps-alert-next">Next</span>
                      {alert.action}
                    </div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="ps-alerts-nav ps-alerts-prev" />
        <CarouselNext className="ps-alerts-nav ps-alerts-next" />
      </Carousel>
    </div>
  );
}
