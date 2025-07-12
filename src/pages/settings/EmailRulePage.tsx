
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Plus } from 'lucide-react';

const mockEmailRules = [
  {
    srNo: 1,
    id: 105,
    ruleName: 'Monthly Shop Rent',
    triggerType: 'AMC',
    triggerTo: 'Supplier',
    role: '',
    periodValue: 15,
    periodType: 'days',
    createdOn: '25/05/2023, 4:58 PM',
    createdBy: 'Abdul A',
    active: true
  },
  {
    srNo: 2,
    id: 104,
    ruleName: 'Hotechnical',
    triggerType: 'PPM',
    triggerTo: 'Occupant Admin',
    role: '',
    periodValue: 2,
    periodType: 'days',
    createdOn: '15/11/2022, 11:15 AM',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    srNo: 3,
    id: 103,
    ruleName: 'PPM Scheduler Email',
    triggerType: 'PPM',
    triggerTo: 'Supplier',
    role: '',
    periodValue: 7,
    periodType: 'Days',
    createdOn: '11/11/2022, 2:50 PM',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    srNo: 4,
    id: 101,
    ruleName: 'AMC Trigger',
    triggerType: 'AMC',
    triggerTo: 'Supplier',
    role: '',
    periodValue: 5,
    periodType: 'days',
    createdOn: '11/08/2022, 12:02 PM',
    createdBy: 'Robert Day2',
    active: true
  }
];

export const EmailRulePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="text-sm text-gray-600 mb-2">
            Setup &gt; Email Room
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            PPM/AMC REMINDER EMAIL RULE SETUP
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Add Button */}
        <div className="mb-6">
          <Button 
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Edit</TableHead>
                <TableHead className="w-20">Sr.No.</TableHead>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Rule Name</TableHead>
                <TableHead>Trigger Type</TableHead>
                <TableHead>Trigger To</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Period Value</TableHead>
                <TableHead>Period Type</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="w-20">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEmailRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{rule.srNo}</TableCell>
                  <TableCell>{rule.id}</TableCell>
                  <TableCell className="font-medium">{rule.ruleName}</TableCell>
                  <TableCell>{rule.triggerType}</TableCell>
                  <TableCell>{rule.triggerTo}</TableCell>
                  <TableCell>{rule.role}</TableCell>
                  <TableCell>{rule.periodValue}</TableCell>
                  <TableCell>{rule.periodType}</TableCell>
                  <TableCell>{rule.createdOn}</TableCell>
                  <TableCell>{rule.createdBy}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={rule.active}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
