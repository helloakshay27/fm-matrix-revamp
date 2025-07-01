
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialAmcData = [
  {
    id: '51016',
    assetName: '',
    type: 'Asset',
    vendor: 'MODWIN NETWORKS PVT.LTD',
    startDate: '04/04/2025',
    endDate: '02/05/2025',
    firstService: '04/04/2025',
    status: true,
    createdOn: '04/04/2025, 03:25PM'
  },
  {
    id: '51015',
    assetName: '',
    type: 'Asset',
    vendor: 'TBS ELECTRICAL',
    startDate: '01/04/2025',
    endDate: '10/05/2025',
    firstService: '09/04/2025',
    status: true,
    createdOn: '04/04/2025, 03:24PM'
  },
  {
    id: '49130',
    assetName: '',
    type: 'Asset',
    vendor: 'Mohan Khopade',
    startDate: '04/02/2025',
    endDate: '04/02/2025',
    firstService: '04/02/2025',
    status: true,
    createdOn: '04/02/2025, 04:29PM'
  },
  {
    id: '49120',
    assetName: '',
    type: 'Asset',
    vendor: 'MODWIN NETWORKS PVT.LTD',
    startDate: '04/02/2025',
    endDate: '04/02/2025',
    firstService: '04/02/2025',
    status: true,
    createdOn: '04/02/2025, 12:43AM'
  },
  {
    id: '49119',
    assetName: '',
    type: 'Asset',
    vendor: 'Mohammad Sageer',
    startDate: '04/02/2025',
    endDate: '04/02/2025',
    firstService: '04/02/2025',
    status: true,
    createdOn: '04/02/2025, 12:31AM'
  }
];

export const AMCDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [amcData, setAmcData] = useState(initialAmcData);
  const [filteredAMC, setFilteredAMC] = useState(initialAmcData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = amcData.filter(amc =>
        amc.id.toLowerCase().includes(value.toLowerCase()) ||
        amc.vendor.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAMC(filtered);
    } else {
      setFilteredAMC(amcData);
    }
  };

  const handleAddClick = () => {
    navigate('/maintenance/amc/add');
  };

  const handleViewDetails = (id: string) => {
    navigate(`/maintenance/amc/details/${id}`);
  };

  const handleStatusToggle = (id: string, checked: boolean) => {
    console.log(`Toggling status for AMC ${id} to ${checked}`);
    
    // Update the main data array
    const updatedAmcData = amcData.map(amc => 
      amc.id === id ? { ...amc, status: checked } : amc
    );
    setAmcData(updatedAmcData);
    
    // Update the filtered data array
    const updatedFilteredData = filteredAMC.map(amc => 
      amc.id === id ? { ...amc, status: checked } : amc
    );
    setFilteredAMC(updatedFilteredData);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredAMC(amcData);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">AMC &gt; AMC List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">AMC LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
  onClick={handleAddClick}
  className="text-white bg-[#C72030] hover:bg-[#C72030]/90 [&_svg]:text-white"
>
  <Plus className="w-4 h-4 mr-2" />
  Add
</Button>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search AMC..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* AMC Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>First Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAMC.map((amc) => (
              <TableRow key={amc.id}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(amc.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{amc.id}</TableCell>
                <TableCell>{amc.assetName}</TableCell>
                <TableCell>{amc.type}</TableCell>
                <TableCell>{amc.vendor}</TableCell>
                <TableCell>{amc.startDate}</TableCell>
                <TableCell>{amc.endDate}</TableCell>
                <TableCell>{amc.firstService}</TableCell>
                <TableCell>
                  <Switch
                    checked={amc.status}
                    onCheckedChange={(checked) => handleStatusToggle(amc.id, checked)}
                  />
                </TableCell>
                <TableCell>{amc.createdOn}</TableCell>
              </TableRow>
            ))}
            {filteredAMC.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No AMC records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
