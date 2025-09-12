import React, { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Edit, Copy, Eye, Share2, ChevronDown, Loader2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { useToast } from "@/hooks/use-toast";
import { apiClient } from '@/utils/apiClient';
import { Switch } from "@/components/ui/switch";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface SurveyMapping {
  id: number;
  survey_id: number;
  created_by_id: number;
  site_id: number;
  building_id: number;
  wing_id: number | null;
  floor_id: number | null;
  area_id: number | null;
  room_id: number | null;
  qr_code: {
    id: number;
    document_file_name: string;
    document_content_type: string;
    document_file_size: number;
    document_updated_at: string;
    relation: string;
    relation_id: number;
    active: boolean | null;
    created_at: string;
    updated_at: string;
    changed_by: string | null;
    added_from: string | null;
    comments: string | null;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  survey_title: string;
  site_name: string;
  building_name: string;
  wing_name: string | null;
  floor_name: string | null;
  area_name: string | null;
  room_name: string | null;
  qr_code_url: string;
  snag_checklist: {
    id: number;
    name: string;
    snag_audit_category_id: number | null;
    snag_audit_sub_category_id: number | null;
    active: number;
    project_id: number | null;
    company_id: number;
    created_at: string;
    updated_at: string;
    check_type: string;
    user_id: number | null;
    resource_id: number;
    resource_type: string;
    snag_audit_category: string | null;
    snag_audit_sub_category: string | null;
    questions_count: number;
    snag_questions: Array<{
      id: number;
      qtype: string;
      descr: string;
      checklist_id: number;
      img_mandatory: boolean;
      quest_mandatory: boolean;
      no_of_associations: number;
      ticket_configs: {
        category: string | null;
        category_id: number | null;
        assigned_to: string | null;
        assigned_to_id: number | null;
        tag_type: string | null;
        active: boolean | null;
        tag_created_at?: string;
        tag_updated_at?: string;
      };
    }>;
  };
}

export const SurveyMappingDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const [mappings, setMappings] = useState<SurveyMapping[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch survey mappings from API
  useEffect(() => {
    fetchSurveyMappings();
  }, []);

  const fetchSurveyMappings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/survey_mappings.json');
      console.log('Survey mapping data response:', response.data);
      const mappingData = response.data || [];
      console.log('First mapping item:', mappingData[0]); // Debug log
      setMappings(mappingData);
    } catch (error: any) {
      console.error('Error fetching survey mappings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch survey mappings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = (item: SurveyMapping) => {
    setMappings(prev => prev.map(mapping => 
      mapping.id === item.id 
        ? { ...mapping, active: !mapping.active }
        : mapping
    ));
    toast({
      title: "Status Updated",
      description: `Survey mapping status ${item.active ? 'deactivated' : 'activated'}`
    });
  };

  const handleQRClick = (mapping: SurveyMapping) => {
    if (mapping.qr_code_url) {
      window.open(mapping.qr_code_url, '_blank');
    }
  };

  const handleViewClick = (item: SurveyMapping) => {
    console.log('View clicked for item:', item.id);
    navigate(`/maintenance/survey/mapping/details/${item.id}`);
  };

  const handleEditClick = (item: SurveyMapping) => {
    console.log('Edit clicked for item:', item.id);
    navigate(`/maintenance/survey/mapping/edit/${item.id}`);
  };

  const handleAddMapping = () => {
    navigate('/maintenance/survey/mapping/add');
  };

  const handleExport = async () => {
    try {
      const response = await apiClient.get('/survey_mappings.xlsx', {
        params: {
          export: true
        },
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `survey-mappings-${currentDate}.xlsx`);
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Survey mappings exported successfully",
      });
    } catch (error: any) {
      console.error('Error exporting survey mappings:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export survey mappings",
        variant: "destructive"
      });
    }
  };

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false, draggable: false, defaultVisible: true },
    { key: 'survey_title', label: 'Survey Title', sortable: true, draggable: true, defaultVisible: true },
    { key: 'site_name', label: 'Site', sortable: true, draggable: true, defaultVisible: true },
    { key: 'building_name', label: 'Building', sortable: true, draggable: true, defaultVisible: true },
    { key: 'wing_name', label: 'Wing', sortable: true, draggable: true, defaultVisible: true },
    { key: 'floor_name', label: 'Floor', sortable: true, draggable: true, defaultVisible: true },
    { key: 'room_name', label: 'Room', sortable: true, draggable: true, defaultVisible: true },
    { key: 'check_type', label: 'Check Type', sortable: true, draggable: true, defaultVisible: true },
    { key: 'questions_count', label: 'Questions', sortable: true, draggable: true, defaultVisible: true },
    { key: 'associations_count', label: 'Associations', sortable: true, draggable: true, defaultVisible: true },
    { key: 'ticket_category', label: 'Ticket Category', sortable: true, draggable: true, defaultVisible: true },
    { key: 'assigned_to', label: 'Assigned To', sortable: true, draggable: true, defaultVisible: true },
    { key: 'created_by', label: 'Created By', sortable: true, draggable: true, defaultVisible: true },
    // { key: 'status', label: 'Status', sortable: false, draggable: true, defaultVisible: true },
    { key: 'created_at', label: 'Created On', sortable: true, draggable: true, defaultVisible: true },
    { key: 'qr_code', label: 'QR Code', sortable: false, draggable: true, defaultVisible: true }
  ];

  const renderCell = (item: SurveyMapping, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex justify-center items-center gap-2">
            <button 
              onClick={() => handleViewClick(item)}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleEditClick(item)}
              className="p-1 text-green-600 hover:text-green-800"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        );
      case 'survey_title':
        return <span className="font-medium">{item.survey_title}</span>;
      case 'site_name':
        return <span>{item.site_name}</span>;
      case 'building_name':
        return <span>{item.building_name}</span>;
      case 'wing_name':
        return <span>{item.wing_name || '-'}</span>;
      case 'floor_name':
        return <span>{item.floor_name || '-'}</span>;
      case 'room_name':
        return <span>{item.room_name || '-'}</span>;
      case 'check_type':
        return <span className="capitalize">{item.snag_checklist?.check_type || '-'}</span>;
      case 'questions_count':
        return <div className="text-center">{item.snag_checklist?.questions_count || 0}</div>;
      case 'associations_count':
        return (
          <div className="text-center">
            {item.snag_checklist?.snag_questions?.[0]?.no_of_associations || 0}
          </div>
        );
      case 'ticket_category':
        return (
          <span>
            {item.snag_checklist?.snag_questions?.[0]?.ticket_configs?.category || '-'}
          </span>
        );
      case 'assigned_to':
        return (
          <span>
            {item.snag_checklist?.snag_questions?.[0]?.ticket_configs?.assigned_to || '-'}
          </span>
        );
      case 'created_by':
        return <span>{item.created_by}</span>;
      case 'status':
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() => handleStatusToggle(item)}
          />
        );
      case 'created_at':
        return item.created_at ? new Date(item.created_at).toLocaleDateString() : '-';
      case 'qr_code':
        return (
          <div className="flex justify-center">
            {item.qr_code_url ? (
              <button 
                onClick={() => handleQRClick(item)}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="View QR Code"
              >
                <img 
                  src={item.qr_code_url} 
                  alt="QR Code" 
                  className="w-8 h-8 object-contain cursor-pointer hover:opacity-80"
                />
              </button>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      default:
        // Fallback for any other columns
        const value = item[columnKey as keyof SurveyMapping];
        return <span>{value !== null && value !== undefined ? String(value) : '-'}</span>;
    }
  };


  // Filter mappings based on search term
  const filteredMappings = mappings.filter(mapping =>
    mapping.snag_checklist?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.survey_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mapping.wing_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mapping.area_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mapping.floor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mapping.room_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.created_by?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug logs
  console.log('Filtered mappings:', filteredMappings);
  console.log('Columns:', columns);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Heading level="h1" variant="default">Survey Mapping</Heading>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading survey mappings...</span>
        </div>
      ) : (
        /* Enhanced Survey Mapping Table */
        <div>
          <EnhancedTable
            data={filteredMappings}
            columns={columns}
            selectable={false}
            renderCell={renderCell}
            storageKey="survey-mapping-table"
            enableExport={true}
            handleExport={handleExport}
            exportFileName="survey-mapping-data"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search survey mappings..."
            pagination={true}
            pageSize={10}
            leftActions={
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <Button 
                  onClick={handleAddMapping}
                  className="flex items-center gap-2 bg-[#F2EEE9] text-[#BF213E] border-0 hover:bg-[#F2EEE9]/80"
                >
                  <Plus className="w-4 h-4" />
                  Add Survey Mapping
                </Button>
            
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};
