
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AddLeadPage = () => {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState({
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
    setLeadData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create lead submitted:', leadData);
    // Handle form submission
    navigate('/crm/campaign');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">CREATE LEAD</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="project" className="text-sm font-medium text-gray-700">
                  Project <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="flatType" className="text-sm font-medium text-gray-700">Flat Type</Label>
                <Select onValueChange={(value) => handleInputChange('flatType', value)} value={leadData.flatType}>
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

              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                  Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientName"
                  placeholder="Client Name"
                  value={leadData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                  Mobile <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobile"
                  placeholder="Phone"
                  value={leadData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternateMobile" className="text-sm font-medium text-gray-700">Alternate Mobile</Label>
                <Input
                  id="alternateMobile"
                  placeholder="Alternate Phone"
                  value={leadData.alternateMobile}
                  onChange={(e) => handleInputChange('alternateMobile', e.target.value)}
                  className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="text-sm font-medium text-gray-700">Client Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="Email"
                  value={leadData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadStage" className="text-sm font-medium text-gray-700">Lead Stage</Label>
                <Select onValueChange={(value) => handleInputChange('leadStage', value)} value={leadData.leadStage}>
                  <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                    <SelectValue placeholder="Select Lead Stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity" className="text-sm font-medium text-gray-700">Activity</Label>
                <Select onValueChange={(value) => handleInputChange('activity', value)} value={leadData.activity}>
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

              <div className="space-y-2">
                <Label htmlFor="leadStatus" className="text-sm font-medium text-gray-700">Lead Status</Label>
                <Select onValueChange={(value) => handleInputChange('leadStatus', value)} value={leadData.leadStatus}>
                  <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                    <SelectValue placeholder="select status" />
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
                <Label htmlFor="leadSource" className="text-sm font-medium text-gray-700">Lead Source</Label>
                <Select onValueChange={(value) => handleInputChange('leadSource', value)} value={leadData.leadSource}>
                  <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                    <SelectValue placeholder="Select Lead Source" />
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
            </div>

            <div className="space-y-2 mb-8">
              <Label htmlFor="leadSubSource" className="text-sm font-medium text-gray-700">Lead Sub Source</Label>
              <Select onValueChange={(value) => handleInputChange('leadSubSource', value)} value={leadData.leadSubSource}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Lead Sub Source" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="google-ads">Google Ads</SelectItem>
                  <SelectItem value="facebook-ads">Facebook Ads</SelectItem>
                  <SelectItem value="instagram-ads">Instagram Ads</SelectItem>
                  <SelectItem value="linkedin-ads">LinkedIn Ads</SelectItem>
                  <SelectItem value="direct-referral">Direct Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button 
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 h-10 text-sm font-medium min-w-[100px] rounded-sm"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
