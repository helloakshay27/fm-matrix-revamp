
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const amcData = [
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
  // Add more sample data as needed
];

export const AMCDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAMC, setFilteredAMC] = useState(amcData);

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
          style={{ backgroundColor: '#C72030' }} 
          className="text-white hover:bg-[#C72030]/90"
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
          <Button variant="outline" className="border-[#C72030] text-[#C72030]">
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
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${amc.status ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                    <span className={amc.status ? 'text-green-600' : 'text-gray-500'}>
                      {amc.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{amc.createdOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
