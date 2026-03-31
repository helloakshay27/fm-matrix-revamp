import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Calendar, Filter, BarChart3, FileText,
  CheckCircle, Clock, XCircle, Download,
} from 'lucide-react';

import { AssetAnalyticsSelector } from '@/components/AssetAnalyticsSelector';
import { AssetAnalyticsFilterDialog } from '@/components/AssetAnalyticsFilterDialog';

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

// ── Chart config (First row swapped: Table first, then Pie charts) ────────────
const CHART_OPTIONS = [
  { id: 'projectCostProgress',      label: 'Project Cost Wise Progress',       description: 'Committed vs consumed vs balance cost' },
  { id: 'milestoneProgress',        label: 'Milestone Progress',               description: 'Completed vs balance milestones' },
  { id: 'taskWiseProgress',         label: 'Task Wise Progress',               description: 'Completed vs balance tasks' },
  { id: 'milestoneActivityProgress',label: 'Milestone Activity Wise Progress', description: 'Activity-wise duration, % completed and % balance' },
  { id: 'activityCompletion',       label: 'Activity % Completion',            description: 'Graphical activity-wise completion across periods' },
  { id: 'majorConcerns',            label: 'Major Concerns',                   description: 'Major concerns, status and action by' },
  { id: 'projectConcerns',          label: 'Project Concerns',                 description: 'Project concerns, status and action by' },
];
const CHART_KEYS = CHART_OPTIONS.map((o) => o.id);

// ── Static mock data ──────────────────────────────────────────────────────────
const milestoneData = [
  { name: 'Completed', value: 40 },
  { name: 'Balance',   value: 60 },
];
const taskData = [
  { name: 'Completed', value: 78 },
  { name: 'Balance',   value: 22 },
];
// Light brown (#AF8260) for graphs
const MILESTONE_COLORS = ['#AF8260', '#E5E7EB'];
const TASK_COLORS      = ['#AF8260', '#E5E7EB'];

// ── Project Cost Wise Progress table data ─────────────────────────────────────
const projectCostData: Record<string, any>[] = [
  { id: '1', projectCost: 'Project Cost', overall: 'JLB', consumed: 73, balance: 47 },
];

const PROJECT_COST_COLUMNS = [
  { key: 'projectCost', label: 'Project Cost',  sortable: true, defaultVisible: true },
  { key: 'overall',     label: 'Overall',       sortable: true, defaultVisible: true },
  { key: 'consumed',    label: 'Consumed',      sortable: true, defaultVisible: true },
  { key: 'balance',     label: 'Balance',       sortable: true, defaultVisible: true },
];

// ── Milestone Activity Wise Progress table data ───────────────────────────────
const milestoneActivityData: Record<string, any>[] = [
  { id: '1',  activity: 'Toilet',                        duration: 470,  pctCompleted: '81%',  pctBalance: '19%' },
  { id: '2',  activity: 'Kitchen + Outdoor Bar Counter',  duration: 498,  pctCompleted: '65%',  pctBalance: '35%' },
  { id: '3',  activity: 'Internal Seating Area',          duration: 52,   pctCompleted: '62%',  pctBalance: '5%'  },
  { id: '4',  activity: 'Hot & Cold Pickup Area',         duration: 52,   pctCompleted: '26%',  pctBalance: '25%' },
  { id: '5',  activity: 'Older Seating Area',             duration: 33,   pctCompleted: '76%',  pctBalance: '25%' },
  { id: '6',  activity: 'North Side Entrance Lobby',      duration: 35,   pctCompleted: '74%',  pctBalance: '29%' },
  { id: '7',  activity: 'Lift & Staircase',               duration: 425,  pctCompleted: '41%',  pctBalance: '59%' },
  { id: '8',  activity: 'Courtyard/Fountain',             duration: 451,  pctCompleted: '65%',  pctBalance: '34%' },
  { id: '9',  activity: 'P1- North Side Arrival Lobby',   duration: 400,  pctCompleted: '83%',  pctBalance: '17%' },
  { id: '10', activity: 'P1- Docking Area',               duration: 214,  pctCompleted: '76%',  pctBalance: '17%' },
  { id: '11', activity: 'P1- BOH',                        duration: 215,  pctCompleted: '83%',  pctBalance: '17%' },
  { id: '12', activity: 'P1- Kitchen',                    duration: 287,  pctCompleted: '83%',  pctBalance: '17%' },
  { id: '13', activity: 'P1- Pot Wash',                   duration: 223,  pctCompleted: '83%',  pctBalance: '17%' },
  { id: '14', activity: 'P1- Toilet',                     duration: 227,  pctCompleted: '93%',  pctBalance: '7%'  },
];

const MILESTONE_ACTIVITY_COLUMNS = [
  { key: 'activity',     label: 'Activities',   sortable: true, defaultVisible: true },
  { key: 'duration',     label: 'Duration',     sortable: true, defaultVisible: true },
  { key: 'pctCompleted', label: '% Completed',  sortable: true, defaultVisible: true },
  { key: 'pctBalance',   label: '% Balance',    sortable: true, defaultVisible: true },
];

