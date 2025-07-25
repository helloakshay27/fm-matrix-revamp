import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAllocationData } from '@/hooks/useAllocationData';
import { useToast } from '@/hooks/use-toast';

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
  issue_type: string;
  complaint_mode: string;
  service_or_asset: string | null;
  asset_task_occurrence_id: string | null;
  proactive_reactive: string | null;
  review_tracking_date: string | null;
  response_escalation: string;
  response_tat: number;
  response_time: string | null;
  escalation_response_name: string | null;
  resolution_escalation: string;
  resolution_tat: number | null;
  resolution_time: string | null;
  escalation_resolution_name: string | null;
}

const AssignTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users, loading } = useAllocationData();
  const { toast } = useToast();
  
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.selectedTickets) {
      setSelectedTickets(location.state.selectedTickets);
    }
  }, [location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!selectedStatus && !selectedUser) {
      toast({
        title: "Validation Error",
        description: "Please select either a status or assign to a user.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Updating tickets:', selectedTickets.map(t => t.id));
      console.log('Selected Status:', selectedStatus);
      console.log('Selected User:', selectedUser);
      
      toast({
        title: "Success",
        description: `Successfully updated ${selectedTickets.length} ticket(s).`,
      });
      
      navigate(-1);
    } catch (error) {
      console.error('Error updating tickets:', error);
      toast({
        title: "Error",
        description: "Failed to update tickets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TICKET TYPE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    COMPLAINT MODE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ASSET / SERVICE NAME
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TASK ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PROACTIVE / REACTIVE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    REVIEW
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESPONSE ESCALATION
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESPONSE TAT (MIN)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESPONSE TIME (D:H:M)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESPONSE ESCALATION LEVEL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESOLUTION ESCALATION
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESOLUTION TAT (MIN)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESOLUTION TIME (D:H:M)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESOLUTION ESCALATION LEVEL
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
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.issue_type || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.complaint_mode || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.service_or_asset || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.asset_task_occurrence_id || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.proactive_reactive || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {ticket.review_tracking_date ? new Date(ticket.review_tracking_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.response_escalation || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.response_tat || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.response_time || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.escalation_response_name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.resolution_escalation || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.resolution_tat || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.resolution_time || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.escalation_resolution_name || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Update To</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
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
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-8 py-2"
              disabled={isSubmitting || (!selectedStatus && !selectedUser)}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTicketsPage;