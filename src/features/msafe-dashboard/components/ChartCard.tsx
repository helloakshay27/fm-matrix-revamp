import type { CSSProperties, ReactNode } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Download } from 'lucide-react';
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
  /** Row data to export as an .xlsx sheet when the download button is clicked. */
  exportData?: Record<string, unknown>[];
  tag?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function downloadExcel(label: string, rows: Record<string, unknown>[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, label.slice(0, 31) || 'Sheet1');
  const filename = `${label.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'export'}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function ChartCard({
  title,
  sub,
  infoKey,
  children,
  chartSwitch,
  showPdf,
  pdfLabel,
  exportData,
  tag,
  className,
  style,
}: Props) {
  const { showToast } = useMsafeDashboard();

  const handleExport = () => {
    const label = pdfLabel || title;
    if (exportData && exportData.length > 0) {
      downloadExcel(label, exportData);
      showToast(`Excel downloaded · ${label}`);
    } else {
      showToast(`No data to export yet · ${label}`);
    }
  };

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
            <button type="button" className="chart-pdf-btn" title="Download Excel" onClick={handleExport}>
              <FileSpreadsheet size={14} />
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
