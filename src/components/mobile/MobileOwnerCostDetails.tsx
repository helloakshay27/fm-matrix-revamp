import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, X, ChevronLeft } from 'lucide-react';
import { baseClient } from '@/utils/withoutTokenBase';

interface MobileOwnerCostDetailsProps {
  asset: Asset;
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
  cost: number | null;
  warranty_in_month: number | null;
  warranty_type?: string | null;
  payment_status?: string | null;
}

// Mobile Owner Cost API Service
const mobileOwnerCostApiService = {
  async updateAssetBreakdownStatus(token: string, assetId: number): Promise<void> {
    try {
      const url = `/pms/assets/${assetId}.json`;
      
      console.log("🔄 UPDATING ASSET BREAKDOWN STATUS:");
      console.log("  - URL:", url);
      console.log("  - Asset ID:", assetId);

      await baseClient.put(
        url,
        {
          pms_asset: { breakdown: "true", status: "breakdown" }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Asset breakdown status updated successfully");
    } catch (error) {
      console.error("❌ Error updating asset breakdown status:", error);
      throw error;
    }
  },

  async createOwnershipCost(token: string, payload: {
    asset_id: number;
    replaced: boolean;
    repaired: boolean;
  cost: number;
  warranty_in_month: number;
    warranty_type: string;
    payment_status: string;
    in_use_reason: string;
  }): Promise<void> {
    try {
      const url = `/pms/ownership_cost.json`;
      
      console.log("💾 CREATING OWNERSHIP COST:");
      console.log("  - URL:", url);
      console.log("  - Payload:", payload);

      await baseClient.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Ownership cost created successfully");
    } catch (error) {
      console.error("❌ Error creating ownership cost:", error);
      throw error;
    }
  },

  async createAssetOwnershipCost(token: string, assetId: number, payload: {
    id: number;
    date: string;
    warranty_in_month: string;
    in_use_reason: string;
    payment_status: string;
    warranty_type: string;
    cost: string;
    repaired: boolean;
  }): Promise<void> {
    try {
      const url = `/pms/assets/create_ownership_cost?id=${assetId}`;
      
      console.log("💾 CREATING ASSET OWNERSHIP COST:");
      console.log("  - URL:", url);
      console.log("  - Asset ID:", assetId);
      console.log("  - Payload:", payload);

      await baseClient.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Asset ownership cost created successfully");
    } catch (error) {
      console.error("❌ Error creating asset ownership cost:", error);
      throw error;
    }
  },
};

export const MobileOwnerCostDetails: React.FC<MobileOwnerCostDetailsProps> = ({ asset, refreshAssetData }) => {
  const navigate = useNavigate();
  const [isInUse, setIsInUse] = useState(!(asset?.breakdown ?? true));
  const [showModal, setShowModal] = useState(false);
  const [showAssetStatusModal, setShowAssetStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalCost = asset?.ownership_total_cost || 0;
  
  // Get currency and calculate padding based on length
  const currency = localStorage.getItem('currency') || '₹';
  const currencyLength = currency.length;
  // Calculate padding: 12px base + 8px per character (minimum 48px for 1 char, more for longer)
  const costInputPadding = currencyLength <= 1 ? 'pl-12' : currencyLength === 2 ? 'pl-14' : 'pl-16';

  // Debug: Log asset data to check ownership_costs
  useEffect(() => {
    console.log('Asset data:', asset);
    console.log('Ownership costs:', asset?.ownership_costs);
    console.log('Ownership costs length:', asset?.ownership_costs?.length);
  }, [asset]);

  const [formData, setFormData] = useState({
    status: 'repaired',
    cost: '',
    warranty: '',
    warrantyType: '',
    paymentStatus: '',
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
        setLoading(true);
        const token = sessionStorage.getItem('mobile_token') || sessionStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token available');
        }

        if (!asset?.id) {
          throw new Error('Asset ID is missing');
        }

        await mobileOwnerCostApiService.updateAssetBreakdownStatus(token, asset.id);

        if (refreshAssetData) {
          refreshAssetData();
        }
      } catch (error) {
        console.error('Error updating breakdown status:', error);
        alert('Failed to update asset breakdown status.');
        setIsInUse(!newInUseState); // Revert on error
      } finally {
        setLoading(false);
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

  const handleWarrantyTypeChangeModal = (value: string) => {
    setFormData({ ...formData, warrantyType: value });
  };

  const handlePaymentStatusChangeModal = (value: string) => {
    setFormData({ ...formData, paymentStatus: value });
  };

  const handleSubmit = async () => {
    const token = sessionStorage.getItem('mobile_token') || sessionStorage.getItem('token');
    
    if (!token) {
      alert('No authentication token available');
      return;
    }

    if (!asset?.id) {
      alert('Asset ID is missing');
      return;
    }

    const payload = {
      asset_id: asset.id,
      replaced: formData.status === 'replaced',
      repaired: formData.status === 'repaired',
      cost: parseFloat(formData.cost) || 0,
      warranty_in_month: parseInt(formData.warranty) || 0,
      warranty_type: formData.warrantyType || '',
      payment_status: formData.paymentStatus || '',
      in_use_reason: formData.reason || ''
    };

    try {
      setLoading(true);
      await mobileOwnerCostApiService.createOwnershipCost(token, payload);

      setShowModal(false);
      setFormData({
        status: 'repaired',
        cost: '',
        warranty: '',
        warrantyType: '',
        paymentStatus: '',
        reason: ''
      });
      if (refreshAssetData) {
        refreshAssetData();
      }
      alert('Asset status updated successfully!');
    } catch (error) {
      console.error('Error during update:', error);
      alert('Failed to submit or update asset. Please try again.');
      setIsInUse(!isInUse); // Revert toggle on error
    } finally {
      setLoading(false);
    }
  };

  const handleAssetStatusInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssetStatusFormData({ ...assetStatusFormData, [name]: value });
  };

  const handleWarrantyTypeChange = (value: string) => {
    setAssetStatusFormData({ ...assetStatusFormData, warrantyType: value });
  };

  const handleAssetStatusChange = (value: string) => {
    setAssetStatusFormData({ ...assetStatusFormData, status: value });
  };

  const handlePaymentStatusChange = (value: string) => {
    setAssetStatusFormData({ ...assetStatusFormData, paymentStatus: value });
  };

  const handleAssetStatusSubmit = async () => {
    const token = sessionStorage.getItem('mobile_token') || sessionStorage.getItem('token');
    
    if (!token) {
      alert('No authentication token available');
      return;
    }

    if (!asset?.id) {
      alert('Asset ID is missing');
      return;
    }

    try {
      setLoading(true);
      const currentDate = new Date().toISOString().split('T')[0];

      const payload = {
        id: asset.id,
        date: currentDate,
        warranty_in_month: assetStatusFormData.warranty || "0",
        in_use_reason: assetStatusFormData.comments || "",
        payment_status: assetStatusFormData.paymentStatus || "",
        warranty_type: assetStatusFormData.warrantyType || "",
        cost: assetStatusFormData.cost || "0",
        repaired: assetStatusFormData.status === 'repaired',
      };

      await mobileOwnerCostApiService.createAssetOwnershipCost(token, asset.id, payload);

      setShowAssetStatusModal(false);
      setAssetStatusFormData({
        status: 'repaired',
        cost: '',
        warranty: '',
        warrantyType: '',
        paymentStatus: '',
        comments: ''
      });

      if (refreshAssetData) {
        refreshAssetData();
      }

      alert('Ownership cost added successfully!');
    } catch (error) {
      console.error('Error creating ownership cost:', error);
      alert('Failed to create ownership cost. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">
            Owner Cost
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-20">
        {/* Asset Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{asset?.name || 'Asset'}</h2>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                <CreditCard className="w-5 h-5" style={{ color: "#C72030" }} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {isInUse ? 'IN USE' : 'BREAKDOWN'}
              </span>
            </div>
            <Switch
              checked={isInUse}
              onCheckedChange={handleToggle}
              disabled={loading}
            />
          </div>

          {/* Total Cost */}
          <div className="p-3 bg-[#FFF3F3] border border-[#FFE5E5] rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-1">Total Cost</p>
            <p className="text-2xl font-bold text-[#C72030]">
              {localStorage.getItem('currency') || '₹'}{totalCost.toLocaleString()}
            </p>
          </div>

          {/* Add Cost Button */}
          <Button
            onClick={() => setShowAssetStatusModal(true)}
            className="w-full bg-[#C72030] hover:bg-[#C72030]/90 text-white font-medium py-6 mb-4"
          >
            + Add Cost
          </Button>
        </div>

        {/* Ownership Costs List */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Cost History</h3>
          {asset?.ownership_costs && Array.isArray(asset.ownership_costs) && asset.ownership_costs.length > 0 ? (
            <div className="space-y-3">
              {asset.ownership_costs.map((item, index) => (
                <div key={item.id || index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">#{index + 1}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.date || 'N/A'}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {item.status || 'N/A'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Cost</p>
                      <p className="font-semibold text-gray-900">
                        {item.cost !== null && item.cost !== undefined 
                          ? `${localStorage.getItem('currency') || '₹'}${item.cost.toLocaleString()}`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Warranty</p>
                      <p className="font-semibold text-gray-900">
                        {item.warranty_in_month !== null && item.warranty_in_month !== undefined 
                          ? `${item.warranty_in_month} mo`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Type</p>
                      <p className="font-semibold text-gray-900 text-xs">
                        {(item.warranty_type || "N/A").toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Payment</p>
                      <p className="font-semibold text-gray-900 text-xs">
                        {(item.payment_status || "N/A").replace(/_/g, ' ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-gray-500 text-sm">No cost history available</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Status Update Modal (when toggling to IN USE) */}
      <Dialog 
        open={showModal} 
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            // Revert toggle state if modal is closed without submitting
            setIsInUse(!isInUse);
          }
        }}
      >
        <DialogContent className="max-w-sm rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Asset Status Update
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowModal(false);
                  setIsInUse(!isInUse);
                }}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label className="text-sm font-medium">Repaired:</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={handleStatusChange}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="repaired" id="mobile-repaired" />
                  <Label htmlFor="mobile-repaired" className="font-normal">Repaired</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="mobile-cost" className="text-sm font-medium">
                Cost (in {currency}):
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium z-10 pointer-events-none">
                  {currency}
                </span>
                <Input
                  id="mobile-cost"
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={costInputPadding}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mobile-warranty" className="text-sm font-medium">
                Warranty (months):
              </Label>
              <Input
                id="mobile-warranty"
                name="warranty"
                type="number"
                value={formData.warranty}
                onChange={handleInputChange}
                placeholder="Enter warranty period"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Warranty Type:</Label>
              <Select value={formData.warrantyType} onValueChange={handleWarrantyTypeChangeModal}>
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
              <Label className="text-sm font-medium">Payment Status:</Label>
              <Select value={formData.paymentStatus} onValueChange={handlePaymentStatusChangeModal}>
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
              <Label htmlFor="mobile-reason" className="text-sm font-medium">
                Comments:
              </Label>
              <Textarea
                id="mobile-reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter reason"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  setShowModal(false);
                  setIsInUse(!isInUse);
                }}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ownership Cost Modal (for + Add Cost button) */}
      <Dialog open={showAssetStatusModal} onOpenChange={setShowAssetStatusModal}>
        <DialogContent className="max-w-sm rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Ownership Cost
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

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label className="text-sm font-medium">Repaired:</Label>
              <RadioGroup
                value={assetStatusFormData.status}
                onValueChange={handleAssetStatusChange}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="repaired" id="mobile-asset-repaired" />
                  <Label htmlFor="mobile-asset-repaired" className="font-normal">Repaired</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="mobile-asset-cost" className="text-sm font-medium">
                Cost (in {currency}):
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium z-10 pointer-events-none">
                  {currency}
                </span>
                <Input
                  id="mobile-asset-cost"
                  name="cost"
                  type="number"
                  value={assetStatusFormData.cost}
                  onChange={handleAssetStatusInputChange}
                  placeholder="0"
                  className={costInputPadding}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mobile-asset-warranty" className="text-sm font-medium">
                Warranty (months):
              </Label>
              <Input
                id="mobile-asset-warranty"
                name="warranty"
                type="number"
                value={assetStatusFormData.warranty}
                onChange={handleAssetStatusInputChange}
                placeholder="Enter warranty period"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Warranty Type:</Label>
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
              <Label className="text-sm font-medium">Payment Status:</Label>
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
              <Label htmlFor="mobile-asset-comments" className="text-sm font-medium">
                Comments:
              </Label>
              <Textarea
                id="mobile-asset-comments"
                name="comments"
                value={assetStatusFormData.comments}
                onChange={handleAssetStatusInputChange}
                placeholder="Enter reason"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowAssetStatusModal(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssetStatusSubmit}
                className="flex-1 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
