
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { VendorBiddingSection } from './VendorBiddingSection';

interface VendorBid {
  vendorName: string;
  biddingCost: string;
}

interface HandedOverToSectionProps {
  handedOverTo: string;
  onHandedOverToChange: (value: string) => void;
  vendor: string;
  onVendorChange: (vendor: string) => void;
  vendorBids: VendorBid[];
  onVendorBidsChange: (bids: VendorBid[]) => void;
}

export const HandedOverToSection: React.FC<HandedOverToSectionProps> = ({
  handedOverTo,
  onHandedOverToChange,
  vendor,
  onVendorChange,
  vendorBids,
  onVendorBidsChange
}) => {
  const vendors = [
    'ABC Disposal Services',
    'Green Recycling Co.',
    'Tech Waste Solutions',
    'EcoFriendly Disposal',
    'Secure Asset Disposal'
  ];

  return (
    <>
      {/* Handed Over To */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Handed Over To
        </Label>
        <RadioGroup
          value={handedOverTo}
          onValueChange={onHandedOverToChange}
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
        <FormControl className="max-w-sm">
          <InputLabel shrink>Vendor *</InputLabel>
          <Select
            value={vendor}
            onChange={(e) => onVendorChange(e.target.value)}
            label="Vendor *"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Vendor
            </MenuItem>
            {vendors.map((vendorName) => (
              <MenuItem key={vendorName} value={vendorName}>
                {vendorName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Vendor Bidding Section */}
      <VendorBiddingSection
        vendorBids={vendorBids}
        onVendorBidsChange={onVendorBidsChange}
      />
    </>
  );
};
