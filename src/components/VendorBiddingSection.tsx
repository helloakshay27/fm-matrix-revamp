
import React from 'react';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface VendorBid {
  vendor_name: string;
  bidding_cost: string;
}

interface VendorBiddingSectionProps {
  vendorBids: VendorBid[];
  onVendorBidsChange: (bids: VendorBid[]) => void;
}

export const VendorBiddingSection: React.FC<VendorBiddingSectionProps> = ({
  vendorBids,
  onVendorBidsChange
}) => {

  const addVendorBid = () => {
    const newBids = [...vendorBids, { vendor_name: '', bidding_cost: '' }];
    onVendorBidsChange(newBids);
  };

  const removeVendorBid = (index: number) => {
    const newBids = vendorBids.filter((_, i) => i !== index);
    onVendorBidsChange(newBids);
  };


  const updateVendorBid = (index: number, field: keyof VendorBid, value: string) => {
    const newBids = vendorBids.map((bid, i) =>
      i === index ? { ...bid, [field]: value } : bid
    );
    onVendorBidsChange(newBids);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Vendor Bidding</h3>

      {vendorBids.map((bid, index) => (
        <div key={index} className="flex items-end gap-4">
          <div className="flex-1">
            <TextField
              label="Vendor Name"
              value={typeof bid.vendor_name === 'string' ? bid.vendor_name : ''}
              onChange={(e) => updateVendorBid(index, 'vendor_name', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
          <div className="flex-1">
            <TextField
             label={`Bidding Cost ${localStorage.getItem('currency')}`}
              value={typeof bid.bidding_cost === 'string' || typeof bid.bidding_cost === 'number' ? bid.bidding_cost : ''}
              onChange={(e) => updateVendorBid(index, 'bidding_cost', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              type="number"
            />
          </div>
          <div className="flex gap-2">
            {index === vendorBids.length - 1 && (
              <Button
                type="button"
                size="icon"
                onClick={addVendorBid}
                className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {vendorBids.length > 1 && (
              <Button
                type="button"
                size="icon"
                onClick={() => removeVendorBid(index)}
                className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};