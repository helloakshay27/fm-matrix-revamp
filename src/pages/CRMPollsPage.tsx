
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const CRMPollsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const polls = [
    {
      id: 1,
      title: 'Customer Satisfaction Survey',
      description: 'Monthly feedback survey for our services',
      status: 'Active',
      responses: 245,
      createdDate: '2024-01-15',
      endDate: '2024-01-30',
      type: 'Survey'
    },
    {
      id: 2,
      title: 'Product Feature Voting',
      description: 'Vote for the next feature to be developed',
      status: 'Draft',
      responses: 0,
      createdDate: '2024-01-20',
      endDate: '2024-02-15',
      type: 'Poll'
    },
    {
      id: 3,
      title: 'Event Preference Poll',
      description: 'Choose your preferred event timing',
      status: 'Closed',
      responses: 189,
      createdDate: '2024-01-10',
      endDate: '2024-01-25',
      type: 'Poll'
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
    poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poll.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Polls</h1>
          <p className="text-gray-600 mt-1">Manage your polls and surveys</p>
        </div>
        <Button className="bg-[#C72030] hover:bg-[#B01E2A] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Polls</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Polls</p>
              <p className="text-2xl font-semibold text-gray-900">5</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Responses</p>
              <p className="text-2xl font-semibold text-gray-900">1,248</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Rate</p>
              <p className="text-2xl font-semibold text-gray-900">78%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
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

        {/* Polls Table */}
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poll Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolls.map((poll) => (
                <TableRow key={poll.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{poll.title}</p>
                      <p className="text-sm text-gray-500">{poll.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{poll.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(poll.status)}>
                      {poll.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{poll.responses}</TableCell>
                  <TableCell className="text-gray-600">{poll.createdDate}</TableCell>
                  <TableCell className="text-gray-600">{poll.endDate}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CRMPollsPage;
