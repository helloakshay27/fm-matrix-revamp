
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FileText, ListChecks, Paperclip } from "lucide-react";

export const AddPODashboard = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    materialPR: '',
    supplier: '',
    plantDetail: '',
    poDate: '',
    billingAddress: '',
    deliveryAddress: '',
    relatedTo: '',
    retention: '',
    tds: '',
    qc: '',
    paymentTenure: '',
    advanceAmount: '',
    termsConditions: '',
    attachment: null as File | null
  });

  const [items, setItems] = useState([
    {
      id: 1,
      description: 'Carpet Brush',
      sacHsnCode: 'NA',
      expectedDate: '23/04/25',
      quantity: '10.0',
      unit: '',
      rate: '70.00',
      wbsCode: '',
      gstRate: '9.00',
      amount: '63.00',
      sgstRate: '9.00',
      sgstAmount: '63.00',
      igstRate: '0.00',
      igstAmount: '0.00',
      ugstRate: '0.00',
      ugstAmount: '0.00',
      tdsRate: '0.00',
      tdsAmount: '0.00',
      taxAmount: '',
      totalAmount: '826.00'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast.success('Purchase Order created successfully');
    navigate('/finance/po');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, attachment: file });
  };

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      description: '',
      sacHsnCode: '',
      expectedDate: '',
      quantity: '',
      unit: '',
      rate: '',
      wbsCode: '',
      gstRate: '',
      amount: '',
      sgstRate: '',
      sgstAmount: '',
      igstRate: '',
      igstAmount: '',
      ugstRate: '',
      ugstAmount: '',
      tdsRate: '',
      tdsAmount: '',
      taxAmount: '',
      totalAmount: ''
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Finance
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">NEW PURCHASE ORDER</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Supplier Details Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-6">
           <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
    <FileText className="text-white w-4 h-4" />
  </div>
  <h2 className="text-lg font-semibold text-[#C72030]">SUPPLIER DETAILS</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Material PR: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.materialPR}
                onValueChange={(value) => setFormData({ ...formData, materialPR: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pr1">PR-001</SelectItem>
                  <SelectItem value="pr2">PR-002</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Supplier: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.supplier}
                onValueChange={(value) => setFormData({ ...formData, supplier: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">ABC Corp</SelectItem>
                  <SelectItem value="supplier2">XYZ Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Plant Detail: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.plantDetail}
                onValueChange={(value) => setFormData({ ...formData, plantDetail: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plant1">Plant 1</SelectItem>
                  <SelectItem value="plant2">Plant 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                PO Date: <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.poDate}
                onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                placeholder="dd-mm-yyyy"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Billing Address: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.billingAddress}
                onValueChange={(value) => setFormData({ ...formData, billingAddress: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="address1">Address 1</SelectItem>
                  <SelectItem value="address2">Address 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Delivery Address: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.deliveryAddress}
                onValueChange={(value) => setFormData({ ...formData, deliveryAddress: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery1">Delivery 1</SelectItem>
                  <SelectItem value="delivery2">Delivery 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Related To
              </Label>
              <Input
                value={formData.relatedTo}
                onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Retention(%)
              </Label>
              <Input
                value={formData.retention}
                onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                TDS(%)
              </Label>
              <Input
                value={formData.tds}
                onChange={(e) => setFormData({ ...formData, tds: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                QC(%)
              </Label>
              <Input
                value={formData.qc}
                onChange={(e) => setFormData({ ...formData, qc: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Payment Tenure(In Days)
              </Label>
              <Input
                value={formData.paymentTenure}
                onChange={(e) => setFormData({ ...formData, paymentTenure: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Advance Amount
              </Label>
              <Input
                value={formData.advanceAmount}
                onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Terms & Conditions
            </Label>
            <Textarea
              value={formData.termsConditions}
              onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
              placeholder="Enter..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Item Details Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
    <ListChecks className="text-white w-4 h-4" />
  </div>
  <h2 className="text-lg font-semibold text-[#C72030]">ITEM DETAILS</h2>
          </div>

          <Button 
            type="button"
            onClick={addItem}
            className="bg-[#C72030] hover:bg-[#A01020] text-white mb-4"
          >
            Add Item
          </Button>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-2 text-xs">S.No.</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">Item Details</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">SAC/HSN Code</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">Expected Date</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">Quantity</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">Unit</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">Rate</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">WBS Code</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">CGST Rate(%)</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">CGST Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">SGST Rate(%)</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">SGST Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">IGST Rate(%)</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">IGST Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">TDS Rate(%)</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">TDS Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">Tax Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-2 py-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.description}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.sacHsnCode}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.expectedDate}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.quantity}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.unit}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.rate}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.wbsCode}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.gstRate}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.amount}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.sgstRate}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.sgstAmount}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.igstRate}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.igstAmount}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.tdsRate}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.tdsAmount}</td>
                    <td className="border border-gray-300 px-2 py-2">{item.taxAmount}</td>
                    <td className="border border-gray-300 px-2 py-2 font-medium">{item.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4 text-right">
            <div></div>
            <div></div>
            <div className="text-sm font-medium">
              <div>Net Amount(INR):</div>
              <div>Gross Amount:</div>
              <div>Taxes:</div>
              <div>Net Invoice Amount:</div>
              <div className="mt-2">Amount In Words: Two Thousand, Three Hundred, Sixty Rupees Only</div>
            </div>
            <div className="text-sm">
              <div>2360.00</div>
              <div>2360.00</div>
              <div>0.00</div>
              <div className="font-medium">2360.00</div>
            </div>
          </div>
        </div>

        {/* Attachment Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
    <Paperclip className="text-white w-4 h-4" />
  </div>
  <h2 className="text-lg font-semibold text-[#C72030]">Attachment</h2>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Attachment:
            </Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <span className="text-sm text-gray-500">
                {formData.attachment ? formData.attachment.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button 
            type="submit"
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-8 py-2"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
