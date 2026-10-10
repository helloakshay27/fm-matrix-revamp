import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StatusBadge } from "@/components/ui/status-badge";
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
    navigate(-1);
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
    <div
      className="bg-white"
      style={{
        border: '1px solid var(--color-divider)',
        borderRadius: 16,
        marginBottom: 20,
        boxShadow: 'none',
        outline: 'none',
      }}
    >
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center justify-between"
        style={{ padding: '22px 24px', backgroundColor: '#fff' }}
      >
        <div className="flex items-center" style={{ gap: 8 }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-ink-68)]">
            <Icon className="h-4 w-4" />
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--color-text)', textTransform: 'uppercase', margin: 0 }}>
            {title}
          </h3>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          {!hasData && (
            <span
              className="rounded-full bg-[var(--color-surface)] text-[var(--color-ink-48)]"
              style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px' }}
            >
              No data
            </span>
          )}
          {isExpanded
            ? <ChevronUp className="h-4 w-4 text-[var(--color-ink-48)]" />
            : <ChevronDown className="h-4 w-4 text-[var(--color-ink-48)]" />}
        </div>
      </div>
      {isExpanded && (
        <div style={{ padding: '0 24px 22px', backgroundColor: '#fff' }}>
          {children}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-700">Loading parking details...</p>
        </div>
      </div>
    );
  }

  if (error || !parkingDetails) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', padding: '24px 32px 48px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 22px' }}>
          Error Loading Data
        </h1>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', marginBottom: 16 }}>
              {error || 'Client data could not be loaded'}
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--color-ink-68)', marginBottom: 24 }}>
              Please try again or contact support if the problem persists.
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-[22px] text-[13px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
              style={{ boxShadow: 'none' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Parking Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div style={{ padding: '24px 32px 48px' }}>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[12.5px] font-semibold text-[var(--color-ink-48)] hover:text-[var(--color-text)]"
          style={{ marginBottom: 12 }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Parking Dashboard
        </button>

        <div className="flex items-center justify-between" style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.2, margin: 0, color: 'var(--color-text)' }}>
            Client Parking Details
          </h1>
          <button
            type="button"
            onClick={() => navigate(`/vas/parking/edit/${clientId}`)}
            aria-label="Edit parking details"
            className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
            style={{ boxShadow: 'none' }}
          >
            <Edit className="h-4 w-4" />
          </button>
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
              <span className="w-40 flex-shrink-0 font-medium text-[var(--color-ink-48)]">Client Name</span>
              <span className="mx-3 text-[var(--color-ink-30)]">:</span>
              <span className="flex-1 font-medium text-[var(--color-text)]">{parkingDetails.entity.name}</span>
            </div>
            <div className="flex items-start">
              <span className="w-40 flex-shrink-0 font-medium text-[var(--color-ink-48)]">Color Code</span>
              <span className="mx-3 text-[var(--color-ink-30)]">:</span>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: parkingDetails.entity.color_code }}
                ></div>
                <span className="font-medium text-[var(--color-text)]">{parkingDetails.entity.color_code}</span>
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
              <span className="w-40 flex-shrink-0 font-medium text-[var(--color-ink-48)]">2 Wheeler Slots</span>
              <span className="mx-3 text-[var(--color-ink-30)]">:</span>
              <span className="flex-1 font-medium text-[var(--color-text)]">{parkingDetails.parking_summary.two_wheeler_count}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="w-40 flex-shrink-0 font-medium text-[var(--color-ink-48)]">4 Wheeler Slots</span>
              <span className="mx-3 text-[var(--color-ink-30)]">:</span>
              <span className="flex-1 font-medium text-[var(--color-text)]">{parkingDetails.parking_summary.four_wheeler_count}</span>
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
              <div
                key={lease.id}
                className="bg-white"
                style={{ border: '1px solid var(--color-divider)', borderRadius: 12, padding: '18px 20px', boxShadow: 'none', outline: 'none' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink-68)' }}>Lease Period</span>
                  {lease.lease_period.expired ? (
                    <StatusBadge variant="inactive" size="lg">Expired</StatusBadge>
                  ) : (
                    <StatusBadge variant="active" size="lg">Active</StatusBadge>
                  )}
                </div>
                <div>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--color-text)' }}>
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
    </div>
  );
};

export default ParkingDetailsPage;