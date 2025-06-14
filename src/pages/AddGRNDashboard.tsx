
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';

export const AddGRNDashboard = () => {
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState("0.00");

  const [grnDetails, setGrnDetails] = useState({
    purchaseOrder: '',
    supplier: '',
    invoiceNumber: '',
    relatedTo: '',
    invoiceAmount: '',
    paymentMode: '',
    invoiceDate: '14/06/2025',
    postingDate: '14/06/2025',
    otherExpense: '',
    lodingExpense: '',
    adjustmentAmount: '',
    notes: ''
  });

  const [inventoryDetails, setInventoryDetails] = useState({
    inventoryType: '12V / 5 Amp Power Supply SM...',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('GRN Details:', grnDetails);
    console.log('Inventory Details:', inventoryDetails);
    // Handle form submission logic here
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        GRN &gt; New GRN
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">GRN</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* GRN Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
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
                  <SelectItem value="po1">Purchase Order 1</SelectItem>
                  <SelectItem value="po2">Purchase Order 2</SelectItem>
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
                  <SelectItem value="supplier1">Supplier 1</SelectItem>
                  <SelectItem value="supplier2">Supplier 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Invoice Number*</Label>
              <Input
                placeholder="Enter Number"
                value={grnDetails.invoiceNumber}
                onChange={(e) => setGrnDetails({...grnDetails, invoiceNumber: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Related To</Label>
              <Input
                placeholder="Enter Text"
                value={grnDetails.relatedTo}
                onChange={(e) => setGrnDetails({...grnDetails, relatedTo: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Invoice Amount</Label>
              <Input
                placeholder="Enter Number"
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
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Invoice Date*</Label>
              <Input
                placeholder="Enter Date"
                value={grnDetails.invoiceDate}
                onChange={(e) => setGrnDetails({...grnDetails, invoiceDate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Posting Date*</Label>
              <Input
                value={grnDetails.postingDate}
                onChange={(e) => setGrnDetails({...grnDetails, postingDate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Other Expense</Label>
              <Input
                placeholder="Other Expense"
                value={grnDetails.otherExpense}
                onChange={(e) => setGrnDetails({...grnDetails, otherExpense: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Loding Expense</Label>
              <Input
                placeholder="Enter Number"
                value={grnDetails.lodingExpense}
                onChange={(e) => setGrnDetails({...grnDetails, lodingExpense: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Adjustment Amount</Label>
              <Input
                placeholder="Enter Number"
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
              value={grnDetails.notes}
              onChange={(e) => setGrnDetails({...grnDetails, notes: e.target.value})}
            />
          </div>
        </div>

        {/* Inventory Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📦</span>
            </div>
            <h2 className="text-lg font-semibold text-orange-600">INVENTORY DETAILS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm font-medium">Inventory Type</Label>
              <Select value={inventoryDetails.inventoryType} onValueChange={(value) => setInventoryDetails({...inventoryDetails, inventoryType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12V / 5 Amp Power Supply SM...">12V / 5 Amp Power Supply SM...</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Expected Quantity*</Label>
              <Input
                placeholder="Expected Quantity"
                value={inventoryDetails.expectedQuantity}
                onChange={(e) => setInventoryDetails({...inventoryDetails, expectedQuantity: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Received Quantity*</Label>
              <Input
                placeholder="Received Quantity"
                value={inventoryDetails.receivedQuantity}
                onChange={(e) => setInventoryDetails({...inventoryDetails, receivedQuantity: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Approved Quantity*</Label>
              <Input
                placeholder="Approved Quantity"
                value={inventoryDetails.approvedQuantity}
                onChange={(e) => setInventoryDetails({...inventoryDetails, approvedQuantity: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Rejected Quantity</Label>
              <Input
                placeholder="Rejected Quantity"
                value={inventoryDetails.rejectedQuantity}
                onChange={(e) => setInventoryDetails({...inventoryDetails, rejectedQuantity: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Rate</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.rate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, rate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">CGST Rate</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.cgstRate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, cgstRate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">CGST Amount</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.cgstAmount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, cgstAmount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">SGST Rate</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.sgstRate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, sgstRate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">SGST Amount</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.sgstAmount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, sgstAmount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">IGST Rate</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.igstRate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, igstRate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">IGST Amount</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.igstAmount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, igstAmount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">TCS Rate</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.tcsRate}
                onChange={(e) => setInventoryDetails({...inventoryDetails, tcsRate: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">TCS Amount</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.tcsAmount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, tcsAmount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Total Taxes</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.totalTaxes}
                onChange={(e) => setInventoryDetails({...inventoryDetails, totalTaxes: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Amount</Label>
              <Input
                placeholder="Enter Number"
                value={inventoryDetails.amount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, amount: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Total Amount</Label>
              <Input
                placeholder="Total Amount"
                value={inventoryDetails.totalAmount}
                onChange={(e) => setInventoryDetails({...inventoryDetails, totalAmount: e.target.value})}
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
              <span className="text-white text-sm">📎</span>
            </div>
            <h2 className="text-lg font-semibold text-orange-600">ATTACHMENTS*</h2>
          </div>

          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Drag & Drop</span> or{" "}
              <button type="button" className="text-orange-600 underline">Choose Files</button>
            </p>
            <p className="text-sm text-gray-500">No file chosen</p>
          </div>
        </div>

        {/* Total Amount and Submit */}
        <div className="flex justify-end items-center gap-4">
          <div className="bg-purple-600 text-white px-4 py-2 rounded">
            Total Amount:- {totalAmount}
          </div>
          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
