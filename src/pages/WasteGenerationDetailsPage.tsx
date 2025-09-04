import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash, Package, Calendar, Edit, ChevronUp, ChevronDown, FileText, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { fetchWasteGenerationById, WasteGeneration } from '../services/wasteGenerationAPI';

export const WasteGenerationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wasteData, setWasteData] = useState<WasteGeneration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if value has data
  const hasData = (value: string | number | null | undefined | object) => {
    if (typeof value === 'object' && value !== null) {
      return true; // Objects are considered to have data if they exist
    }
    return value && value !== null && value !== undefined && value !== '' && value !== 'NA' && value !== 'N/A';
  };

  // State for expandable sections - will be set dynamically based on data
  const [expandedSections, setExpandedSections] = useState({
    wasteDetails: false,
    dateInfo: false,
    notes: false,
  });

  useEffect(() => {
    if (wasteData) {
      setExpandedSections({
        wasteDetails: hasData(wasteData.location_details) || hasData(wasteData.vendor?.company_name) || hasData(wasteData.commodity?.category_name) || hasData(wasteData.category?.category_name),
        dateInfo: hasData(wasteData.wg_date) || hasData(wasteData.created_by?.full_name) || hasData(wasteData.created_at),
        notes: false, // Can be expanded based on additional data
      });
    }
  }, [wasteData]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchWasteDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching waste generation details for ID:', id);
        
        // Use the specific API endpoint for fetching single waste generation
        const wasteGeneration = await fetchWasteGenerationById(parseInt(id));
        
        console.log('Waste generation details loaded:', wasteGeneration);
        setWasteData(wasteGeneration);
        
      } catch (err) {
        console.error('Error fetching waste generation details:', err);
        setError('Failed to fetch waste generation details');
      } finally {
        setLoading(false);
      }
    };

    fetchWasteDetails();
  }, [id]);

  const handleBackToList = () => {
    navigate('/maintenance/waste/generation'); // Navigate back to waste generation list
  };

  const handleUpdate = () => {
    navigate(`/maintenance/waste/generation/edit/${id}`, {
      state: { 
        from: 'details',
        returnTo: `/maintenance/waste/generation/${id}` 
      }
    });
  };

  const handleDelete = () => {
    toast.info("Delete functionality not yet implemented.");
    console.log("Delete waste item:", id);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading waste generation details...</div>
        </div>
      </div>
    );
  }

  if (error || !wasteData) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error || 'Waste generation record not found'}</div>
        </div>
      </div>
    );
  }

  // Expandable Section Component
  const ExpandableSection = ({ 
    title, 
    icon: Icon, 
    isExpanded, 
    onToggle, 
    children,
    hasDataValue = true 
  }: {
    title: string;
    icon: LucideIcon;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    hasDataValue?: boolean;
  }) => (
    <div className="border-2 rounded-lg mb-6">
      <div 
        onClick={onToggle} 
        className="flex items-center justify-between cursor-pointer p-6"
        style={{ backgroundColor: 'rgb(246 244 238)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
            <Icon className="w-4 h-4" style={{ color: "#C72030" }} />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {!hasDataValue && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No data</span>
          )}
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </div>
      </div>
      {isExpanded && (
        <div 
          className="p-6"
          style={{ backgroundColor: 'rgb(246 247 247)' }}
        >
          {children}
        </div>
      )}
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    hasData(value) && (
      <div className="flex items-start">
        <span className="text-gray-500 w-40 flex-shrink-0 font-medium">{label}</span>
        <span className="text-gray-500 mx-3">:</span>
        <span className="text-gray-900 font-semibold flex-1 break-words truncate max-w-full" style={{wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0, display: 'block'}} title={String(value)}>
          {String(value)}
        </span>
      </div>
    )
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBackToList} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-[#1a1a1a]">Back to Waste Generation List</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Waste Generation Details </h1>
          <div className="flex gap-3">
            <Button onClick={handleUpdate} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            {/* <Button onClick={handleDelete} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button> */}
          </div>
        </div>
      </div>

      {/* Section 1: Waste Details */}
      <ExpandableSection
        title="WASTE DETAILS"
        icon={Package}
        isExpanded={expandedSections.wasteDetails}
        onToggle={() => toggleSection('wasteDetails')}
        hasDataValue={hasData(wasteData.location_details) || hasData(wasteData.vendor?.company_name) || hasData(wasteData.commodity?.category_name) || hasData(wasteData.category?.category_name)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <InfoRow label="Location" value={wasteData.location_details} />
            <InfoRow label="Commodity/Source" value={wasteData.commodity?.category_name} />
            <InfoRow label="Operational Name" value={wasteData.operational_landlord?.category_name} />
            <InfoRow label="Generated Unit" value={`${wasteData.waste_unit} KG`} />
            <InfoRow label="Agency Name" value={wasteData.agency_name} />
            <InfoRow label="Reference Number" value={wasteData.reference_number} />
          </div>
          
          <div className="space-y-4">
            <InfoRow label="Vendor" value={wasteData.vendor?.company_name} />
            <InfoRow label="Category" value={wasteData.category?.category_name} />
            <InfoRow label="Recycled Unit" value={`${wasteData.recycled_unit} KG`} />
            <InfoRow label="Building" value={wasteData.building_name} />
            <InfoRow label="Wing" value={wasteData.wing_name} />
            <InfoRow label="Area" value={wasteData.area_name} />
          </div>
        </div>
      </ExpandableSection>

      {/* Section 2: Date & Creator Information */}
      <ExpandableSection
        title="DATE & CREATOR INFORMATION"
        icon={Calendar}
        isExpanded={expandedSections.dateInfo}
        onToggle={() => toggleSection('dateInfo')}
        hasDataValue={hasData(wasteData.wg_date) || hasData(wasteData.created_by?.full_name) || hasData(wasteData.created_at)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <InfoRow label="Waste Date" value={wasteData.wg_date ? new Date(wasteData.wg_date).toLocaleDateString() : 'N/A'} />
            <InfoRow label="Created At" value={wasteData.created_at ? new Date(wasteData.created_at).toLocaleString() : 'N/A'} />
          </div>
          <div className="space-y-4">
            <InfoRow label="Created By" value={wasteData.created_by?.full_name} />
            <InfoRow label="Creator Email" value={wasteData.created_by?.email} />
            <InfoRow label="Updated At" value={wasteData.updated_at ? new Date(wasteData.updated_at).toLocaleString() : 'N/A'} />
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default WasteGenerationDetailsPage;
