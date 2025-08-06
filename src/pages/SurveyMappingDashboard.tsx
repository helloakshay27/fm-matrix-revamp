import React, { useState, useEffect } from 'react';
import { SurveyMappingTable } from '../components/SurveyMappingTable';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Filter, Download, RotateCcw, Search, Eye, Loader2 } from 'lucide-react';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { Switch } from "@/components/ui/switch";
import { QRCodeModal } from '../components/QRCodeModal';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

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
    snag_audit_category_id: number;
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
    snag_audit_category: string;
    snag_audit_sub_category: string | null;
    questions_count: number;
    snag_questions: any[];
  };
}

export const SurveyMappingDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedQR, setSelectedQR] = useState<{
    qrCode: string;
    serviceName: string;
    site: string;
  } | null>(null);
  
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
      setMappings(response.data || []);
    } catch (error: any) {
      console.error('Error fetching survey mappings:', error);
      toast.error('Failed to fetch survey mappings');
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
  };

  const handleQRClick = (mapping: SurveyMapping) => {
    setSelectedQR({
      qrCode: mapping.qr_code_url || '',
      serviceName: mapping.snag_checklist?.name || mapping.survey_title || '',
      site: mapping.site_name || ''
    });
  };

  const handleViewClick = (item: SurveyMapping) => {
    console.log('View clicked for item:', item.id);
  };

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false, draggable: false },
    { key: 'serviceId', label: 'ID', sortable: true, draggable: true },
    { key: 'serviceName', label: 'Service Name', sortable: true, draggable: true },
    { key: 'site', label: 'Site', sortable: true, draggable: true },
    { key: 'building', label: 'Building', sortable: true, draggable: true },
    { key: 'wing', label: 'Wing', sortable: true, draggable: true },
    { key: 'area', label: 'Area', sortable: true, draggable: true },
    { key: 'floor', label: 'Floor', sortable: true, draggable: true },
    { key: 'room', label: 'Room', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: false, draggable: true },
    { key: 'createdOn', label: 'Created On', sortable: true, draggable: true },
    { key: 'qrCode', label: 'QR', sortable: false, draggable: true }
  ];

  const renderCell = (item: SurveyMapping, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <button 
            onClick={() => handleViewClick(item)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Eye className="w-4 h-4" />
          </button>
        );
      case 'serviceId':
        return item.snag_checklist?.id || '-';
      case 'serviceName':
        return item.snag_checklist?.name || item.survey_title || '-';
      case 'site':
        return item.site_name || '-';
      case 'building':
        return item.building_name || '-';
      case 'wing':
        return item.wing_name || '-';
      case 'area':
        return item.area_name || '-';
      case 'floor':
        return item.floor_name || '-';
      case 'room':
        return item.room_name || '-';
      case 'status':
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() => handleStatusToggle(item)}
          />
        );
      case 'createdOn':
        return item.created_at ? new Date(item.created_at).toLocaleDateString() : '-';
      case 'qrCode':
        return (
          <button 
            onClick={() => handleQRClick(item)}
            className="w-8 h-8 bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 bg-white grid grid-cols-3 gap-px">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-black" style={{ 
                  backgroundColor: Math.random() > 0.5 ? 'black' : 'white' 
                }}></div>
              ))}
            </div>
          </button>
        );
      default:
        return '-';
    }
  };


  // Filter mappings based on search term
  const filteredMappings = mappings.filter(mapping =>
    mapping.snag_checklist?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.survey_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.wing_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.area_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.floor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.room_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          {/* <p className="text-muted-foreground text-sm mb-2">
            Survey &gt; Mapping
          </p> */}
          <Heading level="h1" variant="default">Mapping List</Heading>
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
          // selectable={true}
          renderCell={renderCell}
          storageKey="survey-mapping-table"
          enableExport={true}
          exportFileName="survey-mapping-data"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search mappings..."
          pagination={true}
          pageSize={10}
          leftActions={
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <Button className="flex items-center gap-2 bg-[#F2EEE9] text-[#BF213E] border-0 hover:bg-[#F2EEE9]/80">
                <Plus className="w-4 h-4" />
                Add
              </Button>
              
              {/* <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
                <span className="hidden sm:inline">Print QR</span>
              </Button> */}
            </div>
          }
        />
      </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={!!selectedQR}
        onClose={() => setSelectedQR(null)}
        qrCode={selectedQR?.qrCode || ''}
        serviceName={selectedQR?.serviceName || ''}
        site={selectedQR?.site || ''}
      />
    </div>
  );
};
