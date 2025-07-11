
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AttachmentsSection } from './AttachmentsSection';
import { ResponsiveDatePicker } from '@/components/ui/responsive-date-picker';
import { X, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DisposeAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: string[];
}

export const DisposeAssetDialog: React.FC<DisposeAssetDialogProps> = ({
  isOpen,
  onClose,
  selectedAssets
}) => {
  const [disposeDate, setDisposeDate] = useState<Date>();
  const [disposeReason, setDisposeReason] = useState('');
  const [handedOverTo, setHandedOverTo] = useState('vendor');
  const [vendor, setVendor] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    console.log('Dispose Asset submitted:', {
      disposeDate,
      disposeReason,
      handedOverTo,
      vendor,
      comments,
      selectedAssets
    });
    onClose();
  };

  // Mock data for the selected assets table
  const mockAssets = [
    {
      name: 'Dell Laptop',
      code: '#3423',
      status: 'Breakdown',
      site: 'Haven Infoline',
      purchaseCost: '₹ 1,00,000',
      currentBookValue: '₹ 20,000',
      soldValue: '₹'
    },
    {
      name: 'Computer Table',
      code: '#1233',
      status: 'Breakdown',
      site: 'Haven Infoline',
      purchaseCost: '₹ 1,00,000',
      currentBookValue: '₹ 20,000',
      soldValue: '₹'
    }
  ];

  const disposeReasons = [
    'End of Life',
    'Damage Beyond Repair',
    'Obsolete Technology',
    'Cost of Repair Exceeds Value',
    'Safety Concerns',
    'Other'
  ];

  const vendors = [
    'ABC Disposal Services',
    'Green Recycling Co.',
    'Tech Waste Solutions',
    'EcoFriendly Disposal',
    'Secure Asset Disposal'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900 uppercase">
            DISPOSE ASSET
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-none hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Assets Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Asset Name</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Asset Code</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Asset Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Site</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Purchase Cost</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Current Book Value</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Sold Value</th>
                </tr>
              </thead>
              <tbody>
                {mockAssets.map((asset, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-2">{asset.name}</td>
                    <td className="py-3 px-2">{asset.code}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <span className="bg-red-500 text-white px-3 py-1 text-sm rounded">
                          {asset.status}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                      </div>
                    </td>
                    <td className="py-3 px-2">{asset.site}</td>
                    <td className="py-3 px-2">{asset.purchaseCost}</td>
                    <td className="py-3 px-2">{asset.currentBookValue}</td>
                    <td className="py-3 px-2">{asset.soldValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dispose Date */}
            <div className="space-y-2">
              <Label htmlFor="dispose-date" className="text-sm font-medium text-gray-700">
                Dispose Date
              </Label>
              <ResponsiveDatePicker
                value={disposeDate}
                onChange={setDisposeDate}
                placeholder="Select Date"
                className="w-full"
              />
            </div>

            {/* Dispose Reason */}
            <div className="space-y-2">
              <Label htmlFor="dispose-reason" className="text-sm font-medium text-gray-700">
                Dispose Reason <span className="text-red-500">*</span>
              </Label>
              <Select value={disposeReason} onValueChange={setDisposeReason}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Reason" />
                </SelectTrigger>
                <SelectContent>
                  {disposeReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Handed Over To */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Handed Over To
            </Label>
            <RadioGroup
              value={handedOverTo}
              onValueChange={setHandedOverTo}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendor" id="vendor" />
                <Label htmlFor="vendor" className="text-sm">Vendor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user" />
                <Label htmlFor="user" className="text-sm">User</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Vendor Selection */}
          <div className="space-y-2">
            <Label htmlFor="vendor-select" className="text-sm font-medium text-gray-700">
              Vendor <span className="text-red-500">*</span>
            </Label>
            <Select value={vendor} onValueChange={setVendor}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendorName) => (
                  <SelectItem key={vendorName} value={vendorName}>
                    {vendorName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium text-gray-700">
              Comments
            </Label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Type a comment.."
              className="w-full p-3 border border-gray-300 rounded-none resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Attachments */}
          <AttachmentsSection />

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSubmit}
              className="bg-blue-900 hover:bg-blue-800 text-white px-12 py-3 text-sm font-medium uppercase tracking-wide"
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
