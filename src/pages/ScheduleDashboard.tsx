
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, Filter, Download, Search, Eye, Edit, Copy } from 'lucide-react';

const scheduleData = [
  {
    id: '11878',
    activityName: 'meter reading',
    amcId: '',
    type: 'PPM',
    scheduleType: 'Asset',
    noOfAssociation: '2',
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
    noOfAssociation: '1',
    validFrom: '14/08/2024, 05:30 AM',
    validTill: '31/08/2025, 05:30 AM',
    category: 'Non Technical',
    active: true,
    createdOn: '14/08/2024, 04:17 PM'
  },
  // Add more sample data as needed
];

export const ScheduleDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchedules, setFilteredSchedules] = useState(scheduleData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = scheduleData.filter(schedule =>
        schedule.activityName.toLowerCase().includes(value.toLowerCase()) ||
        schedule.id.toLowerCase().includes(value.toLowerCase()) ||
        schedule.type.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(scheduleData);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Schedule</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Schedule List</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="allowMapping" />
          <label htmlFor="allowMapping" className="text-sm">Allow Automatic Mapping</label>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Input
            placeholder="Enter Activity Name"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
          <Button style={{ backgroundColor: '#C72030' }} className="text-white">
            Go!
          </Button>
          <Button variant="outline" className="border-[#C72030] text-[#C72030]">
            Reset
          </Button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
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
            {filteredSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{schedule.id}</TableCell>
                <TableCell>{schedule.activityName}</TableCell>
                <TableCell>{schedule.amcId}</TableCell>
                <TableCell>{schedule.type}</TableCell>
                <TableCell>{schedule.scheduleType}</TableCell>
                <TableCell>{schedule.noOfAssociation}</TableCell>
                <TableCell>{schedule.validFrom}</TableCell>
                <TableCell>{schedule.validTill}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    schedule.category === 'Technical' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {schedule.category}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${schedule.active ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                    <span className={schedule.active ? 'text-green-600' : 'text-gray-500'}>
                      {schedule.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
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
