
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, Upload, Plus } from 'lucide-react';

const masterChecklistData = [
  {
    id: 440,
    activityName: 'qawerty',
    meterCategory: '',
    numberOfQuestions: 1,
    scheduledFor: 'Asset'
  },
  {
    id: 435,
    activityName: 'VI Repair Preparedness Checklist',
    meterCategory: '',
    numberOfQuestions: 5,
    scheduledFor: 'Service'
  },
  {
    id: 394,
    activityName: 'Daily Meeting Room Readiness Checklist',
    meterCategory: '',
    numberOfQuestions: 21,
    scheduledFor: 'Service'
  }
];

export const MasterChecklistDashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadSampleFormat = () => {
    console.log('Downloading sample format...');
  };

  const handleImportQuestions = () => {
    console.log('Importing questions...');
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">MASTER CHECKLIST</h1>

        <div className="flex items-center gap-3 mb-6">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* File Upload Section */}
        <div className="flex gap-4 mb-6">
          <div 
            className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">
                <span className="text-blue-600 underline cursor-pointer">Choose File</span> No file chosen
              </p>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileSelect}
                accept=".xlsx,.xls,.csv"
              />
              <label
                htmlFor="fileInput"
                className="text-blue-600 underline cursor-pointer hover:text-blue-700"
              >
                Browse files
              </label>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleDownloadSampleFormat}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              Download Sample Format
            </Button>
            <Button 
              onClick={handleImportQuestions}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              Import Questions
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Actions</TableHead>
                <TableHead>View</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Activity Name</TableHead>
                <TableHead>Meter Category</TableHead>
                <TableHead>Number Of Questions</TableHead>
                <TableHead>Scheduled For</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {masterChecklistData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                  <TableCell>{item.activityName}</TableCell>
                  <TableCell>{item.meterCategory}</TableCell>
                  <TableCell>{item.numberOfQuestions}</TableCell>
                  <TableCell>{item.scheduledFor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SetupLayout>
  );
};
