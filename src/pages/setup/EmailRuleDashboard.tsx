
import React, { useState } from 'react';
import { Plus, Edit, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const emailRuleData = [
  {
    id: 1,
    srNo: 1,
    ruleId: 105,
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
    id: 2,
    srNo: 2,
    ruleId: 104,
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
    active: true
  },
  {
    id: 4,
    srNo: 4,
    ruleId: 101,
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

export const EmailRuleDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = emailRuleData.filter(rule =>
    rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.triggerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.triggerTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: number) => {
    // Handle status toggle logic here
    console.log(`Toggle status for rule ${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f6f4ee]">
      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b border-gray-200">
        <div className="text-sm text-gray-600">
          Setup &gt; Email Room
        </div>
      </div>

      {/* Header */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            PPM/AMC REMINDER EMAIL RULE SETUP
          </h1>
          <Button className="bg-[#8B4513] hover:bg-[#6B3410] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
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
              {filteredData.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{rule.srNo}</TableCell>
                  <TableCell>{rule.ruleId}</TableCell>
                  <TableCell className="font-medium">{rule.ruleName}</TableCell>
                  <TableCell>{rule.triggerType}</TableCell>
                  <TableCell>{rule.triggerTo}</TableCell>
                  <TableCell>{rule.role}</TableCell>
                  <TableCell>{rule.periodValue}</TableCell>
                  <TableCell>{rule.periodType}</TableCell>
                  <TableCell>{rule.createdOn}</TableCell>
                  <TableCell>{rule.createdBy}</TableCell>
                  <TableCell>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={rule.active}
                        onChange={() => toggleStatus(rule.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
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
