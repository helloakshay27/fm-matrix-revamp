
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Plus, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VendorAuditScheduledDashboard = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCopy = (id: string) => {
    navigate('/maintenance/audit/vendor/scheduled/copy');
  };

  const handleAdd = () => {
    navigate('/maintenance/audit/vendor/scheduled/add');
  };

  const handleIdClick = (id: string) => {
    navigate(`/maintenance/audit/vendor/scheduled/view/${id}`);
  };

  const scheduleData = [
    {
      id: "11549",
      activityName: "Engineering Audit Checklist 2",
      noOfAssociation: 0,
      task: "No",
      taskAssignedTo: "",
      createdOn: "10/12/2024, 06:21 PM"
    }
  ];

  const columns = [
    { key: 'action', label: 'Action', sortable: false, draggable: true },
    { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'activityName', label: 'Activity Name', sortable: true, draggable: true },
    { key: 'noOfAssociation', label: 'No. Of Association', sortable: true, draggable: true },
    { key: 'task', label: 'Task', sortable: true, draggable: true },
    { key: 'taskAssignedTo', label: 'Task Assigned To', sortable: true, draggable: true },
    { key: 'createdOn', label: 'Created on', sortable: true, draggable: true },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'action':
        return (
          <Button
            onClick={() => handleCopy(item.id)}
            size="sm"
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90"
          >
            <Copy className="w-4 h-4" />
          </Button>
        );
      case 'id':
        return (
          <button
            onClick={() => handleIdClick(item.id)}
            className="text-blue-600 hover:underline font-medium"
          >
            {item.id}
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(scheduleData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Schedule</span>
          <span className="mx-2">{'>'}</span>
          <span>Schedule List</span>
        </nav>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">SCHEDULE LIST</h1>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <Button 
          onClick={handleAdd}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <EnhancedTable
          data={scheduleData}
          columns={columns}
          renderCell={renderCell}
          selectable={true}
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          getItemId={(item) => item.id}
          storageKey="vendor-schedule-table"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default VendorAuditScheduledDashboard;
