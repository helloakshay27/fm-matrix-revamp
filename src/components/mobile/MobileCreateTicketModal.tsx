import React, { useState } from 'react';
import { X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface MobileCreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MobileCreateTicketModal: React.FC<MobileCreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
 
  const [formData, setFormData] = useState({
    issueType: '',
    category: '',
    subCategory: '',
    location: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validate form
    if (!formData.issueType || !formData.category || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally call the API to create the ticket
    toast({
      title: "Success",
      description: "Ticket created successfully"
    });
    
    onSuccess();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
          <div className="flex items-end gap-2">
            <Edit className="h-5 w-5 text-red-600" />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 space-y-4">
          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type
            </label>
            <Select value={formData.issueType} onValueChange={(value) => handleInputChange('issueType', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Request" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="request">Request</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Request" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="air-conditioner">Air Conditioner</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sub-category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-category
            </label>
            <Select value={formData.subCategory} onValueChange={(value) => handleInputChange('subCategory', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Request" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="installation">Installation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              placeholder="Select Building"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Create Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};