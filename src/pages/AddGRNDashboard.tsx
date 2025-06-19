
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export const AddGRNDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    supplier: '',
    invoiceNumber: '',
    invoiceDate: '',
    postingDate: '',
    retentionAmount: '',
    tdsAmount: '',
    poReferenceNumber: '',
    grnAmount: '',
    paymentMode: '',
    relatedTo: '',
    physicalInvoiceSentTo: '',
    notes: ''
  });

  const [items, setItems] = useState([
    {
      id: 1,
      inventory: '',
      expectedQuantity: '',
      receivedQuantity: '',
      unit: '',
      rate: '',
      approvedQty: '',
      rejectedQty: '',
      cgstRate: '',
      cgstAmount: '',
      sgstRate: '',
      sgstAmount: '',
      igstRate: '',
      igstAmount: ''
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addNewItem = () => {
    const newItem = {
      id: items.length + 1,
      inventory: '',
      expectedQuantity: '',
      receivedQuantity: '',
      unit: '',
      rate: '',
      approvedQty: '',
      rejectedQty: '',
      cgstRate: '',
      cgstAmount: '',
      sgstRate: '',
      sgstAmount: '',
      igstRate: '',
      igstAmount: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    console.log('Submitting GRN:', { formData, items });
    toast.success('GRN created successfully!');
    navigate('/finance/grn-srn');
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Finance &gt; GRN / SRN &gt; Add New
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">ADD NEW GRN</h1>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="supplier">Supplier *</Label>
              <Select onValueChange={(value) => handleInputChange('supplier', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abc">ABC</SelectItem>
                  <SelectItem value="xyz">XYZ Corporation</SelectItem>
                  <SelectItem value="achla">ACHLA CORPORATION</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                placeholder="Enter invoice number"
              />
            </div>

            <div>
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="postingDate">Posting Date</Label>
              <Input
                id="postingDate"
                type="date"
                value={formData.postingDate}
                onChange={(e) => handleInputChange('postingDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="retentionAmount">Retention Amount</Label>
              <Input
                id="retentionAmount"
                type="number"
                value={formData.retentionAmount}
                onChange={(e) => handleInputChange('retentionAmount', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="tdsAmount">TDS Amount</Label>
              <Input
                id="tdsAmount"
                type="number"
                value={formData.tdsAmount}
                onChange={(e) => handleInputChange('tdsAmount', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="poReferenceNumber">PO Reference Number</Label>
              <Select onValueChange={(value) => handleInputChange('poReferenceNumber', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select PO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="121249">121249</SelectItem>
                  <SelectItem value="121250">121250</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select onValueChange={(value) => handleInputChange('paymentMode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="relatedTo">Related To</Label>
              <Input
                id="relatedTo"
                value={formData.relatedTo}
                onChange={(e) => handleInputChange('relatedTo', e.target.value)}
                placeholder="Enter relation"
              />
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="physicalInvoiceSentTo">Physical Invoice Sent To</Label>
              <Input
                id="physicalInvoiceSentTo"
                value={formData.physicalInvoiceSentTo}
                onChange={(e) => handleInputChange('physicalInvoiceSentTo', e.target.value)}
                placeholder="Enter recipient"
              />
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter notes"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Items</h3>
            <Button
              onClick={addNewItem}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Action</TableHead>
                  <TableHead>Inventory *</TableHead>
                  <TableHead>Expected Qty</TableHead>
                  <TableHead>Received Qty *</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rate *</TableHead>
                  <TableHead>Approved Qty</TableHead>
                  <TableHead>Rejected Qty</TableHead>
                  <TableHead>CGST Rate</TableHead>
                  <TableHead>CGST Amount</TableHead>
                  <TableHead>SGST Rate</TableHead>
                  <TableHead>SGST Amount</TableHead>
                  <TableHead>IGST Rate</TableHead>
                  <TableHead>IGST Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(value) => handleItemChange(index, 'inventory', value)}>
                        <SelectTrigger className="min-w-32">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carpet-brush">Carpet Brush</SelectItem>
                          <SelectItem value="cruet-set">Cruet Set</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.expectedQuantity}
                        onChange={(e) => handleItemChange(index, 'expectedQuantity', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.receivedQuantity}
                        onChange={(e) => handleItemChange(index, 'receivedQuantity', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        className="min-w-16"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.approvedQty}
                        onChange={(e) => handleItemChange(index, 'approvedQty', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rejectedQty}
                        onChange={(e) => handleItemChange(index, 'rejectedQty', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.cgstRate}
                        onChange={(e) => handleItemChange(index, 'cgstRate', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.cgstAmount}
                        onChange={(e) => handleItemChange(index, 'cgstAmount', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.sgstRate}
                        onChange={(e) => handleItemChange(index, 'sgstRate', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.sgstAmount}
                        onChange={(e) => handleItemChange(index, 'sgstAmount', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.igstRate}
                        onChange={(e) => handleItemChange(index, 'igstRate', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.igstAmount}
                        onChange={(e) => handleItemChange(index, 'igstAmount', e.target.value)}
                        className="min-w-20"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Attachments</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Drag and drop files here or click to browse</p>
            <Button variant="outline">
              Choose Files
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate('/finance/grn-srn')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            Create GRN
          </Button>
        </div>
      </div>
    </div>
  );
};
