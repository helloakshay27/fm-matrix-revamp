import React, { useState, useEffect } from 'react';
import { 
  FileText, FolderOpen, CheckCircle, Clock, 
  ClipboardList, PauseCircle, AlertCircle, XCircle,
  Calendar, Filter, Download // Download icon wapas aa gaya
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetAnalyticsSelector } from '@/components/AssetAnalyticsSelector';
import { AssetAnalyticsFilterDialog } from '@/components/AssetAnalyticsFilterDialog';
import DashboardChart from '@/components/charts/DashboardChart'; 

// ── Dnd-kit Imports ──
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
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─────────────────────────────────────────────────────────
// ── MOCK DATA & HELPERS ──
// ─────────────────────────────────────────────────────────
const projectData = [
  { name: 'Appointments', issue_count: 0, completion_percent: 0 },
  { name: 'Club Management', issue_count: 285, completion_percent: 0 },
  { name: 'GoPhygital.work (Corporate)', issue_count: 205, completion_percent: 0 },
  { name: 'HSE App', issue_count: 85, completion_percent: 0 },
  { name: 'Life Compass Lockated', issue_count: 8, completion_percent: 0 },
  { name: 'Loyalty Engine', issue_count: 0, completion_percent: 0 },
  { name: 'Parking', issue_count: 0, completion_percent: 0 },
  { name: 'Projects and Task Management', issue_count: 0, completion_percent: 6 },
  { name: 'RHB', issue_count: 0, completion_percent: 0 },
  { name: 'Vendor Management', issue_count: 6, completion_percent: 0 },
  { name: 'Snag 360', issue_count: 2, completion_percent: 0 },
];

const milestoneData = [
  { name: 'Water', issue_count: 0, completion_percent: 0 },
  { name: 'Virtual Request', issue_count: 0, completion_percent: 0 },
  { name: 'Template', issue_count: 0, completion_percent: 5 },
  { name: 'Slot Configuration', issue_count: 0, completion_percent: 0 },
  { name: 'Pending Approvals', issue_count: 185, completion_percent: 25 },
  { name: 'Masters', issue_count: 8, completion_percent: 0 },
  { name: 'Inventory Type', issue_count: 5, completion_percent: 0 },
  { name: 'Escalation Matrix', issue_count: 12, completion_percent: 0 },
  { name: 'Checklist Master', issue_count: 10, completion_percent: 0 },
  { name: 'Audit - Vendor', issue_count: 0, completion_percent: 20 },
  { name: 'Approval Matrix', issue_count: 70, completion_percent: 0 },
];

const assigneeData = [
  { name: 'Suyash Jagdale',   completed: 0, on_hold: 0, in_progress: 0, open: 1 },
  { name: 'Sagar Singh',      completed: 0, on_hold: 0, in_progress: 1, open: 12 },
  { name: 'Sadanand Gupta',   completed: 0, on_hold: 0, in_progress: 0, open: 1 },
  { name: 'Kshitij Rasal',    completed: 0, on_hold: 0, in_progress: 0, open: 1 },
  { name: 'Dinesh Shinde',    completed: 0, on_hold: 0, in_progress: 9, open: 0 },
  { name: 'Dhananjay Bhoyar', completed: 3, on_hold: 0, in_progress: 0, open: 5 },
  { name: 'Deepak Gupta',     completed: 0, on_hold: 0, in_progress: 8, open: 0 },
  { name: 'Abdul Ghaffar',    completed: 0, on_hold: 0, in_progress: 1, open: 0 },
];

const issueBreakdownData = [
  { name: 'Projects and Task Management', completedHigh: 10, completedUI: 5, completedBug: 2 },
  { name: 'Life Compass Lockated', completedHigh: 25, completedUI: 12, completedBug: 8 },
  { name: 'Hi Society (Community)', completedHigh: 60, completedUI: 40, completedBug: 15, openHigh: 5, onHoldUI: 2 },
  { name: 'GoPhygital.work (Corporate)', completedHigh: 15, completedUI: 8, completedBug: 4 },
  { name: 'FM Matrix', completedHigh: 120, completedUI: 65, completedBug: 30, openHigh: 10, inProgressHigh: 15 },
  { name: 'Club Management', completedHigh: 5070, completedUI: 4810, completedBug: 3010, closedUI: 2880, openHigh: 2740, onHoldUI: 1780 },
];

