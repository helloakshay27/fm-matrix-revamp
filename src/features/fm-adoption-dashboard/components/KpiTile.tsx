import type { ReactNode } from "react";

interface KpiTileProps {
  label: string;
  value: string;
  sublabel?: string;
  icon?: ReactNode;
  live?: boolean;
}

export function KpiTile({ label, value, sublabel, icon, live }: KpiTileProps) {
  return (
    <div className="rounded-lg border border-brand-border bg-brand-bg p-4">
      <div className="flex items-center justify-between">
        <span className="text-brand-body-5 font-medium text-brand-text-light">{label}</span>
        {icon}
        {live && (
          <span className="flex items-center gap-1 text-brand-body-5 font-medium text-brand-success">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-success" />
            live
          </span>
        )}
      </div>
      <div className="mt-1.5 text-brand-h2 font-semibold text-brand-text">{value}</div>
      {sublabel && <div className="mt-0.5 text-brand-body-5 text-brand-text-light">{sublabel}</div>}
    </div>
  );
}
