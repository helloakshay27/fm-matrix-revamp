
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Filter, Search } from 'lucide-react';
import { AddBroadcastForm } from '@/components/AddBroadcastForm';
import { BroadcastFilterModal } from '@/components/BroadcastFilterModal';

const BroadcastDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const broadcasts = [
    { id: 1, title: 'Mock Drill', type: 'General', createdOn: '11/05/2025', createdBy: '', status: 'Published', expiredOn: '18/05/2025', expired: 'No', attachment: false },
    { id: 2, title: 'New Demo', type: 'General', createdOn: '29/05/2025', createdBy: 'Atharv Karnekar', status: 'Published', expiredOn: '30/05/2025', expired: 'Yes', attachment: false },
    { id: 3, title: 'asdsf', type: 'General', createdOn: '17/05/2025', createdBy: 'Ankit Gupta', status: 'Published', expiredOn: '19/05/2025', expired: 'Yes', attachment: false },
    { id: 4, title: 'MR', type: 'General', createdOn: '10/05/2025', createdBy: 'Vinayak Mane', status: 'Published', expiredOn: '11/05/2025', expired: 'Yes', attachment: false },
    { id: 5, title: 'MR', type: 'Personal', createdOn: '10/05/2025', createdBy: 'Vinayak Mane', status: 'Published', expiredOn: '11/05/2025', expired: 'Yes', attachment: false }
  ];

  const filteredBroadcasts = broadcasts.filter(broadcast =>
    broadcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broadcast.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broadcast.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showAddForm) {
    return <AddBroadcastForm onBack={() => setShowAddForm(false)} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">BROADCAST LIST</h1>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-3">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              + Add
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go!
            </Button>
            <Button variant="outline">
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created by</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBroadcasts.map((broadcast) => (
              <tr key={broadcast.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broadcast.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broadcast.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broadcast.createdOn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broadcast.createdBy}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {broadcast.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broadcast.expiredOn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broadcast.expired}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {broadcast.attachment && <span>📎</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BroadcastFilterModal 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
      />
    </div>
  );
};

export default BroadcastDashboard;
