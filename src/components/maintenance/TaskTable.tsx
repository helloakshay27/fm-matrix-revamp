
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { EnhancedTable } from '../enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface Task {
  id: string;
  checklist: string;
  type: string;
  schedule: string;
  assignTo: string;
  status: string;
  scheduleFor: string;
  assetsServices: string;
  site: string;
  location: string;
  supplier: string;
  graceTime: string;
  duration: string;
  percentage: string;
}

interface TaskTableProps {
  tasks: Task[];
  onViewTask: (taskId: string) => void;
  selectedTasks?: string[];
  onTaskSelection?: (taskIds: string[]) => void;
}

const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
  { key: 'id', label: 'ID', sortable: true, hideable: true, draggable: true },
  { key: 'checklist', label: 'Checklist', sortable: true, hideable: true, draggable: true },
  { key: 'type', label: 'Type', sortable: true, hideable: true, draggable: true },
  { key: 'schedule', label: 'Schedule', sortable: true, hideable: true, draggable: true },
  { key: 'assignTo', label: 'Assign to', sortable: true, hideable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
  { key: 'scheduleFor', label: 'Schedule For', sortable: true, hideable: true, draggable: true },
  { key: 'assetsServices', label: 'Assets/Services', sortable: true, hideable: true, draggable: true },
  { key: 'site', label: 'Site', sortable: true, hideable: true, draggable: true },
  { key: 'location', label: 'Location', sortable: true, hideable: true, draggable: true },
  { key: 'supplier', label: 'Supplier', sortable: true, hideable: true, draggable: true },
  { key: 'graceTime', label: 'Grace Time', sortable: true, hideable: true, draggable: true },
  { key: 'duration', label: 'Duration', sortable: true, hideable: true, draggable: true },
  { key: 'percentage', label: '%', sortable: true, hideable: true, draggable: true }
];

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onViewTask, selectedTasks = [], onTaskSelection }) => {
  const renderRow = (task: Task) => ({
    actions: (
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onViewTask(task.id);
        }}
        className="p-2 h-8 w-8 hover:bg-accent"
      >
        <Eye className="w-4 h-4 text-muted-foreground" />
      </Button>
    ),
    id: task.id,
    checklist: task.checklist,
    type: task.type,
    schedule: task.schedule,
    assignTo: task.assignTo || '-',
    status: (
      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-medium">
        {task.status}
      </span>
    ),
    scheduleFor: task.scheduleFor,
    assetsServices: task.assetsServices,
    site: task.site,
    location: (
      <div className="max-w-xs truncate" title={task.location}>
        {task.location}
      </div>
    ),
    supplier: task.supplier || '-',
    graceTime: task.graceTime,
    duration: task.duration || '-',
    percentage: task.percentage || '-'
  });

  return (
    <div className="bg-white rounded-lg">
      <EnhancedTable
        data={tasks}
        columns={columns}
        renderRow={renderRow}
        enableSearch={true}
        enableSelection={true}
        enableExport={true}
        storageKey="scheduled-tasks-table"
        emptyMessage="No scheduled tasks found"
        searchPlaceholder="Search tasks..."
        exportFileName="scheduled-tasks"
        selectedItems={selectedTasks}
        getItemId={(task) => task.id}
        onSelectItem={(taskId, checked) => {
          if (onTaskSelection) {
            const newSelected = checked 
              ? [...selectedTasks, taskId]
              : selectedTasks.filter(id => id !== taskId);
            onTaskSelection(newSelected);
          }
        }}
        onSelectAll={(checked) => {
          if (onTaskSelection) {
            onTaskSelection(checked ? tasks.map(task => task.id) : []);
          }
        }}
      />
    </div>
  );
};
