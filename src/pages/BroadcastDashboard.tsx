import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Filter, Search, Eye } from 'lucide-react';
import { AddBroadcastForm } from '@/components/AddBroadcastForm';
import { BroadcastFilterModal } from '@/components/BroadcastFilterModal';

interface BroadcastItem {
  id: number;
  title: string;
  type: string;
  createdOn: string;
  createdBy: string;
  status: string;
  expiredOn: string;
  expired: string;
  attachment: string;
}

const mockBroadcastData: BroadcastItem[] = [
  { id: 1, title: 'Mock Drill', type: 'General', createdOn: '11/06/2025', createdBy: '', status: 'Published', expiredOn: '18/06/2025', expired: 'No', attachment: '' },
  { id: 2, title: 'New Demo', type: 'General', createdOn: '29/05/2025', createdBy: 'Atharv Karnekar', status: 'Published', expiredOn: '30/05/2025', expired: 'Yes', attachment: '' },
  { id: 3, title: 'asdkf', type: 'General', createdOn: '17/05/2025', createdBy: 'Ankit Gupta', status: 'Published', expiredOn: '19/05/2025', expired: 'Yes', attachment: '' },
  { id: 4, title: 'MR', type: 'General', createdOn: '10/05/2025', createdBy: 'Vinayak Mane', status: 'Published', expiredOn: '11/05/2025', expired: 'Yes', attachment: '' },
  { id: 5, title: 'MR', type: 'Personal', createdOn: '10/05/2025', createdBy: 'Vinayak Mane', status: 'Published', expiredOn: '11/05/2025', expired: 'Yes', attachment: '' },
  { id: 6, title: 'dkfsdjdk', type: 'General', createdOn: '08/05/2025', createdBy: 'Ankit Gupta', status: 'Published', expiredOn: '10/05/2025', expired: 'Yes', attachment: '' },
  { id: 7, title: 'Test broad', type: 'Personal', createdOn: '07/05/2025', createdBy: 'Vinayak Mane', status: 'Published', expiredOn: '08/05/2025', expired: 'Yes', attachment: '' },
  { id: 8, title: 'Mr', type: 'Personal', createdOn: '07/05/2025', createdBy: 'Vinayak Mane', status: 'Published', expiredOn: '08/05/2025', expired: 'Yes', attachment: '' },
  { id: 9, title: 'kjhgf', type: 'Personal', createdOn: '07/05/2025', createdBy: 'Test 1000', status: 'Published', expiredOn: '08/05/2025', expired: 'Yes', attachment: '' },
  { id: 10, title: 'sdfghj', type: 'Personal', createdOn: '07/05/2025', createdBy: 'Test 1000', status: 'Published', expiredOn: '08/05/2025', expired: 'Yes', attachment: '' },
  { id: 11, title: 'Test QA 3', type: 'General', createdOn: '07/05/2025', createdBy: 'Vinayak Mane', status: 'Published', expiredOn: '08/05/2025', expired: 'Yes', attachment: '' }
];

export const BroadcastDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(mockBroadcastData);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredData(mockBroadcastData);
    } else {
      const filtered = mockBroadcastData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(mockBroadcastData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>Broadcast</span>
          <span className="mx-2">{'>'}</span>
          <span>Broadcast List</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">BROADCAST LIST</h1>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsAddFormOpen(true)}
            className="bg-purple-800 hover:bg-purple-900 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button 
            onClick={() => setIsFilterModalOpen(true)}
            variant="outline" 
            className="border-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSearch} className="bg-purple-800 hover:bg-purple-900 text-white">
            Go!
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-center">Action</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expired On</TableHead>
                <TableHead>Expired</TableHead>
                <TableHead>Attachment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.type === 'General' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell>{item.createdOn}</TableCell>
                  <TableCell>{item.createdBy}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.expiredOn}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.expired === 'No' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.expired}
                    </span>
                  </TableCell>
                  <TableCell>{item.attachment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddBroadcastForm 
        isOpen={isAddFormOpen} 
        onClose={() => setIsAddFormOpen(false)} 
      />
      <BroadcastFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  );
};
