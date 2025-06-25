
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  leadData: any;
}

export const EditLeadModal = ({ isOpen, onClose, onSave, leadData }: EditLeadModalProps) => {
  const [editData, setEditData] = useState({
    status: leadData.status,
    leadStage: leadData.leadStage,
    notes: leadData.notes
  });

  const handleSave = () => {
    onSave(editData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">Edit</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select onValueChange={(value) => handleInputChange('status', value)} value={editData.status}>
              <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-[70]">
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lead Stage</label>
            <Select onValueChange={(value) => handleInputChange('leadStage', value)} value={editData.leadStage}>
              <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                <SelectValue placeholder="Select Lead Stage" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-[70]">
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="NA">NA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <Textarea
              value={editData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full min-h-[100px] border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white resize-none"
              placeholder="Enter notes..."
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 h-10 text-sm font-medium rounded-sm"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
