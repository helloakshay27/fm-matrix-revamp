
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';

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
            <label className="text-sm font-medium mb-2 block">Select Some Options</label>
            <Select value={selectedOptions} onValueChange={setSelectedOptions}>
              <SelectTrigger>
                <SelectValue placeholder="Select Some Options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
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
            <label className="text-sm font-medium mb-2 block">Select an Option</label>
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger>
                <SelectValue placeholder="Select an Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option-a">Option A</SelectItem>
                <SelectItem value="option-b">Option B</SelectItem>
                <SelectItem value="option-c">Option C</SelectItem>
              </SelectContent>
            </Select>
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

        {/* Vendor Table */}
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedVendors.length === vendorData.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedVendors(vendorData.map(v => v.id));
                        } else {
                          setSelectedVendors([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Email Sent To</TableHead>
                  <TableHead>Email Sent At</TableHead>
                  <TableHead>Email Sent By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorData.length > 0 ? (
                  vendorData.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedVendors.includes(vendor.id)}
                          onCheckedChange={(checked) => handleVendorSelect(vendor.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>{vendor.vendorName}</TableCell>
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
