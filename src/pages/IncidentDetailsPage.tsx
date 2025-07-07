
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Edit, Plus } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { UpdateIncidentModal } from '@/components/UpdateIncidentModal';
import { AddInjuryModal } from '@/components/AddInjuryModal';

export const IncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInjuryModal, setShowInjuryModal] = useState(false);

  // Determine if we're in Safety or Maintenance context
  const isSafetyContext = location.pathname.startsWith('/safety');
  const basePath = isSafetyContext ? '/safety' : '/maintenance';

  // Mock incident data
  const incident = {
    id: `#${id}`,
    description: 'ygyuiyi',
    site: 'Lockated',
    region: '',
    tower: 'Jyoti Tower',
    incidentTime: '29/01/2025 3:21 PM',
    level: 'Level 3',
    category: 'Risk Assessment',
    subCategory: 'Access Control',
    supportRequired: 'Yes',
    assignedTo: '',
    currentStatus: 'Open',
    reportedBy: 'Tejas Chaudhari',
    location: 'Building A, Floor 3',
    severity: 'Medium',
    injuryOccurred: 'No',
    propertyDamage: 'No',
    immediateAction: 'Area secured and cleaned',
    rootCause: 'Under investigation',
    preventiveMeasures: 'To be determined',
    reportingTime: '29/01/2025 3:22 PM',
    firstAidProvided: 'No',
    medicalTreatment: 'No'
  };

  const handleEditDetails = () => {
    navigate(`${basePath}/incident/edit/${id}`);
  };

  const handleDownloadReport = () => {
    console.log('Downloading report for incident:', id);
    // Create a simple text report
    const reportContent = `
INCIDENT REPORT
================
Incident ID: ${incident.id}
Date: ${incident.incidentTime}
Location: ${incident.location}
Description: ${incident.description}
Status: ${incident.currentStatus}
Severity: ${incident.severity}
Reported By: ${incident.reportedBy}
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>{isSafetyContext ? 'Safety' : 'Incidents'}</span>
          <span className="mx-2">{'>'}</span>
          <span>Incidents Details</span>
        </nav>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">Detail ({incident.id})</h1>
          </div>
          <div className="flex gap-3">
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ color: '#C72030' }} className="flex items-center">
            <span className="mr-2">🔥</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Status</span>
                <p className="font-medium">: {incident.currentStatus}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Incident Date and Time</span>
                <p className="font-medium">: {incident.incidentTime}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Reporting Date and Time</span>
                <p className="font-medium">: {incident.reportingTime}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Level</span>
                <p className="font-medium">: {incident.level}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Support Required</span>
                <p className="font-medium">: {incident.supportRequired}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Sent for Medical Treatment</span>
                <p className="font-medium">: {incident.medicalTreatment}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Tower</span>
                <p className="font-medium">: {incident.tower}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Incident Date and Time</span>
                <p className="font-medium">: {incident.incidentTime}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Reported By</span>
                <p className="font-medium">: {incident.reportedBy}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Primary Category</span>
                <p className="font-medium">: {incident.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">First Aid provided by Employees?</span>
                <p className="font-medium">: {incident.firstAidProvided}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ color: '#C72030' }} className="flex items-center">
            <span className="mr-2">🔥</span>
            DESCRIPTION DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <span className="text-sm text-gray-600">Description</span>
            <p className="font-medium">: {incident.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Injuries Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ color: '#C72030' }} className="flex items-center">
            <span className="mr-2">🩹</span>
            INJURIES - 0
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No injuries reported for this incident.</p>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle style={{ color: '#C72030' }} className="flex items-center">
            <span className="mr-2">📎</span>
            Attachments - 0
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No attachments available.</p>
        </CardContent>
      </Card>

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
        onClose={() => setShowUpdateModal(false)}
        incidentId={incident.id}
      />

      <AddInjuryModal
        isOpen={showInjuryModal}
        onClose={() => setShowInjuryModal(false)}
        incidentId={incident.id}
      />
    </div>
  );
};
