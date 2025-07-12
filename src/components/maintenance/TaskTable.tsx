
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';

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
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onViewTask }) => {
  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Checklist</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Assign to</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Schedule For</TableHead>
            <TableHead>Assets/Services</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Grace Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-gray-50">
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewTask(task.id)}
                  className="p-2 h-8 w-8 hover:bg-accent"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
              <TableCell className="font-medium">{task.id}</TableCell>
              <TableCell>{task.checklist}</TableCell>
              <TableCell>{task.type}</TableCell>
              <TableCell>{task.schedule}</TableCell>
              <TableCell>{task.assignTo || '-'}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-medium">
                  {task.status}
                </span>
              </TableCell>
              <TableCell>{task.scheduleFor}</TableCell>
              <TableCell>{task.assetsServices}</TableCell>
              <TableCell>{task.site}</TableCell>
              <TableCell className="max-w-xs truncate" title={task.location}>
                {task.location}
              </TableCell>
              <TableCell>{task.supplier || '-'}</TableCell>
              <TableCell>{task.graceTime}</TableCell>
              <TableCell>{task.duration || '-'}</TableCell>
              <TableCell>{task.percentage || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
