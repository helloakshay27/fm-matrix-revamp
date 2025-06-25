
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Filter, RefreshCw, Eye, Edit } from 'lucide-react';
import { CampaignFilterModal } from '@/components/CampaignFilterModal';
import { CreateLeadModal } from '@/components/CreateLeadModal';
import { LeadDetailsModal } from '@/components/LeadDetailsModal';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { ExportDropdown } from '@/components/ExportDropdown';
import { toast } from 'sonner';

// Sample data
const sampleLeads = [
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
    id: '#1405',
    createdBy: 'Kshitij Rasal',
    uniqueId: '173f43rf',
    project: 'GODREJ HILL RETREAT',
    lead: 'Kshitij Rasal',
    mobile: '9819808570',
    status: 'Hot',
    createdOn: '11/09/2023'
  },
  {
    id: '#1389',
    createdBy: 'Samay Seth',
    uniqueId: 'CF3a4c70',
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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filteredLeads, setFilteredLeads] = useState(sampleLeads);

  const [columnVisibility, setColumnVisibility] = useState({
    actions: true,
    id: true,
    createdBy: true,
    uniqueId: true,
    project: true,
    lead: true,
    mobile: true,
    status: true,
    createdOn: true
  });

  const columnOptions = [
    { key: 'id', label: 'ID', visible: columnVisibility.id },
    { key: 'createdBy', label: 'Created By', visible: columnVisibility.createdBy },
    { key: 'uniqueId', label: 'Unique Id', visible: columnVisibility.uniqueId },
    { key: 'project', label: 'Project', visible: columnVisibility.project },
    { key: 'lead', label: 'Lead', visible: columnVisibility.lead },
    { key: 'mobile', label: 'Mobile', visible: columnVisibility.mobile },
    { key: 'status', label: 'Status', visible: columnVisibility.status },
    { key: 'createdOn', label: 'Created On', visible: columnVisibility.createdOn }
  ];

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    console.log(`Column ${columnKey} toggled to ${visible}`);
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  const handleAddLead = () => {
    console.log('Add Lead button clicked');
    setShowCreateModal(true);
  };

  const handleFilterClick = () => {
    console.log('Filter button clicked');
    setShowFilterModal(true);
  };

  const handleRefresh = () => {
    console.log('Refresh button clicked');
    toast.success('Data refreshed successfully!');
  };

  const handleViewLead = (lead: any) => {
    console.log('View lead:', lead);
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const handleEditLead = (lead: any) => {
    console.log('Edit lead:', lead);
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const handleCreateLead = (data: any) => {
    console.log('Creating lead with data:', data);
    toast.success('Lead created successfully!');
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying filters:', filters);
    // Filter logic would go here
    toast.success('Filters applied successfully!');
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    setFilteredLeads(sampleLeads);
    toast.success('Filters reset successfully!');
  };

  const filteredData = filteredLeads.filter(lead =>
    Object.values(lead).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded";
    if (status === 'Hot') {
      return `${baseClasses} bg-red-100 text-red-800 border-l-4 border-red-500`;
    }
    return `${baseClasses} bg-green-100 text-green-800`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header with Action Buttons */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Button 
              onClick={handleAddLead}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none flex items-center gap-2"
            >
              Add
            </Button>
            
            <Button 
              onClick={handleFilterClick}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Search and Action Icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-gray-300 rounded-none focus:border-[#C72030] focus:ring-[#C72030]"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              <ColumnVisibilityDropdown
                columns={columnOptions}
                onColumnToggle={handleColumnToggle}
              />
              <ExportDropdown />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columnVisibility.actions && (
                  <TableHead className="text-left font-semibold">Actions</TableHead>
                )}
                {columnVisibility.id && (
                  <TableHead className="text-left font-semibold">ID</TableHead>
                )}
                {columnVisibility.createdBy && (
                  <TableHead className="text-left font-semibold">Created By</TableHead>
                )}
                {columnVisibility.uniqueId && (
                  <TableHead className="text-left font-semibold">Unique Id</TableHead>
                )}
                {columnVisibility.project && (
                  <TableHead className="text-left font-semibold">Project</TableHead>
                )}
                {columnVisibility.lead && (
                  <TableHead className="text-left font-semibold">Lead</TableHead>
                )}
                {columnVisibility.mobile && (
                  <TableHead className="text-left font-semibold">Mobile</TableHead>
                )}
                {columnVisibility.status && (
                  <TableHead className="text-left font-semibold">Status</TableHead>
                )}
                {columnVisibility.createdOn && (
                  <TableHead className="text-left font-semibold">Created On</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((lead, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {columnVisibility.actions && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewLead(lead)}
                            className="p-1"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLead(lead)}
                            className="p-1"
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.id && <TableCell>{lead.id}</TableCell>}
                    {columnVisibility.createdBy && <TableCell>{lead.createdBy}</TableCell>}
                    {columnVisibility.uniqueId && <TableCell>{lead.uniqueId}</TableCell>}
                    {columnVisibility.project && <TableCell>{lead.project}</TableCell>}
                    {columnVisibility.lead && <TableCell>{lead.lead}</TableCell>}
                    {columnVisibility.mobile && <TableCell>{lead.mobile}</TableCell>}
                    {columnVisibility.status && (
                      <TableCell>
                        <span className={getStatusBadge(lead.status)}>
                          {lead.status}
                        </span>
                      </TableCell>
                    )}
                    {columnVisibility.createdOn && <TableCell>{lead.createdOn}</TableCell>}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <span className="text-red-600 font-medium">No Matching Records Found</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 1 to 8 of 8 rows
            </div>
            <div className="text-sm text-gray-600">
              Powered by <span className="font-semibold">LOCKATED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Support Button */}
      <div className="fixed bottom-4 right-4">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-none transform rotate-90 origin-center">
          SUPPORT
        </Button>
      </div>

      {/* Modals */}
      <CampaignFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <CreateLeadModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLead}
      />

      <LeadDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        lead={selectedLead}
        onSave={(data) => {
          console.log('Saving lead data:', data);
          toast.success('Lead updated successfully!');
        }}
      />
    </div>
  );
};
