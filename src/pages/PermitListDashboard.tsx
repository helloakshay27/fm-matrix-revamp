
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Filter, FileCheck, Clock, HourglassIcon, CheckCircle, XCircle, RotateCcw, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PermitFilterModal } from '@/components/PermitFilterModal';

const statsData = [
  { label: 'Total Permits', count: 0, icon: FileCheck },
  { label: 'Draft Permits', count: 0, icon: Clock },
  { label: 'Hold Permits', count: 0, icon: HourglassIcon },
  { label: 'Open Permits', count: 0, icon: Clock },
  { label: 'Approved Permits', count: 0, icon: CheckCircle },
  { label: 'Rejected Permits', count: 0, icon: XCircle },
  { label: 'Extended Permits', count: 0, icon: RotateCcw },
  { label: 'Closed Permits', count: 0, icon: Archive },
];


export const PermitListDashboard = () => {
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleAddPermit = () => {
    navigate('/maintenance/permit/add');
  };

  const handleFilterApply = (filterData: any) => {
    console.log('Applied filters:', filterData);
    // Apply the filters to the data
  };

  const handleStatsCardClick = (label: string) => {
    setSelectedFilter(label);
    console.log('Filter by:', label);
    // Filter the table data based on the selected card
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Permit</span>
          <span className="mx-2">{'>'}</span>
          <span>Permit List</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Permit LIST</h1>
      </div>

      {/* Stats Cards */}
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
  {statsData.map((stat, index) => (
    <Card 
      key={index} 
      className={`
        relative overflow-hidden cursor-pointer transition-all
        bg-[#F2F0EB] text-[#D92818] shadow-[0px_2px_18px_rgba(45,45,45,0.1)]
        md:h-[132px] flex flex-col justify-between
      `}
      onClick={() => handleStatsCardClick(stat.label)}
    >
      <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-[#F2F0EB]">
              <stat.icon className="w-6 h-6 text-[#D92818]" />
    </div>

          <div className="text-right">
            <div className="text-2xl font-bold">{stat.count}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm font-medium text-[#1a1a1a]/70">{stat.label}</div>
      </CardContent>
    </Card>
  ))}
</div>


      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button 
          onClick={handleAddPermit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button 
          onClick={() => setShowFilterModal(true)}
          variant="outline"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Permit To Complete Badge */}
      <div className="flex justify-end mb-4">
        <div className="text-[#C72030] px-3 py-1 border border-[#C72030] text-sm font-medium">
          Permit To Complete
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Ref No.</TableHead>
              <TableHead>Permit Type</TableHead>
              <TableHead>Permit For</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Permit Expiry/Extend Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                No permits found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <PermitFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
};

export default PermitListDashboard;
