import { lazy, Suspense, type ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";

const PulseTicketForm = lazy(() => import("./AddTicketDashboard").then(m => ({ default: m.AddTicketDashboard })));

// Match Layout's Pulse tenant selection without changing other tenants' forms.
export function PulseTicketRoute({ fallback }: { fallback: ReactNode }) {
  const companyId = useAppSelector(state => state.project.selectedCompany?.id);
  const hostname = window.location.hostname;
  const isPulse = companyId === 305 || ["pulse.lockated.com", "pulse.gophygital.work", "pulse-uat.panchshil.com", "pulse.panchshil.com"].includes(hostname);
  return isPulse ? <Suspense fallback={<p className="p-6">Loading ticket form…</p>}><PulseTicketForm /></Suspense> : <>{fallback}</>;
}
