import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, X } from 'lucide-react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

interface OwnerCostTabProps {
  asset: Asset;
  assetId?: string | number;
  refreshAssetData?: () => void;
}

interface Asset {
  id: number;
  name: string;
  breakdown?: boolean;
  ownership_total_cost?: number;
  ownership_costs?: OwnershipCost[];
}

interface OwnershipCost {
  id: number;
  date: string;
  status: string;
  cost: number;
  warranty_in_month: number;
}

export const OwnerCostTab: React.FC<OwnerCostTabProps> = ({ asset, refreshAssetData }) => {
  const [isInUse, setIsInUse] = useState(!(asset?.breakdown ?? true));
  const [showModal, setShowModal] = useState(false);
  const [showAssetStatusModal, setShowAssetStatusModal] = useState(false);
  const totalCost = asset?.ownership_total_cost || 0;

  const [formData, setFormData] = useState({
    status: 'repaired',
    cost: '',
    warranty: '',
    reason: ''
  });

  const [assetStatusFormData, setAssetStatusFormData] = useState({
    status: 'repaired',
    cost: '',
    warranty: '',
    warrantyType: '',
    paymentStatus: '',
    comments: ''
  });

  const handleToggle = async () => {
    const newInUseState = !isInUse;
    setIsInUse(newInUseState);

    if (newInUseState) {
      setShowModal(true);
    } else {

      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/pms/assets/${asset?.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
          },
          body: JSON.stringify({
            pms_asset: { breakdown: "true", status: "breakdown" }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update breakdown status');
        }

        console.log('Breakdown status updated.');
        refreshAssetData();
        // window.location.reload();
      } catch (error) {
        console.error('Error updating breakdown status:', error);
        alert('Failed to update asset breakdown status.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmit = async () => {
    const payload = {
      asset_id: asset?.id ?? 123,
      replaced: formData.status === 'replaced',
      repaired: formData.status === 'repaired',
      cost: parseFloat(formData.cost) || 0,
      warranty_in_month: parseInt(formData.warranty) || 0,
      in_use_reason: formData.reason || ''
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/ownership_cost.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit ownership cost');
      }

      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error during update:', error);
      alert('Failed to submit or update asset. Please try again.');
    }
  };

  const handleAssetStatusInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssetStatusFormData({ ...assetStatusFormData, [name]: value });
  };

  const handleWarrantyTypeChange = (value: string) => {
    setAssetStatusFormData({ ...assetStatusFormData, warrantyType: value });
  };

  const handlePaymentStatusChange = (value: string) => {
    setAssetStatusFormData({ ...assetStatusFormData, paymentStatus: value });
  };

  const handleAssetStatusSubmit = () => {
    // For now, just close the modal - no integration
    console.log('Asset Status Form Data:', assetStatusFormData);
    setShowAssetStatusModal(false);
    // Reset form
    setAssetStatusFormData({
      status: 'repaired',
      cost: '',
      warranty: '',
      warrantyType: '',
      paymentStatus: '',
      comments: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="w-full bg-white rounded-lg shadow-sm border mt-3">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
              <CreditCard className="w-6 h-6" style={{ color: "#C72030" }} />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
              Owner Cost Details
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {isInUse ? 'IN USE' : 'BREAKDOWN'}
            </span>
            <Switch
              checked={isInUse}
              onCheckedChange={handleToggle}
            />
            <Button
              onClick={() => setShowAssetStatusModal(true)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white text-sm px-4 py-2"
            >
              Update Status
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] " >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-600 font-medium">Sr.no</TableHead>
                <TableHead className="text-gray-600 font-medium">Date</TableHead>
                <TableHead className="text-gray-600 font-medium">Repaired/Replaced</TableHead>
                <TableHead className="text-gray-600 font-medium">Cost</TableHead>
                <TableHead className="text-gray-600 font-medium">Warranty</TableHead>
                <TableHead className="text-gray-600 font-medium">Asset Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asset?.ownership_costs && asset.ownership_costs.length > 0 ? (
                asset.ownership_costs.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{localStorage.getItem('currency')}{item.cost}</TableCell>
                    <TableCell>{item.warranty_in_month} months</TableCell>
                    <TableCell>{asset.name || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400">
                    No owner cost data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Footer */}
          <div className="bg-gray-50 p-4 border-t text-right">
            <span className="text-lg font-semibold text-[#1A1A1A]">
              Total Cost: OMR {totalCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Asset Status Update
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Repaired / Replaced:</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={handleStatusChange}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="repaired" id="repaired" />
                  <Label htmlFor="repaired">Repaired</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="replaced" id="replaced" />
                  <Label htmlFor="replaced">Replaced</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="cost" className="text-sm font-medium">
                Cost (in OMR):
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 ">
                  OMR
                </span>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="Enter cost"
                  className="pl-20"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="warranty" className="text-sm font-medium">
                Warranty (in Months):
              </Label>
              <Input
                id="warranty"
                name="warranty"
                type="number"
                value={formData.warranty}
                onChange={handleInputChange}
                placeholder="Enter warranty period"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="reason" className="text-sm font-medium">
                Comments:
              </Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter reason"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSubmit}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Asset Status Update Modal */}
      <Dialog open={showAssetStatusModal} onOpenChange={setShowAssetStatusModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Asset Status Update
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAssetStatusModal(false)}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Repaired / Replaced:</Label>
              <div className="mt-2">
                <span className="text-sm text-gray-700">Repaired</span>
              </div>
            </div>

            <div>
              <Label htmlFor="asset-cost" className="text-sm font-medium">
                Cost (in OMR):
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  OMR
                </span>
                <Input
                  id="asset-cost"
                  name="cost"
                  type="number"
                  value={assetStatusFormData.cost}
                  onChange={handleAssetStatusInputChange}
                  placeholder="Enter cost"
                  className="pl-16"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="asset-warranty" className="text-sm font-medium">
                Warranty (in Months):
              </Label>
              <Input
                id="asset-warranty"
                name="warranty"
                type="number"
                value={assetStatusFormData.warranty}
                onChange={handleAssetStatusInputChange}
                placeholder="Enter warranty period"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Type of Warranty:
              </Label>
              <Select value={assetStatusFormData.warrantyType} onValueChange={handleWarrantyTypeChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select warranty type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fully">Fully</SelectItem>
                  <SelectItem value="partially">Partially</SelectItem>
                  <SelectItem value="no_claim">No Claim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Payment Status:
              </Label>
              <Select value={assetStatusFormData.paymentStatus} onValueChange={handlePaymentStatusChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="not_paid">Not Paid</SelectItem>
                  <SelectItem value="claimed">Claimed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="asset-comments" className="text-sm font-medium">
                Comments:
              </Label>
              <Textarea
                id="asset-comments"
                name="comments"
                value={assetStatusFormData.comments}
                onChange={handleAssetStatusInputChange}
                placeholder="Enter reason"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleAssetStatusSubmit}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
