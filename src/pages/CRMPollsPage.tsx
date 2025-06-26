
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const CRMPollsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const polls = [
    {
      id: 1,
      title: 'Hshsksk',
      createdDate: '22-06-2022',
      startTime: '06:30 AM',
      endDate: '22-06-2022',
      endTime: '06:30 AM',
      sharedWith: 'Individual',
      publishResults: 'Yes',
      status: 'Closed',
      votes: '0%',
      options: [
        { name: 'Joshi', votes: '0%' },
        { name: 'Shashi', votes: '0%' },
        { name: 'Joshi', votes: '0%' },
        { name: 'Priya', votes: '0%' }
      ]
    },
    {
      id: 2,
      title: 'Eyiey',
      createdDate: '06-12-2024',
      startTime: '3:32 PM',
      endDate: '06-12-2024',
      endTime: '11:30 PM',
      sharedWith: 'All',
      publishResults: 'Yes',
      status: 'Closed',
      votes: 'A',
      options: []
    },
    {
      id: 3,
      title: 'Society event',
      createdDate: '23-09-2024',
      startTime: '6:31 PM',
      endDate: '04-10-2024',
      endTime: '6:31 PM',
      sharedWith: 'All',
      publishResults: 'Yes',
      status: 'Closed',
      votes: '3%',
      options: [
        { name: 'Yes', votes: '3%' },
        { name: 'No', votes: '100%' },
        { name: 'Not Sure', votes: '0%' }
      ]
    },
    {
      id: 4,
      title: 'Test',
      createdDate: '26-08-2024',
      startTime: '7:32 PM',
      endDate: '25-08-2024',
      endTime: '6:34 PM',
      sharedWith: 'Individual',
      publishResults: 'Yes',
      status: 'Closed',
      votes: '100%',
      options: [
        { name: '1', votes: '0%' },
        { name: '2', votes: '0%' },
        { name: '3', votes: '0%' },
        { name: '4', votes: '0%' }
      ]
    },
    {
      id: 5,
      title: 'Vbb',
      createdDate: '25-08-2024',
      startTime: '5:37 PM',
      endDate: '26-08-2024',
      endTime: '6:34 PM',
      sharedWith: 'Individual',
      publishResults: 'Yes',
      status: 'Closed',
      votes: 'Voters',
      options: [
        { name: 'H', votes: '3%' },
        { name: 'Hi', votes: '3%' },
        { name: 'C', votes: '3%' },
        { name: 'S', votes: '2%' }
      ]
    },
    {
      id: 6,
      title: 'Test',
      createdDate: '21-11-2023',
      startTime: '10:29 PM',
      endDate: '21-11-2023',
      endTime: '2:30 PM',
      sharedWith: 'Individual',
      publishResults: 'Yes',
      status: 'Closed',
      votes: 'Voters',
      options: [
        { name: 'Demo', votes: '0%' }
      ]
    },
    {
      id: 7,
      title: 'Demo Subject',
      createdDate: '08-11-2023',
      startTime: '6:30 PM',
      endDate: '08-11-2023',
      endTime: '6:30 PM',
      sharedWith: 'Individual',
      publishResults: 'Yes',
      status: 'Closed',
      votes: 'Voters',
      options: [
        { name: 'Opt 1', votes: '3%' },
        { name: 'Opt 2', votes: '3%' }
      ]
    },
    {
      id: 8,
      title: 'Demo Subject',
      createdDate: '29-09-2023',
      startTime: '3:35 PM',
      endDate: '29-09-2023',
      endTime: '6:02 PM',
      sharedWith: 'Individual',
      publishResults: 'Yes',
      status: 'Closed',
      votes: 'Voters',
      options: [
        { name: 'Option 1 Demo', votes: '3%' },
        { name: 'Option 2 Name', votes: '3%' }
      ]
    },
    {
      id: 9,
      title: 'Demo',
      createdDate: '31-08-2023',
      startTime: '3:34 PM',
      endDate: '30-08-2023',
      endTime: '10:00 AM',
      sharedWith: 'Individual',
      status: 'Closed',
      votes: 'Voters',
      options: [
        { name: 'Option', votes: '0%' }
      ]
    },
    {
      id: 10,
      title: 'Demo',
      createdDate: '29-08-2023',
      startTime: '4:04 PM',
      endDate: '30-08-2023',
      endTime: '6:00 PM',
      sharedWith: 'Individual',
      status: 'Closed',
      votes: 'Voters',
      options: [
        { name: 'Demo Option 1', votes: '0%' }
      ]
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Closed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const filteredPolls = polls.filter(poll =>
    poll.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Polls</h1>
          <p className="text-gray-600 mt-1">Manage your polls and surveys</p>
        </div>
        <Button 
          className="bg-[#C72030] hover:bg-[#B01E2A] text-white"
          onClick={() => navigate('/crm/polls/add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Poll
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">All Polls</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search polls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Polls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPolls.map((poll) => (
            <div key={poll.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              {/* Poll Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{poll.title}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center gap-4">
                      <span>Created on - {poll.createdDate} / {poll.startTime}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Start Date & Time - {poll.createdDate} / {poll.startTime}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>End Date & Time - {poll.endDate} / {poll.endTime}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Shared with - {poll.sharedWith}</span>
                    </div>
                    {poll.publishResults && (
                      <div className="flex items-center gap-4">
                        <span>Publish Results - {poll.publishResults}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Results
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Poll
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Badge variant={getStatusBadgeVariant(poll.status)} className="bg-green-100 text-green-800 border-green-200">
                    {poll.status}
                  </Badge>
                </div>
              </div>

              {/* Poll Options and Votes */}
              <div className="space-y-2">
                <div className="flex justify-between items-center font-medium text-sm">
                  <span>Options</span>
                  <span>Votes</span>
                </div>
                {poll.options.map((option, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{option.name}</span>
                    <span className="text-gray-500">{option.votes}</span>
                  </div>
                ))}
                {poll.options.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-2">
                    No options available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-6 space-x-2">
          <Button variant="outline" size="sm" disabled>1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">4</Button>
          <span className="text-sm text-gray-500">...</span>
          <Button variant="outline" size="sm">Last</Button>
        </div>
      </div>
    </div>
  );
};

export default CRMPollsPage;
