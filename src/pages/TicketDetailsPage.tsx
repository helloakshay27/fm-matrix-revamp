import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, FileText, Paperclip, Download, Eye } from 'lucide-react';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await ticketManagementAPI.getTicketDetails(id);
        setTicketData(data);
      } catch (err) {
        setError('Failed to fetch ticket details');
        console.error('Error fetching ticket details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const handleBackToList = () => {
    navigate('/maintenance/ticket');
  };

  const handleFeeds = () => {
    navigate(`/maintenance/ticket/${id}/feeds`);
  };

  const handleTagVendor = () => {
    navigate(`/maintenance/ticket/${id}/tag-vendor`);
  };

  const handleCreateTask = async () => {
    if (!id) {
      console.error('No ticket ID available');
      return;
    }

    try {
      console.log('Fetching create task data for ticket:', id);
      const taskData = await ticketManagementAPI.getCreateTaskData(id);
      console.log('Create task data:', taskData);
      
      // You can handle the response data here
      // For example, navigate to a create task page with the data
      // or open a modal with the task creation form
      
      // Placeholder for now - you can customize this based on your requirements
      toast.success('Create task data fetched successfully! Check console for details.');
      
    } catch (error) {
      console.error('Error fetching create task data:', error);
      toast.error('Failed to fetch create task data. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading ticket details...</div>
        </div>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error || 'Ticket not found'}</div>
        </div>
      </div>
    );
  }

  // Helper function to check if value has data
  const hasData = (value) => {
    return value && value !== null && value !== undefined && value !== '';
  };

  // Helper function to display value or "Not Provided"
  const displayValue = (value) => {
    return value && value !== null && value !== undefined && value !== '' ? value : 'Not Provided';
  };

  // Process complaint logs for table display
  const complaintLogs = ticketData.complaint_logs || [];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBackToList} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Ticket List</span>
          </button>
        </div>
        
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Summary</h1>
          <div className="flex gap-3">
            <Button onClick={handleFeeds} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Logs
            </Button>
            {/* <Button onClick={handleTagVendor} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Tag Vendor
            </Button> */}
            <Button onClick={handleCreateTask} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Create Task
            </Button>
          </div>
        </div>
      </div>

      {/* Section 1: Ticket Details */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>1</div>
            TICKET DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              {hasData(ticketData.heading) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Title</label>
                  <p className="font-medium">{ticketData.heading}</p>
                </div>
              )}
              {hasData(ticketData.issue_status) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Status</label>
                  <Badge className="bg-yellow-100 text-yellow-700">{ticketData.issue_status}</Badge>
                </div>
              )}
              {hasData(ticketData.sub_category_type) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">SubCategory</label>
                  <p className="font-medium">{ticketData.sub_category_type}</p>
                </div>
              )}
              {hasData(ticketData.created_by_name) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Created By</label>
                  <p className="font-medium">{ticketData.created_by_name}</p>
                </div>
              )}
              {hasData(ticketData.assigned_to) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Assigned To</label>
                  <p className="font-medium">{ticketData.assigned_to}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {(hasData(ticketData.created_date) || hasData(ticketData.created_time)) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Created On</label>
                  <p className="font-medium">{`${ticketData.created_date || ''} ${ticketData.created_time || ''}`.trim()}</p>
                </div>
              )}
              {hasData(ticketData.category_type) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Category</label>
                  <p className="font-medium">{ticketData.category_type}</p>
                </div>
              )}
              {hasData(ticketData.updated_by) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Updated By</label>
                  <p className="font-medium">{ticketData.updated_by}</p>
                </div>
              )}
              {hasData(ticketData.complaint_mode) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Complaint Mode</label>
                  <p className="font-medium">{ticketData.complaint_mode}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {hasData(ticketData.ticket_number) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Ticket Number</label>
                  <p className="font-medium">{ticketData.ticket_number}</p>
                </div>
              )}
              {hasData(ticketData.priority || ticketData.external_priority) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Priority</label>
                  <p className="font-medium">{ticketData.priority || ticketData.external_priority}</p>
                </div>
              )}
              {hasData(ticketData.priority_status || ticketData.effective_priority) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Admin Priority</label>
                  <p className="font-medium">{ticketData.priority_status || ticketData.effective_priority}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Creator's Information */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>2</div>
            CREATOR'S INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            {hasData(ticketData.posted_by) && (
              <div>
                <label className="text-sm text-gray-600 block mb-1">Posted By</label>
                <p className="font-medium">{ticketData.posted_by}</p>
              </div>
            )}
            {hasData(ticketData.id_society) && (
              <div>
                <label className="text-sm text-gray-600 block mb-1">Society</label>
                <p className="font-medium">{ticketData.id_society}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Location Information */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>3</div>
            LOCATION INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              {hasData(ticketData.region) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Region</label>
                  <p className="font-medium">{ticketData.region}</p>
                </div>
              )}
              {hasData(ticketData.building_name) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Building</label>
                  <p className="font-medium">{ticketData.building_name}</p>
                </div>
              )}
              {hasData(ticketData.floor_name) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Floor</label>
                  <p className="font-medium">{ticketData.floor_name}</p>
                </div>
              )}
              {hasData(ticketData.flat_number || ticketData.unit_name) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Flat Number / Unit Name</label>
                  <p className="font-medium">{ticketData.flat_number || ticketData.unit_name}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {hasData(ticketData.zone) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Zone</label>
                  <p className="font-medium">{ticketData.zone}</p>
                </div>
              )}
              {hasData(ticketData.district) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">District</label>
                  <p className="font-medium">{ticketData.district}</p>
                </div>
              )}
              {hasData(ticketData.room_name) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Room</label>
                  <p className="font-medium">{ticketData.room_name}</p>
                </div>
              )}
              {hasData(ticketData.area_name || ticketData.site_name) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Area Name / Site Name</label>
                  <p className="font-medium">{ticketData.area_name || ticketData.site_name}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {hasData(ticketData.city) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">City</label>
                  <p className="font-medium">{ticketData.city}</p>
                </div>
              )}
              {hasData(ticketData.state) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">State</label>
                  <p className="font-medium">{ticketData.state}</p>
                </div>
              )}
              {hasData(ticketData.address) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Address</label>
                  <p className="font-medium">{ticketData.address}</p>
                </div>
              )}
              {hasData(ticketData.wing_name) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Wing</label>
                  <p className="font-medium">{ticketData.wing_name}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Survey Information */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>4</div>
            SURVEY INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            {hasData(ticketData.survey_id) && (
              <div>
                <label className="text-sm text-gray-600 block mb-1">Survey ID</label>
                <p className="font-medium">{ticketData.survey_id}</p>
              </div>
            )}
            {hasData(ticketData.survey_name) && (
              <div>
                <label className="text-sm text-gray-600 block mb-1">Survey Name</label>
                <p className="font-medium">{ticketData.survey_name}</p>
              </div>
            )}
            {hasData(ticketData.survey_location) && (
              <div>
                <label className="text-sm text-gray-600 block mb-1">Survey Location</label>
                <p className="font-medium">{ticketData.survey_location}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Additional Information */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>5</div>
            ADDITIONAL INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              {hasData(ticketData.corrective_action) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Corrective Action</label>
                  <p className="font-medium">{ticketData.corrective_action}</p>
                </div>
              )}
              {hasData(ticketData.preventive_action) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Preventive Action</label>
                  <p className="font-medium">{ticketData.preventive_action}</p>
                </div>
              )}
              {hasData(ticketData.root_cause) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Root Cause</label>
                  <p className="font-medium">{ticketData.root_cause}</p>
                </div>
              )}
              {hasData(ticketData.response_tat) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Response TAT</label>
                  <p className="font-medium">{ticketData.response_tat}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {hasData(ticketData.ticket_urgency) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Ticket Urgency</label>
                  <p className="font-medium">{ticketData.ticket_urgency}</p>
                </div>
              )}
              {hasData(ticketData.responsible_person) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Responsible Person</label>
                  <p className="font-medium">{ticketData.responsible_person}</p>
                </div>
              )}
              {hasData(ticketData.asset_service) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Asset Service</label>
                  <p className="font-medium">{ticketData.asset_service}</p>
                </div>
              )}
              {hasData(ticketData.resolution_tat) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Resolution TAT</label>
                  <p className="font-medium">{ticketData.resolution_tat}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {hasData(ticketData.task_id) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Task ID</label>
                  <p className="font-medium">{ticketData.task_id}</p>
                </div>
              )}
              {hasData(ticketData.asset_service_location) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Asset/Service Location</label>
                  <p className="font-medium">{ticketData.asset_service_location}</p>
                </div>
              )}
              {hasData(ticketData.resolution_time) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Resolution Time</label>
                  <p className="font-medium">{ticketData.resolution_time}</p>
                </div>
              )}
              {(hasData(ticketData.escalation_response_name) || hasData(ticketData.escalation_resolution_name)) && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Escalation Tracking</label>
                  <p className="font-medium">{`${ticketData.escalation_response_name || ''}, ${ticketData.escalation_resolution_name || ''}`.replace(/^,\s*|,\s*$/g, '')}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Attachments */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>6</div>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {ticketData.documents && ticketData.documents.length > 0 ? (
            <div className="space-y-3">
              {ticketData.documents.map((document, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{document.name || `Document ${index + 1}`}</p>
                      <p className="text-xs text-gray-500">
                        Attachment
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No attachments found</p>
          )}
        </CardContent>
      </Card>

      {/* Section 7: Cost Approval Request */}
      <Card>
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>7</div>
            COST APPROVAL REQUEST
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {ticketData.cost_approval_enabled && ticketData.requests && ticketData.requests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketData.requests.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{request.id || `REQ-${index + 1}`}</TableCell>
                      <TableCell>{request.amount || 'Not Provided'}</TableCell>
                      <TableCell>{request.comments || 'No comments'}</TableCell>
                      <TableCell>{request.created_at || 'Not Provided'}</TableCell>
                      <TableCell>{request.created_by || 'Not Provided'}</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-700">
                          {request.status || 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {ticketData.cost_approval_enabled ? 'No cost approval requests found' : 'Cost approval not enabled for this ticket'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section 8: Complaint/Action Logs */}
      <Card className="mt-6">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>8</div>
            COMPLAINT/ACTION LOGS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {complaintLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comment/Action</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaintLogs.map((log, index) => (
                    <TableRow key={log.id || index}>
                      <TableCell className="font-medium">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700">
                          {log.log_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.log_comment || 'No comment'}</TableCell>
                      <TableCell>{log.log_by || 'System'}</TableCell>
                      <TableCell>{log.priority || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No action logs found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};