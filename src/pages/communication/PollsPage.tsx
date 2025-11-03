import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PollOption {
  option: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  title: string;
  createdOn: string;
  startDate: string;
  endDate: string;
  sharedWith: string;
  publishResults: string;
  status: 'Open' | 'Closed';
  options: PollOption[];
}

const PollsPage = () => {
  const navigate = useNavigate();
  
  const [polls] = useState<Poll[]>([
    {
      id: '1',
      title: 'Hbsksk',
      createdOn: '22-04-2025 / 10: 50 AM',
      startDate: '22-04-2025 / 6: 50 AM',
      endDate: '22-04-2025 / 5: 50 AM',
      sharedWith: 'All',
      publishResults: 'Yes',
      status: 'Closed',
      options: [
        { option: 'Jjsjsjs', votes: 0, percentage: 0 },
        { option: 'Njsksj', votes: 0, percentage: 0 },
        { option: 'Jjsjs', votes: 0, percentage: 0 },
        { option: 'Jhsjs', votes: 0, percentage: 0 },
      ],
    },
    {
      id: '2',
      title: 'eytey',
      createdOn: '06-12-2024 / 1: 32 PM',
      startDate: '06-12-2024 / 1: 30 PM',
      endDate: '11-12-2024 / 1: 30 PM',
      sharedWith: 'All',
      publishResults: 'Yes',
      status: 'Closed',
      options: [
        { option: 'A', votes: 0, percentage: 0 },
        { option: 'B', votes: 0, percentage: 0 },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Polls</h1>
          <Button 
            onClick={() => navigate('/communication/polls/add')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Poll
          </Button>
        </div>
      </div>

      {/* Polls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {polls.map((poll) => (
          <div key={poll.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Poll Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-900">{poll.title}</h2>
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <Badge
                    className={`${
                      poll.status === 'Closed'
                        ? 'bg-green-600 hover:bg-green-600'
                        : 'bg-blue-600 hover:bg-blue-600'
                    } text-white`}
                  >
                    {poll.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <p>Created on - {poll.createdOn}</p>
                <p>Start Date & Time - {poll.startDate}</p>
                <p>End Date & Time - {poll.endDate}</p>
                <p>Shared with - {poll.sharedWith}</p>
                <p>Publish Results - {poll.publishResults}</p>
              </div>
            </div>

            {/* Poll Options Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f6f4ee]">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Options
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Votes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {poll.options.map((option, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {option.option}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">
                        {option.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (when no polls) */}
      {polls.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">No polls available. Create your first poll!</p>
        </div>
      )}
    </div>
  );
};

export default PollsPage;
