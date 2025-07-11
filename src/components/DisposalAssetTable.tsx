
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

interface DisposalAssetTableProps {
  selectedAssets: string[];
  breakdown: string;
  onBreakdownChange: (breakdown: string) => void;
  soldValue: string;
  onSoldValueChange: (value: string) => void;
}

export const DisposalAssetTable: React.FC<DisposalAssetTableProps> = ({
  selectedAssets,
  breakdown,
  onBreakdownChange,
  soldValue,
  onSoldValueChange
}) => {
  // Mock data for the selected assets table
  const mockAssets = [
    {
      name: 'sdcsdc',
      code: '#02e0d956a50e6203182a',
      status: 'Disposed',
      site: 'Lockated',
      purchaseCost: 'NA',
      currentBookValue: 'NA',
      soldValue: ''
    }
  ];

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
          {mockAssets.map((asset, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell>{asset.code}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 h-9 px-3 justify-between min-w-[120px]"
                    >
                      {breakdown}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[120px] bg-white border shadow-md">
                    {breakdownOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => onBreakdownChange(option)}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>{asset.site}</TableCell>
              <TableCell>{asset.purchaseCost}</TableCell>
              <TableCell>{asset.currentBookValue}</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Enter Sold Value"
                  value={soldValue}
                  onChange={(e) => onSoldValueChange(e.target.value)}
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
