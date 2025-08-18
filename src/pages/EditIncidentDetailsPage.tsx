
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useParams, useNavigate } from 'react-router-dom';

export const EditIncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    incidentDate: '2025-01-29',
    incidentTime: '15:21',
    location: 'Building A, Floor 3',
    description: 'ygyuiyi',
    incidentType: 'accident',
    severity: 'medium',
    reportedBy: 'John Doe',
    witnessName: '',
    injuryOccurred: 'no',
    propertyDamage: 'no',
    immediateAction: 'Area secured and cleaned',
    rootCause: 'Under investigation',
    preventiveMeasures: 'To be determined',
    status: 'open',
    assignedTo: '',
    priority: 'medium'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateDetails = () => {
    console.log('Incident details updated:', formData);
    navigate(`/maintenance/safety/incident/${id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Safety</span>
          <span className="mx-2">{'>'}</span>
          <span>Incident</span>
          <span className="mx-2">{'>'}</span>
          <span>Edit Incident</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">EDIT INCIDENT DETAILS</h1>
        <p className="text-gray-600">Incident #{id}</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Incident Date*</Label>
                <Input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Incident Time*</Label>
                <Input
                  type="time"
                  value={formData.incidentTime}
                  onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location*</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter incident location"
              />
            </div>

            <div className="space-y-2">
              <Label>Description*</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the incident in detail"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Incident Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Incident Type*</Label>
                <Select value={formData.incidentType} onValueChange={(value) => handleInputChange('incidentType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accident">Accident</SelectItem>
                    <SelectItem value="near-miss">Near Miss</SelectItem>
                    <SelectItem value="property-damage">Property Damage</SelectItem>
                    <SelectItem value="security">Security Incident</SelectItem>
                    <SelectItem value="fire">Fire Incident</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severity Level*</Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Current Status*</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assigned To</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="safety-team">Safety Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* People Involved */}
        <Card>
          <CardHeader>
            <CardTitle>People Involved</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reported By*</Label>
                <Input
                  value={formData.reportedBy}
                  onChange={(e) => handleInputChange('reportedBy', e.target.value)}
                  placeholder="Name of person reporting"
                />
              </div>

              <div className="space-y-2">
                <Label>Witness Name</Label>
                <Input
                  value={formData.witnessName}
                  onChange={(e) => handleInputChange('witnessName', e.target.value)}
                  placeholder="Name of witness (if any)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Was there any injury?*</Label>
                <RadioGroup value={formData.injuryOccurred} onValueChange={(value) => handleInputChange('injuryOccurred', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="injury-yes" />
                    <Label htmlFor="injury-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="injury-no" />
                    <Label htmlFor="injury-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Property Damage*</Label>
                <RadioGroup value={formData.propertyDamage} onValueChange={(value) => handleInputChange('propertyDamage', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="damage-yes" />
                    <Label htmlFor="damage-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="damage-no" />
                    <Label htmlFor="damage-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Immediate Action Taken</Label>
              <Textarea
                value={formData.immediateAction}
                onChange={(e) => handleInputChange('immediateAction', e.target.value)}
                placeholder="Describe immediate actions taken"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Investigation */}
        <Card>
          <CardHeader>
            <CardTitle>Investigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Root Cause Analysis</Label>
              <Textarea
                value={formData.rootCause}
                onChange={(e) => handleInputChange('rootCause', e.target.value)}
                placeholder="Identify the root cause of the incident"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Preventive Measures</Label>
              <Textarea
                value={formData.preventiveMeasures}
                onChange={(e) => handleInputChange('preventiveMeasures', e.target.value)}
                placeholder="Recommend preventive measures"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => navigate(`/maintenance/safety/incident/${id}`)}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateDetails}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90 px-8"
          >
            Update Details
          </Button>
        </div>
      </div>
    </div>
  );
};
