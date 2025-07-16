import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { roleService, ApiRole } from '@/services/roleService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRoles, updateRolePermissions } from '@/store/slices/roleSlice';
import { fetchFunctions } from '@/store/slices/functionSlice';

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
  permissions: {
    [key: string]: Permission[];
  };
}

const allFunctionsPermissions: Permission[] = [
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

const inventoryPermissions: Permission[] = [
  { name: 'Inventory', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'GRN', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'SRNS', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Accounts', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Consumption', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Update Partial Inventory', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Update All Inventory', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Clone Inventory', all: false, add: false, view: false, edit: false, disable: false },
];

const setupPermissions: Permission[] = [
  { name: 'Account', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'User & Roles', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Meter Types', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Asset Groups', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Ticket', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Email Rule', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'FM Groups', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Export', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'SAC/HSN Setup', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Addresses', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Master Checklist', all: false, add: false, view: false, edit: false, disable: false },
];

const quickgatePermissions: Permission[] = [
  { name: 'Visitors', all: true, add: false, view: true, edit: false, disable: false },
  { name: 'R Vehicles', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'G Vehicles', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Staffs', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Goods In Out', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Patrolling', all: false, add: false, view: false, edit: false, disable: false },
];

export const RoleDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { roles, loading, error } = useAppSelector((state) => state.role);
  const { functions, loading: functionsLoading } = useAppSelector((state) => state.function);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all_functions');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<{ [roleId: number]: { [tab: string]: Permission[] } }>({});

  // Fetch roles and functions from API
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchFunctions());
  }, [dispatch]);

  // Initialize permissions for roles when functions are loaded
  useEffect(() => {
    if (functions.length > 0 && roles.length > 0) {
      const initialPermissions: { [roleId: number]: { [tab: string]: Permission[] } } = {};
      
      roles.forEach(role => {
        initialPermissions[role.id] = {};
        tabs.forEach(tab => {
          initialPermissions[role.id][tab] = functions
            .filter(func => func.parent_function === tab)
            .map(func => ({
              name: func.name,
              all: false,
              add: false,
              view: false,
              edit: false,
              disable: false
            }));
        });
      });
      
      setRolePermissions(initialPermissions);
    }
  }, [functions, roles]);

  // Get unique parent_function values as tabs
  const tabs = ['all_functions', 'inventory', 'setup', 'quickgate'];
  const tabLabels = ['All Functions', 'Inventory', 'Setup', 'Quickgate'];

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get permissions for the selected role, default to first role if none selected
  const currentRole = selectedRole || roles[0];
  const currentPermissions = currentRole && rolePermissions[currentRole.id] 
    ? rolePermissions[currentRole.id][activeTab] || []
    : [];

  const handleRoleClick = (role: Role) => {
    setSelectedRole(role);
  };

  const handleAddRole = () => {
    console.log('Navigating to Add Role page...');
    navigate('/settings/roles/role/add');
  };

  const handleSearchRole = () => {
    console.log('Searching roles with term:', searchTerm);
    // Search functionality is already handled by filteredRoles
  };

  const handlePermissionChange = (roleId: number, permissionName: string, field: keyof Permission, value: boolean) => {
    if (!rolePermissions[roleId] || !rolePermissions[roleId][activeTab]) return;

    const updatedPermissions = rolePermissions[roleId][activeTab].map(permission => {
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

    // Update local state
    setRolePermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [activeTab]: updatedPermissions
      }
    }));
  };

  const handleUpdatePermissions = () => {
    if (!currentRole) return;
    
    const permissions = rolePermissions[currentRole.id]?.[activeTab] || [];
    console.log('Updating permissions for role:', currentRole);
    console.log('Active tab:', activeTab);
    console.log('Permissions:', permissions);
    alert(`Permissions updated for ${currentRole.name} in ${tabLabels[tabs.indexOf(activeTab)]} tab`);
    // Here you would typically save to backend
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">ROLE</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        {/* Header with Add Role button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Button 
            onClick={handleAddRole}
            className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            placeholder="Search Role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <Button 
            onClick={handleSearchRole}
            className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Role
          </Button>
        </div>

        {/* Responsive Layout: Stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Panel - Roles List */}
          <div className="w-full xl:w-80 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Roles List</h3>
            <div className="space-y-2 max-h-64 xl:max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="text-gray-500">Loading roles...</div>
                </div>
              ) : filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
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
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">No roles found</div>
              )}
            </div>
          </div>

          {/* Right Panel - Permissions Matrix */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Permissions for: {currentRole?.name}
            </h3>
            
            {/* Tabs - Responsive scrolling */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 lg:px-4 py-2 rounded border text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-[#C72030] text-white border-[#C72030]'
                      : 'bg-white text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10'
                  }`}
                >
                  {tabLabels[index]}
                </button>
              ))}
            </div>

            {/* Permissions Table - Responsive with horizontal scroll */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <div className="max-h-64 lg:max-h-96 overflow-y-auto">
                  <Table className="min-w-full">
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 min-w-[200px] lg:w-48 text-xs lg:text-sm">
                          Permission
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                          All
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                          Add
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                          View
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                          Edit
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[70px] text-xs lg:text-sm">
                          Disable
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {functionsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            Loading functions...
                          </TableCell>
                        </TableRow>
                      ) : currentPermissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                            No functions found for this category
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentPermissions.map((permission) => (
                        <TableRow key={permission.name} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-xs lg:text-sm py-2 lg:py-3">
                            {permission.name}
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.all}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'all', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.add}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'add', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.view}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'view', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.edit}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'edit', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.disable}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'disable', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Update Button */}
            <div className="mt-4 flex flex-col sm:flex-row justify-end">
              <Button 
                onClick={handleUpdatePermissions}
                className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
              >
                Update Permissions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
