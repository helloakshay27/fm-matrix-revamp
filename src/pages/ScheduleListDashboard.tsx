import React, { useState, useEffect } from 'react';
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
import { fetchCustomForms, transformCustomFormsData, TransformedScheduleData } from '@/services/customFormsAPI';
import { useQuery } from '@tanstack/react-query';
export const ScheduleListDashboard = () => {
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(['checklist', 'technical-checklist', 'non-technical-checklist']);

  // Fetch custom forms data
  const {
    data: customFormsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['custom-forms'],
    queryFn: fetchCustomForms
  });

  // Transform the data
  const schedules = customFormsData ? transformCustomFormsData(customFormsData.custom_forms) : [];
  const handleAddSchedule = () => navigate('/maintenance/schedule/add');
  const handleExport = () => navigate('/maintenance/schedule/export');
  const handleToggleActive = (scheduleId: string) => {
    // This would typically make an API call to update the active status
    console.log('Toggle active for schedule:', scheduleId);
  };
  const handleEditSchedule = (id: string) => navigate(`/maintenance/schedule/edit/${id}`);
  const handleCopySchedule = (id: string) => navigate(`/maintenance/schedule/copy/${id}`);
  const handleViewSchedule = (item: TransformedScheduleData) => navigate(`/maintenance/schedule/view/${item.id}`);
  const columns = [{
    key: 'id',
    label: 'ID',
    sortable: true
  }, {
    key: 'activityName',
    label: 'Activity Name',
    sortable: true
  }, {
    key: 'type',
    label: 'Type',
    sortable: true
  }, {
    key: 'scheduleType',
    label: 'Schedule Type',
    sortable: true
  }, {
    key: 'noOfAssociation',
    label: 'No. Of Association',
    sortable: true
  }, {
    key: 'validFrom',
    label: 'Valid From',
    sortable: true
  }, {
    key: 'validTill',
    label: 'Valid Till',
    sortable: true
  }, {
    key: 'category',
    label: 'Category',
    sortable: true
  }, {
    key: 'active',
    label: 'Active',
    sortable: true
  }, {
    key: 'createdOn',
    label: 'Created On',
    sortable: true
  }];
  const renderCustomActions = () => <div className="flex flex-wrap gap-3">
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
    </div>;
  const renderRowActions = (schedule: TransformedScheduleData) => <div className="flex gap-1">
      <Button variant="ghost" size="sm" onClick={() => handleEditSchedule(schedule.id)}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleCopySchedule(schedule.id)}>
        <Copy className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleViewSchedule(schedule)}>
        <Eye className="w-4 h-4" />
      </Button>
    </div>;
  const renderCell = (item: TransformedScheduleData, columnKey: string) => {
    if (columnKey === 'category') {
      return <span className={`px-2 py-1 rounded text-xs ${item.category === 'Technical' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
          {item.category}
        </span>;
    }
    if (columnKey === 'active') {
      return <div className="flex items-center">
          <div className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => handleToggleActive(item.id)}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
        </div>;
    }
    return item[columnKey as keyof TransformedScheduleData];
  };

  // Analytics data calculations
  const totalSchedules = schedules.length;
  const activeSchedules = schedules.filter(s => s.active).length;
  const inactiveSchedules = totalSchedules - activeSchedules;
  const ppmSchedules = schedules.filter(s => s.type === 'PPM').length;
  const routineSchedules = schedules.filter(s => s.type === 'Routine').length;
  const safetySchedules = schedules.filter(s => s.type === 'Safety').length;
  const scheduleCards = [{
    title: 'Total Schedules',
    value: totalSchedules,
    icon: Calendar,
    gradient: 'from-blue-500 to-purple-600'
  }, {
    title: 'Active Schedules',
    value: activeSchedules,
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-600'
  }, {
    title: 'Inactive Schedules',
    value: inactiveSchedules,
    icon: Clock,
    gradient: 'from-red-500 to-orange-600'
  }, {
    title: 'PPM Schedules',
    value: ppmSchedules,
    icon: Settings,
    gradient: 'from-blue-400 to-blue-600'
  }, {
    title: 'Routine Schedules',
    value: routineSchedules,
    icon: Wrench,
    gradient: 'from-purple-500 to-purple-700'
  }, {
    title: 'Safety Schedules',
    value: safetySchedules,
    icon: Shield,
    gradient: 'from-orange-500 to-red-600'
  }];
  const typeChartData = [{
    name: 'PPM',
    value: ppmSchedules,
    fill: '#C72030'
  }, {
    name: 'Routine',
    value: routineSchedules,
    fill: '#D2B48C'
  }, {
    name: 'Safety',
    value: safetySchedules,
    fill: '#8B4513'
  }];
  const categoryChartData = [{
    name: 'Technical',
    count: schedules.filter(s => s.category === 'Technical').length
  }, {
    name: 'Non Technical',
    count: schedules.filter(s => s.category === 'Non Technical').length
  }];
  const associationData = [{
    range: '1-2',
    count: schedules.filter(s => parseInt(s.noOfAssociation) <= 2).length
  }, {
    range: '3-4',
    count: schedules.filter(s => parseInt(s.noOfAssociation) >= 3 && parseInt(s.noOfAssociation) <= 4).length
  }, {
    range: '5+',
    count: schedules.filter(s => parseInt(s.noOfAssociation) >= 5).length
  }];
  const agingData = [{
    category: 'Technical PPM',
    low: schedules.filter(s => s.category === 'Technical' && s.type === 'PPM').length,
    medium: 0,
    high: 0
  }, {
    category: 'Technical Routine',
    low: schedules.filter(s => s.category === 'Technical' && s.type === 'Routine').length,
    medium: 0,
    high: 0
  }, {
    category: 'Non-Technical Routine',
    low: schedules.filter(s => s.category === 'Non Technical' && s.type === 'Routine').length,
    medium: 0,
    high: 0
  }, {
    category: 'Safety',
    low: schedules.filter(s => s.type === 'Safety').length,
    medium: 0,
    high: 0
  }];
  const renderAnalyticsTab = () => <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        {/* Total Schedules */}
        <div className="p-4 rounded-lg flex items-center gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#C72030]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">{totalSchedules}</div>
            <div className="text-sm text-gray-600">Total Schedules</div>
          </div>
        </div>

        {/* Active Schedules */}
        <div className="p-4 rounded-lg flex items-center gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-[#C72030]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">{activeSchedules}</div>
            <div className="text-sm text-gray-600">Active Schedules</div>
          </div>
        </div>

        {/* Inactive Schedules */}
        <div className="p-4 rounded-lg flex items-center gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-[#C72030]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">{inactiveSchedules}</div>
            <div className="text-sm text-gray-600">Inactive Schedules</div>
          </div>
        </div>

        {/* PPM Schedules */}
        <div className="p-4 rounded-lg flex items-center gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
            <Settings className="w-6 h-6 text-[#C72030]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">{ppmSchedules}</div>
            <div className="text-sm text-gray-600">PPM Schedules</div>
          </div>
        </div>

        {/* Routine Schedules */}
        <div className="p-4 rounded-lg flex items-center gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
            <Wrench className="w-6 h-6 text-[#C72030]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">{routineSchedules}</div>
            <div className="text-sm text-gray-600">Routine Schedules</div>
          </div>
        </div>

        {/* Safety Schedules */}
        <div className="p-4 rounded-lg flex items-center gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#C72030]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">{safetySchedules}</div>
            <div className="text-sm text-gray-600">Safety Schedules</div>
          </div>
        </div>
      </div>

      {/* Header with Schedule Selector */}
      <div className="flex justify-end">
        <ScheduleSelector selectedItems={selectedItems} onSelectionChange={setSelectedItems} />
      </div>

      {/* Main Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Section - Charts (3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Charts Row 1 */}
          {selectedItems.includes('checklist') && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-[hsl(var(--analytics-border))]">
                <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--analytics-text))]">Schedule Type Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={typeChartData} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  percent
                }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {typeChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
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
            </div>}

          {/* Charts Row 2 */}
          {(selectedItems.includes('technical-checklist') || selectedItems.includes('non-technical-checklist')) && <div className="bg-white p-6 border border-[hsl(var(--analytics-border))]">
              <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--analytics-text))]">Association Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={associationData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D2B48C" />
                </BarChart>
              </ResponsiveContainer>
            </div>}

          {/* Aging Matrix */}
          {selectedItems.includes('top-10-checklist') && <div className="bg-white p-6 border border-[hsl(var(--analytics-border))]">
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
                    {agingData.map((row, index) => <tr key={index} className="border-b border-[hsl(var(--analytics-border))]">
                        <td className="p-2 font-medium text-[hsl(var(--analytics-text))]">{row.category}</td>
                        <td className="text-center p-2 text-green-600">{row.low}</td>
                        <td className="text-center p-2 text-yellow-600">{row.medium}</td>
                        <td className="text-center p-2 text-red-600">{row.high}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>}
        </div>

        {/* Right Section - Sidebar (1 column) */}
        <div className="lg:col-span-1">
          <RecentSchedulesSidebar />
        </div>
      </div>
    </div>;
  const renderListTab = () => <div className="space-y-4">
      <div className="mb-4">
        {renderCustomActions()}
      </div>

      {isLoading ? <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading schedules...</p>
          </div>
        </div> : error ? <div className="flex items-center justify-center h-32">
          <p className="text-sm text-red-600">Error loading schedules. Please try again.</p>
        </div> : <EnhancedTable data={schedules} columns={columns} renderCell={renderCell} renderActions={renderRowActions} selectable={true} pagination={true} enableExport={true} exportFileName="schedules" onRowClick={handleViewSchedule} storageKey="schedules-table" enableSearch={true} searchPlaceholder="Search schedules..." />}
    </div>;
  return <div className="p-4 sm:p-6">
      <div className="mb-6">
        
        <h1 className="text-xl sm:text-2xl font-bold">Schedule Dashboard</h1>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[#C72030] border-none">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[#C72030] border-none">
            <Calendar className="w-4 h-4" />
            Schedule List
          </TabsTrigger>
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
    </div>;
};