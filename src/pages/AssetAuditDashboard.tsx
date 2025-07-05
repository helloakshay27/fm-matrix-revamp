
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Filter, Search, Settings, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AssetAuditDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample data matching the reference image
  const auditData = [
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

  const [audits, setAudits] = useState(auditData);

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

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.auditName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.conductedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || audit.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          Audit &gt; Audit List
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">AUDIT LIST</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#D92818]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{stats.scheduled}</span>
                <span className="font-medium text-sm">Scheduled</span>
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
                <span className="font-medium text-sm">In Progress</span>
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
                <span className="font-medium text-sm">Completed</span>
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
                <span className="font-medium text-sm">Overdue</span>
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
                <span className="font-medium text-sm">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Audit Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Audit ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Type</TableHead>
                <TableHead className="font-semibold text-gray-900">Start Date</TableHead>
                <TableHead className="font-semibold text-gray-900">End Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Audit Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Conducted By</TableHead>
                <TableHead className="font-semibold text-gray-900">Report</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.map((audit) => (
                <TableRow key={audit.id} className="hover:bg-gray-50">
                  <TableCell>
                    <button
                      onClick={() => handleAuditNameClick(audit.auditId)}
                      className="text-black hover:underline font-medium"
                    >
                      {audit.auditName}
                    </button>
                  </TableCell>
                  <TableCell>{audit.auditId}</TableCell>
                  <TableCell>{audit.type}</TableCell>
                  <TableCell>{audit.startDate}</TableCell>
                  <TableCell>{audit.endDate}</TableCell>
                  <TableCell className="min-w-[120px]">
  <Select
    value={audit.status}
    onValueChange={(value) => handleStatusUpdate(audit.id, value)}
  >
    <SelectTrigger
      className={`w-full md:w-32 text-white px-3 py-1.5 text-sm rounded-md truncate ${getStatusColor(audit.status)}`}
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
</TableCell>

                  <TableCell>{audit.conductedBy}</TableCell>
                  <TableCell>
                    {audit.report && (
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
