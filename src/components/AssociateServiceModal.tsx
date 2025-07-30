import React, { useState, useEffect } from 'react';
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
import { X } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssetData = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      toast({
        title: "Error",
        description: "Missing token",
        variant: "destructive",
      });
      return;
    }
  
    if (!assetGroupId) {
      toast({
        title: "Error",
        description: "Missing asset group ID",
        variant: "destructive",
      });
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.get(
        `https://fm-uat-api.lockated.com/pms/assets.json?q[pms_asset_group_id_eq]=${assetGroupId}`,
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
      toast({
        title: "Error",
        description: "Failed to fetch assets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAssociate = async () => {
    if (!selectedAsset) {
      toast({
        title: "Error",
        description: "Please select an asset first",
        variant: "destructive",
      });
      return;
    }

    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    if (!baseUrl || !token) {
      toast({
        title: "Error",
        description: "Missing base URL or token",
        variant: "destructive",
      });
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

      toast({
        title: "Success",
        description: "Service associated successfully!",
      });
      onClose();
    } catch (error) {
      console.error('Failed to associate service:', error);
      toast({
        title: "Error",
        description: "Failed to associate service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssetData();
    }
  }, [isOpen]);

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
    '& .MuiInputBase-root': {
      '& .MuiSelect-select': {
        fontSize: { xs: '11px', sm: '12px', md: '13px' },
      },
    },
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="flex items-center justify-between px-6 pt-4">
        <DialogTitle style={{ padding: 0, fontSize: '1.2rem', fontWeight: 600 }}>
          Associate Services To Asset
        </DialogTitle>
        <IconButton onClick={onClose} size="small">
          <X style={{ width: '16px', height: '16px' }} />
        </IconButton>
      </div>

      <DialogContent style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <FormControl fullWidth variant="outlined" disabled={loading}>
            <InputLabel id="asset-select-label" shrink>Asset</InputLabel>
            <MuiSelect
              labelId="asset-select-label"
              label="Asset"
              displayEmpty
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              sx={fieldStyles}
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
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={handleAssociate}
            className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8"
            disabled={loading}
          >
            Associate Service
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
