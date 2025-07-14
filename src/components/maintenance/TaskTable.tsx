
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
  
  // External control props
  visibleColumns: string[];
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (column: string) => void;
  selectedTasks: string[];
  onSelectTask: (taskId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  
  // Optional props for search
  searchTerm?: string;
}

export const columns: ColumnConfig[] = [
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
  { key: 'percentage', label: '%', sortable: true, hideable: true, draggable: true },
  { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false }
];

export const TaskTable: React.FC<TaskTableProps> = ({ 
  tasks, 
  onViewTask, 
  visibleColumns, 
  sortColumn, 
  sortDirection, 
  onSort, 
  selectedTasks, 
  onSelectTask, 
  onSelectAll,
  searchTerm 
}) => {
  // Filter tasks based on search term
  const filteredTasks = searchTerm 
    ? tasks.filter(task => 
        Object.values(task).some(value => 
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : tasks;

  // Sort tasks
  const sortedTasks = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredTasks;
    
    return [...filteredTasks].sort((a, b) => {
      const aValue = a[sortColumn as keyof Task]?.toString() || '';
      const bValue = b[sortColumn as keyof Task]?.toString() || '';
      
      const comparison = aValue.localeCompare(bValue, undefined, { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredTasks, sortColumn, sortDirection]);

  const isAllSelected = selectedTasks.length === sortedTasks.length && sortedTasks.length > 0;
  const isIndeterminate = selectedTasks.length > 0 && selectedTasks.length < sortedTasks.length;

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4 opacity-50" />;
  };

  const renderCellContent = (task: Task, columnKey: string) => {
    switch (columnKey) {
      case 'assignTo':
        return task.assignTo || '-';
      case 'status':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-medium">
            {task.status}
          </span>
        );
      case 'location':
        return (
          <div className="max-w-xs truncate" title={task.location}>
            {task.location}
          </div>
        );
      case 'supplier':
        return task.supplier || '-';
      case 'duration':
        return task.duration || '-';
      case 'percentage':
        return task.percentage || '-';
      case 'actions':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewTask(task.id)}
            className="p-2 h-8 w-8 hover:bg-accent"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </Button>
        );
      default:
        return task[columnKey as keyof Task];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Selection Column */}
              <TableHead className="bg-[#f6f4ee] w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                  {...(isIndeterminate && { 'data-state': 'indeterminate' })}
                />
              </TableHead>
              
              {/* Dynamic Columns */}
              {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                <TableHead 
                  key={column.key} 
                  className="bg-[#f6f4ee] cursor-pointer hover:bg-[#f0ede5] transition-colors"
                  onClick={() => column.sortable && onSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id} className="hover:bg-gray-50">
                {/* Selection Cell */}
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={(checked) => onSelectTask(task.id, checked as boolean)}
                  />
                </TableCell>
                
                {/* Dynamic Cells */}
                {columns.filter(col => visibleColumns.includes(col.key)).map((column) => (
                  <TableCell key={column.key} className={column.key === 'id' ? 'font-medium' : ''}>
                    {renderCellContent(task, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {sortedTasks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'No tasks found matching your search.' : 'No tasks available.'}
        </div>
      )}
    </div>
  );
};
