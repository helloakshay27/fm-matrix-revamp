
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';

interface CreateInvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateInvoiceReceiptModal = ({ isOpen, onClose, onSubmit }: CreateInvoiceReceiptModalProps) => {
  const [formData, setFormData] = useState({
    receiptNumber: '',
    invoiceNumber: '',
    block: '',
    flat: '',
    address: '',
    paymentMode: '',
    amountReceived: '',
    transactionNumber: '',
    bankName: '',
    branchName: '',
    paymentDate: '',
    receiptDate: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold bg-gray-100 py-2 px-4 rounded">
            CREATE INVOICE RECEIPT
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="receiptNumber" className="text-sm font-medium">Receipt Number</Label>
              <Input
                id="receiptNumber"
                placeholder="Receipt no."
                value={formData.receiptNumber}
                onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="block" className="text-sm font-medium">Block</Label>
              <Select onValueChange={(value) => handleInputChange('block', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Tower" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tower-a">Tower A</SelectItem>
                  <SelectItem value="tower-b">Tower B</SelectItem>
                  <SelectItem value="tower-c">Tower C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <Select onValueChange={(value) => handleInputChange('address', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select address" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="address-1">Address 1</SelectItem>
                  <SelectItem value="address-2">Address 2</SelectItem>
                  <SelectItem value="address-3">Address 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amountReceived" className="text-sm font-medium">Amount Received</Label>
              <Input
                id="amountReceived"
                placeholder="Amount"
                value={formData.amountReceived}
                onChange={(e) => handleInputChange('amountReceived', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bankName" className="text-sm font-medium">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="paymentDate" className="text-sm font-medium">Payment Date</Label>
              <div className="relative mt-1">
                <Input
                  id="paymentDate"
                  placeholder="Select Date"
                  value={formData.paymentDate}
                  onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="invoiceNumber" className="text-sm font-medium">Invoice Number</Label>
              <Select onValueChange={(value) => handleInputChange('invoiceNumber', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Invoice no." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inv-001">INV-001</SelectItem>
                  <SelectItem value="inv-002">INV-002</SelectItem>
                  <SelectItem value="inv-003">INV-003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="flat" className="text-sm font-medium">Flat</Label>
              <Select onValueChange={(value) => handleInputChange('flat', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Flat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat-101">Flat 101</SelectItem>
                  <SelectItem value="flat-102">Flat 102</SelectItem>
                  <SelectItem value="flat-103">Flat 103</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentMode" className="text-sm font-medium">Payment Mode</Label>
              <Select onValueChange={(value) => handleInputChange('paymentMode', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transactionNumber" className="text-sm font-medium">Transaction / Cheque Number</Label>
              <Input
                id="transactionNumber"
                placeholder="Transaction Number"
                value={formData.transactionNumber}
                onChange={(e) => handleInputChange('transactionNumber', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="branchName" className="text-sm font-medium">Branch Name</Label>
              <Input
                id="branchName"
                placeholder="Branch Name"
                value={formData.branchName}
                onChange={(e) => handleInputChange('branchName', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="receiptDate" className="text-sm font-medium">Receipt Date</Label>
              <div className="relative mt-1">
                <Input
                  id="receiptDate"
                  placeholder="Select Date"
                  value={formData.receiptDate}
                  onChange={(e) => handleInputChange('receiptDate', e.target.value)}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="mt-1 h-24"
            />
          </div>
        </div>

        <div className="flex justify-center pb-4">
          <Button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
          >
            Submit
          </Button>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 flex justify-center">
          <div className="text-sm text-gray-600">
            Powered by <span className="font-semibold">LOCKATED</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
