import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/utils/apiClient';
import { getToken } from '@/utils/auth';
import { ENDPOINTS, BASE_URL, TOKEN } from '@/config/apiConfig';

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

interface ComplaintStatus {
  id: number;
  society_id: number;
  name: string;
  color_code: string;
  fixed_state: string;
  active: number;
  created_at: string;
  updated_at: string;
  position: number;
  of_phase: string;
  of_atype: string;
  email: boolean;
}

interface FMUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  login: string;
  created_at: string;
  updated_at: string;
  spree_api_key: string;
  deleted_at: string | null;
}

const AssignTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintStatuses, setComplaintStatuses] = useState<ComplaintStatus[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [fmUsers, setFmUsers] = useState<FMUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (location.state?.selectedTickets) {
      setSelectedTickets(location.state.selectedTickets);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchComplaintStatuses = async () => {
      setLoadingStatuses(true);
      try {
        const response = await apiClient.get('/pms/admin/complaint_statuses.json');
        setComplaintStatuses(response.data || []);
      } catch (error) {
        console.error('Error fetching complaint statuses:', error);
        toast({
          title: "Error",
          description: "Failed to load complaint statuses.",
          variant: "destructive"
        });
      } finally {
        setLoadingStatuses(false);
      }
    };

    fetchComplaintStatuses();
  }, [toast]);

  useEffect(() => {
    const fetchFMUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await apiClient.get('/pms/account_setups/fm_users.json');
        setFmUsers(response.data.fm_users || []);
      } catch (error) {
        console.error('Error fetching FM users:', error);
        toast({
          title: "Error",
          description: "Failed to load users.",
          variant: "destructive"
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchFMUsers();
  }, [toast]);

  const handleBack = () => {
    navigate('/maintenance/ticket');
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

    // Check if all selected tickets have category and subcategory
    const ticketsWithoutCategory = selectedTickets.filter(ticket => 
      !ticket.category_type || !ticket.sub_category_type
    );

    if (ticketsWithoutCategory.length > 0) {
      const ticketNumbers = ticketsWithoutCategory.map(ticket => ticket.ticket_number).join(', ');
      toast({
        title: "Validation Error",
        description: `The following tickets are missing category or subcategory information and cannot be updated: ${ticketNumbers}. Please add category and subcategory to these tickets before bulk updating.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const complaint_ids = selectedTickets.map(t => t.id);
      console.log('🎯 Selected ticket IDs for bulk update:', complaint_ids);
      console.log('👤 Selected user ID:', selectedUser);
      console.log('📊 Selected status ID:', selectedStatus);
      console.log('🌐 Using BASE_URL from API config:', BASE_URL);
      console.log('🔑 Using TOKEN from API config:', TOKEN ? 'Present' : 'Missing');
      
      // Use TOKEN from API config with getToken() as fallback
      const authToken = TOKEN || getToken();
      console.log('🔑 Final auth token being used:', authToken ? 'Present' : 'Missing');
      
      if (!authToken) {
        throw new Error('No authentication token available. Please log in again.');
      }
      
      const apiCalls = [];

      // If user is selected, call assign API using centralized config
      if (selectedUser) {
        const formData = new FormData();
        complaint_ids.forEach(id => {
          formData.append('complaint_ids[]', id.toString());
        });
        formData.append('assigned_to_ids[]', selectedUser);
        formData.append('comment', 'Assigned from bulk assignment');
        
        console.log('📤 Assign API FormData:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        
        const assignUrl = `${BASE_URL}${ENDPOINTS.BULK_ASSIGN_TICKETS}`;
        console.log('📤 Assign API URL:', assignUrl);
        
        apiCalls.push(
          fetch(assignUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
            body: formData
          })
            .then(async response => {
              console.log('📤 Assign API Response Status:', response.status);
              if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Assign API error response:', errorText);
                if (response.status === 401) {
                  throw new Error('Authentication failed (401): Please log in again.');
                }
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              const data = await response.json();
              console.log('✅ Assign API response:', data);
              return data;
            })
            .catch(error => {
              console.error('❌ Assign API error:', error);
              throw error;
            })
        );
      }

      // If status is selected, call status update API using centralized config
      if (selectedStatus) {
        const formData = new FormData();
        complaint_ids.forEach(id => {
          formData.append('complaint_ids[]', id.toString());
        });
        formData.append('issue_status', selectedStatus);
        
        console.log('📤 Status API FormData:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        
        const statusUrl = `${BASE_URL}${ENDPOINTS.BULK_UPDATE_STATUS}`;
        console.log('📤 Status API URL:', statusUrl);
        
        apiCalls.push(
          fetch(statusUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
            body: formData
          })
            .then(async response => {
              console.log('📤 Status API Response Status:', response.status);
              if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Status API error response:', errorText);
                if (response.status === 401) {
                  throw new Error('Authentication failed (401): Please log in again.');
                }
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              const data = await response.json();
              console.log('✅ Status API response:', data);
              return data;
            })
            .catch(error => {
              console.error('❌ Status API error:', error);
              throw error;
            })
        );
      }

      // Execute all API calls
      const results = await Promise.all(apiCalls);
      console.log('🎉 All API calls completed:', results);
      
      toast({
        title: "Success",
        description: `Successfully updated ${selectedTickets.length} ticket(s).`,
      });
      
      navigate(-1);
    } catch (error) {
      console.error('❌ Error updating tickets:', error);
      toast({
        title: "Error",
        description: `Failed to update tickets: ${error.response?.data?.message || error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-6">
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
                    <td className="px-4 py-3 w-32">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer shadow-sm"
                disabled={loadingStatuses}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 8px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
              >
                <option value="" className="text-gray-500">Select Status</option>
                {complaintStatuses.map((status) => (
                  <option key={status.id} value={status.id} className="text-gray-900 py-2">
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer shadow-sm"
                disabled={loadingUsers}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 8px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
              >
                <option value="" className="text-gray-500">Select engineer</option>
                {fmUsers.map((user) => (
                  <option key={user.id} value={user.id} className="text-gray-900 py-2">
                    {user.firstname} {user.lastname}
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