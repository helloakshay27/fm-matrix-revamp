import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { Plus, Search, RefreshCw, Grid3X3, Edit, Trash2 } from 'lucide-react';

interface VisitorGateData {
  id: number;
  society: string;
  tower: string;
  gateName: string;
  gateDevice: string;
  userName: string;
  status: boolean;
  active: boolean;
  createdBy: string;
}

export const VisitorManagementSetup = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'smartsecure' | 'quikgate'>('smartsecure');

  // Sample data based on the image
  const visitorGateData: VisitorGateData[] = [
    {
      id: 1256,
      society: 'Zycus Infotech - Zycus Infotech Pvt Ltd',
      tower: 'GJ 07',
      gateName: 'Main Gate',
      gateDevice: '65e4bb21a04c149',
      userName: 'Security Tab 1',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    },
    {
      id: 1220,
      society: 'Arvog - Arvog Finance',
      tower: 'Trade World',
      gateName: 'Reception',
      gateDevice: '31fc5f03222bf7c5',
      userName: 'Security Tab',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    },
    {
      id: 1205,
      society: 'Jamshedpur - CJ Darcl Logistic Ltd',
      tower: '',
      gateName: 'Main Gate',
      gateDevice: '1ceb64e5c443a00a',
      userName: 'Tech Secure',
      status: true,
      active: true,
      createdBy: 'Deepak Gupta'
    },
    {
      id: 1202,
      society: 'Sai Radhe, Bund Garden - Lockated HO',
      tower: 'Jyoti Tower',
      gateName: 'Main Gate',
      gateDevice: '4a0e3ebdcf2c3e6c',
      userName: 'Demo Site2',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    },
    {
      id: 1200,
      society: 'Lockated - Lockated HO',
      tower: 'Jyoti Tower',
      gateName: 'Main Gate',
      gateDevice: '2ebdc58958ff42f8',
      userName: 'Lockated New Security',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    },
    {
      id: 1194,
      society: 'Sai Radhe, Bund Garden - Lockated HO',
      tower: 'Jyoti Tower',
      gateName: 'Main Gate',
      gateDevice: '45f799580cd85cf8a',
      userName: 'Demo Site2',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    },
    {
      id: 1175,
      society: 'Arvog - Arvog Finance',
      tower: 'Trade World',
      gateName: 'Reception',
      gateDevice: '920d4c797c161915',
      userName: 'Security Tab',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    },
    {
      id: 1174,
      society: 'Koncord, Bund Garden - UrbanWrk',
      tower: 'Koncord',
      gateName: 'Main Gate',
      gateDevice: '021854263974268',
      userName: 'Koncord Tab 4',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    },
    {
      id: 1165,
      society: 'MontClaire, Baner - UrbanWrk',
      tower: 'UrbanWrk@Montclair',
      gateName: 'Main Gate',
      gateDevice: '64c1dd8ca8005bd2',
      userName: 'Security 10th',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    }
  ];

  const filteredData = visitorGateData.filter(item =>
    item.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tower.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.gateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const handleStatusToggle = (id: number, field: 'status' | 'active') => {
    // Handle toggle logic here
    console.log(`Toggling ${field} for ID: ${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/security/visitor-management/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting ID: ${id}`);
  };

  const handleAdd = () => {
    navigate('/security/visitor-management/add-gate');
  };

  return (
    <div className="p-6 min-h-screen">
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
              <TableHead className="w-20">Actions</TableHead>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="min-w-[300px]">Society</TableHead>
              <TableHead className="w-32">Tower</TableHead>
              <TableHead className="w-32">Gate Name</TableHead>
              <TableHead className="w-40">Gate Device</TableHead>
              <TableHead className="w-40">User Name</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
              <TableHead className="w-24 text-center">Active</TableHead>
              <TableHead className="w-40">Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
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
                  <Switch
                    checked={item.status}
                    onCheckedChange={() => handleStatusToggle(item.id, 'status')}
                    className="data-[state=checked]:bg-green-500"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 text-xs font-medium ${
                    item.active ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {item.active ? 'Yes' : 'No'}
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