
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Permission {
  name: string;
  all: boolean;
  add: boolean;
  view: boolean;
  edit: boolean;
  disable: boolean;
}

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (roleName: string, permissions: Permission[]) => void;
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
  { name: 'Occupant Users', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Approval Matrix', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Patrolling Approval Matrix', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Email Rule', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Fm Group', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Sac Hsn', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Address', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Export', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Task Escalation', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Ticket Setup', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Checklist Group', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Asset Group', all: false, add: false, view: false, edit: false, disable: false },
];

const quickgatePermissions: Permission[] = [
  { name: 'Visitors', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'R Vehicles', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'G Vehicles', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Staffs', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Goods In Out', all: false, add: false, view: false, edit: false, disable: false },
  { name: 'Patrolling', all: false, add: false, view: false, edit: false, disable: false },
];

export const AddRoleDialog = ({ open, onOpenChange, onSubmit }: AddRoleDialogProps) => {
  const [roleTitle, setRoleTitle] = useState('');
  const [activeTab, setActiveTab] = useState('All Functions');
  const [allFunctionsEnabled, setAllFunctionsEnabled] = useState(false);
  const [inventoryEnabled, setInventoryEnabled] = useState(false);
  const [setupEnabled, setSetupEnabled] = useState(false);
  const [quickgateEnabled, setQuickgateEnabled] = useState(false);
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

  const handleSubmit = () => {
    if (roleTitle.trim()) {
      onSubmit(roleTitle, permissions['All Functions']);
      setRoleTitle('');
      setPermissions({
        'All Functions': [...allFunctionsPermissions],
        'Inventory': [...inventoryPermissions],
        'Setup': [...setupPermissions],
        'Quickgate': [...quickgatePermissions],
      });
      setAllFunctionsEnabled(false);
      setInventoryEnabled(false);
      setSetupEnabled(false);
      setQuickgateEnabled(false);
      onOpenChange(false);
    }
  };

  const handleBack = () => {
    setRoleTitle('');
    setPermissions({
      'All Functions': [...allFunctionsPermissions],
      'Inventory': [...inventoryPermissions],
      'Setup': [...setupPermissions],
      'Quickgate': [...quickgatePermissions],
    });
    setAllFunctionsEnabled(false);
    setInventoryEnabled(false);
    setSetupEnabled(false);
    setQuickgateEnabled(false);
    onOpenChange(false);
  };

  const getTabEnabled = (tab: string) => {
    if (tab === 'All Functions') return allFunctionsEnabled;
    if (tab === 'Inventory') return inventoryEnabled;
    if (tab === 'Setup') return setupEnabled;
    if (tab === 'Quickgate') return quickgateEnabled;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Role</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
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
          <div className="flex gap-6 flex-1 overflow-hidden">
            {/* Left Sidebar with Tab Checkboxes */}
            <div className="w-80 bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {tabs.map((tab) => (
                  <div key={tab} className="flex items-center space-x-2">
                    <Checkbox
                      id={tab}
                      checked={getTabEnabled(tab)}
                      onCheckedChange={(checked) => handleTabOverallChange(tab, checked as boolean)}
                    />
                    <label
                      htmlFor={tab}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 overflow-hidden">
              {/* Active Tab Header */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{activeTab}</h3>
              </div>

              {/* Permissions Table */}
              <div className="border rounded-lg overflow-hidden h-full flex flex-col">
                <div className="overflow-auto flex-1">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 w-48">Function</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">All</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">Add</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">View</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">Edit</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">Disable</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions[activeTab]?.map((permission) => (
                        <TableRow key={permission.name} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{permission.name}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.all}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(activeTab, permission.name, 'all', checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.add}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(activeTab, permission.name, 'add', checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.view}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(activeTab, permission.name, 'view', checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.edit}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(activeTab, permission.name, 'edit', checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={permission.disable}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(activeTab, permission.name, 'disable', checked as boolean)
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="px-6"
            >
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#A11D2A] text-white px-6"
              disabled={!roleTitle.trim()}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
