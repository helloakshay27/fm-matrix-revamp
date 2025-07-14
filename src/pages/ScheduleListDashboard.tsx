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
}, {
  id: '11877',
  activityName: 'HVAC System Maintenance',
  amcId: 'AMC001',
  type: 'PPM',
  scheduleType: 'Asset',
  noOfAssociation: '5',
  validFrom: '01/06/2025, 08:00 AM',
  validTill: '30/06/2025, 08:00 PM',
  category: 'Technical',
  active: true,
  createdOn: '20/05/2025, 10:30 AM'
}, {
  id: '11876',
  activityName: 'Fire Safety Inspection',
  amcId: 'AMC002',
  type: 'Safety',
  scheduleType: 'Service',
  noOfAssociation: '3',
  validFrom: '15/05/2025, 09:00 AM',
  validTill: '15/08/2025, 05:00 PM',
  category: 'Technical',
  active: false,
  createdOn: '19/05/2025, 02:15 PM'
}, {
  id: '11875',
  activityName: 'Elevator Maintenance Check',
  amcId: 'AMC003',
  type: 'PPM',
  scheduleType: 'Asset',
  noOfAssociation: '2',
  validFrom: '10/05/2025, 07:00 AM',
  validTill: '10/05/2026, 07:00 AM',
  category: 'Technical',
  active: true,
  createdOn: '18/05/2025, 11:45 AM'
}, {
  id: '11874',
  activityName: 'Cleaning Service - Washrooms',
  amcId: '',
  type: 'Routine',
  scheduleType: 'Service',
  noOfAssociation: '4',
  validFrom: '01/05/2025, 06:00 AM',
  validTill: '30/04/2026, 11:59 PM',
  category: 'Non Technical',
  active: true,
  createdOn: '17/05/2025, 03:20 PM'
}, {
  id: '11873',
  activityName: 'Security System Check',
  amcId: 'AMC004',
  type: 'PPM',
  scheduleType: 'Asset',
  noOfAssociation: '6',
  validFrom: '05/05/2025, 10:00 AM',
  validTill: '05/11/2025, 10:00 PM',
  category: 'Technical',
  active: true,
  createdOn: '16/05/2025, 09:10 AM'
}, {
  id: '11872',
  activityName: 'Garden Maintenance',
  amcId: '',
  type: 'Routine',
  scheduleType: 'Service',
  noOfAssociation: '2',
  validFrom: '20/04/2025, 07:30 AM',
  validTill: '20/10/2025, 06:30 PM',
  category: 'Non Technical',
  active: false,
  createdOn: '15/05/2025, 04:45 PM'
}, {
  id: '11871',
  activityName: 'Generator Testing',
  amcId: 'AMC005',
  type: 'PPM',
  scheduleType: 'Asset',
  noOfAssociation: '1',
  validFrom: '25/04/2025, 08:00 AM',
  validTill: '25/04/2026, 08:00 AM',
  category: 'Technical',
  active: true,
  createdOn: '14/05/2025, 01:30 PM'
}, {
  id: '11870',
  activityName: 'Water Tank Cleaning',
  amcId: '',
  type: 'Routine',
  scheduleType: 'Service',
  noOfAssociation: '3',
  validFrom: '15/04/2025, 09:00 AM',
  validTill: '15/07/2025, 09:00 AM',
  category: 'Non Technical',
  active: true,
  createdOn: '13/05/2025, 11:15 AM'
}, {
  id: '11869',
  activityName: 'Electrical Panel Inspection',
  amcId: 'AMC006',
  type: 'Safety',
  scheduleType: 'Asset',
  noOfAssociation: '4',
  validFrom: '10/04/2025, 10:00 AM',
  validTill: '10/01/2026, 10:00 AM',
  category: 'Technical',
  active: true,
  createdOn: '12/05/2025, 02:50 PM'
}, {
  id: '11868',
  activityName: 'Pest Control Service',
  amcId: '',
  type: 'Routine',
  scheduleType: 'Service',
  noOfAssociation: '2',
  validFrom: '01/04/2025, 06:00 AM',
  validTill: '31/03/2026, 11:59 PM',
  category: 'Non Technical',
  active: false,
  createdOn: '11/05/2025, 10:25 AM'
}, {
  id: '11867',
  activityName: 'Air Conditioning Filter Change',
  amcId: 'AMC007',
  type: 'PPM',
  scheduleType: 'Asset',
  noOfAssociation: '8',
  validFrom: '20/03/2025, 09:30 AM',
  validTill: '20/09/2025, 09:30 AM',
  category: 'Technical',
  active: true,
  createdOn: '10/05/2025, 03:40 PM'
}, {
  id: '11866',
  activityName: 'Floor Polishing Service',
  amcId: '',
  type: 'Routine',
  scheduleType: 'Service',
  noOfAssociation: '3',
  validFrom: '15/03/2025, 07:00 AM',
  validTill: '15/06/2025, 07:00 PM',
  category: 'Non Technical',
  active: true,
  createdOn: '09/05/2025, 12:05 PM'
}, {
  id: '11865',
  activityName: 'UPS Battery Check',
  amcId: 'AMC008',
  type: 'PPM',
  scheduleType: 'Asset',
  noOfAssociation: '2',
  validFrom: '01/03/2025, 11:00 AM',
  validTill: '01/09/2025, 11:00 AM',
  category: 'Technical',
  active: true,
  createdOn: '08/05/2025, 04:20 PM'
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
