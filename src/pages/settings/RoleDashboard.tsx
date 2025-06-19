
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search } from 'lucide-react';

interface Permission {
  name: string;
  all: boolean;
  add: boolean;
  view: boolean;
  edit: boolean;
  disable: boolean;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

const defaultPermissions: Permission[] = [
  { name: 'Broadcast', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Asset', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Documents', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Tickets', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Supplier', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Tasks', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Service', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Meters', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'AMC', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Schedule', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Materials', all: false, add: false, view: false, edit: false, disable: false },
];

export const RoleDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Functions');
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: 'Account Manager', permissions: [...defaultPermissions] },
    { id: 21, name: 'Executive', permissions: [...defaultPermissions] },
    { id: 22, name: 'Process Manager', permissions: [...defaultPermissions] },
    { id: 23, name: 'Manager', permissions: [...defaultPermissions] },
    { id: 34, name: 'Lcoated Role Test', permissions: [...defaultPermissions] },
    { id: 36, name: 'Manager', permissions: [...defaultPermissions] },
    { id: 41, name: 'Technician', permissions: [...defaultPermissions] },
    { id: 49, name: 'Admin', permissions: [...defaultPermissions] },
    { id: 108, name: 'Inventory Role', permissions: [...defaultPermissions] },
    { id: 202, name: 'Admin', permissions: [...defaultPermissions] },
  ]);

  const tabs = ['All Functions', 'Inventory', 'Setup', 'Quickgate'];

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionChange = (roleId: number, permissionName: string, field: keyof Permission, value: boolean) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedPermissions = role.permissions.map(permission => {
          if (permission.name === permissionName) {
            const updatedPermission = { ...permission, [field]: value };
            
            // If "All" is checked, check all other permissions
            if (field === 'all' && value) {
              updatedPermission.add = true;
              updatedPermission.view = true;
              updatedPermission.edit = true;
              updatedPermission.disable = true;
            }
            // If "All" is unchecked, uncheck all other permissions
            else if (field === 'all' && !value) {
              updatedPermission.add = false;
              updatedPermission.view = false;
              updatedPermission.edit = false;
              updatedPermission.disable = false;
            }
            // If any individual permission is unchecked, uncheck "All"
            else if (!value && field !== 'all') {
              updatedPermission.all = false;
            }
            // If all individual permissions are checked, check "All"
            else if (value && field !== 'all') {
              const allIndividualChecked = updatedPermission.add && updatedPermission.view && updatedPermission.edit && updatedPermission.disable;
              if (allIndividualChecked) {
                updatedPermission.all = true;
              }
            }
            
            return updatedPermission;
          }
          return permission;
        });
        
        return { ...role, permissions: updatedPermissions };
      }
      return role;
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a1a1a]">ROLE</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Header with Add Role button */}
        <div className="flex justify-between items-center mb-6">
          <Button className="bg-[#C72030] hover:bg-[#A11D2A] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center gap-2">
          <Input
            placeholder="Search Role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button className="bg-[#C72030] hover:bg-[#A11D2A] text-white">
            <Search className="w-4 h-4 mr-2" />
            Search Role
          </Button>
        </div>

        {/* Left panel with roles and right panel with permissions */}
        <div className="flex gap-6">
          {/* Left Panel - Roles List */}
          <div className="w-80 bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer"
                >
                  <div className="text-sm font-medium text-[#1a1a1a]">
                    {role.id} - {role.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Permissions Matrix */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-[#C72030] text-white border-[#C72030]'
                      : 'bg-white text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Permissions Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 w-32"></TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">All</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Add</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">View</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Edit</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Disable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultPermissions.map((permission) => (
                    <TableRow key={permission.name} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.all}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(1, permission.name, 'all', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.add}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(1, permission.name, 'add', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.view}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(1, permission.name, 'view', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.edit}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(1, permission.name, 'edit', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.disable}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(1, permission.name, 'disable', checked as boolean)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
