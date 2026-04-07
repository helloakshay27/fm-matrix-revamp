import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { 
  FileText, FolderOpen, CheckCircle, Clock, Calendar,
  ClipboardList, PauseCircle, AlertCircle, XCircle,
  Download, Loader2, ChevronDown, X, Search, Eye,
  RefreshCw, MessageSquare, BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import DashboardChart from '@/components/charts/DashboardChart'; 
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ─────────────────────────────────────────────────────────
// ── INTERFACES & HELPERS ──
// ─────────────────────────────────────────────────────────
interface ProjectDropdownItem { id: number; title: string; }

interface KpiData {
  milestones: { total: number; open: number; completed: number; in_progress: number };
  tasks: { total: number; open: number; in_progress: number; completed: number; on_hold: number; overdue: number; aborted: number };
  issues: { total: number; open: number; in_progress: number; on_hold: number; completed: number; closed: number; reopened: number };
}

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(2).replace(/\.?0+$/, '')}k` : String(n));

const getMax = (data: Record<string, unknown>[], keys: string[]) => {
  let max = 0;
  data.forEach((d) => keys.forEach((k) => { if (typeof d[k] === 'number' && (d[k] as number) > max) max = d[k] as number; }));
  return Math.max(Math.ceil(max * 1.2), 10);
};

// ── KPI Card Component ──
const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="relative bg-[#F6F4EE] border border-gray-100 p-5 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 cursor-pointer min-h-[88px]">
    <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-[#1A1A1A]">{title}</div>
    </div>
  </div>
);

// ── Section Header Component ──
const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-4 mt-2">
    {icon || <BarChart3 className="w-5 h-5 text-[#A0856C]" />}
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
  </div>
);


// ─────────────────────────────────────────────────────────
// ── REPORT ANALYTICS MODAL CONFIGS ──
// ─────────────────────────────────────────────────────────
interface ReportProjectInfo { id: number; title: string; start_date: string; end_date: string; completion_percentage: number; balance: number; }
interface ReportMilestoneSummary { average_completion: number; balance: number; }
interface ReportMilestoneItem { id: number; code: string | null; title: string; status: string; completion_percentage: number; balance: number; }
interface ReportTaskSummary { average_completion: number; balance: number; }
interface ReportTaskItem { id: number; title: string; description: string; status: string; priority: string; related_to_milestone: string; responsible_person: string; completion_percentage: number; balance: number; }
interface ReportIssueItem { id: number; title: string; description: string; priority: string; name: string; related_to_milestone: string; related_to_task: string; responsible_person: string; }
interface ReportPriorityBreakdown { priority: string; task_count: number; issue_count: number; }

const MILESTONE_COLORS = ['#AF8260', '#E5E7EB'];
const TASK_COLORS      = ['#AF8260', '#E5E7EB'];

const RA_MILESTONE_ACTIVITY_COLUMNS = [
  { key: 'title', label: 'Milestone', sortable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { key: 'completion_percentage', label: '% Completed', sortable: true, defaultVisible: true },
  { key: 'balance', label: '% Balance', sortable: true, defaultVisible: true },
];
const RA_ACTIVITY_COMPLETION_COLUMNS = [
  { key: 'title', label: 'Task', sortable: true, defaultVisible: true },
  { key: 'progress', label: '% Completion', sortable: true, defaultVisible: true },
];
const RA_TASK_DETAILS_COLUMNS = [
  { key: 'title', label: 'Task', sortable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { key: 'priority', label: 'Priority', sortable: true, defaultVisible: true },
  { key: 'related_to_milestone', label: 'Milestone', sortable: true, defaultVisible: true },
  { key: 'responsible_person', label: 'Responsible Person', sortable: true, defaultVisible: true },
  { key: 'completion_percentage', label: '% Completed', sortable: true, defaultVisible: true },
  { key: 'balance', label: '% Balance', sortable: true, defaultVisible: true },
];
const RA_ISSUE_DETAILS_COLUMNS = [
  { key: 'title', label: 'Title', sortable: true, defaultVisible: true },
  { key: 'description', label: 'Description', sortable: true, defaultVisible: true },
  { key: 'priority', label: 'Priority', sortable: true, defaultVisible: true },
  { key: 'related_to_milestone', label: 'Milestone', sortable: true, defaultVisible: true },
  { key: 'related_to_task', label: 'Task', sortable: true, defaultVisible: true },
  { key: 'responsible_person', label: 'Responsible Person', sortable: true, defaultVisible: true },
];

const RA_STATUS_STYLES: Record<string, string> = {
  'open': 'bg-red-100 text-red-700', 'Open': 'bg-red-100 text-red-700',
  'in_progress': 'bg-yellow-100 text-yellow-700', 'In Progress': 'bg-yellow-100 text-yellow-700',
  'completed': 'bg-green-100 text-green-700', 'Resolved': 'bg-green-100 text-green-700',
  'closed': 'bg-gray-100 text-gray-600',
};
const RA_PRIORITY_STYLES: Record<string, string> = {
  'Low': 'bg-blue-100 text-blue-700', 'Medium': 'bg-yellow-100 text-yellow-700',
  'High': 'bg-orange-100 text-orange-700', 'Urgent': 'bg-red-100 text-red-700',
};

const raRenderProgress = (value: number | null) => {
  if (value === null || value === undefined) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full" style={{ width: `${Math.min(value, 100)}%`, background: '#AF8260' }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{value}%</span>
    </div>
  );
};

const raFormatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  try { return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return dateStr; }
};

const raStatusBadgeStyle = (s: string): React.CSSProperties => ({
  display: 'inline-block', padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
  background: (s?.includes('completed') || s?.includes('Resolved')) ? '#d1fae5' : s?.includes('progress') ? '#fef9c3' : (s?.includes('open') || s?.includes('Open')) ? '#fee2e2' : '#f3f4f6',
  color: (s?.includes('completed') || s?.includes('Resolved')) ? '#065f46' : s?.includes('progress') ? '#92400e' : (s?.includes('open') || s?.includes('Open')) ? '#991b1b' : '#374151',
});
const raPriorityBadgeStyle = (p: string): React.CSSProperties => ({
  display: 'inline-block', padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
  background: p === 'Urgent' ? '#fee2e2' : p === 'High' ? '#ffedd5' : p === 'Medium' ? '#fef9c3' : '#dbeafe',
  color: p === 'Urgent' ? '#991b1b' : p === 'High' ? '#9a3412' : p === 'Medium' ? '#92400e' : '#1e40af',
});

const renderOutsideLabel = ({ cx, cy, midAngle, outerRadius, percent }: { cx: number; cy: number; midAngle: number; outerRadius: number; percent: number }) => {
  const RADIAN = Math.PI / 180;
  const pct = Math.round(percent * 100);
  if (pct < 1) return null;
  const sin = Math.sin(-midAngle * RADIAN); const cos = Math.cos(-midAngle * RADIAN);
  const sx = cx + (outerRadius + 6) * cos; const sy = cy + (outerRadius + 6) * sin;
  const mx = cx + (outerRadius + 20) * cos; const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 12 : -12); const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#9ca3af" strokeWidth={1} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill="#9ca3af" />
      <text x={ex + (cos >= 0 ? 4 : -4)} y={ey} textAnchor={textAnchor} dominantBaseline="central" fill="#374151" fontSize={12} fontWeight={600}>{pct}%</text>
    </g>
  );
};

const RAChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-100 transition-shadow duration-300 hover:shadow-lg p-5 h-full flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
    </div>
    <div className="flex-1 w-full overflow-hidden">{children}</div>
  </div>
);

const RADonutCard: React.FC<{ title: string; data: { name: string; value: number }[]; colors: string[]; loading?: boolean }> = ({ title, data, colors, loading }) => (
  <RAChartCard title={title}>
    <div className="flex flex-col items-center justify-center h-full">
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : (
        <>
          <div className="w-full px-6">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
                <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value" labelLine={false} label={renderOutsideLabel}>
                  {data.map((_, i) => (<Cell key={i} fill={colors[i % colors.length]} />))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: colors[i % colors.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </RAChartCard>
);

const RAPdfTable: React.FC<{
  title: string; columns: { key: string; label: string }[]; rows: Record<string, unknown>[];
  renderCell?: (row: Record<string, unknown>, key: string) => React.ReactNode;
}> = ({ title, columns, rows, renderCell }) => (
  <div style={{ marginBottom: 32, background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: 20 }}>
    <div style={{ fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 12 }}>{title}</div>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead><tr style={{ background: '#f9fafb' }}>
        {columns.map((col) => (<th key={col.key} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>{col.label}</th>))}
      </tr></thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
            {columns.map((col) => (<td key={col.key} style={{ padding: '8px 12px', color: '#374151', verticalAlign: 'top' }}>{renderCell ? renderCell(row, col.key) : String(row[col.key] ?? '—')}</td>))}
          </tr>
        ))}
        {rows.length === 0 && (<tr><td colSpan={columns.length} style={{ padding: 16, textAlign: 'center', color: '#9ca3af' }}>No data</td></tr>)}
      </tbody>
    </table>
  </div>
);

const RAPdfDonut: React.FC<{ title: string; data: { name: string; value: number }[]; colors: string[] }> = ({ title, data, colors }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = 100; const cy = 100; const R = 72; const r = 44;
  let startAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(startAngle); const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(startAngle + angle); const y2 = cy + R * Math.sin(startAngle + angle);
    const ix1 = cx + r * Math.cos(startAngle); const iy1 = cy + r * Math.sin(startAngle);
    const ix2 = cx + r * Math.cos(startAngle + angle); const iy2 = cy + r * Math.sin(startAngle + angle);
    const large = angle > Math.PI ? 1 : 0;
    const mid = startAngle + angle / 2;
    const lx = cx + (R + 20) * Math.cos(mid); const ly = cy + (R + 20) * Math.sin(mid);
    const path = `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${r},${r} 0 ${large},0 ${ix1},${iy1} Z`;
    startAngle += angle;
    return { path, color: colors[i % colors.length], name: d.name, value: d.value, lx, ly, pct: Math.round((d.value / total) * 100) };
  });
  return (
    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: 20 }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <svg viewBox="0 0 200 200" width={200} height={200}>
          {slices.map((s, i) => (<g key={i}><path d={s.path} fill={s.color} />{s.pct >= 3 && (<text x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="central" fill="#374151" fontSize={11} fontWeight={600}>{s.pct}%</text>)}</g>))}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slices.map((s) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color, display: 'inline-block', flexShrink: 0 }} />
              {s.name}: <strong style={{ marginLeft: 4 }}>{s.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────
// ── MAIN COMPONENT ──
// ─────────────────────────────────────────────────────────
const DashboardUI: React.FC = () => {
  // Project dropdown (multi-select)
  const [projectsList, setProjectsList] = useState<ProjectDropdownItem[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(['269']);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const projectId = selectedProjectIds.join(',');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setProjectSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-select helpers
  const toggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };
  const removeProject = (id: string) => {
    setSelectedProjectIds((prev) => prev.filter((p) => p !== id));
  };
  const filteredProjects = projectsList.filter((p) =>
    p.title.toLowerCase().includes(projectSearch.toLowerCase())
  );

  // API data
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [projectCompletionData, setProjectCompletionData] = useState<{ name: string; completion_rate: number }[]>([]);
  const [milestoneCompletionData, setMilestoneCompletionData] = useState<{ name: string; completion_rate: number }[]>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<{ name: string; completion_rate: number }[]>([]);
  const [assigneeMilestoneData, setAssigneeMilestoneData] = useState<{ name: string; open: number; completed: number; in_progress: number }[]>([]);
  const [assigneeTaskData, setAssigneeTaskData] = useState<{ name: string; open: number; in_progress: number; completed: number; on_hold: number; overdue: number; aborted: number }[]>([]);
  const [assigneeIssueData, setAssigneeIssueData] = useState<{ name: string; open: number; in_progress: number; on_hold: number; completed: number; closed: number; reopened: number }[]>([]);
  const [taskDependenciesData, setTaskDependenciesData] = useState<{ name: string; blocking: number; blocked_by: number; related: number }[]>([]);
  const [issueBreakdownData, setIssueBreakdownData] = useState<{ name: string; open: number; in_progress: number; completed: number; closed: number }[]>([]);

  // ── Report Analytics Modal state ──
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportDownloading, setReportDownloading] = useState(false);
  const [reportProjectId, setReportProjectId] = useState<string>('');
  const [reportProject, setReportProject] = useState<ReportProjectInfo | null>(null);
  const [reportMilestoneSummary, setReportMilestoneSummary] = useState<ReportMilestoneSummary | null>(null);
  const [reportMilestones, setReportMilestones] = useState<ReportMilestoneItem[]>([]);
  const [reportTaskSummary, setReportTaskSummary] = useState<ReportTaskSummary | null>(null);
  const [reportTasks, setReportTasks] = useState<ReportTaskItem[]>([]);
  const [reportIssues, setReportIssues] = useState<ReportIssueItem[]>([]);
  const [reportPriorities, setReportPriorities] = useState<ReportPriorityBreakdown[]>([]);
  const reportPdfRef = useRef<HTMLDivElement>(null);

  // Derived report chart data
  const raMilestoneChart = reportMilestoneSummary
    ? [{ name: 'Completed', value: Number(reportMilestoneSummary.average_completion.toFixed(1)) }, { name: 'Balance', value: Number(reportMilestoneSummary.balance.toFixed(1)) }]
    : [{ name: 'Completed', value: 0 }, { name: 'Balance', value: 100 }];
  const raTaskChart = reportTaskSummary
    ? [{ name: 'Completed', value: Number(reportTaskSummary.average_completion.toFixed(1)) }, { name: 'Balance', value: Number(reportTaskSummary.balance.toFixed(1)) }]
    : [{ name: 'Completed', value: 0 }, { name: 'Balance', value: 100 }];
  const raMilestoneTableData = reportMilestones.map((m) => ({ id: String(m.id), title: m.title, status: m.status, completion_percentage: `${m.completion_percentage}%`, balance: `${m.balance}%` }));
  const raActivityTableData = reportTasks.map((t) => ({ id: String(t.id), title: t.title, progress: t.completion_percentage }));
  const raTaskDetailsData = reportTasks.map((t) => ({ id: String(t.id), title: t.title, status: t.status, priority: t.priority, related_to_milestone: t.related_to_milestone, responsible_person: t.responsible_person, completion_percentage: `${t.completion_percentage}%`, balance: `${t.balance}%` }));
  const raIssueDetailsData = reportIssues.map((iss) => ({ id: String(iss.id), title: iss.title, description: iss.description?.replace(/<[^>]*>/g, '') || '—', priority: iss.priority, related_to_milestone: iss.related_to_milestone, related_to_task: iss.related_to_task, responsible_person: iss.responsible_person }));

  // Open report modal
  const openReportModal = () => {
    const initialId = selectedProjectIds.length > 0 ? selectedProjectIds[0] : '269';
    setReportProjectId(initialId);
    setReportOpen(true);
  };

  // Fetch report data when reportProjectId changes
  const fetchReportData = useCallback(async (pid: string) => {
    if (!pid) return;
    setReportLoading(true);
    try {
      const headers = { Authorization: getAuthHeader(), 'Content-Type': 'application/json' };
      const [msRes, tsRes, isRes, pbRes] = await Promise.all([
        fetch(getFullUrl(`/patm_report/project_milestones_summary.json?project_id=${pid}`), { headers }),
        fetch(getFullUrl(`/patm_report/project_task_summary.json?project_id=${pid}`), { headers }),
        fetch(getFullUrl(`/patm_report/project_issue_summary.json?project_id=${pid}`), { headers }),
        fetch(getFullUrl(`/patm_report/project_priority_breakdown.json?project_id=${pid}`), { headers }),
      ]);
      const [msJson, tsJson, isJson, pbJson] = await Promise.all([msRes.json(), tsRes.json(), isRes.json(), pbRes.json()]);
      if (msJson.success && msJson.data?.[0]) { const d = msJson.data[0]; setReportProject(d.project || null); setReportMilestoneSummary(d.milestone_summary || null); setReportMilestones(d.milestones || []); }
      if (tsJson.success && tsJson.data?.[0]) { const d = tsJson.data[0]; setReportTaskSummary(d.task_summary || null); setReportTasks(d.tasks || []); }
      if (isJson.success && isJson.data?.[0]) setReportIssues(isJson.data[0].issues || []);
      if (pbJson.success && pbJson.data?.[0]) setReportPriorities(pbJson.data[0].priorities || []);
    } catch (err) { console.error('Error fetching report data:', err); }
    finally { setReportLoading(false); }
  }, []);

  useEffect(() => { if (reportOpen && reportProjectId) fetchReportData(reportProjectId); }, [reportOpen, reportProjectId, fetchReportData]);

  // PDF download from modal
  const handleReportPdfDownload = async () => {
    const el = reportPdfRef.current;
    if (!el) return;
    setReportDownloading(true);
    try {
      el.style.display = 'block'; el.style.position = 'fixed'; el.style.top = '-99999px';
      el.style.left = '0px'; el.style.width = '1200px'; el.style.zIndex = '-9999'; el.style.opacity = '1';
      await new Promise((r) => setTimeout(r, 700));
      const canvas = await (html2canvas as any)(el, { scale: 2, useCORS: true, allowTaint: true, logging: false, backgroundColor: '#f9fafb', width: el.scrollWidth, height: el.scrollHeight, windowWidth: 1200, windowHeight: el.scrollHeight });
      el.style.display = 'none';
      const imgData = canvas.toDataURL('image/png');
      const A4_W = 794; const A4_H = 1123;
      const imgW = canvas.width / 2; const imgH = canvas.height / 2;
      const ratio = A4_W / imgW; const scaledH = imgH * ratio;
      const pages = Math.ceil(scaledH / A4_H);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [A4_W, A4_H] });
      for (let p = 0; p < pages; p++) { if (p > 0) pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, -(p * A4_H), A4_W, scaledH, undefined, 'FAST'); }
      const slug = reportProject?.title ? reportProject.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase() : reportProjectId;
      pdf.save(`report-analytics-${slug}.pdf`);
    } catch (err) { console.error('PDF generation failed:', err); alert('PDF download failed. Please try again.'); }
    finally { if (reportPdfRef.current) reportPdfRef.current.style.display = 'none'; setReportDownloading(false); }
  };

  // ── Fetch projects dropdown ──
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const res = await fetch(getFullUrl('/project_managements/projects_for_dropdown.json'), {
          headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setProjectsList(json.project_managements || json || []);
      } catch (err) { console.error('Error fetching projects:', err); }
      finally { setProjectsLoading(false); }
    };
    fetchProjects();
  }, []);

  // ── API fetchers ──
  const fetchKpis = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch(getFullUrl(`/patm_dashboard/patm_kpis.json?project_id=${projectId}`), {
        headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) setKpis(json.data);
    } catch (err) { console.error('Error fetching KPIs:', err); }
  }, [projectId]);

  const fetchCompletionRate = useCallback(async (type: string) => {
    if (!projectId) return [];
    try {
      const res = await fetch(getFullUrl(`/patm_dashboard/patm_completion_rate.json?project_id=${projectId}&type=${type}`), {
        headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) return (json.data || []).map((d: { title: string; completion_rate: number }) => ({ name: d.title, completion_rate: d.completion_rate }));
    } catch (err) { console.error(`Error fetching ${type} completion:`, err); }
    return [];
  }, [projectId]);

  const fetchAssigneeWise = useCallback(async (type: string) => {
    if (!projectId) return [];
    try {
      const res = await fetch(getFullUrl(`/patm_dashboard/patm_assignee_wise.json?project_id=${projectId}&type=${type}`), {
        headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) return (json.data || []).map((d: { assignee_name: string; breakdown: Record<string, number> }) => ({
        name: d.assignee_name,
        ...d.breakdown,
      }));
    } catch (err) { console.error(`Error fetching assignee ${type}:`, err); }
    return [];
  }, [projectId]);

  const fetchTaskDependencies = useCallback(async () => {
    if (!projectId) return [];
    try {
      const res = await fetch(getFullUrl(`/patm_dashboard/patm_task_dependencies.json?project_id=${projectId}`), {
        headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) return (json.data || []).map((d: { title: string; blocking: number; blocked_by: number; related: number }) => ({
        name: d.title, blocking: d.blocking, blocked_by: d.blocked_by, related: d.related,
      }));
    } catch (err) { console.error('Error fetching task dependencies:', err); }
    return [];
  }, [projectId]);

  const fetchIssueBreakdown = useCallback(async () => {
    if (!projectId) return [];
    try {
      const res = await fetch(getFullUrl(`/patm_dashboard/patm_issue_breakdown.json?project_id=${projectId}`), {
        headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) return (json.data || []).map((d: { title: string; open: number; in_progress: number; completed: number; closed: number }) => ({
        name: d.title, open: d.open, in_progress: d.in_progress, completed: d.completed, closed: d.closed,
      }));
    } catch (err) { console.error('Error fetching issue breakdown:', err); }
    return [];
  }, [projectId]);

  // ── Load all data on projectId change ──
  const loadAllData = useCallback(() => {
    if (selectedProjectIds.length === 0) return;
    setLoading(true);
    Promise.all([
      fetchKpis(),
      fetchCompletionRate('project').then(setProjectCompletionData),
      fetchCompletionRate('milestone').then(setMilestoneCompletionData),
      fetchCompletionRate('task').then(setTaskCompletionData),
      fetchAssigneeWise('milestone').then(setAssigneeMilestoneData),
      fetchAssigneeWise('task').then(setAssigneeTaskData),
      fetchAssigneeWise('issue').then(setAssigneeIssueData),
      fetchTaskDependencies().then(setTaskDependenciesData),
      fetchIssueBreakdown().then(setIssueBreakdownData),
    ]).finally(() => setLoading(false));
  }, [selectedProjectIds, fetchKpis, fetchCompletionRate, fetchAssigneeWise, fetchTaskDependencies, fetchIssueBreakdown]);

  useEffect(() => { loadAllData(); }, [loadAllData]);

  // ── Refresh handlers for individual charts ──
  const refreshProjectCompletion = useCallback(() => { fetchCompletionRate('project').then(setProjectCompletionData); }, [fetchCompletionRate]);
  const refreshMilestoneCompletion = useCallback(() => { fetchCompletionRate('milestone').then(setMilestoneCompletionData); }, [fetchCompletionRate]);
  const refreshTaskCompletion = useCallback(() => { fetchCompletionRate('task').then(setTaskCompletionData); }, [fetchCompletionRate]);
  const refreshAssigneeMilestone = useCallback(() => { fetchAssigneeWise('milestone').then(setAssigneeMilestoneData); }, [fetchAssigneeWise]);
  const refreshAssigneeTask = useCallback(() => { fetchAssigneeWise('task').then(setAssigneeTaskData); }, [fetchAssigneeWise]);
  const refreshAssigneeIssue = useCallback(() => { fetchAssigneeWise('issue').then(setAssigneeIssueData); }, [fetchAssigneeWise]);
  const refreshTaskDependencies = useCallback(() => { fetchTaskDependencies().then(setTaskDependenciesData); }, [fetchTaskDependencies]);
  const refreshIssueBreakdown = useCallback(() => { fetchIssueBreakdown().then(setIssueBreakdownData); }, [fetchIssueBreakdown]);

  // ── KPI card definitions ──
  const milestoneCards = kpis ? [
    { title: 'Total Milestones',       value: fmt(kpis.milestones.total),       icon: <FileText className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Open Milestones',        value: fmt(kpis.milestones.open),        icon: <FolderOpen className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Completed Milestones',   value: fmt(kpis.milestones.completed),   icon: <CheckCircle className="w-6 h-6 text-[#C72030]" /> },
    { title: 'In Progress Milestones', value: fmt(kpis.milestones.in_progress), icon: <Clock className="w-6 h-6 text-[#C72030]" /> },
  ] : [];

  const taskCards = kpis ? [
    { title: 'Total Tasks',       value: fmt(kpis.tasks.total),       icon: <ClipboardList className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Open Tasks',        value: fmt(kpis.tasks.open),        icon: <FolderOpen className="w-6 h-6 text-[#C72030]" /> },
    { title: 'In Progress Tasks', value: fmt(kpis.tasks.in_progress), icon: <Clock className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Completed Tasks',   value: fmt(kpis.tasks.completed),   icon: <CheckCircle className="w-6 h-6 text-[#C72030]" /> },
    { title: 'On Hold Tasks',     value: fmt(kpis.tasks.on_hold),     icon: <PauseCircle className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Overdue Tasks',     value: fmt(kpis.tasks.overdue),     icon: <AlertCircle className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Aborted Tasks',     value: fmt(kpis.tasks.aborted),     icon: <XCircle className="w-6 h-6 text-[#C72030]" /> },
  ] : [];

  const issueCards = kpis ? [
    { title: 'Total Issues',        value: fmt(kpis.issues.total),       icon: <MessageSquare className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Open Issues',         value: fmt(kpis.issues.open),        icon: <FolderOpen className="w-6 h-6 text-[#C72030]" /> },
    { title: 'In Progress Issues',  value: fmt(kpis.issues.in_progress), icon: <Clock className="w-6 h-6 text-[#C72030]" /> },
    { title: 'On Hold Issues',      value: fmt(kpis.issues.on_hold),     icon: <PauseCircle className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Completed Issues',    value: fmt(kpis.issues.completed),   icon: <CheckCircle className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Closed Issues',       value: fmt(kpis.issues.closed),      icon: <XCircle className="w-6 h-6 text-[#C72030]" /> },
    { title: 'Reopened Issues',     value: fmt(kpis.issues.reopened),     icon: <RefreshCw className="w-6 h-6 text-[#C72030]" /> },
  ] : [];


  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen bg-white">
      
      {/* ── Header ── */}
      <div>
        <div className="text-sm text-gray-600 mb-2">Projects &gt; Dashboard</div>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
          PROJECT DASHBOARD
        </h1>
      </div>

      {/* ── Project Multi-Select + Download ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          {/* Trigger */}
          <div
            onClick={() => !projectsLoading && setDropdownOpen((o) => !o)}
            className={`bg-white border rounded-lg px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer min-w-[340px] max-w-[520px] flex items-center gap-2 flex-wrap min-h-[42px] ${
              dropdownOpen ? 'border-[#C72030] ring-2 ring-[#C72030]/20' : 'border-gray-300'
            } ${projectsLoading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {projectsLoading ? (
              <span className="text-gray-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading projects...
              </span>
            ) : selectedProjectIds.length === 0 ? (
              <span className="text-gray-400">Select projects...</span>
            ) : (
              selectedProjectIds.map((id) => {
                const proj = projectsList.find((p) => String(p.id) === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 bg-[#F6F4EE] border border-gray-200 rounded px-2 py-0.5 text-xs font-medium text-gray-700 max-w-[180px]"
                  >
                    <span className="truncate">{proj?.title || id}</span>
                    <X
                      className="w-3 h-3 text-gray-400 hover:text-[#C72030] cursor-pointer shrink-0"
                      onClick={(e) => { e.stopPropagation(); removeProject(id); }}
                    />
                  </span>
                );
              })
            )}
            <div className="ml-auto shrink-0 pl-2">
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {/* Search */}
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#C72030] focus:border-[#C72030]"
                  />
                </div>
              </div>
              {/* Options */}
              <div className="max-h-[240px] overflow-y-auto py-1">
                {filteredProjects.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">No projects found</div>
                ) : (
                  filteredProjects.map((p) => {
                    const isSelected = selectedProjectIds.includes(String(p.id));
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProject(String(p.id))}
                        className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm hover:bg-gray-50 ${
                          isSelected ? 'bg-[#F6F4EE]' : ''
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#C72030] border-[#C72030]' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="truncate text-gray-700">{p.title}</span>
                      </div>
                    );
                  })
                )}
              </div>
              {/* Footer */}
              {selectedProjectIds.length > 0 && (
                <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{selectedProjectIds.length} selected</span>
                  <button
                    onClick={() => { setSelectedProjectIds([]); setProjectSearch(''); }}
                    className="text-xs text-[#C72030] hover:underline font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <Button variant="outline" onClick={openReportModal} className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 px-4 py-2">
          <Eye className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Preview & Download PDF</span>
        </Button>
      </div>

      {/* ── Loading state ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-3 text-gray-600 text-base">Loading dashboard data...</span>
        </div>
      ) : (
        <div className="space-y-8">

          {/* ═══════════════════════════════════════════════════ */}
          {/* 1. PROJECT COMPLETION RATE                         */}
          {/* ═══════════════════════════════════════════════════ */}
          <DashboardChart
            className=""
            data={projectCompletionData}
            title="Project Completion Rate"
            xMax={getMax(projectCompletionData, ['completion_rate'])}
            bars={[{ dataKey: 'completion_rate', name: 'Completion Rate (%)', color: '#CBAE9A' }]}
            onRefresh={refreshProjectCompletion}
          />

          {/* ═══════════════════════════════════════════════════ */}
          {/* 2. MILESTONE KPI CARDS                             */}
          {/* ═══════════════════════════════════════════════════ */}
          <div>
            <SectionHeader title="Milestones Overview" icon={<FileText className="w-5 h-5 text-[#A0856C]" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {milestoneCards.length > 0 ? milestoneCards.map((c, i) => (
                <KpiCard key={i} {...c} />
              )) : (
                <div className="col-span-full text-center text-gray-400 py-6">No milestone data available</div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 3. MILESTONE COMPLETION RATE                       */}
          {/* ═══════════════════════════════════════════════════ */}
          <DashboardChart
            className=""
            data={milestoneCompletionData}
            title="Milestone Completion Rate"
            xMax={getMax(milestoneCompletionData, ['completion_rate'])}
            bars={[{ dataKey: 'completion_rate', name: 'Completion Rate (%)', color: '#A68A7A' }]}
            onRefresh={refreshMilestoneCompletion}
          />

          {/* ═══════════════════════════════════════════════════ */}
          {/* 4. ASSIGNEE WISE MILESTONE STATUS                  */}
          {/* ═══════════════════════════════════════════════════ */}
          <DashboardChart
            className=""
            data={assigneeMilestoneData}
            title="Assignee Wise Milestone Status"
            xMax={getMax(assigneeMilestoneData, ['open', 'completed', 'in_progress'])}
            bars={[
              { dataKey: 'completed', name: 'Completed', color: '#E5E7EB' },
              { dataKey: 'in_progress', name: 'In Progress', color: '#9CA3AF' },
              { dataKey: 'open', name: 'Open', color: '#8A7365' },
            ]}
            onRefresh={refreshAssigneeMilestone}
          />

          {/* ═══════════════════════════════════════════════════ */}
          {/* 5. TASK KPI CARDS                                  */}
          {/* ═══════════════════════════════════════════════════ */}
          <div>
            <SectionHeader title="Tasks Overview" icon={<ClipboardList className="w-5 h-5 text-[#A0856C]" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {taskCards.length > 0 ? taskCards.map((c, i) => (
                <KpiCard key={i} {...c} />
              )) : (
                <div className="col-span-full text-center text-gray-400 py-6">No task data available</div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 6. ISSUE KPI CARDS                                 */}
          {/* ═══════════════════════════════════════════════════ */}
          <div>
            <SectionHeader title="Issues Overview" icon={<MessageSquare className="w-5 h-5 text-[#A0856C]" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {issueCards.length > 0 ? issueCards.map((c, i) => (
                <KpiCard key={i} {...c} />
              )) : (
                <div className="col-span-full text-center text-gray-400 py-6">No issue data available</div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* 7. TASK COMPLETION RATE                            */}
          {/* ═══════════════════════════════════════════════════ */}
          <DashboardChart
            className=""
            data={taskCompletionData}
            title="Task Completion Rate"
            xMax={getMax(taskCompletionData, ['completion_rate'])}
            bars={[{ dataKey: 'completion_rate', name: 'Completion Rate (%)', color: '#9CA3AF' }]}
            onRefresh={refreshTaskCompletion}
          />

          {/* ═══════════════════════════════════════════════════ */}
          {/* 8. ASSIGNEE WISE TASK STATUS                       */}
          {/* ═══════════════════════════════════════════════════ */}
          <DashboardChart
            className=""
            data={assigneeTaskData}
            title="Assignee Wise Task Status"
            xMax={getMax(assigneeTaskData, ['open', 'in_progress', 'completed', 'on_hold', 'overdue', 'aborted'])}
            bars={[
              { dataKey: 'open', name: 'Open', color: '#D4C4B7' },
              { dataKey: 'in_progress', name: 'In Progress', color: '#E5E7EB' },
              { dataKey: 'completed', name: 'Completed', color: '#D1D5DB' },
              { dataKey: 'on_hold', name: 'On Hold', color: '#A68A7A' },
              { dataKey: 'overdue', name: 'Overdue', color: '#6B7280' },
              { dataKey: 'aborted', name: 'Aborted', color: '#374151' },
            ]}
            onRefresh={refreshAssigneeTask}
          />

          {/* ═══════════════════════════════════════════════════ */}
          {/* 9. TASK DEPENDENCIES                               */}
          {/* ═══════════════════════════════════════════════════ */}
          <DashboardChart
            className=""
            data={taskDependenciesData}
            title="Task Dependencies"
            xMax={getMax(taskDependenciesData, ['blocking', 'blocked_by', 'related'])}
            bars={[
              { dataKey: 'blocking', name: 'Blocking', color: '#C72030' },
              { dataKey: 'blocked_by', name: 'Blocked By', color: '#A68A7A' },
              { dataKey: 'related', name: 'Related', color: '#CBAE9A' },
            ]}
            onRefresh={refreshTaskDependencies}
          />

          {/* ═══════════════════════════════════════════════════ */}
          {/* 10. PROJECT WISE ISSUE BREAKDOWN                   */}
          {/* ═══════════════════════════════════════════════════ */}
          <DashboardChart
            className=""
            data={issueBreakdownData}
            title="Project Wise Issue Breakdown"
            xMax={getMax(issueBreakdownData, ['open', 'in_progress', 'completed', 'closed'])}
            bars={[
              { dataKey: 'open', name: 'Open', color: '#D4C4B7' },
              { dataKey: 'in_progress', name: 'In Progress', color: '#9CA3AF' },
              { dataKey: 'completed', name: 'Completed', color: '#E5E7EB' },
              { dataKey: 'closed', name: 'Closed', color: '#6B7280' },
            ]}
            onRefresh={refreshIssueBreakdown}
          />

          {/* ═══════════════════════════════════════════════════ */}
          {/* 11. ASSIGNEE WISE ISSUES                           */}
          {/* ═══════════════════════════════════════════════════ */}
          <DashboardChart
            className=""
            data={assigneeIssueData}
            title="Assignee Wise Issues"
            xMax={getMax(assigneeIssueData, ['open', 'in_progress', 'on_hold', 'completed', 'closed', 'reopened'])}
            bars={[
              { dataKey: 'open', name: 'Open', color: '#D4C4B7' },
              { dataKey: 'in_progress', name: 'In Progress', color: '#9CA3AF' },
              { dataKey: 'on_hold', name: 'On Hold', color: '#A68A7A' },
              { dataKey: 'completed', name: 'Completed', color: '#E5E7EB' },
              { dataKey: 'closed', name: 'Closed', color: '#6B7280' },
              { dataKey: 'reopened', name: 'Reopened', color: '#CBAE9A' },
            ]}
            onRefresh={refreshAssigneeIssue}
          />

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* REPORT ANALYTICS MODAL                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* Hidden PDF render div */}
      <div ref={reportPdfRef} style={{ display: 'none', fontFamily: 'Arial, sans-serif', background: '#f9fafb', padding: 40, boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Reports &gt; Analytics</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>REPORT ANALYTICS</h1>
        </div>
        {reportProject && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#F6F4EE', border: '1px solid #e5e7eb', borderRadius: 8, padding: '18px 24px', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A' }}>{reportProject.title}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Project ID: #{reportProject.id}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[{ label: 'Start Date', value: raFormatDate(reportProject.start_date) }, { label: 'End Date', value: raFormatDate(reportProject.end_date) }, { label: 'Completion', value: `${reportProject.completion_percentage}%` }, { label: 'Balance', value: `${reportProject.balance}%` }].map((kpi) => (
                <div key={kpi.label} style={{ background: '#F6F4EE', border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px 24px' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>{kpi.value}</div>
                  <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>{kpi.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {reportPriorities.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            {reportPriorities.map((p) => (
              <div key={p.priority} style={{ background: '#F6F4EE', border: '1px solid #e5e7eb', borderRadius: 8, padding: '18px 20px' }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 14, color: '#1A1A1A' }}>{p.priority} Priority</div>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 1, paddingRight: 12, borderRight: '1px solid #d1d5db' }}>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Tasks</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A' }}>{p.task_count}</div>
                  </div>
                  <div style={{ flex: 1, paddingLeft: 12 }}>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Issues</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A' }}>{p.issue_count}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <RAPdfTable title="Milestone Activity Wise Progress" columns={RA_MILESTONE_ACTIVITY_COLUMNS} rows={raMilestoneTableData}
          renderCell={(row, key) => { if (key === 'status') return <span style={raStatusBadgeStyle(row.status as string)}>{(row.status as string)?.replace(/_/g, ' ')}</span>; return <span style={{ fontSize: 12, color: '#374151' }}>{String(row[key] ?? '—')}</span>; }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <RAPdfDonut title="Milestone Progress" data={raMilestoneChart} colors={MILESTONE_COLORS} />
          <RAPdfDonut title="Task Wise Progress" data={raTaskChart} colors={TASK_COLORS} />
        </div>
        <RAPdfTable title="Activity % Completion" columns={RA_ACTIVITY_COMPLETION_COLUMNS} rows={raActivityTableData}
          renderCell={(row, key) => { if (key === 'progress') { const val = row.progress as number; return (<div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}><div style={{ flex: 1, background: '#f3f4f6', borderRadius: 9999, height: 8, overflow: 'hidden' }}><div style={{ height: 8, borderRadius: 9999, width: `${Math.min(val, 100)}%`, background: '#AF8260' }} /></div><span style={{ fontSize: 12, fontWeight: 600, color: '#374151', minWidth: 32 }}>{val}%</span></div>); } return <span style={{ fontSize: 12, fontWeight: 500, color: '#1f2937' }}>{String(row[key] ?? '—')}</span>; }} />
        <RAPdfTable title="Task Details" columns={RA_TASK_DETAILS_COLUMNS} rows={raTaskDetailsData}
          renderCell={(row, key) => { if (key === 'status') return <span style={raStatusBadgeStyle(row.status as string)}>{(row.status as string)?.replace(/_/g, ' ')}</span>; if (key === 'priority') return <span style={raPriorityBadgeStyle(row.priority as string)}>{row.priority as string}</span>; return <span style={{ fontSize: 12, color: '#374151' }}>{String(row[key] ?? '—')}</span>; }} />
        <RAPdfTable title="Issue Details" columns={RA_ISSUE_DETAILS_COLUMNS} rows={raIssueDetailsData}
          renderCell={(row, key) => { if (key === 'priority') return <span style={raPriorityBadgeStyle(row.priority as string)}>{row.priority as string}</span>; return <span style={{ fontSize: 12, color: '#374151' }}>{String(row[key] ?? '—')}</span>; }} />
      </div>

      {/* Report Analytics Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">REPORT ANALYTICS</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-1">Preview and download project analytics report</DialogDescription>
              </div>
              <div className="flex items-center gap-3">
                {/* Project selector inside modal */}
                <div className="relative">
                  <select
                    title="Select Report Project"
                    value={reportProjectId}
                    onChange={(e) => setReportProjectId(e.target.value)}
                    className="appearance-none bg-white border border-[#C72030] rounded-md px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C72030] min-w-[240px] cursor-pointer"
                  >
                    <option value="" disabled>Select a project</option>
                    {projectsList.map((p) => (<option key={p.id} value={String(p.id)}>{p.title}</option>))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronDown className="w-4 h-4 text-[#C72030]" />
                  </div>
                </div>
                <Button variant="outline" onClick={handleReportPdfDownload} disabled={reportDownloading || reportLoading} className="flex items-center gap-2 border-gray-300 min-w-[140px]" size="sm">
                  {reportDownloading ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Generating...</span></>) : (<><Download className="w-4 h-4" /><span>Download PDF</span></>)}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {reportLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                <span className="ml-3 text-gray-600">Loading report data...</span>
              </div>
            ) : (
              <>
                {/* Project Info Section */}
                {reportProject && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#F6F4EE] border border-gray-200 rounded-lg px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded-full">
                          <FileText className="w-5 h-5 text-[#C72030]" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-[#1A1A1A]">{reportProject.title}</h2>
                          <span className="text-xs text-gray-500">Project ID: #{reportProject.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { icon: <Calendar className="w-6 h-6 text-[#C72030]" />, value: raFormatDate(reportProject.start_date), label: 'Start Date' },
                        { icon: <Clock className="w-6 h-6 text-[#C72030]" />, value: raFormatDate(reportProject.end_date), label: 'End Date' },
                        { icon: <CheckCircle className="w-6 h-6 text-[#C72030]" />, value: `${reportProject.completion_percentage}%`, label: 'Completion' },
                        { icon: <XCircle className="w-6 h-6 text-[#C72030]" />, value: `${reportProject.balance}%`, label: 'Balance' },
                      ].map((kpi) => (
                        <div key={kpi.label} className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 min-h-[88px]">
                          <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">{kpi.icon}</div>
                          <div>
                            <div className="text-xl font-semibold">{kpi.value}</div>
                            <div className="text-sm font-medium text-[#1A1A1A]">{kpi.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority Breakdown */}
                {reportPriorities.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reportPriorities.map((p) => (
                      <div key={p.priority} className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg min-h-[88px]">
                        <div className="flex items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded"><BarChart3 className="w-6 h-6 text-[#C72030]" /></div>
                            <span className="text-sm font-semibold text-[#1A1A1A]">{p.priority} Priority</span>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="flex-1 pr-3 border-r border-gray-300">
                            <div className="text-xs text-gray-500">Tasks</div>
                            <div className="text-2xl font-bold text-[#1A1A1A]">{p.task_count}</div>
                          </div>
                          <div className="flex-1 pl-3">
                            <div className="text-xs text-gray-500">Issues</div>
                            <div className="text-2xl font-bold text-[#1A1A1A]">{p.issue_count}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Charts grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  {/* Milestone Activity Table */}
                  <div className="col-span-1 lg:col-span-2">
                    <RAChartCard title="Milestone Activity Wise Progress">
                      <EnhancedTable data={raMilestoneTableData} columns={RA_MILESTONE_ACTIVITY_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'status') { const n = (item.status as string)?.replace(/_/g, ' '); return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${RA_STATUS_STYLES[item.status as string] ?? 'bg-gray-100 text-gray-600'}`}>{n}</span>; }
                          return <div className="text-xs text-gray-600 whitespace-normal break-words">{item[columnKey] as string}</div>;
                        }}
                        hideTableSearch hideTableExport hideColumnsButton storageKey="ra-modal-milestone-activity" />
                    </RAChartCard>
                  </div>

                  {/* Donut Charts */}
                  <div className="col-span-1">
                    <RADonutCard title="Milestone Progress" data={raMilestoneChart} colors={MILESTONE_COLORS} loading={reportLoading} />
                  </div>
                  <div className="col-span-1">
                    <RADonutCard title="Task Wise Progress" data={raTaskChart} colors={TASK_COLORS} loading={reportLoading} />
                  </div>

                  {/* Activity Completion Table */}
                  <div className="col-span-1 lg:col-span-2 xl:col-span-4">
                    <RAChartCard title="Activity % Completion - Graphical">
                      <EnhancedTable data={raActivityTableData} columns={RA_ACTIVITY_COMPLETION_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'title') return <span className="text-sm font-medium text-gray-800">{item.title as string}</span>;
                          return raRenderProgress(item.progress as number);
                        }}
                        hideTableSearch hideTableExport hideColumnsButton storageKey="ra-modal-activity-completion" />
                    </RAChartCard>
                  </div>

                  {/* Task Details Table */}
                  <div className="col-span-1 lg:col-span-2 xl:col-span-4">
                    <RAChartCard title="Task Details">
                      <EnhancedTable data={raTaskDetailsData} columns={RA_TASK_DETAILS_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'status') { const n = (item.status as string)?.replace(/_/g, ' '); return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${RA_STATUS_STYLES[item.status as string] ?? 'bg-gray-100 text-gray-600'}`}>{n}</span>; }
                          if (columnKey === 'priority') return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${RA_PRIORITY_STYLES[item.priority as string] ?? 'bg-gray-100 text-gray-600'}`}>{item.priority as string}</span>;
                          return <div className="text-sm text-gray-700 whitespace-normal break-words">{item[columnKey] as string}</div>;
                        }}
                        hideTableSearch={false} hideTableExport={false} hideColumnsButton storageKey="ra-modal-task-details" pagination />
                    </RAChartCard>
                  </div>

                  {/* Issue Details Table */}
                  <div className="col-span-1 lg:col-span-2 xl:col-span-4">
                    <RAChartCard title="Issue Details">
                      <EnhancedTable data={raIssueDetailsData} columns={RA_ISSUE_DETAILS_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'priority') return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${RA_PRIORITY_STYLES[item.priority as string] ?? 'bg-gray-100 text-gray-600'}`}>{item.priority as string}</span>;
                          return <div className="text-sm text-gray-700 whitespace-normal break-words">{item[columnKey] as string}</div>;
                        }}
                        hideTableSearch={false} hideTableExport={false} hideColumnsButton storageKey="ra-modal-issue-details" pagination />
                    </RAChartCard>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardUI;