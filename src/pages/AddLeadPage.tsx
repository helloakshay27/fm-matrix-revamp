
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  FormControl as MuiFormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';

const fieldStyles = {
  height: '40px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '& .MuiSelect-select': {
    fontSize: '14px',
  },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

interface LeadSelectProps {
  id: string;
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const LeadSelect = ({
  id,
  label,
  required,
  placeholder,
  value,
  onChange,
  options,
}: LeadSelectProps) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <MuiFormControl fullWidth size="small" required={required}>
      <MuiSelect
        id={id}
        displayEmpty
        value={value}
        onChange={(event) => onChange(event.target.value)}
        renderValue={(selected) =>
          selected ? (
            options.find((option) => option.value === selected)?.label ?? selected
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )
        }
        sx={fieldStyles}
        MenuProps={selectMenuProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </MuiFormControl>
  </div>
);

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
    // MUI Select renders a hidden input, which browsers exclude from constraint
    // validation, so the required Project field is checked explicitly here.
    if (!leadData.project) {
      toast.error('Please select a project');
      return;
    }
    console.log('Create lead submitted:', leadData);
    // Handle form submission
    navigate('/crm/campaign');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">CREATE LEAD</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-6">
              <LeadSelect
                id="project"
                label="Project"
                required
                placeholder="Select Project"
                value={leadData.project}
                onChange={(value) => handleInputChange('project', value)}
                options={[
                  { value: 'godrej-city', label: 'GODREJ CITY' },
                  { value: 'godrej-rks', label: 'GODREJ RKS' },
                  { value: 'godrej-hill-retreat', label: 'GODREJ HILL RETREAT' },
                ]}
              />

              <LeadSelect
                id="flatType"
                label="Flat Type"
                placeholder="Select Flat Type"
                value={leadData.flatType}
                onChange={(value) => handleInputChange('flatType', value)}
                options={[
                  { value: '1bhk', label: '1 BHK' },
                  { value: '2bhk', label: '2 BHK' },
                  { value: '3bhk', label: '3 BHK' },
                  { value: '4bhk', label: '4 BHK' },
                ]}
              />

              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                  Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientName"
                  placeholder="Client Name"
                  value={leadData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="w-full h-10 border border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand placeholder-gray-400 text-sm bg-white"
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
                  className="w-full h-10 border border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand placeholder-gray-400 text-sm bg-white"
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
                  className="w-full h-10 border border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand placeholder-gray-400 text-sm bg-white"
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
                  className="w-full h-10 border border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand placeholder-gray-400 text-sm bg-white"
                />
              </div>

              <LeadSelect
                id="leadStage"
                label="Lead Stage"
                placeholder="Select Lead Stage"
                value={leadData.leadStage}
                onChange={(value) => handleInputChange('leadStage', value)}
                options={[
                  { value: 'new', label: 'New' },
                  { value: 'contacted', label: 'Contacted' },
                  { value: 'qualified', label: 'Qualified' },
                  { value: 'proposal', label: 'Proposal' },
                  { value: 'negotiation', label: 'Negotiation' },
                ]}
              />

              <LeadSelect
                id="activity"
                label="Activity"
                placeholder="Select Activity"
                value={leadData.activity}
                onChange={(value) => handleInputChange('activity', value)}
                options={[
                  { value: 'call', label: 'Call' },
                  { value: 'email', label: 'Email' },
                  { value: 'meeting', label: 'Meeting' },
                  { value: 'site-visit', label: 'Site Visit' },
                ]}
              />

              <LeadSelect
                id="leadStatus"
                label="Lead Status"
                placeholder="select status"
                value={leadData.leadStatus}
                onChange={(value) => handleInputChange('leadStatus', value)}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'hot', label: 'Hot' },
                  { value: 'warm', label: 'Warm' },
                  { value: 'cold', label: 'Cold' },
                ]}
              />

              <LeadSelect
                id="leadSource"
                label="Lead Source"
                placeholder="Select Lead Source"
                value={leadData.leadSource}
                onChange={(value) => handleInputChange('leadSource', value)}
                options={[
                  { value: 'website', label: 'Website' },
                  { value: 'referral', label: 'Referral' },
                  { value: 'social-media', label: 'Social Media' },
                  { value: 'advertisement', label: 'Advertisement' },
                  { value: 'event', label: 'Event' },
                ]}
              />
            </div>

            <div className="mb-8">
              <LeadSelect
                id="leadSubSource"
                label="Lead Sub Source"
                placeholder="Select Lead Sub Source"
                value={leadData.leadSubSource}
                onChange={(value) => handleInputChange('leadSubSource', value)}
                options={[
                  { value: 'google-ads', label: 'Google Ads' },
                  { value: 'facebook-ads', label: 'Facebook Ads' },
                  { value: 'instagram-ads', label: 'Instagram Ads' },
                  { value: 'linkedin-ads', label: 'LinkedIn Ads' },
                  { value: 'direct-referral', label: 'Direct Referral' },
                ]}
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-brand hover:bg-brand-hover px-8 py-2 h-10 text-sm font-medium min-w-[100px] rounded-sm"
              >
                <span className="!text-white font-medium">Submit</span>
              </Button>
            </div>
        </form>
      </div>
    </div>
  );
};
