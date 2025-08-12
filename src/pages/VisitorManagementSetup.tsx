import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Plus, Search, RefreshCw, Grid3X3, Edit, Trash2, Eye, Flag, Star } from 'lucide-react';

interface VisitorGateData {
  id: number;
  society: string;
  tower: string;
  gateName: string;
  gateDevice: string;
  userName: string;
  status: 'Active' | 'Inactive';
  active: boolean;
  createdBy: string;
  priority: 'High' | 'Medium' | 'Low';
  selected?: boolean;
}

export const VisitorManagementSetup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sample data based on the image
  const visitorGateData: VisitorGateData[] = [
    {
      id: 1256,
      society: 'Zycus Infotech - Zycus Infotech Pvt Ltd',
      tower: 'GJ 07',
      gateName: 'Main Gate',
      gateDevice: '65e4bb21a04c149',
      userName: 'Security Tab 1',
      status: 'Active',
      active: true,
      createdBy: 'Mahendra Lungare',
      priority: 'High'
    },
    {
      id: 1220,
      society: 'Arvog - Arvog Finance',
      tower: 'Trade World',
      gateName: 'Reception',
      gateDevice: '31fc5f03222bf7c5',
      userName: 'Security Tab',
      status: 'Active',
      active: true,
      createdBy: 'Mahendra Lungare',
      priority: 'Medium'
    },
    {
      id: 1205,
      society: 'Jamshedpur - CJ Darcl Logistic Ltd',
      tower: '',
      gateName: 'Main Gate',
      gateDevice: '1ceb64e5c443a00a',
      userName: 'Tech Secure',
      status: 'Inactive',
      active: false,
      createdBy: 'Deepak Gupta',
      priority: 'Low'
    },
    {
      id: 1202,
      society: 'Sai Radhe, Bund Garden - Lockated HO',
      tower: 'Jyoti Tower',
      gateName: 'Main Gate',
      gateDevice: '4a0e3ebdcf2c3e6c',
      userName: 'Demo Site2',
      status: 'Active',
      active: true,
      createdBy: 'Mahendra Lungare',
      priority: 'High'
    },
    {
      id: 1200,
      society: 'Lockated - Lockated HO',
      tower: 'Jyoti Tower',
      gateName: 'Main Gate',
      gateDevice: '2ebdc58958ff42f8',
      userName: 'Lockated New Security',
      status: 'Active',
      active: true,
      createdBy: 'Mahendra Lungare',
      priority: 'Medium'
    }
  ];

  const filteredData = visitorGateData.filter(item =>
    item.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tower.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.gateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const getStatusBadgeColor = (status: 'Active' | 'Inactive') => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleStatusToggle = (id: number, field: 'status' | 'active') => {
    // Handle toggle logic here
    console.log(`Toggling ${field} for ID: ${id}`);
  };

  const handleEdit = (id: number) => {
    console.log(`Editing ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting ID: ${id}`);
  };

  const handleAdd = () => {
    console.log('Adding new visitor gate setup');
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={handleAdd}
          className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="icon" className="border-gray-300">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-gray-300">
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-24">Actions</TableHead>
              <TableHead className="w-20">ID</TableHead>
              <TableHead className="min-w-[300px]">Society</TableHead>
              <TableHead className="w-32">Tower</TableHead>
              <TableHead className="w-32">Gate Name</TableHead>
              <TableHead className="w-40">Gate Device</TableHead>
              <TableHead className="w-40">User Name</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
              <TableHead className="w-24 text-center">Priority</TableHead>
              <TableHead className="w-40">Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      title="View"
                    >
                      <Eye className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Flag"
                    >
                      <Flag className="w-4 h-4 text-red-500" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Star"
                    >
                      <Star className="w-4 h-4 text-yellow-500" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="truncate" title={item.society}>
                    {item.society}
                  </div>
                </TableCell>
                <TableCell>{item.tower || '--'}</TableCell>
                <TableCell>{item.gateName}</TableCell>
                <TableCell className="font-mono text-sm">{item.gateDevice}</TableCell>
                <TableCell>{item.userName}</TableCell>
                <TableCell className="text-center">
                  <Badge className={getStatusBadgeColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </TableCell>
                <TableCell>{item.createdBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
          <span>Powered by</span>
          <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="font-semibold text-gray-800">LOCKATED</span>
        </div>
      </div>
    </div>
  );
};