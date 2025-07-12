
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Pencil, Plus } from 'lucide-react';

const emailRuleData = [
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
    periodValue: '7 Days',
    periodType: 'days',
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
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">
          Setup &gt; Email Room
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          PPM/AMC REMINDER EMAIL RULE SETUP
        </h1>
        
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Edit</TableHead>
              <TableHead className="w-16">Sr.No.</TableHead>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Rule Name</TableHead>
              <TableHead>Trigger Type</TableHead>
              <TableHead>Trigger To</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Period Value</TableHead>
              <TableHead>Period Type</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emailRuleData.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>{rule.srNo}</TableCell>
                <TableCell>{rule.id}</TableCell>
                <TableCell className="font-medium">{rule.ruleName}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rule.triggerType === 'AMC' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {rule.triggerType}
                  </span>
                </TableCell>
                <TableCell>{rule.triggerTo}</TableCell>
                <TableCell>{rule.role}</TableCell>
                <TableCell>{rule.periodValue}</TableCell>
                <TableCell>{rule.periodType}</TableCell>
                <TableCell className="text-sm text-gray-600">{rule.createdOn}</TableCell>
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
  );
};
