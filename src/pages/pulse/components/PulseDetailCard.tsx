import type { ComponentProps } from "react";
import { DetailCard } from "@/components/ui/detail-card";

// Opt into the audit card treatment only from Pulse pages.
export function PulseDetailCard({ className = "", ...props }: ComponentProps<typeof DetailCard>) {
  return <DetailCard {...props} className={`pulse-detail-card ${className}`} />;
}
