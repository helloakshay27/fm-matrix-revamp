
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Plus, Edit, Eye, FileText } from 'lucide-react';
import { UtilityFilterDialog } from '../components/UtilityFilterDialog';

// Mock data for energy assets
const energyAssets = [
  {
    id: 1,
    assetName: 'Main Transformer',
    assetNo: 'TR-001',
    equipmentId: 'EQ-TR-001',
    location: 'Building A - Ground Floor',
    capacity: '1000 kVA',
    status: 'Active',
    lastReading: '450 kWh',
    readingDate: '2024-01-15'
  },
  {
    id: 2,
    assetName: 'Backup Generator',
    assetNo: 'GN-002',
    equipmentId: 'EQ-GN-002',
    location: 'Building B - Basement',
    capacity: '500 kW',
    status: 'Standby',
    lastReading: '120 kWh',
    readingDate: '2024-01-14'
  },
  {
    id: 3,
    assetName: 'UPS System',
    assetNo: 'UP-003',
    equipmentId: 'EQ-UP-003',
    location: 'Server Room',
    capacity: '100 kVA',
    status: 'Active',
    lastReading: '85 kWh',
    readingDate: '2024-01-15'
  }
];

export const UtilityDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const ResponsiveButton = ({ children, variant = "default", className = "", onClick, ...props }) => (
    <Button
      variant={variant}
      onClick={onClick}
      className={`
        // Desktop styling
        desktop:px-6 desktop:py-3 desktop:text-sm desktop:font-medium desktop:rounded-lg
        desktop:bg-white desktop:text-[#C72030] desktop:border desktop:border-[#C72030] 
        desktop:hover:bg-[#C72030] desktop:hover:text-white desktop:transition-colors desktop:duration-200
        desktop:shadow-sm desktop:min-w-[120px]
        
        // Tablet styling  
        tablet:px-4 tablet:py-2.5 tablet:text-sm tablet:rounded-md
        tablet:bg-[#C72030] tablet:text-white tablet:border-0
        tablet:hover:bg-[#A61B2A] tablet:transition-colors tablet:duration-200
        tablet:min-w-[100px]
        
        // Mobile styling
        mobile:px-3 mobile:py-2 mobile:text-xs mobile:rounded mobile:font-medium
        mobile:bg-[#8B3A8B] mobile:text-white mobile:border-0  
        mobile:hover:bg-[#7A2E7A] mobile:transition-colors mobile:duration-200
        mobile:min-w-[80px] mobile:text-center
        
        // Base responsive classes
        lg:px-6 lg:py-3 lg:text-sm lg:font-medium lg:rounded-lg
        lg:bg-white lg:text-[#C72030] lg:border lg:border-[#C72030] 
        lg:hover:bg-[#C72030] lg:hover:text-white lg:transition-colors lg:duration-200
        lg:shadow-sm lg:min-w-[120px]
        
        md:px-4 md:py-2.5 md:text-sm md:rounded-md
        md:bg-[#C72030] md:text-white md:border-0
        md:hover:bg-[#A61B2A] md:transition-colors md:duration-200
        md:min-w-[100px]
        
        sm:px-3 sm:py-2 sm:text-xs sm:rounded sm:font-medium
        sm:bg-[#8B3A8B] sm:text-white sm:border-0  
        sm:hover:bg-[#7A2E7A] sm:transition-colors sm:duration-200
        sm:min-w-[80px] sm:text-center
        
        // Default mobile-first approach
        px-3 py-2 text-xs rounded font-medium
        bg-[#8B3A8B] text-white border-0  
        hover:bg-[#7A2E7A] transition-colors duration-200
        min-w-[80px] text-center
        
        ${className}
      `}
      {...props}
    >
      {children}
    </Button>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Energy Asset List
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ENERGY ASSET LIST</h1>
        <ResponsiveButton className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add New Asset</span>
          <span className="sm:hidden">Add</span>
        </ResponsiveButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1a1a1a]">156</div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">142</div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">14</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Button */}
      <div className="flex justify-start">
        <ResponsiveButton 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </ResponsiveButton>
      </div>

      {/* Energy Assets Table */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-[#1a1a1a]">Asset Name</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Asset No.</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Equipment ID</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Location</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Capacity</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Last Reading</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {energyAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-gray-50">
                  <TableCell className="text-[#1a1a1a]">{asset.assetName}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{asset.assetNo}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{asset.equipmentId}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{asset.location}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{asset.capacity}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      asset.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {asset.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#1a1a1a]">
                    <div>
                      <div>{asset.lastReading}</div>
                      <div className="text-xs text-gray-500">{asset.readingDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ResponsiveButton 
                        variant="ghost" 
                        className="!p-2 !min-w-0 h-8 w-8"
                      >
                        <Eye className="w-4 h-4" />
                      </ResponsiveButton>
                      <ResponsiveButton 
                        variant="ghost" 
                        className="!p-2 !min-w-0 h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </ResponsiveButton>
                      <ResponsiveButton 
                        variant="ghost" 
                        className="!p-2 !min-w-0 h-8 w-8"
                      >
                        <FileText className="w-4 h-4" />
                      </ResponsiveButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <UtilityFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
};

export default UtilityDashboard;
