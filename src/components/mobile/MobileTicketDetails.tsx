import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TicketResponse, ticketManagementAPI } from '@/services/ticketManagementAPI';
import { useToast } from '@/hooks/use-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';

interface MobileTicketDetailsProps {
  ticket: TicketResponse;
  onBack: () => void;
}

export const MobileTicketDetails: React.FC<MobileTicketDetailsProps> = ({ ticket, onBack }) => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { data: fmUsersData, loading: fmUsersLoading } = useSelector((state: RootState) => state.fmUsers);
  
  const [updateForm, setUpdateForm] = useState({
    priority: ticket.priority || '',
    status: ticket.issue_status || '',
    assignee: ticket.assigned_to || '',
    comment: ''
  });
  const [comments, setComments] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchFMUsers());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-600';
      case 'pending': return 'bg-pink-500';
      case 'in progress': return 'bg-blue-600';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const updateData = {
        priority: updateForm.priority || ticket.priority,
        issue_status: updateForm.status || ticket.issue_status,
        assigned_to: updateForm.assignee || ticket.assigned_to,
      };

      await ticketManagementAPI.updateTicket(ticket.id, updateData);
      
      toast({
        title: "Success",
        description: "Ticket updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive"
      });
      console.error('Failed to update ticket:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddComment = () => {
    if (updateForm.comment.trim()) {
      setComments(prev => [...prev, updateForm.comment]);
      setUpdateForm(prev => ({ ...prev, comment: '' }));
      toast({
        title: "Success",
        description: "Comment added successfully"
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
      toast({
        title: "Success",
        description: `${newFiles.length} file(s) attached successfully`
      });
    }
  };

  const activityLogs: any[] = [];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Ticket Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Ticket Info Card */}
        <div className="bg-stone-100 mx-4 mt-4 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium text-gray-700">
              #{ticket.ticket_number || ticket.id}
            </span>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor(ticket.issue_status)} text-white`}>
              {ticket.issue_status || 'Open'}
            </Badge>
          </div>

          <h2 className="font-semibold text-gray-900 mb-2">
            {ticket.heading || 'Ticket Title'}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            {ticket.category_type || 'Category'} / {ticket.sub_category_type || 'Sub-Category'}
          </p>

          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">Issue Type:</span>
              <span className="ml-2">{ticket.issue_type || '1 Day'}</span>
            </div>
            {ticket.resolution_time && (
              <div>
                <span className="font-medium">Resolved Time:</span>
                <span className="ml-2">{formatDate(ticket.resolution_time)}</span>
              </div>
            )}
            <div>
              <span className="font-medium">Assigned to:</span>
              <span className="ml-2">{ticket.assigned_to || 'Unassigned'}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Created On:</span>
              <span className="ml-2">{formatDate(ticket.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-700">Description</span>
            </div>
            <p className="text-sm text-gray-600 ml-6">
              {ticket.heading || 'No description available'}
            </p>
          </div>
        </div>

        {/* Location Section */}
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-700">Location</span>
            </div>
            <div className="ml-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Site:</span>
                <span className="ml-2 text-gray-900">{ticket.site_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Service/Asset:</span>
                <span className="ml-2 text-gray-900">{ticket.service_or_asset || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Complaint Mode:</span>
                <span className="ml-2 text-gray-900">{ticket.complaint_mode || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 text-gray-900">{ticket.proactive_reactive || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Ticket Section */}
        <div className="mx-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Ticket</h3>
          
          <div className="space-y-4">
            {/* Priority and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <Select value={updateForm.priority} onValueChange={(value) => setUpdateForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Request" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">P1 - Critical</SelectItem>
                    <SelectItem value="p2">P2 - Very High</SelectItem>
                    <SelectItem value="p3">P3 - High</SelectItem>
                    <SelectItem value="p4">P4 - Medium</SelectItem>
                    <SelectItem value="p5">P5 - Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={updateForm.status} onValueChange={(value) => setUpdateForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Request" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Enter Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Assignee</label>
              <Select value={updateForm.assignee} onValueChange={(value) => setUpdateForm(prev => ({ ...prev, assignee: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {fmUsersLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : fmUsersData?.fm_users?.length > 0 ? (
                    fmUsersData.fm_users.map((user) => (
                      <SelectItem key={user.id} value={`${user.firstname} ${user.lastname}`}>
                        {user.firstname} {user.lastname} - {user.designation}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users" disabled>No users available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Comments Section */}
            {comments.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Comments</h4>
                {comments.map((comment, index) => (
                  <div key={index} className="bg-gray-100 p-3 rounded mb-2 text-sm text-gray-700">
                    {comment}
                  </div>
                ))}
              </div>
            )}

            {/* Attachments */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
              {attachments.length > 0 ? (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm">
                      <span className="text-gray-700">{file.name}</span>
                      <button 
                        onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No attachments</div>
              )}
            </div>

            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="mx-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Comment</h3>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter name"
              value={updateForm.comment}
              onChange={(e) => setUpdateForm(prev => ({ ...prev, comment: e.target.value }))}
              rows={3}
            />
            <div className="space-y-2">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Paperclip className="h-4 w-4" />
                Add Attachment
              </Button>
              <Button
                onClick={handleAddComment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="mx-4 mt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity logs</h3>
          <div className="space-y-4">
            <div className="text-sm text-gray-500 text-center py-4">
              No activity logs available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};