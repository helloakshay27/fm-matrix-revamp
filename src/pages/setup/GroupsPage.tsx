
import React, { useState } from 'react';
import { Plus, Upload } from 'lucide-react';

interface Group {
  id: number;
  name: string;
  status: boolean;
}

interface SubGroup {
  id: number;
  groupName: string;
  subGroupName: string;
  status: boolean;
}

const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: 'Washroom', status: true },
    { id: 2, name: 'reading', status: true },
    { id: 3, name: 'Daily Substation Log', status: true },
    { id: 4, name: 'Kitchen', status: true },
    { id: 5, name: 'Kitchen equipment', status: true },
    { id: 6, name: 'Men washroom', status: true },
    { id: 7, name: 'Hall', status: true },
    { id: 8, name: 'Common Area', status: true },
    { id: 9, name: 'server room', status: true },
    { id: 10, name: 'Reception', status: true },
    { id: 11, name: 'Room', status: true },
    { id: 12, name: 'DG 1', status: true },
    { id: 13, name: 'DG 2', status: true },
    { id: 14, name: 'B8 Washroom', status: true },
    { id: 15, name: '1 "S" Sorting', status: true },
    { id: 16, name: 'Equipment Health Status', status: true },
    { id: 17, name: 'Site Performance', status: true },
    { id: 18, name: 'Invoice management', status: true },
    { id: 19, name: 'Innovation', status: true },
    { id: 20, name: 'Reporting', status: true },
    { id: 21, name: 'Management Leadership', status: true },
    { id: 22, name: 'Others', status: true },
    { id: 23, name: 'What went well', status: true },
    { id: 24, name: 'Improvement Plan', status: true },
    { id: 25, name: 'General Feedback', status: true },
    { id: 26, name: 'Business Overview', status: true },
    { id: 27, name: 'References and Reputation', status: true },
    { id: 28, name: 'Financial Stability', status: true },
    { id: 29, name: 'Capabilities and Expertise', status: true },
    { id: 30, name: 'admin', status: true },
    { id: 31, name: 'saif chaudhary', status: true },
    { id: 32, name: 'housekeeping', status: true },
  ]);

  const [subGroups, setSubGroups] = useState<SubGroup[]>([
    { id: 1, groupName: 'Washroom', subGroupName: 'Gents Washroom', status: true },
    { id: 2, groupName: 'Washroom', subGroupName: 'Ladies Washroom', status: true },
    { id: 3, groupName: 'reading', subGroupName: 'C-Block MLT Log', status: true },
    { id: 4, groupName: 'Daily Substation Log', subGroupName: 'B-Block MLT', status: true },
    { id: 5, groupName: 'Daily Substation Log', subGroupName: 'U-Block MLT-1', status: true },
    { id: 6, groupName: 'Daily Substation Log', subGroupName: 'U-Block MLT-2', status: true },
    { id: 7, groupName: 'Kitchen', subGroupName: 'A Block', status: true },
    { id: 8, groupName: 'Kitchen', subGroupName: 'platform cleaning', status: true },
    { id: 9, groupName: 'Kitchen equipment', subGroupName: 'Raw water pump', status: true },
    { id: 10, groupName: 'Men washroom', subGroupName: 'Cleaning', status: true },
    { id: 11, groupName: 'Men washroom', subGroupName: 'Dusting', status: true },
    { id: 12, groupName: 'Hall', subGroupName: 'auditorium', status: true },
    { id: 13, groupName: 'Common Area', subGroupName: 'Floor cleaning', status: true },
    { id: 14, groupName: 'server room', subGroupName: 'b block svr', status: true },
    { id: 15, groupName: 'Reception', subGroupName: 'Maintanance', status: true },
    { id: 16, groupName: 'Room', subGroupName: 'Server Room', status: true },
    { id: 17, groupName: 'DG 1', subGroupName: 'Battery No 1', status: true },
    { id: 18, groupName: 'DG 1', subGroupName: 'Battery No 2', status: true },
    { id: 19, groupName: 'DG 2', subGroupName: 'Battery No 3', status: true },
    { id: 20, groupName: 'DG 2', subGroupName: 'Battery No 4', status: true },
    { id: 21, groupName: 'B8 Washroom', subGroupName: 'Ladies', status: true },
    { id: 22, groupName: 'B8 Washroom', subGroupName: 'Gents', status: true },
  ]);

  const toggleGroupStatus = (id: number) => {
    setGroups(groups.map(group => 
      group.id === id ? { ...group, status: !group.status } : group
    ));
  };

  const toggleSubGroupStatus = (id: number) => {
    setSubGroups(subGroups.map(subGroup => 
      subGroup.id === id ? { ...subGroup, status: !subGroup.status } : subGroup
    ));
  };

  const handleAddGroup = () => {
    console.log('Add Group clicked');
  };

  const handleAddSubgroup = () => {
    console.log('Add Subgroup clicked');
  };

  const handleBulkUpload = () => {
    console.log('Bulk Upload clicked');
  };

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Setup &gt; Groups</div>
          <h1 className="text-2xl font-bold text-gray-900">GROUPS</h1>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={handleAddGroup}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Group
          </button>
          <button 
            onClick={handleAddSubgroup}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Subgroup
          </button>
          <button 
            onClick={handleBulkUpload}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex p-6 gap-6 h-[calc(100vh-200px)]">
        {/* Groups Table */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Groups</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-y-auto max-h-[600px]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Sr.No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Group Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group, index) => (
                    <tr key={group.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">{group.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">{group.name}</td>
                      <td className="px-4 py-3 border-b">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={group.status}
                            onChange={() => toggleGroupStatus(group.id)}
                            className="sr-only"
                          />
                          <div className={`relative w-11 h-6 rounded-full transition-colors ${group.status ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${group.status ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sub Groups Table */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Sub Groups</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-y-auto max-h-[600px]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Sr.No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Group Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Sub Group Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subGroups.map((subGroup, index) => (
                    <tr key={subGroup.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">{subGroup.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">{subGroup.groupName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">{subGroup.subGroupName}</td>
                      <td className="px-4 py-3 border-b">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={subGroup.status}
                            onChange={() => toggleSubGroupStatus(subGroup.id)}
                            className="sr-only"
                          />
                          <div className={`relative w-11 h-6 rounded-full transition-colors ${subGroup.status ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${subGroup.status ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 right-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Powered by</span>
          <span className="font-bold text-orange-500">Phygital.work</span>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
