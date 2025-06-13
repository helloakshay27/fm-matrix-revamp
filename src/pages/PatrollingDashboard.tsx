
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Copy, Trash2, Plus, Download, Upload, Printer, Filter } from 'lucide-react';
import { AddPatrollingModal } from '@/components/AddPatrollingModal';
import { PatrollingFilterModal } from '@/components/PatrollingFilterModal';

export const PatrollingDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const patrollingData = [
    {
      id: 1,
      location: 'Site - Lockated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA',
      time: '7:00 AM, 3:00 PM, 11:00 PM'
    },
    {
      id: 2,
      location: 'Site - Lockated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA',
      time: '12:00 AM, 1:00 AM, 2:00 AM, 3:00 AM, 4:00 AM, 5:00 AM'
    },
    {
      id: 3,
      location: 'Site - Lockated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA',
      time: '5:00 PM, 6:00 PM, 7:00 PM'
    },
    {
      id: 4,
      location: 'Site - Lockated / Building - Hay / Wing - NA / Floor - NA / Room - NA',
      time: '12:00 AM, 4:00 AM, 8:00 AM, 12:00 PM, 4:00 PM, 8:00 PM'
    },
    {
      id: 5,
      location: 'Site - Lockated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA',
      time: '12:00 AM, 5:00 AM, 10:00 AM, 3:00 PM, 8:00 PM'
    },
    {
      id: 6,
      location: 'Site - Lockated / Building - Nirvana Tower / Wing - B / Floor - NA / Room - NA',
      time: '2:00 PM, 4:00 PM, 3:00 PM'
    },
    {
      id: 7,
      location: 'Site - Lockated / Building - Nirvana Tower / Wing - A Wing / Floor - 1st flooor / Room - NA',
      time: '2:00 PM, 5:00 PM, 9:00 PM'
    }
  ];

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Patrolling</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">PATROLLING LIST</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
            <Button
              variant="outline"
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white border-[#8B4B8C] flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button
              variant="outline"
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white border-[#8B4B8C] flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white border-[#8B4B8C] flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print QR
            </Button>
            <Button
              variant="outline"
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white border-[#8B4B8C] flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print All QR
            </Button>
            <Button
              onClick={() => setIsFilterModalOpen(true)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patrollingData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-600">{item.location}</TableCell>
                    <TableCell>{item.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AddPatrollingModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      <PatrollingFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  );
};
