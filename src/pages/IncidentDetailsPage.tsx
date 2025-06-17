
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Edit, Plus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { UpdateIncidentModal } from '@/components/UpdateIncidentModal';
import { AddInjuryModal } from '@/components/AddInjuryModal';

export const IncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInjuryModal, setShowInjuryModal] = useState(false);

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
    reportedBy: 'John Doe',
    location: 'Building A, Floor 3',
    severity: 'Medium',
    injuryOccurred: 'No',
    propertyDamage: 'No',
    immediateAction: 'Area secured and cleaned',
    rootCause: 'Under investigation',
    preventiveMeasures: 'To be determined'
  };

  const handleEditDetails = () => {
    navigate(`/maintenance/safety/incident/${id}/edit`);
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
          <span>Safety</span>
          <span className="mx-2">{'>'}</span>
          <span>Incident</span>
          <span className="mx-2">{'>'}</span>
          <span>Incident Details</span>
        </nav>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">INCIDENT DETAILS</h1>
            <p className="text-gray-600">Incident {incident.id}</p>
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
              onClick={handleDownloadReport}
              variant="outline"
              className="border-[#C72030] text-[#C72030]"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Incident Details</TabsTrigger>
          <TabsTrigger value="injuries">Injuries</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Incident ID</p>
                  <p className="font-medium">{incident.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">{incident.incidentTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{incident.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reported By</p>
                  <p className="font-medium">{incident.reportedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800">{incident.currentStatus}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Severity</p>
                  <Badge className="bg-yellow-100 text-yellow-800">{incident.severity}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{incident.description}</p>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{incident.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sub Category</p>
                  <p className="font-medium">{incident.subCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Injury Occurred</p>
                  <p className="font-medium">{incident.injuryOccurred}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Property Damage</p>
                  <p className="font-medium">{incident.propertyDamage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investigation */}
          <Card>
            <CardHeader>
              <CardTitle>Investigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Immediate Action Taken</p>
                  <p>{incident.immediateAction}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Root Cause</p>
                  <p>{incident.rootCause}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Preventive Measures</p>
                  <p>{incident.preventiveMeasures}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="injuries" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Injuries Reported</CardTitle>
                <Button
                  onClick={() => setShowInjuryModal(true)}
                  style={{ backgroundColor: '#C72030' }}
                  className="text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Injury
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No injuries reported for this incident.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No attachments available.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-200 pl-4">
                  <p className="text-sm text-gray-600">29/01/2025 3:21 PM</p>
                  <p className="font-medium">Incident created</p>
                  <p className="text-sm text-gray-600">by John Doe</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6">
        <Button
          variant="outline"
          onClick={() => navigate('/maintenance/safety/incident')}
          className="px-8"
        >
          Back to List
        </Button>
        <Button
          onClick={() => setShowUpdateModal(true)}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 px-8"
        >
          Update Status
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
