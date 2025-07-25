import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { useAllocationData } from '@/hooks/useAllocationData';

interface SelectedTicket {
  id: number;
  ticket_number: string;
  heading: string;
  category_type: string;
  sub_category_type: string;
  site_name: string;
  posted_by: string;
  assigned_to: string | null;
  issue_status: string;
  priority: string;
  created_at: string;
  // Add other fields that might be available
  building?: string;
  wing?: string;
  floor?: string;
  area?: string;
  room?: string;
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
                    TICKET ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DESCRIPTION
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CATEGORY
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SUB CATEGORY
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CREATED BY
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ASSIGNED TO
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PRIORITY
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SITE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CREATED ON
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.ticket_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.heading}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.category_type || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.sub_category_type || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.posted_by || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.assigned_to || 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {ticket.issue_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.priority || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.site_name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Update To</h2>
          
          {/* Department/User selection */}

          {/* Department/User selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Assign To</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
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
          </div>

          {/* Submit button */}

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