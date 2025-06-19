
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
  { name: 'PO', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'WO', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Report', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Attendance', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Business Directory', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'PO Approval', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Dashboard', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Tracing', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'BI Reports', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Restaurants', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'My Ledgers', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Letter Of Indent', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Wo Invoices', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Bill', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Engineering Reports', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Events', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Customers', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'QuickGate Report', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Task Management', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'CEO Dashboard', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Operational Audit', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Mom Details', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Pms Design Inputs', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Vendor Audit', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Permits', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Pending Approvals', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Accounts', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Customer Bills', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'My Bills', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Water', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'STP', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Daily Readings', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Utility Consumption', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Utility Request', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Space', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Project Management', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Pms Incidents', all: true, add: true, view: true, edit: true, disable: true },
  { name: 'Site Dashboard', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Steppstone Dashboard', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Transport', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Waste Generation', all: true, add: true, view: true, edit: true, disable: true },
  { name: 'GDN', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Parking', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'GDN Dispatch', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'EV Consumption', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Msafe', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Permit Extend', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Local Travel Module', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'KRCC', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Training', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Approve Krcc', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Vi Register User', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Vi DeRegister User', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Line Manager Check', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Senior Management Tour', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Solar Generator', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Customer Permit', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Customer Parkings', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Customer Wallet', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Site Banners', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Testimonials', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Group And Channel Config', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Shared Content Config', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Site And Facility Config', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Occupant Users', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Clear SnagAnswers', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Non Re Users', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Download Msafe Report', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Download Msafe Detailed Report', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'training_list', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Vi Miles', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Krcc List', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Vi MSafe Dashboard', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Vi Miles Dashboard', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Resume Permit', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Permit Checklist', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Send To Sap', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Community Module', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Facility Setup', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Mail Room', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Parking Setup', all: false, add: false, view: false, edit: false, disable: false },
];

export const RoleDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Functions');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
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

  // Get permissions for the selected role, default to first role if none selected
  const currentRole = selectedRole || roles[0];
  const currentPermissions = currentRole?.permissions || defaultPermissions;

  const handleRoleClick = (role: Role) => {
    setSelectedRole(role);
  };

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
        
        const updatedRole = { ...role, permissions: updatedPermissions };
        
        // Update selected role if it's the one being modified
        if (selectedRole && selectedRole.id === roleId) {
          setSelectedRole(updatedRole);
        }
        
        return updatedRole;
      }
      return role;
    }));
  };

  const handleUpdatePermissions = () => {
    console.log('Updating permissions for role:', currentRole);
    // Here you would typically save to backend
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
                  onClick={() => handleRoleClick(role)}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    currentRole?.id === role.id 
                      ? 'bg-[#C72030] text-white border-[#C72030]' 
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium">
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
            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 w-48"></TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">All</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Add</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">View</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Edit</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Disable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPermissions.map((permission) => (
                    <TableRow key={permission.name} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.all}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(currentRole.id, permission.name, 'all', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.add}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(currentRole.id, permission.name, 'add', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.view}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(currentRole.id, permission.name, 'view', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.edit}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(currentRole.id, permission.name, 'edit', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={permission.disable}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(currentRole.id, permission.name, 'disable', checked as boolean)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Update Button */}
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleUpdatePermissions}
                className="bg-[#C72030] hover:bg-[#A11D2A] text-white"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
