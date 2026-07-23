import { useEffect, useState } from "react";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import {
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
} from "@/components/ui/carousel";
import { fetchPulseAiAlerts, type PulseAiAlert, type AlertSeverity } from "@/services/pulseAiAlertsApi";
import type { PulseFilters } from "@/services/pulseDashboardApi";

const SEVERITY_META: Record<AlertSeverity, { label: string; icon: typeof ShieldAlert; color: string; bg: string }> = {
  critical: { label: "Critical", icon: ShieldAlert, color: "var(--color-error)", bg: "var(--color-error-bg)" },
  warning: { label: "Warning", icon: AlertTriangle, color: "#B8860B", bg: "var(--color-warning-light)" },
  info: { label: "Info", icon: Info, color: "var(--color-info)", bg: "rgba(107,155,204,.15)" },
};

interface Props { filters: PulseFilters }

export function PulseAiAlerts({ filters }: Props) {
  const [alerts, setAlerts] = useState<PulseAiAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPulseAiAlerts(filters)
      .then((res) => { if (!cancelled) setAlerts(res.alerts ?? []); })
      .catch((e) => { console.error(e); if (!cancelled) setAlerts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [filters]);

  if (loading || alerts.length === 0) return null;

  return (
    <div className="ps-alerts">
      <div className="ps-alerts-label">
        <ShieldAlert size={13} />
        AI Alerts
        <span className="ps-alerts-count">{alerts.length}</span>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="ps-alerts-carousel">
        <CarouselContent className="ps-alerts-content">
          {alerts.map((alert, i) => {
            const meta = SEVERITY_META[alert.severity] ?? SEVERITY_META.info;
            const Icon = meta.icon;
            return (
              <CarouselItem key={i} className="ps-alerts-item">
                <div className="ps-alert-card" style={{ borderLeftColor: meta.color }}>
                  <span className="ps-alert-badge" style={{ background: meta.color }}>
                    <Icon size={11} />
                    {meta.label}
                  </span>
                  <div className="ps-alert-title">{alert.title}</div>
                  <div className="ps-alert-message">{alert.message}</div>
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
