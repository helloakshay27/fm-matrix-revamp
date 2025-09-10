import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Building, Palette, Calendar, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from 'sonner';
import { fetchParkingDetails, ParkingDetailsResponse } from '@/services/parkingConfigurationsAPI';

const ParkingDetailsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  // API state
  const [parkingDetails, setParkingDetails] = useState<ParkingDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    clientInfo: true,
    parkingSummary: true,
    leaseInfo: true,
  });

  // Helper function to check if value has data
  const hasData = (value: unknown) => {
    return value && value !== null && value !== undefined && value !== '';
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fetch parking details on component mount
  useEffect(() => {
    const loadParkingDetails = async () => {
      if (!clientId) {
        setError('Client ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchParkingDetails(clientId);
        setParkingDetails(response);
      } catch (error) {
        console.error('Error loading parking details:', error);
        setError('Failed to load parking details');
        toast.error('Failed to load parking details');
      } finally {
        setLoading(false);
      }
    };

    loadParkingDetails();
  }, [clientId]);

  const handleBack = () => {
    navigate('/vas/parking');
  };

  // Expandable Section Component (similar to TicketDetailsPage)
  const ExpandableSection = ({ 
    title, 
    icon: Icon, 
    isExpanded, 
    onToggle, 
    children,
    hasData = true 
  }: {
    title: string;
    icon: React.ElementType;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    hasData?: boolean;
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
          {!hasData && (
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

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center mb-6">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            className="mr-4 p-2 hover:bg-[#C72030]/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#C72030]">Loading...</h1>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading parking details...</div>
        </div>
      </div>
    );
  }

  if (error || !parkingDetails) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center mb-6">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            className="mr-4 p-2 hover:bg-[#C72030]/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#C72030]">Error Loading Data</h1>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {error || 'Client data could not be loaded'}
            </h2>
            <p className="text-gray-600 mb-6">Please try again or contact support if the problem persists.</p>
            <Button 
              onClick={handleBack}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Parking Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-[#1a1a1a]">Back to Parking Dashboard</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Client Parking Details</h1>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate(`/vas/parking/edit/${clientId}`)}
              style={{ backgroundColor: '#C72030' }} 
              className="text-white hover:bg-[#C72030]/90"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section 1: Client Information */}
      <ExpandableSection
        title="CLIENT INFORMATION"
        icon={Building}
        isExpanded={expandedSections.clientInfo}
        onToggle={() => toggleSection('clientInfo')}
        hasData={hasData(parkingDetails.entity.name)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Client Name</span>
              <span className="text-gray-500 mx-3">:</span>
              <span className="text-gray-900 font-semibold flex-1">{parkingDetails.entity.name}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Color Code</span>
              <span className="text-gray-500 mx-3">:</span>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: parkingDetails.entity.color_code }}
                ></div>
                <span className="text-gray-900 font-semibold">{parkingDetails.entity.color_code}</span>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Section 2: Parking Summary */}
      <ExpandableSection
        title="PARKING SUMMARY"
        icon={Palette}
        isExpanded={expandedSections.parkingSummary}
        onToggle={() => toggleSection('parkingSummary')}
        hasData={hasData(parkingDetails.parking_summary.two_wheeler_count) || hasData(parkingDetails.parking_summary.four_wheeler_count)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-gray-500 w-40 flex-shrink-0 font-medium">2 Wheeler Slots</span>
              <span className="text-gray-500 mx-3">:</span>
              <span className="text-gray-900 font-semibold flex-1">{parkingDetails.parking_summary.two_wheeler_count}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-gray-500 w-40 flex-shrink-0 font-medium">4 Wheeler Slots</span>
              <span className="text-gray-500 mx-3">:</span>
              <span className="text-gray-900 font-semibold flex-1">{parkingDetails.parking_summary.four_wheeler_count}</span>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Section 3: Lease Information */}
      <ExpandableSection
        title="LEASE INFORMATION"
        icon={Calendar}
        isExpanded={expandedSections.leaseInfo}
        onToggle={() => toggleSection('leaseInfo')}
        hasData={parkingDetails.leases && parkingDetails.leases.length > 0}
      >
        {parkingDetails.leases && parkingDetails.leases.length > 0 ? (
          <div className="space-y-4">
            {parkingDetails.leases.map((lease) => (
              <div key={lease.id} className={`border rounded-lg p-6 ${lease.lease_period.expired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Lease Period</span>
                  {lease.lease_period.expired ? (
                    <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Expired
                    </span>
                  ) : (
                    <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <span className={`inline-block text-white px-4 py-2 rounded font-medium ${lease.lease_period.expired ? 'bg-[#C72030]' : 'bg-green-600'}`}>
                    {lease.lease_period.start_date} - {lease.lease_period.end_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No lease information found</p>
        )}
      </ExpandableSection>
    </div>
  );
};

export default ParkingDetailsPage;