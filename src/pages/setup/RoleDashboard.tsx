
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Edit, Plus, Search } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

export const RoleDashboard = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const toggleStatus = (id: number) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, status: !role.status } : role
    ));
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          Account &gt; Role
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ROLE</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Header with Add Role button */}
          <div className="flex justify-between items-center mb-6">
            <a 
              href="/setup/user-role/role/add"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </a>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded">
                <span className="text-orange-600 font-medium">All Functions</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded">
                <span className="text-orange-600 font-medium">Inventory</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded">
                <span className="text-orange-600 font-medium">Setup</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded">
                <span className="text-orange-600 font-medium">Quickgate</span>
              </div>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                <option>25 entries per page</option>
                <option>50 entries per page</option>
                <option>100 entries per page</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search Role"
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              Search Role
            </Button>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Role Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Description</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} className="hover:bg-gray-50">
                  <TableCell>{role.id} - {role.name}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Switch
                      checked={role.status}
                      onCheckedChange={() => toggleStatus(role.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SetupLayout>
  );
};
