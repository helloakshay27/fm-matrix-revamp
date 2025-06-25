
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
  onSave: (data: any) => void;
}

export const LeadDetailsModal = ({ isOpen, onClose, lead, onSave }: LeadDetailsModalProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    status: '',
    leadStage: '',
    notes: ''
  });

  useEffect(() => {
    if (lead) {
      setEditData({
        status: lead.status || '',
        leadStage: 'NA',
        notes: ''
      });
    }
  }, [lead]);

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    console.log('Edit button clicked');
    setIsEditMode(true);
  };

  const handleSave = () => {
    console.log('Save button clicked with data:', editData);
    onSave(editData);
    setIsEditMode(false);
  };

  const handleClose = () => {
    console.log('Lead details dialog closed');
    setIsEditMode(false);
    onClose();
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full bg-white border border-gray-300 shadow-lg [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Detail</DialogTitle>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <Button
                onClick={handleEdit}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 text-sm rounded-sm"
              >
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-6">
          {!isEditMode ? (
            // View Mode
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">ID</Label>
                <p className="text-sm text-gray-900 mt-1">{lead.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Refered by</Label>
                <p className="text-sm text-gray-900 mt-1">{lead.createdBy}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Refer Code</Label>
                <p className="text-sm text-gray-900 mt-1">{lead.uniqueId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Project</Label>
                <p className="text-sm text-gray-900 mt-1">{lead.project}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Refer to</Label>
                <p className="text-sm text-gray-900 mt-1">{lead.lead}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Mobile</Label>
                <p className="text-sm text-gray-900 mt-1">{lead.mobile}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <p className="text-sm text-gray-900 mt-1">{lead.status}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Client Email</Label>
                <p className="text-sm text-gray-900 mt-1">-</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Lead Stage</Label>
                <p className="text-sm text-gray-900 mt-1">NA</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-medium text-gray-700">Created on</Label>
                <p className="text-sm text-gray-900 mt-1">{lead.createdOn} 3:19 PM</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-medium text-gray-700">Notes</Label>
                <div className="mt-2 p-3 border border-gray-200 rounded min-h-[100px] bg-gray-50">
                  <p className="text-sm text-gray-500">No notes available</p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                  <Select onValueChange={(value) => handleInputChange('status', value)} value={editData.status}>
                    <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                      <SelectItem value="Hot">Hot</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Cold">Cold</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadStage" className="text-sm font-medium text-gray-700">Lead Stage</Label>
                  <Select onValueChange={(value) => handleInputChange('leadStage', value)} value={editData.leadStage}>
                    <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                      <SelectValue placeholder="Select Lead Stage" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                      <SelectItem value="Initial">Initial</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes..."
                  value={editData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full min-h-[100px] border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white resize-none"
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 h-10 text-sm font-medium rounded-sm"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
