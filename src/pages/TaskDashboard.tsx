import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download, Ticket, Clock, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { TaskAdvancedFilterDialog } from '@/components/TaskAdvancedFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

const taskData = [{
  id: '1',
  taskNumber: 'Task 123',
  description: 'Implement user authentication',
  category: 'Development',
  subCategory: 'Backend',
  createdBy: 'John Doe',
  assignedTo: 'Alice Smith',
  unit: 'Unit A',
  site: 'Site X',
  building: 'Building 1',
  wing: 'Wing A',
  floor: '1',
  area: 'Area 1',
  room: 'Room 101',
  priority: 'High',
  status: 'Open',
  createdOn: '2024-07-01',
  mode: 'Email'
}, {
  id: '2',
  taskNumber: 'Task 456',
  description: 'Design new UI components',
  category: 'Design',
  subCategory: 'UI Design',
  createdBy: 'Jane Smith',
  assignedTo: 'Bob Johnson',
  unit: 'Unit B',
  site: 'Site Y',
  building: 'Building 2',
  wing: 'Wing B',
  floor: '2',
  area: 'Area 2',
  room: 'Room 202',
  priority: 'Medium',
  status: 'In Progress',
  createdOn: '2024-07-02',
  mode: 'Phone'
}, {
  id: '3',
  taskNumber: 'Task 789',
  description: 'Test API endpoints',
  category: 'Testing',
  subCategory: 'API Testing',
  createdBy: 'Mike Brown',
  assignedTo: 'Charlie Davis',
  unit: 'Unit C',
  site: 'Site Z',
  building: 'Building 3',
  wing: 'Wing C',
  floor: '3',
  area: 'Area 3',
  room: 'Room 303',
  priority: 'Low',
  status: 'Pending',
  createdOn: '2024-07-03',
  mode: 'Web'
}];

export const TaskDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const totalTasks = taskData.length;
  const openTasks = taskData.filter(t => t.status === 'Open').length;
  const inProgressTasks = taskData.filter(t => t.status === 'In Progress').length;
  const pendingTasks = taskData.filter(t => t.status === 'Pending').length;
  const closedTasks = taskData.filter(t => t.status === 'Closed').length;

  const handleViewDetails = (taskId: string) => {
    navigate(`/maintenance/task/details/${taskId}`);
  };

  const columns = [{
    key: 'actions',
    label: 'Actions',
    sortable: false
  }, {
    key: 'id',
    label: 'Task ID',
    sortable: true
  }, {
    key: 'taskNumber',
    label: 'Task Number',
    sortable: true
  }, {
    key: 'description',
    label: 'Description',
    sortable: true
  }, {
    key: 'category',
    label: 'Category',
    sortable: true
  }, {
    key: 'subCategory',
    label: 'Sub Category',
    sortable: true
  }, {
    key: 'createdBy',
    label: 'Created By',
    sortable: true
  }, {
    key: 'assignedTo',
    label: 'Assigned To',
    sortable: true
  }, {
    key: 'status',
    label: 'Status',
    sortable: true
  }, {
    key: 'priority',
    label: 'Priority',
    sortable: true
  }, {
    key: 'site',
    label: 'Site',
    sortable: true
  }, {
    key: 'unit',
    label: 'Unit',
    sortable: true
  }, {
    key: 'createdOn',
    label: 'Created On',
    sortable: true
  }];

  const renderCustomActions = () => <div className="flex flex-wrap gap-3">
      <Button onClick={() => navigate('/maintenance/task/add')} className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium">
        <Plus className="w-4 h-4 mr-2" /> Action
      </Button>
      <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white" onClick={() => setIsFilterOpen(true)}>
        <Filter className="w-4 h-4 mr-2" /> Filters
      </Button>
      <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white">
        <Download className="w-4 h-4 mr-2" /> Export
      </Button>
    </div>;

  const renderCell = (item, columnKey) => {
    if (columnKey === 'actions') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleViewDetails(item.id)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      );
    }
    if (columnKey === 'status') {
      return <span className={`px-2 py-1 rounded text-xs ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : item.status === 'Closed' ? 'bg-green-100 text-green-700' : item.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
          {item.status}
        </span>;
    }
    if (columnKey === 'priority') {
      return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
          {item.priority}
        </span>;
    }
    return item[columnKey];
  };

  return <div className="p-4 sm:p-6">
      <div className="mb-6">
        
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">TASK LIST</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[{
        label: 'Total Tasks',
        value: totalTasks,
        icon: Ticket,
        iconName: 'Ticket'
      }, {
        label: 'Open',
        value: openTasks,
        icon: AlertCircle,
        iconName: 'AlertCircle'
      }, {
        label: 'In Progress',
        value: inProgressTasks,
        icon: Clock,
        iconName: 'Clock'
      }, {
        label: 'Pending',
        value: pendingTasks,
        icon: Clock,
        iconName: 'Clock'
      }, {
        label: 'Closed',
        value: closedTasks,
        icon: CheckCircle,
        iconName: 'CheckCircle'
      }].map((item, i) => {
        const IconComponent = item.icon;
        return <div key={i} className="bg-[#F5F3F0] p-4 rounded-lg shadow-sm h-[132px] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFE8E9] flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 text-[#C72030]" />
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-[#C72030] leading-tight">{item.value}</div>
                <div className="text-sm text-gray-600 font-medium">{item.label}</div>
              </div>
            </div>;
      })}
      </div>

      <div className="mb-4">
        {renderCustomActions()}
      </div>

      <EnhancedTable 
        data={taskData} 
        columns={columns} 
        renderCell={renderCell} 
        selectable={true} 
        pagination={true} 
        pageSize={10}
        enableExport={true} 
        exportFileName="tasks" 
        onRowClick={handleViewDetails} 
        storageKey="tasks-table" 
      />

      <TaskAdvancedFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={filters => {
      console.log('Applied filters:', filters);
      setIsFilterOpen(false);
    }} />
    </div>;
};
