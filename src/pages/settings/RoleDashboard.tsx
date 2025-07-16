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

  // Helper function to map API permission key to function name
  const mapApiKeyToFunctionName = (apiKey: string): string => {
    // Create mapping for common API keys to function names
    const mapping: { [key: string]: string } = {
      'pms_notices': 'Broadcast',
      'pms_complaints': 'Tickets', 
      'pms_documents': 'Documents',
      'pms_supplier': 'Supplier',
      'pms_tasks': 'Tasks',
      'pms_services': 'Service',
      'pms_energy': 'Meters',
      'pms_asset_amcs': 'AMC',
      'pms_assets': 'Asset',
      'pms_materials': 'Materials',
      'pms_purchase_orders': 'PO',
      'pms_work_orders': 'WO',
      'pms_complaint_reports': 'Report',
      'pms_attendances': 'Attendance',
      'pms_business_directories': 'Business Directory',
      'pms_purchase_orders_approval': 'PO Approval',
      'pms_dashboard': 'Dashboard',
      'pms_tracings': 'Tracing',
      'pms_bi_reports': 'BI Reports',
      'pms_restaurants': 'Restaurants',
      'pms_my_ledgers': 'My Ledgers',
      'pms_loi': 'Letter Of Indent',
      'pms_work_order_invoices': 'Wo Invoices',
      'pms_bills': 'Bill',
      'pms_engineering_reports': 'Engineering Reports',
      'pms_events': 'Events',
      'customers': 'Customers',
      'quikgate_report': 'QuickGate Report',
      'task_management': 'Task Management',
      'pms_ceo_dashboard': 'CEO Dashboard',
      'operational_audits': 'Operational Audit',
      'mom_details': 'Mom Details',
      'pms_design_inputs': 'Pms Design Inputs',
      'vendor_audit': 'Vendor Audit',
      'permits': 'Permits',
      'pending_approvals': 'Pending Approvals',
      'accounts': 'Accounts',
      'customer_bills': 'Customer Bills',
      'my_bills': 'My Bills',
      'pms_water': 'Water',
      'pms_stp': 'STP',
      'daily_readings': 'Daily Readings',
      'utility_consumption': 'Utility Consumption',
      'utility_request': 'Utility Request',
      'space': 'Space',
      'project_management': 'Project Management',
      'pms_incidents': 'Pms Incidents',
      'site_dashboard': 'Site Dashboard',
      'stepathone_dashboard': 'Steppstone Dashboard',
      'transport': 'Transport',
      'waste_generation': 'Waste Generation',
      'gdn': 'GDN',
      'parking': 'Parking',
      'gdn_dispatch': 'GDN Dispatch',
      'pms_inventories': 'Inventory',
      'pms_grns': 'GRN',
      'pms_srns': 'SRNS',
      'pms_accounts': 'Accounts',
      'pms_consumption': 'Consumption',
      'pms_setup': 'Account',
      'pms_user_roles': 'User & Roles',
      'pms_meter_types': 'Meter Types',
      'pms_asset_groups': 'Asset Groups',
      'pms_helpdesk_categories': 'Ticket',
      'pms_email_rule_setup': 'Email Rule',
      'pms_usergroups': 'FM Groups',
      'pms_export': 'Export',
      'pms_hsns': 'SAC/HSN Setup',
      'pms_billing_addresses': 'Addresses',
      'pms_master_checklist': 'Master Checklist',
      'pms_visitors': 'Visitors',
      'pms_rvehicles': 'R Vehicles',
      'pms_gvehicles': 'G Vehicles',
      'pms_staffs': 'Staffs',
      'goods_in_out': 'Goods In Out',
      'pms_patrolling': 'Patrolling'
    };
    
    return mapping[apiKey] || apiKey;
  };

  // Initialize permissions for roles when functions are loaded
  useEffect(() => {
    if (functions.length > 0 && roles.length > 0) {
      const initialPermissions: { [roleId: number]: { [tab: string]: Permission[] } } = {};
      
      roles.forEach(role => {
        initialPermissions[role.id] = {};
        
        // Parse permissions_hash from API
        let rolePermissionsData: any = {};
        try {
          const permissionsHashValue = role.permissions_hash || '{}';
          const parsedData = JSON.parse(permissionsHashValue);
          // Handle case where JSON.parse returns null (when permissions_hash is "null" string)
          rolePermissionsData = parsedData && typeof parsedData === 'object' ? parsedData : {};
        } catch (error) {
          console.error('Error parsing permissions_hash for role:', role.name, error);
          rolePermissionsData = {};
        }
        
        tabs.forEach(tab => {
          initialPermissions[role.id][tab] = functions
            .filter(func => func.parent_function === tab)
            .map(func => {
              // Look for matching API permission using the function name directly 
              // or try to find by mapped name
              let apiPermissions: any = {};
              
              // First try direct match with function name
              if (rolePermissionsData[func.name]) {
                apiPermissions = rolePermissionsData[func.name];
              } else {
                // Try to find by reverse mapping - look for API key that maps to this function name
                const apiKey = Object.keys(rolePermissionsData).find(key => 
                  mapApiKeyToFunctionName(key) === func.name
                );
                if (apiKey) {
                  apiPermissions = rolePermissionsData[apiKey];
                }
              }
              
              return {
                name: func.name,
                all: apiPermissions.all === "true",
                add: apiPermissions.create === "true", 
                view: apiPermissions.show === "true",
                edit: apiPermissions.update === "true",
                disable: apiPermissions.destroy === "true"
              };
            });
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
