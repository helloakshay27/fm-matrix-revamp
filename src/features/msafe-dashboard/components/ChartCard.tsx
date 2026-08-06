import type { CSSProperties, ReactNode } from 'react';
import { Download, FileText } from 'lucide-react';
import { InfoButton } from './InfoButton';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

type Props = {
  title: string;
  sub?: string;
  infoKey?: string;
  children: ReactNode;
  chartSwitch?: ReactNode;
  showPdf?: boolean;
  pdfLabel?: string;
  tag?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ChartCard({
  title,
  sub,
  infoKey,
  children,
  chartSwitch,
  showPdf,
  pdfLabel,
  tag,
  className,
  style,
}: Props) {
  const { showToast } = useMsafeDashboard();
  return (
    <div className={`card ${className || ''}`} style={style}>
      <div className="card-hd">
        <div>
          <div className="card-title">
            {title}
            {infoKey ? <InfoButton infoKey={infoKey} /> : null}
          </div>
          {sub ? <div className="card-sub">{sub}</div> : null}
        </div>
        <div className="card-actions-row">
          {chartSwitch}
          {tag}
          {showPdf ? (
            <button
              type="button"
              className="chart-pdf-btn"
              title="Download PDF"
              onClick={() => showToast(`PDF export started · ${pdfLabel || title}`)}
            >
              <FileText size={14} />
            </button>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}

export function AccordionShell({
  title,
  sub,
  excelLabel,
  children,
}: {
  title: string;
  sub: string;
  excelLabel: string;
  children: ReactNode;
}) {
  const { showToast } = useMsafeDashboard();
  return (
    <div className="accordion-panel open">
      <div className="acc-hd">
        <div>
          <div className="acc-title">{title}</div>
          <div className="acc-sub">{sub}</div>
        </div>
        <div className="acc-hd-actions">
          <button
            type="button"
            className="acc-dl-btn"
            onClick={() => showToast(`Excel export started · ${excelLabel}`)}
          >
            <Download size={14} />
            Excel
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
