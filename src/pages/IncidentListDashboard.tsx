
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const IncidentListDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  // Determine if we're in Safety or Maintenance context
  const isSafetyContext = location.pathname.startsWith('/safety');
  const basePath = isSafetyContext ? '/safety' : '/maintenance';

  const incidents = [
    {
      id: '#1870',
      description: 'ygyuiyi',
      site: 'Lockated',
      region: '',
      tower: 'Jyoti Tower',
      incidentTime: '29/01/2025 3:21 PM',
      level: 'Level 3',
      category: 'Risk Assessment',
      subCategory: 'Access Control',
      supportRequired: 'Yes',
      assignedTo: '',
      currentStatus: 'Open'
    },
    {
      id: '#1869',
      description: 'ygyuiyi',
      site: 'Lockated',
      region: '',
      tower: 'Jyoti Tower',
      incidentTime: '29/01/2025 3:21 PM',
      level: 'Level 3',
      category: 'Risk Assessment',
      subCategory: 'Access Control',
      supportRequired: 'Yes',
      assignedTo: '',
      currentStatus: 'Open'
    },
    {
      id: '#1328',
      description: 'HRMS integration with vodafoneldea client has broken due to directory access issue at SFTP side',
      site: 'Lockated',
      region: '',
      tower: 'Gophysgital',
      incidentTime: '20/08/2024 3:39 PM',
      level: 'Level 3',
      category: 'Risk Assessment',
      subCategory: 'Integration Failure',
      supportRequired: 'Yes',
      assignedTo: '',
      currentStatus: 'Closed'
    }
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
  };

  const handleAddIncident = () => {
    navigate(`${basePath}/incident/add`);
  };

  const handleViewIncident = (incidentId: string) => {
    navigate(`${basePath}/incident/${incidentId.replace('#', '')}`);
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>{isSafetyContext ? 'Safety' : 'Incidents'}</span>
          <span className="mx-2">{'>'}</span>
          <span>Incidents List</span>
        </nav>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">INCIDENTS LIST</h1>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
  {/* Add Button */}
  <div className="w-full lg:w-auto">
    <Button 
      onClick={handleAddIncident}
      style={{ backgroundColor: '#C72030' }} 
      className="text-white hover:opacity-90 w-full lg:w-auto"
    >
      <Plus className="w-4 h-4 mr-2 text-[#C72030] stroke-[#C72030]" />
      Add
    </Button>
  </div>

  {/* Search + Go + Reset */}
  <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full lg:w-auto">
    <div className="relative flex-1">
      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Search using Incident Id"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
    <Button 
      onClick={handleSearch} 
      style={{ backgroundColor: '#C72030' }} 
      className="text-white hover:opacity-90 w-full sm:w-auto"
    >
      Go!
    </Button>
    <Button 
      onClick={handleReset} 
      variant="outline" 
      className="w-full sm:w-auto"
    >
      Reset
    </Button>
  </div>
</div>



      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Action</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Tower</TableHead>
              <TableHead>Incident Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead>Support Required</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Current Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewIncident(incident.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-blue-600 font-medium">
                  {incident.id}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {incident.description}
                </TableCell>
                <TableCell>{incident.site}</TableCell>
                <TableCell>{incident.region}</TableCell>
                <TableCell>{incident.tower}</TableCell>
                <TableCell>{incident.incidentTime}</TableCell>
                <TableCell>{incident.level}</TableCell>
                <TableCell>{incident.category}</TableCell>
                <TableCell>{incident.subCategory}</TableCell>
                <TableCell>{incident.supportRequired}</TableCell>
                <TableCell>{incident.assignedTo}</TableCell>
                <TableCell>
                  <StatusBadge 
                    status={incident.currentStatus === 'Open' ? 'accepted' : 'closed'}
                  >
                    {incident.currentStatus}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                10
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default IncidentListDashboard;
