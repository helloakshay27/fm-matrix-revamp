
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft } from 'lucide-react';

interface AddEventFormProps {
  onBack: () => void;
}

export const AddEventForm: React.FC<AddEventFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    startDate: '',
    endDate: '',
    startTime: '07:45 PM',
    endTime: '',
    description: '',
    rsvp: 'NO',
    shareWith: 'All',
    markAsImportant: false,
    sendEmail: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Event data:', formData);
    // Handle form submission
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <button onClick={onBack} className="flex items-center hover:text-gray-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Event List
          </button>
          <span className="mx-2">›</span>
          <span>Create Event</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">NEW Event</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Event Information Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-3">
              9
            </div>
            <h2 className="text-lg font-semibold text-orange-500">EVENT INFORMATION</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title*
              </Label>
              <Input
                id="title"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="venue" className="text-sm font-medium text-gray-700">
                Venue*
              </Label>
              <Input
                id="venue"
                placeholder="Enter Venue"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                Start date*
              </Label>
              <Input
                id="startDate"
                type="date"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                End date*
              </Label>
              <Input
                id="endDate"
                type="date"
                placeholder="End Date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                Start Time*
              </Label>
              <Input
                id="startTime"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                End Time*
              </Label>
              <Input
                id="endTime"
                placeholder="End Time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1 w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">RSVP</span>
              <RadioGroup
                value={formData.rsvp}
                onValueChange={(value) => handleInputChange('rsvp', value)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NO" id="rsvp-no" />
                  <Label htmlFor="rsvp-no" className="text-sm">NO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="YES" id="rsvp-yes" />
                  <Label htmlFor="rsvp-yes" className="text-sm">YES</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Share with</span>
              <RadioGroup
                value={formData.shareWith}
                onValueChange={(value) => handleInputChange('shareWith', value)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="All" id="share-all" />
                  <Label htmlFor="share-all" className="text-sm">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Individuals" id="share-individuals" />
                  <Label htmlFor="share-individuals" className="text-sm">Individuals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Groups" id="share-groups" />
                  <Label htmlFor="share-groups" className="text-sm">Groups</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="markImportant"
                checked={formData.markAsImportant}
                onChange={(e) => handleInputChange('markAsImportant', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="markImportant" className="text-sm text-gray-700">
                Mark as Important
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendEmail"
                checked={formData.sendEmail}
                onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="sendEmail" className="text-sm text-gray-700">
                Send Email
              </Label>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-3">
              D
            </div>
            <h2 className="text-lg font-semibold text-orange-500">ATTACHMENTS</h2>
          </div>

          <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 bg-orange-50">
            <Button variant="outline" className="text-orange-600 border-orange-300">
              Choose Files
            </Button>
            <span className="ml-2 text-sm text-gray-600">No file chosen</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit}
            className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2"
          >
            Create Event
          </Button>
        </div>
      </div>
    </div>
  );
};
