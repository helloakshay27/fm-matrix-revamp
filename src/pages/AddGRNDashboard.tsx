
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddGRNDashboard = () => {
  const navigate = useNavigate();

  const [grnDetails, setGrnDetails] = useState({
    purchaseOrder: '',
    supplier: '',
    invoiceNumber: '',
    relatedTo: '',
    invoiceAmount: '',
    paymentMode: '',
    invoiceDate: '',
    postingDate: '',
    otherExpense: '',
    loadingExpense: '',
    adjustmentAmount: '',
    notes: ''
  });

  const [inventoryDetails, setInventoryDetails] = useState({
    inventoryType: '',
    expectedQuantity: '',
    receivedQuantity: '',
    approvedQuantity: '',
    rejectedQuantity: '',
    rate: '',
    cgstRate: '',
    cgstAmount: '',
    sgstRate: '',
    sgstAmount: '',
    igstRate: '',
    igstAmount: '',
    tcsRate: '',
    tcsAmount: '',
    totalTaxes: '',
    amount: '',
    totalAmount: ''
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Calculate amounts automatically
  const calculateAmounts = () => {
    const rate = parseFloat(inventoryDetails.rate) || 0;
    const approvedQty = parseFloat(inventoryDetails.approvedQuantity) || 0;
    const cgstAmount = parseFloat(inventoryDetails.cgstAmount) || 0;
    const sgstAmount = parseFloat(inventoryDetails.sgstAmount) || 0;
    const igstAmount = parseFloat(inventoryDetails.igstAmount) || 0;
    const tcsAmount = parseFloat(inventoryDetails.tcsAmount) || 0;
    
    const amount = rate * approvedQty;
    const totalTaxes = cgstAmount + sgstAmount + igstAmount + tcsAmount;
    const totalAmount = amount + totalTaxes;
    
    setInventoryDetails(prev => ({
      ...prev,
      amount: amount.toFixed(2),
      totalTaxes: totalTaxes.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    }));
  };

  React.useEffect(() => {
    calculateAmounts();
  }, [inventoryDetails.rate, inventoryDetails.approvedQuantity, inventoryDetails.cgstAmount, inventoryDetails.sgstAmount, inventoryDetails.igstAmount, inventoryDetails.tcsAmount]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded via drag & drop`);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed successfully');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!grnDetails.purchaseOrder) {
      toast.error('Please select a Purchase Order');
      return;
    }
    if (!grnDetails.supplier) {
      toast.error('Please select a Supplier');
      return;
    }
    if (!grnDetails.invoiceNumber) {
      toast.error('Please enter Invoice Number');
      return;
    }
    if (!inventoryDetails.expectedQuantity) {
      toast.error('Please enter Expected Quantity');
      return;
    }
    if (!inventoryDetails.receivedQuantity) {
      toast.error('Please enter Received Quantity');
      return;
    }
    if (!inventoryDetails.approvedQuantity) {
      toast.error('Please enter Approved Quantity');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one attachment');
      return;
    }

    // Log form data for debugging
    console.log('GRN Details:', grnDetails);
    console.log('Inventory Details:', inventoryDetails);
    console.log('Attachments:', selectedFiles.map(file => ({ name: file.name, size: file.size, type: file.type })));
    
    toast.success('GRN submitted successfully!');
    navigate('/finance/grn-srn');
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Finance &gt; GRN / SRN &gt; Add New GRN
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">GRN</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* GRN Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">1</span>
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">GRN DETAILS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Purchase Order*</InputLabel>
              <MuiSelect
                label="Purchase Order*"
                value={grnDetails.purchaseOrder}
                onChange={(e) => setGrnDetails({...grnDetails, purchaseOrder: e.target.value})}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Purchase Order</em></MenuItem>
                <MenuItem value="PO001">PO001 - ABC Supplier</MenuItem>
                <MenuItem value="PO002">PO002 - XYZ Corporation</MenuItem>
                <MenuItem value="PO003">PO003 - ACHLA Corporation</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Supplier*</InputLabel>
              <MuiSelect
                label="Supplier*"
                value={grnDetails.supplier}
                onChange={(e) => setGrnDetails({...grnDetails, supplier: e.target.value})}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Supplier</em></MenuItem>
                <MenuItem value="ABC">ABC Supplier</MenuItem>
                <MenuItem value="XYZ Corporation">XYZ Corporation</MenuItem>
                <MenuItem value="ACHLA Corporation">ACHLA Corporation</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Invoice Number*"
              placeholder="Enter Number"
              value={grnDetails.invoiceNumber}
              onChange={(e) => setGrnDetails({...grnDetails, invoiceNumber: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Related To"
              placeholder="Enter Text"
              value={grnDetails.relatedTo}
              onChange={(e) => setGrnDetails({...grnDetails, relatedTo: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Invoice Amount"
              type="number"
              placeholder="Enter Number"
              value={grnDetails.invoiceAmount}
              onChange={(e) => setGrnDetails({...grnDetails, invoiceAmount: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Payment Mode</InputLabel>
              <MuiSelect
                label="Payment Mode"
                value={grnDetails.paymentMode}
                onChange={(e) => setGrnDetails({...grnDetails, paymentMode: e.target.value})}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Payment Mode</em></MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
                <MenuItem value="bank-transfer">Bank Transfer</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Invoice Date*"
              type="date"
              placeholder="Enter Date"
              value={grnDetails.invoiceDate}
              onChange={(e) => setGrnDetails({...grnDetails, invoiceDate: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Posting Date*"
              type="date"
              placeholder="20/06/2025"
              value={grnDetails.postingDate}
              onChange={(e) => setGrnDetails({...grnDetails, postingDate: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Other Expense"
              type="number"
              placeholder="Other Expense"
              value={grnDetails.otherExpense}
              onChange={(e) => setGrnDetails({...grnDetails, otherExpense: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Loading Expense"
              type="number"
              placeholder="Enter Number"
              value={grnDetails.loadingExpense}
              onChange={(e) => setGrnDetails({...grnDetails, loadingExpense: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Adjustment Amount"
              type="number"
              placeholder="Enter Number"
              value={grnDetails.adjustmentAmount}
              onChange={(e) => setGrnDetails({...grnDetails, adjustmentAmount: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="mt-6">
            <TextField
              label="Notes"
              value={grnDetails.notes}
              onChange={(e) => setGrnDetails({...grnDetails, notes: e.target.value})}
              fullWidth
              variant="outlined"
              multiline
              minRows={4}
              placeholder="Enter any additional notes..."
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 1 }}
            />
          </div>
        </div>

        {/* Inventory Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">2</span>
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">INVENTORY DETAILS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Inventory Type</InputLabel>
              <MuiSelect
                label="Inventory Type"
                value={inventoryDetails.inventoryType}
                onChange={(e) => setInventoryDetails({...inventoryDetails, inventoryType: e.target.value})}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="power-supply">12V / 5 Amp Power Supply SM...</MenuItem>
                <MenuItem value="carpet-brush">Carpet Brush</MenuItem>
                <MenuItem value="cruet-set">Cruet Set</MenuItem>
                <MenuItem value="laptop">Laptop</MenuItem>
                <MenuItem value="office-supplies">Office Supplies</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Expected Quantity*"
              type="number"
              placeholder="Expected Quantity"
              value={inventoryDetails.expectedQuantity}
              onChange={(e) => setInventoryDetails({...inventoryDetails, expectedQuantity: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Received Quantity*"
              type="number"
              placeholder="Received Quantity"
              value={inventoryDetails.receivedQuantity}
              onChange={(e) => setInventoryDetails({...inventoryDetails, receivedQuantity: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Approved Quantity*"
              type="number"
              placeholder="Approved Quantity"
              value={inventoryDetails.approvedQuantity}
              onChange={(e) => setInventoryDetails({...inventoryDetails, approvedQuantity: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Rejected Quantity"
              type="number"
              placeholder="Rejected Quantity"
              value={inventoryDetails.rejectedQuantity}
              onChange={(e) => setInventoryDetails({...inventoryDetails, rejectedQuantity: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Rate"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.rate}
              onChange={(e) => setInventoryDetails({...inventoryDetails, rate: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="CGST Rate"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.cgstRate}
              onChange={(e) => setInventoryDetails({...inventoryDetails, cgstRate: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="CGST Amount"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.cgstAmount}
              onChange={(e) => setInventoryDetails({...inventoryDetails, cgstAmount: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="SGST Rate"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.sgstRate}
              onChange={(e) => setInventoryDetails({...inventoryDetails, sgstRate: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="SGST Amount"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.sgstAmount}
              onChange={(e) => setInventoryDetails({...inventoryDetails, sgstAmount: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="IGST Rate"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.igstRate}
              onChange={(e) => setInventoryDetails({...inventoryDetails, igstRate: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="IGST Amount"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.igstAmount}
              onChange={(e) => setInventoryDetails({...inventoryDetails, igstAmount: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="TCS Rate"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.tcsRate}
              onChange={(e) => setInventoryDetails({...inventoryDetails, tcsRate: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="TCS Amount"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.tcsAmount}
              onChange={(e) => setInventoryDetails({...inventoryDetails, tcsAmount: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Total Taxes"
              type="number"
              placeholder="Total Amount"
              value={inventoryDetails.totalTaxes}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ 
                sx: { ...fieldStyles, backgroundColor: '#f5f5f5' },
                readOnly: true 
              }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Amount"
              type="number"
              placeholder="Enter Number"
              value={inventoryDetails.amount}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ 
                sx: { ...fieldStyles, backgroundColor: '#f5f5f5' },
                readOnly: true 
              }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Total Amount"
              type="number"
              placeholder="Total Amount"
              value={inventoryDetails.totalAmount}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ 
                sx: { ...fieldStyles, backgroundColor: '#f5f5f5' },
                readOnly: true 
              }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline">
              Add Batch
            </Button>
            <Button type="button" variant="ghost" className="text-gray-400">
              ✕
            </Button>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">3</span>
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">ATTACHMENTS*</h2>
          </div>

          <div 
            className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Drag & Drop</span> or{" "}
              <button type="button" className="text-[#C72030] underline">Choose File</button> No file chosen
            </p>
          </div>

          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="flex justify-end items-center gap-4">
          <div className="bg-[#C72030] text-white px-4 py-2 rounded text-right">
            Total Amount- {inventoryDetails.totalAmount || '0.00'}
          </div>
          <Button 
            type="submit"
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
