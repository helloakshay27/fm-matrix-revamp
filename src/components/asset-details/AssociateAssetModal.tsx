import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
// import { apiClient } from '../../lib/apiClient';
import apiClient from '@/utils/apiClient';


interface AssociateAssetModalProps {
  show: boolean;
  onClose: () => void;
  assetId: number | null;
  assetName: string;
  pmsSiteId: string | number;
  assetGroupId: string | number;
  fetchData: () => void;
}

interface Asset {
  id: number;
  name: string;
  asset_number: string;
}

export const AssociateAssetModal: React.FC<AssociateAssetModalProps> = ({
  show,
  onClose,
  assetId,
  assetName,
  pmsSiteId,
  assetGroupId,
  fetchData,
}) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAssets = async () => {
    if (!show) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get('pms/assets.json?q[pms_asset_group_id_eq]=' + assetGroupId, {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 30000, // 30 seconds timeout
      });
      setAssets(response.data.assets || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssociate = async () => {
    if (!selectedAssetId || !assetId) return;

    setSubmitting(true);
    try {
      const response = await apiClient.post(
        'pms/assets/associate.json',
        {
          parent_asset_id: assetId,
          child_asset_id: selectedAssetId,
        },
        {
          headers: { 
            "Content-Type": "application/json"
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      if (response.status >= 200 && response.status < 300) {
        fetchData(); // Refresh the association data
        onClose();
        setSelectedAssetId(null);
      } else {
        console.error('Failed to associate asset');
      }
    } catch (error) {
      console.error('Error associating asset:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [show, pmsSiteId, assetGroupId]);

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Associate Asset with {assetName}
          </DialogTitle>
          <button 
            onClick={onClose} 
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Asset to Associate
            </label>
            {loading ? (
              <div className="text-center py-4">Loading assets...</div>
            ) : (
              <select
                value={selectedAssetId || ''}
                onChange={(e) => setSelectedAssetId(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select an asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.asset_number})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssociate}
            disabled={!selectedAssetId || submitting}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700"
          >
            {submitting ? 'Associating...' : 'Associate'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