const assigneeTaskData = [
  { name: 'Yash Rathod', open: 5, completed: 2, on_hold: 0, overdue: 0, in_progress: 1 },
  { name: 'Vaishnavi Mugale', open: 8, completed: 4, on_hold: 0, overdue: 1, in_progress: 0 },
  { name: 'Vaibhav Gond', open: 12, completed: 0, on_hold: 0, overdue: 0, in_progress: 0 },
  { name: 'Ubaid Hashmat', open: 3, completed: 1, on_hold: 0, overdue: 0, in_progress: 2 },
  { name: 'Sadanand Gupta', open: 80, completed: 5, on_hold: 2, overdue: 0, in_progress: 1 },
  { name: 'Poonam Patil', open: 35, completed: 0, on_hold: 0, overdue: 0, in_progress: 0 },
  { name: 'Manav Gandhi', open: 40, completed: 10, on_hold: 0, overdue: 0, in_progress: 0 },
  { name: 'Deepak Gupta', open: 25, completed: 0, on_hold: 0, overdue: 0, in_progress: 0 },
  { name: 'Akshay Shinde', open: 28, completed: 12, on_hold: 0, overdue: 0, in_progress: 0 },
  { name: 'Abdul Ghaffar', open: 30, completed: 2, on_hold: 0, overdue: 0, in_progress: 0 },
];

const taskData = [
  { name: 'Wallet Alert API Integration', avg_completion: 0, sum_issue: 0 },
  { name: 'Vendor Portal Finance Meeting', avg_completion: 15, sum_issue: 0 },
  { name: 'Too much buffering while approving...', avg_completion: 0, sum_issue: 1 },
  { name: 'Statutory details issue', avg_completion: 0, sum_issue: 0 },
  { name: 'SAP Logs', avg_completion: 0, sum_issue: 0 },
  { name: 'Revamp Testing', avg_completion: 10, sum_issue: 0 },
  { name: 'Recess club - Purchases API...', avg_completion: 0, sum_issue: 0 },
  { name: 'Payment Recieved GET API...', avg_completion: 45, sum_issue: 5 },
  { name: 'Helpdesk Ticket Creation', avg_completion: 0, sum_issue: 8 },
  { name: 'Fix old data invoicing facility...', avg_completion: 100, sum_issue: 0 },
  { name: 'Dashboard', avg_completion: 0, sum_issue: 0 },
  { name: 'Client Meeting', avg_completion: 0, sum_issue: 50 },
];

const assigneeWiseIssuesData = [
  { name: 'Vaishnavi Mugale', issue_count: 65 },
  { name: 'Vaibhav Gond', issue_count: 10 },
  { name: 'Ubaid Hashmat', issue_count: 5 },
  { name: 'Tejas Chaudhari', issue_count: 8 },
  { name: 'Sumitra Patil', issue_count: 30 },
  { name: 'Sagar Singh', issue_count: 2 },
  { name: 'Rashid Khan', issue_count: 30 },
  { name: 'Priyanshu Singh', issue_count: 12 },
  { name: 'Priya Mane', issue_count: 55 },
  { name: 'Onkar Motewar', issue_count: 160 },
  { name: 'Omkar Chavan', issue_count: 110 },
  { name: 'Kunal Javare', issue_count: 5 },
  { name: 'Dhananjay Bhoyar', issue_count: 30 },
  { name: 'Devesh Jain', issue_count: 10 },
  { name: 'Bilal Shaikh', issue_count: 5 },
  { name: 'Atharv Karnekar', issue_count: 8 },
  { name: 'Akshay Shinde', issue_count: 3 },
  { name: 'Ajay Pihulkar', issue_count: 18 },
  { name: 'Abhishek Sharma', issue_count: 45 },
];

