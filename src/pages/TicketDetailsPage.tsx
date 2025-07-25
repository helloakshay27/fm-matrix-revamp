import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Download, Eye, Paperclip } from 'lucide-react';
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
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading ticket details...</div>
        </div>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">{error || 'Ticket not found'}</div>
        </div>
      </div>
    );
  }

  // Process complaint logs for table display
  const complaintLogs = ticketData.complaint_logs || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBackToList}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ticket List
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Ticket Details - {displayValue(ticketData.ticket_number)}</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handleFeeds}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Logs
            </Button>
            <Button 
              onClick={handleCreateTask}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Create Task
            </Button>
          </div>
        </div>
      </div>

      {/* Ticket Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">T</span>
            TICKET INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Ticket Number:</strong> {displayValue(ticketData.ticket_number)}</div>
            <div><strong>Title:</strong> {displayValue(ticketData.heading)}</div>
            <div><strong>Status:</strong> {ticketData.issue_status ? (
              <Badge className="bg-yellow-100 text-yellow-700 ml-2">{ticketData.issue_status}</Badge>
            ) : '—'}</div>
            <div><strong>Priority:</strong> {displayValue(ticketData.priority || ticketData.external_priority)}</div>
            <div><strong>Category:</strong> {displayValue(ticketData.category_type)}</div>
            <div><strong>SubCategory:</strong> {displayValue(ticketData.sub_category_type)}</div>
            <div><strong>Created On:</strong> {displayValue(`${ticketData.created_date || ''} ${ticketData.created_time || ''}`.trim())}</div>
            <div><strong>Complaint Mode:</strong> {displayValue(ticketData.complaint_mode)}</div>
            <div className="md:col-span-2"><strong>Admin Priority:</strong> {displayValue(ticketData.priority_status || ticketData.effective_priority)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Creator Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">C</span>
            CREATOR INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Created By:</strong> {displayValue(ticketData.created_by_name)}</div>
            <div><strong>Posted By:</strong> {displayValue(ticketData.posted_by)}</div>
            <div><strong>Updated By:</strong> {displayValue(ticketData.updated_by)}</div>
            <div><strong>Assigned To:</strong> {displayValue(ticketData.assigned_to)}</div>
            <div><strong>Society:</strong> {displayValue(ticketData.id_society)}</div>
            <div><strong>Responsible Person:</strong> {displayValue(ticketData.responsible_person)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">L</span>
            LOCATION INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Region:</strong> {displayValue(ticketData.region)}</div>
            <div><strong>Zone:</strong> {displayValue(ticketData.zone)}</div>
            <div><strong>City:</strong> {displayValue(ticketData.city)}</div>
            <div><strong>State:</strong> {displayValue(ticketData.state)}</div>
            <div><strong>District:</strong> {displayValue(ticketData.district)}</div>
            <div><strong>Building:</strong> {displayValue(ticketData.building_name)}</div>
            <div><strong>Wing:</strong> {displayValue(ticketData.wing_name)}</div>
            <div><strong>Floor:</strong> {displayValue(ticketData.floor_name)}</div>
            <div><strong>Room:</strong> {displayValue(ticketData.room_name)}</div>
            <div><strong>Unit Name:</strong> {displayValue(ticketData.flat_number || ticketData.unit_name)}</div>
            <div><strong>Site Name:</strong> {displayValue(ticketData.area_name || ticketData.site_name)}</div>
            <div className="md:col-span-2"><strong>Address:</strong> {displayValue(ticketData.address)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">A</span>
            ADDITIONAL INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Ticket Urgency:</strong> {displayValue(ticketData.ticket_urgency)}</div>
            <div><strong>Asset Service:</strong> {displayValue(ticketData.asset_service)}</div>
            <div><strong>Response TAT:</strong> {displayValue(ticketData.response_tat)}</div>
            <div><strong>Resolution TAT:</strong> {displayValue(ticketData.resolution_tat)}</div>
            <div><strong>Survey ID:</strong> {displayValue(ticketData.survey_id)}</div>
            <div><strong>Survey Name:</strong> {displayValue(ticketData.survey_name)}</div>
            <div className="md:col-span-2"><strong>Survey Location:</strong> {displayValue(ticketData.survey_location)}</div>
            <div className="md:col-span-2"><strong>Corrective Action:</strong> {displayValue(ticketData.corrective_action)}</div>
            <div className="md:col-span-2"><strong>Preventive Action:</strong> {displayValue(ticketData.preventive_action)}</div>
            <div className="md:col-span-2"><strong>Root Cause:</strong> {displayValue(ticketData.root_cause)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      {complaintLogs.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">L</span>
              ACTIVITY LOGS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaintLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(log.created_at)}</TableCell>
                    <TableCell>{displayValue(log.log_by)}</TableCell>
                    <TableCell>{displayValue(log.priority)}</TableCell>
                    <TableCell>{displayValue(log.log_comment)}</TableCell>
                    <TableCell>{displayValue(log.log_status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">A</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticketData.documents && ticketData.documents.length > 0 ? (
              ticketData.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <span>{doc.file_name || `Document ${index + 1}`}</span>
                  <Button variant="link" className="ml-auto p-0 h-auto">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No attachments available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};