import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Clock, Settings, CheckCircle, AlertTriangle, XCircle, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface AuditRecord {
  id: number;
  auditName: string;
  auditId: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  conductedBy: string;
  report: boolean;
}

const auditData: AuditRecord[] = [
  {
    id: 1,
    auditName: 'Name Latest',
    auditId: '10',
    type: '',
    startDate: '09/04/2025',
    endDate: '27/06/2025',
    status: 'Scheduled',
    conductedBy: 'Abhishek Sharma',
    report: true
  },
  {
    id: 2,
    auditName: 'Audit For It Assets',
    auditId: '6',
    type: '',
    startDate: '01/06/2025',
    endDate: '01/06/2026',
    status: 'Completed',
    conductedBy: 'Abdul Ghaffar',
    report: true
  },
  {
    id: 3,
    auditName: 'Asset integrity audit for AC system',
    auditId: '5',
    type: '',
    startDate: '01/06/2025',
    endDate: '30/06/2025',
    status: 'In Progress',
    conductedBy: 'Abdul Ghaffar',
    report: true
  },
  {
    id: 4,
    auditName: 'Electrical Consumption Metering Audit',
    auditId: '4',
    type: '',
    startDate: '02/06/2025',
    endDate: '30/06/2025',
    status: 'Scheduled',
    conductedBy: 'Vinayak Mane',
    report: true
  }
];

const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Actions', sortable: false, defaultVisible: true },
  { key: 'auditName', label: 'Audit Name', sortable: true, defaultVisible: true },
  { key: 'auditId', label: 'Audit ID', sortable: true, defaultVisible: true },
  { key: 'type', label: 'Type', sortable: true, defaultVisible: true },
  { key: 'startDate', label: 'Start Date', sortable: true, defaultVisible: true },
  { key: 'endDate', label: 'End Date', sortable: true, defaultVisible: true },
  { key: 'status', label: 'Audit Status', sortable: true, defaultVisible: true },
  { key: 'conductedBy', label: 'Conducted By', sortable: true, defaultVisible: true },
  { key: 'report', label: 'Report', sortable: false, defaultVisible: true },
];

export const AssetAuditDashboard = () => {
  const navigate = useNavigate();
  const [audits, setAudits] = useState<AuditRecord[]>(auditData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Statistics based on data
  const stats = {
    scheduled: audits.filter(audit => audit.status === 'Scheduled').length,
    inProgress: audits.filter(audit => audit.status === 'In Progress').length,
    completed: audits.filter(audit => audit.status === 'Completed').length,
    overdue: audits.filter(audit => audit.status === 'Overdue').length,
    closed: audits.filter(audit => audit.status === 'Closed').length
  };

  const handleStatusUpdate = (auditId: number, newStatus: string) => {
    setAudits(prev => prev.map(audit => 
      audit.id === auditId ? { ...audit, status: newStatus } : audit
    ));
  };

  const handleAddClick = () => {
    navigate('/maintenance/audit/assets/add');
  };

  const handleAuditNameClick = (auditId: string) => {
    navigate(`/maintenance/audit/assets/details/${auditId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-500';
      case 'In Progress': return 'bg-orange-500';
      case 'Completed': return 'bg-green-500';
      case 'Overdue': return 'bg-red-500';
      case 'Closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(audits.map(item => String(item.id)));
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

  const handleBulkDelete = (selectedItems: AuditRecord[]) => {
    const selectedIds = selectedItems.map(item => item.id);
    setAudits(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedItems([]);
  };

  const renderCell = (item: AuditRecord, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAuditNameClick(item.auditId);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        );
      case 'auditName':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAuditNameClick(item.auditId);
            }}
            className="text-black hover:underline font-medium"
          >
            {item.auditName}
          </button>
        );
      case 'auditId':
        return item.auditId;
      case 'type':
        return item.type || '-';
      case 'startDate':
        return item.startDate;
      case 'endDate':
        return item.endDate;
      case 'status':
        return (
          <div className="min-w-[120px]">
            <Select
              value={item.status}
              onValueChange={(value) => handleStatusUpdate(item.id, value)}
            >
              <SelectTrigger
                className={`w-full md:w-32 text-white px-3 py-1.5 text-sm rounded-md truncate ${getStatusColor(item.status)}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'conductedBy':
        return item.conductedBy;
      case 'report':
        return item.report ? (
          <Button size="sm" variant="ghost">
            <Download className="w-4 h-4" />
          </Button>
        ) : '-';
      default:
        return '-';
    }
  };

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: handleBulkDelete,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">AUDIT LIST</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#D92818]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{stats.scheduled}</span>
                <span className="font-medium text-sm text-black">Scheduled</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-[#D92818]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{stats.inProgress}</span>
                <span className="font-medium text-sm text-black">In Progress</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#D92818]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{stats.completed}</span>
                <span className="font-medium text-sm text-black">Completed</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#D92818]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{stats.overdue}</span>
                <span className="font-medium text-sm text-black">Overdue</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-[#D92818]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{stats.closed}</span>
                <span className="font-medium text-sm text-black">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}

        {/* Enhanced Table */}
        <EnhancedTable
          data={audits}
          columns={columns}
          renderCell={renderCell}
          selectable={true}
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          getItemId={(item) => String(item.id)}
          storageKey="asset-audit-dashboard-table"
          emptyMessage="No audit records found"
          searchPlaceholder="Search audits..."
          enableExport={true}
          exportFileName="audit-records"
          bulkActions={bulkActions}
          showBulkActions={true}
          pagination={true}
          pageSize={10}
          leftActions={
            <Button 
              onClick={handleAddClick}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Action Audit
            </Button>
          }
        />
      </div>
    </div>
  );
};
