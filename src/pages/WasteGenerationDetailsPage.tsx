import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
        
        // Use the specific API endpoint for fetching single waste generation
        const wasteGeneration = await fetchWasteGenerationById(parseInt(id));
        
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

  // Expandable Section Component - Removed, UI refactored inline

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
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      <Button
        variant="ghost"
        onClick={handleBackToList}
        className="mb-2 p-0"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-semibold">
          WASTE GENERATION DETAILS
        </h1>
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm"
            onClick={handleUpdate} 
            className="bg-[#6B2C91] hover:bg-[#5A2579] text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Section 1: Waste Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div
          onClick={() => toggleSection('wasteDetails')}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
              <Package className="w-4 h-4" style={{ color: "#C72030" }} />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
              WASTE DETAILS
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!hasData(wasteData.location_details) && !hasData(wasteData.vendor?.company_name) && !hasData(wasteData.commodity?.category_name) && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No data</span>
            )}
            {expandedSections.wasteDetails ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
          </div>
        </div>
        
        {expandedSections.wasteDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
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
          </div>
        )}
      </div>

      {/* Section 2: Date & Creator Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div
          onClick={() => toggleSection('dateInfo')}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
              <Calendar className="w-4 h-4" style={{ color: "#C72030" }} />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
              DATE & CREATOR INFORMATION
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!hasData(wasteData.wg_date) && !hasData(wasteData.created_by?.full_name) && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No data</span>
            )}
            {expandedSections.dateInfo ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
          </div>
        </div>

        {expandedSections.dateInfo && (
          <div className="mt-6 pt-6 border-t border-gray-200">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteGenerationDetailsPage;
