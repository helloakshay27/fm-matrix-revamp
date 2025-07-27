import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Dummy data for demonstration
const dates = [
  '16 Jul 2025', '17 Jul 2025', '18 Jul 2025', '19 Jul 2025', '20 Jul 2025', '21 Jul 2025', '22 Jul 2025', '23 Jul 2025', '24 Jul 2025', '25 Jul 2025'
];
const activities = [
  'Has the exposed terrace slab been checked for waterproofing?',
  'Have the utility shaft space slab waterproofing checks been completed?',
  'Have the louvers been installed on the terrace shaft space openings?',
  'Have the window/facade glass been inspected for panes, cracks, locks, gaps, and sealing?',
  'Please assess the potential for water infiltration / ingress along ventilation ducts, both internally and externally.',
  'Has the building elevation joint in the shaft spaces been checked for leaks?',
  'Have leaks, loose tiles, or damaged shingles been inspected to prevent water seepage?',
  'Have drains and stormwater systems been inspected to confirm they are clear and functioning properly?',
  'Has the STP drainage line and overflow been checked?'
];

export const ViewPerformancePage = () => {
  return (
    <div className="p-6 mx-auto">
      <div className="flex gap-4 mb-4">
        <Input type="date" className="w-48 border border-gray-300 rounded" defaultValue="2025-07-16" />
        <Input type="date" className="w-48 border border-gray-300 rounded" defaultValue="2025-07-25" />
        <Input type="text" className="w-64 border border-gray-300 rounded" placeholder="Pre Monsoon" />
        <Button className="bg-green-600 text-white px-6">Apply</Button>
        <Button className="bg-yellow-500 text-white px-6">Reset</Button>
        <Button className="bg-[#3B82F6] text-white px-6">Export</Button>
        <Button className="bg-[#2563EB] text-white px-6">Verify</Button>
        <Button className="bg-[#2563EB] text-white px-6">Download</Button>
      </div>
      <h2 className="text-xl font-bold mb-2 text-black">Pre Monsoon Checklist</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#334155] text-center border-r border-gray-300">Asset Name</TableHead>
              <TableHead className="bg-[#334155] text-center border-r border-gray-300">Activity</TableHead>
              {dates.map((date, idx) => (
                <TableHead key={idx} className="bg-[#F3F4F6] text-gray-900 text-center border-r border-gray-300">{date}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border-r border-gray-300 text-center font-semibold">Pre Monsoon</TableCell>
              <TableCell className="border-r border-gray-300"></TableCell>
              {dates.map((_, idx) => (
                <TableCell key={idx} className="border-r border-gray-300"></TableCell>
              ))}
            </TableRow>
            {activities.map((activity, idx) => (
              <TableRow key={idx}>
                <TableCell className="border-r border-gray-300"></TableCell>
                <TableCell className="border-r border-gray-300 text-left">{activity}</TableCell>
                {dates.map((_, dIdx) => (
                  <TableCell key={dIdx} className="border-r border-gray-300"></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViewPerformancePage;
