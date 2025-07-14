import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Filter, Download, Eye, Edit, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { ScheduleFilterDialog } from '@/components/ScheduleFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

const scheduleData = [{
  id: '11878',
  activityName: 'meter reading',
  amcId: '',
  type: 'PPM',
  scheduleType: 'Asset',
  noOfAssociation: '2',
  validFrom: '01/05/2025, 12:00 AM',
  validTill: '31/05/2025, 11:59 PM',
  category: 'Technical',
  active: true,
  createdOn: '21/05/2025, 01:51 PM'
}, {
  id: '11372',
  activityName: 'All task types 123',
  amcId: '',
  type: 'Routine',
  scheduleType: 'Service',
  noOfAssociation: '1',
  validFrom: '14/08/2024, 05:30 AM',
  validTill: '31/08/2025, 05:30 AM',
  category: 'Non Technical',
  active: true,
  createdOn: '14/08/2024, 04:17 PM'
}];

export const ScheduleListDashboard = () => {
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [schedules, setSchedules] = useState(scheduleData);

  const handleAddSchedule = () => navigate('/maintenance/schedule/add');
  const handleExport = () => navigate('/maintenance/schedule/export');

  const handleToggleActive = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId ? { ...schedule, active: !schedule.active } : schedule
    ));
  };

  const handleEditSchedule = (id: string) => navigate(`/maintenance/schedule/edit/${id}`);
  const handleCopySchedule = (id: string) => navigate(`/maintenance/schedule/copy/${id}`);
  const handleViewSchedule = (id: string) => navigate(`/maintenance/schedule/view/${id}`);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'activityName', label: 'Activity Name', sortable: true },
    { key: 'amcId', label: 'AMC ID', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'scheduleType', label: 'Schedule Type', sortable: true },
    { key: 'noOfAssociation', label: 'No. Of Association', sortable: true },
    { key: 'validFrom', label: 'Valid From', sortable: true },
    { key: 'validTill', label: 'Valid Till', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'active', label: 'Active', sortable: true },
    { key: 'createdOn', label: 'Created On', sortable: true }
  ];

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleAddSchedule} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
      <Button onClick={() => setShowImportModal(true)} variant="outline">
        <Upload className="w-4 h-4 mr-2" /> Import
      </Button>
      <Button onClick={() => setShowFilterDialog(true)} variant="outline">
        <Filter className="w-4 h-4 mr-2" /> Filters
      </Button>
      <Button onClick={handleExport} variant="outline">
        <Download className="w-4 h-4 mr-2" /> Export
      </Button>
    </div>
  );

  const renderRowActions = (schedule) => (
    <div className="flex gap-1">
      <Button variant="ghost" size="sm" onClick={() => handleEditSchedule(schedule.id)}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleCopySchedule(schedule.id)}>
        <Copy className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleViewSchedule(schedule.id)}>
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderCell = (item, columnKey) => {
    if (columnKey === 'category') {
      return (
        <span className={`px-2 py-1 rounded text-xs ${
          item.category === 'Technical' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {item.category}
        </span>
      );
    }
    if (columnKey === 'active') {
      return (
        <div className="flex items-center">
          <div 
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
              item.active ? 'bg-green-500' : 'bg-gray-300'
            }`} 
            onClick={() => handleToggleActive(item.id)}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              item.active ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </div>
        </div>
      );
    }
    return item[columnKey];
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <p className="text-muted-foreground mb-1">Schedule</p>
        <h1 className="text-xl sm:text-2xl font-bold">Schedule List</h1>
      </div>

      <div className="mb-4">
        {renderCustomActions()}
      </div>

      <EnhancedTable
        data={schedules}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderRowActions}
        selectable={true}
        pagination={true}
        enableExport={true}
        exportFileName="schedules"
        onRowClick={handleViewSchedule}
        storageKey="schedules-table"
      />

      <BulkUploadDialog open={showImportModal} onOpenChange={setShowImportModal} title="Bulk Upload" />
      <ScheduleFilterDialog open={showFilterDialog} onOpenChange={setShowFilterDialog} />
    </div>
  );
};
