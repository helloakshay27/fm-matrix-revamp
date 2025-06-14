
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Permission {
  function: string;
  all: boolean;
  add: boolean;
  view: boolean;
  edit: boolean;
  disable: boolean;
}

export const AddRoleDashboard = () => {
  const [roleTitle, setRoleTitle] = useState('');
  
  const [permissions, setPermissions] = useState<Permission[]>([
    { function: 'Broadcast', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Asset', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Documents', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Tickets', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Supplier', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Tasks', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Service', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Meters', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'AMC', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Schedule', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Materials', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'PO', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'WO', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Report', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Attendance', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Business Directory', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'PO Approval', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Dashboard', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Tracking', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Bi Reports', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Restaurants', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'My Legders', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Letter Of Indent', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Wo Invoices', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Bill', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Engineering Reports', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Events', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Customers', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'QuikGate Report', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Task Management', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'CEO Dashboard', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Operational Audit', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Mom Details', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Pms Design Inputs', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Vendor Audit', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Permits', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Pending Approvals', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Accounts', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Customer Bills', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'My Bills', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Water', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'STP', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Daily Readings', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Utility Consumption', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Utility Request', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Space', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Project Management', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Pms Incidents', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Site Dashboard', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Standalone Dashboard', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Transport', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Waste Generation', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'GDN', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Parking', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'GDN Dispatch', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'EV Consumption', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Msafe', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'EV Consumption', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Permit Extend', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Local Travel Module', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'KRCC', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Training', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Approve Krcc', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Vi Register User', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Vi DeRegister User', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Line Manager Check', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Senior Management Tour', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Solar Generator', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Customer Permit', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Customer Parkings', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Customer Wallet', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Site Banners', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Testimonials', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Group And Channel Config', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Shared Content Config', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Site And Facility Config', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Occupant Users', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Clear SnagAnswers', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Non Pie Users', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Download Msafe Report', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Download Msafe Detailed Report', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'training_list', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Vi Miles', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Krcc List', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Vi MSafe Dashboard', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Vi Miles Dashboard', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Resume Permit', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Permit Checklist', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Send To Sap', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Transport', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Community Module', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Facility Setup', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Mail Room', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Parking', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Parking Setup', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Inventory', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'GRN', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'SRNS', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Accounts', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Consumption', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Update Partial Inventory', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Update All Inventory', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Clone Inventory', all: false, add: false, view: false, edit: false, disable: false },
    { function: 'Account', all: false, add: false, view: false, edit: false, disable: false },
  ]);

  const handlePermissionChange = (index: number, field: keyof Permission, checked: boolean) => {
    const newPermissions = [...permissions];
    
    if (field === 'all') {
      // If "All" is checked/unchecked, update all other permissions for this row
      newPermissions[index] = {
        ...newPermissions[index],
        all: checked,
        add: checked,
        view: checked,
        edit: checked,
        disable: checked,
      };
    } else {
      // Update specific permission
      newPermissions[index] = {
        ...newPermissions[index],
        [field]: checked,
      };
      
      // Update "All" checkbox based on other permissions
      const otherPerms = ['add', 'view', 'edit', 'disable'] as const;
      const allChecked = otherPerms.every(perm => 
        perm === field ? checked : newPermissions[index][perm]
      );
      newPermissions[index].all = allChecked;
    }
    
    setPermissions(newPermissions);
  };

  const handleSubmit = () => {
    console.log('Role Title:', roleTitle);
    console.log('Permissions:', permissions);
    // Handle form submission
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          Account &gt; Role &gt; Add New Role
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Add New Role</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Role Title Input */}
          <div className="mb-6">
            <Label htmlFor="roleTitle" className="text-sm font-medium mb-2 block">
              Role Title
            </Label>
            <Input
              id="roleTitle"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Enter role title"
              className="max-w-md"
            />
          </div>

          {/* Permissions Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Function</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">All</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Add</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">View</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Edit</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Disable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{permission.function}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.all}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(index, 'all', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.add}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(index, 'add', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.view}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(index, 'view', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.edit}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(index, 'edit', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.disable}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(index, 'disable', checked as boolean)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </SetupLayout>
  );
};
