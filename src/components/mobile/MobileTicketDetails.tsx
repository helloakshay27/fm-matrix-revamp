import React, { useState } from 'react';
import { ArrowLeft, Clock, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TicketResponse } from '@/services/ticketManagementAPI';
import { useToast } from '@/hooks/use-toast';

interface MobileTicketDetailsProps {
  ticket: TicketResponse;
  onBack: () => void;
}

export const MobileTicketDetails: React.FC<MobileTicketDetailsProps> = ({ ticket, onBack }) => {
  const { toast } = useToast();
  const [updateForm, setUpdateForm] = useState({
    priority: ticket.priority || '',
    status: ticket.issue_status || '',
    assignee: ticket.assigned_to || '',
    comment: ''
  });
  const [comments, setComments] = useState([
    'Move below changes',
    'Thank you'
  ]);

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

  const handleUpdate = () => {
    // Here you would call the API to update the ticket
    toast({
      title: "Success",
      description: "Ticket updated successfully"
    });
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

  const activityLogs = [
    {
      date: 'Oct 15 2024',
      time: '05:18 PM',
      user: 'Abdul G',
      action: 'Made below changes',
      details: 'Status: Closed'
    },
    {
      date: 'Oct 15 2024',
      time: '05:18 PM',
      user: 'Abdul G',
      action: 'Commented: Thank you'
    },
    {
      date: 'Oct 15 2024',
      time: '05:18 PM',
      user: 'Abdul G',
      action: 'Made below changes',
      details: 'Status: Closed'
    },
    {
      date: 'Oct 15 2024',
      time: '05:17 PM',
      user: 'Ticket Created',
      action: 'Status: Pending',
      isCreated: true
    },
    {
      date: 'Sep 25 2024',
      time: '05:16 PM',
      user: 'Abdul G',
      action: 'Made below changes'
    },
    {
      date: 'Sep 25 2024',
      time: '05:16 PM',
      user: 'Abdul G',
      action: 'Commented: Thank you'
    },
    {
      date: 'Sep 25 2024',
      time: '05:16 PM',
      user: 'Abdul G',
      action: 'Made below changes'
    },
    {
      date: 'Sep 25 2024',
      time: '05:17 PM',
      user: 'Ticket Created',
      action: 'Status: Pending',
      isCreated: true
    }
  ];

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
            <div>
              <span className="font-medium">Resolved Time:</span>
              <span className="ml-2">09:06</span>
            </div>
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
              {ticket.heading || 'The Air Conditioner Is Not Functioning Properly. It Is Not Cooling, Turning On, Or Responding To Controls. Immediate Inspection And Servicing Are Required.'}
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
                <span className="text-gray-500">Building:</span>
                <span className="ml-2 text-gray-900">Building A</span>
              </div>
              <div>
                <span className="text-gray-500">Area:</span>
                <span className="ml-2 text-gray-900">Common Area</span>
              </div>
              <div>
                <span className="text-gray-500">Wing:</span>
                <span className="ml-2 text-gray-900">Wing C</span>
              </div>
              <div>
                <span className="text-gray-500">Floor:</span>
                <span className="ml-2 text-gray-900">Floor 2</span>
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
                    <SelectItem value="p1">P1</SelectItem>
                    <SelectItem value="p2">P2</SelectItem>
                    <SelectItem value="p3">P3</SelectItem>
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
              <Input
                placeholder="Enter name"
                value={updateForm.assignee}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, assignee: e.target.value }))}
              />
            </div>

            {/* Comment Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Comment added</h4>
              <div className="bg-gray-100 p-3 rounded mb-2 text-sm text-gray-700">
                Move below changes
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300"></div>
                ))}
              </div>
            </div>

            <Button onClick={handleUpdate} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Update
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
            <Button
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleAddComment}
            >
              <Paperclip className="h-4 w-4" />
              Add Attachment
            </Button>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="mx-4 mt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity logs</h3>
          <div className="space-y-4">
            {activityLogs.map((log, index) => (
              <div key={index} className={`p-3 rounded ${log.isCreated ? 'bg-red-100' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-gray-900">{log.date}</span>
                  <span className="text-xs text-gray-500">{log.time}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">{log.user}</span>
                  <span className="text-gray-600"> - {log.action}</span>
                </div>
                {log.details && (
                  <div className="text-sm text-gray-600 mt-1">{log.details}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};