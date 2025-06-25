
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    description: '',
    startDate: '',
    startTime: '05:00 PM',
    endDate: '',
    endTime: '05:00 PM',
    markAsImportant: false,
    sendEmail: false,
    shareWith: 'all',
    rsvpEnabled: true
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitting event data:', formData);
    // In a real app, this would save the event to the backend
    navigate('/crm/events');
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
    // File upload functionality would be implemented here
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        Events &gt; Event List &gt; Add Event
      </div>

      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/crm/events')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Button>
        <h1 className="text-2xl font-bold">Add Event</h1>
      </div>

      <div className="bg-white rounded-lg shadow max-w-4xl">
        <div className="p-6">
          {/* Event Info Section */}
          <div className="mb-6">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-t text-sm font-medium">
              EVENT INFO
            </div>
            <div className="border border-gray-200 p-4 rounded-b">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1 block">Title</Label>
                  <Input
                    id="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="venue" className="text-sm font-medium text-gray-700 mb-1 block">Venue</Label>
                  <Input
                    id="venue"
                    placeholder="Enter Venue"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1 block">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-20"
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Start Time</Label>
                  <Input
                    type="time"
                    value="17:00"
                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">End Time</Label>
                  <Input
                    type="time"
                    value="17:00"
                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="important"
                    checked={formData.markAsImportant}
                    onCheckedChange={(checked) => handleInputChange('markAsImportant', checked)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="important" className="text-sm text-gray-700">Mark as Important</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={formData.sendEmail}
                    onCheckedChange={(checked) => handleInputChange('sendEmail', checked)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="email" className="text-sm text-gray-700">Send Email</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Files Section */}
          <div className="mb-6">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-t text-sm font-medium">
              UPLOAD FILES
            </div>
            <div className="border border-gray-200 p-4 rounded-b">
              <div 
                onClick={handleFileUpload}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Click to upload files</p>
              </div>
            </div>
          </div>

          {/* Share With Section */}
          <div className="mb-6">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-t text-sm font-medium">
              SHARE WITH
            </div>
            <div className="border border-gray-200 p-4 rounded-b">
              <RadioGroup
                value={formData.shareWith}
                onValueChange={(value) => handleInputChange('shareWith', value)}
                className="flex items-center gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" className="text-blue-600" />
                  <Label htmlFor="all" className="text-sm text-gray-700">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individuals" id="individuals" className="text-blue-600" />
                  <Label htmlFor="individuals" className="text-sm text-gray-700">Individuals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="groups" id="groups" className="text-blue-600" />
                  <Label htmlFor="groups" className="text-sm text-gray-700">Groups</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* RSVP Section */}
          <div className="mb-6">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-t text-sm font-medium">
              RSVP
            </div>
            <div className="border border-gray-200 p-4 rounded-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">Yes</span>
                  <Switch
                    checked={formData.rsvpEnabled}
                    onCheckedChange={(checked) => handleInputChange('rsvpEnabled', checked)}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 h-10 text-sm font-medium"
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Footer branding */}
        <div className="text-center text-xs text-gray-500 mt-4 pb-6">
          <p>Powered by</p>
          <div className="flex items-center justify-center mt-1">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
              L
            </div>
            <span className="font-semibold">LOCATED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
