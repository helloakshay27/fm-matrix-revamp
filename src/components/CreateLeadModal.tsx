
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateLeadModal = ({ isOpen, onClose, onSubmit }: CreateLeadModalProps) => {
  const [formData, setFormData] = useState({
    project: '',
    flatType: '',
    clientName: '',
    mobile: '',
    alternateMobile: '',
    clientEmail: '',
    leadStage: '',
    activity: '',
    leadStatus: '',
    leadSource: '',
    leadSubSource: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      project: '',
      flatType: '',
      clientName: '',
      mobile: '',
      alternateMobile: '',
      clientEmail: '',
      leadStage: '',
      activity: '',
      leadStatus: '',
      leadSource: '',
      leadSubSource: ''
    });
  };

  const handleClose = () => {
    console.log('Create lead dialog closed');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900 text-center bg-teal-100 py-2 px-4 rounded">
            CREATE LEAD
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new lead with project and contact information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="grid grid-cols-2 gap-6 space-y-4">
            {/* Project */}
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium text-gray-700">
                Project <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => handleInputChange('project', value)} value={formData.project}>
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

            {/* Flat Type */}
            <div className="space-y-2">
              <Label htmlFor="flatType" className="text-sm font-medium text-gray-700">Flat Type</Label>
              <Select onValueChange={(value) => handleInputChange('flatType', value)} value={formData.flatType}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Flat Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="1bhk">1 BHK</SelectItem>
                  <SelectItem value="2bhk">2 BHK</SelectItem>
                  <SelectItem value="3bhk">3 BHK</SelectItem>
                  <SelectItem value="4bhk">4 BHK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                Client Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientName"
                placeholder="Client Name"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
                required
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                Mobile <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobile"
                placeholder="Phone"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
                required
              />
            </div>

            {/* Alternate Mobile */}
            <div className="space-y-2">
              <Label htmlFor="alternateMobile" className="text-sm font-medium text-gray-700">Alternate Mobile</Label>
              <Input
                id="alternateMobile"
                placeholder="Alternate Phone"
                value={formData.alternateMobile}
                onChange={(e) => handleInputChange('alternateMobile', e.target.value)}
                className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
              />
            </div>

            {/* Client Email */}
            <div className="space-y-2">
              <Label htmlFor="clientEmail" className="text-sm font-medium text-gray-700">Client Email</Label>
              <Input
                id="clientEmail"
                placeholder="Email"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
              />
            </div>

            {/* Lead Stage */}
            <div className="space-y-2">
              <Label htmlFor="leadStage" className="text-sm font-medium text-gray-700">Lead Stage</Label>
              <Select onValueChange={(value) => handleInputChange('leadStage', value)} value={formData.leadStage}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Lead Stage" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="initial">Initial</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Activity */}
            <div className="space-y-2">
              <Label htmlFor="activity" className="text-sm font-medium text-gray-700">Activity</Label>
              <Select onValueChange={(value) => handleInputChange('activity', value)} value={formData.activity}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Activity" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="site-visit">Site Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lead Status */}
            <div className="space-y-2">
              <Label htmlFor="leadStatus" className="text-sm font-medium text-gray-700">Lead Status</Label>
              <Select onValueChange={(value) => handleInputChange('leadStatus', value)} value={formData.leadStatus}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lead Source */}
            <div className="space-y-2">
              <Label htmlFor="leadSource" className="text-sm font-medium text-gray-700">Lead Source</Label>
              <Select onValueChange={(value) => handleInputChange('leadSource', value)} value={formData.leadSource}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Lead Source" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="advertisement">Advertisement</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lead Sub Source */}
            <div className="space-y-2 col-span-1">
              <Label htmlFor="leadSubSource" className="text-sm font-medium text-gray-700">Lead Sub Source</Label>
              <Select onValueChange={(value) => handleInputChange('leadSubSource', value)} value={formData.leadSubSource}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Lead Sub Source" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 h-10 text-sm font-medium min-w-[100px] rounded-sm"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
