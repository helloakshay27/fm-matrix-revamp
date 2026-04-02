import React, { useState, useEffect, useCallback } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Calendar, Filter, BarChart3, FileText,
  CheckCircle, Clock, XCircle, Download, Loader2, ChevronDown,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { AssetAnalyticsSelector } from '@/components/AssetAnalyticsSelector';
import { AssetAnalyticsFilterDialog } from '@/components/AssetAnalyticsFilterDialog';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

// ── Chart config ──────────────────────────────────────────────────────────────
const CHART_OPTIONS = [
  { id: 'milestoneProgress',         label: 'Milestone Progress',               description: 'Completed vs balance milestones' },
  { id: 'taskWiseProgress',          label: 'Task Wise Progress',               description: 'Completed vs balance tasks' },
  { id: 'milestoneActivityProgress', label: 'Milestone Activity Wise Progress', description: 'Milestone-wise completion and balance' },
  { id: 'activityCompletion',        label: 'Activity % Completion',            description: 'Task-wise completion across periods' },
  { id: 'taskDetails',              label: 'Task Details',                     description: 'Detailed task information table' },
  { id: 'issueDetails',             label: 'Issue Details',                    description: 'Project issues table' },
];
const CHART_KEYS = CHART_OPTIONS.map((o) => o.id);

// Light brown (#AF8260) for graphs
const MILESTONE_COLORS = ['#AF8260', '#E5E7EB'];
const TASK_COLORS      = ['#AF8260', '#E5E7EB'];

// ── Column configs ────────────────────────────────────────────────────────────
const MILESTONE_ACTIVITY_COLUMNS = [
  { key: 'title',                 label: 'Milestone',       sortable: true, defaultVisible: true },
  { key: 'status',                label: 'Status',          sortable: true, defaultVisible: true },
  { key: 'completion_percentage', label: '% Completed',     sortable: true, defaultVisible: true },
  { key: 'balance',              label: '% Balance',       sortable: true, defaultVisible: true },
];

const ACTIVITY_COMPLETION_COLUMNS = [
  { key: 'title',    label: 'Task',          sortable: true, defaultVisible: true },
  { key: 'progress', label: '% Completion',  sortable: true, defaultVisible: true },
];

const TASK_DETAILS_COLUMNS = [
  { key: 'title',                 label: 'Task',                sortable: true, defaultVisible: true },
  { key: 'status',                label: 'Status',              sortable: true, defaultVisible: true },
  { key: 'priority',              label: 'Priority',            sortable: true, defaultVisible: true },
  { key: 'related_to_milestone',  label: 'Milestone',           sortable: true, defaultVisible: true },
  { key: 'responsible_person',    label: 'Responsible Person',  sortable: true, defaultVisible: true },
  { key: 'completion_percentage', label: '% Completed',         sortable: true, defaultVisible: true },
  { key: 'balance',              label: '% Balance',           sortable: true, defaultVisible: true },
];

const ISSUE_DETAILS_COLUMNS = [
  { key: 'title',                label: 'Title',               sortable: true, defaultVisible: true },
  { key: 'description',         label: 'Description',          sortable: true, defaultVisible: true },
  { key: 'priority',            label: 'Priority',             sortable: true, defaultVisible: true },
  { key: 'related_to_milestone', label: 'Milestone',           sortable: true, defaultVisible: true },
  { key: 'related_to_task',     label: 'Task',                 sortable: true, defaultVisible: true },
  { key: 'responsible_person',  label: 'Responsible Person',   sortable: true, defaultVisible: true },
];

const STATUS_STYLES: Record<string, string> = {
  'open':        'bg-red-100 text-red-700',
  'Open':        'bg-red-100 text-red-700',
  'in_progress': 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'completed':   'bg-green-100 text-green-700',
  'Resolved':    'bg-green-100 text-green-700',
  'closed':      'bg-gray-100 text-gray-600',
};

const PRIORITY_STYLES: Record<string, string> = {
  'Low':    'bg-blue-100 text-blue-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'High':   'bg-orange-100 text-orange-700',
  'Urgent': 'bg-red-100 text-red-700',
};

// Progress bar cell renderer
const renderProgressCell = (value: number | null) => {
  if (value === null || value === undefined) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full"
          style={{ width: `${Math.min(value, 100)}%`, background: '#AF8260' }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{value}%</span>
    </div>
  );
};

