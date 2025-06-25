
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: any) => void;
}

export const CreateLeadModal = ({ isOpen, onClose, onSubmit }: CreateLeadModalProps) => {
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    mobile: '',
    project: '',
    status: '',
    source: '',
    budget: '',
    followUpDate: undefined as Date | undefined,
    notes: '',
    documents: null as File | null
  });

  const handleInputChange = (field: string, value: string | Date | undefined | File | null) => {
    setLeadData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleInputChange('documents', file);
    console.log('File uploaded:', file?.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create lead submitted:', leadData);
    onSubmit(leadData);
    
    // Reset form
    setLeadData({
      name: '',
      email: '',
      mobile: '',
      project: '',
      status: '',
      source: '',
      budget: '',
      followUpDate: undefined,
      notes: '',
      documents: null
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full bg-white border border-gray-300 shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900 text-left">Create New Lead</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new lead with contact information, project details, and follow-up schedule
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Lead Name *</Label>
              <Input
                id="name"
                placeholder="Enter lead name"
                value={leadData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={leadData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile *</Label>
              <Input
                id="mobile"
                placeholder="Enter mobile number"
                value={leadData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium text-gray-700">Project *</Label>
              <Select onValueChange={(value) => handleInputChange('project', value)} value={leadData.project} required>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="godrej-city">GODREJ CITY</SelectItem>
                  <SelectItem value="godrej-rks">GODREJ RKS</SelectItem>
                  <SelectItem value="godrej-hill-retreat">GODREJ HILL RETREAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
              <Select onValueChange={(value) => handleInputChange('status', value)} value={leadData.status}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium text-gray-700">Lead Source</Label>
              <Select onValueChange={(value) => handleInputChange('source', value)} value={leadData.source}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="advertisement">Advertisement</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget Range</Label>
              <Input
                id="budget"
                placeholder="Enter budget range"
                value={leadData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Follow-up Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white hover:bg-gray-50",
                      !leadData.followUpDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {leadData.followUpDate ? format(leadData.followUpDate, "MM/dd/yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={leadData.followUpDate}
                    onSelect={(date) => handleInputChange('followUpDate', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter additional notes about the lead"
              value={leadData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
              rows={4}
            />
          </div>

          <div className="space-y-2 mb-8">
            <Label htmlFor="documents" className="text-sm font-medium text-gray-700">Upload Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id="documents"
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="documents" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {leadData.documents ? leadData.documents.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
              </label>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button 
              type="submit"
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 h-10 text-sm font-medium min-w-[100px] rounded-sm"
            >
              Create Lead
            </Button>
            <Button 
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2 h-10 text-sm font-medium min-w-[100px] rounded-sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
