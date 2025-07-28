
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateScheduleModal = ({ isOpen, onClose, onSubmit }: CreateScheduleModalProps) => {
  const [formData, setFormData] = useState({
    flat: '',
    category: '',
    subCategory: '',
    scheduleDate: '',
    paymentMethod: ''
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
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-semibold">Create Schedule</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="flat" className="text-sm font-medium">Select Flat</Label>
              <Select onValueChange={(value) => handleInputChange('flat', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a-101">A-101</SelectItem>
                  <SelectItem value="a-102">A-102</SelectItem>
                  <SelectItem value="a-103">A-103</SelectItem>
                  <SelectItem value="a-104">A-104</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">Select Category</Label>
              <Select onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pest-control">Pest Control</SelectItem>
                  <SelectItem value="deep-cleaning">Deep Cleaning</SelectItem>
                  <SelectItem value="civil-mason">Civil & Mason Works</SelectItem>
                  <SelectItem value="invisible-grill">Invisible Grill</SelectItem>
                  <SelectItem value="mosquito-mesh">Mosquito Mesh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subCategory" className="text-sm font-medium">Select Sub Category</Label>
            <Select onValueChange={(value) => handleInputChange('subCategory', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard-cockroach">Standard Cockroach Control</SelectItem>
                <SelectItem value="4d-cockroach">4D Cockroach Control</SelectItem>
                <SelectItem value="bathroom-cleaning">Bathroom Cleaning</SelectItem>
                <SelectItem value="sofa-cleaning">Sofa Cleaning</SelectItem>
                <SelectItem value="grouting-tiles">Grouting Of Tiles</SelectItem>
                <SelectItem value="residential-apartment">Residential Apartment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900 block mb-2">Schedule Visit</Label>
            <div>
              <Label htmlFor="scheduleDate" className="text-sm font-medium">Select Date</Label>
              <Input
                id="scheduleDate"
                type="date"
                value={formData.scheduleDate}
                onChange={(e) => handleInputChange('scheduleDate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod" className="text-sm font-medium">Select Payment method</Label>
            <Select onValueChange={(value) => handleInputChange('paymentMethod', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Card" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
            <strong>Disclaimer:</strong> The Services include the provision of the Platform that enables you to arrange and
            schedule different home-based services with independent third-party service provider of those
            services ("Service Professionals").
          </div>

          <div className="flex justify-center pt-2">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              Pay {localStorage.getItem('currency')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