const kpiCards = [
  { title: 'Total Milestones', value: '480', icon: <FileText className="w-6 h-6 text-[#C72030]" /> },
  { title: 'Open Mile Stones', value: '7', icon: <FolderOpen className="w-6 h-6 text-[#C72030]" /> },
  { title: 'Completed Milestones', value: '16', icon: <CheckCircle className="w-6 h-6 text-[#C72030]" /> },
  { title: 'In Progress Milestones', value: '447', icon: <Clock className="w-6 h-6 text-[#C72030]" /> },
  { title: 'Total Tasks', value: '4.83k', icon: <ClipboardList className="w-6 h-6 text-[#C72030]" /> },
  { title: 'Open Tasks', value: '3.93k', icon: <FolderOpen className="w-6 h-6 text-[#C72030]" /> },
  { title: 'In Progress Task', value: '7', icon: <Clock className="w-6 h-6 text-[#C72030]" /> },
  { title: 'Completed Task', value: '786', icon: <CheckCircle className="w-6 h-6 text-[#C72030]" /> },
  { title: 'On Hold Tasks', value: '59', icon: <PauseCircle className="w-6 h-6 text-[#C72030]" /> },
  { title: 'Overdue Tasks', value: '46', icon: <AlertCircle className="w-6 h-6 text-[#C72030]" /> },
  { title: 'Abort Tasks', value: '0', icon: <XCircle className="w-6 h-6 text-[#C72030]" /> },
];

const CHART_OPTIONS = [
  { id: 'projectCompletion', label: 'Project Completion', description: 'Shows task and issue completion percentage' },
  { id: 'milestoneCompletion', label: 'Milestone Completion', description: 'Shows milestone completion and issues' },
  { id: 'assigneeStatus', label: 'Assignee Wise Status', description: 'Shows status of milestones by assignee' },
  { id: 'issueBreakdown', label: 'Project Wise Issue Breakdown', description: 'Detailed issue status by project' },
  { id: 'assigneeTaskStatus', label: 'Assignee - wise Task Status', description: 'Task status grouped by assignee' },
  { id: 'taskStatus', label: 'Task List Status', description: 'Task level completion and issues' },
  { id: 'assigneeWiseIssues', label: 'Assignee Wise Issues', description: 'Shows issue count by assignee' }
];

const CHART_KEYS = CHART_OPTIONS.map((o) => o.id);

const toDDMMYYYY = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
const parseDD = (s) => { const [dd, mm, yyyy] = s.split('/'); return new Date(Number(yyyy), Number(mm) - 1, Number(dd)); };
const getDefaultRange = () => {
  const today = new Date(); const lastYear = new Date(today); lastYear.setFullYear(today.getFullYear() - 1);
  return { startDate: toDDMMYYYY(lastYear), endDate: toDDMMYYYY(today) };
};

