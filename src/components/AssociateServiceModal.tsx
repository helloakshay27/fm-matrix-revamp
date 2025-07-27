import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Asset {
  id: number;
  name: string;
  asset_tag: string;
}

interface AssociateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
}

export const AssociateServiceModal = ({ isOpen, onClose, serviceId }: AssociateServiceModalProps) => {
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssetData = async () => {
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

    setLoading(true);
    try {
      const response = await axios.get(`https://${baseUrl}/pms/assets/get_assets.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssets(response.data || []);
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
      '& .MuiMenuItem-root': {
        fontSize: { xs: '11px', sm: '12px', md: '13px' },
      },
    },
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px 0' }}>
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

        <div style={{ display: 'flex', justifyContent: 'center' }}>
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