// ── Activity % Completion Graphical table data ────────────────────────────────
const activityCompletionData: Record<string, any>[] = [
  { id: '1',  activity: 'P1- Toilet',           progress: 7   },
  { id: '2',  activity: 'P1- Kitchen',          progress: 83  },
  { id: '3',  activity: 'P1- Docking',          progress: 83  },
  { id: '4',  activity: 'Outdoor...',            progress: 37  },
  { id: '5',  activity: 'Lift & Staircase',      progress: 11  },
  { id: '6',  activity: 'Outer Seating...',      progress: 45  },
  { id: '7',  activity: 'Internal Seating...',   progress: 19  },
  { id: '8',  activity: 'Toilet',                progress: 17  },
];

const ACTIVITY_COMPLETION_COLUMNS = [
  { key: 'activity', label: 'Activities', sortable: true,  defaultVisible: true },
  { key: 'progress', label: '% Completion', sortable: true, defaultVisible: true },
];

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

// ── Major Concerns table data ─────────────────────────────────────────────────
const majorConcernsData: Record<string, any>[] = [
  { id: '1', majorConcern: 'Structural cracks observed in north wing', status: 'Open',        actionBy: 'Site Engineer' },
  { id: '2', majorConcern: 'Delay in material delivery for roofing',   status: 'In Progress', actionBy: 'Procurement Team' },
  { id: '3', majorConcern: 'Waterproofing incomplete in basement',     status: 'Open',        actionBy: 'Contractor' },
  { id: '4', majorConcern: 'Electrical wiring not as per drawing',     status: 'Resolved',    actionBy: 'Electrical Supervisor' },
  { id: '5', majorConcern: 'Safety railing missing on 3rd floor',      status: 'In Progress', actionBy: 'Safety Officer' },
];

const MAJOR_CONCERNS_COLUMNS = [
  { key: 'majorConcern', label: 'Major Concerns', sortable: true, defaultVisible: true },
  { key: 'status',       label: 'Status',         sortable: true, defaultVisible: true },
  { key: 'actionBy',     label: 'Action By',      sortable: true, defaultVisible: true },
];

const STATUS_STYLES: Record<string, string> = {
  'Open':        'bg-red-100 text-red-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Resolved':    'bg-green-100 text-green-700',
};

// ── Project Concerns table data ───────────────────────────────────────────────
const projectConcernsData: Record<string, any>[] = [
  { id: '1', projectConcern: 'Foundation design change required',          status: 'Open',        actionBy: 'Structural Engineer' },
  { id: '2', projectConcern: 'Budget overrun in civil works',              status: 'In Progress', actionBy: 'Project Manager' },
  { id: '3', projectConcern: 'Subcontractor performance below standard',   status: 'Open',        actionBy: 'Contract Manager' },
  { id: '4', projectConcern: 'Permit approval delayed by authority',       status: 'In Progress', actionBy: 'Liaison Officer' },
  { id: '5', projectConcern: 'Material quality not meeting specs',         status: 'Resolved',    actionBy: 'QA/QC Team' },
];

