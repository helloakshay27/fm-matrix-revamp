
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Filter, Search } from 'lucide-react';
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
      report: false
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
      report: false
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
          <div 
            className={`${getStatusColor('Scheduled')} rounded-lg p-4 text-white cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => setSelectedStatus('Scheduled')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.scheduled}</span>
              </div>
              <span className="font-medium">Scheduled</span>
            </div>
          </div>

          <div 
            className={`${getStatusColor('In Progress')} rounded-lg p-4 text-white cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => setSelectedStatus('In Progress')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.inProgress}</span>
              </div>
              <span className="font-medium">In Progress</span>
            </div>
          </div>

          <div 
            className={`${getStatusColor('Completed')} rounded-lg p-4 text-white cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => setSelectedStatus('Completed')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.completed}</span>
              </div>
              <span className="font-medium">Completed</span>
            </div>
          </div>

          <div 
            className={`${getStatusColor('Overdue')} rounded-lg p-4 text-white cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => setSelectedStatus('Overdue')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.overdue}</span>
              </div>
              <span className="font-medium">Overdue</span>
            </div>
          </div>

          <div 
            className={`${getStatusColor('Closed')} rounded-lg p-4 text-white cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => setSelectedStatus('Closed')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.closed}</span>
              </div>
              <span className="font-medium">Closed</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={handleAddClick}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search */}
        <div className="flex justify-end mb-4">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Audit Name ↕</TableHead>
                <TableHead className="font-semibold text-gray-900">Audit ID ↕</TableHead>
                <TableHead className="font-semibold text-gray-900">Type</TableHead>
                <TableHead className="font-semibold text-gray-900">Start Date</TableHead>
                <TableHead className="font-semibold text-gray-900">End Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Audit Status ↕</TableHead>
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
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {audit.auditName}
                    </button>
                  </TableCell>
                  <TableCell>{audit.auditId}</TableCell>
                  <TableCell>{audit.type}</TableCell>
                  <TableCell>{audit.startDate}</TableCell>
                  <TableCell>{audit.endDate}</TableCell>
                  <TableCell>
                    <Select
                      value={audit.status}
                      onValueChange={(value) => handleStatusUpdate(audit.id, value)}
                    >
                      <SelectTrigger className={`w-32 text-white ${getStatusColor(audit.status)}`}>
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
