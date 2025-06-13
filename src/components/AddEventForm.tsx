
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
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
    startTime: '08:00 PM',
    endTime: '',
    description: '',
    rsvp: 'NO',
    shareWith: 'All',
    markAsImportant: false,
    sendEmail: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event data:', formData);
    onBack();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Event List</span>
            <span className="mx-2">{'>'}</span>
            <span>Create Event</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">NEW Event</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl">
        {/* Event Information Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">
              9
            </div>
            <h2 className="text-xl font-bold text-orange-500">EVENT INFORMATION</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Title"
                required
              />
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <Label htmlFor="venue" className="text-sm font-medium">Venue*</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                placeholder="Enter Venue"
                required
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">Start date*</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                placeholder="Start Date"
                required
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">End date*</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                placeholder="End Date"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium">Start Time*</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium">End Time*</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                placeholder="End Time"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter Description"
                rows={3}
              />
            </div>
          </div>

          {/* RSVP and Share Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* RSVP */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">RSVP</Label>
              <RadioGroup 
                value={formData.rsvp} 
                onValueChange={(value) => handleInputChange('rsvp', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NO" id="rsvp-no" />
                  <Label htmlFor="rsvp-no">NO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="YES" id="rsvp-yes" />
                  <Label htmlFor="rsvp-yes">YES</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Share with */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Share with</Label>
              <RadioGroup 
                value={formData.shareWith} 
                onValueChange={(value) => handleInputChange('shareWith', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="All" id="share-all" />
                  <Label htmlFor="share-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Individuals" id="share-individuals" />
                  <Label htmlFor="share-individuals">Individuals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Groups" id="share-groups" />
                  <Label htmlFor="share-groups">Groups</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-8 mt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="markImportant"
                checked={formData.markAsImportant}
                onCheckedChange={(checked) => handleInputChange('markAsImportant', checked as boolean)}
              />
              <Label htmlFor="markImportant" className="text-sm">Mark as Important</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmail"
                checked={formData.sendEmail}
                onCheckedChange={(checked) => handleInputChange('sendEmail', checked as boolean)}
              />
              <Label htmlFor="sendEmail" className="text-sm">Send Email</Label>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">
              D
            </div>
            <h2 className="text-xl font-bold text-orange-500">ATTACHMENTS</h2>
          </div>

          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <Button type="button" variant="outline" className="border-orange-500 text-orange-500">
              Choose Files
            </Button>
            <p className="text-sm text-gray-500 mt-2">No file chosen</p>
          </div>
        </div>

        {/* Create Event Button */}
        <div className="flex justify-center">
          <Button type="submit" className="bg-purple-800 hover:bg-purple-900 text-white px-8 py-3">
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
};