const PROJECT_CONCERNS_COLUMNS = [
  { key: 'projectConcern', label: 'Project Concerns', sortable: true, defaultVisible: true },
  { key: 'status',         label: 'Status',           sortable: true, defaultVisible: true },
  { key: 'actionBy',       label: 'Action By',        sortable: true, defaultVisible: true },
];

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
  cx, cy, midAngle, outerRadius, percent, index,
}: any) => {
  const RADIAN = Math.PI / 180;
  const pct = Math.round(percent * 100);
  if (pct < 3) return null;

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
}> = ({ title, data, colors }) => (
  <ChartCard title={title}>
    <div className="flex flex-col items-center justify-center h-full">
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
    </div>
  </ChartCard>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const ReportAnalytics: React.FC = () => {
  const [dateRange, setDateRange]           = useState(getDefaultRange);
  const [filterOpen, setFilterOpen]         = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>(CHART_KEYS);
  const [chartOrder, setChartOrder]         = useState<string[]>(CHART_KEYS);

  // Force chart order to reset correctly on mount to fix hot-reload bugs
  useEffect(() => {
    setChartOrder(CHART_KEYS);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
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

  const orderedVisible = chartOrder.filter((k) => selectedCharts.includes(k));

  const kpiCards = [
    { label: 'Total Reports',  value: '1,284', icon: <FileText    className="w-6 h-6 text-[#C72030]" /> },
    { label: 'Approved',       value: '947',   icon: <CheckCircle className="w-6 h-6 text-[#C72030]" /> },
    { label: 'Pending Review', value: '213',   icon: <Clock       className="w-6 h-6 text-[#C72030]" /> },
    { label: 'Rejected',       value: '124',   icon: <XCircle     className="w-6 h-6 text-[#C72030]" /> },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">

      {/* Title */}
      <div>
        <div className="text-sm text-gray-600 mb-2">Reports &gt; Analytics</div>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
          REPORT ANALYTICS
        </h1>
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

        {/* Global Action Buttons */}
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

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((item, i) => (
          <div
            key={i}
            className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 cursor-pointer min-h-[88px]"
          >
            <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
              {item.icon}
            </div>
            <div>
              <div className="text-xl font-semibold">{item.value}</div>
              <div className="text-sm font-medium text-[#1A1A1A]">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts with DndContext */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {orderedVisible.map((key) => {
              // Donuts take 1 column, Tables take 2 columns
              const isDonut = key === 'milestoneProgress' || key === 'taskWiseProgress';
              const colSpanClass = isDonut ? 'col-span-1' : 'col-span-1 lg:col-span-2';

              if (key === 'projectCostProgress') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <ChartCard title="Project Cost Wise Progress Total">
                      <EnhancedTable
                        data={projectCostData}
                        columns={PROJECT_COST_COLUMNS}
                        renderCell={(item, columnKey) => (
                          <div className="text-xs text-gray-600 whitespace-normal break-words">
                            {item[columnKey]}
                          </div>
                        )}
                        hideTableSearch hideTableExport hideColumnsButton
                        storageKey="project-cost-progress-table"
                      />
                    </ChartCard>
                  </SortableChartItem>
                );
              }

              if (key === 'milestoneProgress') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <DonutChartCard
                      title="Milestone Progress"
                      data={milestoneData}
                      colors={MILESTONE_COLORS}
                    />
                  </SortableChartItem>
                );
              }

              if (key === 'taskWiseProgress') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <DonutChartCard
                      title="Task Wise Progress"
                      data={taskData}
                      colors={TASK_COLORS}
                    />
                  </SortableChartItem>
                );
              }

              if (key === 'milestoneActivityProgress') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <ChartCard title="Milestone Activity Wise Progress">
                      {/* STRICT CSS applied to fix the table layout widths */}
                      <div className="w-full overflow-hidden [&_table]:table-auto [&_table]:w-full [&_th:first-child]:w-full [&_th:nth-child(2)]:w-[80px] [&_th:nth-child(2)]:whitespace-nowrap [&_th:nth-child(3)]:w-[100px] [&_th:nth-child(3)]:whitespace-nowrap [&_th:nth-child(4)]:w-[90px] [&_th:nth-child(4)]:whitespace-nowrap [&_td:nth-child(2)]:text-center [&_td:nth-child(3)]:text-center [&_td:nth-child(4)]:text-center">
                        <EnhancedTable
                          data={milestoneActivityData}
                          columns={MILESTONE_ACTIVITY_COLUMNS}
                          renderCell={(item, columnKey) => (
                            <div className="text-xs text-gray-600 whitespace-normal break-words">
                              {item[columnKey]}
                            </div>
                          )}
                          hideTableSearch hideTableExport hideColumnsButton
                          storageKey="milestone-activity-progress-table"
                        />
                      </div>
                    </ChartCard>
                  </SortableChartItem>
                );
              }

              if (key === 'activityCompletion') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <ChartCard title="Activity % Completion - Graphical">
                      <EnhancedTable
                        data={activityCompletionData}
                        columns={ACTIVITY_COMPLETION_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'activity') return <span className="text-sm font-medium text-gray-800">{item.activity}</span>;
                          return renderProgressCell(item.progress);
                        }}
                        hideTableSearch hideTableExport hideColumnsButton
                        storageKey="activity-completion-graphical-table"
                      />
                    </ChartCard>
                  </SortableChartItem>
                );
              }

              if (key === 'majorConcerns') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <ChartCard title="Major Concerns">
                      <EnhancedTable
                        data={majorConcernsData}
                        columns={MAJOR_CONCERNS_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'status') {
                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[item.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                {item.status}
                              </span>
                            );
                          }
                          return (
                            <div className="text-sm text-gray-700 whitespace-normal break-words">
                              {item[columnKey]}
                            </div>
                          );
                        }}
                        hideTableSearch hideTableExport hideColumnsButton
                        storageKey="major-concerns-table"
                      />
                    </ChartCard>
                  </SortableChartItem>
                );
              }

              if (key === 'projectConcerns') {
                return (
                  <SortableChartItem key={key} id={key} className={colSpanClass}>
                    <ChartCard title="Project Concerns">
                      <EnhancedTable
                        data={projectConcernsData}
                        columns={PROJECT_CONCERNS_COLUMNS}
                        renderCell={(item, columnKey) => {
                          if (columnKey === 'status') {
                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[item.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                {item.status}
                              </span>
                            );
                          }
                          return (
                            <div className="text-sm text-gray-700 whitespace-normal break-words">
                              {item[columnKey]}
                            </div>
                          );
                        }}
                        hideTableSearch hideTableExport hideColumnsButton
                        storageKey="project-concerns-table"
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