
import React, { useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { useNavigate } from 'react-router-dom';

const broadcastData = [
  {
    id: 1,
    title: 'Mock Drill',
    type: 'General',
    createdOn: '11/06/2025',
    createdBy: '',
    status: 'Published',
    expiredOn: '18/06/2025',
    expired: 'No',
    attachment: false
  },
  {
    id: 2,
    title: 'New Demo',
    type: 'General',
    createdOn: '29/05/2025',
    createdBy: 'Atharv Karnekar',
    status: 'Published',
    expiredOn: '30/05/2025',
    expired: 'Yes',
    attachment: false
  },
  {
    id: 3,
    title: 'askf',
    type: 'General',
    createdOn: '17/05/2025',
    createdBy: 'Ankit Gupta',
    status: 'Published',
    expiredOn: '19/05/2025',
    expired: 'Yes',
    attachment: false
  },
  {
    id: 4,
    title: 'MR',
    type: 'General',
    createdOn: '10/05/2025',
    createdBy: 'Vinayak Mane',
    status: 'Published',
    expiredOn: '11/05/2025',
    expired: 'Yes',
    attachment: false
  },
  {
    id: 5,
    title: 'MR',
    type: 'Personal',
    createdOn: '10/05/2025',
    createdBy: 'Vinayak Mane',
    status: 'Published',
    expiredOn: '11/05/2025',
    expired: 'Yes',
    attachment: false
  }
];

export const BroadcastDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    action: true,
    title: true,
    type: true,
    createdOn: true,
    createdBy: true,
    status: true,
    expiredOn: true,
    expired: true,
    attachment: true
  });

  const handleColumnChange = (columns: typeof visibleColumns) => {
    setVisibleColumns(columns);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/crm/broadcast/details/${id}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Broadcast &gt; Broadcast List
      </div>
      
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">BROADCAST LIST</h1>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            onClick={() => navigate('/crm/broadcast/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">
            Go!
          </Button>
          <Button variant="outline" className="border-gray-300">
            Reset
          </Button>
          <ColumnVisibilityDropdown
            visibleColumns={visibleColumns}
            onColumnChange={handleColumnChange}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              {visibleColumns.action && <TableHead>Action</TableHead>}
              {visibleColumns.title && <TableHead>Title</TableHead>}
              {visibleColumns.type && <TableHead>Type</TableHead>}
              {visibleColumns.createdOn && <TableHead>Created On</TableHead>}
              {visibleColumns.createdBy && <TableHead>Created by</TableHead>}
              {visibleColumns.status && <TableHead>Status</TableHead>}
              {visibleColumns.expiredOn && <TableHead>Expired On</TableHead>}
              {visibleColumns.expired && <TableHead>Expired</TableHead>}
              {visibleColumns.attachment && <TableHead>Attachment</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {broadcastData.map((broadcast) => (
              <TableRow key={broadcast.id} className="border-b">
                {visibleColumns.action && (
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetails(broadcast.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
                {visibleColumns.title && (
                  <TableCell className="font-medium">{broadcast.title}</TableCell>
                )}
                {visibleColumns.type && (
                  <TableCell>
                    <Badge 
                      variant={broadcast.type === 'General' ? 'default' : 'secondary'}
                      className={broadcast.type === 'General' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}
                    >
                      {broadcast.type}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.createdOn && <TableCell>{broadcast.createdOn}</TableCell>}
                {visibleColumns.createdBy && <TableCell>{broadcast.createdBy}</TableCell>}
                {visibleColumns.status && (
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {broadcast.status}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.expiredOn && <TableCell>{broadcast.expiredOn}</TableCell>}
                {visibleColumns.expired && (
                  <TableCell>
                    <Badge 
                      variant={broadcast.expired === 'No' ? 'secondary' : 'destructive'}
                      className={broadcast.expired === 'No' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {broadcast.expired}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.attachment && (
                  <TableCell>
                    {broadcast.attachment && (
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer branding */}
      <div className="text-center text-xs text-gray-500 mt-8">
        <p>Powered by</p>
        <div className="flex items-center justify-center mt-1">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
            L
          </div>
          <span className="font-semibold">LOCATED</span>
        </div>
      </div>
    </div>
  );
};
