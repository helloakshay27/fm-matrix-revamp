
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Plus, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { UtilityFilterDialog } from '@/components/UtilityFilterDialog';

interface EnergyAsset {
  id: string;
  assetName: string;
  assetCode: string;
  group: string;
  subGroup: string;
  location: string;
  status: string;
  lastReading: string;
  readingDate: string;
}

export const UtilityDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [energyAssets] = useState<EnergyAsset[]>([
    {
      id: '202068',
      assetName: 'DIESEL GENERATOR',
      assetCode: 'a95ae876f09cde4b4afb',
      group: 'Electrical System',
      subGroup: 'DG Set',
      location: 'Tower 101 - A Wing - Common',
      status: 'Active',
      lastReading: '1250.5',
      readingDate: '15/06/2025'
    },
    {
      id: '202069',
      assetName: 'MAIN TRANSFORMER',
      assetCode: 'b85ae876f09cde4b4afc',
      group: 'Electrical System',
      subGroup: 'Transformer',
      location: 'Tower 101 - B Wing - Basement',
      status: 'Active',
      lastReading: '2890.2',
      readingDate: '15/06/2025'
    },
    {
      id: '202070',
      assetName: 'UPS SYSTEM',
      assetCode: 'c95ae876f09cde4b4afd',
      group: 'Electrical System',
      subGroup: 'UPS',
      location: 'Tower 101 - A Wing - Ground Floor',
      status: 'Active',
      lastReading: '456.8',
      readingDate: '14/06/2025'
    }
  ]);

  const stats = [
    { title: 'Total Energy Assets', value: '25', color: 'bg-blue-500' },
    { title: 'Active Assets', value: '23', color: 'bg-green-500' },
    { title: 'Inactive Assets', value: '2', color: 'bg-red-500' },
    { title: 'Under Maintenance', value: '3', color: 'bg-yellow-500' }
  ];

  const handleEyeClick = (asset: EnergyAsset) => {
    navigate(`/utility/energy/details/${asset.id}`);
  };

  const handleAddAsset = () => {
    navigate('/utility/energy/add-asset');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Utility &gt; Energy</div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">ENERGY DASHBOARD</h1>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsFilterOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button 
                onClick={handleAddAsset}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} text-white rounded-lg p-3 mr-4`}>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Energy Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Energy Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Sub Group</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Reading</TableHead>
                  <TableHead>Reading Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {energyAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-1"
                        onClick={() => handleEyeClick(asset)}
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-blue-600">{asset.id}</TableCell>
                    <TableCell className="font-medium">{asset.assetName}</TableCell>
                    <TableCell>{asset.assetCode}</TableCell>
                    <TableCell>{asset.group}</TableCell>
                    <TableCell>{asset.subGroup}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        asset.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {asset.status}
                      </span>
                    </TableCell>
                    <TableCell>{asset.lastReading}</TableCell>
                    <TableCell>{asset.readingDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <UtilityFilterDialog 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)} 
        />
      </div>
    </div>
  );
};
