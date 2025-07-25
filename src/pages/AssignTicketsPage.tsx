import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { useAllocationData } from '@/hooks/useAllocationData';

interface SelectedTicket {
  id: string;
  ticket_number: string;
  task_number: string;
  description: string;
  category: string;
  sub_category: string;
  site: string;
  building: string;
  wing: string;
  floor: string;
  area: string;
  room: string;
  status: string | { name: string; color_code?: string } | any;
}

const AssignTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { departments, users, loading } = useAllocationData();
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [assignTo, setAssignTo] = useState<'Department' | 'User'>('Department');

  useEffect(() => {
    // Get selected tickets from navigation state
    if (location.state?.selectedTickets) {
      setSelectedTickets(location.state.selectedTickets);
    }
  }, [location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    // Implement assignment logic here
    console.log('Assigning tickets:', selectedTickets);
    console.log('Assign to:', assignTo);
    console.log('Selected Department:', selectedDepartment);
    console.log('Selected User:', selectedUser);
    
    // Navigate back after assignment
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">ASSIGN TO</h1>
        </div>

        {/* Selected Tickets Table */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TICKET NUMBER
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TASK NUMBER
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SITE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BUILDING
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WING
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FLOOR
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AREA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROOM
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.ticket_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.task_number}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {typeof ticket.status === 'string' ? ticket.status : 
                         (ticket.status?.name || ticket.status || 'Unknown')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.site || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.building || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.wing || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.floor || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.area || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.room || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Allocate To</h2>
          
          {/* Radio buttons for Department/User selection */}
          <div className="flex gap-6 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="assignTo"
                value="Department"
                checked={assignTo === 'Department'}
                onChange={(e) => setAssignTo(e.target.value as 'Department' | 'User')}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Department</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="assignTo"
                value="User"
                checked={assignTo === 'User'}
                onChange={(e) => setAssignTo(e.target.value as 'Department' | 'User')}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">User</span>
            </label>
          </div>

          {/* Department/User selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {assignTo === 'Department' ? (
              <div>
                <label className="block text-sm text-gray-500 mb-2">Department*</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading.departments}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm text-gray-500 mb-2">User*</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading.users}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Comments section */}
          <div className="mb-6">
            <label className="block text-sm text-gray-500 mb-2">Comments</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Add Comments"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-8 py-2"
              disabled={!selectedDepartment && !selectedUser}
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTicketsPage;