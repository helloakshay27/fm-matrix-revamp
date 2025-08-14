
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TextField } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/StatusBadge';

interface Asset {
  area: string | null;
  assetGroup: string;
  assetNumber: string;
  asset_code?: string;
  assetSubGroup: string;
  assetType: string | null;
  building: string | null;
  id: number;
  name: string;
  pmsRoom: string | null;
  serialNumber: string;
  siteName: string;
  status: string;
  wing: string | null;
  purchase_cost?: string | number;
  current_book_value?: string | number;
  commisioning_date?: string;
  asset_number?: string;
  site_name?: string;
}

interface DisposalAssetTableProps {
  selectedAssets: Asset[];
  breakdown: { [key: string]: string };
  onBreakdownChange: (breakdown: string, assetId?: string) => void;
  soldValues: { [key: string]: string };
  onSoldValueChange: (value: string, assetId?: string) => void;
}

export const DisposalAssetTable: React.FC<DisposalAssetTableProps> = ({
  selectedAssets,
  breakdown,
  onBreakdownChange,
  soldValues,
  onSoldValueChange
}) => {
  console.log('selectedAssets:', selectedAssets)
  const breakdownOptions = [
    'Breakdown',
    'Maintenance Required',
    'Operational',
    'Under Repair',
    'Non-Functional'

  ];
  console.log(DisposalAssetTable)
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Asset Name</TableHead>
            <TableHead className="w-[20%]">Asset Number</TableHead>
            <TableHead className="w-[15%]">Asset Status</TableHead>
            <TableHead className="w-[12%]">Site</TableHead>
            <TableHead className="w-[13%]">Purchase Cost</TableHead>
            <TableHead className="w-[13%]">Current Book Value</TableHead>
            <TableHead className="w-[12%]">Sold Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedAssets.map((asset, index) => {
            // Debug: log each asset to check available keys
            console.log('asset row:', asset);
            // Asset number can be asset.assetNumber, asset.asset_number, or asset.asset_code
            const assetNumber = asset.assetNumber || asset.asset_number || asset.asset_code || '';
            const purchaseCost = asset.purchaseCost || asset.purchase_cost;
            const currentBookValue = asset.currentBookValue || asset.current_book_value;
            const siteName = asset.siteName || asset.site_name;
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{typeof asset.name === 'string' ? asset.name : ''}</TableCell>
                <TableCell>{typeof assetNumber === 'string' || typeof assetNumber === 'number' ? assetNumber : ''}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={asset.status || ''}
                    assetId={asset.id}
                  />
                </TableCell>
                <TableCell>{typeof siteName === 'string' ? siteName : ''}</TableCell>
                <TableCell>{typeof purchaseCost === 'string' || typeof purchaseCost === 'number' ? purchaseCost : 'NA'}</TableCell>
                <TableCell>{currentBookValue}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Enter Sold Value"
                    value={soldValues[asset.id] || ''}
                    onChange={(e) => onSoldValueChange(e.target.value, asset.id.toString())}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
