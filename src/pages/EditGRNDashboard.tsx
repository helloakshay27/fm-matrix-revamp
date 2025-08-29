import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

export const EditGRNDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  // Mock data for demonstration - in real app, this would come from API
  const mockGRNData: Record<string, {
    purchaseOrder: string;
    supplier: string;
    invoiceNumber: string;
    relatedTo: string;
    invoiceAmount: string;
    paymentMode: string;
    invoiceDate: string;
    postingDate: string;
    otherExpense: string;
    loadingExpense: string;
    adjustmentAmount: string;
    notes: string;
    inventoryType: string;
    expectedQuantity: string;
    receivedQuantity: string;
    approvedQuantity: string;
    rejectedQuantity: string;
    rate: string;
    cgstRate: string;
    cgstAmount: string;
    sgstRate: string;
    sgstAmount: string;
    igstRate: string;
    igstAmount: string;
    tcsRate: string;
    tcsAmount: string;
  }> = {
    '6407': {
      purchaseOrder: 'PO001',
      supplier: 'Check',
      invoiceNumber: 'NA',
      relatedTo: '64 Size',
      invoiceAmount: '100',
      paymentMode: 'bank-transfer',
      invoiceDate: '2022-03-27',
      postingDate: '2022-03-27',
      otherExpense: '0',
      loadingExpense: '0',
      adjustmentAmount: '0',
      notes: 'Standard delivery',
      inventoryType: 'power-supply',
      expectedQuantity: '10',
      receivedQuantity: '10',
      approvedQuantity: '10',
      rejectedQuantity: '0',
      rate: '10.00',
      cgstRate: '9.00',
      cgstAmount: '9.00',
      sgstRate: '9.00',
      sgstAmount: '9.00',
      igstRate: '0.00',
      igstAmount: '0.00',
      tcsRate: '0.00',
      tcsAmount: '0.00'
    },
    '6406': {
      purchaseOrder: 'PO002',
      supplier: 'Check',
      invoiceNumber: 'NA',
      relatedTo: '64 Size',
      invoiceAmount: '100',
      paymentMode: 'cash',
      invoiceDate: '2022-03-27',
      postingDate: '2022-03-27',
      otherExpense: '0',
      loadingExpense: '0',
      adjustmentAmount: '0',
      notes: 'Express delivery',
      inventoryType: 'carpet-brush',
      expectedQuantity: '5',
      receivedQuantity: '5',
      approvedQuantity: '5',
      rejectedQuantity: '0',
      rate: '20.00',
      cgstRate: '9.00',
      cgstAmount: '9.00',
      sgstRate: '9.00',
      sgstAmount: '9.00',
      igstRate: '0.00',
      igstAmount: '0.00',
      tcsRate: '0.00',
      tcsAmount: '0.00'
    }
  };

  // Load existing data when component mounts
  useEffect(() => {
    if (id && mockGRNData[id]) {
      const data = mockGRNData[id];
      setGrnDetails({
        purchaseOrder: data.purchaseOrder,
        supplier: data.supplier,
        invoiceNumber: data.invoiceNumber,
        relatedTo: data.relatedTo,
        invoiceAmount: data.invoiceAmount,
        paymentMode: data.paymentMode,
        invoiceDate: data.invoiceDate,
        postingDate: data.postingDate,
        otherExpense: data.otherExpense,
        loadingExpense: data.loadingExpense,
        adjustmentAmount: data.adjustmentAmount,
        notes: data.notes
      });
      setInventoryDetails({
        inventoryType: data.inventoryType,
        expectedQuantity: data.expectedQuantity,
        receivedQuantity: data.receivedQuantity,
        approvedQuantity: data.approvedQuantity,
        rejectedQuantity: data.rejectedQuantity,
        rate: data.rate,
        cgstRate: data.cgstRate,
        cgstAmount: data.cgstAmount,
        sgstRate: data.sgstRate,
        sgstAmount: data.sgstAmount,
        igstRate: data.igstRate,
        igstAmount: data.igstAmount,
        tcsRate: data.tcsRate,
        tcsAmount: data.tcsAmount,
        totalTaxes: '',
        amount: '',
        totalAmount: ''
      });
    }
  }, [id]);

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

    // Log form data for debugging
    console.log('Updated GRN Details:', grnDetails);
    console.log('Updated Inventory Details:', inventoryDetails);
    console.log('Attachments:', selectedFiles.map(file => ({ name: file.name, size: file.size, type: file.type })));

    toast.success(`GRN ${id} updated successfully!`);
    navigate('/finance/grn-srn');
  };

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-2 p-0"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">EDIT GRN</h1>

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
            <div>
              <Label className="text-sm font-medium">Purchase Order*</Label>
              <Select value={grnDetails.purchaseOrder} onValueChange={(value) => setGrnDetails({ ...grnDetails, purchaseOrder: value })}>
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
              <Select value={grnDetails.supplier} onValueChange={(value) => setGrnDetails({ ...grnDetails, supplier: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="ABC">ABC Supplier</SelectItem>
                  <SelectItem value="XYZ Corporation">XYZ Corporation</SelectItem>
                  <SelectItem value="ACHLA Corporation">ACHLA Corporation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Invoice Number*</Label>
              <Input
                placeholder="Enter Number"
                value={grnDetails.invoiceNumber}
                onChange={(e) => setGrnDetails({ ...grnDetails, invoiceNumber: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Related To</Label>
              <Input
                placeholder="Enter Text"
                value={grnDetails.relatedTo}
                onChange={(e) => setGrnDetails({ ...grnDetails, relatedTo: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Invoice Amount</Label>
              <Input
                type="number"
                placeholder="Enter Number"
                value={grnDetails.invoiceAmount}
                onChange={(e) => setGrnDetails({ ...grnDetails, invoiceAmount: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Payment Mode</Label>
              <Select value={grnDetails.paymentMode} onValueChange={(value) => setGrnDetails({ ...grnDetails, paymentMode: value })}>
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
                placeholder="Enter Date"
                value={grnDetails.invoiceDate}
                onChange={(e) => setGrnDetails({ ...grnDetails, invoiceDate: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Posting Date*</Label>
              <Input
                type="date"
                placeholder="20/06/2025"
                value={grnDetails.postingDate}
                onChange={(e) => setGrnDetails({ ...grnDetails, postingDate: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Other Expense</Label>
              <Input
                type="number"
                placeholder="Other Expense"
                value={grnDetails.otherExpense}
                onChange={(e) => setGrnDetails({ ...grnDetails, otherExpense: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Loading Expense</Label>
              <Input
                type="number"
                placeholder="Enter Number"
                value={grnDetails.loadingExpense}
                onChange={(e) => setGrnDetails({ ...grnDetails, loadingExpense: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Adjustment Amount</Label>
              <Input
                type="number"
                placeholder="Enter Number"
                value={grnDetails.adjustmentAmount}
                onChange={(e) => setGrnDetails({ ...grnDetails, adjustmentAmount: e.target.value })}
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
              onChange={(e) => setGrnDetails({ ...grnDetails, notes: e.target.value })}
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
            <div>
              <Label className="text-sm font-medium">Inventory Type</Label>
              <Select value={inventoryDetails.inventoryType} onValueChange={(value) => setInventoryDetails({ ...inventoryDetails, inventoryType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
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
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, expectedQuantity: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Received Quantity*</Label>
              <Input
                type="number"
                placeholder="Received Quantity"
                value={inventoryDetails.receivedQuantity}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, receivedQuantity: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Approved Quantity*</Label>
              <Input
                type="number"
                placeholder="Approved Quantity"
                value={inventoryDetails.approvedQuantity}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, approvedQuantity: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Rejected Quantity</Label>
              <Input
                type="number"
                placeholder="Rejected Quantity"
                value={inventoryDetails.rejectedQuantity}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, rejectedQuantity: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Rate</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Number"
                value={inventoryDetails.rate}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, rate: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">CGST Rate</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Number"
                value={inventoryDetails.cgstRate}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, cgstRate: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">CGST Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Number"
                value={inventoryDetails.cgstAmount}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, cgstAmount: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">SGST Rate</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Number"
                value={inventoryDetails.sgstRate}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, sgstRate: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">SGST Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Number"
                value={inventoryDetails.sgstAmount}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, sgstAmount: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">IGST Rate</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Number"
                value={inventoryDetails.igstRate}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, igstRate: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">IGST Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Number"
                value={inventoryDetails.igstAmount}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, igstAmount: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">TCS Rate</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Number"
                value={inventoryDetails.tcsRate}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, tcsRate: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">TCS Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter Number"
                value={inventoryDetails.tcsAmount}
                onChange={(e) => setInventoryDetails({ ...inventoryDetails, tcsAmount: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Total Taxes</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Total Amount"
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
                placeholder="Enter Number"
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
                placeholder="Total Amount"
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
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">3</span>
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">ATTACHMENTS</h2>
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
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};
