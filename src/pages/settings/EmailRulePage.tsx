
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface EmailRule {
  id: number;
  srNo: number;
  ruleId: number;
  ruleName: string;
  triggerType: 'PPM' | 'AMC';
  triggerTo: string;
  role: string;
  periodValue: string;
  periodType: string;
  createdOn: string;
  createdBy: string;
  active: boolean;
}

const mockEmailRules: EmailRule[] = [
  {
    id: 1,
    srNo: 1,
    ruleId: 105,
    ruleName: 'Monthly Shop Rent',
    triggerType: 'AMC',
    triggerTo: 'Supplier',
    role: '',
    periodValue: '15',
    periodType: 'days',
    createdOn: '25/05/2023, 4:58 PM',
    createdBy: 'Abdul A',
    active: true,
  },
  {
    id: 2,
    srNo: 2,
    ruleId: 104,
    ruleName: 'Hotechnical',
    triggerType: 'PPM',
    triggerTo: 'Occupant Admin',
    role: '',
    periodValue: '2',
    periodType: 'days',
    createdOn: '15/11/2022, 11:15 AM',
    createdBy: 'Robert Day2',
    active: true,
  },
  {
    id: 3,
    srNo: 3,
    ruleId: 103,
    ruleName: 'PPM Scheduler Email',
    triggerType: 'PPM',
    triggerTo: 'Supplier',
    role: '',
    periodValue: '7 Days',
    periodType: 'days',
    createdOn: '11/11/2022, 2:50 PM',
    createdBy: 'Robert Day2',
    active: true,
  },
  {
    id: 4,
    srNo: 4,
    ruleId: 101,
    ruleName: 'AMC Trigger',
    triggerType: 'AMC',
    triggerTo: 'Supplier',
    role: '',
    periodValue: '5',
    periodType: 'days',
    createdOn: '11/08/2022, 12:02 PM',
    createdBy: 'Robert Day2',
    active: true,
  },
];

export const EmailRulePage = () => {
  const [emailRules] = useState<EmailRule[]>(mockEmailRules);

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Setup &gt; Email Room</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          PPM/AMC REMINDER EMAIL RULE SETUP
        </h1>
        
        <Button 
          className="mb-6 bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Edit</TableHead>
              <TableHead className="w-20">Sr.No.</TableHead>
              <TableHead className="w-20">ID</TableHead>
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
            {emailRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>{rule.srNo}</TableCell>
                <TableCell>{rule.ruleId}</TableCell>
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
                  <div className="flex items-center">
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                      rule.active ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        rule.active ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
