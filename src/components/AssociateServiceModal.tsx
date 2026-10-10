import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Asset {
  id: number;
  name: string;
  asset_tag: string;
}

interface AssociateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  assetGroupId: string; // 👈 new prop
}

export const AssociateServiceModal = ({ isOpen, onClose, serviceId, assetGroupId }: AssociateServiceModalProps) => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssetData = async () => {
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');


    if (!token) {
      toast.error('Missing token');
      return;
    }

    if (!assetGroupId) {
      // Silent skip: handled by effect toast
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/assets.json?q[pms_asset_group_id_eq]=${assetGroupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Debug: Log the response
      console.log('Asset API response:', response.data);

      // Fix: Set the correct array from the response
      const assetsArray = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.assets)
          ? response.data.assets
          : [];

      setAssets(assetsArray);
    } catch (error) {
      console.error('Failed to fetch asset data:', error);
  toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const handleAssociate = async () => {
    if (!selectedAsset) {
      toast.error('Please select an asset first');
      return;
    }

    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    if (!baseUrl || !token) {
      toast.error('Missing base URL or token');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `https://${baseUrl}/pms/services/${serviceId}/associate_services.json`,
        {
          associate: {
            asset_id: parseInt(selectedAsset),
            service_id: parseInt(serviceId),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Service associated successfully!', {
        position: 'bottom-center',
        icon: <Check size={16} />,
        className: 'service-association-toast',
      });
      onClose();
    } catch (error) {
      console.error('Failed to associate service:', error);
  toast.error('Failed to associate service');
    } finally {
      setLoading(false);
    }
  };

  const shownMissingGroupToast = useRef(false);
  useEffect(() => {
    if (!isOpen) return;
    if (!assetGroupId) {
      if (!shownMissingGroupToast.current) {
  toast('No asset group is associated with this service yet. Assign one before associating assets.');
        shownMissingGroupToast.current = true;
      }
      return;
    }
    fetchAssetData();
  }, [isOpen, assetGroupId]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth className="service-association-dialog">
      <div className="service-association-dialog-header">
        <DialogTitle className="service-association-dialog-title">
          Associate Services To Asset
        </DialogTitle>
        <IconButton onClick={onClose} size="small">
          <X style={{ width: '16px', height: '16px' }} />
        </IconButton>
      </div>

      <DialogContent className="service-association-dialog-content">
        <div className="service-association-asset-field-wrap">
          <FormControl className="service-association-asset-control" fullWidth variant="outlined" disabled={loading || !assetGroupId}>
            <InputLabel id="asset-select-label" shrink>Asset</InputLabel>
            <MuiSelect
              labelId="asset-select-label"
              label="Asset"
              displayEmpty
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              <MenuItem value=""><em>Select Asset</em></MenuItem>
              {assets.map((asset) => (
                <MenuItem key={asset.id} value={asset.id}>
                  {asset.asset_tag ? `${asset.asset_tag} - ${asset.name}` : asset.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
          {loading && (
            <div className="flex justify-center mt-2">
              <CircularProgress size={20} />
            </div>
          )}
          {!loading && !assetGroupId && (
            <div className="text-xs text-gray-600 mt-2">
              Asset group not available. Close this dialog and assign a group to the service, then retry.
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleAssociate}
            className="service-association-submit"
            disabled={loading || !assetGroupId}
          >
            Associate Service
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
