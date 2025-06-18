
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Edit, Download, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UtilityDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const energyAssets = [
    {
      id: 'EA001',
      assetName: 'Main Electric Panel',
      assetNo: 'MEP-001',
      location: 'Building A - Floor 1',
      capacity: '500 KW',
      status: 'Active',
      lastReading: '2,450 kWh',
      lastReadingDate: '2024-01-15'
    },
    {
      id: 'EA002',
      assetName: 'Generator Unit 1',
      assetNo: 'GEN-001',
      location: 'Building B - Basement',
      capacity: '250 KW',
      status: 'Standby',
      lastReading: '1,200 kWh',
      lastReadingDate: '2024-01-14'
    },
    {
      id: 'EA003',
      assetName: 'Solar Panel Array',
      assetNo: 'SOL-001',
      location: 'Rooftop - Building A',
      capacity: '100 KW',
      status: 'Active',
      lastReading: '850 kWh',
      lastReadingDate: '2024-01-15'
    }
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
  };

  const handleAddAsset = () => {
    navigate('/utility/energy/add');
  };

  const handleViewAsset = (assetId: string) => {
    navigate(`/utility/energy/${assetId}`);
  };

  const handleEditAsset = (assetId: string) => {
    navigate(`/utility/energy/edit/${assetId}`);
  };

  const handleDownloadReport = () => {
    console.log('Downloading energy report...');
    // Create a simple CSV report
    const csvContent = [
      ['Asset ID', 'Asset Name', 'Asset No', 'Location', 'Capacity', 'Status', 'Last Reading', 'Last Reading Date'],
      ...energyAssets.map(asset => [
        asset.id,
        asset.assetName,
        asset.assetNo,
        asset.location,
        asset.capacity,
        asset.status,
        asset.lastReading,
        asset.lastReadingDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'energy-assets-report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-6 bg-sidebar min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-sidebar-foreground/70 mb-4">
          <span>Home</span>
          <span className="mx-2">{'>'}</span>
          <span>Utility</span>
          <span className="mx-2">{'>'}</span>
          <span>Energy</span>
        </nav>
        <h1 className="text-2xl font-bold text-sidebar-foreground">ENERGY ASSETS</h1>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={handleAddAsset}
          style={{ backgroundColor: '#C72030' }} 
          className="text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            style={{ borderColor: '#C72030', color: '#C72030' }}
            className="hover:bg-red-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-sidebar-foreground/50" />
            <Input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80 bg-white border-sidebar-border"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            style={{ backgroundColor: '#C72030' }} 
            className="text-white hover:opacity-90"
          >
            Go!
          </Button>
          <Button 
            onClick={handleReset} 
            variant="outline"
            className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
          >
            Reset
          </Button>
          <Button
            onClick={handleDownloadReport}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-sidebar-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-sidebar-accent">
              <TableHead className="text-sidebar-foreground">Action</TableHead>
              <TableHead className="text-sidebar-foreground">Asset ID</TableHead>
              <TableHead className="text-sidebar-foreground">Asset Name</TableHead>
              <TableHead className="text-sidebar-foreground">Asset No</TableHead>
              <TableHead className="text-sidebar-foreground">Location</TableHead>
              <TableHead className="text-sidebar-foreground">Capacity</TableHead>
              <TableHead className="text-sidebar-foreground">Status</TableHead>
              <TableHead className="text-sidebar-foreground">Last Reading</TableHead>
              <TableHead className="text-sidebar-foreground">Last Reading Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {energyAssets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-sidebar-accent/50">
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewAsset(asset.id)}
                      className="text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditAsset(asset.id)}
                      className="text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-blue-600 font-medium">
                  {asset.id}
                </TableCell>
                <TableCell className="text-sidebar-foreground">
                  {asset.assetName}
                </TableCell>
                <TableCell className="text-sidebar-foreground">
                  {asset.assetNo}
                </TableCell>
                <TableCell className="text-sidebar-foreground">
                  {asset.location}
                </TableCell>
                <TableCell className="text-sidebar-foreground">
                  {asset.capacity}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded ${
                    asset.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : asset.status === 'Standby'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.status}
                  </span>
                </TableCell>
                <TableCell className="text-sidebar-foreground">
                  {asset.lastReading}
                </TableCell>
                <TableCell className="text-sidebar-foreground">
                  {asset.lastReadingDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UtilityDashboard;
