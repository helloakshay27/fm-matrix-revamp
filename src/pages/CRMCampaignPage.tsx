import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';
import { CampaignFilterModal } from '@/components/CampaignFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

interface CampaignLead {
  id: string;
  createdBy: string;
  uniqueId: string;
  project: string;
  lead: string;
  mobile: string;
  status: string;
  createdOn: string;
}

const leadsData: CampaignLead[] = [
  {
    id: '#1453',
    createdBy: 'Deepak Gupta',
    uniqueId: 'Ff891baa',
    project: 'GODREJ CITY',
    lead: 'Deepak Gupta',
    mobile: '7021403352',
    status: 'Active',
    createdOn: '29/03/2025',
  },
  {
    id: '#1447',
    createdBy: 'Godrej Living',
    uniqueId: '1c748baa',
    project: 'GODREJ RKS',
    lead: 'Godrej Living',
    mobile: '3217895214',
    status: 'Active',
    createdOn: '06/03/2025',
  },
  {
    id: '#1395',
    createdBy: 'Kshitij Rasal',
    uniqueId: '173f3zff',
    project: 'GODREJ HILL RETREAT',
    lead: 'Kshitij Rasal',
    mobile: '9819808570',
    status: 'Hot',
    createdOn: '11/09/2023',
  },
  {
    id: '#1389',
    createdBy: 'Samay Seth',
    uniqueId: 'CF3ac270',
    project: 'GODREJ HILL RETREAT',
    lead: 'Samay Seth',
    mobile: '8779650025',
    status: 'Active',
    createdOn: '16/08/2023',
  },
  {
    id: '#1378',
    createdBy: 'Godrej Living',
    uniqueId: '1c748baa',
    project: 'GODREJ CITY',
    lead: 'Godrej Living',
    mobile: '3217895214',
    status: 'Active',
    createdOn: '02/02/2023',
  },
  {
    id: '#1373',
    createdBy: 'Deepak Gupta',
    uniqueId: 'Ff891baa',
    project: 'GODREJ RKS',
    lead: 'Deepak Gupta',
    mobile: '7021403352',
    status: 'Active',
    createdOn: '09/11/2022',
  },
  {
    id: '#1372',
    createdBy: 'Deepak Gupta',
    uniqueId: 'Ff891baa',
    project: 'GODREJ HILL RETREAT',
    lead: 'Deepak Gupta',
    mobile: '7021403352',
    status: 'Active',
    createdOn: '07/11/2022',
  },
  {
    id: '#1370',
    createdBy: 'Godrej Living',
    uniqueId: '1c748baa',
    project: 'GODREJ HILL RETREAT',
    lead: 'Godrej Living',
    mobile: '3217895214',
    status: 'Active',
    createdOn: '06/11/2022',
  },
];

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdBy', label: 'Created By', sortable: true, hideable: true, defaultVisible: true },
  { key: 'uniqueId', label: 'Unique Id', sortable: true, hideable: true, defaultVisible: true },
  { key: 'project', label: 'Project', sortable: true, hideable: true, defaultVisible: true },
  { key: 'lead', label: 'Lead', sortable: true, hideable: true, defaultVisible: true },
  { key: 'mobile', label: 'Mobile', sortable: true, hideable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdOn', label: 'Created On', sortable: true, hideable: true, defaultVisible: true },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hot':
      return 'bg-[rgba(218,119,86,0.18)] text-[#DA7756] border-0 hover:bg-[rgba(218,119,86,0.18)]';
    case 'Active':
      return 'bg-[#C7EDDA] text-[#2c2c2c] border-0 hover:bg-[#C7EDDA]';
    default:
      return 'bg-[#E5E0D8] text-[#2c2c2c] border-0 hover:bg-[#E5E0D8]';
  }
};

export const CRMCampaignPage = () => {
  const { shouldShow } = useDynamicPermissions();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<CampaignLead[]>([]);

  useEffect(() => {
    let active = true;
    const fetchLeads = async () => {
      setLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 800));
        if (active) setLeads(leadsData);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchLeads();
    return () => {
      active = false;
    };
  }, []);

  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;
    const q = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.lead.toLowerCase().includes(q) ||
        lead.project.toLowerCase().includes(q) ||
        lead.id.toLowerCase().includes(q) ||
        lead.createdBy.toLowerCase().includes(q) ||
        lead.uniqueId.toLowerCase().includes(q) ||
        lead.mobile.toLowerCase().includes(q) ||
        lead.status.toLowerCase().includes(q)
    );
  }, [leads, searchTerm]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map((lead) => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads((prev) => [...prev, itemId]);
    } else {
      setSelectedLeads((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleViewLead = (leadId: string) => {
    navigate(`/crm/campaign/details/${leadId.replace('#', '')}`);
  };

  const handleExport = () => {
    const headers = [
      'ID',
      'Created By',
      'Unique Id',
      'Project',
      'Lead',
      'Mobile',
      'Status',
      'Created On',
    ];
    const rows = filteredLeads.map((lead) => [
      lead.id,
      lead.createdBy,
      lead.uniqueId,
      lead.project,
      lead.lead,
      lead.mobile,
      lead.status,
      lead.createdOn,
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `crm-campaign-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderCell = (item: CampaignLead, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="text-gray-900 font-medium">{item.id}</span>;
      case 'project':
        return <span className="font-medium text-gray-900">{item.project}</span>;
      case 'status':
        return (
          <Badge className={getStatusColor(item.status)}>
            {item.status}
          </Badge>
        );
      default:
        return <span>{item[columnKey as keyof CampaignLead] ?? '-'}</span>;
    }
  };

  const renderActions = (item: CampaignLead) =>
    shouldShow('Campaign', 'show') ? (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-[#C72030] hover:bg-[#C72030]/10 hover:text-[#C72030]"
        onClick={(e) => {
          e.stopPropagation();
          handleViewLead(item.id);
        }}
        title="View"
      >
        <Eye className="w-4 h-4" />
      </Button>
    ) : null;

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <EnhancedTable
        data={filteredLeads}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="crm-campaign-table"
        emptyMessage="No leads found"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search campaigns..."
        enableSearch
        enableExport
        handleExport={handleExport}
        pagination
        pageSize={10}
        loading={loading}
        loadingMessage="Loading..."
        selectable
        selectedItems={selectedLeads}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={(item) => item.id}
        onFilterClick={() => setIsFilterModalOpen(true)}
        leftActions={
          shouldShow('Campaign', 'create') ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/crm/campaign/add')}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          ) : undefined
        }
      />

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
    </div>
  );
};
