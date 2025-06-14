
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Eye, Plus, Download, Filter, Upload, Search, Edit, Copy } from 'lucide-react';

const mockScheduleData = [
  {
    id: '11878',
    activityName: 'meter reading',
    amcId: '',
    type: 'PPM',
    scheduleType: 'Asset',
    noOfAssociation: 2,
    validFrom: '01/05/2025, 12:00 AM',
    validTill: '31/05/2025, 11:59 PM',
    category: 'Technical',
    active: true,
    createdOn: '21/05/2025, 01:51 PM'
  },
  {
    id: '11372',
    activityName: 'All task types 123',
    amcId: '',
    type: 'Routine',
    scheduleType: 'Service',
    noOfAssociation: 1,
    validFrom: '14/08/2024, 05:30 AM',
    validTill: '31/08/2025, 05:30 AM',
    category: 'Non Technical',
    active: true,
    createdOn: '14/08/2024, 04:17 PM'
  },
  {
    id: '11332',
    activityName: 'All Task Mobile FM',
    amcId: '',
    type: 'PPM',
    scheduleType: 'Asset',
    noOfAssociation: 1,
    validFrom: '12/08/2024, 05:30 AM',
    validTill: '27/08/2024, 05:30 AM',
    category: 'Non Technical',
    active: false,
    createdOn: '12/08/2024, 06:30 PM'
  }
];

export const ScheduleListDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allowAutomaticMapping, setAllowAutomaticMapping] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Schedule</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Schedule List</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
          <Download className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">
          <Upload className="w-4 h-4 mr-2" />
          Export
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <Switch 
            checked={allowAutomaticMapping} 
            onCheckedChange={setAllowAutomaticMapping}
          />
          <span className="text-sm">Allow Automatic Mapping</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Enter Activity Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">Go!</Button>
        <Button variant="outline">Reset</Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>Copy</TableHead>
              <TableHead>View</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Activity Name</TableHead>
              <TableHead>AMC ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Schedule Type</TableHead>
              <TableHead>No. Of Association</TableHead>
              <TableHead>Valid From</TableHead>
              <TableHead>Valid Till</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockScheduleData.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <Edit className="w-4 h-4 text-gray-600 cursor-pointer" />
                </TableCell>
                <TableCell>
                  <Copy className="w-4 h-4 text-gray-600 cursor-pointer" />
                </TableCell>
                <TableCell>
                  <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                </TableCell>
                <TableCell>{schedule.id}</TableCell>
                <TableCell>{schedule.activityName}</TableCell>
                <TableCell>{schedule.amcId}</TableCell>
                <TableCell>{schedule.type}</TableCell>
                <TableCell>{schedule.scheduleType}</TableCell>
                <TableCell>{schedule.noOfAssociation}</TableCell>
                <TableCell>{schedule.validFrom}</TableCell>
                <TableCell>{schedule.validTill}</TableCell>
                <TableCell>{schedule.category}</TableCell>
                <TableCell>
                  <Switch checked={schedule.active} />
                </TableCell>
                <TableCell>{schedule.createdOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
