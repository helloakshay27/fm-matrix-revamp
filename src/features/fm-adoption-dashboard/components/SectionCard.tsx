import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, action, children, className = "" }: SectionCardProps) {
  return (
    <section className={`rounded-lg border border-brand-border bg-brand-card-white p-5 shadow-brand-card ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-brand-body-3 font-semibold text-brand-text">{title}</h2>
          {subtitle && <p className="mt-0.5 text-brand-body-5 text-brand-text-light">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
