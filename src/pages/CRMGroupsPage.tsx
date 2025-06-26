
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddGroupModal } from '@/components/AddGroupModal';
import { EditGroupModal } from '@/components/EditGroupModal';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';

const CRMGroupsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();

  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    image: true,
    groupName: true,
    members: true
  });

  const [groups, setGroups] = useState([
    {
      id: 1,
      groupName: 'Ghanshyam123',
      members: 3,
      image: '/placeholder-avatar.png'
    },
    {
      id: 2,
      groupName: 'B Wing Members',
      members: 6,
      image: '/placeholder-avatar.png'
    },
    {
      id: 3,
      groupName: 'A Wing Members',
      members: 6,
      image: '/placeholder-avatar.png'
    },
    {
      id: 4,
      groupName: 'Cultural Committee',
      members: 5,
      image: '/placeholder-avatar.png'
    },
    {
      id: 5,
      groupName: 'Lockated Test',
      members: 2,
      image: '/placeholder-avatar.png'
    },
    {
      id: 6,
      groupName: 'Operation Team',
      members: 3,
      image: '/placeholder-avatar.png'
    },
    {
      id: 7,
      groupName: 'Nupura',
      members: 0,
      image: '/placeholder-avatar.png'
    },
    {
      id: 8,
      groupName: 'Owners',
      members: 4,
      image: '/placeholder-avatar.png'
    }
  ]);

  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewGroup = (groupId: number) => {
    navigate(`/crm/groups/details/${groupId}`);
  };

  const handleEditGroup = (group: any) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const handleDeleteGroup = (groupId: number) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      setGroups(groups.filter(group => group.id !== groupId));
      console.log('Deleted group with ID:', groupId);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Groups</h1>
          <p className="text-gray-600 mt-1">Manage your groups and members</p>
        </div>
      </div>

      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <Button 
          className="bg-[#C72030] hover:bg-[#B01E2A] text-white"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <ColumnVisibilityDropdown
            visibleColumns={visibleColumns}
            onColumnChange={setVisibleColumns}
          />
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {visibleColumns.actions && <TableHead>Actions</TableHead>}
              {visibleColumns.image && <TableHead>Image</TableHead>}
              {visibleColumns.groupName && <TableHead>Group Name</TableHead>}
              {visibleColumns.members && <TableHead>Members</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map((group) => (
              <TableRow key={group.id} className="hover:bg-gray-50">
                {visibleColumns.actions && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => handleViewGroup(group.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => handleEditGroup(group)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.image && (
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-orange-400"></div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.groupName && (
                  <TableCell className="font-medium">{group.groupName}</TableCell>
                )}
                {visibleColumns.members && (
                  <TableCell>{group.members}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <AddGroupModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      
      <EditGroupModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        groupData={selectedGroup}
      />
    </div>
  );
};

export default CRMGroupsPage;
