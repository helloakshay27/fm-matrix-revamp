
import React, { useState, useEffect } from 'react';
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

export const IncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInjuryModal, setShowInjuryModal] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleDownloadReport = () => {
    if (!incident) return;

    console.log('Downloading report for incident:', id);
    // Create a simple text report
    const reportContent = `
INCIDENT REPORT
================
Incident ID: #${incident.id}
Date: ${incident.inc_time ? new Date(incident.inc_time).toLocaleString() : 'N/A'}
Location: ${incident.building_name || 'N/A'}
Description: ${incident.description}
Status: ${incident.current_status}
Level: ${incident.inc_level_name || 'N/A'}
Reported By: ${incident.created_by}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Detail (#{incident.id})</h1>
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
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
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
            <div>
              <span className="text-sm text-gray-600">Status</span>
              <p className="font-medium">: {incident.current_status}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Incident Date and Time</span>
              <p className="font-medium">: {incident.inc_time ? new Date(incident.inc_time).toLocaleString() : '-'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Reporting Date and Time</span>
              <p className="font-medium">: {incident.created_at ? new Date(incident.created_at).toLocaleString() : '-'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Level</span>
              <p className="font-medium">: {incident.inc_level_name || '-'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Support Required</span>
              <p className="font-medium">: {incident.support_required ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Sent for Medical Treatment</span>
              <p className="font-medium">: {incident.sent_for_medical_treatment}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Tower</span>
              <p className="font-medium">: {incident.tower_name || '-'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Building</span>
              <p className="font-medium">: {incident.building_name || '-'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Reported By</span>
              <p className="font-medium">: {incident.created_by}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Primary Category</span>
              <p className="font-medium">: {incident.category_name || '-'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">First Aid provided by Employees?</span>
              <p className="font-medium">: {incident.first_aid_provided}</p>
            </div>
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
          <div>
            <span className="text-sm text-gray-600">Description</span>
            <p className="font-medium">: {incident.description}</p>
          </div>
          {incident.sub_category_name && (
            <div>
              <span className="text-sm text-gray-600">Sub Category</span>
              <p className="font-medium">: {incident.sub_category_name}</p>
            </div>
          )}
          {incident.sub_sub_category_name && (
            <div>
              <span className="text-sm text-gray-600">Sub Sub Category</span>
              <p className="font-medium">: {incident.sub_sub_category_name}</p>
            </div>
          )}
          {incident.assigned_to_user_name && (
            <div>
              <span className="text-sm text-gray-600">Assigned To</span>
              <p className="font-medium">: {incident.assigned_to_user_name}</p>
            </div>
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
