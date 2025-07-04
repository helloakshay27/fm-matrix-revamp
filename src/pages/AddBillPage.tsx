
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { MaterialDatePicker } from "@/components/ui/material-date-picker";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
  '& .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddBillPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    supplier: '',
    billDate: '',
    invoiceNumber: '',
    relatedTo: '',
    tds: '',
    retention: '',
    deduction: '',
    deductionRemarks: '',
    amount: '',
    cgstRate: '',
    paymentTenure: '',
    sgstRate: '',
    cgstAmount: '',
    sgstAmount: '',
    igstRate: '',
    igstAmount: '',
    tcsAmount: '',
    taxAmount: '',
    tcsRate: '',
    totalAmount: '',
    additionalExpenses: '',
    description: ''
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) selected`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.supplier || !formData.billDate || !formData.amount || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    console.log('Bill Form submitted:', formData);
    console.log('Attached files:', selectedFiles);
    toast.success('Bill submitted successfully!');
    navigate('/finance/bill-booking');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          Bills &gt; New Bill
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">NEW BILL</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bill Details Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm mr-3">
                1
              </div>
              <h2 className="text-lg font-semibold text-[#C72030]">BILL DETAILS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Column */}
              <div className="space-y-4">
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Supplier*</InputLabel>
                    <MuiSelect
                      label="Supplier*"
                      value={formData.supplier}
                      onChange={(e) => updateFormData('supplier', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Supplier</em></MenuItem>
                      <MenuItem value="supplier1">Supplier 1</MenuItem>
                      <MenuItem value="supplier2">Supplier 2</MenuItem>
                      <MenuItem value="supplier3">Supplier 3</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>

                <TextField
                  label="Related To"
                  placeholder="Related To"
                  value={formData.relatedTo}
                  onChange={(e) => updateFormData('relatedTo', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Deduction"
                  placeholder="Deduction"
                  value={formData.deduction}
                  onChange={(e) => updateFormData('deduction', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Additional Expenses"
                  placeholder="Additional Expenses"
                  value={formData.additionalExpenses}
                  onChange={(e) => updateFormData('additionalExpenses', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="CGST Amount"
                  placeholder="CGST Amount"
                  value={formData.cgstAmount}
                  onChange={(e) => updateFormData('cgstAmount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="IGST Rate"
                  placeholder="IGST Rate"
                  value={formData.igstRate}
                  onChange={(e) => updateFormData('igstRate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="TCS Amount"
                  placeholder="TCS Amount"
                  value={formData.tcsAmount}
                  onChange={(e) => updateFormData('tcsAmount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
              </div>

              {/* Second Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bill Date<span className="text-[#C72030]">*</span>
                  </label>
                  <MaterialDatePicker
                    value={formData.billDate}
                    onChange={(value) => updateFormData('billDate', value)}
                    placeholder="Select Bill Date"
                  />
                </div>

                <TextField
                  label="TDS(%)"
                  placeholder="TDS"
                  value={formData.tds}
                  onChange={(e) => updateFormData('tds', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Deduction Remarks"
                  placeholder="Deduction Remarks"
                  value={formData.deductionRemarks}
                  onChange={(e) => updateFormData('deductionRemarks', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Payment Tenure(In Days)"
                  placeholder="Payment Tenure"
                  value={formData.paymentTenure}
                  onChange={(e) => updateFormData('paymentTenure', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="SGST Rate"
                  placeholder="SGST Rate"
                  value={formData.sgstRate}
                  onChange={(e) => updateFormData('sgstRate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="IGST Amount"
                  placeholder="IGST Amount"
                  value={formData.igstAmount}
                  onChange={(e) => updateFormData('igstAmount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Tax Amount"
                  placeholder="Tax Amount"
                  value={formData.taxAmount}
                  onChange={(e) => updateFormData('taxAmount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
              </div>

              {/* Third Column */}
              <div className="space-y-4">
                <TextField
                  label="Invoice Number"
                  placeholder="Invoice Number"
                  value={formData.invoiceNumber}
                  onChange={(e) => updateFormData('invoiceNumber', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Retention(%)"
                  placeholder="Retention"
                  value={formData.retention}
                  onChange={(e) => updateFormData('retention', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Amount*"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => updateFormData('amount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="CGST Rate"
                  placeholder="CGST Rate"
                  value={formData.cgstRate}
                  onChange={(e) => updateFormData('cgstRate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="SGST Amount"
                  placeholder="SGST Amount"
                  value={formData.sgstAmount}
                  onChange={(e) => updateFormData('sgstAmount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="TCS Rate"
                  placeholder="TCS Rate"
                  value={formData.tcsRate}
                  onChange={(e) => updateFormData('tcsRate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Total Amount"
                  placeholder="Total Amount"
                  value={formData.totalAmount}
                  onChange={(e) => updateFormData('totalAmount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-1">
                Description<span className="text-[#C72030]">*</span>
              </label>
              <Textarea 
                placeholder="Description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Attachments Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm mr-3">
                2
              </div>
              <h2 className="text-lg font-semibold text-[#C72030]">ATTACHMENTS</h2>
            </div>

            <div 
              className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleFileSelect}
            >
              <p className="text-gray-600">
                Drag & Drop or{' '}
                <span className="text-orange-500 underline cursor-pointer">Choose File</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {selectedFiles.length === 0 ? 'No file chosen' : `${selectedFiles.length} file(s) selected`}
              </p>
              {selectedFiles.length > 0 && (
                <div className="mt-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
