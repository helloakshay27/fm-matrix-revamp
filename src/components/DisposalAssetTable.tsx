
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

interface Asset{
  area: string|null;
  assetGroup:string;
  assetNumber:string;
  asset_code?: string;
  assetSubGroup:string;
  assetType:string|null;
  building: string|null;
  id:number;
  name:string;
  pmsRoom:string|null;
  serialNumber:string;
  siteName:string;
  status:string;
  wing:string|null;
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

  const breakdownOptions = [
    'Breakdown',
    'Maintenance Required',
    'Operational',
    'Under Repair',
    'Non-Functional'
  ];

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Asset Name</TableHead>
            <TableHead className="w-[20%]">Asset Code</TableHead>
            <TableHead className="w-[15%]">Asset Status</TableHead>
            <TableHead className="w-[12%]">Site</TableHead>
            <TableHead className="w-[13%]">Purchase Cost</TableHead>
            <TableHead className="w-[13%]">Current Book Value</TableHead>
            <TableHead className="w-[12%]">Sold Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedAssets.map((asset, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{typeof asset.name === 'string' ? asset.name : ''}</TableCell>
              <TableCell>{typeof asset.assetNumber === 'string' || typeof asset.assetNumber === 'number' ? asset.assetNumber : ''}</TableCell>
              <TableCell>
                <StatusBadge 
                  status={asset.status || ''} 
                  assetId={asset.id}
                />
              </TableCell>
              <TableCell>{typeof asset.siteName === 'string' ? asset.siteName : ''}</TableCell>
              <TableCell>{typeof asset.purchase_cost === 'string' || typeof asset.purchase_cost === 'number' ? asset.purchase_cost : 'NA'}</TableCell>
              <TableCell>{asset.current_book_value }</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
