
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';

interface AddBroadcastFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBroadcastForm: React.FC<AddBroadcastFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expireOn: '',
    endDate: '',
    endTime: '',
    shareWith: 'all'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Broadcast form submitted:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Broadcast List {'>'} New Broadcast</div>
            <DialogTitle className="text-xl font-bold">NEW BROADCAST (#3423)</DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-8">
          {/* Communication Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 border-b border-gray-200 pb-2">
              <div className="w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <h3 className="font-semibold">COMMUNICATION INFORMATION</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Title"
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description<span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter Description"
                  className="border-gray-300 min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Expire on</Label>
                <Input
                  value={formData.expireOn}
                  onChange={(e) => handleInputChange('expireOn', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium">
                  End Date<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  placeholder="End Date"
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium">
                  End Time<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  placeholder="End Time"
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 border-b border-gray-200 pb-2">
              <div className="w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <h3 className="font-semibold">ATTACHMENTS</h3>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Button variant="link" className="text-red-500 hover:text-red-600">
                Choose Files
              </Button>
              <span className="ml-2 text-gray-500">No file chosen</span>
            </div>
          </div>

          {/* Share with Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 border-b border-gray-200 pb-2">
              <div className="w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <h3 className="font-semibold">Share with</h3>
            </div>
            
            <RadioGroup
              value={formData.shareWith}
              onValueChange={(value) => handleInputChange('shareWith', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individuals" id="individuals" />
                <Label htmlFor="individuals">Individuals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="groups" id="groups" />
                <Label htmlFor="groups">Groups</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSubmit}
              className="bg-purple-800 hover:bg-purple-900 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
