
import React, { useState } from 'react';
import { Download, Mail, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NonFTEUsersDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Sample data based on the image
  const users = [
    {
      id: 1,
      userName: 'Anand Babu Pawar',
      gender: 'Male',
      mobileNumber: '8355857800',
      email: 'anandpawar54136@gmail.com',
      department: 'FM',
      circle: '',
      cluster: '',
      role: 'Shift Engineer',
      lineManagerName: '',
      lineManagerMobile: ''
    },
    {
      id: 2,
      userName: 'Tapish Choudhary',
      gender: '',
      mobileNumber: '7701944124',
      email: 'taapish@gmail.com',
      department: '',
      circle: '',
      cluster: '',
      role: '',
      lineManagerName: '',
      lineManagerMobile: ''
    },
    {
      id: 3,
      userName: 'Amrit kumar Gupta',
      gender: '',
      mobileNumber: '9006485383',
      email: 'amritkumargupta900@gmail.com',
      department: '',
      circle: '',
      cluster: '',
      role: '',
      lineManagerName: '',
      lineManagerMobile: ''
    },
    {
      id: 4,
      userName: 'Moiz Tuv',
      gender: '',
      mobileNumber: '7411874016',
      email: '7411874016@gmail.com',
      department: '',
      circle: '',
      cluster: '',
      role: '',
      lineManagerName: '',
      lineManagerMobile: ''
    },
    {
      id: 5,
      userName: 'Maruf Khan',
      gender: '',
      mobileNumber: '8808632149',
      email: '8808632149@gmail.com',
      department: '',
      circle: '',
      cluster: '',
      role: '',
      lineManagerName: '',
      lineManagerMobile: ''
    }
  ];

  const totalPages = 8; // Based on pagination shown in image

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Setup &gt; Non Fte Users</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">NON FTE USERS</h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button className="bg-[#8B5A3C] hover:bg-[#7A4A2C] text-white">
          <Download className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white">
          <Mail className="w-4 h-4 mr-2" />
          Resend Mail
        </Button>
        <Button variant="outline" className="border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Circle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cluster</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line Manager Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line Manager Mobile Number</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.userName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.gender}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.mobileNumber}</td>
                  <td className="px-4 py-3 text-sm text-blue-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.circle}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.cluster}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.lineManagerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.lineManagerMobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-[#8B5A3C] text-white border-[#8B5A3C] hover:bg-[#7A4A2C]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page 
                  ? "bg-[#8B5A3C] text-white border-[#8B5A3C]" 
                  : "border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white"
                }
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="bg-[#8B5A3C] text-white border-[#8B5A3C] hover:bg-[#7A4A2C]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-gray-600 ml-2">Last &gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
};
