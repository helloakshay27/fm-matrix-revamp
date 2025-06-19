
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

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
      <h1 className="text-2xl font-bold mb-6">Add New GRN</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* GRN Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">1</span>
            </div>
            <h2 className="text-lg font-semibold text-orange-600">GRN DETAILS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium">Purchase Order*</Label>
              <Select value={grnDetails.purchaseOrder} onValueChange={(value) => setGrnDetails({...grnDetails, purchaseOrder: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Purchase Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PO001">PO001 - ABC Supplier</SelectItem>
                  <SelectItem value="PO002">PO002 - XYZ Corporation</SelectItem>
                  <SelectItem value="PO003">PO003 - ACHLA Corporation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Supplier*</Label>
              <Select value={grnDetails.supplier} onValueChange={(value) => setGrnDetails({...grnDetails, supplier: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABC">ABC Supplier</SelectItem>
                  <SelectItem value="XYZ Corporation">XYZ Corporation</SelectItem>
                  <SelectItem value="ACHLA Corporation">ACHLA Corporation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Invoice Number*</Label>
              <Input
                placeholder="Enter Invoice Number"
                value={grnDetails.invoiceNumber}
                onChange={(e) => setGrnDetails({...grnDetails, invoiceNumber: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Related To</Label>
              <Input
                placeholder="Enter Related To"
                value={grnDetails.relatedTo}
                onChange={(e) => setGrnDetails({...grnDetails, relatedTo: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Invoice Amount</Label>
              <Input
                type="number"
                placeholder="Enter Invoice Amount"
                value={grnDetails.invoiceAmount}
                onChange={(e) => setGrnDetails({...grnDetails, invoiceAmount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Payment Mode</Label>
              <Select value={grnDetails.paymentMode} onValueChange={(value) => setGrnDetails({...grnDetails, paymentMode: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Invoice Date*</Label>
              <Input
                type="date"
                value={grnDetails.invoiceDate}
                onChange={(e) => setGrnDetails({...grnDetails, invoiceDate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Posting Date*</Label>
              <Input
                type="date"
                value={grnDetails.postingDate}
                onChange={(e) => setGrnDetails({...grnDetails, postingDate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Other Expense</Label>
              <Input
                type="number"
                placeholder="Enter Other Expense"
                value={grnDetails.otherExpense}
                onChange={(e) => setGrnDetails({...grnDetails, otherExpense: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Loading Expense</Label>
              <Input
                type="number"
                placeholder="Enter Loading Expense"
                value={grnDetails.loadingExpense}
                onChange={(e) => setGrnDetails({...grnDetails, loadingExpense: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Adjustment Amount</Label>
              <Input
                type="number"
                placeholder="Enter Adjustment Amount"
                value={grnDetails.adjustmentAmount}
                onChange={(e) => setGrnDetails({...grnDetails, adjustmentAmount: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea
              className="mt-2"
              rows={4}
              placeholder="Enter any additional notes..."
              value={grnDetails.notes}
              onChange={(e) => setGrnDetails({...grnDetails, notes: e.target.value})}
            />
          </div>
        </div>

        {/* Inventory Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">2</span>
            </div>
            <h2 className="text-lg font-semibold text-orange-600">INVENTORY DETAILS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm font-medium">Inventory Type</Label>
              <Select value={inventoryDetails.inventoryType} onValueChange={(value) => setInventoryDetails({...inventoryDetails, inventoryType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Inventory Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="power-supply">12V / 5 Amp Power Supply SM...</SelectItem>
                  <SelectItem value="carpet-brush">Carpet Brush</SelectItem>
                  <SelectItem value="cruet-set">Cruet Set</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="office-supplies">Office Supplies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Expected Quantity*</Label>
              <Input
                type="number"
                placeholder="Expected Quantity"
                value={inventoryDetails.expectedQuantity}
                onChange={(e) => setInventoryDetails({...inventoryDetails, expectedQuantity: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Received Quantity*</Label>
              <Input
                type="number"
                placeholder="Received Quantity"
                value={inventoryDetails.receivedQuantity}
                onChange={(e) => setInventoryDetails({...inventoryDetails, receivedQuantity: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Approved Quantity*</Label>
              <Input
                type="number"
                placeholder="Approved Quantity"
                value={inventoryDetails.approvedQuantity}
                onChange={(e) => setInventoryDetails({...inventoryDetails, approvedQuantity: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Rejected Quantity</Label>
              <Input
                type="number"
                placeholder="Rejected Quantity"
                value={inventoryDetails.rejectedQuantity}
                onChange={(e) => setInventoryDetails({...inventoryDetails, rejectedQuantity: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Rate</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Rate"
                value={inventoryDetails.rate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, rate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">CGST Rate (%)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter CGST Rate"
                value={inventoryDetails.cgstRate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, cgstRate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">CGST Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter CGST Amount"
                value={inventoryDetails.cgstAmount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, cgstAmount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">SGST Rate (%)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter SGST Rate"
                value={inventoryDetails.sgstRate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, sgstRate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">SGST Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter SGST Amount"
                value={inventoryDetails.sgstAmount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, sgstAmount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">IGST Rate (%)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter IGST Rate"
                value={inventoryDetails.igstRate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, igstRate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">IGST Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter IGST Amount"
                value={inventoryDetails.igstAmount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, igstAmount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">TCS Rate (%)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter TCS Rate"
                value={inventoryDetails.tcsRate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, tcsRate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">TCS Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter TCS Amount"
                value={inventoryDetails.tcsAmount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, tcsAmount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Total Taxes</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Auto-calculated"
                value={inventoryDetails.totalTaxes}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Auto-calculated"
                value={inventoryDetails.amount}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Total Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Auto-calculated"
                value={inventoryDetails.totalAmount}
                readOnly
                className="bg-gray-50"
              />
            </div>
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
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">3</span>
            </div>
            <h2 className="text-lg font-semibold text-orange-600">ATTACHMENTS*</h2>
          </div>

          <div 
            className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Drag & Drop</span> or{" "}
              <button type="button" className="text-orange-600 underline">Choose Files</button>
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 5MB each)
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

        {/* Total Amount and Submit */}
        <div className="flex justify-end items-center gap-4">
          <div className="bg-[#C72030] text-white px-4 py-2 rounded">
            Total Amount: ₹{inventoryDetails.totalAmount || '0.00'}
          </div>
          <Button 
            type="submit"
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
          >
            Submit GRN
          </Button>
        </div>
      </form>
    </div>
  );
};
