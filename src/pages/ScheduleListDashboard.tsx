import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Filter, Download, Eye, Edit, Copy, Calendar, BarChart3, Clock, Settings, Wrench, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { ScheduleFilterDialog } from '@/components/ScheduleFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ScheduleSelector } from '@/components/ScheduleSelector';
import { RecentSchedulesSidebar } from '@/components/RecentSchedulesSidebar';
import { Cell, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [selectedItems, setSelectedItems] = useState<string[]>(['checklist', 'technical-checklist', 'non-technical-checklist']);
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

  // Analytics data calculations
  const totalSchedules = schedules.length;
  const activeSchedules = schedules.filter(s => s.active).length;
  const inactiveSchedules = totalSchedules - activeSchedules;
  const ppmSchedules = schedules.filter(s => s.type === 'PPM').length;
  const routineSchedules = schedules.filter(s => s.type === 'Routine').length;
  const safetySchedules = schedules.filter(s => s.type === 'Safety').length;

  const scheduleCards = [
    { title: 'Total Schedules', value: totalSchedules, icon: Calendar, gradient: 'from-blue-500 to-purple-600' },
    { title: 'Active Schedules', value: activeSchedules, icon: BarChart3, gradient: 'from-green-500 to-emerald-600' },
    { title: 'Inactive Schedules', value: inactiveSchedules, icon: Clock, gradient: 'from-red-500 to-orange-600' },
    { title: 'PPM Schedules', value: ppmSchedules, icon: Settings, gradient: 'from-blue-400 to-blue-600' },
    { title: 'Routine Schedules', value: routineSchedules, icon: Wrench, gradient: 'from-purple-500 to-purple-700' },
    { title: 'Safety Schedules', value: safetySchedules, icon: Shield, gradient: 'from-orange-500 to-red-600' }
  ];

  const typeChartData = [
    { name: 'PPM', value: ppmSchedules, fill: '#8884d8' },
    { name: 'Routine', value: routineSchedules, fill: '#82ca9d' },
    { name: 'Safety', value: safetySchedules, fill: '#ffc658' }
  ];

  const categoryChartData = [
    { name: 'Technical', count: schedules.filter(s => s.category === 'Technical').length },
    { name: 'Non Technical', count: schedules.filter(s => s.category === 'Non Technical').length }
  ];

  const associationData = [
    { range: '1-2', count: schedules.filter(s => parseInt(s.noOfAssociation) <= 2).length },
    { range: '3-4', count: schedules.filter(s => parseInt(s.noOfAssociation) >= 3 && parseInt(s.noOfAssociation) <= 4).length },
    { range: '5+', count: schedules.filter(s => parseInt(s.noOfAssociation) >= 5).length }
  ];

  const agingData = [
    { category: 'Technical PPM', low: 5, medium: 3, high: 2 },
    { category: 'Technical Routine', low: 2, medium: 1, high: 0 },
    { category: 'Non-Technical Routine', low: 4, medium: 2, high: 0 },
    { category: 'Safety', low: 1, medium: 1, high: 0 }
  ];

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduleCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`relative p-6 rounded-lg bg-gradient-to-r ${card.gradient} text-white overflow-hidden`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                  </div>
                  <IconComponent className="w-8 h-8 text-white/80" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
            </div>
          );
        })}
      </div>

      {/* Selector */}
      <div className="flex justify-start">
        <ScheduleSelector
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
        />
      </div>

      {/* Charts and Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Charts Row 1 */}
          {selectedItems.includes('checklist') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-[hsl(var(--analytics-border))]">
                <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--analytics-text))]">Schedule Type Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={typeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 border border-[hsl(var(--analytics-border))]">
                <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--analytics-text))]">Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#D2B48C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Charts Row 2 */}
          {(selectedItems.includes('technical-checklist') || selectedItems.includes('non-technical-checklist')) && (
            <div className="bg-white p-6 border border-[hsl(var(--analytics-border))]">
              <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--analytics-text))]">Association Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={associationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D2B48C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Aging Matrix */}
          {selectedItems.includes('top-10-checklist') && (
            <div className="bg-white p-6 border border-[hsl(var(--analytics-border))]">
              <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--analytics-text))]">Schedule Aging Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[hsl(var(--analytics-border))]">
                      <th className="text-left p-2 text-[hsl(var(--analytics-text))]">Category</th>
                      <th className="text-center p-2 text-green-600">Low Priority</th>
                      <th className="text-center p-2 text-yellow-600">Medium Priority</th>
                      <th className="text-center p-2 text-red-600">High Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agingData.map((row, index) => (
                      <tr key={index} className="border-b border-[hsl(var(--analytics-border))]">
                        <td className="p-2 font-medium text-[hsl(var(--analytics-text))]">{row.category}</td>
                        <td className="text-center p-2 text-green-600">{row.low}</td>
                        <td className="text-center p-2 text-yellow-600">{row.medium}</td>
                        <td className="text-center p-2 text-red-600">{row.high}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent Schedules Sidebar */}
        <div className="lg:col-span-1">
          <RecentSchedulesSidebar />
        </div>
      </div>
    </div>
  );

  const renderListTab = () => (
    <div className="space-y-4">
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
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <p className="text-muted-foreground mb-1">Schedule</p>
        <h1 className="text-xl sm:text-2xl font-bold">Schedule Dashboard</h1>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-6">
          {renderAnalyticsTab()}
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          {renderListTab()}
        </TabsContent>
      </Tabs>

      <BulkUploadDialog open={showImportModal} onOpenChange={setShowImportModal} title="Bulk Upload" />
      <ScheduleFilterDialog open={showFilterDialog} onOpenChange={setShowFilterDialog} />
    </div>
  );
};
