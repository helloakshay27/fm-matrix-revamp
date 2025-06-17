
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Help Text');

  const handleBack = () => {
    navigate('/maintenance/task');
  };

  const taskDetails = {
    id: id || '17598329',
    task: 'Test Ladies washroom Checklists',
    associatedWith: 'Service',
    assetServiceName: 'Test Ladies washroom Service',
    assetServiceCode: '66c8b32d5d12d96fd07f',
    assetServiceCode2: '66c8b32d5d12d96fd07f',
    scheduleOn: '17/06/2025, 11:00 PM',
    assignedTo: 'Vinayak Mane',
    taskDuration: 'NA',
    createdOn: '23/01/2023, 02:56 PM',
    createdBy: 'Robert Day2',
    location: 'Site -> Locatled / Building -> Ideal Landmark / Wing -> A / Floor -> NA / Area -> NA / Room -> NA',
    status: 'Open'
  };

  const activities = [
    {
      title: 'Washroom - Ladies Washroom',
      question: 'Is Floor Clean ?',
      type: 'Lift/Lift lobby'
    }
  ];

  const tabs = ['Help Text', 'Activities', 'Input', 'Comments', 'Weightage', 'Rating', 'Score', 'Status', 'Attachments'];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030]">
            <ArrowLeft className="w-4 h-4" />
            <span>Scheduled Task List</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Task Details</h1>
          <div className="flex gap-3">
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Submit Task
            </Button>
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Task Reschedule
            </Button>
          </div>
        </div>
      </div>

      {/* Task Details Section */}
      <Card className="mb-6">
        <CardHeader className="bg-orange-50 border-b">
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">T</div>
            Task Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">ID</label>
                <p className="font-medium">{taskDetails.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Associated With</label>
                <p className="font-medium">{taskDetails.associatedWith}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Asset/Service Code</label>
                <p className="font-medium">{taskDetails.assetServiceCode}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Schedule on</label>
                <p className="font-medium">{taskDetails.scheduleOn}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Task Duration</label>
                <p className="font-medium">{taskDetails.taskDuration}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Created By</label>
                <p className="font-medium">{taskDetails.createdBy}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <Badge className="bg-green-100 text-green-700">{taskDetails.status}</Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Task</label>
                <p className="font-medium">{taskDetails.task}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Asset/Service Name</label>
                <p className="font-medium">{taskDetails.assetServiceName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Asset/Service Code</label>
                <p className="font-medium">{taskDetails.assetServiceCode2}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Assigned to</label>
                <p className="font-medium">{taskDetails.assignedTo}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Created on</label>
                <p className="font-medium">{taskDetails.createdOn}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Location</label>
                <p className="font-medium text-sm">{taskDetails.location}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Section */}
      <Card>
        <CardHeader className="bg-orange-50 border-b">
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">A</div>
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Tab Navigation */}
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'Help Text' && (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium text-gray-800">{activity.title}</h3>
                    <p className="text-gray-600">{activity.question}</p>
                    <p className="text-sm text-gray-500">{activity.type}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Activities' && (
              <div className="space-y-4">
                <p className="text-gray-600">Activity details and progress tracking will be displayed here.</p>
              </div>
            )}

            {activeTab === 'Input' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Input Value</label>
                  <Input placeholder="Enter input value" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <Textarea placeholder="Enter notes or comments" rows={4} />
                </div>
              </div>
            )}

            {activeTab === 'Comments' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                  <Textarea placeholder="Add your comment here" rows={4} />
                </div>
                <Button style={{ backgroundColor: '#C72030' }} className="text-white">
                  Add Comment
                </Button>
              </div>
            )}

            {activeTab === 'Weightage' && (
              <div className="space-y-4">
                <p className="text-gray-600">Task weightage information will be displayed here.</p>
              </div>
            )}

            {activeTab === 'Rating' && (
              <div className="space-y-4">
                <p className="text-gray-600">Rating and evaluation criteria will be displayed here.</p>
              </div>
            )}

            {activeTab === 'Score' && (
              <div className="space-y-4">
                <p className="text-gray-600">Task scoring information will be displayed here.</p>
              </div>
            )}

            {activeTab === 'Status' && (
              <div className="space-y-4">
                <p className="text-gray-600">Task status history and updates will be displayed here.</p>
              </div>
            )}

            {activeTab === 'Attachments' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Attachment</label>
                  <Input type="file" accept="image/*,application/pdf" />
                </div>
                <Button style={{ backgroundColor: '#C72030' }} className="text-white">
                  Upload File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
