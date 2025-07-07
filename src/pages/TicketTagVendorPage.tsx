
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

export const TicketTagVendorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedOptions, setSelectedOptions] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const vendorData = [
    {
      id: '1',
      vendorName: 'Vendor A',
      emailSentTo: 'vendor-a@example.com',
      emailSentAt: '16/06/2025 5:30 PM',
      emailSentBy: 'Admin User'
    },
    {
      id: '2',
      vendorName: 'Vendor B',
      emailSentTo: 'vendor-b@example.com',
      emailSentAt: '16/06/2025 5:25 PM',
      emailSentBy: 'Admin User'
    }
  ];

  const handleSubmit = () => {
    console.log('Selected options:', selectedOptions);
    console.log('Selected option:', selectedOption);
    console.log('Selected vendors:', selectedVendors);
    alert('Vendors tagged successfully!');
  };

  const handleResendEmail = () => {
    console.log('Resending emails to selected vendors:', selectedVendors);
    alert('Emails resent successfully!');
  };

  const handleVendorSelect = (vendorId: string, checked: boolean) => {
    if (checked) {
      setSelectedVendors([...selectedVendors, vendorId]);
    } else {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVendors(vendorData.map(v => v.id));
    } else {
      setSelectedVendors([]);
    }
  };

  const handleOptionsChange = (event: SelectChangeEvent) => {
    setSelectedOptions(event.target.value);
  };

  const handleOptionChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/maintenance/ticket/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ticket Details
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Ticket</span>
            <span>&gt;</span>
            <span>Tag a Vendor</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TAG A VENDOR</h1>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <FormControl fullWidth size="small">
              <InputLabel id="select-options-label">Select Some Options</InputLabel>
              <Select
                labelId="select-options-label"
                value={selectedOptions}
                label="Select Some Options"
                onChange={handleOptionsChange}
              >
                <MenuItem value="option1">Option 1</MenuItem>
                <MenuItem value="option2">Option 2</MenuItem>
                <MenuItem value="option3">Option 3</MenuItem>
              </Select>
            </FormControl>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={handleResendEmail}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Resend Email
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <FormControl fullWidth size="small">
              <InputLabel id="select-option-label">Select an Option</InputLabel>
              <Select
                labelId="select-option-label"
                value={selectedOption}
                label="Select an Option"
                onChange={handleOptionChange}
              >
                <MenuItem value="option-a">Option A</MenuItem>
                <MenuItem value="option-b">Option B</MenuItem>
                <MenuItem value="option-c">Option C</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="mb-6">
          <Button 
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Submit
          </Button>
        </div>

        {/* Vendor Table with improved checkbox styling */}
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedVendors.length === vendorData.length && vendorData.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-[#C72030] data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Vendor Name</TableHead>
                  <TableHead className="font-semibold">Email Sent To</TableHead>
                  <TableHead className="font-semibold">Email Sent At</TableHead>
                  <TableHead className="font-semibold">Email Sent By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorData.length > 0 ? (
                  vendorData.map((vendor) => (
                    <TableRow key={vendor.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedVendors.includes(vendor.id)}
                          onCheckedChange={(checked) => handleVendorSelect(vendor.id, checked as boolean)}
                          className="border-[#C72030] data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                      <TableCell>{vendor.emailSentTo}</TableCell>
                      <TableCell>{vendor.emailSentAt}</TableCell>
                      <TableCell>{vendor.emailSentBy}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No vendors tagged yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
