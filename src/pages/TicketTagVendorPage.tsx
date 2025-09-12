import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';

interface Supplier {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  company_name: string;
}

interface ComplaintVendor {
  id: number;
  complaint_id: number;
  pms_supplier_contact_id: number;
  mail_sent: boolean;
  mail_sent_at: string;
  mail_sent_by_id: number;
  created_at: string;
  updated_at: string;
  company_name?: string;
  email?: string;
  created_by_name?: string;
  supplier?: {
    company_name: string;
    email: string;
  };
}

export const TicketTagVendorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // Changed to array for multiple selection
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [complaintVendors, setComplaintVendors] = useState<ComplaintVendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);

  // Fetch suppliers when component mounts
  useEffect(() => {
    fetchSuppliers();
    if (id) {
      fetchComplaintVendors();
    }
  }, [id]);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await ticketManagementAPI.getSuppliers();
      console.log('Suppliers response:', response);
      setSuppliers(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to fetch suppliers');
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComplaintVendors = async () => {
    if (!id) return;
    
    setIsLoadingVendors(true);
    try {
      const response = await ticketManagementAPI.getComplaintVendors(id);
      console.log('Complaint vendors response:', response);
      setComplaintVendors(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching complaint vendors:', error);
      toast.error('Failed to fetch tagged vendors');
      setComplaintVendors([]);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  // Helper function to format supplier display name
  const formatSupplierName = (supplier: Supplier) => {
    if (supplier.company_name && supplier.email) {
      return `${supplier.company_name} (${supplier.email})`;
    }
    if (supplier.company_name) {
      return supplier.company_name;
    }
    const fullName = [supplier.first_name, supplier.last_name].filter(Boolean).join(' ');
    return fullName ? `${fullName} (${supplier.email})` : supplier.email;
  };

  const handleSubmit = async () => {
    console.log('Selected suppliers:', selectedOptions);
    console.log('Selected option:', selectedOption);
    console.log('Selected vendors:', selectedVendors);
    
    if (selectedOptions.length === 0) {
      alert('Please select at least one vendor!');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get the selected suppliers details
      const selectedSuppliers = suppliers.filter(s => selectedOptions.includes(s.id.toString()));
      console.log('Selected suppliers details:', selectedSuppliers);
      
      // Extract emails from selected suppliers
      const vendorEmails = selectedSuppliers.map(supplier => supplier.email);
      
      // Prepare the API payload with emails instead of IDs
      const payload = {
        complaint_id: id || '', // ticket ID from URL params
        vendor_ids: vendorEmails // Array of vendor emails instead of IDs
      };

      console.log('API Payload:', payload);

      // Make the API call
      const response = await ticketManagementAPI.tagVendorsToComplaint(payload);
      console.log('API Response:', response);

      // Success message
      const supplierNames = selectedSuppliers.map(s => formatSupplierName(s)).join(', ');
      toast.success(`Vendors tagged successfully! Selected: ${supplierNames}`);
      
      // Optionally clear the selection
      setSelectedOptions([]);
      
      // Refresh the complaint vendors table after successful tagging
      await fetchComplaintVendors();
      
    } catch (error) {
      console.error('Error tagging vendors:', error);
      toast.error('Failed to tag vendors. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = () => {
    console.log('Resending emails to selected vendors:', selectedVendors);
    alert('Emails resent successfully!');
  };

  const handleVendorSelect = (vendorId: number, checked: boolean) => {
    if (checked) {
      setSelectedVendors([...selectedVendors, vendorId]);
    } else {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVendors(complaintVendors.map(v => v.id));
    } else {
      setSelectedVendors([]);
    }
  };

  const handleOptionsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedOptions(typeof value === 'string' ? value.split(',') : value);
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
            onClick={() => navigate(`/maintenance/ticket/details/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ticket Details
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">TAG A VENDOR</h1>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <FormControl fullWidth size="small">
              <InputLabel id="select-options-label">Select Vendors</InputLabel>
              <Select
                labelId="select-options-label"
                multiple
                value={selectedOptions}
                label="Select Vendors"
                onChange={handleOptionsChange}
                sx={{ height: '36px' }}
                disabled={isLoading}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return 'Select vendors...';
                  }
                  if (selected.length === 1) {
                    const supplier = suppliers.find(s => s.id.toString() === selected[0]);
                    return supplier ? formatSupplierName(supplier) : 'Unknown vendor';
                  }
                  return `${selected.length} vendors selected`;
                }}
              >
                {isLoading ? (
                  <MenuItem value="" disabled>
                    Loading suppliers...
                  </MenuItem>
                ) : suppliers.length === 0 ? (
                  <MenuItem value="" disabled>
                    No suppliers available
                  </MenuItem>
                ) : (
                  suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id.toString()}>
                      {formatSupplierName(supplier)}
                    </MenuItem>
                  ))
                )}
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
                sx={{ height: '36px' }}
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
            disabled={selectedOptions.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Tagging Vendors...' : 'Submit'}
          </Button>
        </div>

       


        {/* Vendor Table with improved checkbox styling */}
        <Card>
          <CardContent className="p-6">
            {isLoadingVendors ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
                <p className="mt-2 text-gray-600">Loading tagged vendors...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedVendors.length === complaintVendors.length && complaintVendors.length > 0}
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
                  {complaintVendors.length > 0 ? (
                    complaintVendors.map((vendor) => (
                      <TableRow key={vendor.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox 
                            checked={selectedVendors.includes(vendor.id)}
                            onCheckedChange={(checked) => handleVendorSelect(vendor.id, checked as boolean)}
                            className="border-[#C72030] data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{vendor.company_name || 'N/A'}</TableCell>
                        <TableCell>{vendor.email || 'N/A'}</TableCell>
                        <TableCell>
                          {vendor.mail_sent_at ? new Date(vendor.mail_sent_at).toLocaleString() : 'Not sent'}
                        </TableCell>
                        <TableCell>
                          {vendor.created_by_name || 'System'}
                        </TableCell>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
