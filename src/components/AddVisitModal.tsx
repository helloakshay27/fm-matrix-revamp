
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload } from 'lucide-react';

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  amcId: string;
}

export const AddVisitModal = ({ isOpen, onClose, amcId }: AddVisitModalProps) => {
  const [formData, setFormData] = useState({
    visitDate: '',
    visitType: '',
    technician: '',
    workDescription: '',
    nextVisitDate: '',
    status: '',
    remarks: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Visit Data:', { ...formData, amcId });
    // Handle form submission
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Add Visit - AMC {amcId}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Visit Date *</label>
              <Input 
                type="date" 
                value={formData.visitDate}
                onChange={(e) => handleInputChange('visitDate', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Visit Type *</label>
              <Select onValueChange={(value) => handleInputChange('visitType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Visit Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled Maintenance</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Technician *</label>
              <Select onValueChange={(value) => handleInputChange('technician', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <Select onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Next Visit Date</label>
              <Input 
                type="date" 
                value={formData.nextVisitDate}
                onChange={(e) => handleInputChange('nextVisitDate', e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Work Description *</label>
            <Textarea 
              placeholder="Describe the work performed..."
              value={formData.workDescription}
              onChange={(e) => handleInputChange('workDescription', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Remarks</label>
            <Textarea 
              placeholder="Additional remarks..."
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              rows={2}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Attachments</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm mb-2">Upload visit photos or documents</p>
              <input type="file" multiple className="hidden" id="visit-file-upload" />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('visit-file-upload')?.click()}
              >
                Choose Files
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 flex-1"
            >
              Save Visit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
