
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Mail, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { NonFTEImportModal } from '@/components/NonFTEImportModal';
import { NonFTEEmailModal } from '@/components/NonFTEEmailModal';
import { NonFTEFiltersModal } from '@/components/NonFTEFiltersModal';

export const NonFTEUsersDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  const users = [
    { name: "Anand Babu Pawar", gender: "Male", mobile: "8355857800", email: "anandpawar54136@gmail.com", department: "FM", role: "Shift Engineer" },
    { name: "Tapish Choudhary", gender: "", mobile: "7701944124", email: "taapish@gmail.com", department: "", role: "" },
    { name: "Amrit kumar Gupta", gender: "", mobile: "9006485383", email: "amritkumargupta900@gmail.com", department: "", role: "" },
    { name: "Moiz Tuv", gender: "", mobile: "7411874016", email: "7411874016@gmail.com", department: "", role: "" },
    { name: "Maruf Khan", gender: "", mobile: "8808632149", email: "8808632149@gmail.com", department: "", role: "" },
    { name: "Shivam Kumar", gender: "", mobile: "9997888699", email: "shivam.kumar@godrejproperties.com", department: "", role: "" },
    { name: "Firasat Khan", gender: "", mobile: "7897365833", email: "firasatalkhan786@gmail.com", department: "", role: "" },
    { name: "Vineet Chauhan", gender: "", mobile: "8209305825", email: "vineet.chauhan@godrejproperties.com", department: "", role: "" },
    { name: "Avinash ashok kamble", gender: "", mobile: "9833842276", email: "9833842276@gmail.com", department: "", role: "" },
    { name: "Parveen KUMAR", gender: "", mobile: "9785669937", email: "9785669937@gmail.com", department: "", role: "" },
    { name: "Rajat Vats", gender: "", mobile: "9873077127", email: "rajat.vats99@gmail.com", department: "", role: "" },
    { name: "Yatendra Kumar", gender: "", mobile: "8851862487", email: "sscroseberry43@gmail.com", department: "", role: "" },
    { name: "Basant Basant", gender: "", mobile: "9756714143", email: "wrohl1484@gmail.com", department: "", role: "" },
    { name: "Aditya Dubey", gender: "", mobile: "7506336685", email: "site_aditya@deoalu.com", department: "", role: "" },
    { name: "Suraj Suraj", gender: "", mobile: "9588525727", email: "9588525727@gmail.com", department: "", role: "" },
    { name: "Pravin Rathod", gender: "", mobile: "9075263979", email: "pravinrathod227@gmail.com", department: "", role: "" },
    { name: "Amol Amol", gender: "", mobile: "7887755309", email: "7887755309@gmail.com", department: "", role: "" },
    { name: "Shanu Kumar", gender: "", mobile: "7708165456", email: "shanu.kumar@tuvindia.co.in", department: "", role: "" },
    { name: "Sai Satyaranjan", gender: "", mobile: "8847821601", email: "sai.satyaranjan@tuvindia.co.in", department: "", role: "" },
    { name: "Devendra Kumar", gender: "", mobile: "8104781760", email: "devendra.kumar@tuvindia.co.in", department: "", role: "" },
  ];

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span>Setup</span>
        <span className="mx-2">{'>'}</span>
        <span>Non Fte Users</span>
      </div>
      
      <h1 className="text-2xl font-semibold text-gray-900">NON FTE USERS</h1>
      
      <div className="flex gap-4 mb-6">
        <Button 
          className="text-white"
          style={{ backgroundColor: '#C72030' }}
          onClick={() => setImportModalOpen(true)}
        >
          <Download className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button 
          variant="outline" 
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          onClick={() => setEmailModalOpen(true)}
        >
          <Mail className="w-4 h-4 mr-2" />
          Resend Mail
        </Button>
        <Button 
          variant="outline" 
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          onClick={() => setFiltersModalOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {appliedFilters && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm text-blue-800">
            Filters applied: 
            {appliedFilters.userName && ` User Name: ${appliedFilters.userName}`}
            {appliedFilters.email && ` Email: ${appliedFilters.email}`}
            {appliedFilters.department && ` Department: ${appliedFilters.department}`}
            {appliedFilters.circle && ` Circle: ${appliedFilters.circle}`}
            {appliedFilters.role && ` Role: ${appliedFilters.role}`}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">User Name</TableHead>
              <TableHead className="font-semibold">Gender</TableHead>
              <TableHead className="font-semibold">Mobile Number</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Circle</TableHead>
              <TableHead className="font-semibold">Cluster</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Line Manager Name</TableHead>
              <TableHead className="font-semibold">Line Manager Mobile Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell className="text-blue-600">{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            style={{ backgroundColor: '#C72030' }}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white px-3 py-1 rounded text-sm" style={{ backgroundColor: '#C72030' }}>2</span>
          <Button variant="outline" size="sm" className="px-3 py-1 text-sm">3</Button>
          <Button variant="outline" size="sm" className="px-3 py-1 text-sm">4</Button>
          <Button variant="outline" size="sm" className="px-3 py-1 text-sm">5</Button>
          <Button variant="outline" size="sm" className="px-3 py-1 text-sm">6</Button>
          <Button variant="outline" size="sm" className="px-3 py-1 text-sm">...</Button>
          <Button variant="outline" size="sm" className="px-3 py-1 text-sm">Last →</Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            style={{ backgroundColor: '#C72030' }}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <NonFTEImportModal 
        isOpen={importModalOpen} 
        onClose={() => setImportModalOpen(false)} 
      />
      
      <NonFTEEmailModal 
        isOpen={emailModalOpen} 
        onClose={() => setEmailModalOpen(false)} 
      />
      
      <NonFTEFiltersModal 
        isOpen={filtersModalOpen} 
        onClose={() => setFiltersModalOpen(false)} 
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
