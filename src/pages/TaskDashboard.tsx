import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Filter, Download, Ticket, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { TaskAdvancedFilterDialog } from '@/components/TaskAdvancedFilterDialog';

const taskData = [
  {
    id: '1', taskNumber: 'Task 123', description: 'Implement user authentication', category: 'Development',
    subCategory: 'Backend', createdBy: 'John Doe', assignedTo: 'Alice Smith', unit: 'Unit A',
    site: 'Site X', building: 'Building 1', wing: 'Wing A', floor: '1', area: 'Area 1', room: 'Room 101', priority: 'High',
    status: 'Open', createdOn: '2024-07-01', mode: 'Email'
  },
  {
    id: '2', taskNumber: 'Task 456', description: 'Design new UI components', category: 'Design',
    subCategory: 'UI Design', createdBy: 'Jane Smith', assignedTo: 'Bob Johnson', unit: 'Unit B',
    site: 'Site Y', building: 'Building 2', wing: 'Wing B', floor: '2', area: 'Area 2', room: 'Room 202', priority: 'Medium',
    status: 'In Progress', createdOn: '2024-07-02', mode: 'Phone'
  },
  {
    id: '3', taskNumber: 'Task 789', description: 'Test API endpoints', category: 'Testing',
    subCategory: 'API Testing', createdBy: 'Mike Brown', assignedTo: 'Charlie Davis', unit: 'Unit C',
    site: 'Site Z', building: 'Building 3', wing: 'Wing C', floor: '3', area: 'Area 3', room: 'Room 303', priority: 'Low',
    status: 'Pending', createdOn: '2024-07-03', mode: 'Web'
  }
];

export const TaskDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(taskData);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const totalTasks = taskData.length;
  const openTasks = taskData.filter(t => t.status === 'Open').length;
  const inProgressTasks = taskData.filter(t => t.status === 'In Progress').length;
  const pendingTasks = taskData.filter(t => t.status === 'Pending').length;
  const closedTasks = taskData.filter(t => t.status === 'Closed').length;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = taskData.filter(task =>
        task.id.toLowerCase().includes(value.toLowerCase()) ||
        task.taskNumber.toLowerCase().includes(value.toLowerCase()) ||
        task.description.toLowerCase().includes(value.toLowerCase()) ||
        task.category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(taskData);
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status === 'all') {
      setFilteredTasks(taskData);
    } else {
      const filtered = taskData.filter(task =>
        task.status.toLowerCase() === status.toLowerCase()
      );
      setFilteredTasks(filtered);
    }
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleExport = () => {
    const tasksToExport = selectedTasks.length > 0
      ? filteredTasks.filter(task => selectedTasks.includes(task.id))
      : filteredTasks;

    const csvContent = [
      ['Task ID', 'Task Number', 'Description', 'Category', 'Sub Category', 'Created By', 'Assigned To', 'Status', 'Priority', 'Created On'],
      ...tasksToExport.map(task => [
        task.id,
        task.taskNumber,
        task.description,
        task.category,
        task.subCategory,
        task.createdBy,
        task.assignedTo,
        task.status,
        task.priority,
        task.createdOn
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewDetails = (taskId: string) => {
    navigate(`/maintenance/task/details/${taskId}`);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <p className="text-gray-600 mb-2 text-sm">Tasks &gt; Task List</p>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">TASK LIST</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Tasks', value: totalTasks, icon: Ticket, iconName: 'Ticket' },
          { label: 'Open', value: openTasks, icon: AlertCircle, iconName: 'AlertCircle' },
          { label: 'In Progress', value: inProgressTasks, icon: Clock, iconName: 'Clock' },
          { label: 'Pending', value: pendingTasks, icon: Clock, iconName: 'Clock' },
          { label: 'Closed', value: closedTasks, icon: CheckCircle, iconName: 'CheckCircle' }
        ].map((item, i) => {
          const IconComponent = item.icon;
          return (
            <div key={i} className="bg-[#F2F0EB] text-[#D92818] p-3 sm:p-4 rounded-lg text-center shadow-[0px_2px_18px_rgba(45,45,45,0.1)] h-[100px] sm:h-[132px] flex flex-col items-center justify-center">
              <div className="mb-2">
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-sm">{item.label}</div>
              <div className="text-xs text-gray-500 mt-1">{item.iconName}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <Button onClick={() => navigate('/maintenance/task/add')} className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white" onClick={() => setIsFilterOpen(true)}>
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white" onClick={() => {
          setSearchTerm('');
          setFilteredTasks(taskData);
          setStatusFilter('all');
          setSelectedTasks([]);
        }}>Reset</Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><input type="checkbox" onChange={(e) => setSelectedTasks(e.target.checked ? filteredTasks.map(t => t.id) : [])} checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0} /></TableHead>
              <TableHead>View</TableHead>
              <TableHead>Task ID</TableHead>
              <TableHead>Task Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Created On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell><input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={() => handleTaskSelect(task.id)} /></TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => handleViewDetails(task.id)}><Eye className="w-4 h-4" /></Button></TableCell>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.taskNumber}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.category}</TableCell>
                <TableCell>{task.subCategory}</TableCell>
                <TableCell>{task.createdBy}</TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${task.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : task.status === 'Closed' ? 'bg-green-100 text-green-700' : task.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{task.status}</span></TableCell>
                <TableCell><span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">{task.priority}</span></TableCell>
                <TableCell>{task.site}</TableCell>
                <TableCell>{task.unit}</TableCell>
                <TableCell>Technician</TableCell>
                <TableCell>{task.createdOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaskAdvancedFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={(filters) => {
          console.log('Applied filters:', filters);
          setIsFilterOpen(false);
        }}
      />
    </div>
  );
};
