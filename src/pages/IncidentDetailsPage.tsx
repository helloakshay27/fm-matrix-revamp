
import React, { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  Plus,
  AlertTriangle,
  Heart,
  Paperclip,
  Loader2,
  Users,
  Settings,
  FileText,
  FileSpreadsheet,
  File,
  Eye,
  Search,
  ArrowLeft
} from 'lucide-react';
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
  const [witnessesExpanded, setWitnessesExpanded] = useState(true);
  const [investigationExpanded, setInvestigationExpanded] = useState(true);

  const [costExpanded, setCostExpanded] = useState(true);
  const [injuriesExpanded, setInjuriesExpanded] = useState(true);
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(true);
  const [updateStatusExpanded, setUpdateStatusExpanded] = useState(true);

  // Determine if we're in Safety or Maintenance context
  const isSafetyContext = location.pathname.startsWith('/safety');
  const basePath = isSafetyContext ? '/safety' : '/maintenance';


  const severityMap = {
    "1": "Insignificant",
    "2": "Minor",
    "3": "Moderate",
    "4": "Major",
    "5": "Catastrophic"
  };


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
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
              <Icon className="w-6 h-6" style={{ color: '#C72030' }} />
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
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 mb-4"
        type="button"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>
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
              <Edit className="w-4 h-4 mr-2" style={{ color: '#C72030', background: '#E5E0D3' }} />
              Edit Details
            </Button>
            <Button
              onClick={() => setShowUpdateModal(true)}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              <Settings className="w-4 h-4 mr-2" style={{ color: '#C72030', background: '#E5E0D3' }} />
              Update Status
            </Button>
            <Button
              onClick={() => setShowInjuryModal(true)}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" style={{ color: '#C72030', background: '#E5E0D3' }} />
              Add Injury
            </Button>
            <Button
              onClick={handleDownloadReport}
              disabled={downloadLoading}
              style={{ backgroundColor: downloadLoading ? '#666' : '#C72030' }}
              className="text-white hover:opacity-90"
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" style={{ color: '#C72030', background: '#E5E0D3' }} />
              ) : (
                <Download className="w-4 h-4 mr-2" style={{ color: '#C72030', background: '#E5E0D3' }} />
              )}
              {downloadLoading ? 'Downloading...' : 'Download Report'}
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Details Section */}
      {/* <CollapsibleSection
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
              label="First Aid Attendants"
              value={incident.incident_detail.name_first_aid_attendants || '-'}
            />

            <Field
              label="Sent for Medical Treatment"
              value={incident.sent_for_medical_treatment}
            />
            <Field
              label="Has Any Property Damage Happened In The Incident"
              value={incident.property_damage ? "Yes" : "No"}
            />
            <Field
              label="Damage Covered Under Insurance"
              value={incident.damage_covered_insurance ? "Yes" : "No"}
            />
          </div>
          <div className="space-y-4">
            
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

            <Field
              label="First Aid provided by Employees?"
              value={incident.first_aid_provided}
            />
            <Field
              label="Name and Address of Treatment Facility"
              value={incident.incident_detail.name_and_address_treatment_facility || '-'}
            />

            <Field
              label="Name and Address of Attending Physician"
              value={incident.incident_detail.name_and_address_attending_physician || '-'}

            />
            <Field
              label="Property Damage Category
"
              value={incident.property_damage_category_name || '-'}
            />

            <Field
              label="Insured By"
              value={incident.insured_by || '-'}
            />

          </div>
        </div>
      </CollapsibleSection> */}

      <CollapsibleSection
        title="BASIC DETAILS"
        icon={AlertTriangle}
        isExpanded={basicDetailsExpanded}
        onToggle={() => setBasicDetailsExpanded(!basicDetailsExpanded)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {incident.current_status && (
              <Field label="Status" value={incident.current_status} />
            )}
            {incident.inc_time && (
              <Field
                label="Incident Date and Time"
                value={new Date(incident.inc_time).toLocaleString()}
              />
            )}
            {incident.created_at && (
              <Field
                label="Reporting Date and Time"
                value={new Date(incident.created_at).toLocaleString()}
              />
            )}
            {incident.updated_at && (
              <Field
                label="Revision Date and Time"
                value={new Date(incident.updated_at).toLocaleString()}
              />
            )}
            {incident.inc_level_name && (
              <Field label="Level" value={incident.inc_level_name} />
            )}
            {incident.support_required !== undefined && (
              <Field
                label="Support Required"
                value={incident.support_required ? "Yes" : "No"}
              />
            )}
            {incident.first_aid_provided !== undefined && (
              <Field
                label="First Aid Provided by Employees?"
                value={incident.first_aid_provided}
              />
            )}
            {incident.incident_detail?.name_first_aid_attendants && (
              <Field
                label="First Aid Attendants"
                value={incident.incident_detail.name_first_aid_attendants}
              />
            )}
            {incident.sent_for_medical_treatment !== undefined && (
              <Field
                label="Sent for Medical Treatment"
                value={incident.sent_for_medical_treatment ? "Yes" : "No"}
              />
            )}
            {incident.incident_detail?.name_and_address_treatment_facility && (
              <Field
                label="Name and Address of Treatment Facility"
                value={incident.incident_detail.name_and_address_treatment_facility}
              />
            )}
            {incident.incident_detail?.name_and_address_attending_physician && (
              <Field
                label="Name and Address of Attending Physician"
                value={incident.incident_detail.name_and_address_attending_physician}
              />
            )}
            {/* {incident.rca && <Field label="RCA" value={incident.rca} />}
      {incident.rca_category_name && (
        <Field label="RCA Category" value={incident.rca_category_name} />
      )} */}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {incident.site_name && <Field label="Site" value={incident.site_name} />}
            {incident.building_name && (
              <Field label="Building" value={incident.building_name} />
            )}
            {incident.created_by && (
              <Field label="Reported By" value={incident.created_by} />
            )}
            {incident.category_name && (
              <Field label="Primary Category" value={incident.category_name} />
            )}
            {incident.sub_category_name && (
              <Field label="Sub Category" value={incident.sub_category_name} />
            )}
            {incident.sub_sub_category_name && (
              <Field label="Sub Sub Category" value={incident.sub_sub_category_name} />
            )}
            {incident.sub_sub_sub_category_name && (
              <Field
                label="Sub Sub Sub Category"
                value={incident.sub_sub_sub_category_name}
              />
            )}
            {incident.sec_category_name && (
              <Field label="Secondary Category" value={incident.sec_category_name} />
            )}
            {incident.sec_sub_category_name && (
              <Field
                label="Secondary Sub Category"
                value={incident.sec_sub_category_name}
              />
            )}
            {incident.sec_sub_sub_category_name && (
              <Field
                label="Secondary Sub Sub Category"
                value={incident.sec_sub_sub_category_name}
              />
            )}
            {incident.sec_sub_sub_sub_category_name && (
              <Field
                label="Secondary Sub Sub Sub Category"
                value={incident.sec_sub_sub_sub_category_name}
              />
            )}
            {incident.assigned_to_user_name && (
              <Field label="Assigned To" value={incident.assigned_to_user_name} />
            )}
            {incident.property_damage !== undefined && (
              <Field
                label="Has Any Property Damage Happened In The Incident"
                value={incident.property_damage ? "Yes" : "No"}
              />
            )}
            {incident.property_damage_category_name && (
              <Field
                label="Property Damage Category"
                value={incident.property_damage_category_name}
              />
            )}
            {incident.damage_covered_insurance !== undefined && (
              <Field
                label="Damage Covered Under Insurance"
                value={incident.damage_covered_insurance ? "Yes" : "No"}
              />
            )}
            {incident.insured_by && <Field label="Insured By" value={incident.insured_by} />}
            {incident.damaged_recovered && (
              <Field label="Damaged Recovered" value={incident.damaged_recovered} />
            )}
          </div>
        </div>
      </CollapsibleSection>



      {/* <CollapsibleSection
        title="DESCRIPTION DETAILS"
        icon={Edit}
        isExpanded={descriptionExpanded}
        onToggle={() => setDescriptionExpanded(!descriptionExpanded)}
      >
        <div className="space-y-4">
          <Field
            label="Description"
            value={incident.description}
          />
          <Field
            label="RCA"
            value={incident.rca}
          />
          <Field
            label="RCA Category"
            value={incident.rca_category?.name}
          />
          <Field
            label="Corrective Action"
            value={incident.corrective_action}
          />
          <Field
            label="Preventive Action"
            value={incident.preventive_action}
          />
        </div>
      </CollapsibleSection> */}

      <CollapsibleSection
        title="DESCRIPTION DETAILS"
        icon={Edit}
        isExpanded={descriptionExpanded}
        onToggle={() => setDescriptionExpanded(!descriptionExpanded)}
      >
        <div className="space-y-4">
          {incident.description && (
            <Field label="Description" value={incident.description} />
          )}
          {incident.rca && <Field label="RCA" value={incident.rca} />}
          {incident.rca_category_name && (
            <Field label="RCA Category" value={incident.rca_category_name} />
          )}
          {incident.corrective_action && (
            <Field label="Corrective Action" value={incident.corrective_action} />
          )}
          {incident.preventive_action && (
            <Field label="Preventive Action" value={incident.preventive_action} />
          )}
          {incident.loss !== null && <Field label="Loss" value={incident.loss} />}
          {incident.control && <Field label="Control" value={incident.control} />}
          {incident.hours_worked !== null && (
            <Field label="Hours Worked" value={incident.hours_worked} />
          )}
          {incident.severity && (
            <Field label="Severity" value={severityMap[incident.severity]} />
          )}
          {incident.severity_brief && (
            <Field label="Severity Brief" value={incident.severity_brief} />
          )}
        </div>
      </CollapsibleSection>





      {/* Witnesses Section */}
      <CollapsibleSection
        title={`WITNESSES - ${incident.incident_witnesses?.length || 0}`}
        icon={Users}
        isExpanded={witnessesExpanded}
        onToggle={() => setWitnessesExpanded(!witnessesExpanded)}
        hasData={incident.incident_witnesses && incident.incident_witnesses.length > 0}
      >
        {incident.incident_witnesses && incident.incident_witnesses.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incident.incident_witnesses.map((witness, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {witness.name || '-'}
                    </TableCell>
                    <TableCell>
                      {witness.mobile || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-600">No witnesses reported for this incident.</p>
        )}
      </CollapsibleSection>

      {/* Investigation Section */}
      <CollapsibleSection
        title={`INVESTIGATION - ${incident.incident_investigations?.length || 0}`}
        icon={Search}
        isExpanded={investigationExpanded}
        onToggle={() => setInvestigationExpanded(!investigationExpanded)}
        hasData={incident.incident_investigations && incident.incident_investigations.length > 0}
      >
        {incident.incident_investigations && incident.incident_investigations.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Designation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incident.incident_investigations.map((investigator) => (
                  <TableRow key={investigator.id}>
                    <TableCell>{investigator.name || '-'}</TableCell>
                    <TableCell>{investigator.mobile || '-'}</TableCell>
                    <TableCell>{investigator.designation || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-600">No investigation details available for this incident.</p>
        )}
      </CollapsibleSection>


      {/* Cost of Incident Section */}
      <CollapsibleSection
        title="COST OF THE INCIDENT"
        icon={Settings}
        isExpanded={costExpanded}
        onToggle={() => setCostExpanded(!costExpanded)}
        hasData={Boolean(
          incident.equipment_property_damaged_cost ||
          incident.production_loss ||
          incident.treatment_cost ||
          incident.absenteeism_cost ||
          incident.other_cost ||
          incident.total_cost
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field
              label="Equipment / Property Damaged"
              value={incident.equipment_property_damaged_cost ? `${incident.equipment_property_damaged_cost}.0` : '-'}
            />
            <Field
              label="Treatment Cost"
              value={incident.treatment_cost ? `${incident.treatment_cost}.0` : '-'}
            />
            <Field
              label="Other Cost"
              value={incident.other_cost ? `${incident.other_cost}.0` : '-'}
            />
          </div>
          <div className="space-y-4">
            <Field
              label="Production Loss"
              value={incident.production_loss ? `${incident.production_loss}.0` : '-'}
            />
            <Field
              label="Absenteeism Cost"
              value={incident.absenteeism_cost ? `${incident.absenteeism_cost}.0` : '-'}
            />
            <Field
              label="Total Cost"
              value={incident.total_cost ? `${incident.total_cost}.0` : '-'}
            />
          </div>
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
          <div className="flex items-center flex-wrap gap-4">
            {incident.attachments.map((attachment) => {
              const attachmentUrl = attachment.url;
              const attachmentName = attachment.doctype || `Document_${attachment.id}`;
              const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachmentUrl || '') || attachment.doctype?.startsWith('image/');
              const isPdf = /\.pdf$/i.test(attachmentUrl || '') || attachment.doctype === 'application/pdf';
              const isExcel = /\.(xls|xlsx|csv)$/i.test(attachmentUrl || '') || attachment.doctype?.includes('spreadsheet');
              const isWord = /\.(doc|docx)$/i.test(attachmentUrl || '') || attachment.doctype?.includes('document');
              const isDownloadable = isPdf || isExcel || isWord;

              return (
                <div
                  key={attachment.id}
                  className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                >
                  {isImage ? (
                    <>
                      <img
                        src={attachmentUrl}
                        alt={attachmentName}
                        className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                        onClick={() => window.open(attachmentUrl, '_blank')}
                        style={{ background: '#E5E0D3' }}
                      />
                    </>
                  ) : isPdf ? (
                    <div className="w-14 h-14 flex items-center justify-center border rounded-md bg-[#E5E0D3] mb-2">
                      <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                  ) : isExcel ? (
                    <div className="w-14 h-14 flex items-center justify-center border rounded-md bg-[#E5E0D3] mb-2">
                      <FileSpreadsheet className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                  ) : isWord ? (
                    <div className="w-14 h-14 flex items-center justify-center border rounded-md bg-[#E5E0D3] mb-2">
                      <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center border rounded-md bg-[#E5E0D3] mb-2">
                      <File className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                  )}
                  <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                    {attachmentName}
                  </span>
                  {(isDownloadable || isImage) && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                      onClick={() => {
                        if (isImage) {
                          window.open(attachmentUrl, '_blank');
                        } else if (attachmentUrl) {
                          window.open(attachmentUrl, '_blank');
                        }
                      }}
                    >
                      {isImage ? <Eye className="w-4 h-4" style={{ color: '#C72030', background: '#E5E0D3', borderRadius: '50%' }} /> : <Download className="w-4 h-4" style={{ color: '#C72030', background: '#E5E0D3', borderRadius: '50%' }} />}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">No attachments available.</p>
        )}
      </CollapsibleSection>

      {/* Update Status Section */}
      <CollapsibleSection
        title={`UPDATE STATUS - ${incident.logs?.length || 0}`}
        icon={Settings}
        isExpanded={updateStatusExpanded}
        onToggle={() => setUpdateStatusExpanded(!updateStatusExpanded)}
        hasData={incident.logs && incident.logs.length > 0}
      >
        {incident.logs && incident.logs.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Updated By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incident.logs.map((log, index) => (
                  <TableRow key={log.id || index}>
                    <TableCell className="font-medium">
                      {log.log_by || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {log.current_status || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.comment || '-'}
                    </TableCell>
                    <TableCell>
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-600">No status updates available for this incident.</p>
        )}
      </CollapsibleSection>

      {/* Action Buttons */}
      {/* <div className="flex gap-3 pt-6">
        <Button
          variant="outline"
          onClick={() => navigate(`${basePath}/incident`)}
          className="px-8"
        >
          Back to List
        </Button>
      </div> */}

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
    </div >
  );
};
