
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, FileText, Paperclip, Download, Eye } from 'lucide-react';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';

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

  const handleCreateTask = () => {
    console.log('Create task clicked');
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBackToList} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Ticket List</span>
          </button>
        </div>
        
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">TICKET DETAILS</h1>
          <div className="flex gap-3">
            <Button onClick={handleFeeds} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Feeds
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
      <Card className="mb-6 shadow-sm">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>1</div>
            TICKET DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2">
            {hasData(ticketData.heading) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Title</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.heading}</div>
              </div>
            )}
            {hasData(ticketData.ticket_number) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Ticket Number</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.ticket_number}</div>
              </div>
            )}
            {hasData(ticketData.issue_status) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Status</div>
                <div className="w-1/2 p-4 text-sm">
                  <Badge className="bg-yellow-100 text-yellow-700">{ticketData.issue_status}</Badge>
                </div>
              </div>
            )}
            {hasData(ticketData.category_type) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Category</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.category_type}</div>
              </div>
            )}
            {hasData(ticketData.sub_category_type) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">SubCategory</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.sub_category_type}</div>
              </div>
            )}
            {hasData(ticketData.priority || ticketData.external_priority) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Priority</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.priority || ticketData.external_priority}</div>
              </div>
            )}
            {hasData(ticketData.created_by_name) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Created By</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.created_by_name}</div>
              </div>
            )}
            {(hasData(ticketData.created_date) || hasData(ticketData.created_time)) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Created On</div>
                <div className="w-1/2 p-4 text-sm">{`${ticketData.created_date || ''} ${ticketData.created_time || ''}`.trim()}</div>
              </div>
            )}
            {hasData(ticketData.assigned_to) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Assigned To</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.assigned_to}</div>
              </div>
            )}
            {hasData(ticketData.updated_by) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Updated By</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.updated_by}</div>
              </div>
            )}
            {hasData(ticketData.complaint_mode) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Complaint Mode</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.complaint_mode}</div>
              </div>
            )}
            {hasData(ticketData.priority_status || ticketData.effective_priority) && (
              <div className="flex">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Admin Priority</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.priority_status || ticketData.effective_priority}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Creator's Information */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>2</div>
            CREATOR'S INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2">
            {hasData(ticketData.posted_by) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Posted By</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.posted_by}</div>
              </div>
            )}
            {hasData(ticketData.id_society) && (
              <div className="flex">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Society</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.id_society}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Location Information */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>3</div>
            LOCATION INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2">
            {hasData(ticketData.region) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Region</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.region}</div>
              </div>
            )}
            {hasData(ticketData.zone) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Zone</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.zone}</div>
              </div>
            )}
            {hasData(ticketData.building_name) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Building</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.building_name}</div>
              </div>
            )}
            {hasData(ticketData.district) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">District</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.district}</div>
              </div>
            )}
            {hasData(ticketData.floor_name) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Floor</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.floor_name}</div>
              </div>
            )}
            {hasData(ticketData.room_name) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Room</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.room_name}</div>
              </div>
            )}
            {hasData(ticketData.flat_number || ticketData.unit_name) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Flat Number / Unit Name</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.flat_number || ticketData.unit_name}</div>
              </div>
            )}
            {hasData(ticketData.area_name || ticketData.site_name) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Area Name / Site Name</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.area_name || ticketData.site_name}</div>
              </div>
            )}
            {hasData(ticketData.city) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">City</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.city}</div>
              </div>
            )}
            {hasData(ticketData.state) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">State</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.state}</div>
              </div>
            )}
            {hasData(ticketData.address) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Address</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.address}</div>
              </div>
            )}
            {hasData(ticketData.wing_name) && (
              <div className="flex">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Wing</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.wing_name}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Survey Information */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>4</div>
            SURVEY INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2">
            {hasData(ticketData.survey_id) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Survey ID</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.survey_id}</div>
              </div>
            )}
            {hasData(ticketData.survey_name) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Survey Name</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.survey_name}</div>
              </div>
            )}
            {hasData(ticketData.survey_location) && (
              <div className="flex">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Survey Location</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.survey_location}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Additional Information */}
      <Card className="mb-6 shadow-sm">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#C72030' }}>5</div>
            ADDITIONAL INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2">
            {hasData(ticketData.corrective_action) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Corrective Action</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.corrective_action}</div>
              </div>
            )}
            {hasData(ticketData.ticket_urgency) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Ticket Urgency</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.ticket_urgency}</div>
              </div>
            )}
            {hasData(ticketData.preventive_action) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Preventive Action</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.preventive_action}</div>
              </div>
            )}
            {hasData(ticketData.responsible_person) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Responsible Person</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.responsible_person}</div>
              </div>
            )}
            {hasData(ticketData.root_cause) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Root Cause</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.root_cause}</div>
              </div>
            )}
            {hasData(ticketData.asset_service) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Asset Service</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.asset_service}</div>
              </div>
            )}
            {hasData(ticketData.response_tat) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Response TAT</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.response_tat}</div>
              </div>
            )}
            {hasData(ticketData.resolution_tat) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Resolution TAT</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.resolution_tat}</div>
              </div>
            )}
            {hasData(ticketData.task_id) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Task ID</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.task_id}</div>
              </div>
            )}
            {hasData(ticketData.asset_service_location) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Asset/Service Location</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.asset_service_location}</div>
              </div>
            )}
            {hasData(ticketData.resolution_time) && (
              <div className="flex border-b">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Resolution Time</div>
                <div className="w-1/2 p-4 text-sm">{ticketData.resolution_time}</div>
              </div>
            )}
            {(hasData(ticketData.escalation_response_name) || hasData(ticketData.escalation_resolution_name)) && (
              <div className="flex">
                <div className="w-1/2 p-4 bg-gray-50 text-sm text-gray-600 font-medium border-r">Escalation Tracking</div>
                <div className="w-1/2 p-4 text-sm">{`${ticketData.escalation_response_name || ''}, ${ticketData.escalation_resolution_name || ''}`.replace(/^,\s*|,\s*$/g, '')}</div>
              </div>
            )}
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
