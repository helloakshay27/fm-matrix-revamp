
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, RefreshCw, Grid, MoreVertical } from 'lucide-react';
import { CampaignFilterModal } from '@/components/CampaignFilterModal';
import { CreateLeadModal } from '@/components/CreateLeadModal';

// Sample data based on the image
const leadsData = [
  {
    id: '#1453',
    createdBy: 'Deepak Gupta',
    uniqueId: 'Ff891baa',
    project: 'GODREJ CITY',
    lead: 'Deepak Gupta',
    mobile: '7021403352',
    status: 'Active',
    createdOn: '29/03/2025'
  },
  {
    id: '#1447',
    createdBy: 'Godrej Living',
    uniqueId: '1c748baa',
    project: 'GODREJ RKS',
    lead: 'Godrej Living',
    mobile: '3217895214',
    status: 'Active',
    createdOn: '06/03/2025'
  },
  {
    id: '#1395',
    createdBy: 'Kshitij Rasal',
    uniqueId: '173f3zff',
    project: 'GODREJ HILL RETREAT',
    lead: 'Kshitij Rasal',
    mobile: '9819808570',
    status: 'Hot',
    createdOn: '11/09/2023'
  },
  {
    id: '#1389',
    createdBy: 'Samay Seth',
    uniqueId: 'CF3ac270',
    project: 'GODREJ HILL RETREAT',
    lead: 'Samay Seth',
    mobile: '8779650025',
    status: 'Active',
    createdOn: '16/08/2023'
  },
  {
    id: '#1378',
    createdBy: 'Godrej Living',
    uniqueId: '1c748baa',
    project: 'GODREJ CITY',
    lead: 'Godrej Living',
    mobile: '3217895214',
    status: 'Active',
    createdOn: '02/02/2023'
  },
  {
    id: '#1373',
    createdBy: 'Deepak Gupta',
    uniqueId: 'Ff891baa',
    project: 'GODREJ RKS',
    lead: 'Deepak Gupta',
    mobile: '7021403352',
    status: 'Active',
    createdOn: '09/11/2022'
  },
  {
    id: '#1372',
    createdBy: 'Deepak Gupta',
    uniqueId: 'Ff891baa',
    project: 'GODREJ HILL RETREAT',
    lead: 'Deepak Gupta',
    mobile: '7021403352',
    status: 'Active',
    createdOn: '07/11/2022'
  },
  {
    id: '#1370',
    createdBy: 'Godrej Living',
    uniqueId: '1c748baa',
    project: 'GODREJ HILL RETREAT',
    lead: 'Godrej Living',
    mobile: '3217895214',
    status: 'Active',
    createdOn: '06/11/2022'
  }
];

export const CRMCampaignPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const handleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leadsData.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leadsData.map(lead => lead.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Hot': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'} className={
        status === 'Hot' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-800'
      }>
        {status}
      </Badge>
    );
  };

  const filteredLeads = leadsData.filter(lead =>
    lead.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-6"
            >
              Add
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 border-gray-300"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-gray-300"
              />
            </div>
            <Button variant="outline" size="icon" className="border-gray-300">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-gray-300">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-gray-300">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === leadsData.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead className="text-gray-700 font-medium">Actions</TableHead>
              <TableHead className="text-gray-700 font-medium">ID</TableHead>
              <TableHead className="text-gray-700 font-medium">Created By</TableHead>
              <TableHead className="text-gray-700 font-medium">Unique Id</TableHead>
              <TableHead className="text-gray-700 font-medium">Project</TableHead>
              <TableHead className="text-gray-700 font-medium">Lead</TableHead>
              <TableHead className="text-gray-700 font-medium">Mobile</TableHead>
              <TableHead className="text-gray-700 font-medium">Status</TableHead>
              <TableHead className="text-gray-700 font-medium">Created On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleLeadSelection(lead.id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                    👁️
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-blue-600">{lead.id}</TableCell>
                <TableCell>{lead.createdBy}</TableCell>
                <TableCell className="text-gray-600">{lead.uniqueId}</TableCell>
                <TableCell className="font-medium">{lead.project}</TableCell>
                <TableCell>{lead.lead}</TableCell>
                <TableCell>{lead.mobile}</TableCell>
                <TableCell>{getStatusBadge(lead.status)}</TableCell>
                <TableCell className="text-gray-600">{lead.createdOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 text-sm text-gray-600">
          Showing 1 to 8 of 8 rows
        </div>
      </div>

      {/* Modals */}
      <CampaignFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(filters) => {
          console.log('Applied filters:', filters);
          setIsFilterModalOpen(false);
        }}
        onReset={() => {
          console.log('Reset filters');
        }}
      />

      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(leadData) => {
          console.log('Create lead:', leadData);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};
