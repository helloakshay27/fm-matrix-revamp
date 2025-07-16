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
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { roleService, CreateRolePayload, LockFunction } from '@/services/roleService';

interface Permission {
  name: string;
  all: boolean;
  add: boolean;
  view: boolean;
  edit: boolean;
  disable: boolean;
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
  { name: 'Pms Incidents', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Site Dashboard', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Steppstone Dashboard', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Transport', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Waste Generation', all: false, add: false, view: false, edit: false, disable: false },
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
  { name: 'Visitors', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'R Vehicles', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'G Vehicles', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Staffs', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Goods In Out', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Patrolling', all: false, add: false, view: false, edit: false, disable: false },
];

export const AddRolePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roleTitle, setRoleTitle] = useState('');
  const [activeTab, setActiveTab] = useState('All Functions');
  const [allFunctionsEnabled, setAllFunctionsEnabled] = useState(false);
  const [inventoryEnabled, setInventoryEnabled] = useState(false);
  const [setupEnabled, setSetupEnabled] = useState(false);
  const [quickgateEnabled, setQuickgateEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions, setPermissions] = useState<{ [key: string]: Permission[] }>({
    'All Functions': [...allFunctionsPermissions],
    'Inventory': [...inventoryPermissions],
    'Setup': [...setupPermissions],
    'Quickgate': [...quickgatePermissions],
  });

  const tabs = ['All Functions', 'Inventory', 'Setup', 'Quickgate'] as const;

  const handleTabOverallChange = (tab: string, enabled: boolean) => {
    if (tab === 'All Functions') setAllFunctionsEnabled(enabled);
    if (tab === 'Inventory') setInventoryEnabled(enabled);
    if (tab === 'Setup') setSetupEnabled(enabled);
    if (tab === 'Quickgate') setQuickgateEnabled(enabled);

    setPermissions(prev => ({
      ...prev,
      [tab]: prev[tab].map(permission => ({
        ...permission,
        all: enabled,
        add: enabled,
        view: enabled,
        edit: enabled,
        disable: enabled,
      }))
    }));
  };

  const handlePermissionChange = (tab: string, permissionName: string, field: keyof Permission, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [tab]: prev[tab].map(permission => {
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
      })
    }));
  };

  const handleSubmit = async () => {
    if (!roleTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a role title.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transform permissions to API format
      const permissions_hash: Record<string, any> = {};
      let hasAnyPermission = false;
      
      Object.entries(permissions).forEach(([tabName, tabPermissions]) => {
        tabPermissions.forEach(permission => {
          if (permission.add || permission.view || permission.edit || permission.disable) {
            const actions: Record<string, string> = {};
            
            if (permission.view) actions.show = "true";
            if (permission.add) actions.create = "true";
            if (permission.edit) actions.update = "true";
            if (permission.disable) actions.destroy = "true";
            
            if (Object.keys(actions).length > 0) {
              // Use permission name as action_name for API
              permissions_hash[permission.name.toLowerCase().replace(/\s+/g, '_')] = actions;
              hasAnyPermission = true;
            }
          }
        });
      });
      
      // Create the API payload
      const payload: CreateRolePayload = {
        lock_role: {
          name: roleTitle.trim()
        },
        permissions_hash,
        lock_modules: 1,
        parent_function: hasAnyPermission
      };

      console.log('Creating role with payload:', payload);
      
      // Call the API
      const response = await roleService.createRole(payload);
      
      console.log('Role creation response:', response);
      
      toast({
        title: "Success",
        description: `Role "${roleTitle}" has been successfully created!`,
      });
      
      // Navigate back to roles list
      navigate('/settings/roles/role');
      
    } catch (error: any) {
      console.error('Error creating role:', error);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/settings/roles/role');
  };

  const getTabEnabled = (tab: string) => {
    if (tab === 'All Functions') return allFunctionsEnabled;
    if (tab === 'Inventory') return inventoryEnabled;
    if (tab === 'Setup') return setupEnabled;
    if (tab === 'Quickgate') return quickgateEnabled;
    return false;
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">Add New Role</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col gap-6">
          {/* Role Title Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="roleTitle" className="text-sm font-medium">
              Role Title
            </label>
            <Input
              id="roleTitle"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Enter role title"
              className="max-w-md"
            />
          </div>

          {/* Content Layout with Sidebar and Main Content */}
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Left Sidebar with Tab Checkboxes */}
            <div className="w-full xl:w-80 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Permission Categories</h3>
              <div className="space-y-3">
                {tabs.map((tab) => (
                  <div key={tab} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tab-${tab}`}
                      checked={getTabEnabled(tab)}
                      onCheckedChange={(checked) => handleTabOverallChange(tab, checked as boolean)}
                    />
                    <label
                      htmlFor={`tab-${tab}`}
                      className={`text-sm font-medium cursor-pointer ${
                        activeTab === tab ? 'text-[#C72030]' : 'text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Permissions Table */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Permissions for: {activeTab}
              </h3>
              
              {/* Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 lg:px-4 py-2 rounded border text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
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
                        {permissions[activeTab]?.map((permission) => (
                          <TableRow key={permission.name} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-xs lg:text-sm py-2 lg:py-3">
                              {permission.name}
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.all}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.name, 'all', checked as boolean)
                                  }
                                  className="w-4 h-4"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.add}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.name, 'add', checked as boolean)
                                  }
                                  className="w-4 h-4"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.view}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.name, 'view', checked as boolean)
                                  }
                                  className="w-4 h-4"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.edit}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.name, 'edit', checked as boolean)
                                  }
                                  className="w-4 h-4"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.disable}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.name, 'disable', checked as boolean)
                                  }
                                  className="w-4 h-4"
                                />
                              </div>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Role'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};