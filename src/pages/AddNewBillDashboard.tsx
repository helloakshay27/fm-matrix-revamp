
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export const AddNewBillDashboard = () => {
  const navigate = useNavigate();
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
    sgstAmount2: '',
    totalAmount: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bill Form submitted:', formData);
    navigate('/finance/other-bills');
  };

  return (
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
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
              1
            </div>
            <h2 className="text-lg font-semibold text-red-600">BILL DETAILS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Supplier<span className="text-red-500">*</span>
                </label>
                <Select value={formData.supplier} onValueChange={(value) => setFormData({...formData, supplier: value})}>
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
                <label className="block text-sm font-medium mb-1">Related To</label>
                <Input 
                  placeholder="Related To"
                  value={formData.relatedTo}
                  onChange={(e) => setFormData({...formData, relatedTo: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deduction</label>
                <Input 
                  placeholder="Deduction"
                  value={formData.deduction}
                  onChange={(e) => setFormData({...formData, deduction: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Additional Expenses</label>
                <Input 
                  placeholder="Additional Expenses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CGST Amount</label>
                <Input 
                  placeholder="CGST Amount"
                  value={formData.cgstAmount}
                  onChange={(e) => setFormData({...formData, cgstAmount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">IGST Rate</label>
                <Input 
                  placeholder="IGST Rate"
                  value={formData.igstRate}
                  onChange={(e) => setFormData({...formData, igstRate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">TCS Amount</label>
                <Input 
                  placeholder="TCS Amount"
                  value={formData.tcsAmount}
                  onChange={(e) => setFormData({...formData, tcsAmount: e.target.value})}
                />
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bill Date<span className="text-red-500">*</span>
                </label>
                <Input 
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={formData.billDate}
                  onChange={(e) => setFormData({...formData, billDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">TDS(%)</label>
                <Input 
                  placeholder="TDS"
                  value={formData.tds}
                  onChange={(e) => setFormData({...formData, tds: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deduction Remarks</label>
                <Input 
                  placeholder="Deduction Remarks"
                  value={formData.deductionRemarks}
                  onChange={(e) => setFormData({...formData, deductionRemarks: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Payment Tenure(In Days)</label>
                <Input 
                  placeholder="Payment Tenure"
                  value={formData.paymentTenure}
                  onChange={(e) => setFormData({...formData, paymentTenure: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">SGST Rate</label>
                <Input 
                  placeholder="SGST Rate"
                  value={formData.sgstRate}
                  onChange={(e) => setFormData({...formData, sgstRate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">IGST Amount</label>
                <Input 
                  placeholder="IGST Amount"
                  value={formData.igstAmount}
                  onChange={(e) => setFormData({...formData, igstAmount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tax Amount</label>
                <Input 
                  placeholder="Tax Amount"
                  value={formData.taxAmount}
                  onChange={(e) => setFormData({...formData, taxAmount: e.target.value})}
                />
              </div>
            </div>

            {/* Third Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Invoice Number</label>
                <Input 
                  placeholder="Invoice Number"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Retention(%)</label>
                <Input 
                  placeholder="Retention"
                  value={formData.retention}
                  onChange={(e) => setFormData({...formData, retention: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount<span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CGST Rate</label>
                <Input 
                  placeholder="CGST Rate"
                  value={formData.cgstRate}
                  onChange={(e) => setFormData({...formData, cgstRate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">SGST Amount</label>
                <Input 
                  placeholder="SGST Amount"
                  value={formData.sgstAmount}
                  onChange={(e) => setFormData({...formData, sgstAmount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">TCS Rate</label>
                <Input 
                  placeholder="TCS Rate"
                  value={formData.tcsRate}
                  onChange={(e) => setFormData({...formData, tcsRate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total Amount</label>
                <Input 
                  placeholder="Total Amount"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">
              Description<span className="text-red-500">*</span>
            </label>
            <Textarea 
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>
        </div>

        {/* Attachments Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
              2
            </div>
            <h2 className="text-lg font-semibold text-red-600">ATTACHMENTS</h2>
          </div>

          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <p className="text-gray-600">Drag & Drop or <span className="text-orange-500 underline cursor-pointer">Choose File</span></p>
            <p className="text-sm text-gray-500 mt-1">No file chosen</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
