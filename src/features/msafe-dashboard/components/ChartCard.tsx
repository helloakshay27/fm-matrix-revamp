import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import { InfoButton } from './InfoButton';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';
import type { Persona } from '../data/constants';

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
  /** When set, the download button hits `msafe_dashboard_report/report_template?export_for=<reportExportFor>`
   *  for a server-generated Excel report (carrying the current circle/function/zone/employee-type/date-range
   *  filters) instead of exporting `exportData` client-side — and switches to the same Download/loader icon
   *  used on the KPI overview cards. */
  reportExportFor?: string;
  /** Drop from_date/to_date from the report request — for cards whose chart is a fixed
   *  trailing window (e.g. "Last 12 Months") that the applied date-range filter doesn't clip. */
  reportExcludeDateRange?: boolean;
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

function getMsafeBaseUrl(): string {
  const fromLS = localStorage.getItem('baseUrl') || '';
  const host = fromLS.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host ? `https://${host}` : 'https://live-api.gophygital.work';
}

function buildFilterParams(persona: Persona, f: AppliedFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (f.circleIds.length > 0) params.circle_id = f.circleIds.join(',');
  if (f.functionIds.length > 0) params.function_id = f.functionIds.join(',');
  if (f.zoneId) params.zone_id = f.zoneId;
  if (f.empTypeId) params.employee_type = f.empTypeId;
  if (f.startDate) params.from_date = f.startDate;
  if (f.endDate) params.to_date = f.endDate;
  return params;
}

async function downloadReportTemplate(
  exportFor: string,
  filenameLabel: string,
  persona: Persona,
  appliedFilters: AppliedFilters,
  excludeDateRange?: boolean,
): Promise<void> {
  const token = localStorage.getItem('token') || '';
  const companyId =
    localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '145';
  const filterParams = buildFilterParams(persona, appliedFilters);
  if (excludeDateRange) {
    delete filterParams.from_date;
    delete filterParams.to_date;
  }
  const params = new URLSearchParams({
    company_id: companyId,
    export_for: exportFor,
    ...filterParams,
  });
  if (token) {
    params.set('access_token', token);
    params.set('token', token);
  }
  const url = `${getMsafeBaseUrl()}/msafe_dashboard_report/report_template?${params.toString()}`;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();

  const filename = `${filenameLabel.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'report'}.xlsx`;
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
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
  reportExportFor,
  reportExcludeDateRange,
  tag,
  className,
  style,
}: Props) {
  const { showToast, persona, appliedFilters } = useMsafeDashboard();
  const [exportingReport, setExportingReport] = useState(false);

  const handleExport = async () => {
    const label = pdfLabel || title;

    if (reportExportFor) {
      setExportingReport(true);
      try {
        await downloadReportTemplate(reportExportFor, label, persona, appliedFilters, reportExcludeDateRange);
        showToast(`Excel downloaded · ${label}`);
      } catch (err) {
        console.warn(`Failed to download report for "${reportExportFor}".`, err);
        showToast(`Export failed · ${label}`);
      } finally {
        setExportingReport(false);
      }
      return;
    }

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
            <button
              type="button"
              className="chart-pdf-btn"
              title="Download Excel"
              disabled={exportingReport}
              onClick={handleExport}
            >
              {reportExportFor ? (
                exportingReport ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />
              ) : (
                <FileSpreadsheet size={14} />
              )}
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
  children,
}: {
  title: string;
  sub: string;
  // No longer rendered — the section-level "Excel" export button was removed
  // from every section (see AccordionShell below). Kept optional so existing
  // callers don't need to drop the prop.
  excelLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="accordion-panel open">
      <div className="acc-hd">
        <div>
          <div className="acc-title">{title}</div>
          <div className="acc-sub">{sub}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