// ── SortableChartItem Component ──
const SortableChartItem = ({ id, className, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: isDragging ? 'relative' : 'static',
  };

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


// ─────────────────────────────────────────────────────────
// ── MAIN COMPONENT ──
// ─────────────────────────────────────────────────────────
const DashboardUI = () => {
  const [dateRange, setDateRange] = useState(getDefaultRange);
  const [filterOpen, setFilterOpen] = useState(false);
  
  const [selectedCharts, setSelectedCharts] = useState(CHART_KEYS);
  const [chartOrder, setChartOrder] = useState(CHART_KEYS);

  // Force chart order to reset correctly on mount
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setChartOrder((items) =>
        arrayMove(items, items.indexOf(active.id), items.indexOf(over?.id))
      );
    }
  };

  const handleApplyFilters = (startStr, endStr) => {
    const conv = (s) => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
    setDateRange({ startDate: conv(startStr), endDate: conv(endStr) });
  };

  const orderedVisible = chartOrder.filter((k) => selectedCharts.includes(k));

  const renderChartContent = (id) => {
    switch(id) {
      case 'projectCompletion':
        return (
          <DashboardChart data={projectData} title="Project Completion" xMax={300}
            bars={[
              { dataKey: 'issue_count', name: 'SUM(issue_count)', color: '#D1D5DB' }, 
              { dataKey: 'completion_percent', name: 'SUM(completion_percent)', color: '#CBAE9A' } 
            ]} />
        );
      case 'milestoneCompletion':
        return (
          <DashboardChart data={milestoneData} title="Milestone Completion" xMax={210}
            bars={[
              { dataKey: 'issue_count', name: 'SUM(issue_count)', color: '#9CA3AF' }, 
              { dataKey: 'completion_percent', name: 'AVG(completion_percent)', color: '#A68A7A' } 
            ]} />
        );
      case 'assigneeStatus':
        return (
          <DashboardChart data={assigneeData} title="Assigne Wise Milestone Status" xMax={12}
            bars={[
              { dataKey: 'completed', name: 'completed', color: '#E5E7EB' }, 
              { dataKey: 'on_hold', name: 'on_hold', color: '#D4C4B7' }, 
              { dataKey: 'in_progress', name: 'in_progress', color: '#9CA3AF' }, 
              { dataKey: 'open', name: 'open', color: '#8A7365' } 
            ]} />
        );
      case 'issueBreakdown':
        return (
          <DashboardChart data={issueBreakdownData} title="Project Wise Issue Breakdown" xMax={6000}
            bars={[
              { dataKey: 'completedHigh', name: 'completed, High', color: '#F3F4F6' },
              { dataKey: 'completedUI', name: 'completed, UI', color: '#D1D5DB' },
              { dataKey: 'completedBug', name: 'completed, bug', color: '#9CA3AF' },
              { dataKey: 'closedUI', name: 'closed, UI', color: '#CBAE9A' },
              { dataKey: 'openHigh', name: 'open, High', color: '#A68A7A' },
            ]} />
        );
      case 'assigneeTaskStatus':
        return (
          <DashboardChart data={assigneeTaskData} title="Assignee - wise Task Status" xMax={100} xTicks={[0, 20, 40, 60, 80, 100]}
            bars={[
              { dataKey: 'open', name: 'open', color: '#D4C4B7' }, 
              { dataKey: 'completed', name: 'completed', color: '#D1D5DB' }, 
              { dataKey: 'on_hold', name: 'on_hold', color: '#A68A7A' }, 
              { dataKey: 'overdue', name: 'overdue', color: '#6B7280' }, 
              { dataKey: 'in_progress', name: 'in_progress', color: '#E5E7EB' } 
            ]} />
        );
      case 'taskStatus':
        return (
          <DashboardChart data={taskData} title="Task Completion & Issues" xMax={100} xTicks={[0, 25, 50, 75, 100]}
            bars={[
              { dataKey: 'avg_completion', name: 'AVG(completion_percent)', color: '#CBAE9A' }, 
              { dataKey: 'sum_issue', name: 'SUM(issue_count)', color: '#9CA3AF' } 
            ]} />
        );
      case 'assigneeWiseIssues':
        return (
          <DashboardChart data={assigneeWiseIssuesData} title="Assignee Wise Issues" xMax={180} xTicks={[0, 30, 60, 90, 120, 150, 180]}
            bars={[
              { dataKey: 'issue_count', name: 'COUNT(issue_title)', color: '#A68A7A' } 
            ]} />
        );
      default:
        return null;
    }
  };


  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen bg-white">
      
      {/* Title */}
      <div>
        <div className="text-sm text-gray-600 mb-2">Projects &gt; Dashboard</div>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
          PROJECT DASHBOARD
        </h1>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
        <Button variant="outline" onClick={() => setFilterOpen(true)} className="flex items-center justify-between w-full sm:w-[280px] px-4 py-2 bg-white hover:bg-gray-50 border-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{dateRange.startDate} - {dateRange.endDate}</span>
          </div>
          <Filter className="w-4 h-4 text-gray-600" />
        </Button>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <AssetAnalyticsSelector
            options={CHART_OPTIONS}
            selectedOptions={selectedCharts}
            onSelectionChange={setSelectedCharts}
            title="Select Charts" buttonLabel="Charts"
            dateRange={{ startDate: parseDD(dateRange.startDate), endDate: parseDD(dateRange.endDate) }}
          />
          
          {/* Download Button Added Back Here */}
          <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 px-4 py-2">
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Download PDF</span>
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((item, index) => (
          <div key={index} className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 cursor-pointer min-h-[88px]">
            <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded shrink-0">
              {item.icon}
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{item.value}</div>
              <div className="text-sm font-medium text-[#1A1A1A]">{item.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts with DndContext */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-6 pt-4">
            {orderedVisible.map((key) => (
              <SortableChartItem key={key} id={key}>
                {renderChartContent(key)}
              </SortableChartItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

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

export default DashboardUI;