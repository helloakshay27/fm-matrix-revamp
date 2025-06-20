
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Download, Mail } from 'lucide-react';

export const NonFTEUsersDashboard = () => {
  const [users] = useState([
    {
      userName: "Anand Babu Pawar",
      gender: "Male",
      mobileNumber: "8355857800",
      email: "anandpawar54136@gmail.com",
      department: "FM",
      circle: "",
      cluster: "",
      role: "Shift Engineer",
      lineManagerName: "",
      lineManagerMobile: ""
    },
    {
      userName: "Tapish Choudhary",
      gender: "",
      mobileNumber: "7701944124",
      email: "taapish@gmail.com",
      department: "",
      circle: "",
      cluster: "",
      role: "",
      lineManagerName: "",
      lineManagerMobile: ""
    },
    {
      userName: "Amrit kumar Gupta",
      gender: "",
      mobileNumber: "9006485383",
      email: "amritkumargupta900@gmail.com",
      department: "",
      circle: "",
      cluster: "",
      role: "",
      lineManagerName: "",
      lineManagerMobile: ""
    },
    {
      userName: "Moiz Tuv",
      gender: "",
      mobileNumber: "7411874016",
      email: "7411874016@gmail.com",
      department: "",
      circle: "",
      cluster: "",
      role: "",
      lineManagerName: "",
      lineManagerMobile: ""
    },
    {
      userName: "Maruf Khan",
      gender: "",
      mobileNumber: "8808632149",
      email: "8808632149@gmail.com",
      department: "",
      circle: "",
      cluster: "",
      role: "",
      lineManagerName: "",
      lineManagerMobile: ""
    },
    {
      userName: "Shivam Kumar",
      gender: "",
      mobileNumber: "9997888699",
      email: "shivam.kumar@godrejproperties.com",
      department: "",
      circle: "",
      cluster: "",
      role: "",
      lineManagerName: "",
      lineManagerMobile: ""
    },
    {
      userName: "Firasat Khan",
      gender: "",
      mobileNumber: "7897365833",
      email: "firasatalkhan786@gmail.com",
      department: "",
      circle: "",
      cluster: "",
      role: "",
      lineManagerName: "",
      lineManagerMobile: ""
    },
    {
      userName: "Vineet Chauhan",
      gender: "",
      mobileNumber: "8209305825",
      email: "vineet.chauhan@godrejproperties.com",
      department: "",
      circle: "",
      cluster: "",
      role: "",
      lineManagerName: "",
      lineManagerMobile: ""
    },
    {
      userName: "Avinash ashok kamble",
      gender: "",
      mobileNumber: "9833842776",
      email: "9833842776@gmail.com",
      department: "",
      circle: "",
      cluster: "",
      role: "",
      lineManagerName: "",
      lineManagerMobile: ""
    },
    {
      userName: "Parveen KUMAR",
      gender: "",
      mobileNumber: "9785669937",
      email: "9785669937@gmail.com",
      department: "",
      circle: "",
      cluster: "",
      role: "",
      lineManagerName: "",
      lineManagerMobile: ""
    }
  ]);

  return (
    <div className="p-6 bg-white">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        Setup &gt; Non Fte Users
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">NON FTE USERS</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Download className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
          <Mail className="w-4 h-4 mr-2" />
          Resend Mail
        </Button>
        <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mobile Number</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Circle</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cluster</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Line Manager Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Line Manager Mobile Number</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.userName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.gender}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.mobileNumber}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 underline">{user.email}</td>
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
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-purple-700 text-white">
            1
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-100">
            2
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-100">
            3
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-100">
            4
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-100">
            5
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-100">
            6
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-100">
            7
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-100">
            8
          </Button>
          <Button variant="ghost" size="sm" className="px-3 py-1 text-gray-600 hover:bg-gray-100">
            Last →
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
        Powered by Phygital.work
      </div>
    </div>
  );
};
