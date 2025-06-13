
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';

interface AddEventFormProps {
  onBack: () => void;
}

export const AddEventForm: React.FC<AddEventFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    maxParticipants: '',
    registrationRequired: false,
    status: 'Draft'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
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
    <div className="p-6">
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
            <span>Events</span>
            <span className="mx-2">{'>'}</span>
            <span>Add Event</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ADD NEW EVENT</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type *</Label>
                <Select onValueChange={(value) => handleInputChange('eventType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter event description"
                rows={4}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Start Date & Time</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">End Date & Time</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter event location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  placeholder="Enter maximum participants"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">
                  Click to upload files or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
                <Button type="button" variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => handleInputChange('status', value)} defaultValue="Draft">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            Save Event
          </Button>
        </div>
      </form>
    </div>
  );
};
