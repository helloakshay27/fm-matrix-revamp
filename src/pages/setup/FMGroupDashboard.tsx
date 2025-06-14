
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Plus } from 'lucide-react';
import { AddGroupModal } from '@/components/AddGroupModal';

const groups = [
  {
    id: '75',
    profile: '/placeholder.svg',
    groupName: 'RITC',
    members: 3,
    status: false
  },
  {
    id: '84', 
    profile: '/placeholder.svg',
    groupName: 'Testing',
    members: 2,
    status: true
  }
];

export const FMGroupDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Group List</h1>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button 
            className="bg-purple-700 hover:bg-purple-800 text-white"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Actions</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Group Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{group.id}</TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-orange-400"></div>
                    </div>
                  </TableCell>
                  <TableCell>{group.groupName}</TableCell>
                  <TableCell>{group.members}</TableCell>
                  <TableCell>
                    <div className={`w-8 h-5 rounded-full flex items-center ${group.status ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${group.status ? 'translate-x-3' : 'translate-x-0.5'}`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <AddGroupModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      </div>
    </SetupLayout>
  );
};
