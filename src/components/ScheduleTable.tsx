
import React from 'react';
import { Edit, Copy, Eye, Plus, Download, Filter, Download as Export, Search, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface ScheduleTableProps {
  onAddSchedule: () => void;
}

const scheduleData = [
  {
    id: '11411',
    activityName: 'Sanitary Bins Checklist',
    amcId: '',
    type: 'PPM',
    scheduleType: 'Service',
    noOfAssociation: 1,
    validFrom: '04/09/2024, 05:30 AM',
    validTill: '31/07/2025, 05:30 AM',
    category: 'Non Technical',
    active: true,
    createdOn: '04/09/2024, 06:06 PM'
  },
  {
    id: '11410',
    activityName: 'Plants Hydration Tracker',
    amcId: '',
    type: 'PPM',
    scheduleType: 'Service',
    noOfAssociation: 1,
    validFrom: '04/09/2024, 05:30 AM',
    validTill: '31/07/2025, 05:30 AM',
    category: 'Non Technical',
    active: true,
    createdOn: '04/09/2024, 06:05 PM'
  },
  {
    id: '11408',
    activityName: 'Pest Control Checklist',
    amcId: '',
    type: 'PPM',
    scheduleType: 'Service',
    noOfAssociation: 1,
    validFrom: '04/09/2024, 05:30 AM',
    validTill: '31/07/2025, 05:30 AM',
    category: 'Non Technical',
    active: true,
    createdOn: '04/09/2024, 06:04 PM'
  },
  {
    id: '11393',
    activityName: 'VIP Area Checklist',
    amcId: '',
    type: 'Routine',
    scheduleType: 'Service',
    noOfAssociation: 1,
    validFrom: '28/08/2024, 05:30 AM',
    validTill: '13/05/2027, 05:30 AM',
    category: '',
    active: true,
    createdOn: '27/08/2024, 01:06 PM'
  },
  {
    id: '11282',
    activityName: 'Washroom (Weekly Deep Cleaning)',
    amcId: '',
    type: 'Preparedness',
    scheduleType: 'Service',
    noOfAssociation: 3,
    validFrom: '01/07/2024, 05:30 AM',
    validTill: '01/07/2025, 05:30 AM',
    category: 'Non Technical',
    active: true,
    createdOn: '18/07/2024, 05:26 PM'
  }
];

export const ScheduleTable = ({ onAddSchedule }: ScheduleTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-[#D5DbDB]">
      {/* Table Header Actions */}
      <div className="p-4 border-b border-[#D5DbDB] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onAddSchedule}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <Download className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <Export className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[#1a1a1a]">
            <input type="checkbox" className="rounded" />
            Allow Automatic Mapping
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Activity Name"
              className="pl-10 pr-4 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            Go!
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
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
          {scheduleData.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
              </TableCell>
              <TableCell>
                <button className="text-gray-400 hover:text-gray-600">
                  <Copy className="w-4 h-4" />
                </button>
              </TableCell>
              <TableCell>
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
              </TableCell>
              <TableCell className="font-medium">{schedule.id}</TableCell>
              <TableCell>{schedule.activityName}</TableCell>
              <TableCell>{schedule.amcId}</TableCell>
              <TableCell>{schedule.type}</TableCell>
              <TableCell>{schedule.scheduleType}</TableCell>
              <TableCell>{schedule.noOfAssociation}</TableCell>
              <TableCell>{schedule.validFrom}</TableCell>
              <TableCell>{schedule.validTill}</TableCell>
              <TableCell>{schedule.category}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className={`w-12 h-6 rounded-full ${schedule.active ? 'bg-orange-500' : 'bg-gray-300'} relative cursor-pointer transition-colors`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${schedule.active ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{schedule.createdOn}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
