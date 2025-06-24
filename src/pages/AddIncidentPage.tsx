import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AddIncidentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    incidentType: '',
    severity: '',
    reportedBy: '',
    witnessName: '',
    injuryOccurred: '',
    propertyDamage: '',
    immediateAction: '',
    rootCause: '',
    preventiveMeasures: ''
  });

  // Determine if we're in Safety or Maintenance context
  const isSafetyContext = location.pathname.startsWith('/safety');
  const basePath = isSafetyContext ? '/safety' : '/maintenance';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Incident submitted:', formData);
    navigate(`${basePath}/incident`);
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.jpg,.jpeg,.png,.pdf,.doc,.docx';
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        console.log('Files selected:', Array.from(files).map(f => f.name));
        // Handle file upload logic here
      }
    };
    fileInput.click();
  };

  return (
    <div className="flex-1 p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <nav className="flex items-center text-sm text-gray-600 mb-3">
          <span>Safety</span>
          <span className="mx-2">{'>'}</span>
          <span>Incident</span>
          <span className="mx-2">{'>'}</span>
          <span>Add Incident</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">ADD INCIDENT</h1>
      </div>

      <div className="space-y-4 max-w-full">
        {/* Basic Information */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Incident Date*</Label>
                <Input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Incident Time*</Label>
                <Input
                  type="time"
                  value={formData.incidentTime}
                  onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Location*</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter incident location"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description*</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the incident in detail"
                className="min-h-[120px] w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Incident Classification */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle>Incident Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Incident Type*</Label>
                <Select value={formData.incidentType} onValueChange={(value) => handleInputChange('incidentType', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select incident type" />
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
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select severity" />
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

        {/* People Involved */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle>People Involved</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reported By*</Label>
                <Input
                  value={formData.reportedBy}
                  onChange={(e) => handleInputChange('reportedBy', e.target.value)}
                  placeholder="Name of person reporting"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Witness Name</Label>
                <Input
                  value={formData.witnessName}
                  onChange={(e) => handleInputChange('witnessName', e.target.value)}
                  placeholder="Name of witness (if any)"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
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
            
            <div className="space-y-3">
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
            
            <div className="space-y-2">
              <Label>Immediate Action Taken</Label>
              <Textarea
                value={formData.immediateAction}
                onChange={(e) => handleInputChange('immediateAction', e.target.value)}
                placeholder="Describe immediate actions taken"
                className="min-h-[100px] w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Investigation */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle>Investigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Root Cause Analysis</Label>
              <Textarea
                value={formData.rootCause}
                onChange={(e) => handleInputChange('rootCause', e.target.value)}
                placeholder="Identify the root cause of the incident"
                className="min-h-[100px] w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Preventive Measures</Label>
              <Textarea
                value={formData.preventiveMeasures}
                onChange={(e) => handleInputChange('preventiveMeasures', e.target.value)}
                placeholder="Recommend preventive measures"
                className="min-h-[100px] w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-3">
                <Button
                  variant="outline"
                  onClick={handleFileUpload}
                  className="mt-2"
                >
                  Choose Files
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Upload photos, documents, or other relevant files (JPG, PNG, PDF, DOC, DOCX)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 pb-6">
          <Button
            variant="outline"
            onClick={() => navigate(`${basePath}/incident`)}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90 px-8"
          >
            Submit Incident
          </Button>
        </div>
      </div>
    </div>
  );
};