const toDDMMYYYY = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

const parseDD = (s: string): Date => {
  const [dd, mm, yyyy] = s.split('/');
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
};

const getDefaultRange = () => {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);
  return { startDate: toDDMMYYYY(lastYear), endDate: toDDMMYYYY(today) };
};

// ── Custom label rendered OUTSIDE each donut slice ────────────────────────────
const renderOutsideLabel = ({
  cx, cy, midAngle, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number; outerRadius: number; percent: number;
}) => {
  const RADIAN = Math.PI / 180;
  const pct = Math.round(percent * 100);
  if (pct < 1) return null;

  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);

  const sx = cx + (outerRadius + 6) * cos;
  const sy = cy + (outerRadius + 6) * sin;

  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;

  const ex = mx + (cos >= 0 ? 12 : -12);
  const ey = my;

  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#9ca3af" strokeWidth={1} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill="#9ca3af" />
      <text
        x={ex + (cos >= 0 ? 4 : -4)}
        y={ey}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fill="#374151"
        fontSize={12}
        fontWeight={600}
      >
        {pct}%
      </text>
    </g>
  );
};

// ── SortableChartItem ─────────────────────────────────────────────────────────
const SortableChartItem: React.FC<{ id: string; className?: string; children: React.ReactNode }> = ({ id, className, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: isDragging ? 'relative' : 'static',
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 h-full ${className || ''}`}
    >
      {children}
    </div>
  );
};

// ── Chart card wrapper ────────────────────────────────────────────────────────
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title, children,
}) => (
  <div className="bg-white rounded-lg border border-gray-100 transition-shadow duration-300 hover:shadow-lg p-5 h-full flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
    </div>
    <div className="flex-1 w-full overflow-hidden">
      {children}
    </div>
  </div>
);

// ── Donut Chart Card ──────────────────────────────────────────────────────────
const DonutChartCard: React.FC<{
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
  loading?: boolean;
}> = ({ title, data, colors, loading }) => (
  <ChartCard title={title}>
    <div className="flex flex-col items-center justify-center h-full">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="w-full px-6">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={renderOutsideLabel}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  contentStyle={{
                    borderRadius: 10,
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ background: colors[i % colors.length] }}
                />
                {d.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </ChartCard>
);

// ── Interfaces for API data ───────────────────────────────────────────────────
interface ProjectDropdownItem {
  id: number;
  title: string;
}

interface ProjectInfo {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  completion_percentage: number;
  balance: number;
}

interface MilestoneSummary {
  average_completion: number;
  balance: number;
}

interface MilestoneItem {
  id: number;
  code: string | null;
  title: string;
  status: string;
  completion_percentage: number;
  balance: number;
}

interface TaskSummary {
  average_completion: number;
  balance: number;
}

interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  related_to_milestone: string;
  responsible_person: string;
  completion_percentage: number;
  balance: number;
}

interface IssueItem {
  id: number;
  title: string;
  description: string;
  priority: string;
  name: string;
  related_to_milestone: string;
  related_to_task: string;
  responsible_person: string;
}

interface PriorityBreakdown {
  priority: string;
  task_count: number;
  issue_count: number;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const ReportAnalytics: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryProjectId = searchParams.get('project_id');

  // Project dropdown state
  const [projectsList, setProjectsList] = useState<ProjectDropdownItem[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(queryProjectId || '269');

  const projectId = selectedProjectId;

  const [dateRange, setDateRange]           = useState(getDefaultRange);
  const [filterOpen, setFilterOpen]         = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>(CHART_KEYS);
  const [chartOrder, setChartOrder]         = useState<string[]>(CHART_KEYS);

  // API data states
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [milestoneSummary, setMilestoneSummary] = useState<MilestoneSummary | null>(null);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [taskSummary, setTaskSummary] = useState<TaskSummary | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [priorities, setPriorities] = useState<PriorityBreakdown[]>([]);

  // Force chart order to reset correctly on mount
  useEffect(() => {
    setChartOrder(CHART_KEYS);
  }, []);

  // ── Fetch projects list for dropdown ─────────────────────────────────────
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const url = getFullUrl('/project_managements/projects_for_dropdown.json');
        const res = await fetch(url, {
          headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list: ProjectDropdownItem[] = json.project_managements || json || [];
        setProjectsList(list);
      } catch (err) {
        console.error('Error fetching projects list:', err);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ── Fetch all data ────────────────────────────────────────────────────────
  const fetchMilestoneSummary = useCallback(async () => {
    if (!projectId) return;
    try {
      const url = getFullUrl(`/patm_report/project_milestones_summary.json?project_id=${projectId}`);
      const res = await fetch(url, {
        headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data?.[0]) {
        const d = json.data[0];
        setProject(d.project || null);
        setMilestoneSummary(d.milestone_summary || null);
        setMilestones(d.milestones || []);
      }
    } catch (err) {
      console.error('Error fetching milestone summary:', err);
    }
  }, [projectId]);

  const fetchTaskSummary = useCallback(async () => {
    if (!projectId) return;
    try {
      const url = getFullUrl(`/patm_report/project_task_summary.json?project_id=${projectId}`);
      const res = await fetch(url, {
        headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data?.[0]) {
        const d = json.data[0];
        setTaskSummary(d.task_summary || null);
        setTasks(d.tasks || []);
      }
    } catch (err) {
      console.error('Error fetching task summary:', err);
    }
  }, [projectId]);

  const fetchIssueSummary = useCallback(async () => {
    if (!projectId) return;
    try {
      const url = getFullUrl(`/patm_report/project_issue_summary.json?project_id=${projectId}`);
      const res = await fetch(url, {
        headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data?.[0]) {
        setIssues(json.data[0].issues || []);
      }
    } catch (err) {
      console.error('Error fetching issue summary:', err);
    }
  }, [projectId]);

  const fetchPriorityBreakdown = useCallback(async () => {
    if (!projectId) return;
    try {
      const url = getFullUrl(`/patm_report/project_priority_breakdown.json?project_id=${projectId}`);
      const res = await fetch(url, {
        headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data?.[0]) {
        setPriorities(json.data[0].priorities || []);
      }
    } catch (err) {
      console.error('Error fetching priority breakdown:', err);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    Promise.all([
      fetchMilestoneSummary(),
      fetchTaskSummary(),
      fetchIssueSummary(),
      fetchPriorityBreakdown(),
    ]).finally(() => setLoading(false));
  }, [projectId, fetchMilestoneSummary, fetchTaskSummary, fetchIssueSummary, fetchPriorityBreakdown]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const milestoneChartData = milestoneSummary
    ? [
        { name: 'Completed', value: Number(milestoneSummary.average_completion.toFixed(1)) },
        { name: 'Balance',   value: Number(milestoneSummary.balance.toFixed(1)) },
      ]
    : [{ name: 'Completed', value: 0 }, { name: 'Balance', value: 100 }];

  const taskChartData = taskSummary
    ? [
        { name: 'Completed', value: Number(taskSummary.average_completion.toFixed(1)) },
        { name: 'Balance',   value: Number(taskSummary.balance.toFixed(1)) },
      ]
    : [{ name: 'Completed', value: 0 }, { name: 'Balance', value: 100 }];

  const milestoneTableData = milestones.map((m) => ({
    id: String(m.id),
    title: m.title,
    status: m.status,
    completion_percentage: `${m.completion_percentage}%`,
    balance: `${m.balance}%`,
  }));

  const activityCompletionTableData = tasks.map((t) => ({
    id: String(t.id),
    title: t.title,
    progress: t.completion_percentage,
  }));

  const taskDetailsTableData = tasks.map((t) => ({
    id: String(t.id),
    title: t.title,
    status: t.status,
    priority: t.priority,
    related_to_milestone: t.related_to_milestone,
    responsible_person: t.responsible_person,
    completion_percentage: `${t.completion_percentage}%`,
    balance: `${t.balance}%`,
  }));

  const issueDetailsTableData = issues.map((iss) => ({
    id: String(iss.id),
    title: iss.title,
    description: iss.description?.replace(/<[^>]*>/g, '') || '—',
    priority: iss.priority,
    related_to_milestone: iss.related_to_milestone,
    related_to_task: iss.related_to_task,
    responsible_person: iss.responsible_person,
  }));

  // ── DnD ─────────────────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setChartOrder((items) =>
        arrayMove(items, items.indexOf(active.id as string), items.indexOf(over?.id as string))
      );
    }
  };

  const handleApplyFilters = (startStr: string, endStr: string) => {
    const conv = (s: string) => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
    setDateRange({ startDate: conv(startStr), endDate: conv(endStr) });
  };

  const handleDownloadAll = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const orderedVisible = chartOrder.filter((k) => selectedCharts.includes(k));

  // ── No project_id state ─────────────────────────────────────────────────
  if (!projectId) {
    return (
      <div className="p-4 sm:p-6 min-h-screen">
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Project Selected</h2>
          <p className="text-gray-500">Please provide a project_id query parameter to view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">

      {/* Title */}
      <div>
        <div className="text-sm text-gray-600 mb-2">Reports &gt; Analytics</div>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
          REPORT ANALYTICS
        </h1>
      </div>

      {/* Project Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            title="Select Project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={projectsLoading}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent min-w-[220px] cursor-pointer disabled:opacity-50"
          >
            {projectsLoading ? (
              <option value="">Loading projects...</option>
            ) : (
              <>
                <option value="" disabled>Select a project</option>
                {projectsList.map((p) => (
                  <option key={p.id} value={String(p.id)}>{p.title}</option>
                ))}
              </>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            {projectsLoading
              ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
        <Button
          variant="outline"
          onClick={() => setFilterOpen(true)}
          className="flex items-center justify-between w-full sm:w-[280px] px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {dateRange.startDate} - {dateRange.endDate}
            </span>
          </div>
          <Filter className="w-4 h-4 text-gray-600" />
        </Button>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <AssetAnalyticsSelector
            options={CHART_OPTIONS}
            selectedOptions={selectedCharts}
            onSelectionChange={setSelectedCharts}
            title="Select Charts"
            buttonLabel="Charts"
            dateRange={{
              startDate: parseDD(dateRange.startDate),
              endDate:   parseDD(dateRange.endDate),
            }}
          />
          <Button
            variant="outline"
            onClick={handleDownloadAll}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 px-4 py-2"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Download PDF</span>
          </Button>
        </div>
      </div>

      {/* ── Project Info Section ─────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">Loading project data...</span>
        </div>
      ) : project ? (
        <div className="space-y-4">
          {/* Project title bar */}
          <div className="flex items-center justify-between bg-[#F6F4EE] border border-gray-200 rounded-lg px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded-full">
                <FileText className="w-5 h-5 text-[#C72030]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A1A]">{project.title}</h2>
                <span className="text-xs text-gray-500">Project ID: #{project.id}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleDownloadAll}
              className="flex items-center gap-2 border-gray-300"
              size="sm"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date */}
            <div className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 min-h-[88px]">
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                <Calendar className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-xl font-semibold">{formatDate(project.start_date)}</div>
                <div className="text-sm font-medium text-[#1A1A1A]">Start Date</div>
              </div>
            </div>

            {/* End Date */}
            <div className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 min-h-[88px]">
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                <Clock className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-xl font-semibold">{formatDate(project.end_date)}</div>
                <div className="text-sm font-medium text-[#1A1A1A]">End Date</div>
              </div>
            </div>

            {/* Completion Percentage */}
            <div className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 min-h-[88px]">
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                <CheckCircle className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-xl font-semibold">{project.completion_percentage}%</div>
                <div className="text-sm font-medium text-[#1A1A1A]">Completion</div>
              </div>
            </div>

            {/* Balance */}
            <div className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 min-h-[88px]">
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                <XCircle className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-xl font-semibold">{project.balance}%</div>
                <div className="text-sm font-medium text-[#1A1A1A]">Balance</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Priority Breakdown Cards (like AMC Assets with two sections) ── */}
      {priorities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {priorities.map((p) => (
            <div
              key={p.priority}
              className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg min-h-[88px]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                    <BarChart3 className="w-6 h-6 text-[#C72030]" />
                  </div>
                  <span className="text-sm font-semibold text-[#1A1A1A]">{p.priority} Priority</span>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex">
                {/* Tasks section */}
                <div className="flex-1 pr-3 border-r border-gray-300">
                  <div className="text-xs text-gray-500">Tasks</div>
                  <div className="text-2xl font-bold text-[#1A1A1A]">{p.task_count}</div>
                </div>
                {/* Issues section */}
                <div className="flex-1 pl-3">
                  <div className="text-xs text-gray-500">Issues</div>
                  <div className="text-2xl font-bold text-[#1A1A1A]">{p.issue_count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Charts with DndContext ───────────────────────────────────────── */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">

            {orderedVisible.map((key) => {
              const isDonut = key === 'milestoneProgress' || key === 'taskWiseProgress';
              const isFullWidth = key === 'taskDetails' || key === 'issueDetails';
              const colSpanClass = isFullWidth ? 'col-span-1 lg:col-span-2 xl:col-span-4' : isDonut ? 'col-span-1' : 'col-span-1 lg:col-span-2';

              if (key === 'milestoneProgress') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <DonutChartCard
                      title="Milestone Progress"
                      data={milestoneChartData}
                      colors={MILESTONE_COLORS}
                      loading={loading}
                    />
                  </SortableChartItem>
                );
              }

              if (key === 'taskWiseProgress') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <DonutChartCard
                      title="Task Wise Progress"
                      data={taskChartData}
                      colors={TASK_COLORS}
                      loading={loading}
                    />
                  </SortableChartItem>
                );
              }

              if (key === 'milestoneActivityProgress') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <ChartCard title="Milestone Activity Wise Progress">
                      <EnhancedTable
                        data={milestoneTableData}
                        columns={MILESTONE_ACTIVITY_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'status') {
                            const normalized = (item.status as string)?.replace(/_/g, ' ');
                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[item.status as string] ?? 'bg-gray-100 text-gray-600'}`}>
                                {normalized}
                              </span>
                            );
                          }
                          return (
                            <div className="text-xs text-gray-600 whitespace-normal break-words">
                              {item[columnKey] as string}
                            </div>
                          );
                        }}
                        hideTableSearch hideTableExport hideColumnsButton
                        storageKey="milestone-activity-progress-table"
                      />
                    </ChartCard>
                  </SortableChartItem>
                );
              }

              if (key === 'activityCompletion') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <ChartCard title="Activity % Completion - Graphical">
                      <EnhancedTable
                        data={activityCompletionTableData}
                        columns={ACTIVITY_COMPLETION_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'title') return <span className="text-sm font-medium text-gray-800">{item.title as string}</span>;
                          return renderProgressCell(item.progress as number);
                        }}
                        hideTableSearch hideTableExport hideColumnsButton
                        storageKey="activity-completion-graphical-table"
                      />
                    </ChartCard>
                  </SortableChartItem>
                );
              }

              if (key === 'taskDetails') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <ChartCard title="Task Details">
                      <EnhancedTable
                        data={taskDetailsTableData}
                        columns={TASK_DETAILS_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'status') {
                            const normalized = (item.status as string)?.replace(/_/g, ' ');
                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[item.status as string] ?? 'bg-gray-100 text-gray-600'}`}>
                                {normalized}
                              </span>
                            );
                          }
                          if (columnKey === 'priority') {
                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[item.priority as string] ?? 'bg-gray-100 text-gray-600'}`}>
                                {item.priority as string}
                              </span>
                            );
                          }
                          return (
                            <div className="text-sm text-gray-700 whitespace-normal break-words">
                              {item[columnKey] as string}
                            </div>
                          );
                        }}
                        hideTableSearch={false} hideTableExport={false} hideColumnsButton
                        storageKey="task-details-table"
                        pagination
                      />
                    </ChartCard>
                  </SortableChartItem>
                );
              }

              if (key === 'issueDetails') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <ChartCard title="Issue Details">
                      <EnhancedTable
                        data={issueDetailsTableData}
                        columns={ISSUE_DETAILS_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'priority') {
                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[item.priority as string] ?? 'bg-gray-100 text-gray-600'}`}>
                                {item.priority as string}
                              </span>
                            );
                          }
                          return (
                            <div className="text-sm text-gray-700 whitespace-normal break-words">
                              {item[columnKey] as string}
                            </div>
                          );
                        }}
                        hideTableSearch={false} hideTableExport={false} hideColumnsButton
                        storageKey="issue-details-table"
                        pagination
                      />
                    </ChartCard>
                  </SortableChartItem>
                );
              }

              return null;
            })}

            {/* Empty state */}
            {orderedVisible.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>No charts selected. Please select a chart from the dropdown above.</p>
              </div>
            )}

          </div>
        </SortableContext>
      </DndContext>

      {/* Filter dialog */}
      <AssetAnalyticsFilterDialog
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentStartDate={parseDD(dateRange.startDate)}
        currentEndDate={parseDD(dateRange.endDate)}
      />
    </div>
  );
};

export default ReportAnalytics;