
import React, { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Edit, Plus, Loader2, AlertTriangle, Heart, Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { UpdateIncidentModal } from '@/components/UpdateIncidentModal';
import { AddInjuryModal } from '@/components/AddInjuryModal';
import { incidentService, type Incident } from '@/services/incidentService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Field component for consistent styling - defined outside main component to prevent re-renders
const Field = memo(({
  label,
  value,
  fullWidth = false
}: {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}) => (
  <div className={`flex ${fullWidth ? 'flex-col' : 'items-center'} gap-4 ${fullWidth ? 'mb-4' : ''}`}>
    <label className={`${fullWidth ? 'text-sm' : 'w-32 text-sm'} font-medium text-gray-700`}>
      {label}
    </label>
    {!fullWidth && <span className="text-sm">:</span>}
    <span className={`text-sm text-gray-900 ${fullWidth ? 'mt-1' : 'flex-1'}`}>
      {value || '-'}
    </span>
  </div>
));

export const IncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInjuryModal, setShowInjuryModal] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [basicDetailsExpanded, setBasicDetailsExpanded] = useState(true);
  const [descriptionExpanded, setDescriptionExpanded] = useState(true);
  const [injuriesExpanded, setInjuriesExpanded] = useState(true);
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(true);

  // Determine if we're in Safety or Maintenance context
  const isSafetyContext = location.pathname.startsWith('/safety');
  const basePath = isSafetyContext ? '/safety' : '/maintenance';

  useEffect(() => {
    if (id) {
      fetchIncidentDetails();
    }
  }, [id]);

  const fetchIncidentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const incidentData = await incidentService.getIncidentById(id!);
      if (incidentData) {
        setIncident(incidentData);
      } else {
        setError('Incident not found');
      }
    } catch (err) {
      setError('Failed to fetch incident details');
      console.error('Error fetching incident:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDetails = () => {
    navigate(`${basePath}/incident/edit/${id}`);
  };

  const handleDownloadReport = async () => {
    if (!incident) return;

    try {
      setDownloadLoading(true);
      console.log('Downloading report for incident:', id);

      // Get baseUrl and token from localStorage
      let baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
      }

      const response = await fetch(`${baseUrl}/pms/incidents/${id}/incident_report`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response as blob for file download
      const blob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Try to get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `incident-report-${id}.pdf`; // Default filename

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Incident report downloaded successfully');

    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download incident report');
      setError('Failed to download incident report');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Collapsible Section Component
  const CollapsibleSection = ({
    title,
    icon: Icon,
    isExpanded,
    onToggle,
    children,
    hasData = true
  }: {
    title: string;
    icon: any;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    hasData?: boolean;
  }) => (
    <Card className="mb-6 border border-[#D9D9D9]">
      <CardHeader
        onClick={onToggle}
        className="cursor-pointer bg-[#F6F4EE] border-b border-[#D9D9D9]"
      >
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[#1A1A1A] font-semibold uppercase">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!hasData && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No data</span>
            )}
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
          </div>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-6 bg-[#F6F7F7]">
          {children}
        </CardContent>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading incident details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Incident not found'}</p>
            <Button
              variant="outline"
              onClick={() => navigate(`${basePath}/incident`)}
            >
              Back to List
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
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>{isSafetyContext ? 'Safety' : 'Incidents'}</span>
          <span className="mx-2">{'>'}</span>
          <span>Incidents Details</span>
        </nav>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Details ({incident.id})</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleEditDetails}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
            <Button
              onClick={() => setShowUpdateModal(true)}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              Update Status
            </Button>
            <Button
              onClick={() => setShowInjuryModal(true)}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Injury
            </Button>
            <Button
              onClick={handleDownloadReport}
              disabled={downloadLoading}
              style={{ backgroundColor: downloadLoading ? '#666' : '#C72030' }}
              className="text-white hover:opacity-90"
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {downloadLoading ? 'Downloading...' : 'Download Report'}
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Details Section */}
      <CollapsibleSection
        title="BASIC DETAILS"
        icon={AlertTriangle}
        isExpanded={basicDetailsExpanded}
        onToggle={() => setBasicDetailsExpanded(!basicDetailsExpanded)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field
              label="Status"
              value={incident.current_status}
            />
            <Field
              label="Incident Date and Time"
              value={incident.inc_time ? new Date(incident.inc_time).toLocaleString() : '-'}
            />
            <Field
              label="Reporting Date and Time"
              value={incident.created_at ? new Date(incident.created_at).toLocaleString() : '-'}
            />
            <Field
              label="Level"
              value={incident.inc_level_name || '-'}
            />
            <Field
              label="Support Required"
              value={incident.support_required ? 'Yes' : 'No'}
            />
            <Field
              label="Sent for Medical Treatment"
              value={incident.sent_for_medical_treatment}
            />
          </div>
          <div className="space-y-4">
            <Field
              label="Tower"
              value={incident.tower_name || '-'}
            />
            <Field
              label="Building"
              value={incident.building_name || '-'}
            />
            <Field
              label="Reported By"
              value={incident.created_by}
            />
            <Field
              label="Primary Category"
              value={incident.category_name || '-'}
            />
            <Field
              label="First Aid provided by Employees?"
              value={incident.first_aid_provided}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Description Details */}
      <CollapsibleSection
        title="DESCRIPTION DETAILS"
        icon={Edit}
        isExpanded={descriptionExpanded}
        onToggle={() => setDescriptionExpanded(!descriptionExpanded)}
      >
        <div className="space-y-4">
          <Field
            label="Description"
            value={incident.description}
            fullWidth={true}
          />
          {incident.sub_category_name && (
            <Field
              label="Sub Category"
              value={incident.sub_category_name}
            />
          )}
          {incident.sub_sub_category_name && (
            <Field
              label="Sub Sub Category"
              value={incident.sub_sub_category_name}
            />
          )}
          {incident.assigned_to_user_name && (
            <Field
              label="Assigned To"
              value={incident.assigned_to_user_name}
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Injuries Section */}
      <CollapsibleSection
        title={`INJURIES - ${incident.injuries?.length || 0}`}
        icon={Heart}
        isExpanded={injuriesExpanded}
        onToggle={() => setInjuriesExpanded(!injuriesExpanded)}
        hasData={incident.injuries && incident.injuries.length > 0}
      >
        {incident.injuries && incident.injuries.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Injury Type</TableHead>
                  <TableHead>Who Got Injured</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incident.injuries.map((injury, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {injury.injury_type || injury.injuryType || '-'}
                    </TableCell>
                    <TableCell>
                      {injury.who_got_injured || '-'}
                    </TableCell>
                    <TableCell>
                      {injury.name || '-'}
                    </TableCell>
                    <TableCell>
                      {injury.mobile || '-'}
                    </TableCell>
                    <TableCell>
                      {injury.company_name || injury.companyName || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-600">No injuries reported for this incident.</p>
        )}
      </CollapsibleSection>

      {/* Attachments Section */}
      <CollapsibleSection
        title={`ATTACHMENTS - ${incident.attachments?.length || 0}`}
        icon={Paperclip}
        isExpanded={attachmentsExpanded}
        onToggle={() => setAttachmentsExpanded(!attachmentsExpanded)}
        hasData={incident.attachments && incident.attachments.length > 0}
      >
        {incident.attachments && incident.attachments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incident.attachments.map((attachment) => (
              <div key={attachment.id} className="bg-white border rounded p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">
                    {attachment.doctype || 'File'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(attachment.url, '_blank')}
                  >
                    View
                  </Button>
                </div>
                {attachment.doctype?.startsWith('image/') && (
                  <img
                    src={attachment.url}
                    alt="Attachment"
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No attachments available.</p>
        )}
      </CollapsibleSection>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6">
        <Button
          variant="outline"
          onClick={() => navigate(`${basePath}/incident`)}
          className="px-8"
        >
          Back to List
        </Button>
      </div>

      <UpdateIncidentModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          fetchIncidentDetails(); // Refresh the incident details to show updated data
        }}
        incidentId={incident.id.toString()}
      />

      <AddInjuryModal
        isOpen={showInjuryModal}
        onClose={() => {
          setShowInjuryModal(false);
          fetchIncidentDetails(); // Refresh the incident details to show updated data
        }}
        incidentId={incident.id.toString()}
      />
    </div>
  );
};
